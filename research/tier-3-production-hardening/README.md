# Tier 3 — Production Hardening

Tools for enterprise-grade security, deployment, and scale.

## Security & Auth
- **Better-Auth** — https://better-auth.com — Open-source auth (Lucia successor), self-hosted
- **Clerk** — https://clerk.com — Managed auth with pre-built UI, free 10K MAU
- **Supabase Auth** — https://supabase.com/auth — Auth + RLS, cheapest at $0.003/MAU
- **Arcjet** — https://arcjet.com — Prompt injection defense + rate limiting + bot detection
- **Infisical** — https://infisical.com — Open-source secrets management (MIT), replaces .env
- **Doppler** — https://doppler.com — Cloud secrets manager, free 5 users
- **Unkey** — https://unkey.com — API key management with per-key rate limiting
- **Casbin** — https://casbin.apache.org — Embeddable RBAC/ABAC (Python: PyCasbin)
- **Permit.io** — https://permit.io — Authorization-as-a-service (RBAC + ABAC + ReBAC)
- **PostgreSQL RLS** — Row-level security for multi-tenant isolation
- **Upstash Ratelimit** — https://upstash.com — Serverless rate limiting

## Deployment & Infrastructure
- **Railway** ($5/mo) — https://railway.com — Replace Render free tier, no sleep
- **Fly.io** — https://fly.io — Edge deployment, Firecracker microVMs, 35+ regions
- **Modal** ($30 free) — https://modal.com — Serverless GPU, scale-to-zero
- **Koyeb** (free tier) — https://koyeb.com — Serverless with GPU, acquired by Mistral AI
- **Cloudflare AI Gateway** (free) — https://workers.cloudflare.com — Cache/log LLM calls at edge
- **Neon** (free) — https://neon.tech — Serverless Postgres with branching
- **Turso** ($4.99/mo) — https://turso.tech — Distributed SQLite at the edge
- **Upstash QStash** — https://upstash.com — Serverless message queue, no Redis needed

## CI/CD & DevOps
- **CML** — https://cml.dev — ML-specific CI/CD, auto-generates PR reports
- **DVC** — https://dvc.org — Version control for data and ML pipelines
- **Pulumi** — https://pulumi.com — Infrastructure as Code in Python
- **GrowthBook** (free) — https://growthbook.io — Feature flags + A/B testing
- **Unleash** (free self-hosted) — https://getunleash.io — Open-source feature flags

## AI Coding Tools & IDE
- **OpenCode** (95K stars) — https://github.com/sst/opencode — Open-source terminal AI agent
- **Cline** (58K stars) — https://github.com/cline/cline — Autonomous VS Code agent
- **Roo Code** (22K stars) — https://github.com/RooCodeInc/Roo-Code — Custom agent modes in VS Code
- **Continue** (32K stars) — https://github.com/continuedev/continue — Open-source AI code assistant
- **Aider** (30K stars) — https://github.com/Aider-AI/aider — Git-native AI pair programmer
- **OpenAI Codex CLI** — https://github.com/openai/codex — Terminal agent with skills system
- **AIChat** (29K stars) — https://github.com/sigoden/aichat — All-in-one LLM CLI

## Agent SDKs
- **Claude Agent SDK** — https://platform.claude.com/docs/en/agent-sdk/overview — Subagents, tools, MCP
- **OpenAI Agents SDK** — https://openai.github.io/openai-agents-python — Handoff pattern
- **Google ADK** — https://google.github.io/adk — Multi-agent with streaming
- **Vercel AI SDK** — https://sdk.vercel.ai — React streaming-first
- **Mastra** (19K stars) — https://github.com/mastra-ai/mastra — TypeScript-first agents

## MCP Servers (5,000+ ecosystem)
- **Filesystem MCP** — Safe file operations
- **Git MCP** — Version control
- **PostgreSQL MCP** — Natural language DB queries
- **Semgrep MCP** — Security scanning in agent workflow
- **GitHub MCP** — PR/Issue/Actions automation
- **Firecrawl MCP** — Fetch URLs as clean Markdown

## Scaffolding & Templates
- **Copier** — https://github.com/copier-org/copier — Template updates for existing projects
- **Cookiecutter** — https://github.com/cookiecutter/cookiecutter — Largest template ecosystem
- **Plop** (7.6K stars) — https://github.com/plopjs/plop — Micro-generator
- **Hygen** (6K stars) — https://github.com/jondot/hygen — Fast embedded templates
- **Mason CLI** — https://github.com/felangel/mason — Dart/Flutter brick system

## Workflow Automation Platforms
- **n8n** — https://github.com/n8n-io/n8n — Visual workflow, 400+ integrations
- **Activepieces** — https://github.com/activepieces/activepieces — MIT license automation
- **Windmill** — https://github.com/windmill-labs/windmill — Developer-first workflows
- **Trigger.dev** — https://github.com/triggerdotdev/trigger.dev — Long-running tasks with checkpointing

## Dashboards & BI
- **Grafana AI Observability** — https://grafana.com — Pre-built AI dashboards
- **Metabase** (46.7K stars) — https://github.com/metabase/metabase — Self-service analytics
- **Apache Superset** (72.2K stars) — https://github.com/apache/superset — Enterprise BI
- **Evidence** (6.1K stars) — https://github.com/evidence-dev/evidence — Code-first BI reports

## Advanced Patterns (from research)
- **VIGIL Reflection Daemon** — Async agent that watches other agents for failures
- **Circuit Breaker** — Prevent $47K infinite agent loops
- **Event Sourcing (ESAA)** — Append-only audit trail + replay for agent executions
- **Multi-Agent Reflexion (MAR)** — Multiple critics analyze failed reasoning
- **Spec-First Development** — Requirements before code (Kiro pattern)
- **Factory Structured Summarization** — Preserves technical details during compression
