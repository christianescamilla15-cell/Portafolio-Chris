# NexusForge Superagent Upgrades — Solo Herramientas GRATUITAS / Free Tier

> Criterio: 100% open-source (MIT/Apache/BSD) que corre local, o API con tier gratuito funcional.
> Eliminados: DeepL Pro ($30/mo), Apollo.io (paid), Hunter.io (paid-only útil), cualquier cosa solo-pago.

---

## 1. ClassifierAgent → Superagent
**Upgrades FREE:**
1. **SetFit** (Hugging Face, Apache-2.0) — Few-shot classification, 8 ejemplos → modelo entrenado. Local, $0.
2. **LIME** (BSD) — Explainability: "clasificó como urgente PORQUE mencionó 'caída del sistema'". Local, $0.
3. **Active Learning loop** — Selecciona los ejemplos más informativos para etiquetar. Custom code, $0.

**Arquitectura:** SetFit few-shot (local) → LIME explanations → Active Learning para mejorar iterativamente
**Costo:** $0 — todo local con `pip install setfit lime`

---

## 2. ExtractorAgent → Superagent
**Upgrades FREE:**
1. **Instructor + Pydantic** (MIT) — Structured extraction con validación de tipos. `pip install instructor`. $0.
2. **GLiNER** (Apache-2.0) — NER zero-shot, sin fine-tuning. Detecta entidades custom. Local, $0.
3. **Docling** (MIT, IBM) — 65+ formatos (PDF, DOCX, PPTX, HTML) → JSON estructurado. Local, $0.

**Arquitectura:** Docling (parse docs) → GLiNER (entities) → Instructor+Pydantic (structured output)
**Costo:** $0 — todo local

---

## 3. SummarizerAgent → Superagent
**Upgrades FREE:**
1. **Chain-of-Density prompting** — Técnica de prompt que genera resúmenes progresivamente más densos. $0.
2. **Instructor + Pydantic** (MIT) — Structured summaries con campos obligatorios (key_points, action_items). $0.
3. **Map-Reduce pattern** — Divide documentos largos, resume cada parte, combina. Custom code, $0.

**Arquitectura:** Map-Reduce (chunk) → Chain-of-Density (summarize) → Instructor (structure)
**Costo:** $0 — solo prompt engineering + Instructor

---

## 4. SentimentAgent → Superagent
**Upgrades FREE:**
1. **pysentimiento** (MIT) — ES-first emotion + sarcasm + hate speech. 3 líneas de código. Local, $0.
2. **PyABSA** (MIT) — Aspect-based sentiment ("delivery=negative, quality=positive"). Local, $0.
3. **SetFit ABSA** (Apache-2.0) — Few-shot custom domain models (8 ejemplos → modelo por cliente). Local, $0.

**Arquitectura:** pysentimiento (local) → PyABSA aspects → LLM solo para matices complejos
**Costo:** $0 — todo local

---

## 5. TranslatorAgent → Superagent
**Upgrades FREE:**
1. **Argos Translate** (MIT) — Traducción offline ES↔EN, modelos descargables. Local, $0.
2. **Translation Memory con pgvector** — Cache traducciones previas, 40-60% hit rate. Usa PostgreSQL existente. $0.
3. **COMET** (Apache-2.0) — Quality scoring real (no fake confidence), auto-approve >0.85. Local, $0.

**Arquitectura:** TM lookup (pgvector) → Argos Translate (local) → COMET score → quality gate
**Costo:** $0 — Argos reemplaza DeepL Pro

---

## 6. OCRAgent → Superagent
**Upgrades FREE:**
1. **Docling** (MIT, IBM) — OCR + layout analysis + tablas, 65+ formatos, 3.1s/page. Local, $0.
2. **PaddleOCR** (Apache-2.0) — 80+ idiomas, multilingual. Fallback para documentos complejos. Local, $0.
3. **Marker** (GPL) — PDF → Markdown con alta fidelidad. Local, $0.

**Arquitectura:** Docling (primary) → PaddleOCR (fallback multilingual) → Marker (PDF→MD)
**Costo:** $0 — todo local

---

## 7. NormalizerAgent → Superagent
**Upgrades FREE:**
1. **Pandera** (MIT) + **ftfy** (Apache-2.0) — Schema validation + Unicode fix. `pip install pandera ftfy`. $0.
2. **RapidFuzz** (MIT) + **phonenumbers** (Apache-2.0) — Fuzzy matching + phone normalization. $0.
3. **Babel** (BSD) + **python-dateutil** (Apache-2.0) — i18n dates/currencies + date parsing. $0.

**Arquitectura:** ftfy (text cleanup) → phonenumbers+Babel (normalize) → Pandera (validate) → RapidFuzz (dedup)
**Costo:** $0 — todas son bibliotecas pip

---

## 8. AnalyzerAgent → Superagent
**Upgrades FREE:**
1. **PyOD** (BSD) — 50+ algoritmos de anomaly detection. Local, $0.
2. **statsmodels** (BSD) + **pymannkendall** (MIT) — Trend detection + statistical tests. $0.
3. **ydata-profiling** (MIT) — Automated EDA con 1 línea de código. Genera reportes HTML. $0.

**Arquitectura:** ydata-profiling (EDA) → PyOD (anomalies) → statsmodels (trends) → structured report
**Costo:** $0 — todo local

---

## 9. EnricherAgent → Superagent
**Upgrades FREE:**
1. **Firecrawl** (AGPL, self-hosted free) — Web scraping → Markdown limpio. $0 self-hosted.
2. **Crawl4AI** (Apache-2.0) — Scraping optimizado para LLMs, async. Local, $0.
3. **SerpAPI** (free 100 searches/mo) — Google search results structured. Free tier funcional.

**Arquitectura:** SerpAPI (search) → Crawl4AI/Firecrawl (scrape) → LLM (extract + enrich)
**Costo:** $0 con self-hosted scraping, 100 búsquedas gratis/mes

---

## 10. ComplianceAgent → Superagent
**Upgrades FREE:**
1. **Semgrep** (LGPL) — Static analysis con reglas custom para compliance (OWASP, PII). Free, $0.
2. **Presidio** (MIT, Microsoft) — PII detection + anonymization. 30+ entity types. Local, $0.
3. **PyCasbin** (Apache-2.0) — RBAC/ABAC engine para policy enforcement. Local, $0.

**Arquitectura:** Presidio (PII scan) → Semgrep (code/data rules) → PyCasbin (policy check) → report
**Costo:** $0 — todo open-source local

---

## 11. KnowledgeAgent → Superagent
**Upgrades FREE:**
1. **ChromaDB** (Apache-2.0) — Vector DB embebida, zero-config. Local, $0.
2. **FlashRank** (Apache-2.0) — Reranker CPU-only, sub-20ms. Local, $0.
3. **Chonkie** (MIT) — Semantic chunking optimizado. Local, $0.

**Arquitectura:** Chonkie (chunk docs) → ChromaDB (store/search) → FlashRank (rerank) → LLM (answer)
**Costo:** $0 — RAG stack completamente local

---

## 12. RouterAgent → Superagent
**Upgrades FREE:**
1. **RouteLLM** (MIT) — Smart model routing, 50-85% cost reduction. Decide qué modelo usar por query. $0.
2. **LiteLLM** (MIT) — Unified API a 100+ LLMs, fallback chains, cost tracking. $0.
3. **Semantic Router** (MIT) — Intent classification ultrarrápida con embeddings. Local, $0.

**Arquitectura:** Semantic Router (classify intent) → RouteLLM (select model) → LiteLLM (unified call)
**Costo:** $0 — routing inteligente que además AHORRA dinero

---

## 13. ValidatorAgent → Superagent
**Upgrades FREE:**
1. **Guardrails AI** (Apache-2.0) — Validators para LLM output (format, toxicity, PII). $0.
2. **Instructor** (MIT) — Retry con validación Pydantic hasta que output sea correcto. $0.
3. **Cerberus** (ISC) + **jsonschema** (MIT) — Schema validation robusto. $0.

**Arquitectura:** LLM output → Instructor (structure) → Guardrails (validate) → Cerberus (schema check)
**Costo:** $0 — todo local

---

## 14. ReporterAgent → Superagent
**Upgrades FREE:**
1. **Jinja2** (BSD) — Template engine para generar reportes HTML/Markdown. Ya en el stack. $0.
2. **WeasyPrint** (BSD) — HTML → PDF con CSS. Reportes profesionales. Local, $0.
3. **Plotly** (MIT) — Gráficos interactivos embebidos en reportes. $0.

**Arquitectura:** Data → Plotly (charts) → Jinja2 (template) → WeasyPrint (PDF export)
**Costo:** $0 — todo local

---

## 15. ScraperAgent → Superagent
**Upgrades FREE:**
1. **Crawl4AI** (Apache-2.0) — Async scraping optimizado para LLMs, JS rendering. Local, $0.
2. **Trafilatura** (Apache-2.0) — Extracción de texto principal de web pages. Muy rápido. $0.
3. **Playwright** (Apache-2.0) — Browser automation para sites con JS/login. $0.

**Arquitectura:** Trafilatura (fast extract) → Crawl4AI (complex sites) → Playwright (JS-heavy/login)
**Costo:** $0 — todo local

---

## 16. WebhookAgent → Superagent
**Upgrades FREE:**
1. **FastAPI native webhooks** — Ya en el stack. Signature verification con hmac. $0.
2. **Svix** (MIT, self-hosted) — Webhook delivery con retries, management UI. Self-hosted $0.
3. **APScheduler** (MIT) — Retry scheduling para webhooks fallidos. $0.

**Arquitectura:** FastAPI (receive) → hmac (verify) → Svix (deliver outbound) → APScheduler (retry)
**Costo:** $0 — self-hosted

---

## 17. SchedulerAgent → Superagent
**Upgrades FREE:**
1. **APScheduler** (MIT) — Cron + interval + date triggers con PostgreSQL job store. $0.
2. **Huey** (MIT) — Lightweight task queue, mini-mode sin Redis. $0.
3. **Celery Beat** (BSD) — Periodic tasks si ya usas Celery. $0.

**Arquitectura:** APScheduler (scheduling) → Huey (execution queue) → PostgreSQL (persistence)
**Costo:** $0 — todo local, usa PostgreSQL existente

---

## 18. MonitorAgent → Superagent
**Upgrades FREE:**
1. **Langfuse** (MIT, self-hosted) — LLM tracing, prompt management, evals. Self-hosted $0.
2. **OpenLLMetry** (Apache-2.0) — OpenTelemetry para LLMs. Integra con Grafana. $0.
3. **Sentry** (BSL, free tier 5K events/mo) — Error tracking con context. Free tier funcional.

**Arquitectura:** OpenLLMetry (trace calls) → Langfuse (LLM-specific) → Sentry (errors) → alerts
**Costo:** $0 self-hosted, o free tier de Sentry

---

## 19. PlannerAgent → Superagent
**Upgrades FREE:**
1. **LangGraph** (MIT) — Graph-based state machines para planning multi-step. $0.
2. **Plan-and-Execute pattern** — Prompt pattern: generate plan → execute steps → replan on failure. $0.
3. **Tree of Thought** — Branching exploration de opciones antes de decidir. Prompt technique, $0.

**Arquitectura:** Tree of Thought (explore) → LangGraph (state machine) → Plan-and-Execute (iterate)
**Costo:** $0 — prompt engineering + LangGraph

---

## 20. ResearcherAgent → Superagent
**Upgrades FREE:**
1. **Tavily** (free 1,000 searches/mo) — AI-optimized search API. Free tier generoso.
2. **Crawl4AI** (Apache-2.0) — Scrape resultados de búsqueda. Local, $0.
3. **LangGraph ReAct** — Reason+Act loop: search → read → reason → search again. $0.

**Arquitectura:** Tavily (search) → Crawl4AI (deep read) → ReAct loop (iterate) → structured report
**Costo:** $0 con 1,000 búsquedas/mes gratis

---

## 21. RepairAgent → Superagent
**Upgrades FREE:**
1. **Tenacity** (Apache-2.0) — Retry con exponential backoff + jitter. `pip install tenacity`. $0.
2. **PyBreaker** (BSD) — Circuit breaker pattern para evitar loops costosos. $0.
3. **Hypothesis** (MPL-2.0) — Property-based testing para encontrar edge cases automáticamente. $0.

**Arquitectura:** Tenacity (retry) → PyBreaker (circuit break) → Hypothesis (test edge cases) → auto-fix
**Costo:** $0 — todo local

---

## 22. CriticAgent → Superagent
**Upgrades FREE:**
1. **Guardrails AI** (Apache-2.0) — Validators para quality/toxicity/factuality. $0.
2. **DeepEval** (Apache-2.0) — 14+ LLM evaluation metrics (faithfulness, relevancy, hallucination). $0.
3. **RAGAS** (Apache-2.0) — RAG evaluation framework (context precision, answer relevancy). $0.

**Arquitectura:** DeepEval (evaluate) → RAGAS (RAG quality) → Guardrails (validate) → score + feedback
**Costo:** $0 — todo open-source

---

## 23. JudgeAgent → Superagent
**Upgrades FREE:**
1. **LLM-as-Judge pattern** — Prompt technique con rubrics estructurados. $0 (usa LLM existente).
2. **DeepEval** (Apache-2.0) — G-Eval protocol para scoring con chain-of-thought. $0.
3. **Multi-Agent Debate** — Múltiples agentes debaten y votan. Custom pattern, $0.

**Arquitectura:** Multi-Agent Debate → DeepEval G-Eval (score) → LLM-as-Judge (final verdict)
**Costo:** $0 — prompt patterns + DeepEval

---

## 24. AnalyticsAgent → Superagent
**Upgrades FREE:**
1. **Plotly** (MIT) — Gráficos interactivos, dashboards. $0.
2. **DuckDB** (MIT) — SQL analytics engine in-process, 0 config. Ultra rápido. $0.
3. **ydata-profiling** (MIT) — Automated profiling reports. $0.

**Arquitectura:** DuckDB (query) → ydata-profiling (profile) → Plotly (visualize) → LLM (narrate)
**Costo:** $0 — todo local

---

## Resumen: Stack Gratuito Completo

### Bibliotecas más impactantes (aparecen en múltiples agentes):
| Biblioteca | Licencia | Agentes que la usan | Impacto |
|---|---|---|---|
| **Instructor+Pydantic** | MIT | Extractor, Summarizer, Validator | Structured LLM output |
| **Crawl4AI** | Apache-2.0 | Enricher, Scraper, Researcher | Web scraping para LLMs |
| **DeepEval** | Apache-2.0 | Critic, Judge | LLM evaluation |
| **Guardrails AI** | Apache-2.0 | Validator, Critic | Output validation |
| **SetFit** | Apache-2.0 | Classifier, Sentiment | Few-shot models |
| **Docling** | MIT | Extractor, OCR | Document processing |
| **ChromaDB** | Apache-2.0 | Knowledge | Vector search |
| **APScheduler** | MIT | Scheduler, Webhook | Task scheduling |
| **LangGraph** | MIT | Planner, Router | State machines |
| **Plotly** | MIT | Reporter, Analytics | Visualization |
| **Tenacity** | Apache-2.0 | Repair, all agents | Retry logic |
| **pysentimiento** | MIT | Sentiment | ES-first NLP |

### Costo total: $0/mes
Todo corre local o tiene free tier funcional. Sin APIs de pago obligatorias.

### Orden de implementación sugerido (por impacto/esfuerzo):
1. **Instructor+Pydantic** → 30min, mejora 5+ agentes de golpe
2. **Tenacity** → 15min, retry en todos los agentes
3. **Guardrails AI** → 1hr, validation en Validator+Critic
4. **SetFit** → 2hr, clasificación few-shot en Classifier+Sentiment
5. **Crawl4AI** → 1hr, scraping en Enricher+Scraper+Researcher
6. **ChromaDB + FlashRank** → 2hr, RAG en KnowledgeAgent
7. **DeepEval** → 1hr, evaluation en Critic+Judge
8. **pysentimiento** → 30min, sentiment ES-first
9. **Docling** → 1hr, document processing en OCR+Extractor
10. **LiteLLM + RouteLLM** → 2hr, routing inteligente + ahorro de costos
