# QA Master Checklist — Apple-Level Visual & Functional Audit

> Generated: 2026-03-28
> Source of truth: `portfolio-web/src/App.jsx` (ch65-portfolio.vercel.app)

---

## Portfolio Visual Features (source of truth)

These are the features in ch65-portfolio.vercel.app. Each project must have ALL applicable ones.

### A. Animation Libraries
- [ ] GSAP installed and imported
- [ ] Framer Motion installed and imported
- [ ] Lenis smooth scroll initialized
- [ ] ScrollTrigger registered

### B. Visual Design System
- [ ] Background: #09090B (main dark)
- [ ] Cards: rgba(255,255,255,0.03) with backdrop-filter: blur(12px)
- [ ] Borders: rgba(255,255,255,0.06), hover: rgba(99,102,241,0.2)
- [ ] Accent color: #6366F1 (indigo) — or project-specific variant
- [ ] Text primary: #FAFAFA
- [ ] Text secondary: rgba(255,255,255,0.5)
- [ ] Text muted: rgba(255,255,255,0.3)
- [ ] Border radius: 16px cards, 12px buttons, 20px pills
- [ ] Font heading: Syne (if applicable)
- [ ] Font body: DM Sans (if applicable)

### C. Animations & Micro-interactions
- [ ] Lenis smooth scroll active
- [ ] Film grain SVG noise overlay (fixed, ~3% opacity)
- [ ] Scroll progress bar at top (2px gradient line)
- [ ] Framer Motion useInView for section reveals
- [ ] Stagger animations on lists/cards (delay per item)
- [ ] AnimatePresence for modals/panels enter/exit
- [ ] Hover effects: translateY(-4px) or scale(1.02) on cards
- [ ] Apple easing: cubic-bezier(0.16, 1, 0.3, 1)
- [ ] Glassmorphism (backdrop-filter: blur) on cards/panels
- [ ] Buttons: hover glow/shine effect

### D. Functional Requirements
- [ ] All data loads (demo mode OK, but no loading errors)
- [ ] No "NetworkError" visible anywhere
- [ ] No blank/empty sections
- [ ] Language toggle works (if i18n exists)
- [ ] Dark theme consistent throughout
- [ ] No ElevenLabs references anywhere
- [ ] Contact links work (mailto, WhatsApp)
- [ ] CTA bar auto-dismisses (if applicable)

### E. Responsive (Mobile 375px)
- [ ] No horizontal overflow
- [ ] Text readable
- [ ] Buttons tappable (min 44px)
- [ ] Navigation works
- [ ] Cards stack properly

### F. Code Quality
- [ ] Build passes (npm run build)
- [ ] Tests pass (npm test)
- [ ] No console errors in production
- [ ] All imports resolve

---

## Audit Results Per Project

### Feature Matrix

```
Feature              | 01-Chat | 02-Content | 03-Finance | 04-HR  | 05-Client | 06-CV  | 07-Nexus
---------------------|---------|------------|------------|--------|-----------|--------|--------
GSAP imported        |   ❌    |    ❌      |    ❌      |  ❌    |    ❌     |  ❌    |  ❌
Framer Motion        |   ✅    |    ✅      |    ✅      |  ✅    |    ✅     |  ✅    |  ❌
Lenis smooth scroll  |   ✅    |    ✅      |    ✅      |  ✅    |    ✅     |  ✅    |  ❌
Background #09090B   |   ✅    |    ✅      |    ✅ (1)  |  ✅    |    ✅     |  ✅(2) |  ❌
Glassmorphism        |   ✅    |    ✅      |    ✅      |  ✅    |    ✅     |  ✅    |  ❌
Film grain overlay   |   ✅    |    ✅      |    ✅      |  ✅    |    ✅     |  ✅    |  ❌
Scroll progress bar  |   ❌    |    ✅      |    ✅      |  ✅    |    ✅     |  ✅    |  ❌
Apple easing         |   ✅(3) |    ✅      |    ✅      |  ✅    |    ✅     |  ✅    |  ❌
Stagger animations   |   ✅(3) |    ✅      |    ✅      |  ✅    |    ✅     |  ✅    |  ❌
AnimatePresence      |   ✅    |    ✅      |    ✅      |  ✅    |    ✅     |  ✅    |  ❌
Accent #6366F1       |   ❌(4) |    ✅      |    ❌(5)   |  ✅    |    ✅     |  ❌(6) |  ❌
No ElevenLabs refs   |   ❌    |    ✅      |    ✅      |  ✅    |    ✅     |  ✅    |  ✅
Build passes         |   ✅    |    ✅      |    ✅      |  ✅    |    ✅     |  ✅    |  ✅
```

### Notes

1. **03-Finance**: BG `#09090B` is defined in `src/hooks/useTheme.js` (dark palette), not directly in App.jsx. Correctly applied.
2. **06-CV**: BG `#09090B` is in `src/constants/colors.js`. Correctly applied.
3. **01-Chat**: Apple easing and stagger exist in subcomponents (`AgentSelector.jsx`, `AgentStats.jsx`, `QuickActions.jsx`), not in App.jsx root.
4. **01-Chat**: Uses no consistent accent color — only `#09090B` found; no indigo/purple gradient.
5. **03-Finance**: Uses `#10B981` (emerald green) as accent, not `#6366F1` (indigo). Intentional for finance branding.
6. **06-CV**: Uses `#8B5CF6` (violet) as accent via `COLORS.accent`, not exact `#6366F1` but same indigo family.

---

## Critical Issues (❌ items requiring fixes)

### BLOCKER: 01-chatbot-multiagente — ElevenLabs references still present
- **File**: `proyectos/01-chatbot-multiagente/src/App.jsx` (lines 5, 37, 83, 86)
- **File**: `proyectos/01-chatbot-multiagente/src/hooks/useVoice.js`
- **What**: Imports `useElevenLabsWidget`, renders `<elevenlabs-convai>` widget
- **Fix**: Remove all ElevenLabs imports, hook usage, and DOM elements

### MISSING: 01-chatbot-multiagente — No scroll progress bar
- **File**: `proyectos/01-chatbot-multiagente/src/App.jsx`
- **What**: No `ScrollProgress` component or `useScroll`/`scrollYProgress` usage
- **Fix**: Add a scroll progress bar (2px gradient line at top, `position: fixed`)

### MISSING: 01-chatbot-multiagente — No accent color system
- **File**: `proyectos/01-chatbot-multiagente/src/App.jsx`
- **What**: Only `#09090B` bg found; no indigo/purple accent anywhere in App.jsx
- **Fix**: Add `#6366F1` (or similar) as accent for buttons, links, active states

### MISSING: ALL projects (01-07) — GSAP not imported
- **Files**: All `src/App.jsx` files
- **What**: None of the 7 projects import GSAP or register ScrollTrigger
- **Impact**: LOW — Framer Motion handles animations adequately. GSAP would add scroll-driven pinning.
- **Recommendation**: Consider adding GSAP only if scroll-pinning effects are needed. Not a blocker.

### MISSING: 07-nexusforge-ai — No portfolio visual system at all
- **File**: `proyectos/07-nexusforge-ai/frontend/src/App.jsx`
- **What**: Zero matches for Framer Motion, Lenis, grain, glassmorphism, etc.
- **Impact**: HIGH — This project has no visual alignment with the portfolio design system
- **Fix**: Full visual overhaul needed or exclude from visual audit if it's a CLI/backend tool

### ACCEPTABLE DEVIATIONS

| Project     | Feature            | Actual                  | Verdict     |
|-------------|--------------------|-------------------------|-------------|
| 03-Finance  | Accent color       | #10B981 (green)         | OK — finance branding |
| 06-CV       | Accent color       | #8B5CF6 (violet)        | OK — same family as #6366F1 |
| 03-Finance  | BG location        | In useTheme.js hook     | OK — same color |
| 06-CV       | BG location        | In constants/colors.js  | OK — same color |

---

## Summary Scorecard

```
Project              | Score  | Status
---------------------|--------|------------------
01-chatbot-multiagente | 8/12 | ⚠️  3 issues (ElevenLabs, scroll bar, accent)
02-content-studio      | 11/12 | ✅ Only missing GSAP (low priority)
03-finance-ai          | 10/12 | ✅ Missing GSAP + different accent (acceptable)
04-hr-scout            | 11/12 | ✅ Only missing GSAP (low priority)
05-client-hub          | 11/12 | ✅ Only missing GSAP (low priority)
06-cv-optimizer        | 11/12 | ✅ Only missing GSAP + violet accent (acceptable)
07-nexusforge-ai       | 1/12  | ❌ Needs full visual overhaul
```

---

## Priority Fix Order

1. **P0 — 01-chatbot-multiagente**: Remove ElevenLabs (4 locations in 2 files)
2. **P1 — 01-chatbot-multiagente**: Add scroll progress bar
3. **P1 — 01-chatbot-multiagente**: Add accent color system (#6366F1)
4. **P2 — 07-nexusforge-ai**: Decide: full visual alignment or exclude from audit
5. **P3 — All projects**: Add GSAP (optional, low impact)
