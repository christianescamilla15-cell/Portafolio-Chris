/**
 * Knowledge Base Endpoint & Data Store
 *
 * Serves the portfolio knowledge base used by chat and recommend middleware.
 * Supabase-first loading via kb-loader.js with hardcoded PORTFOLIO_KB fallback.
 * Contains all project details, skills, experience, contact info (bilingual EN/ES).
 *
 * See MIDDLEWARE.md for full architecture documentation.
 */
import { loadKB } from './_lib/kb-loader.js'
export async function getKB() {
  const db = await loadKB()
  return db || PORTFOLIO_KB
}

// Hardcoded fallback — used when Supabase is unavailable
export const PORTFOLIO_KB = {
  about: {
    en: `Christian Hernandez Escamilla is a Software Engineer from Mexico City (CDMX), Mexico. He specializes in AI systems, automation, and full-stack development. He has 3+ years of experience with LLMs — 2.5 years at Scale AI training models through RLHF, and has independently built 18 production AI systems with 1,346+ tests. He holds a Software Engineering degree from UVEG (2018-2022) and completed a Full Stack Java Developer Bootcamp at Generation Mexico (2026). Available immediately. Languages: Spanish (native), English (B1-B2 professional).`,
    es: `Christian Hernandez Escamilla es Ingeniero en Software de la Ciudad de México (CDMX). Se especializa en sistemas de IA, automatización, y desarrollo full-stack. Tiene 3+ años de experiencia con LLMs — 2.5 años en Scale AI entrenando modelos mediante RLHF, y ha construido independientemente 18 sistemas de IA en producción con 1,346+ tests. Tiene título de Ingeniería en Software de UVEG (2018-2022) y completó un Bootcamp de Full Stack Java Developer en Generation México (2026). Disponible de manera inmediata.`
  },

  projects: [
    {
      name: "LangChain Pipeline",
      description: {
        en: "Document intelligence pipeline with 3 microservices (Document, Analysis, Report) communicating through an event bus. Uses LangChain chains + AgentExecutor with 5 tools, RAG with FAISS vector store, and full MLOps (prompt registry, A/B testing, guardrails, LLM observability). AWS Bedrock ModelRouter with 4-tier fallback. 144 tests, 86% coverage, GitHub Actions CI.",
        es: "Pipeline de inteligencia documental con 3 microservicios comunicados por event bus. LangChain chains + AgentExecutor con 5 tools, RAG con FAISS, MLOps completo (prompt registry, A/B testing, guardrails, observabilidad LLM). ModelRouter AWS Bedrock con fallback 4 niveles. 144 tests, 86% cobertura."
      },
      stack: "Python, LangChain, FastAPI, FAISS, Docker, GitHub Actions",
      tests: 144,
      demo: "https://langchain-pipeline.vercel.app",
      github: "https://github.com/christianescamilla15-cell/langchain-pipeline",
      keyMetric: "144 tests, 86% coverage"
    },
    {
      name: "Ad Analytics Pipeline",
      description: {
        en: "Marketing analytics platform with ETL from Meta Ads + Google Ads + GA4. OCR invoice parsing with confidence scoring, AWS S3/Lambda/Textract, anomaly detection (z-score), ROI calculator, budget pacing, alert system, multi-account management. 124 tests.",
        es: "Plataforma de analítica de marketing con ETL de Meta Ads + Google Ads + GA4. OCR de facturas, AWS S3/Lambda/Textract, detección de anomalías, calculadora ROI, pacing de presupuesto, alertas, multi-cuenta. 124 tests."
      },
      stack: "Python, FastAPI, Meta API, Google API, GA4, AWS S3, Lambda",
      tests: 124,
      demo: "https://ad-analytics-pipeline.vercel.app",
      github: "https://github.com/christianescamilla15-cell/ad-analytics-pipeline",
      keyMetric: "124 tests, 28 endpoints"
    },
    {
      name: "AI Playground",
      description: {
        en: "Interactive AI demo with 7 use cases: Chat, Document Analysis, RAG Q&A, Content Generation, Data Extraction, Translation, and side-by-side Model Comparison (Claude vs GPT-4o vs Gemini). Real-time cost tracking across all interactions. 98 tests.",
        es: "Demo interactiva con 7 casos de uso: Chat, Análisis de Documentos, Q&A con RAG, Generación de Contenido, Extracción de Datos, Traducción, y Comparación de Modelos lado a lado. Tracking de costos en tiempo real. 98 tests."
      },
      stack: "React, FastAPI, Multi-model (Claude/GPT/Gemini)",
      tests: 98,
      demo: "https://ai-playground-phi-three.vercel.app",
      github: "https://github.com/christianescamilla15-cell/ai-playground",
      keyMetric: "7 use cases, 3 models"
    },
    {
      name: "Synapse Multi-Agent Chatbot",
      description: {
        en: "Customer service chatbot with 5 specialized AI agents (Nova/Sales, Atlas/Support, Aria/Billing, Nexus/Escalation, Orion/General). Uses Claude Tool Use with 6 tools in an agentic loop. Conversational LLM-style responses with multi-intent detection, sentiment analysis, and automatic agent routing. FastAPI + Redis backend, 120 tests. Resolves ~80% of inquiries without human intervention.",
        es: "Chatbot de servicio al cliente con 5 agentes IA especializados. Claude Tool Use con 6 herramientas en loop agéntico. Respuestas conversacionales con detección multi-intento, análisis de sentimiento, y enrutamiento automático. FastAPI + Redis, 120 tests. Resuelve ~80% consultas sin intervención humana."
      },
      stack: "React, FastAPI, Claude API, Redis, pytest",
      tests: 120,
      demo: "https://chatbot-multiagente-ia.vercel.app",
      github: "https://github.com/christianescamilla15-cell/chatbot-multiagente-ia",
      keyMetric: "5 agents, 120 tests, 80% auto-resolution"
    },
    {
      name: "AI Document Pipeline",
      description: {
        en: "Document analysis with 4 CrewAI agents (Researcher, Analyzer, Writer, Reviewer) and 2 MCP servers (Filesystem + Database). 44 pytest tests.",
        es: "Análisis de documentos con 4 agentes CrewAI y 2 servidores MCP. 44 tests."
      },
      stack: "Python, CrewAI, MCP, FastAPI",
      tests: 44,
      demo: "https://ai-document-pipeline.vercel.app",
      github: "https://github.com/christianescamilla15-cell/ai-document-pipeline",
      keyMetric: "4 CrewAI agents, 2 MCP servers"
    },
    {
      name: "FinanceAI Dashboard",
      description: {
        en: "Financial analytics dashboard with statistical anomaly detection (z-score), cash flow forecasting (linear regression), 7 spending categories, CSV import, and AI chatbot with 5 Claude tools.",
        es: "Dashboard financiero con detección de anomalías (z-score), proyección de flujo de caja (regresión lineal), 7 categorías de gasto, importación CSV, y chatbot IA con 5 tools Claude."
      },
      stack: "React, Recharts, Claude API, Python",
      tests: 83,
      demo: "https://finance-ai-dashboard-omega.vercel.app",
      github: "https://github.com/christianescamilla15-cell/finance-ai-dashboard",
      keyMetric: "83 tests, voice AI, anomaly detection"
    },
    {
      name: "Invoice Manager",
      description: {
        en: "Full-stack invoicing system with Laravel 11 + Vue.js 3 + MySQL + Docker. SOLID architecture (Repository, Strategy, Factory patterns). 3 tax strategies (IVA 16%, IVA+ISR retention, Exempt). 68 PHPUnit tests (251 assertions). Dark/light mode.",
        es: "Sistema de facturación full-stack con Laravel 11 + Vue.js 3 + MySQL + Docker. Arquitectura SOLID. 3 estrategias fiscales. 68 tests PHPUnit (251 assertions). Modo oscuro/claro."
      },
      stack: "Laravel 11, Vue.js 3, MySQL, Docker, PHPUnit",
      tests: 68,
      demo: "https://nexusforge-two.vercel.app",
      github: "https://github.com/christianescamilla15-cell/invoice-manager",
      keyMetric: "68 tests, SOLID architecture"
    },
    {
      name: "ContentStudio AI",
      description: {
        en: "Multi-channel content generator with 7-agent agentic pipeline (Brand Analyzer, Audience Profiler, Hook Generator, Viral Scorer, Creative Transformer, Positioning, Platform Optimizer). 5-tier generation: Claude API -> Cloudflare Workers AI (Llama 3.1) -> HuggingFace (Mistral 7B) -> Agentic local -> Templates. Supports Instagram, Twitter/X, LinkedIn, Facebook.",
        es: "Generador de contenido multicanal con pipeline de 7 agentes. 5 niveles de generación: Claude -> Cloudflare AI (Llama 3.1) -> HuggingFace (Mistral 7B) -> Agéntico local -> Templates. Soporta Instagram, Twitter/X, LinkedIn, Facebook."
      },
      stack: "React, Claude API, Cloudflare Workers AI, HuggingFace, Vercel",
      tests: 103,
      demo: "https://content-studio-ai-blush.vercel.app",
      github: "https://github.com/christianescamilla15-cell/content-studio-ai",
      keyMetric: "103 tests, 7-agent pipeline, 5-tier generation"
    },
    {
      name: "HRScout",
      description: {
        en: "AI resume screening with 4-agent agentic pipeline (Skill Extractor, Experience Evaluator, Job Fit Analyzer, Recommendation Engine). Claude Tool Use with 5 tools. PDF/TXT upload, 0-100 scoring with confidence indicators.",
        es: "Filtrado de CVs con IA con pipeline de 4 agentes. Claude Tool Use con 5 tools. Subida PDF/TXT, scoring 0-100 con indicadores de confianza."
      },
      stack: "React, Claude API, FastAPI",
      tests: 103,
      demo: "https://hr-scout-llm.vercel.app",
      github: "https://github.com/christianescamilla15-cell/hr-scout-llm",
      keyMetric: "103 tests, 4-agent pipeline, 0-100 scoring"
    },
    {
      name: "ClientHub",
      description: {
        en: "AI client portal with projects, invoices, tickets, documents. 6 Claude tools, notification center, real-time KPIs, AI assistant.",
        es: "Portal de clientes con IA. Proyectos, facturas, tickets, documentos. 6 tools Claude, notificaciones, KPIs en tiempo real, asistente IA."
      },
      stack: "React, Claude API, Airtable, Softr",
      tests: 113,
      demo: "https://client-hub-nocode.vercel.app",
      github: "https://github.com/christianescamilla15-cell/client-hub-nocode",
      keyMetric: "113 tests, 6 Claude tools, real-time KPIs"
    },
    {
      name: "MindScrolling",
      description: {
        en: "Anti doom-scrolling Flutter app with hybrid AI recommendation (pgvector + EMA). 13,000+ bilingual quotes, 14 CI/CD pipelines. Published on Google Play Store.",
        es: "App Flutter anti doom-scrolling con recomendación IA híbrida (pgvector + EMA). 13,000+ frases bilingües, 14 pipelines CI/CD. Publicada en Google Play Store."
      },
      stack: "Flutter, Node.js/Fastify, Supabase, pgvector",
      demo: "https://appetize.io/embed/b_ys32inbvsel2bx62mf2drptrfe",
      github: "https://github.com/christianescamilla15-cell/MindScrolling"
    },
    {
      name: "NexusForge AI",
      description: {
        en: "Enterprise agent orchestration platform with 22 AI agents, 6 swarm topologies (sequential, parallel, hierarchical, debate, consensus, adaptive), 3-tier memory system, DAG execution engine, self-healing with 5 strategies, RAG pipeline with pgvector, multi-provider LLM router with circuit breaker, and real-time WebSocket monitoring. Includes TypeScript SDK, CLI tool, plugin system, Terraform IaC, and Kubernetes deployment.",
        es: "Plataforma empresarial de orquestación de agentes con 22 agentes IA, 6 topologías de enjambre, sistema de memoria de 3 niveles, motor de ejecución DAG, auto-reparación con 5 estrategias, pipeline RAG con pgvector, router LLM multi-proveedor con circuit breaker, y monitoreo WebSocket en tiempo real. Incluye SDK TypeScript, CLI, plugins, Terraform y Kubernetes."
      },
      stack: "Python, FastAPI, React, PostgreSQL, pgvector, Redis, Docker, Terraform, Kubernetes, Voyage AI, Groq, Claude API",
      tests: 247,
      demo: "https://nexusforge-two.vercel.app",
      github: "https://github.com/christianescamilla15-cell/nexusforge-ai",
      keyMetric: "22 agents, 6 topologies, 247 tests, self-healing"
    },
    {
      name: "WordForge",
      description: {
        en: "AI-powered writing assistant with 12 specialized tools: grammar correction, style adaptation (6 tones), readability analysis (Flesch-Kincaid), plagiarism detection, SEO optimization, translation (8 languages), summarization, paraphrasing, citation generator, keyword density, and sentiment analysis. Claude Tool Use with agentic loop. 205 Vitest tests.",
        es: "Asistente de escritura con IA y 12 herramientas especializadas: corrección gramatical, adaptación de estilo (6 tonos), análisis de legibilidad (Flesch-Kincaid), detección de plagio, optimización SEO, traducción (8 idiomas), resumen, paráfrasis, generador de citas, densidad de keywords, y análisis de sentimiento. Claude Tool Use con loop agéntico. 205 tests Vitest."
      },
      stack: "React, Claude API, Vitest",
      tests: 205,
      demo: "https://wordforge-ai.vercel.app",
      github: "https://github.com/christianescamilla15-cell/wordforge",
      keyMetric: "205 tests, 12 writing tools, 6 tones"
    },
    {
      name: "Playwright Automation",
      description: {
        en: "Automation suite with 3 real scrapers (GitHub repos, e-commerce prices, form submission), SQLite scheduler, CLI tool, and E2E tests for the portfolio. 54 pytest tests. Zero mocks — all scrapers hit real websites.",
        es: "Suite de automatización con 3 scrapers reales (repos GitHub, precios e-commerce, formularios), scheduler SQLite, CLI, y E2E tests para el portfolio. 54 tests pytest. Zero mocks — todos los scrapers consultan sitios reales."
      },
      stack: "Python, Playwright, SQLite, pytest, Docker",
      tests: 54,
      github: "https://github.com/christianescamilla15-cell/playwright-automation",
      keyMetric: "54 tests, 3 real scrapers, SQLite scheduler"
    },
    {
      name: "Fine-tuning Demo",
      description: {
        en: "DistilBERT multilingual fine-tuning for intent classification. 100 training samples across 5 intents (greeting, farewell, help, complaint, info). Full pipeline: data preparation → training → evaluation → inference. 27 pytest tests.",
        es: "Fine-tuning de DistilBERT multilingual para clasificación de intenciones. 100 muestras en 5 intenciones (saludo, despedida, ayuda, queja, info). Pipeline completo: preparación → entrenamiento → evaluación → inferencia. 27 tests pytest."
      },
      stack: "Python, PyTorch, HuggingFace Transformers, scikit-learn",
      tests: 27,
      github: "https://github.com/christianescamilla15-cell/fine-tuning-demo",
      keyMetric: "27 tests, DistilBERT multilingual, 5 intents"
    }
  ],

  skills: {
    en: "AI & LLMs: Claude API, Claude Tool Use (32 integrations), LangChain, CrewAI, MCP, RAG (FAISS + pgvector), GPT-4o, RLHF, Cloudflare Workers AI, HuggingFace, Swarm topologies, DAG execution, Self-healing agents, 3-tier memory. Automation: n8n, Make.com, Zapier, Webhooks, 14 CI/CD pipelines. Python: FastAPI, Pydantic v2, pytest (1,346+ tests), async/await, Docker. Frontend: React, Vue.js 3, Flutter, Tailwind. Data: PostgreSQL, pgvector, MySQL, FAISS, SQLite, Supabase, Redis, Pandas. DevOps: Docker Compose, Terraform, Kubernetes, Vercel, Render, GitHub Actions. Backend: Node.js/Fastify, Laravel 11.",
    es: "IA & LLMs: Claude API, Claude Tool Use (32 integraciones), LangChain, CrewAI, MCP, RAG (FAISS + pgvector), GPT-4o, RLHF, Cloudflare Workers AI, HuggingFace, Topologías de enjambre, Ejecución DAG, Agentes auto-reparables, Memoria 3 niveles. Automatización: n8n, Make.com, Zapier, Webhooks, 14 pipelines CI/CD. Python: FastAPI, Pydantic v2, pytest (1,346+ tests), async/await, Docker. Frontend: React, Vue.js 3, Flutter, Tailwind. Datos: PostgreSQL, pgvector, MySQL, FAISS, SQLite, Supabase, Redis, Pandas. DevOps: Docker Compose, Terraform, Kubernetes, Vercel, Render, GitHub Actions."
  },

  experience: {
    en: "Scale AI / Remotasks (June 2023 - Present): AI Data Specialist — RLHF training for Claude and GPT-4o, prompt engineering (Chain-of-Thought, Few-shot, XML), code evaluation in Python/JavaScript/SQL/Java. Independent AI Builder (January 2025 - Present): Built 18 production systems with 1,346+ tests across 22+ GitHub repos. All with live demos.",
    es: "Scale AI / Remotasks (Junio 2023 - Presente): Especialista en Datos IA — Entrenamiento RLHF para Claude y GPT-4o, prompt engineering, evaluación de código. Constructor IA Independiente (Enero 2025 - Presente): 18 sistemas en producción con 1,346+ tests en 22+ repos GitHub. Todos con demos en vivo."
  },

  contact: {
    en: "Email: chris_231011@hotmail.com | Phone: +52 55 7960 5324 | GitHub: github.com/christianescamilla15-cell | LinkedIn: linkedin.com/in/christianescamilla15-cell | Location: Mexico City (CDMX), Mexico | Available immediately.",
    es: "Email: chris_231011@hotmail.com | Teléfono: +52 55 7960 5324 | GitHub: github.com/christianescamilla15-cell | LinkedIn: linkedin.com/in/christianescamilla15-cell | Ubicación: CDMX, México | Disponible de manera inmediata."
  },

  availability: {
    en: "Available immediately.",
    es: "Disponible de manera inmediata."
  },

  metrics: {
    en: "18 production systems, 1,346+ tests, 22+ GitHub repos, 86% code coverage (best project), 32 Claude Tool Use integrations, 14 CI/CD pipelines, 5-tier AI generation (Claude -> Cloudflare -> HF -> Agentic -> Templates), 80% chatbot auto-resolution rate, 22 AI agents in NexusForge, 6 swarm topologies.",
    es: "18 sistemas en producción, 1,346+ tests, 22+ repos GitHub, 86% cobertura de código, 32 integraciones Claude Tool Use, 14 pipelines CI/CD, 5 niveles de generación IA, 80% resolución automática en chatbot, 22 agentes IA en NexusForge, 6 topologías de enjambre."
  }
}

// Quick actions for the chatbot
export const QUICK_ACTIONS = {
  en: [
    { label: "View all projects", query: "Show me all of Christian's projects with demos" },
    { label: "AI experience", query: "What AI and LLM experience does Christian have?" },
    { label: "Technical skills", query: "What programming languages and tools does Christian use?" },
    { label: "Contact info", query: "How can I contact Christian?" },
    { label: "Availability", query: "Is Christian available for hire?" },
    { label: "Best projects", query: "What are Christian's top 3 most impressive projects?" },
  ],
  es: [
    { label: "Ver proyectos", query: "Muéstrame todos los proyectos de Christian con demos" },
    { label: "Experiencia IA", query: "¿Qué experiencia tiene Christian en IA y LLMs?" },
    { label: "Skills técnicos", query: "¿Qué lenguajes y herramientas usa Christian?" },
    { label: "Contacto", query: "¿Cómo puedo contactar a Christian?" },
    { label: "Disponibilidad", query: "¿Está disponible Christian para contratación?" },
    { label: "Mejores proyectos", query: "¿Cuáles son los 3 proyectos más impresionantes de Christian?" },
  ]
}
