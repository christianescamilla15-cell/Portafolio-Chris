# PHASE B: Portfolio Architecture -- New Section Hierarchy

## Proposed Section Order

```
Navbar (fixed)
  |-- Projects, Skills, Contact links only (remove About, Journey)
  |-- ES/EN toggle

Hero (AI Engineer positioning, stats, 2 CTAs)
  |-- Badge: "Available for projects"
  |-- Name: Christian Hernandez Escamilla
  |-- Role: AI Engineer -- Multi-Agent Systems, LLM Pipelines, AI Analytics Platforms
  |-- Subtitle: production focus
  |-- Stack badges: Python, FastAPI, React, PostgreSQL, pgvector, Flutter, Docker, Claude API
  |-- Stats: 18 Systems | 1,346+ Tests | 22 Agents | 3+ Years
  |-- CTA: View Projects | Contact

Featured Projects (5 flagship projects with large cards)
  |-- NexusForge AI (full-width hero card)
  |-- LangChain Pipeline + AI Document Pipeline (2-column)
  |-- MindScrolling + FinanceAI Dashboard (2-column)
  |-- Each shows: problem (1 line) + solution (1 line) + tech tags + metrics badges + Demo/GitHub

Secondary Projects (2 medium cards)
  |-- Chatbot Multiagente
  |-- Playwright Automation
  |-- Same structure as featured, smaller cards, 2-column grid

Other Projects (collapsed compact grid)
  |-- 11 remaining projects in 3-column compact cards
  |-- Title + tech tags + links only (no descriptions)
  |-- "Show more" expand toggle (collapsed by default)

Skills (streamlined)
  |-- Radar chart (keep)
  |-- 5 skill bars (keep)
  |-- REMOVE: floating tag cloud, skill matcher, confetti

Contact (email, WhatsApp, CV)
  |-- Same as current but cleaner

Footer (minimal)
  |-- Same as current
```

---

## Why Remove About and Journey

### About Section -- REMOVE

**Current state**: 200vh sticky scroll for one sentence + bento grid with bio, experience card, location card.

**Why remove:**
1. **Duplicates Hero**: The "about statement" is nearly identical to the hero subtitle. The experience years and stats are already in Hero.
2. **200vh scroll tax**: Forces 200vh of scroll (the sticky scroll effect) before reaching projects. On a 1080p screen that's ~2 full scrolls of the same sentence. Recruiter patience is ~10 seconds.
3. **Bio text is low-signal**: "I build AI systems that ship to production" is already said in the hero subtitle. The full bio paragraph is a wall of text no recruiter reads.
4. **Bento grid info is redundant**: Experience years (Hero stats), location (Footer/Contact), and skill tags (Skills section) are all shown elsewhere.

**Action**: Merge the 1-2 useful data points (Scale AI badge, Remote OK badge) into the Hero or Contact sections. Delete the About component entirely.

### Journey Section -- REMOVE

**Current state**: 4-item vertical timeline (2023, 2024, 2025, 2026) with descriptions and tags.

**Why remove:**
1. **Projects ARE the journey**: Every milestone described in the timeline corresponds to a project already shown in the portfolio. "2026 -- NexusForge AI" is redundant when NexusForge is a featured project card.
2. **Chronological ordering is anti-recruiter**: Recruiters want to see your best work first, not a chronological story starting from 2023. The timeline buries your strongest work (2026) at the bottom.
3. **400px of scroll with no CTAs**: The timeline has no demo links, no GitHub links, no actionable next step. It's pure text decoration.
4. **4 items is too few for a section**: A 4-item timeline does not justify its own section. It adds section-switching friction.

**Action**: If journey context is desired, add a one-line "Since 2023" indicator to the Hero stats bar. The projects themselves tell the story better.

---

## Navbar Changes

### Current links: About | Journey | Projects | Skills | Contact
### Proposed links: Projects | Skills | Contact

Rationale: Fewer nav items = faster decision-making. Every nav link should point to a section with actionable content (demos, contact info, skill validation).

---

## Scroll Budget Analysis

| Section | Current Height (est.) | Proposed Height (est.) |
|---|---|---|
| Hero | 100vh | 100vh |
| About | ~300vh (200vh sticky + content) | 0 (removed) |
| Journey | ~50vh | 0 (removed) |
| Projects | ~200vh (18 cards same size) | ~150vh (tiered: 5 featured + 2 secondary + collapsed others) |
| Skills | ~150vh (radar + matcher + cloud + 5 bars) | ~80vh (radar + 5 bars only) |
| Contact | ~60vh | ~60vh |
| Footer | ~10vh | ~10vh |
| **Total** | **~870vh** | **~400vh** |

The refactored site cuts scroll depth by ~54%, meaning recruiters reach the contact section in half the time.
