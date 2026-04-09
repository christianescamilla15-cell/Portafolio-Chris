# NexusForge — Auditoría Completa de Features

> Mapeo exhaustivo de todas las features implementadas, su estado, conexión al flujo, y nivel de importancia.

---

## Resumen Ejecutivo

| Categoría | Features Activas | Features Huérfanas | Features Stub/Demo |
|-----------|-----------------|--------------------|--------------------|
| **Backend Core** | 14 | 0 | 2 |
| **Frontend Pages** | 10 | 3 | 1 |
| **Agents** | 24 | 0 | 0 |
| **Swarm Topologies** | 6 | 0 | 0 |
| **Integrations** | 8 | 0 | 0 |
| **Infrastructure** | 6 | 2 | 1 |
| **TOTAL** | **68** | **5** | **4** |

---

## A. BACKEND — Features por Módulo

### A1. Core (Workflows + Executions)

| # | Feature | Endpoints | Estado | Importancia | Conectada al flujo |
|---|---------|-----------|--------|-------------|-------------------|
| 1 | **CRUD Workflows** | `POST/GET/PUT/DELETE /workflows` | ✅ Real | 🔴 Crítica | Sí — base de todo |
| 2 | **DAG Executor** | `POST /executions` | ✅ Real | 🔴 Crítica | Sí — motor de ejecución |
| 3 | **WebSocket Live** | `WS /executions/ws/{run_id}` | ✅ Real (requiere Redis) | 🟡 Media | Parcial — Redis no en Render |
| 4 | **Zombie Cleanup** | `POST /executions/cleanup-zombies` | ✅ Real | 🟡 Media | Sí — mantenimiento |
| 5 | **Agent Registry** | `GET /agents`, `GET /agents/blocks` | ✅ Real | 🔴 Crítica | Sí — wizard + builder |
| 6 | **Agent Config per-user** | `GET/PUT /agents/{type}/config` | ✅ Real | 🟡 Media | Sí — personalización |
| 7 | **Custom Agents** | `POST/GET/DELETE/Execute /custom-agents` | ✅ Real | 🟡 Media | Sí — max 10/cuenta |
| 8 | **Swarm Execute** | `POST /swarms/execute` | ✅ Real | 🟡 Media | Sí — 6 topologías |
| 9 | **Checkpoints** | Engine interno | ✅ Real | 🟢 Baja | Sí — resume on failure |
| 10 | **State Machine** | Engine interno | ✅ Real | 🔴 Crítica | Sí — pending→running→completed |

### A2. Automations (Motor de Producción)

| # | Feature | Endpoints | Estado | Importancia | Conectada al flujo |
|---|---------|-----------|--------|-------------|-------------------|
| 11 | **CRUD Automations** | `POST/GET/PUT/DELETE /automations` | ✅ Real | 🔴 Crítica | Sí — core del SaaS |
| 12 | **Run Automation** | `POST /automations/{id}/run` | ✅ Real | 🔴 Crítica | Sí — trigger principal |
| 13 | **Webhook Trigger** | `POST /automations/webhook/{secret}` | ✅ Real | 🟡 Media | Sí — trigger externo |
| 14 | **Schedule Trigger** | Background scheduler | ✅ Real (cron limitado) | 🟡 Media | Sí — `*/N` y `0 H * * *` |
| 15 | **Automation Dashboard** | `GET /automations/{id}/dashboard` | ✅ Real | 🟡 Media | Sí — stats |
| 16 | **Results CRUD** | `GET/POST/DELETE /results` | ✅ Real | 🔴 Crítica | Sí — persistent output |
| 17 | **HITL Approvals** | `GET /results/pending-approvals`, `POST /{id}/approval` | ✅ Real | 🟡 Media | Sí — approve/reject |
| 18 | **Rules Engine** | `POST/GET/PUT/DELETE /rules`, `POST /rules/evaluate` | ✅ Real | 🟡 Media | Sí — conditions→actions |
| 19 | **Connectors** | `POST/GET/PUT/DELETE /connectors`, `test/fetch/push` | ✅ Real | 🟡 Media | Parcial — depende de registry |
| 20 | **Templates** | `GET /templates`, `POST /{slug}/deploy` | ✅ Real | 🟡 Media | Sí — one-click deploy |
| 21 | **Variables** | `POST/GET/PUT/DELETE /variables` | ✅ Real | 🟢 Baja | Sí — `{{var}}` interpolation |
| 22 | **Audit Log** | `GET /audit`, `GET /audit/export` | ✅ Real | 🟢 Baja | Sí — compliance trail |

### A3. AI Features

| # | Feature | Endpoints | Estado | Importancia | Conectada al flujo |
|---|---------|-----------|--------|-------------|-------------------|
| 23 | **AI Wizard (generate)** | `POST /wizard/generate` | ✅ Real | 🔴 Crítica | Sí — crea workflows de NL |
| 24 | **AI Wizard (chat)** | `POST /wizard/chat` (SSE) | ✅ Real streaming | 🔴 Crítica | Sí — conversational |
| 25 | **Document Analyze** | `POST /analyze`, `POST /analyze/text` | ✅ Real | 🟡 Media | Sí — full pipeline |
| 26 | **Enterprise Ops** | `POST /enterprise-ops/process` | ✅ Real | 🟡 Media | Sí — 8-agent pipeline |
| 27 | **Document Intelligence** | `POST /document-intelligence/run` | ✅ Real | 🟡 Media | Sí — classify→extract→validate→summarize |
| 28 | **Portfolio Copilot** | `POST /portfolio-copilot/run` | ✅ Real | 🟢 Baja | Sí — portfolio Q&A |
| 29 | **Demo Endpoint** | `POST /demo/analyze` | ✅ Real (rate limited) | 🟡 Media | Sí — try-it-now sin auth |
| 30 | **Drive Pipeline** | `POST /drive-to-intelligence` | ✅ Real | 🟢 Baja | Sí — Drive→Intelligence→Notion |

### A4. Auth & Billing

| # | Feature | Endpoints | Estado | Importancia | Conectada al flujo |
|---|---------|-----------|--------|-------------|-------------------|
| 31 | **Register/Login** | `POST /auth/register`, `POST /auth/login` | ✅ Real (bcrypt) | 🔴 Crítica | Sí |
| 32 | **Google OAuth** | `POST /auth/google` | ✅ Real | 🟡 Media | Sí |
| 33 | **JWT Auth** | Middleware | ✅ Real | 🔴 Crítica | Sí — all protected routes |
| 34 | **API Keys** | `POST/GET/DELETE /api-keys` | ✅ Real | 🟡 Media | Sí — alternative auth |
| 35 | **Billing (Stripe)** | `POST /billing/checkout`, webhook | ⚠️ Schema ready, code exists | 🟡 Media | **Parcial — necesita STRIPE_SECRET_KEY** |
| 36 | **RBAC** | `auth/rbac.py` | ⚠️ Definido pero no aplicado | 🟢 Baja | **No — decorator existe pero no se usa** |
| 37 | **Rate Limiting** | `auth/rate_limit.py` | ⚠️ Plan limits definidos | 🟡 Media | Parcial |

### A5. Monitoring & Observability

| # | Feature | Endpoints | Estado | Importancia | Conectada al flujo |
|---|---------|-----------|--------|-------------|-------------------|
| 38 | **Health Check** | `GET /health` | ✅ Real | 🔴 Crítica | Sí — DB+Redis+agents+circuit breaker |
| 39 | **Metrics Summary** | `GET /metrics/summary` | ✅ Real | 🟡 Media | Sí |
| 40 | **Reliability Health** | `GET /runs/reliability/health` | ✅ Real | 🟡 Media | Sí — dashboard KPIs |
| 41 | **Run Timeline** | `GET /runs/{id}/timeline` | ✅ Real | 🟢 Baja | Sí |
| 42 | **Feedback Loop** | `POST/GET /feedback` | ⚠️ In-memory (pierde en restart) | 🟢 Baja | **No persistido** |
| 43 | **Evaluation Framework** | `POST /evaluation/run` | ⚠️ Stub (no ejecuta) | 🟢 Baja | **No — solo bookkeeping** |

### A6. Infrastructure

| # | Feature | Estado | Importancia |
|---|---------|--------|-------------|
| 44 | **Self-Healing (healer)** | ✅ Real | 🟡 Media |
| 45 | **Circuit Breaker** | ✅ Real (ahora wired) | 🟡 Media |
| 46 | **LLM Router (Groq→Claude)** | ✅ Real | 🔴 Crítica |
| 47 | **RAG Pipeline (pgvector)** | ✅ Real | 🟡 Media |
| 48 | **Redis Task Queue** | ✅ Real (soft dependency) | 🟡 Media |
| 49 | **OpenTelemetry Tracing** | ⚠️ Console only | 🟢 Baja |
| 50 | **Prometheus/Grafana** | ✅ Docker only (no Render) | 🟢 Baja |

---

## B. FRONTEND — Features por Sección

### B1. Páginas Principales (en sidebar)

| # | Página | Backend Calls | Estado | Importancia |
|---|--------|--------------|--------|-------------|
| 51 | **Dashboard** | `/runs`, `/runs/reliability/health`, `/demo/analyze`, `/results/pending-approvals` | ✅ Full | 🔴 Crítica |
| 52 | **Automations** | `/automations`, `/templates`, `/automations/{id}/run` | ✅ Full | 🔴 Crítica |
| 53 | **AI Wizard** | `/wizard/generate`, `/workflows`, `/automations` | ✅ Full | 🔴 Crítica |
| 54 | **Integrations** | `/integrations/providers`, `/integrations/services` | ✅ Full | 🟡 Media |
| 55 | **Settings** | `/health` | ✅ Full | 🟢 Baja |
| 56 | **Workflows** (advanced) | `/workflows`, `/agents` | ✅ Full | 🟡 Media |
| 57 | **Executions** (advanced) | `/executions`, `/runs` | ✅ Full | 🟡 Media |
| 58 | **Agents** (advanced) | `/agents`, `/memory/stats` | ✅ Full | 🟡 Media |
| 59 | **Swarms** (advanced) | `/swarms/execute` | ✅ Full (list hardcoded) | 🟢 Baja |

### B2. Sub-features Importantes

| # | Feature | Ubicación | Estado |
|---|---------|-----------|--------|
| 60 | **Smart Dashboard** | Dentro de Automations | ✅ Auto-detect type → typed dashboard |
| 61 | **5 Typed Dashboards** | Ticket/Document/Email/Report/Generic | ✅ Full run+results+stats |
| 62 | **Visual DAG Builder** | WorkflowBuilderPage | ✅ Drag nodes, draw edges, SVG canvas |
| 63 | **Chat Assistant** | Floating (todas las páginas) | ✅ SSE streaming + KB fallback |
| 64 | **Templates Library** | Dentro de Automations | ✅ One-click deploy |
| 65 | **Onboarding Tour** | 5-step overlay | ✅ localStorage persistence |
| 66 | **Toast Notifications** | Global | ✅ Context-based |
| 67 | **Notification Bell** | Header | ✅ localStorage |
| 68 | **Auth Gate** | Pre-app | ✅ Login/Register/Guest |

---

## C. FEATURES HUÉRFANAS (existen pero no accesibles)

| # | Feature | Archivo | Por qué está huérfana | Acción recomendada |
|---|---------|---------|----------------------|-------------------|
| H1 | **ConnectorHubPage** | `features/connectors/ConnectorHubPage.jsx` | No route en App.jsx | **Agregar a sidebar** — el backend está completo |
| H2 | **AuditLog** | `features/audit/AuditLog.jsx` | No route en App.jsx | **Agregar a sidebar** bajo Advanced |
| H3 | **AnalyzePage** | `features/analyze/AnalyzePage.jsx` | Route existe pero sin sidebar entry | **Agregar a sidebar** o integrar en Dashboard |
| H4 | **RunsDashboard** | `pages/RunsDashboard.jsx` | Usa `fetch()` directo, no importado | **Eliminar** — reemplazado por ExecutionListPage |
| H5 | **Onboarding.jsx** | `shared/components/Onboarding.jsx` | Reemplazado por OnboardingTour | **Eliminar** |
| H6 | **api/client.js** | `api/client.js` | Reemplazado por `services/api.js` | **Eliminar** |
| H7 | **api/websocket.js** | `api/websocket.js` | WebSocket no se usa (HTTP polling) | **Eliminar** |

---

## D. FEATURES QUE FALTAN (gaps identificados)

### Críticas (bloquean producción)

| # | Feature Faltante | Por qué es necesaria | Esfuerzo |
|---|-----------------|---------------------|----------|
| M1 | **Redis en Render** | Task queue y WebSocket no funcionan sin Redis | Config 5 min (Upstash) |
| M2 | **Encryption de API keys** | `user_provider_keys` almacena keys en texto plano | 2 hrs |
| M3 | **CORS restrictivo** | `allow_origins=["*"]` en producción | 5 min |
| M4 | **DEBUG=false en prod** | Expone stack traces | 1 min |

### Altas (mejoran significativamente el producto)

| # | Feature Faltante | Beneficio | Esfuerzo |
|---|-----------------|-----------|----------|
| M5 | **Ollama como 3er LLM provider** | Backup local gratuito cuando Groq/Claude fallen | 3 hrs |
| M6 | **Feedback persistido a DB** | No perder ratings en restart | 2 hrs |
| M7 | **RBAC enforcement** | Roles (admin/owner/member/viewer) definidos pero no aplicados | 3 hrs |
| M8 | **Cron parser completo** | Solo soporta `*/N` — PYMEs necesitan "lunes a las 9am" | 1 hr (croniter) |
| M9 | **URL-based routing (React Router)** | No hay deep linking, no se puede compartir URLs | 4 hrs |
| M10 | **Stripe webhook handler** | Billing schema lista pero no conectada | 3 hrs |

### Medias (nice-to-have)

| # | Feature Faltante | Beneficio |
|---|-----------------|-----------|
| M11 | **Dead letter re-execution** | Actualmente solo marca flag, no re-ejecuta |
| M12 | **Evaluation real** | `run_evaluation` es stub, no ejecuta workflows |
| M13 | **OTel export a Grafana** | Tracing solo va a console |
| M14 | **S3 document storage** | Terraform lo provisiona pero app no lo usa |
| M15 | **Email verification** | Register no verifica email |

---

## E. FLUJO COMPLETO DE NEXUSFORGE (End-to-End)

```
[Usuario]
    │
    ▼
[Auth Gate] ─── register/login/guest ──→ [JWT Token]
    │
    ▼
[Dashboard] ─── KPIs, pending approvals, "Try AI Now"
    │
    ├──→ [AI Wizard] ─── describe → input → output → preview → publish
    │        │
    │        ▼
    │    [POST /wizard/generate] ─── LLM genera DAG
    │        │
    │        ▼
    │    [POST /workflows] ─── crea workflow con DAG
    │        │
    │        ▼
    │    [POST /automations] ─── publica como automation
    │
    ├──→ [Templates] ─── one-click deploy (workflow + automation + rules)
    │
    ├──→ [Workflow Builder] ─── drag & drop visual DAG
    │
    ▼
[Automations Page] ─── lista automations del usuario
    │
    ├──→ [Run] ─── POST /automations/{id}/run
    │        │
    │        ▼
    │    [DAG Executor] ─── walks graph, runs agents in parallel
    │        │
    │        ├── Step 1: ClassifierAgent (keyword route or LLM)
    │        ├── Step 2: ExtractorAgent (Pydantic validated)
    │        ├── Step 3: ValidatorAgent (structural + LLM)
    │        ├── Step N: ... (any of 24 agents)
    │        │
    │        ├── On error: SelfHealer → circuit breaker → retry/skip/repair
    │        │
    │        ▼
    │    [Save Result] ─── POST /results
    │        │
    │        ├── If requires_approval: mark as "pending"
    │        └── If auto: mark as "completed"
    │
    ├──→ [Dashboard] ─── SmartDashboard auto-detects type
    │        ├── TicketDashboard
    │        ├── DocumentDashboard
    │        ├── EmailDashboard
    │        ├── ReportDashboard
    │        └── GenericDashboard
    │
    ├──→ [Settings] ─── RulesPanel + VariablesPanel + AuditLog
    │
    └──→ [Webhook/Schedule Trigger] ─── automated execution
```

### Integrations conectadas al flujo:

```
[Execution Output]
    ├──→ Email (Resend API)
    ├──→ Notion (page write)
    ├──→ Slack (webhook)
    ├──→ WhatsApp (Twilio)
    ├──→ Custom Webhook (HMAC signed)
    └──→ Google Drive (read input)
```

---

## F. Estadísticas Totales

| Métrica | Cantidad |
|---------|----------|
| **Endpoints Backend** | ~95 |
| **Tablas PostgreSQL** | ~25 |
| **Agentes AI** | 24 (todos superagents) |
| **Swarm Topologies** | 6 |
| **Integrations** | 8 |
| **Frontend Pages** | 10 (+ 3 huérfanas) |
| **Frontend Components** | ~40 |
| **Migrations** | 24 |
| **Tests** | 260 |
| **Python files** | 230 |
| **Use Case Pipelines** | 4 (Enterprise Ops, Doc Intelligence, Portfolio Copilot, Drive Pipeline) |
