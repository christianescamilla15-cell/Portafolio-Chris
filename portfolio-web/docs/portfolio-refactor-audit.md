# PHASE A: Portfolio Refactor Audit

## Framework Confirmation

| Dependency | Version |
|---|---|
| React | 18.3.1 |
| React DOM | 18.3.1 |
| Vite | 5.4.14 |
| Framer Motion | 12.38.0 |
| Vitest | 4.1.2 |

Build tool: Vite 5 with `@vitejs/plugin-react`.
No router (single-page scroll site). No state management library (useState/useContext only).

---

## Component Tree

```
App.jsx
  |-- Navbar (layout/Navbar.jsx) -- eagerly loaded
  |-- Hero (hero/Hero.jsx) -- eagerly loaded
  |-- [Suspense] About (about/About.jsx) -- lazy
  |     |-- GitHubActivity (exported from About.jsx, NOT rendered anywhere)
  |     |-- HowIBuiltThis (exported from About.jsx, NOT rendered anywhere)
  |     |-- ContributionHeatmap (internal to About.jsx, rendered inside GitHubActivity)
  |     |-- CountUp (ui/CountUp.jsx)
  |     |-- IconLocation (ui/Icons.jsx)
  |-- [Suspense] Journey (journey/Journey.jsx) -- lazy
  |     |-- JourneyMilestone (internal)
  |-- [Suspense] Projects (projects/Projects.jsx) -- lazy
  |     |-- TerminalContent (internal)
  |     |-- BrowserMockup (internal)
  |     |-- CountUpMetric (internal -- BUG: uses useFramerInView without importing it)
  |     |-- ProjectCard (internal)
  |     |-- TheaterPanel (internal -- DEAD CODE: never rendered in current code)
  |     |-- ProjectTable (internal)
  |     |-- StackTag (ui/StackTag.jsx)
  |     |-- IconGitHub, IconExternalLink (ui/Icons.jsx)
  |-- [Suspense] Skills (skills/Skills.jsx) -- lazy
  |     |-- SkillsRadar (internal)
  |     |-- SkillBarAnimated (internal)
  |     |-- FloatingTagCloud (internal)
  |     |-- ConfettiBurst (internal -- DEAD CODE: never rendered)
  |     |-- SkillMatcher (skills/SkillMatcher.jsx)
  |     |-- CountUp (ui/CountUp.jsx)
  |-- [Suspense] Contact (contact/Contact.jsx) -- lazy
  |     |-- SpotlightCard (ui/SpotlightCard.jsx)
  |     |-- TimeToHire (ui/TimeToHire.jsx)
  |     |-- Icons (ui/Icons.jsx)
  |-- Footer (layout/Footer.jsx) -- eagerly loaded
  |-- [Suspense] PortfolioChatbot (PortfolioChatbot.jsx) -- lazy
  |-- ErrorBoundary (ui/ErrorBoundary.jsx)
```

---

## Current Section Hierarchy (scroll order)

1. **Navbar** (fixed)
2. **Hero** -- name, role, stats, 2 CTAs
3. **About** -- sticky scroll statement + bento grid (bio, experience, location)
4. **Journey** -- 4-item vertical timeline (2023-2026)
5. **Projects** -- filter pills + category-grouped card grid (18 projects)
6. **Skills** -- statement + radar + skill matcher + floating tag cloud + 5 skill bars
7. **Contact** -- headline + card (email, WhatsApp, CV download, social icons)
8. **Footer** -- social icons + copyright

---

## Data Sources

| File | Purpose |
|---|---|
| `data/projects.js` | 18 projects (PROJECTS array), CATEGORIES, FEATURED_ORDER, PROJECT_METRICS |
| `data/strings.js` | All UI strings in ES/EN (STRINGS object) |
| `data/skills.js` | SKILLS (category grid) + SKILL_BARS (bar chart data) |
| `data/timeline.js` | TIMELINE (4 journey milestones) |
| `data/testimonials.js` | TESTIMONIALS (3 entries -- NOT RENDERED in current App.jsx) |
| `data/tagColors.js` | Tag color mappings for StackTag |

---

## UI Bottlenecks

### 1. Noise & Redundancy
- **About section (200vh sticky scroll)**: Takes 200vh of scroll space for a single sentence ("I've shipped 18 AI systems to production"). The bento grid below repeats stats already in Hero.
- **Journey section**: 4 timeline items adding ~400px of vertical space. This information is already implicit in the projects themselves. Recruiters do not read chronological timelines -- they scan for project quality.
- **Skills section has 4 sub-components**: radar + skill matcher + floating tag cloud + skill bars. Too much chrome for the same information. The floating tag cloud is visual noise.
- **TheaterPanel component** (147 lines): Built for a "theater mode" that is NOT used. It's dead code inside Projects.jsx.
- **ConfettiBurst component**: Built but never rendered.
- **GitHubActivity & HowIBuiltThis**: Exported from About.jsx but never imported/rendered anywhere.

### 2. Weak Hierarchy
- All 18 projects are displayed in the same card format -- no visual distinction between NexusForge (22 agents, 247 tests) and La 5ta Esencia (a Flask e-commerce site).
- The `featured` boolean and `FEATURED_ORDER` array exist in data but are only used to show a small star icon on cards. No visual differentiation in card size or layout.
- Projects are grouped by category (ai, fullstack, mobile, automation) rather than by impact/importance.

### 3. Missing Components
- **Testimonials section**: Component exists, data exists, but NOT imported in App.jsx. Complete dead feature.
- No `FeaturedProjects` component for large hero-level project cards.
- No tiered project layout (featured vs. secondary vs. other).

---

## Current Project Order vs. Optimal Order

### Current order in PROJECTS array:
1. Chatbot Multiagente (ai)
2. ContentStudio AI (ai)
3. FinanceAI Dashboard (fullstack)
4. HRScout (fullstack)
5. ClientHub (fullstack)
6. Multi-Agent Build System (ai)
7. MindScrolling (mobile)
8. WordForge (mobile)
9. QuoteFlow (mobile)
10. AgenticDev Framework (ai)
11. Invoice Manager (fullstack)
12. La 5ta Esencia (fullstack)
13. Lobos de la Montana (fullstack)
14. AI Document Pipeline (ai)
15. LangChain Pipeline (ai)
16. Ad Analytics Pipeline (automation)
17. NexusForge AI (ai) -- flagship, buried at position 17
18. Playwright Automation (automation)
19. Fine-tuning Demo (ai)

### Optimal order (by recruiter impact):
**Priority 1 (flagship/featured):**
1. NexusForge AI -- 22 agents, 6 topologies, 247 tests, most complex system
2. LangChain Pipeline -- microservices, event-driven, 86% coverage, MLOps
3. AI Document Pipeline -- CrewAI, MCP servers, production pipeline
4. MindScrolling -- published app, pgvector, 13k+ quotes
5. FinanceAI Dashboard -- anomaly detection, 83 tests, voice AI

**Priority 2 (secondary):**
6. Chatbot Multiagente -- 5 agents, 120 tests, 80% auto-resolution
7. Playwright Automation -- real scrapers, E2E testing, practical skill

**Priority 3 (other/collapsed):**
8-19. Everything else (smaller scope, less differentiated, or older)

---

## Dead Code / Unused Files

### Files imported NOWHERE:
| File | Status |
|---|---|
| `ui/AnimatedTitle.jsx` | Not imported by any component |
| `ui/ScrollRevealText.jsx` | Not imported by any component |
| `ui/ImagePlaceholder.jsx` | Not imported by any component |
| `ui/CodingActivity.jsx` | Not imported by any component |
| `ui/TextScramble.jsx` | Not imported by any component (also untracked in git) |
| `components/layout/AnimatedSpacer.jsx` | Not imported (untracked in git) |
| `components/layout/AuroraBackground.jsx` | Not imported (untracked in git) |
| `components/layout/LoadingScreen.jsx` | Not imported in App.jsx |
| `components/testimonials/Testimonials.jsx` | Exists but NOT imported in App.jsx |
| `hooks/useScrollReveal.js` | Not imported by any component |
| `hooks/useActiveSection.js` | Not imported by any component |

### Dead code within files:
| Location | Issue |
|---|---|
| `Projects.jsx` > `TheaterPanel` | ~230 lines, never rendered |
| `Projects.jsx` > `CountUpMetric` | Uses `useFramerInView` without importing -- runtime crash risk |
| `About.jsx` > `GitHubActivity` | Exported, never imported elsewhere |
| `About.jsx` > `HowIBuiltThis` | Exported, never imported elsewhere |
| `Skills.jsx` > `ConfettiBurst` | Defined, never rendered |

---

## Bugs Found

1. **Projects.jsx line 157**: `useFramerInView` is called inside `CountUpMetric` but `useInView` / `useFramerInView` is never imported in the file. This will crash at runtime if `CountUpMetric` ever renders. Currently it only renders inside `TheaterPanel`, which is dead code, so the crash is latent.

2. **Navbar.jsx line 17**: Observes `testimonials` section ID, but Testimonials component is not rendered in App.jsx. The observer silently skips it (no crash, but wasted logic).

3. **PROJECT_METRICS** in `projects.js` defines `useFramerInView` import alias pattern that the file using it does not import.
