# Portfolio Intelligence API — Middleware Architecture

## Overview

The Portfolio Intelligence API is a **middleware layer** that sits between the React frontend and multiple AI/data providers. It handles request routing, multi-provider failover, rate limiting, analytics tracking, visitor classification, semantic search, and response normalization — all deployed as Vercel Serverless Functions.

This is not a simple proxy. It is a stateful middleware that makes routing decisions, enriches requests with context, applies security policies, and normalizes heterogeneous provider responses into a unified format.

## Middleware Pattern

```
Client (React SPA)
       │
       ▼
API Gateway (Vercel Serverless Functions)
       │
       ▼
┌─────────────────────────────────────────┐
│         MIDDLEWARE LAYER                 │
│                                         │
│  ┌─────────┐  ┌──────────┐  ┌────────┐ │
│  │  CORS   │→ │Rate Limit│→ │Analytics│ │
│  │ Handler │  │ (sliding  │  │(fire &  │ │
│  │         │  │  window)  │  │ forget) │ │
│  └─────────┘  └──────────┘  └────────┘ │
│       │                                 │
│       ▼                                 │
│  ┌──────────────────────────────┐       │
│  │     Provider Router          │       │
│  │  (failover + normalization)  │       │
│  └──────────────────────────────┘       │
└─────────────────────────────────────────┘
       │
       ▼
┌──────┬──────┬──────┬──────┬──────┐
│ Groq │ CF   │  HF  │Voyage│GitHub│
│(LLM) │Workers│(ML) │ AI   │ API  │
│      │AI(LLM)│     │(Embed)│     │
└──────┴──────┴──────┴──────┴──────┘
       │
       ▼
┌──────────────────────────────────┐
│  Supabase (PostgreSQL + pgvector)│
│  - rate_limits table             │
│  - analytics_events table        │
│  - portfolio_projects table      │
│  - portfolio_meta table          │
└──────────────────────────────────┘
```

## Middleware Components

### 1. CORS Handler (`api/_lib/cors.js`)

Origin-whitelist security middleware applied to every endpoint.

- **Whitelist-based origin validation** via `ALLOWED_ORIGINS` env var (comma-separated)
- **Preflight (OPTIONS) request handling** — returns true so the caller can short-circuit
- Supports wildcard (`*`) for development
- Sets `Access-Control-Allow-Methods: POST, GET, OPTIONS`
- Allows `Content-Type` and `X-Admin-Key` headers

### 2. Rate Limiter (`api/_lib/rateLimit.js`)

Sliding-window rate limiter backed by Supabase.

- **Sliding window algorithm**: counts requests in the last 60 seconds per IP+endpoint
- **Per-endpoint limits**: 30 req/min for `/api/chat`, 60 req/min for `/api/classify` and `/api/recommend`
- **IP tracking**: SHA-256 hashed (first 16 chars) for privacy — never stores raw IPs
- **Fail-open design**: if Supabase is unavailable, requests pass through (no blocking)
- **Fire-and-forget logging**: rate limit entries inserted asynchronously

### 3. Analytics Middleware (`api/_lib/analytics.js`)

Non-blocking event telemetry stored in Supabase.

- **Fire-and-forget**: `logEvent()` never blocks the response — uses `.then().catch()` pattern
- **Tracked fields**: `event_type`, `visitor_type`, `query` (truncated to 200 chars), `provider`, `response_time_ms`, `lang`, `ip_hash`
- **IP hashing**: `hashIP()` extracts IP from `x-forwarded-for` / `x-real-ip` / socket, then SHA-256 hashes it
- Stored in `analytics_events` table in Supabase

### 4. Knowledge Base Loader (`api/_lib/kb-loader.js`)

Cached data layer with automatic fallback.

- **In-memory TTL cache**: 5-minute TTL, survives warm Vercel function instances
- **Supabase-first**: loads projects + meta from `portfolio_projects` and `portfolio_meta` tables
- **Hardcoded fallback**: if Supabase is unavailable, falls back to `PORTFOLIO_KB` in `kb.js`
- **Bilingual**: all content stored in `en` and `es` variants

### 5. Embeddings Client (`api/_lib/embeddings.js`)

Vector embedding generation via Voyage AI.

- **Model**: `voyage-3-lite` (512 dimensions, fast, multilingual)
- Used by the recommendation endpoint for semantic search
- Returns raw embedding array for pgvector cosine similarity queries

### 6. Supabase Client (`api/_lib/supabase.js`)

Conditional database client initialization.

- **Null-safe**: returns `null` if `SUPABASE_URL` or `SUPABASE_ANON_KEY` are missing
- All consumers check for `null` before using — enables graceful degradation

## Endpoint Details

### `/api/chat` — Chat Middleware

**Middleware chain**: CORS -> Rate Limit (30/min) -> Provider Router -> Analytics

**Provider failover** (cost-optimized, cheapest first):
1. **Groq** — Llama 3.3 70B (fast, free tier)
2. **Cloudflare Workers AI** — Llama 3.1 8B (free tier)
3. **Local KB** — keyword-matching fallback (zero cost, always available)

**Features**:
- Conversation history (last 10 messages)
- Visitor-type-aware system prompts (recruiter/client/developer/visitor)
- Recommended project context injection
- UI action detection (navigate, filter, highlight) returned alongside response
- Response normalization: all providers return `{ response, source, model?, visitorType, actions }`

### `/api/classify` — Visitor Classification Middleware

**Middleware chain**: CORS -> Rate Limit (60/min) -> HuggingFace Zero-Shot -> Analytics

**Classification flow**:
1. **HuggingFace** — `mDeBERTa-v3-base-mnli-xnli` zero-shot classification
2. **Local fallback** — regex-based keyword matching (confidence: 70%)

**Categories**: `recruiter`, `client`, `developer`, `student`, `visitor`

**Output**: `{ type, confidence (0-100), profile (all scores), source, model? }`

### `/api/recommend` — Semantic Recommendation Middleware

**Middleware chain**: CORS -> Rate Limit (60/min) -> Voyage AI Embeddings -> pgvector -> Analytics

**Search flow**:
1. **Semantic search** — Voyage AI embedding -> Supabase `match_projects` RPC (pgvector cosine similarity)
2. **Keyword fallback** — word matching against project names, stacks, and descriptions

**Re-ranking**: visitor-type bonuses applied post-retrieval:
- Recruiters: bonus for test count, key metrics, GitHub stars
- Clients: bonus for live demos, business-relevant project names

**Output**: `{ recommendations[], visitorType, searchType, totalProjects }`

### `/api/health` — Health Check Middleware

**Middleware chain**: CORS only

Aggregates availability status from all providers:
- Supabase connectivity (live query)
- Groq, Cloudflare, HuggingFace configuration status
- Rate limiting and analytics operational status
- GitHub sync cron status
- Security configuration (CORS origins)

### `/api/kb` — Knowledge Base Endpoint

**Middleware chain**: CORS only (via `getKB()` function exported from `kb.js`)

Serves the portfolio knowledge base with Supabase-first loading and hardcoded fallback. Used internally by chat and recommend endpoints.

### `/api/analytics-dashboard` — Analytics Dashboard

**Middleware chain**: CORS -> Admin Auth (`X-Admin-Key` header)

Protected admin endpoint that aggregates analytics:
- Visitor type distribution
- Provider usage breakdown
- Top queries
- Average response time
- Requests per day
- Language distribution
- Configurable period (default: 7 days)

### `/api/github-sync` — GitHub Sync Cron

**Middleware chain**: CORS -> Cron Auth (`Bearer CRON_SECRET`)

Vercel Cron job (daily at 06:00 UTC) that:
- Fetches GitHub API stats for all portfolio projects
- Updates `github_stars` and `github_last_push` in Supabase
- Cleans up expired rate limit entries (>1 hour old)
- Respects GitHub rate limits with 200ms delay between requests

### `/api/github-stats` — Public GitHub Stats

**Middleware chain**: CORS only + HTTP cache (`s-maxage=3600`)

Public endpoint returning Christian's GitHub activity:
- Public repo count, followers
- 6 most recently pushed repos
- 8 most recent push events
- Hardcoded fallback data if GitHub API fails

## Request Lifecycle

```
1. HTTP request arrives at Vercel serverless function
2. CORS middleware validates origin, handles preflight
3. Rate limiter queries Supabase sliding window
   └─ If over limit → 429 response
4. Request body validated (required fields)
5. Provider router selects optimal provider
   └─ Try provider 1 → fail? → Try provider 2 → fail? → Local fallback
6. Response normalized to common schema
7. Analytics event logged asynchronously (never blocks)
8. JSON response returned to client
```

## Security Architecture

| Layer | Mechanism | Implementation |
|-------|-----------|----------------|
| Origin validation | CORS whitelist | `ALLOWED_ORIGINS` env var, checked per-request |
| Abuse prevention | Sliding-window rate limit | Supabase `rate_limits` table, per IP+endpoint |
| Privacy | IP hashing | SHA-256, first 16 chars only, never stores raw IP |
| Authentication | Bearer tokens / API keys | `CRON_SECRET`, `ANALYTICS_SECRET`, `X-Admin-Key` |
| Secrets management | Env vars only | Vercel environment variables, never in code |
| Headers | Security headers | `X-Content-Type-Options`, `X-Frame-Options` via Vercel config |

## Environment Variables

| Variable | Used By | Purpose |
|----------|---------|---------|
| `GROQ_API_KEY` | chat.js | Groq LLM provider (Llama 3.3 70B) |
| `CF_ACCOUNT_ID` | chat.js | Cloudflare Workers AI account |
| `CF_API_TOKEN` | chat.js | Cloudflare Workers AI auth |
| `HF_TOKEN` | classify.js | HuggingFace Inference API |
| `VOYAGE_API_KEY` | embeddings.js | Voyage AI embeddings (voyage-3-lite) |
| `SUPABASE_URL` | supabase.js | Supabase project URL |
| `SUPABASE_ANON_KEY` | supabase.js | Supabase anonymous key |
| `GITHUB_TOKEN` | github-sync.js | GitHub API (higher rate limits) |
| `CRON_SECRET` | github-sync.js | Vercel Cron authentication |
| `ANALYTICS_SECRET` | analytics-dashboard.js | Admin dashboard auth |
| `ALLOWED_ORIGINS` | cors.js | CORS whitelist (comma-separated) |

## Endpoints Summary

| Endpoint | Method | Middleware Stack | Provider(s) | Fallback |
|----------|--------|-----------------|-------------|----------|
| `/api/chat` | POST | CORS, Rate Limit (30/min), Analytics | Groq -> Cloudflare Workers AI -> Local KB | Always available |
| `/api/classify` | POST | CORS, Rate Limit (60/min), Analytics | HuggingFace zero-shot | Keyword regex |
| `/api/recommend` | POST | CORS, Rate Limit (60/min), Analytics | Voyage AI + pgvector | Keyword matching |
| `/api/health` | GET | CORS | Supabase, config checks | Static response |
| `/api/kb` | GET | (internal) | Supabase -> Hardcoded KB | Always available |
| `/api/analytics-dashboard` | GET | CORS, Admin Auth | Supabase analytics | N/A |
| `/api/github-sync` | POST | CORS, Cron Auth | GitHub API -> Supabase | N/A |
| `/api/github-stats` | GET | CORS, HTTP Cache (1h) | GitHub API | Hardcoded demo data |

## Design Decisions

1. **Fail-open rate limiting**: If Supabase is down, requests pass through rather than blocking all users. Availability > strictness.
2. **Fire-and-forget analytics**: Analytics never blocks the response. If logging fails, the user still gets their answer.
3. **Cost-optimized provider chain**: Groq (free) tried first, Cloudflare (free) second, local (zero-cost) last. No paid API calls unless free tiers are exhausted.
4. **Graceful degradation at every layer**: Every external dependency has a fallback. The portfolio chatbot works even with zero API keys configured.
5. **Privacy-first tracking**: IPs are SHA-256 hashed and truncated. No PII stored in analytics.
