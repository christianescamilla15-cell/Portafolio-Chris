# NexusForge — Análisis por Flujos Funcionales
> Auditoría técnica de las 68 features, organizada en 7 flujos. Evaluación honesta de estado, responsive, y mejoras accionables.
> Fecha: 2026-04-04

---

## RESUMEN EJECUTIVO

| Flow | Features | Grade | Responsive | Bloqueador crítico |
|------|----------|-------|------------|-------------------|
| F1 — Onboarding & Auth | 31–37, 65, 68 | **C** | Parcial | Sin email verification, RBAC no aplicado |
| F2 — Creation | 20, 23, 24, 52 (templates), 53, 62 | **B** | Parcial | Sin deep linking (no URL routing) |
| F3 — Execution | 2, 9, 10, 12, 13, 14, 17, 44, 45 | **B+** | Sí | WebSocket requiere Redis (no en Render) |
| F4 — Monitoring | 38–43, 51, 57, 60–61 | **B** | Parcial | Feedback no persistido, Evaluation es stub |
| F5 — Management | 11, 15–16, 18–19, 21–22, H1–H2 | **C+** | Parcial | ConnectorHub y AuditLog huérfanos hasta hace poco |
| F6 — Intelligence | 5–8, 23–30, 46–47, 58–59 | **B+** | Parcial | RAG requiere pgvector, Swarms lista hardcodeada |
| F7 — Configuration | 6, 33–37, 54, 55 | **C** | Sí | RBAC no enforced, Billing incompleto, Settings minimalista |

---

## FLOW 1: ONBOARDING & AUTH

### Features incluidas
- **31** Register / Login (bcrypt, JWT)
- **32** Google OAuth
- **33** JWT Auth Middleware
- **34** API Keys
- **35** Billing / Stripe (schema ready, code exists)
- **36** RBAC (definido, no aplicado)
- **37** Rate Limiting (plan limits definidos, parcialmente wired)
- **65** Onboarding Tour (5-step overlay, localStorage)
- **68** Auth Gate (pre-app, Login/Register/Guest)

### PROS
- La pantalla de login/register es limpia y funcional — bcrypt + JWT real, no demo.
- Flujo de Guest mode existe (token en localStorage), permite acceso inmediato sin fricción.
- OnboardingTour de 5 pasos con persistencia en localStorage — correctamente implementado, se puede resetear desde Settings.
- El Auth Gate es sólido: todo el routing queda detrás de un `if (!user)` antes de renderizar la app.
- Dark mode funciona en la pantalla de auth (lee `data-theme` del DOM).
- Google OAuth tiene endpoint real (feature #32), lo que reduce la fricción del primer login.

### CONS
- **Sin email verification (M15)**: cualquier email fake puede registrarse. En producción esto es un problema de seguridad básico.
- **RBAC completamente sin aplicar (feature #36 / M7)**: `auth/rbac.py` define roles (admin/owner/member/viewer) pero el decorator nunca se usa en ninguna ruta. Todos los usuarios autenticados tienen los mismos permisos.
- **Sin "Forgot Password"**: no hay ningún flujo de recuperación de contraseña. Si el usuario pierde acceso, no puede recuperarlo.
- **Google OAuth de un solo lado**: el endpoint `/auth/google` existe en backend, pero en el `AuthPage.jsx` no hay botón de "Continuar con Google" — la feature existe pero no está expuesta en UI.
- **Onboarding Tour no contextual**: los 5 pasos son genéricos y no se adaptan al tipo de usuario (nuevo vs que viene de Google OAuth vs guest). No hay personalización.
- **Billing (feature #35)**: el schema de Stripe está en la DB, el código existe, pero `STRIPE_SECRET_KEY` no está configurada y el webhook handler está incompleto (M10). El usuario puede ver opciones de plan pero no puede pagar.
- **Rate limiting parcial (feature #37)**: los límites por plan están definidos pero el middleware no los aplica de manera consistente en todas las rutas.
- **Sin feedback en el campo de contraseña**: no hay indicador de fortaleza de contraseña ni validación en tiempo real en el register form.

### RESPONSIVE?
**Parcial.** La pantalla de auth usa `maxWidth: 420` con `padding: 20` — funciona bien en móvil ya que el card se adapta al viewport. Sin embargo, el OnboardingTour usa posicionamiento absoluto anclado a elementos del DOM que asume sidebar visible; en móvil el tour puede quedar mal posicionado o tapar elementos críticos. No se detectó breakpoint específico en OnboardingTour.

### IMPROVEMENTS
1. **Añadir botón "Continuar con Google"** en `AuthPage.jsx` — el backend ya existe, solo falta un botón que llame a `/auth/google`. Esfuerzo: 1 hora.
2. **Implementar "Forgot Password"** con flow de reset por email (requiere Resend API que ya está integrada). Esfuerzo: 3 horas.
3. **Aplicar RBAC en al menos 3 rutas críticas** (`/automations`, `/rules`, `/audit`) como primer paso antes de producción. Esfuerzo: 2 horas.
4. **Completar Stripe webhook** (M10): conectar `billing_webhook.py` con `STRIPE_SECRET_KEY` y marcar plan en la tabla `user_plans`. Esfuerzo: 3 horas.
5. **Verificación de email en register**: enviar OTP o link por Resend antes de activar cuenta. Esfuerzo: 2 horas.

### FLOW GRADE: **C**
Auth básico funciona, pero faltan tres piezas fundamentales para producción: verificación de email, RBAC aplicado, y recuperación de contraseña. El billing es un stub visual.

---

## FLOW 2: CREATION

### Features incluidas
- **20** Templates Library (GET /templates, POST deploy)
- **23** AI Wizard generate (POST /wizard/generate)
- **24** AI Wizard chat (POST /wizard/chat, SSE streaming)
- **52** Automations Page — Templates tab
- **53** WizardPage (5 steps: Describe → Input → Output → Preview → Publish)
- **62** Visual DAG Builder (drag nodes, draw edges, SVG canvas)

### PROS
- El AI Wizard es el punto más fuerte de todo el producto. Flujo de 5 pasos (Describe → Input → Output → Preview → Publish) es claro, guiado, y termina creando un workflow + automation real en la DB en un solo CTA.
- **SSE streaming en el chat** (feature #24): el wizard usa Server-Sent Events para streaming de respuestas, lo que da sensación de velocidad y modernidad.
- **Quick-type selection**: 5 tipos predefinidos (Ticket, Document, Email, Report, Custom) con defaults inteligentes de input/output. Reduce la fricción de decisión para usuarios nuevos.
- **Templates one-click deploy** (feature #20): `POST /templates/{slug}/deploy` crea workflow + automation + rules en una sola llamada. Muy bien implementado.
- **Wizard → Builder navigation**: después de generar, el usuario puede ir directamente al Visual DAG Builder para customizar. La transición está implementada (`onNavigateToBuilder`).
- **Pipeline preview visual**: el step 3 del wizard muestra el DAG generado con agentes como nodos coloreados antes de publicar — da confianza al usuario.

### CONS
- **Sin URL-based routing (M9)**: si el usuario está en el wizard en step 3 y refresca, vuelve al dashboard. No hay deep linking. Esto es un problema grave de UX — el estado del wizard vive solo en React state, no en URL.
- **Error recovery en wizard nulo**: si `/wizard/generate` falla (timeout, LLM error), el usuario ve un mensaje genérico y tiene que empezar desde step 0. No hay retry parcial ni guardar borrador.
- **Validación de descripción mínima**: se puede publicar un wizard con 3 caracteres de descripción. No hay mínimo de calidad ni sugerencias de mejora antes de llamar al LLM.
- **Templates hardcodeadas en frontend**: la `TemplatesLibrary` muestra templates con data parcialmente hardcodeada. Si el backend devuelve 0 templates, la UI puede quedar vacía sin fallback educativo.
- **Visual DAG Builder (feature #62) desconectado del wizard**: el builder permite crear/editar DAGs visualmente pero no guarda el resultado de vuelta al workflow automáticamente en todos los flujos — se puede perder trabajo si se navega sin guardar explícitamente.
- **Sin validación de output destinations**: el usuario puede seleccionar "Email" como destino pero si no tiene credenciales de Resend configuradas, la automation publicará y fallará silenciosamente en ejecución.
- **Sin versioning de workflows**: crear una segunda versión de un workflow existente sobreescribe el anterior. No hay historial de versiones.

### RESPONSIVE?
**Parcial.** El WizardPage tiene buena adaptación en los primeros pasos (cards de quick-type usan `flexWrap`). Sin embargo, el step 3 (Preview con pipeline visual y lista de agentes) y el DAG Builder (`WorkflowBuilderPage`) son inherentemente desktop-first — el canvas SVG de arrastrar nodos no funciona bien en touch y no tiene fallback móvil. En pantallas < 480px el preview puede quedar comprimido.

### IMPROVEMENTS
1. **Guardar estado del wizard en localStorage** (o URL params) para permitir "continuar donde lo dejaste" y sobrevivir refrescos. Esfuerzo: 2 horas.
2. **Retry con feedback claro en `/wizard/generate`**: si el LLM falla, ofrecer "Intentar de nuevo" sin resetear los steps anteriores. Esfuerzo: 1 hora.
3. **Validación de prerequisitos antes de publicar**: al seleccionar "Email" como output, verificar si hay `RESEND_API_KEY` configurada (via `/health`). Mostrar warning antes de publicar. Esfuerzo: 2 horas.
4. **Wizard móvil optimizado para steps 1-4**: hacer el pipeline preview en modo lista en lugar de diagrama SVG en viewports < 600px. Esfuerzo: 3 horas.
5. **Templates populares con contador de deploys**: mostrar cuántas veces se ha deployado cada template — da prueba social y ayuda a elegir. Esfuerzo: 1 hora (agregar campo a la tabla de templates).

### FLOW GRADE: **B**
El wizard es genuinamente bueno y diferenciador. Lo baja a B (no A) por la ausencia de persistencia de estado, error recovery pobre, y el DAG Builder como isla no responsive.

---

## FLOW 3: EXECUTION

### Features incluidas
- **2** DAG Executor (POST /executions)
- **9** Checkpoints (resume on failure)
- **10** State Machine (pending → running → completed)
- **12** Run Automation (POST /automations/{id}/run)
- **13** Webhook Trigger (POST /automations/webhook/{secret})
- **14** Schedule Trigger (background scheduler, cron limitado)
- **17** HITL Approvals (GET/POST pending-approvals)
- **44** Self-Healing (healer)
- **45** Circuit Breaker (wired)

### PROS
- **DAG Executor real**: camina el grafo en orden topológico, ejecuta agentes en paralelo donde las dependencias lo permiten. No es un mock — es un motor real con `asyncio`.
- **State Machine completo** (feature #10): `pending → running → completed/failed` con persistencia en DB. Si el servidor reinicia, el estado no se pierde.
- **Self-Healing + Circuit Breaker** (features #44, #45): el healer intenta reparar resultados fallidos, el circuit breaker previene cascadas. Ambos están ahora correctamente wired al executor.
- **HITL Approvals** (feature #17): el flujo de aprobación humana es funcional — `pending_approval` en la tabla de results, botones en Dashboard principal. Es una feature diferenciadora para workflows que requieren supervisión.
- **Webhook trigger con HMAC signing** (feature #13): el secret es único por automation y las requests están firmadas — no es un webhook naive.
- **Checkpoints** (feature #9): el executor puede reanudar desde el último checkpoint en caso de fallo, en lugar de reiniciar desde cero.

### CONS
- **WebSocket (feature #3) no funciona en producción**: el live-tracking de ejecuciones requiere Redis (`WS /executions/ws/{run_id}`), pero Redis no está configurado en Render. La UI hace HTTP polling como fallback, lo que es significativamente peor en UX para runs largos.
- **Cron parser limitado (M8)**: el scheduler solo soporta `*/N` (cada N minutos) y `0 H * * *` (a cierta hora). Expresiones como "lunes y miércoles a las 9am" o "último día del mes" no funcionan. Esto limita seriamente los casos de uso de SMBs.
- **Zombie cleanup manual (feature #4)**: limpiar runs atascados en "running" requiere llamar manualmente a `POST /executions/cleanup-zombies`. Debería ser un cron job automático.
- **Dead letter re-execution incompleto (M11)**: cuando un run falla y va a dead letter, solo se marca el flag en DB — no hay lógica para re-ejecutarlo automáticamente después de X tiempo o manualmente desde la UI.
- **Sin timeout global configurable por automation**: si un agente en el DAG se cuelga, no hay timeout definido por el usuario. Solo hay el timeout global del servidor.
- **Run Input Modal**: cuando el trigger es `manual`, se muestra un `RunInputModal` para capturar datos. Si el workflow tiene muchos campos requeridos, el modal no valida tipos de dato ni muestra hints del schema esperado.

### RESPONSIVE?
**Sí (mayormente).** La ejecución es backend-driven, y las UIs de resultado (pending approvals en Dashboard, execution list) tienen responsive básico. El botón "Run" en las AutomationCards funciona bien en móvil. El `RunInputModal` puede ser problemático en pantallas muy pequeñas si tiene muchos campos, pero en los casos comunes (text input) funciona.

### IMPROVEMENTS
1. **Configurar Redis en Render con Upstash** (M1): 5 minutos de configuración, habilita WebSocket live-tracking que es una feature ya implementada. Mayor ROI de todo el backlog.
2. **Reemplazar cron parser con `croniter`** (M8): soporte completo de expresiones cron, exponer selector visual en UI (días de la semana + hora). Esfuerzo: 1 hora.
3. **Zombie cleanup automático**: convertir `cleanup-zombies` en un APScheduler job que corra cada 5 minutos. Esfuerzo: 30 minutos.
4. **Dead letter UI**: agregar botón "Reintentar" en ExecutionDetailPage para runs en estado `failed` — llama a `/automations/{id}/run` con los mismos inputs. Esfuerzo: 2 horas.
5. **Timeout configurable por automation**: agregar campo `timeout_seconds` en el schema de automation, pasar al executor. Default: 300s. Esfuerzo: 2 horas.

### FLOW GRADE: **B+**
El motor de ejecución es técnicamente sólido — DAG real, state machine, self-healing, circuit breaker, HITL. Lo baja de A la ausencia de WebSocket en producción y el cron parser incompleto que limita casos de uso reales.

---

## FLOW 4: MONITORING

### Features incluidas
- **38** Health Check (GET /health — DB + Redis + agents + circuit breaker)
- **39** Metrics Summary (GET /metrics/summary)
- **40** Reliability Health (GET /runs/reliability/health — dashboard KPIs)
- **41** Run Timeline (GET /runs/{id}/timeline)
- **42** Feedback Loop (POST/GET /feedback — in-memory)
- **43** Evaluation Framework (POST /evaluation/run — stub)
- **51** Dashboard Page (KPIs, recent runs, agent activity, Try AI Now, Pending Approvals)
- **57** Execution List Page
- **60** Smart Dashboard (auto-detect type → typed dashboard)
- **61** 5 Typed Dashboards (Ticket/Document/Email/Report/Generic)

### PROS
- **Dashboard principal bien diseñado**: KPIs reales (total runs, success rate, agents tracked, failed runs) desde `/runs/reliability/health`. No son números hardcodeados.
- **Smart Dashboard auto-detection** (feature #60): `detectAutomationType()` analiza los steps del DAG para elegir el dashboard apropiado entre 5 tipos. Es una feature genuinamente inteligente que elimina configuración manual.
- **5 dashboards tipados** (feature #61): cada tipo (Ticket, Document, Email, Report, Generic) tiene su propia visualización de resultados adaptada al caso de uso. Esto es diferenciador.
- **"Try AI Now"** en el Dashboard (feature #29): el demo endpoint con rate limiting permite que usuarios nuevos vean valor inmediatamente sin necesidad de crear nada. Es el mejor onboarding call-to-action posible.
- **Pending Approvals en el Dashboard**: el banner de HITL aparece solo cuando hay aprobaciones pendientes (no contamina la UI cuando está vacío). Bien implementado.
- **Empty state educativo**: cuando no hay datos, el Dashboard muestra CTA claros hacia el wizard y templates, con 4 quick-select cards de casos de uso.
- **AgentActivity component**: barra de actividad por agente con colores únicos — da contexto de qué agentes se usan más.

### CONS
- **Feedback Loop no persistido (feature #42 / M6)**: los ratings y feedback que los usuarios dan se guardan en memoria (dict de Python). Al reiniciar el servidor de Render (lo cual ocurre automáticamente), se pierden todos. Esto hace que la feature sea decorativa.
- **Evaluation Framework es stub (feature #43)**: `POST /evaluation/run` existe pero `run_evaluation()` solo hace bookkeeping — no ejecuta ningún workflow real para evaluar. Completamente no funcional.
- **OpenTelemetry solo a console (feature #49)**: las trazas van a stdout, no a ningún backend de observabilidad (Grafana, Jaeger, Datadog). En producción esto significa que no hay búsqueda de trazas históricas.
- **KPI labels mixtos en inglés/español**: en `DashboardPage.jsx` las labels de los KPICards están hardcodeadas en español ("Ejecuciones Totales", "Tasa de Exito") independientemente del `lang` prop. El resto de la UI es bilingüe.
- **Run Timeline (feature #41)** no tiene visualización: el endpoint existe y devuelve datos, pero no hay componente React que muestre la timeline de un run paso a paso con tiempos. Solo existe el `ExecutionDetailPage` que muestra pasos en lista sin visualización temporal.
- **Dashboard no tiene refresh automático**: los KPIs son snapshot del momento del mount. Si hay una ejecución en curso, el usuario debe recargar manualmente para ver el resultado.
- **Cost/Token Dashboard (feature #39)** no está en el sidebar principal: `CostTokenDashboard` existe como página (`/cost-metrics`) pero no tiene entrada en navegación. Es una feature oculta.

### RESPONSIVE?
**Parcial.** El Dashboard principal tiene responsive cuidado: el grid de KPIs usa `minmax(200px, 1fr)`, el layout de dos columnas colapsa a una columna en móvil (`isMobile ? '1fr' : '1fr 380px'`), y el Try It Now section cambia de row a column. Sin embargo, los 5 dashboards tipados (Ticket, Document, Email, etc.) no tienen evidencia de breakpoints propios — probablemente sean desktop-first ya que contienen tablas y charts.

### IMPROVEMENTS
1. **Persistir Feedback a DB** (M6): crear tabla `feedback` en una migración adicional, reemplazar el dict en memoria. Esfuerzo: 2 horas. Sin esto la feature de ratings no tiene valor.
2. **Agregar refresh automático al Dashboard**: un `setInterval` de 30s en el `useEffect` del dashboard que re-fetch `/runs/reliability/health`. Con indicador visual de "actualizado hace X segundos". Esfuerzo: 1 hora.
3. **Internacionalizar KPI labels**: usar el sistema de `t()` ya existente en lugar de strings hardcodeados en español. Esfuerzo: 30 minutos.
4. **Agregar Cost/Token Dashboard al sidebar** en la sección Advanced. Es una feature completa que nadie va a encontrar si no está en nav. Esfuerzo: 5 minutos.
5. **Run Timeline visual**: implementar un componente de timeline horizontal (stepper) que muestre cada agente ejecutado con su duración y estado. El endpoint `/runs/{id}/timeline` ya devuelve los datos. Esfuerzo: 3 horas.

### FLOW GRADE: **B**
El dashboard principal es sólido y el Smart Dashboard es genuinamente diferenciador. Lo baja a B el feedback no persistido (feature decorativa), el evaluation stub, y la falta de refresh automático que rompe la UX de monitoreo en tiempo real.

---

## FLOW 5: MANAGEMENT

### Features incluidas
- **11** CRUD Automations (full lifecycle)
- **15** Automation Dashboard stats (GET /automations/{id}/dashboard)
- **16** Results CRUD (GET/POST/DELETE /results — persistent output)
- **17** HITL Approvals
- **18** Rules Engine (POST/GET/PUT/DELETE /rules, evaluate)
- **19** Connectors (CRUD + test/fetch/push)
- **21** Variables (`{{var}}` interpolation)
- **22** Audit Log (GET /audit, export)
- **H1** ConnectorHubPage (huérfana — route existe ahora en App.jsx)
- **H2** AuditLog (huérfana — route existe ahora en App.jsx)

### PROS
- **CRUD de Automations completo** (feature #11): el ciclo de vida completo está implementado — crear, listar, actualizar, eliminar, y el soft-delete (despublicar) está en la UI con el menú kebab de cada AutomationCard.
- **Rules Engine real** (feature #18): condiciones + acciones configurables desde UI (`RulesPanel` en Settings). La evaluación es real (`/rules/evaluate`), no hardcodeada.
- **Variables con interpolación `{{var}}`** (feature #21): permite parametrizar automations sin cambiar el código. El `VariablesPanel` en Settings está implementado.
- **ConnectorHub ahora accesible**: `ConnectorHubPage` tenía route en App.jsx antes como huérfana, ahora aparece en la sección Advanced del sidebar. El backend de connectors (CRUD + test + fetch + push) es completo.
- **AuditLog con export**: `GET /audit/export` permite descargar el log completo. Para compliance esto es importante y está implementado.
- **AutomationCard menú contextual**: run, dashboard, despublicar — todo en un dropdown bien posicionado con z-index correcto.

### CONS
- **ConnectorHub depende de un registry externo**: los connectors son opcionales y dependen de un `connector_registry` que no está bien documentado. Un usuario nuevo no sabe qué connectors puede crear ni qué hace cada tipo.
- **AuditLog sin filtros en UI**: el endpoint acepta `start_date`/`end_date`/`entity_type`, pero el componente `AuditLog.jsx` no expone estos filtros — carga todo sin paginación ni búsqueda. Para cuentas con muchas operaciones esto se vuelve lento.
- **Rules Engine UI es avanzada**: el `RulesPanel` requiere que el usuario entienda la estructura de condiciones/acciones. No hay examples ni templates de reglas comunes. Curva de aprendizaje alta.
- **Variables no visibles en el wizard**: cuando se crea una automation en el wizard, no se muestra qué variables del workflow son configurables. El usuario tiene que ir a Settings → Variables a descubrirlo por su cuenta.
- **Sin paginación en Automations list**: si un usuario tiene 50+ automations, todas se cargan en una sola request. No hay paginación ni búsqueda/filtrado en la UI.
- **Results sin UI de exploración**: el endpoint `/results` devuelve todos los resultados, pero no hay una página dedicada de "Resultados" en el sidebar. Los resultados solo se ven en los typed dashboards de cada automation. Buscar un resultado específico de una semana atrás es imposible sin la API directamente.
- **Automation "edit" no implementado**: el menú de la AutomationCard tiene "Despublicar" pero no "Editar". Para cambiar el nombre, descripción, o trigger de una automation existente, el usuario tiene que despublicarla y crear una nueva.

### RESPONSIVE?
**Parcial.** El grid de AutomationCards usa CSS responsive bien. Sin embargo, el `ConnectorHubPage` y `AuditLog` son páginas nuevas cuyo responsive no se pudo verificar en detalle — y dado el patrón de otras páginas avanzadas, probablemente sean desktop-first con tablas que desborden en móvil.

### IMPROVEMENTS
1. **Paginación + búsqueda en AutomationsPage**: agregar un input de búsqueda por nombre y paginación de 12 items. El endpoint acepta `limit`/`offset`. Esfuerzo: 2 horas.
2. **Editar automation inline**: agregar opción "Editar" en el menú kebab que abra un modal para cambiar nombre, descripción, trigger_type, e icon. Esfuerzo: 3 horas.
3. **Filtros en AuditLog**: agregar dropdowns de entity_type y date range picker que pasen params al endpoint. Esfuerzo: 2 horas.
4. **Templates de Rules comunes**: incluir 5 templates predefinidos de reglas (ej: "si urgencia = alta → enviar Slack") en el RulesPanel. Reduce la curva de aprendizaje. Esfuerzo: 2 horas.
5. **Variables visibles en wizard step 4 (Preview)**: mostrar las variables del workflow generado en el step de preview, con opción de establecer valores default. Esfuerzo: 2 horas.

### FLOW GRADE: **C+**
La infraestructura de gestión está bien construida en backend. La UI tiene gaps importantes: sin paginación, sin edit de automations, AuditLog sin filtros, y la experiencia de connectors/variables requiere demasiado contexto técnico para usuarios no-desarrolladores.

---

## FLOW 6: INTELLIGENCE

### Features incluidas
- **5** Agent Registry (GET /agents, GET /agents/blocks)
- **6** Agent Config per-user (GET/PUT /agents/{type}/config)
- **7** Custom Agents (CRUD + Execute, max 10/cuenta)
- **8** Swarm Execute (POST /swarms/execute — 6 topologías)
- **23** AI Wizard generate
- **24** AI Wizard chat (SSE)
- **25** Document Analyze (POST /analyze, /analyze/text)
- **26** Enterprise Ops (8-agent pipeline)
- **27** Document Intelligence (classify → extract → validate → summarize)
- **28** Portfolio Copilot (portfolio Q&A)
- **29** Demo Endpoint (rate limited, sin auth)
- **30** Drive Pipeline (Drive → Intelligence → Notion)
- **46** LLM Router (Groq → Claude fallback)
- **47** RAG Pipeline (pgvector)
- **58** Agents Page (list + config + memory stats)
- **59** Swarms Page (6 topologías, lista hardcodeada)

### PROS
- **24 agentes reales (todos superagents)**: no son wrappers thin de LLM — cada agente tiene lógica propia (Pydantic validation, fallbacks, prompts especializados). El `AgentRegistry` permite introspección completa.
- **LLM Router Groq → Claude** (feature #46): failover automático entre proveedores. Si Groq falla o excede rate limit, rota a Claude. Esto es resiliencia real, no teórica.
- **6 topologías de swarm** (feature #8): Sequential, Parallel, Hierarchical, Consensus, Pipeline, Adaptive. Cada una tiene semántica propia — no es marketing.
- **RAG Pipeline con pgvector** (feature #47): búsqueda semántica real sobre documentos. Si pgvector está configurado en Postgres, el pipeline funciona end-to-end.
- **Document Intelligence pipeline** (feature #27): 4 pasos (classify → extract → validate → summarize) con agentes especializados. Es el caso de uso más completo y demo-able de todo el sistema.
- **Demo endpoint con rate limiting** (feature #29): permite probar sin auth. Es un lead magnet técnico excelente.
- **Custom Agents** (feature #7): los usuarios pueden crear sus propios agentes con prompts custom, hasta 10 por cuenta. Feature diferenciadora para power users.
- **SSE streaming en wizard chat** (feature #24): respuestas en tiempo real, no polling. Mejor percepción de velocidad.

### CONS
- **Swarms lista hardcodeada en frontend** (feature #59): `SwarmListPage` muestra las 6 topologías con datos fijos en el componente, no desde el backend. Si se agrega una topología nueva, hay que actualizar el frontend manualmente.
- **AnalyzePage huérfana / semioculta**: `features/analyze/AnalyzePage.jsx` tiene route en App.jsx (`analyze`) y aparece en sidebar Advanced, pero la feature no está en el flujo principal. El usuario no sabe cuándo usar "Analyze" vs "Wizard" vs "Document Intelligence".
- **Enterprise Ops y Document Intelligence sin UI propia**: features #26 y #27 tienen endpoints completos pero no tienen páginas dedicadas en el frontend — solo son accesibles via el `AnalyzePage` genérico o directamente por API. Son las features más poderosas y las más invisibles.
- **RAG requiere pgvector habilitado**: si la instancia de PostgreSQL en Render no tiene la extensión `vector`, el RAG pipeline falla silenciosamente. No hay advertencia en UI ni fallback a búsqueda full-text.
- **Portfolio Copilot** (feature #28): endpoint real pero propósito confuso para el usuario final. No está claro desde la UI qué hace ni cuándo usarlo. Parece una feature de portfolio personal de Christian mezclada con el SaaS.
- **Agents Page config**: el `AgentDetailPanel` permite editar la config de un agente (temperature, max_tokens, system prompt) pero los cambios no tienen "preview" ni "test" — el usuario no puede validar si su config produce mejores resultados antes de guardar.
- **Memory Panel** muestra stats de memoria de agentes (tokens usados, entries) pero no permite limpiar o inspeccionar el contenido de la memoria. Solo lectura.

### RESPONSIVE?
**Parcial.** La `AgentListPage` probablemente usa un grid de cards que adapta bien. La `SwarmListPage` con sus 6 topologías visuales probablemente sea aceptable en tablet pero estrecha en móvil. Las features de inteligencia más complejas (Enterprise Ops, Document Intelligence, Drive Pipeline) no tienen UI frontend propia, así que el responsive no aplica directamente — pero su ausencia en UI es el problema principal.

### IMPROVEMENTS
1. **Crear página "Intelligence Hub"**: agrupar Enterprise Ops, Document Intelligence, Drive Pipeline y Analyze en una sola página con tabs. Cada tab con su propio form de input y display de resultados. Esfuerzo: 4 horas. Esto hace visibles las features más poderosas.
2. **Swarms desde backend**: reemplazar la lista hardcodeada en `SwarmListPage` con datos de un endpoint `/swarms/topologies`. Esfuerzo: 1 hora.
3. **"Probar config" en AgentDetailPanel**: añadir un textarea de test input y botón "Run test" que llame al agente con la config actual y muestre el output. Esfuerzo: 2 horas.
4. **Verificar pgvector disponible en health check UI**: en la página de Settings o en el banner de health, mostrar si pgvector está habilitado y RAG está operativo. Esfuerzo: 30 minutos.
5. **Eliminar o reubicar Portfolio Copilot**: moverla a un contexto de "Demo" o renombrarla a "Knowledge Base Q&A" con descripción clara. Actualmente confunde más que ayuda. Esfuerzo: 30 minutos.

### FLOW GRADE: **B+**
El backend de inteligencia es el punto más técnicamente impresionante del proyecto — 24 agentes reales, LLM router, RAG, 6 swarms, 4 pipelines de caso de uso. Lo baja de A la invisibilidad de las features más poderosas en el frontend: Enterprise Ops y Document Intelligence no tienen UI propia, y los swarms están hardcodeados.

---

## FLOW 7: CONFIGURATION

### Features incluidas
- **6** Agent Config per-user (GET/PUT /agents/{type}/config)
- **33** JWT Auth Middleware
- **34** API Keys (POST/GET/DELETE /api-keys)
- **35** Billing / Stripe
- **36** RBAC (sin aplicar)
- **37** Rate Limiting (parcial)
- **54** Integration Manager Page (providers + services)
- **55** Settings Page (API URL, theme, language, tour reset)

### PROS
- **Settings Page funcional para lo que cubre**: configurar la URL del backend (útil para dev/staging/prod), toggle de tema dark/light con persistencia en localStorage, toggle de idioma ES/EN, y reset del onboarding tour. Cada una es funcional.
- **Health check en Settings**: botón "Test Connection" que llama a `/health` y muestra estado real del sistema (DB, Redis, agentes, circuit breaker). Muy útil para debugging.
- **Integration Manager** (feature #54): página completa con providers y services, permite conectar y desconectar integraciones externas (Email, Slack, Notion, WhatsApp, Drive). Está conectada al backend.
- **API Keys** (feature #34): los usuarios pueden generar API keys como alternativa al JWT token — útil para integraciones programáticas y CI/CD.
- **Dark mode completo**: el tema se propaga via `data-theme` attribute en `<html>`, y los componentes leen `isDark` para adaptar colores. Cobertura amplia.
- **Persistencia de preferencias**: tema, idioma, sidebar collapsed state, advanced section state — todo en localStorage. Sobrevive refrescos.

### CONS
- **Settings Page es minimalista**: solo cubre 4 configuraciones. Falta completamente: perfil de usuario (cambiar nombre/email/password), notificaciones, gestión de plan/billing, límites de rate limiting actuales, y gestión de miembros del equipo (RBAC).
- **RBAC no aplicado en ningún flujo** (feature #36 / M7): los roles están en el schema pero ninguna ruta los verifica. Cualquier usuario autenticado puede hacer cualquier cosa — borrar las automations de otro usuario si conoce el ID, por ejemplo (no hay ownership check consistente).
- **Billing totalmente placeholder** (feature #35): la UI de plan/pricing no existe en Settings. El usuario no puede ver su plan actual, sus límites, ni hacer upgrade. El schema de Stripe está listo pero desconectado.
- **API keys en texto plano (M2)**: `user_provider_keys` almacena las API keys de terceros (Slack, Notion, Resend) en texto plano en PostgreSQL. Debería estar encriptado con Fernet o similar.
- **CORS abierto en producción (M3)**: `allow_origins=["*"]` — cualquier dominio puede hacer requests a la API. Debe restringirse al dominio de producción de Vercel antes de ir live.
- **DEBUG=true posiblemente en prod (M4)**: si `DEBUG=True` en el `.env` de Render, los stack traces de Python se exponen en las respuestas de error 500. Un atacante puede extraer información del sistema.
- **Integration Manager sin validación de credenciales en tiempo real**: el usuario puede ingresar un token de Slack incorrecto y guardarlo sin que se valide. La integración fallará silenciosamente en la primera ejecución.
- **Sin gestión de sessiones activas**: el usuario no puede ver ni revocar tokens JWT activos. Una vez que el token se emite, no hay forma de invalidarlo (sin blacklist en Redis, que no está configurado).

### RESPONSIVE?
**Sí.** La `SettingsPage` usa `maxWidth: 640` con layout de columna vertical — funciona bien en cualquier tamaño de pantalla. La `IntegrationManagerPage` probablemente también sea razonablemente responsive dado que las integraciones se listan en cards. Es el flow con mejor responsive relativo a su complejidad.

### IMPROVEMENTS
1. **Arreglar los 4 security gaps críticos antes de producción** (M2-M4, M2): CORS restrictivo (5 min), DEBUG=false (1 min), encriptar API keys con Fernet (2 hrs), configurar Redis para JWT blacklist (30 min). Sin esto el app no debe estar en producción.
2. **Expandir Settings con sección "Cuenta"**: cambiar nombre, email y password. Conectar a endpoints `/users/me` PUT que ya debe existir o crearse. Esfuerzo: 3 horas.
3. **Validar credenciales de integraciones al guardar**: al ingresar un token de Slack, hacer un request de prueba inmediato y mostrar ✓ o error antes de guardar. Esfuerzo: 2 horas.
4. **Página de Billing en Settings**: mostrar plan actual, límites de uso (automations, runs/mes, agentes), y botón de upgrade conectado a Stripe Checkout. Esfuerzo: 4 horas.
5. **Aplicar RBAC en rutas críticas**: aunque sea como primera iteración, verificar `owner_id` en los endpoints de DELETE de automations, workflows y rules. Esfuerzo: 2 horas.

### FLOW GRADE: **C**
Settings funciona para lo que hace, pero lo que hace es insuficiente para un SaaS en producción. Los 4 security gaps (CORS, DEBUG, API keys en plano, RBAC nulo) son bloqueadores reales de go-live.

---

## ANÁLISIS TRANSVERSAL

### Responsive — Estado General
| Nivel | Componentes |
|-------|-------------|
| **Bien responsive** | AuthPage, DashboardPage, SettingsPage, AutomationCards, OnboardingTour |
| **Responsive parcial** | WizardPage (steps 1-3 ok, step 3 preview comprimido), AgentListPage, SmartDashboard |
| **Problemas en móvil** | WorkflowBuilderPage (DAG canvas SVG no touch), ExecutionDetailPage, ConnectorHubPage, AuditLog |
| **Sin datos suficientes** | DocumentDashboard, TicketDashboard, EmailDashboard, ReportDashboard |

**Problema sistémico**: La app usa `window.innerWidth <= 768` con un `useEffect` + `resize` listener para detectar móvil — esto es correcto pero requiere que cada página implemente su propio listener. No hay sistema centralizado de breakpoints (no usa Tailwind, no usa CSS Grid con media queries, no hay Context de viewport). Esto lleva a inconsistencia: algunas páginas son responsive y otras no, dependiendo de si el desarrollador acordó implementar el `isMobile` check.

### Sin URL-based Routing — El Mayor UX Debt
El routing de toda la app es state-based (`useState('dashboard')`). Esto significa:
- No hay deep links — no se puede compartir un link a una automation específica
- Refrescar la página siempre va al Dashboard
- El botón "Atrás" del navegador no funciona como el usuario espera
- No hay soporte para múltiples tabs del mismo usuario

Este es el gap técnico de mayor impacto en UX y debe ser el siguiente paso en la hoja de ruta de frontend.

### Deuda Técnica Acumulada (Ranking por Urgencia)
| # | Gap | Flow | Urgencia | Esfuerzo |
|---|-----|------|----------|---------|
| 1 | CORS abierto en producción | F7 | 🔴 Crítica | 5 min |
| 2 | DEBUG=true en prod | F7 | 🔴 Crítica | 1 min |
| 3 | Redis en Render (Upstash) | F3 | 🔴 Crítica | 5 min |
| 4 | API keys en texto plano | F7 | 🔴 Alta | 2 hrs |
| 5 | URL-based routing | F2 | 🟡 Alta | 4 hrs |
| 6 | RBAC enforcement mínimo | F1/F7 | 🟡 Alta | 2 hrs |
| 7 | Email verification | F1 | 🟡 Alta | 2 hrs |
| 8 | Feedback persistido a DB | F4 | 🟡 Media | 2 hrs |
| 9 | Cron parser completo | F3 | 🟡 Media | 1 hr |
| 10 | Intelligence Hub page | F6 | 🟡 Media | 4 hrs |

---

## PLAN DE ACCIÓN SUGERIDO (3 Sprints)

### Sprint 1 — Security & Stability (1 día)
- CORS restrictivo al dominio de Vercel
- DEBUG=false en Render
- Redis con Upstash (habilita WebSocket real)
- Zombie cleanup como cron automático

### Sprint 2 — UX Completeness (2-3 días)
- URL-based routing con React Router
- Email verification en register
- Refresh automático en Dashboard
- Paginación y búsqueda en Automations
- Internacionalizar KPI labels

### Sprint 3 — Feature Visibility (2-3 días)
- Intelligence Hub page (Enterprise Ops + Doc Intelligence + Analyze unificados)
- Billing básico en Settings (plan actual + límites)
- Validación de credenciales de integraciones al guardar
- Run Timeline visual en ExecutionDetailPage
