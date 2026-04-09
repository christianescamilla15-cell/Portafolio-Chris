# 🧠 Multi-Agent Build System

> Sistema autónomo de 6 agentes especializados que diseñan, desarrollan, testean, revisan, documentan y despliegan proyectos completos sin intervención manual.

---

## ¿Qué hace?

Un solo comando construye un proyecto completo de principio a fin. El **Orchestrator** coordina 6 agentes en pipeline secuencial, cada uno con una responsabilidad específica:

```
python orchestrator.py --project 1

Orchestrator
    ├─▶ [FASE 1] Arquitecto    → architecture.json
    ├─▶ [FASE 2] Developer     → código fuente completo
    ├─▶ [FASE 3] QA Tester     → qa_report.json (pruebas automatizadas)
    ├─▶ [FASE 4] Reviewer      → review.json (quality score 0-100)
    ├─▶ [FASE 5] Documentador  → README.md + API.md + DEPLOYMENT.md
    └─▶ [FASE 6] Deployer      → docker-compose.yml + deploy.sh + .env
```

## Dashboard en tiempo real

```
══════════════════════════════════════════════════════════════════
  🤖 MULTI-AGENT BUILD SYSTEM — DASHBOARD
  ──────────────────────────────────────────────────────────────
  ✅ Chatbot Multiagente          ████████████████████ 100%
  ◉  ContentStudio                █████████░░░░░░░░░░░  45% [Developer]
  ○  FinanceAI                    ░░░░░░░░░░░░░░░░░░░░   0%
  ──────────────────────────────────────────────────────────────
```

## Agentes

| Agente | Responsabilidad | Output |
|--------|----------------|--------|
| 🎯 Orchestrator | Coordina el pipeline y genera reporte final | `build_result.json` |
| 🏗️ Arquitecto | Diseña patrón, capas, endpoints, schema DB | `architecture.json` |
| 💻 Developer | Genera frontend, backend y configuración | Código fuente |
| 🧪 QA Tester | Evalúa estructura, seguridad, performance | `qa_report.json` |
| 🔍 Reviewer | Audita calidad con score por dimensión | `review.json` |
| 📝 Documentador | README + guía de deploy + docs de API | Archivos `.md` |
| 🚀 Deployer | Docker, variables de entorno, script bash | Infra config |

## Instalación

```bash
# Requisitos: Python 3.9+ y ANTHROPIC_API_KEY
git clone https://github.com/christianescamilla15-cell/multi-agent-build-system
cd multi-agent-build-system
pip install -r requirements.txt
export ANTHROPIC_API_KEY=sk-ant-tu-clave
```

## Uso

```bash
python orchestrator.py                  # Construye los 5 proyectos
python orchestrator.py --project 1      # Solo un proyecto
python orchestrator.py --list           # Ver proyectos disponibles
python orchestrator.py --status         # Estado actual
```

## Output por proyecto

```
output/chatbot-multiagente/
├── architecture.json
├── src/App.jsx
├── backend/server.js
├── package.json
├── .env.example
├── qa_report.json       ← passed/failed/warnings
├── review.json          ← quality_score, scores por dimensión
├── README.md
├── DEPLOYMENT.md
├── API.md
├── docker-compose.yml
├── deploy.sh
└── build_result.json
```

## Costo estimado

| Escenario | Llamadas API | Costo aprox |
|-----------|-------------|-------------|
| 1 proyecto | ~12 calls | ~$0.02 |
| 5 proyectos | ~60 calls | ~$0.10 |

*Usa Claude Haiku para máxima eficiencia de costo.*

## Stack

`Python` `Claude API (Haiku)` `anthropic SDK` `Claude Code`

---

[![Portfolio](https://img.shields.io/badge/Portfolio-ch65--portfolio-6366F1?style=flat)](https://ch65-portfolio.vercel.app)
