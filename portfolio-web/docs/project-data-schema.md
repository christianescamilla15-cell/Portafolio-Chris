# PHASE D: Project Data Schema

## New Schema

```js
{
  id: number,
  title: string,
  category: 'featured' | 'secondary' | 'other',
  priority: number,           // 1-18, lower = more important
  emoji: string,
  problem: { es: string, en: string },
  solution: { es: string, en: string },
  tech: string[],
  metrics: [{ n: string, l: string }],
  demoUrl: string | null,
  repoUrl: string | null,
  apkUrl: string | null,      // for mobile apps
  isNew: boolean,
}
```

---

## All 18 Projects Mapped

### FEATURED (5 projects)

```js
{
  id: 18,
  title: 'NexusForge AI',
  category: 'featured',
  priority: 1,
  emoji: '\uD83D\uDD2E',
  problem: {
    es: 'Gestionar 22 agentes IA con diferentes topologias y modos de fallo sin intervencion manual',
    en: 'Managing 22 AI agents with different topologies and failure modes without manual intervention'
  },
  solution: {
    es: 'Motor DAG con algoritmo de Kahn, memoria 3 niveles, 5 estrategias de auto-reparacion, RAG + pgvector',
    en: "DAG engine with Kahn's algorithm, 3-tier memory, 5 self-healing strategies, RAG + pgvector"
  },
  tech: ['Python', 'FastAPI', 'React', 'PostgreSQL', 'Redis', 'Docker', 'Terraform', 'Kubernetes'],
  metrics: [{ n: '22', l: 'Agents' }, { n: '6', l: 'Topologies' }, { n: '247', l: 'Tests' }],
  demoUrl: 'https://nexusforge-two.vercel.app',
  repoUrl: 'https://github.com/christianescamilla15-cell/nexusforge-ai',
  apkUrl: null,
  isNew: true,
},
{
  id: 16,
  title: 'LangChain Pipeline',
  category: 'featured',
  priority: 2,
  emoji: '\u26D3',
  problem: {
    es: 'Procesar documentos a traves de multiples servicios IA con fiabilidad variable y sin observabilidad',
    en: 'Processing documents through multiple AI services with varying reliability and no observability'
  },
  solution: {
    es: '3 microservicios event-driven + AWS Bedrock fallback 4 niveles + MLOps con prompt registry versionado',
    en: '3 event-driven microservices + AWS Bedrock 4-tier fallback + MLOps with versioned prompt registry'
  },
  tech: ['LangChain', 'AWS Bedrock', 'FastAPI', 'Python', 'React', 'Docker', 'MLOps'],
  metrics: [{ n: '3', l: 'Microservices' }, { n: '144', l: 'Tests' }, { n: '86%', l: 'Coverage' }],
  demoUrl: 'https://langchain-pipeline.vercel.app',
  repoUrl: 'https://github.com/christianescamilla15-cell/langchain-pipeline',
  apkUrl: null,
  isNew: true,
},
{
  id: 15,
  title: 'AI Document Pipeline',
  category: 'featured',
  priority: 3,
  emoji: '\uD83D\uDCDC',
  problem: {
    es: 'Analisis documental requiere multiples pasos manuales: lectura, extraccion, analisis de sentimiento, deteccion de riesgos',
    en: 'Document analysis requires multiple manual steps: reading, extraction, sentiment analysis, risk detection'
  },
  solution: {
    es: '4 agentes CrewAI (Researcher, Analyzer, Writer, Reviewer) + 2 servidores MCP (Filesystem + SQLite)',
    en: '4 CrewAI agents (Researcher, Analyzer, Writer, Reviewer) + 2 MCP servers (Filesystem + SQLite)'
  },
  tech: ['CrewAI', 'MCP', 'FastAPI', 'Python', 'React', 'Pydantic v2', 'Docker'],
  metrics: [{ n: '4', l: 'CrewAI Agents' }, { n: '2', l: 'MCP Servers' }, { n: '44', l: 'Tests' }],
  demoUrl: 'https://ai-document-pipeline.vercel.app',
  repoUrl: 'https://github.com/christianescamilla15-cell/ai-document-pipeline',
  apkUrl: null,
  isNew: false,
},
{
  id: 7,
  title: 'MindScrolling',
  category: 'featured',
  priority: 4,
  emoji: '\uD83E\uDDE0',
  problem: {
    es: 'Adiccion al doom-scrolling sin alternativa significativa ni recomendaciones inteligentes',
    en: 'Doom-scrolling addiction with no meaningful alternative or intelligent recommendations'
  },
  solution: {
    es: 'App Flutter con descubrimiento de citas por swipe, recomendacion hibrida pgvector + EMA, analisis de sentimiento',
    en: 'Flutter app with swipe-based quote discovery, pgvector + EMA hybrid recommendation, sentiment analysis'
  },
  tech: ['Flutter', 'Node.js', 'pgvector', 'Claude API'],
  metrics: [{ n: '13k+', l: 'Quotes' }, { n: 'pgvector', l: 'Similarity' }, { n: 'Play Store', l: 'Published' }],
  demoUrl: 'https://appetize.io/embed/b_ys32inbvsel2bx62mf2drptrfe',
  repoUrl: 'https://github.com/christianescamilla15-cell/MindScrolling',
  apkUrl: 'https://github.com/christianescamilla15-cell/MindScrolling/releases/download/v2.0.0/app-release.apk',
  isNew: false,
},
{
  id: 3,
  title: 'FinanceAI Dashboard',
  category: 'featured',
  priority: 5,
  emoji: '\uD83D\uDCCA',
  problem: {
    es: 'Analisis financiero manual propenso a errores: deteccion de anomalias tardia, proyecciones imprecisas',
    en: 'Manual financial analysis prone to errors: late anomaly detection, imprecise projections'
  },
  solution: {
    es: 'Dashboard con importacion CSV, deteccion de anomalias por z-score, proyecciones con regresion lineal, voz IA',
    en: 'Dashboard with CSV import, z-score anomaly detection, linear regression projections, AI voice'
  },
  tech: ['React', 'Claude API', 'Python', 'Pandas'],
  metrics: [{ n: '83', l: 'Tests' }, { n: 'Voice AI', l: 'Feature' }, { n: '<200ms', l: 'Detection' }],
  demoUrl: 'https://finance-ai-dashboard-omega.vercel.app',
  repoUrl: 'https://github.com/christianescamilla15-cell/finance-ai-dashboard',
  apkUrl: null,
  isNew: false,
},
```

### SECONDARY (2 projects)

```js
{
  id: 1,
  title: 'Chatbot Multiagente',
  category: 'secondary',
  priority: 6,
  emoji: '\uD83E\uDD16',
  problem: {
    es: 'Atencion al cliente con intenciones diversas que desbordan al equipo de soporte',
    en: 'Customer service with diverse intents overwhelming the support team'
  },
  solution: {
    es: '5 agentes IA con clasificacion de intenciones, enrutamiento automatico y base de conocimiento',
    en: '5 AI agents with intent classification, automatic routing, and knowledge base'
  },
  tech: ['React', 'Node.js', 'n8n', 'Claude API', 'Notion'],
  metrics: [{ n: '5', l: 'AI Agents' }, { n: '120', l: 'Tests' }, { n: '80%', l: 'Auto-resolved' }],
  demoUrl: 'https://chatbot-multiagente-ia.vercel.app',
  repoUrl: 'https://github.com/christianescamilla15-cell/chatbot-multiagente-ia',
  apkUrl: null,
  isNew: false,
},
{
  id: 19,
  title: 'Playwright Automation',
  category: 'secondary',
  priority: 7,
  emoji: '\uD83C\uDFAD',
  problem: {
    es: 'Testing E2E y scraping manual son lentos, fragiles y no reproducibles',
    en: 'E2E testing and manual scraping are slow, fragile, and not reproducible'
  },
  solution: {
    es: '3 scrapers reales (GitHub, e-commerce, formularios) + scheduler SQLite + CLI + E2E tests del portfolio',
    en: '3 real scrapers (GitHub, e-commerce, forms) + SQLite scheduler + CLI + portfolio E2E tests'
  },
  tech: ['Python', 'Playwright', 'SQLite', 'pytest', 'Docker'],
  metrics: [{ n: '54', l: 'Tests' }, { n: '3', l: 'Scrapers' }, { n: 'SQLite', l: 'Scheduler' }],
  demoUrl: 'https://playwright-automation-demo.vercel.app',
  repoUrl: 'https://github.com/christianescamilla15-cell/playwright-automation',
  apkUrl: null,
  isNew: true,
},
```

### OTHER (11 projects)

```js
{
  id: 4,
  title: 'HRScout',
  category: 'other',
  priority: 8,
  emoji: '\uD83D\uDC64',
  problem: {
    es: 'Filtrado manual de CVs consume horas y pierde candidatos calificados',
    en: 'Manual CV screening takes hours and misses qualified candidates'
  },
  solution: {
    es: 'Extraccion de keywords, matching con sinonimos, scoring ponderado 0-100, heatmap de cobertura',
    en: 'Keyword extraction, synonym matching, weighted scoring 0-100, skills coverage heatmap'
  },
  tech: ['React', 'Claude API', 'FastAPI'],
  metrics: [{ n: '0-100', l: 'Scoring' }, { n: 'Heatmap', l: 'Feature' }],
  demoUrl: 'https://hr-scout-llm.vercel.app',
  repoUrl: 'https://github.com/christianescamilla15-cell/hr-scout-llm',
  apkUrl: null,
  isNew: false,
},
{
  id: 17,
  title: 'Ad Analytics Pipeline',
  category: 'other',
  priority: 9,
  emoji: '\uD83D\uDCCA',
  problem: {
    es: 'Datos de marketing fragmentados en Meta, Google y GA4 sin vista unificada',
    en: 'Marketing data fragmented across Meta, Google, and GA4 with no unified view'
  },
  solution: {
    es: 'ETL unificado con OCR de facturas (AWS Textract), deteccion de anomalias, calculadora ROI, budget pacing',
    en: 'Unified ETL with invoice OCR (AWS Textract), anomaly detection, ROI calculator, budget pacing'
  },
  tech: ['Python', 'FastAPI', 'Meta API', 'Google API', 'GA4', 'AWS S3', 'Lambda', 'Docker'],
  metrics: [{ n: '124', l: 'Tests' }, { n: 'OCR', l: 'Invoice' }],
  demoUrl: 'https://ad-analytics-pipeline.vercel.app',
  repoUrl: 'https://github.com/christianescamilla15-cell/ad-analytics-pipeline',
  apkUrl: null,
  isNew: false,
},
{
  id: 20,
  title: 'Fine-tuning Demo',
  category: 'other',
  priority: 10,
  emoji: '\uD83E\uDDEC',
  problem: {
    es: 'Clasificacion de intenciones requiere modelo custom, no solo prompts genericos',
    en: 'Intent classification requires a custom model, not just generic prompts'
  },
  solution: {
    es: 'Fine-tuning de DistilBERT multilingual con 100 muestras, pipeline completo de ML',
    en: 'DistilBERT multilingual fine-tuning with 100 samples, full ML pipeline'
  },
  tech: ['Python', 'PyTorch', 'HuggingFace', 'Transformers', 'scikit-learn'],
  metrics: [{ n: '27', l: 'Tests' }, { n: '5', l: 'Intents' }, { n: 'DistilBERT', l: 'Model' }],
  demoUrl: 'https://fine-tuning-demo-dashboard.vercel.app',
  repoUrl: 'https://github.com/christianescamilla15-cell/fine-tuning-demo',
  apkUrl: null,
  isNew: true,
},
{
  id: 14,
  title: 'Lobos de la Montana',
  category: 'other',
  priority: 11,
  emoji: '\uD83D\uDC3A',
  problem: {
    es: 'Tienda outdoor sin presencia digital ni asistente inteligente',
    en: 'Outdoor store with no digital presence or intelligent assistant'
  },
  solution: {
    es: 'E-commerce con carrito persistente, chatbot IA, animaciones 3D, API serverless bilingue',
    en: 'E-commerce with persistent cart, AI chatbot, 3D animations, bilingual serverless API'
  },
  tech: ['HTML/CSS', 'JavaScript', 'Vercel Serverless', 'Bootstrap 5'],
  metrics: [{ n: '3D', l: 'Animations' }, { n: 'AI Chat', l: 'Feature' }],
  demoUrl: 'https://wolves-ruddy.vercel.app',
  repoUrl: 'https://github.com/christianescamilla15-cell/lobos-de-montana',
  apkUrl: null,
  isNew: false,
},
{
  id: 9,
  title: 'La 5ta Esencia',
  category: 'other',
  priority: 12,
  emoji: '\uD83C\uDF3F',
  problem: {
    es: 'Tienda de productos naturales sin catalogo digital con datos nutricionales',
    en: 'Natural products store without a digital catalog with nutritional data'
  },
  solution: {
    es: 'E-commerce completo con Flask, catalogo, carrito, checkout y Open Food Facts API',
    en: 'Complete e-commerce with Flask, catalog, cart, checkout, and Open Food Facts API'
  },
  tech: ['HTML/CSS', 'Python', 'Flask', 'Open Food Facts API'],
  metrics: [{ n: 'E-commerce', l: 'Full' }, { n: 'API', l: 'OpenFoodFacts' }],
  demoUrl: 'https://la-5ta-esencia.vercel.app',
  repoUrl: 'https://github.com/christianescamilla15-cell/La-5ta-esencia',
  apkUrl: null,
  isNew: false,
},
{
  id: 12,
  title: 'Invoice Manager',
  category: 'other',
  priority: 13,
  emoji: '\uD83E\uDDFE',
  problem: {
    es: 'Facturacion manual sin estructura SOLID ni formato CFDI mexicano automatizado',
    en: 'Manual invoicing without SOLID architecture or automated Mexican CFDI format'
  },
  solution: {
    es: 'Sistema fullstack Laravel 11 + Vue.js 3 + MySQL con Repository/Strategy/Factory patterns, PDF CFDI',
    en: 'Full-stack Laravel 11 + Vue.js 3 + MySQL with Repository/Strategy/Factory patterns, CFDI PDF'
  },
  tech: ['Laravel', 'Vue.js 3', 'MySQL', 'Docker', 'Tailwind CSS'],
  metrics: [{ n: '68', l: 'Tests' }, { n: 'SOLID', l: 'Architecture' }],
  demoUrl: 'https://invoice-manager-app.vercel.app',
  repoUrl: 'https://github.com/christianescamilla15-cell/invoice-manager',
  apkUrl: null,
  isNew: false,
},
{
  id: 10,
  title: 'QuoteFlow',
  category: 'other',
  priority: 14,
  emoji: '\uD83D\uDCF1',
  problem: {
    es: 'MindScrolling necesitaba version nativa Android con arquitectura MVVM',
    en: 'MindScrolling needed a native Android version with MVVM architecture'
  },
  solution: {
    es: 'Kotlin + Jetpack Compose con 18 agentes, Room DB, Material 3, musica ambient',
    en: 'Kotlin + Jetpack Compose with 18 agents, Room DB, Material 3, ambient music'
  },
  tech: ['Kotlin', 'Jetpack Compose', 'Room', 'Material 3'],
  metrics: [{ n: '18', l: 'Agents' }, { n: '46+', l: 'Tests' }, { n: 'MVVM', l: 'Pattern' }],
  demoUrl: 'https://appetize.io/embed/b_67laefxo3crmekdqfm3uo67e7u',
  repoUrl: 'https://github.com/christianescamilla15-cell/QuoteFlow-Kotlin',
  apkUrl: 'https://github.com/christianescamilla15-cell/QuoteFlow-Kotlin/releases/download/v2.0.0/app-debug.apk',
  isNew: false,
},
{
  id: 11,
  title: 'AgenticDev Framework',
  category: 'other',
  priority: 15,
  emoji: '\uD83E\uDD16',
  problem: {
    es: 'Desarrollo de apps complejas requiere coordinacion manual entre muchos agentes IA',
    en: 'Building complex apps requires manual coordination across many AI agents'
  },
  solution: {
    es: '18 agentes especializados en pipeline spec-driven (EARS) con Hooks, Powers y QA automatico',
    en: '18 specialized agents in spec-driven pipeline (EARS) with Hooks, Powers, and automated QA'
  },
  tech: ['Python', 'Claude API', 'AWS Bedrock', 'EARS'],
  metrics: [{ n: '18', l: 'Agents' }, { n: 'EARS', l: 'Spec-driven' }],
  demoUrl: 'https://agentic-dev-framework.vercel.app',
  repoUrl: 'https://github.com/christianescamilla15-cell/agentic-dev-framework',
  apkUrl: null,
  isNew: false,
},
{
  id: 2,
  title: 'ContentStudio AI',
  category: 'other',
  priority: 16,
  emoji: '\uD83C\uDFA8',
  problem: {
    es: 'Crear contenido de marketing para 4 plataformas es repetitivo y lento',
    en: 'Creating marketing content for 4 platforms is repetitive and slow'
  },
  solution: {
    es: 'Generador multi-plataforma con 5 tonos, 5 formatos, copy + paleta + prompt DALL-E 3',
    en: 'Multi-platform generator with 5 tones, 5 formats, copy + palette + DALL-E 3 prompt'
  },
  tech: ['React', 'Claude API', 'DALL-E 3'],
  metrics: [{ n: '4', l: 'Platforms' }, { n: '5', l: 'Tones' }],
  demoUrl: 'https://content-studio-ai-blush.vercel.app',
  repoUrl: 'https://github.com/christianescamilla15-cell/content-studio-ai',
  apkUrl: null,
  isNew: false,
},
{
  id: 6,
  title: 'Multi-Agent Build System',
  category: 'other',
  priority: 17,
  emoji: '\u2699\uFE0F',
  problem: {
    es: 'Construir proyectos completos requiere pasar por multiples fases manuales',
    en: 'Building complete projects requires going through multiple manual phases'
  },
  solution: {
    es: 'Orquestador Python con 6 agentes (Arquitecto, Developer, QA, Reviewer, Documentador, Deployer)',
    en: 'Python orchestrator with 6 agents (Architect, Developer, QA, Reviewer, Documenter, Deployer)'
  },
  tech: ['Python', 'Claude API', 'anthropic SDK'],
  metrics: [{ n: '6', l: 'Agents' }],
  demoUrl: 'https://multi-agent-demo.vercel.app',
  repoUrl: 'https://github.com/christianescamilla15-cell/multi-agent-build-system',
  apkUrl: null,
  isNew: false,
},
{
  id: 8,
  title: 'WordForge',
  category: 'other',
  priority: 18,
  emoji: '\uD83D\uDD24',
  problem: {
    es: 'No hay juegos de palabras bilingues con sistema competitivo de ligas',
    en: 'No bilingual word games exist with competitive league systems'
  },
  solution: {
    es: 'Flutter game: 7 letras, 3 minutos, combos, ligas competitivas, monetizacion freemium',
    en: 'Flutter game: 7 letters, 3 minutes, combos, competitive leagues, freemium monetization'
  },
  tech: ['Flutter', 'Riverpod', 'Supabase', 'RevenueCat'],
  metrics: [{ n: '7', l: 'Letters' }, { n: 'Leagues', l: 'Feature' }],
  demoUrl: 'https://appetize.io/embed/b_z3sfij3e6obndan2zdbultmi5q',
  repoUrl: 'https://github.com/christianescamilla15-cell/wordforge',
  apkUrl: 'https://github.com/christianescamilla15-cell/wordforge/releases/download/v1.0.0/app-debug.apk',
  isNew: false,
},
{
  id: 5,
  title: 'ClientHub',
  category: 'other',
  priority: 19,
  emoji: '\uD83D\uDCBC',
  problem: {
    es: 'Gestion de clientes requiere desarrollo backend costoso para CRUD basico',
    en: 'Client management requires expensive backend development for basic CRUD'
  },
  solution: {
    es: 'Portal No-Code con Softr + Airtable: tickets, facturas, documentos, progreso y asistente IA',
    en: 'No-Code portal with Softr + Airtable: tickets, invoices, documents, progress, and AI assistant'
  },
  tech: ['Softr', 'Airtable', 'Claude API'],
  metrics: [{ n: 'CRUD', l: 'Full' }, { n: 'AI Assist', l: 'Feature' }],
  demoUrl: 'https://client-hub-nocode.vercel.app',
  repoUrl: 'https://github.com/christianescamilla15-cell/client-hub-nocode',
  apkUrl: null,
  isNew: false,
},
```

---

## Migration Notes

- The `featured` boolean and `FEATURED_ORDER` array in current `projects.js` are replaced by the `category` field.
- The `description`/`description_en` fields are replaced by the more focused `problem`/`solution` pair.
- The `keyMetric` string is replaced by the structured `metrics` array (already exists as `PROJECT_METRICS`).
- `stack` is renamed to `tech` for clarity.
- `demo`/`github` are renamed to `demoUrl`/`repoUrl` for consistency.
- Fields removed: `description`, `description_en`, `featured`, `keyMetric`, `presentationUrl`, `tagline`, `terminalLines`, `impactMetric`, `category` (old ai/fullstack/mobile/automation -- replaced by tier-based category).
- The old category concept (ai, fullstack, mobile, automation) can be kept as a `type` field if filtering by tech domain is still desired.
