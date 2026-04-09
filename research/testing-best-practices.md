# NexusForge — Testing Best Practices Research

> Fuentes: CrewAI, LangChain, AutoGen, ZenML (1,200 deploys), OWASP LLM Top 10 2025

## Top 10 bugs más comunes en LLM SaaS (por frecuencia):

| # | Bug | Detección | NexusForge Status |
|---|-----|-----------|-------------------|
| 1 | Prompt injection via user input | Red team tests + security markers | No testeado |
| 2 | Missing object-level auth (BOLA/IDOR) | Cross-user ownership tests | FIXED (Round 1+4) |
| 3 | Runaway agent loop (no max_turns) | Max-step enforcement | Partial (retry capped, swarms no) |
| 4 | Agent state bleed in parallel | Shared-reference mutation test | No testeado |
| 5 | LLM output schema drift | Pydantic per-agent schemas | Partial (6/24 agents) |
| 6 | Cross-tenant memory leak | Isolated memory test | No testeado |
| 7 | JWT default secret | Config validation | FIXED |
| 8 | Rate limit bypass | Mock 429 tests | FIXED (atomic SQL) |
| 9 | Circuit breaker never resets | Time-based reset test | Partial |
| 10 | Tool cost runaway | Cost ceiling test | No testeado |

## Patterns a implementar (prioridad):

### 1. VCR Cassettes (CrewAI pattern)
Grabar respuestas reales de LLM y replayarlas en CI. Zero API cost en tests.

### 2. Ownership tests (test_ownership.py)
Cross-user request tests para CADA endpoint CRUD.

### 3. MAX_AGENTS_PER_RUN guard
Swarms no tienen cap — agregar `MAX_AGENTS_PER_RUN = 20` en BaseSwarm.

### 4. Per-agent Pydantic output schemas
Validar output de CADA agente contra schema tipado. Atrapa LLM drift automáticamente.

### 5. Prompt injection tests
Payloads conocidos → verificar que output sigue en schema válido.

### 6. Cost ceiling test
`assert result.total_cost <= MAX_COST_USD` en cada workflow run.

## Lo que NexusForge ya hace bien:
- DAG cycle detection: fully tested
- State machine transitions: fully tested
- Circuit breaker thresholds: tested
- Healing strategy routing: well-covered
- Cost calculation precision: tested
- Registry integrity: verified
- Auth on all CRUD: FIXED
- 260/260 tests passing consistently
