# Auditoría Exhaustiva de 24 Superagentes — Resultados

> Cada agente fue evaluado en ejecución real (no demo). Foco: bugs, edge cases, fallbacks, y backup models.

---

## Tabla Resumen: Veredicto por Agente

| # | Agente | Deterministic Layer | Fallback Quality | Bugs Críticos | Backup Model (Ollama) |
|---|--------|-------------------|-----------------|---------------|----------------------|
| 1 | ClassifierAgent | ❌ No tiene | ✅ Útil (general) | `category` sin enum, 500 chars muy corto | `mistral:7b-instruct` |
| 2 | ExtractorAgent | ❌ No tiene | ⚠️ Schema inconsistente | `max_tokens=1024` trunca entities, `type` sin enum | `llama3.1:8b` |
| 3 | SummarizerAgent | ❌ No tiene | ✅ Mejor fallback (text[:200]) | `word_count` es LLM-reportado (miente) | `llama3.1:8b` |
| 4 | SentimentAgent | ❌ No tiene | ✅ Correcto (neutral) | `sentiment` sin Literal constraint | `mistral:7b-instruct` |
| 5 | ValidatorAgent | ✅ Excelente (2-layer) | ✅ Inteligente | Empty-list false positives en structural check | `mistral:7b-instruct` |
| 6 | ScraperAgent | ✅ Crawl4AI+httpx | ✅ Raw content fallback | `_scraping.method` detection logic mal | `llama3.1:8b` |
| 7 | PlannerAgent | ✅ Local validation | ⚠️ Plan vacío | Cycle detection incompleta, LLM verify se salta cuando hay errores | `llama3.1:8b` (o `70b`) |
| 8 | CriticAgent | ✅ Weighted score | ⚠️ **`pass:True` en fallback (fail-open)** | **CRÍTICO: fallback aprueba todo**, no hay CriticScore schema | `llama3.1:8b` |
| 9 | RouterAgent | ✅ Keyword matching | ✅ Classifier fallback | Keywords muy limitados (6/agent), confidence fabricada | `phi-3:mini` |
| 10 | KnowledgeAgent | ✅ Query rewriting | ✅ Chunk metadata | SemanticMemory se instancia nuevo cada vez, relevance posicional | `llama3.1:8b` |
| 11 | ResearcherAgent | ⚠️ DDG scraping (frágil) | ⚠️ LLM fabrica sources | DDG dará CAPTCHA, solo scrapea página de resultados no contenido real | `llama3.1:8b` + Tavily |
| 12 | RepairAgent | ✅ Excelente (3-layer) | ✅ Heuristic rules | Cache en memoria (pierde en restart), success se registra antes de verificar | `phi-3:mini` |
| 13 | EnricherAgent | ⚠️ DDG scraping | ⚠️ Preserva entities | 3 requests secuenciales (30s worst case), sin timeout | `llama3.1:8b` |
| 14 | NormalizerAgent | ✅ Excelente (deterministic) | ✅ Stats sin LLM | **Bug DD/MM vs MM/DD** (locale MX), currency regex falso positivo en IDs | `phi-3:mini` |
| 15 | ReporterAgent | ✅ _build_markdown fallback | ✅ Structured sections | `word_count` LLM-reportado, temperature=0.4 muy alto, `outputs` leak _memory | `llama3.1:8b` |
| 16 | OCRAgent | ✅ PyPDF2 real | ⚠️ Hallucina sin PDF | Ruta `description` genera text ficticio, no es OCR real | `mistral:7b` + `pytesseract` |
| 17 | TranslatorAgent | ✅ Same-lang passthrough | ❌ Pierde texto original | Solo detecta ES/EN, back-translation no compara nada | `mistral:7b` |
| 18 | AnalyzerAgent | ✅ **Mejor diseño del codebase** | ✅ Stats completas | `max_tokens=512` puede truncar JSON, stats_json en prompt riesgoso | `llama3.1:8b` |
| 19 | MonitorAgent | ✅ EMA adaptativo | ✅ Status sin LLM | **Bug: EMA variance usa mean actualizado** (underestima std), baselines sin namespace | `llama3.1:8b` |
| 20 | SchedulerAgent | ✅ NLP→cron (13 patterns) | ❌ "Sequential" inútil | Falta AM/PM, "cada N horas", 9AM hardcoded | `llama3.1:8b` + `croniter` |
| 21 | ComplianceAgent | ✅ PII regex + Luhn | ✅ Risk score sin LLM | **phone_mx/IP/passport tienen falsos positivos severos** | `mistral:7b` |
| 22 | WebhookAgent | ✅ **Mejor código infra** | N/A (no LLM) | Sin idempotency key, sin URL validation, sin payload size limit | N/A |
| 23 | JudgeAgent (Consensus) | ✅ Borda Count math | ⚠️ First-wins arbitrary | Sin quorum check, error outputs van al judge, self-referential bias | Modelo DIFERENTE al de agents |
| 24 | CircuitBreaker | ✅ Buen diseño | N/A | **CÓDIGO MUERTO — nunca invocado por ningún agente** | N/A |

---

## Bugs Críticos (Arreglar Primero)

### 1. 🔴 CriticAgent fallback `pass: True` (FAIL-OPEN)
**Archivo:** `critic.py:89`
**Bug:** Cuando LLM falla, el fallback retorna `"pass": True, "overall_score": 50`. Cualquier pipeline que gate en `critic.output["pass"]` aprobará output basura.
**Fix:** Cambiar a `"pass": False` (fail-closed).

### 2. 🔴 `json.loads()` sin limpiar markdown fences (TODOS los agentes)
**Bug:** Groq/Claude ocasionalmente envuelven JSON en ` ```json...``` `. Esto causa `JSONDecodeError` → fallback silencioso en TODOS los agentes.
**Fix:** Agregar utility `clean_llm_json()` antes de cada `json.loads()`.

### 3. 🔴 CircuitBreaker nunca invocado (código muerto)
**Archivo:** `circuit_breaker.py` + `healer.py`
**Bug:** `BaseAgent._resilient_llm_call()` llama a `router.chat()` directo. Nunca consulta `get_circuit_breaker().is_available()`. El circuit breaker solo se usa en `healer.py` (post-failure), no pre-execution.
**Fix:** Agregar check en `BaseAgent.run()` antes de `execute()`.

### 4. 🔴 `_resilient_llm_call` no retries provider exceptions reales
**Archivo:** `base.py:107`
**Bug:** Solo retries `RuntimeError, ConnectionError, TimeoutError`. Groq lanza `groq.APIConnectionError`, `groq.RateLimitError`. Anthropic lanza `anthropic.APIStatusError`. Ninguno hereda de esos 3. Los retries de tenacity **nunca se activan** para errores reales de providers.
**Fix:** Cambiar a `retry_if_exception_type(Exception)` con un guard que excluya `ValueError, TypeError, KeyError`.

### 5. 🔴 NormalizerAgent: DD/MM vs MM/DD bug
**Archivo:** `normalizer.py:27`
**Bug:** `01/02/2026` → `2026-01-02` (Jan 2). En México/LatAm, `01/02` = 1 de febrero. El agente produce fechas incorrectas para locale MX.
**Fix:** Default DD/MM/YYYY o hacer configurable por locale.

### 6. 🔴 MonitorAgent: EMA variance formula incorrecta
**Archivo:** `monitor.py:33`
**Bug:** `variance = alpha * (value - b["mean"])^2` usa el mean YA actualizado. Debería usar el old_mean. Esto underestima el std_dev → más falsos positivos en anomaly detection.
**Fix:** Guardar `old_mean` antes de actualizar.

---

## Bugs Altos (Segunda Prioridad)

| # | Bug | Archivo | Fix |
|---|-----|---------|-----|
| 7 | ComplianceAgent phone_mx falso positivo en cualquier 8 dígitos | compliance.py:11 | Agregar context check (prefijo tel/phone) |
| 8 | ComplianceAgent passport regex muy amplio (matchea SKUs) | compliance.py:16 | Restringir o requerir context word |
| 9 | PlannerAgent: LLM verify se SALTA cuando local_issues existen | planner.py:115 | Invertir condición: correr verify ESPECIALMENTE cuando hay issues |
| 10 | EnricherAgent: 3 web requests secuenciales (30s worst case) | enricher.py:43 | Usar `asyncio.gather()` para paralelizar |
| 11 | ResearcherAgent: DDG dará CAPTCHAs en producción | researcher.py:43 | Reemplazar con Tavily free tier o SerpAPI |
| 12 | ExtractorAgent: `max_tokens=1024` trunca entities en docs largos | extractor.py:46 | Aumentar a 2048 |
| 13 | Pydantic schemas: `category`, `sentiment`, `type` sin Literal | output_schemas.py | Agregar Literal constraints |
| 14 | OutputSchemas: 6 agentes no tienen schema (OCR, Translation, etc.) | output_schemas.py | Agregar schemas faltantes |
| 15 | TranslatorAgent: fallback pierde texto original | translator.py:100 | Retornar `original_text` en fallback |
| 16 | SchedulerAgent: sin AM/PM, sin "cada N horas" | scheduler.py | Agregar patterns faltantes |

---

## Mejoras por Implementar (Ordenadas por Impacto)

### Fase 1: Fixes Críticos (1-2 horas)
1. `clean_llm_json()` utility para todos los agentes
2. CriticAgent `pass: False` en fallback
3. Fix `_resilient_llm_call` retry exception types
4. Wire CircuitBreaker en `BaseAgent.run()`
5. Fix NormalizerAgent DD/MM
6. Fix MonitorAgent EMA variance

### Fase 2: Pydantic + Validation (1-2 horas)
7. Literal enums en ClassificationResult, SentimentResult, ExtractedEntity
8. Agregar schemas: OCRResult, TranslationResult, AnalysisResult, MonitorResult, ComplianceResult, ScheduleResult, CriticResult
9. Wire schemas en agentes que no los usan

### Fase 3: Reliability (2-3 horas)
10. ComplianceAgent: fix PII regex false positives
11. EnricherAgent: parallelize web requests
12. ResearcherAgent: replace DDG with Tavily/httpx search
13. PlannerAgent: fix verify condition + cycle detection
14. ExtractorAgent: increase max_tokens
15. ReporterAgent: compute word_count, lower temperature

### Fase 4: Backup LLM (1 hora)
16. Agregar Ollama provider al LLMRouter como tercer tier
17. Configurar `llama3.1:8b` como modelo por defecto
18. Para agentes simples (Router, Repair, Normalizer): usar `phi-3:mini`
19. Para JudgeAgent: usar modelo DIFERENTE al de los agents evaluados

---

## Backup Model Matrix

| Agente | Tarea Principal | Modelo Primario | Backup 1 | Backup 2 (Ollama local) |
|--------|----------------|-----------------|----------|------------------------|
| Classifier | 5-category classification | Groq llama-3.3-70b | Claude | `mistral:7b-instruct` |
| Extractor | NER + structured extraction | Groq llama-3.3-70b | Claude | `llama3.1:8b` |
| Summarizer | Text summarization | Groq llama-3.3-70b | Claude | `llama3.1:8b` |
| Sentiment | Sentiment analysis | Groq llama-3.3-70b | Claude | `mistral:7b-instruct` |
| Validator | Output quality gate | Groq llama-3.3-70b | Claude | `mistral:7b-instruct` |
| Scraper | Web content extraction | Groq llama-3.3-70b | Claude | `llama3.1:8b` |
| Planner | Task decomposition | Groq llama-3.3-70b | Claude | `llama3.1:8b` (o 70b) |
| Critic | Multi-rubric evaluation | Groq llama-3.3-70b | Claude | `llama3.1:8b` |
| Router | Intent classification | Groq llama-3.3-70b | Claude | `phi-3:mini` |
| Knowledge | RAG Q&A | Groq llama-3.3-70b | Claude | `llama3.1:8b` |
| Researcher | Web research synthesis | Groq llama-3.3-70b | Claude | `llama3.1:8b` |
| Repair | Error diagnosis | Groq llama-3.3-70b | Claude | `phi-3:mini` |
| Enricher | Entity enrichment | Groq llama-3.3-70b | Claude | `llama3.1:8b` |
| Normalizer | Data normalization | Groq llama-3.3-70b | Claude | `phi-3:mini` |
| Reporter | Report generation | Groq llama-3.3-70b | Claude | `llama3.1:8b` (o `mistral:7b`) |
| OCR | Document extraction | Groq llama-3.3-70b | Claude | `mistral:7b` + `pytesseract` |
| Translator | Translation | Groq llama-3.3-70b | Claude | `mistral:7b` |
| Analyzer | Statistical + sentiment | Groq llama-3.3-70b | Claude | `llama3.1:8b` |
| Monitor | Health monitoring | Groq llama-3.3-70b | Claude | `llama3.1:8b` |
| Scheduler | Cron + NLP dates | Groq llama-3.3-70b | Claude | `llama3.1:8b` + `croniter` |
| Compliance | PII + regulatory | Groq llama-3.3-70b | Claude | `mistral:7b` |
| Webhook | HTTP delivery | N/A | N/A | N/A |
| Judge | Consensus ranking | Groq llama-3.3-70b | Claude | **Modelo DIFERENTE** a los agents |
| CircuitBreaker | Health tracking | N/A | N/A | N/A |

---

## Top 3 Agentes Mejor Diseñados
1. **AnalyzerAgent** — deterministic stats excelentes, mejor fallback, diseño más robusto
2. **WebhookAgent** — mejor código de infraestructura, HMAC correcto, retry correcto
3. **ValidatorAgent** — 2-layer design (deterministic + LLM) es el patrón correcto

## Top 3 Agentes que Necesitan Más Trabajo
1. **ResearcherAgent** — DDG scraping va a fallar en producción, sources fabricadas
2. **OCRAgent** — ruta `description` no es OCR, es ficción generativa
3. **ComplianceAgent** — PII regex tiene falsos positivos severos que invalidan el análisis
