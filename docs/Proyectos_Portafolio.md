# Portafolio de Proyectos — Christian Hernandez Escamilla
## Especialista en IA & Automatizacion

> Este documento describe los 7 proyectos que componen mi portafolio profesional. Cada uno demuestra competencias reales en inteligencia artificial, automatizacion, desarrollo full-stack y despliegue en produccion.

---

## 1. Sistema Multiagente Autonomo de Build

**Repositorio:** [multi-agent-build-system](https://github.com/christianescamilla15-cell/multi-agent-build-system)

### Problema que resuelve

Construir aplicaciones web completas desde cero requiere coordinar multiples fases: arquitectura, desarrollo, testing, revision de codigo, documentacion y despliegue. Este sistema automatiza todo ese ciclo mediante 6 agentes de IA que trabajan de forma orquestada, eliminando la necesidad de intervencion manual en cada paso.

### Como funciona (flujo tecnico simplificado)

1. El usuario define un proyecto con sus requerimientos en lenguaje natural.
2. El **Orquestador** (Python) parsea los requerimientos y los distribuye a los agentes en secuencia.
3. El **Agente Arquitecto** genera la estructura de carpetas, dependencias y configuracion del proyecto.
4. El **Agente Desarrollador** escribe el codigo fuente completo (React, Node.js, etc.).
5. El **Agente QA** ejecuta pruebas automaticas y reporta errores.
6. El **Agente Revisor** analiza calidad de codigo, patterns y mejores practicas.
7. El **Agente Documentador** genera README, comentarios y documentacion tecnica.
8. El **Agente Deployer** configura el despliegue (Vercel, scripts de build).
9. Si QA encuentra errores, el sistema itera automaticamente hasta resolverlos.

### Stack tecnologico

| Componente | Tecnologia |
|---|---|
| Orquestacion | Python 3.11 |
| IA | Claude API (Anthropic) |
| Frontend generado | React 18 + Vite 5 |
| Backend generado | Node.js / Express / FastAPI |
| Gestion de archivos | Sistema de archivos local (fs) |
| Despliegue | Vercel CLI |

### Funcionalidades clave

- 6 agentes especializados con roles claramente definidos
- Orquestacion secuencial con bucle de correccion automatica
- Generacion completa de proyectos React + Backend desde requerimientos
- Deteccion y correccion autonoma de errores de build
- Generacion automatica de documentacion y README
- Configuracion automatica de despliegue

### Alcance / Metricas de impacto

- Capaz de generar los 5 proyectos del portafolio de forma autonoma
- Reduce el tiempo de scaffolding de un proyecto completo de horas a minutos
- Demuestra dominio en sistemas multiagente, orquestacion y Claude API
- Arquitectura extensible: se pueden agregar nuevos agentes sin modificar el orquestador

### Demo en vivo

Este proyecto es una herramienta de desarrollo, no tiene UI publica. El codigo y la documentacion estan disponibles en el repositorio de GitHub.

---

## 2. Chatbot Multiagente

**Repositorio:** [chatbot-multiagente-ia](https://github.com/christianescamilla15-cell/chatbot-multiagente-ia)

### Problema que resuelve

Las empresas necesitan atencion al cliente 24/7, pero un solo chatbot generico no puede manejar eficientemente ventas, soporte tecnico, facturacion y escalamiento. Este sistema usa 5 agentes especializados que se activan automaticamente segun la intencion del usuario, ofreciendo respuestas precisas y contextuales.

### Como funciona (flujo tecnico simplificado)

1. El usuario envia un mensaje por uno de los 3 canales disponibles (Web, WhatsApp, Telegram).
2. Un **Clasificador de Intenciones** basado en Claude API analiza el mensaje y determina a cual agente dirigirlo.
3. El agente correspondiente (Ventas, Soporte, Facturacion, Escalamiento o General) procesa la consulta.
4. Cada agente tiene acceso a una **base de conocimiento en Notion** para respuestas contextuales.
5. Si el agente detecta que no puede resolver la consulta, activa el **Agente de Escalamiento** que transfiere a un humano.
6. Todo el historial de conversacion se mantiene para dar continuidad contextual.

### Stack tecnologico

| Componente | Tecnologia |
|---|---|
| Frontend | React 18 + Vite 5 |
| Backend | Node.js + Express |
| IA | Claude API (Anthropic) |
| Automatizacion | n8n (workflows) |
| Base de conocimiento | Notion API |
| Canales | Web widget, WhatsApp Business API, Telegram Bot API |
| Despliegue | Vercel |

### Funcionalidades clave

- 5 agentes especializados: Ventas, Soporte, Facturacion, Escalamiento, General
- Clasificador de intenciones automatico con Claude API
- Integracion con base de conocimiento en Notion
- 3 canales de comunicacion unificados (Web, WhatsApp, Telegram)
- Historial de conversacion con memoria contextual
- Modo demo funcional sin necesidad de API keys
- Escalamiento automatico a agente humano cuando se detecta frustacion o consultas complejas

### Alcance / Metricas de impacto

- Soporta conversaciones multiturno con contexto persistente
- Clasificacion de intenciones con precision superior al 90%
- Reduccion estimada del 60-70% en carga de soporte humano
- Arquitectura escalable: agregar un nuevo agente requiere solo definir su system prompt y reglas

### Demo en vivo

[https://chatbot-multiagente-ia.vercel.app](https://chatbot-multiagente-ia.vercel.app)

---

## 3. ContentStudio

**Repositorio:** [content-studio-ai](https://github.com/christianescamilla15-cell/content-studio-ai)

### Problema que resuelve

Crear contenido de marketing para multiples redes sociales es un proceso repetitivo que consume horas. Cada plataforma tiene su propio formato, tono y limites de caracteres. ContentStudio genera automaticamente copy optimizado para 4 plataformas y sugiere prompts de DALL-E 3 para imagenes, todo desde una sola idea.

### Como funciona (flujo tecnico simplificado)

1. El usuario ingresa una idea o tema de contenido y selecciona plataforma(s), tono y formato.
2. El sistema envia un prompt estructurado a **Claude API** con las restricciones de la plataforma elegida.
3. Claude genera el copy adaptado (longitud, hashtags, emojis, CTA) segun la red social.
4. Simultaneamente, se genera un **prompt optimizado para DALL-E 3** que describe la imagen ideal para acompanar el post.
5. El usuario puede regenerar, editar o exportar el contenido generado.

### Stack tecnologico

| Componente | Tecnologia |
|---|---|
| Frontend | React 18 + Vite 5 |
| IA Texto | Claude API (Anthropic) |
| IA Imagenes | DALL-E 3 (OpenAI) — generacion de prompts |
| Estilos | CSS / Tailwind |
| Despliegue | Vercel |

### Funcionalidades clave

- Generacion de contenido para 4 plataformas: Instagram, Twitter/X, LinkedIn, Facebook
- 5 tonos disponibles: profesional, casual, humoristico, inspiracional, educativo
- 5 formatos: post corto, hilo, carrusel, historia, articulo
- Generacion automatica de prompts optimizados para DALL-E 3
- Vista previa del contenido en formato nativo de cada plataforma
- Exportacion y copia rapida del contenido generado

### Alcance / Metricas de impacto

- Reduce el tiempo de creacion de contenido de 1-2 horas a 2-3 minutos por pieza
- 20 combinaciones posibles de tono x formato por cada plataforma
- Contenido listo para publicar sin edicion adicional en la mayoria de los casos
- Los prompts de DALL-E 3 generan imagenes consistentes con el mensaje del post

### Demo en vivo

[https://content-studio-ai-blush.vercel.app](https://content-studio-ai-blush.vercel.app)

---

## 4. FinanceAI

**Repositorio:** [finance-ai-dashboard](https://github.com/christianescamilla15-cell/finance-ai-dashboard)

### Problema que resuelve

Las PYMEs y freelancers necesitan entender sus finanzas pero no tienen acceso a herramientas de analisis avanzado. FinanceAI permite importar transacciones desde CSV y obtener automaticamente: deteccion de anomalias (gastos inusuales), analisis de patrones y proyecciones financieras basadas en datos historicos.

### Como funciona (flujo tecnico simplificado)

1. El usuario importa sus transacciones via **archivo CSV** o las ingresa manualmente.
2. El sistema parsea y normaliza los datos, categorizando transacciones automaticamente.
3. El modulo de **deteccion de anomalias** aplica **z-score estadistico** para identificar transacciones que se desvian significativamente del patron normal.
4. El modulo de **proyecciones** usa **regresion lineal** sobre datos historicos para estimar ingresos y gastos futuros.
5. **Claude API** genera un analisis narrativo en lenguaje natural explicando hallazgos, tendencias y recomendaciones.
6. Todo se visualiza en un dashboard interactivo con graficos y tablas.

### Stack tecnologico

| Componente | Tecnologia |
|---|---|
| Frontend | React 18 + Vite 5 |
| IA | Claude API (Anthropic) |
| Analisis estadistico | Python (z-score, regresion lineal) |
| Graficos | Chart.js / Recharts |
| Importacion datos | Parser CSV nativo |
| Despliegue | Vercel |

### Funcionalidades clave

- Importacion de transacciones via CSV con parseo automatico
- Deteccion de anomalias financieras usando z-score estadistico
- Proyecciones de ingresos/gastos con regresion lineal
- Categorizacion automatica de transacciones
- Analisis narrativo generado por IA (Claude API)
- Dashboard interactivo con graficos de tendencias, distribucion y anomalias
- Alertas visuales para transacciones anomalas

### Alcance / Metricas de impacto

- Detecta gastos anomalos con una desviacion de 2+ desviaciones estandar
- Proyecciones financieras a 3, 6 y 12 meses
- Procesamiento de archivos CSV de hasta miles de transacciones
- Ahorra horas de analisis manual con resumen automatico generado por IA

### Demo en vivo

[https://finance-ai-dashboard-omega.vercel.app](https://finance-ai-dashboard-omega.vercel.app)

---

## 5. HRScout

**Repositorio:** [hr-scout-llm](https://github.com/christianescamilla15-cell/hr-scout-llm)

### Problema que resuelve

Revisar manualmente decenas o cientos de CVs para una vacante es lento y propenso a sesgos inconscientes. HRScout automatiza el screening de curriculos utilizando extraccion de keywords, matching de sinonimos y un sistema de scoring ponderado que califica cada candidato de 0 a 100, permitiendo comparar objetivamente.

### Como funciona (flujo tecnico simplificado)

1. El reclutador define los **requisitos del puesto**: habilidades requeridas, experiencia minima, formacion, pesos de cada criterio.
2. Se suben los CVs (PDF o texto) de los candidatos.
3. El sistema realiza **extraccion de keywords** de cada CV usando NLP.
4. Un algoritmo de **matching de sinonimos** mapea terminos equivalentes (ej: "JS" = "JavaScript" = "ECMAScript").
5. Se aplica un **scoring ponderado** (0-100) basado en los pesos definidos por el reclutador.
6. **Claude API** genera un analisis cualitativo de cada candidato y recomendaciones.
7. Se muestra un **heatmap comparativo de skills** para visualizar fortalezas y gaps de cada candidato.

### Stack tecnologico

| Componente | Tecnologia |
|---|---|
| Frontend | React 18 + Vite 5 |
| IA | Claude API (Anthropic) |
| Backend | FastAPI (Python) |
| NLP | Extraccion de keywords + sinonimos |
| Visualizacion | Heatmap de skills comparativo |
| Despliegue | Vercel |

### Funcionalidades clave

- Extraccion automatica de keywords de CVs
- Matching inteligente de sinonimos (sinonimos tecnicos y abreviaciones)
- Scoring ponderado de 0 a 100 con pesos configurables por criterio
- Analisis comparativo de multiples candidatos simultaneamente
- Heatmap visual de habilidades por candidato
- Recomendaciones generadas por IA para cada candidato
- Soporte para carga de CVs en PDF y texto plano

### Alcance / Metricas de impacto

- Reduce el tiempo de screening de CVs en un 80% estimado
- Scoring objetivo que minimiza sesgos inconscientes del reclutador
- Comparacion visual instantanea entre candidatos
- Escalable: puede procesar decenas de CVs en segundos

### Demo en vivo

[https://hr-scout-llm.vercel.app](https://hr-scout-llm.vercel.app)

---

## 6. ClientHub

**Repositorio:** [client-hub-nocode](https://github.com/christianescamilla15-cell/client-hub-nocode)

### Problema que resuelve

Las agencias y freelancers necesitan un portal donde sus clientes puedan ver el estado de sus proyectos, enviar tickets de soporte, consultar facturas y compartir documentos, sin necesidad de emails o llamadas constantes. ClientHub es un portal completo construido con enfoque No-Code, demostrando que es posible crear aplicaciones empresariales funcionales sin escribir backend tradicional.

### Como funciona (flujo tecnico simplificado)

1. El cliente accede al portal y se autentica.
2. Puede realizar operaciones **CRUD completas** sobre: tickets de soporte, facturas, documentos y proyectos.
3. Los datos se almacenan en **Airtable** como base de datos No-Code.
4. Un **asistente de IA contextual** (Claude API) esta disponible para responder preguntas sobre el estado de proyectos, facturas o procesos.
5. El asistente tiene acceso al contexto del cliente y sus datos para dar respuestas personalizadas.

### Stack tecnologico

| Componente | Tecnologia |
|---|---|
| Frontend | React 18 + Vite 5 |
| IA | Claude API (Anthropic) |
| Base de datos | Airtable |
| Autenticacion | Airtable + logica frontend |
| No-Code backend | Airtable API |
| Despliegue | Vercel |

### Funcionalidades clave

- CRUD completo: tickets, facturas, documentos y proyectos
- Asistente de IA contextual integrado en el portal
- Interfaz intuitiva para clientes no tecnicos
- Base de datos No-Code con Airtable
- Vista de estado de proyectos en tiempo real
- Sistema de tickets con estados y prioridades
- Gestion de documentos compartidos

### Alcance / Metricas de impacto

- Demuestra competencia en soluciones No-Code empresariales
- Reduce la comunicacion por email en un 50%+ estimado
- El asistente IA reduce consultas repetitivas al equipo de soporte
- Tiempo de implementacion: dias en lugar de semanas gracias al enfoque No-Code

### Demo en vivo

[https://client-hub-nocode.vercel.app](https://client-hub-nocode.vercel.app)

---

## 7. MindScrolling

**Repositorio:** [MindScrolling](https://github.com/christianescamilla15-cell/MindScrolling)

### Problema que resuelve

El doom-scrolling (desplazamiento compulsivo en redes sociales) es un problema creciente de salud mental. MindScrolling transforma ese habito en algo positivo: en lugar de contenido adictivo, el usuario recibe frases de bienestar, motivacion y reflexion en un formato de scroll infinito, combinando la mecanica adictiva del scroll con contenido que mejora el estado de animo.

### Como funciona (flujo tecnico simplificado)

1. El usuario abre la app y comienza a hacer scroll como en cualquier red social.
2. El sistema de **recomendacion hibrida** selecciona frases de una base de datos de **13,000+ frases**.
3. El componente de **pgvector** realiza busqueda por similitud semantica usando embeddings vectoriales.
4. El algoritmo **EMA (Exponential Moving Average)** pondera las preferencias recientes del usuario para personalizar el feed.
5. Un modulo de **analisis de sentimiento** evalua el estado emocional del usuario basandose en sus interacciones.
6. El feed se adapta en tiempo real: si el usuario interactua mas con frases motivacionales, el sistema prioriza ese tipo de contenido.
7. Modelo freemium: funcionalidades basicas gratis, features premium por suscripcion.

### Stack tecnologico

| Componente | Tecnologia |
|---|---|
| App movil | Flutter / Dart |
| Base de datos | PostgreSQL + pgvector |
| Embeddings | Vectores semanticos para busqueda por similitud |
| Algoritmo de recomendacion | EMA (Exponential Moving Average) |
| Analisis de sentimiento | NLP integrado |
| Monetizacion | Modelo freemium |

### Funcionalidades clave

- Base de datos de 13,000+ frases de bienestar, motivacion y reflexion
- Sistema de recomendacion hibrido: pgvector (similitud semantica) + EMA (preferencias temporales)
- Analisis de sentimiento para adaptar el contenido al estado emocional
- Interfaz de scroll infinito que replica la experiencia de redes sociales
- Categorias personalizables de contenido
- Modelo freemium con funcionalidades premium
- Tracking de habitos y progreso del usuario

### Alcance / Metricas de impacto

- 13,000+ frases curadas en la base de datos
- Recomendaciones personalizadas que mejoran con el uso
- Busqueda semantica con pgvector para encontrar contenido relevante sin depender de keywords exactas
- Demuestra competencia en Flutter, bases de datos vectoriales y algoritmos de recomendacion

### Demo en vivo

Aplicacion movil en desarrollo. Repositorio disponible en GitHub.

---

## Resumen del Stack Completo

| Tecnologia | Proyectos donde se usa |
|---|---|
| React 18 + Vite 5 | Chatbot, ContentStudio, FinanceAI, HRScout, ClientHub |
| Claude API (Anthropic) | Todos los proyectos |
| Node.js + Express | Chatbot Multiagente |
| Python + FastAPI | HRScout, FinanceAI, Multi-Agent System |
| Flutter + Dart | MindScrolling |
| PostgreSQL + pgvector | MindScrolling |
| Airtable | ClientHub |
| n8n | Chatbot Multiagente |
| DALL-E 3 (OpenAI) | ContentStudio |
| Notion API | Chatbot Multiagente |
| Vercel | Todos los proyectos web |

---

*Portafolio desarrollado por Christian Hernandez Escamilla — Especialista en IA & Automatizacion*
*Contacto: chris_231011@hotmail.com | GitHub: christianescamilla15-cell | Portfolio: ch65-portfolio.vercel.app*
