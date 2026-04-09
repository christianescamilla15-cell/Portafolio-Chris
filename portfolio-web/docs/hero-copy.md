# PHASE E: Hero Copy -- Optimized

## Title (Name)

No change: **Christian Hernandez Escamilla**

---

## Role Line

**ES**: `Ingeniero IA -- Sistemas Multi-Agente, Pipelines LLM, Plataformas de Analitica IA`

**EN**: `AI Engineer -- Multi-Agent Systems, LLM Pipelines, AI Analytics Platforms`

Rationale: Three specific domains communicate depth. Current "Ingeniero IA - Orquestacion Multi-Agente" is too narrow. Adding LLM Pipelines and AI Analytics covers the LangChain Pipeline and FinanceAI/Ad Analytics projects.

---

## Subtitle

**ES**: `Construyo sistemas multi-agente de IA que se despliegan a produccion -- no prototipos. 18 sistemas, 1,346+ tests, 22 agentes orquestados.`

**EN**: `I build multi-agent AI systems that ship to production -- not prototypes. 18 systems, 1,346+ tests, 22 agents orchestrated.`

Rationale: Current subtitle is nearly identical but lacks the numbers. Adding the numbers inline reinforces the stats bar below and creates immediate credibility.

---

## Badge

**ES**: `Disponible para proyectos`
**EN**: `Available for projects`

No change. This is correct and effective.

---

## Stack Badges

Display as horizontal pill tags below the subtitle:

```
Python  |  FastAPI  |  React  |  PostgreSQL  |  pgvector  |  Flutter  |  Docker  |  Claude API
```

Style: same as StackTag component. Inline-flex, 12px font, pill border, subtle background.

Rationale: Recruiters ctrl+F for tech keywords. Placing them in the hero ensures they're visible in the first viewport and match ATS keyword scanning. Current hero has NO tech badges.

---

## Stats Bar

| Stat | Value | Label ES | Label EN |
|---|---|---|---|
| Systems | 18 | Sistemas | Systems |
| Tests | 1,346+ | Tests | Tests |
| Agents | 22 | Agentes IA | AI Agents |
| Experience | 3+ | Anios | Years |

No change from current. These are effective and well-formatted.

---

## CTAs

**Primary**: `Ver Proyectos` / `View Projects` -> scrolls to #projects
**Secondary**: `Contacto` / `Contact` -> scrolls to #contact

No change. Two CTAs is correct. Primary is high-contrast (filled button), secondary is outline.

---

## Additional Badges (migrated from About section)

Add below stats bar, before CTAs:

```
[Scale AI] [Remote OK] [CDMX, Mexico]
```

Style:
- Scale AI: green accent badge (rgba(16,185,129,0.08) background, #34D399 text)
- Remote OK: green accent badge with pulse dot
- CDMX: subtle gray badge with location icon

Rationale: These were buried in the About bento grid. Moving them to Hero means they're visible in the first viewport. "Scale AI" is a strong credibility signal. "Remote OK" answers a key recruiter question immediately.

---

## Full Hero Layout Mockup

```
[badge: Available for projects]

Christian Hernandez Escamilla

AI ENGINEER -- MULTI-AGENT SYSTEMS, LLM PIPELINES, AI ANALYTICS PLATFORMS

I build multi-agent AI systems that ship to production -- not prototypes.
18 systems, 1,346+ tests, 22 agents orchestrated.

[Python] [FastAPI] [React] [PostgreSQL] [pgvector] [Flutter] [Docker] [Claude API]

18          1,346+       22            3+
Systems     Tests        AI Agents     Years

[Scale AI]  [Remote OK]  [CDMX, Mexico]

[View Projects ->]  [Contact]
```

---

## strings.js Changes Required

```js
heroRole: {
  es: 'Ingeniero IA -- Sistemas Multi-Agente, Pipelines LLM, Plataformas de Analitica IA',
  en: 'AI Engineer -- Multi-Agent Systems, LLM Pipelines, AI Analytics Platforms'
},
heroSubtitle: {
  es: 'Construyo sistemas multi-agente de IA que se despliegan a produccion -- no prototipos. 18 sistemas, 1,346+ tests, 22 agentes orquestados.',
  en: 'I build multi-agent AI systems that ship to production -- not prototypes. 18 systems, 1,346+ tests, 22 agents orchestrated.',
},
```
