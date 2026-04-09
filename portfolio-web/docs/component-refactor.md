# PHASE C: Component Refactor Plan

## New Component Structure

```
src/
  App.jsx                          -- updated section order
  components/
    hero/
      Hero.jsx                     -- updated copy + stack badges
    projects/
      FeaturedProjects.jsx         -- NEW: renders top 5 with large cards
      SecondaryProjects.jsx        -- NEW: renders 2 secondary projects
      OtherProjects.jsx            -- NEW: compact grid for remaining 11
      ProjectSection.jsx           -- NEW: shared section wrapper (title + grid)
      ProjectCard.jsx              -- REFACTORED from inline in Projects.jsx
      MetricsBadge.jsx             -- NEW: renders "247 tests" or "86% coverage"
    skills/
      Skills.jsx                   -- simplified (remove tag cloud, matcher, confetti)
      SkillsRadar.jsx              -- EXTRACTED from Skills.jsx
      SkillBar.jsx                 -- EXTRACTED from Skills.jsx
    contact/
      Contact.jsx                  -- minimal changes
    layout/
      Navbar.jsx                   -- remove About/Journey links
      Footer.jsx                   -- no changes
  ui/
    StackTag.jsx                   -- no changes
    Icons.jsx                      -- no changes
    SpotlightCard.jsx              -- no changes
    CountUp.jsx                    -- no changes
    ErrorBoundary.jsx              -- no changes
  hooks/
    useLanguage.jsx                -- no changes
    useAnalytics.js                -- no changes
  data/
    projects.js                    -- REFACTORED: add category tiers, problem/solution
    strings.js                     -- updated hero copy
    skills.js                      -- no changes
    tagColors.js                   -- no changes
```

---

## Component Specifications

### 1. Hero.jsx (UPDATE)

**Changes:**
- Update role text to: "AI Engineer -- Multi-Agent Systems, LLM Pipelines, AI Analytics Platforms"
- Add stack badges row: Python, FastAPI, React, PostgreSQL, pgvector, Flutter, Docker, Claude API
- Keep existing stats, CTAs, badge
- Add "Scale AI" and "Remote OK" badges (migrated from removed About section)

**No structural change** -- just copy updates.

---

### 2. FeaturedProjects.jsx (NEW)

**Purpose**: Render the top 5 projects with maximum visual impact.

**Props**: `projects` (array of 5), `lang` (string)

**Layout**:
```
[========= NexusForge AI (full width) =========]
[=== LangChain Pipeline ===][=== AI Doc Pipeline ===]
[=== MindScrolling =========][=== FinanceAI =========]
```

**Card structure** (large featured card):
```jsx
<div className="featured-card">
  <div className="featured-card__header">
    <span className="emoji">{project.emoji}</span>
    <h3>{project.title}</h3>
    {project.isNew && <span className="badge-new">New</span>}
  </div>
  <p className="featured-card__problem">{project.problem[lang]}</p>
  <p className="featured-card__solution">{project.solution[lang]}</p>
  <div className="featured-card__metrics">
    {project.metrics.map(m => <MetricsBadge key={m.l} value={m.n} label={m.l} />)}
  </div>
  <div className="featured-card__tech">
    {project.tech.map(t => <StackTag key={t} tag={t} />)}
  </div>
  <div className="featured-card__actions">
    <a href={project.demoUrl}>View Demo</a>
    <a href={project.repoUrl}>GitHub</a>
  </div>
</div>
```

**Styles**:
- Grid: `grid-template-columns: 1fr 1fr` with first child `grid-column: span 2`
- Gap: 20px
- Card padding: 28px
- Card bg: `rgba(255,255,255,0.03)`
- Card border: `1px solid rgba(255,255,255,0.06)`
- Card border-radius: 16px
- No glass effects, no blur, no gradients on cards (Apple-flat)

---

### 3. ProjectSection.jsx (NEW)

**Purpose**: Reusable section wrapper for any project group.

**Props**: `title`, `subtitle`, `children`

```jsx
export default function ProjectSection({ title, subtitle, children }) {
  return (
    <div style={{ marginBottom: 64 }}>
      <div style={{ marginBottom: 28 }}>
        <h3 style={{ fontFamily: 'Syne', fontSize: 24, fontWeight: 700, color: '#FAFAFA' }}>
          {title}
        </h3>
        {subtitle && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}
```

---

### 4. ProjectCard.jsx (REFACTOR)

**Currently**: Inline function inside Projects.jsx (~100 lines).

**Changes**:
- Extract to its own file
- Add `problem` and `solution` display (1 line each)
- Add `MetricsBadge` rendering from project.metrics array
- Support 3 sizes via `size` prop: `'large'` | `'medium'` | `'compact'`

**Size variants**:
| Size | Shows | Grid behavior |
|---|---|---|
| `large` | emoji, title, problem, solution, metrics, tech, demo+github | 2-col, first spans 2 |
| `medium` | emoji, title, problem, solution, tech (truncated), demo+github | 2-col even |
| `compact` | emoji, title, tech (3 max), demo+github | 3-col |

---

### 5. MetricsBadge.jsx (NEW)

**Purpose**: Consistent metric display across all project cards.

**Props**: `value` (string), `label` (string), `color` (optional)

```jsx
export default function MetricsBadge({ value, label, color = '#818CF8' }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: `${color}10`, border: `1px solid ${color}25`,
      borderRadius: 8, padding: '4px 12px',
      fontSize: 12, fontWeight: 600, color,
    }}>
      <span style={{ fontWeight: 700 }}>{value}</span>
      <span style={{ opacity: 0.7 }}>{label}</span>
    </span>
  )
}
```

---

### 6. Skills.jsx (SIMPLIFY)

**Remove**:
- FloatingTagCloud (visual noise, ~50 lines)
- SkillMatcher (~component import)
- ConfettiBurst (dead code, ~30 lines)

**Keep**:
- SkillsRadar (spider chart)
- 5 SkillBarAnimated bars
- Skills statement text

**Extract**:
- SkillsRadar -> `skills/SkillsRadar.jsx`
- SkillBarAnimated -> `skills/SkillBar.jsx`

---

## Files to DELETE

| File | Reason |
|---|---|
| `components/about/About.jsx` | Section removed |
| `components/journey/Journey.jsx` | Section removed |
| `components/testimonials/Testimonials.jsx` | Never rendered |
| `components/skills/SkillMatcher.jsx` | Removed from Skills |
| `components/layout/AnimatedSpacer.jsx` | Unused |
| `components/layout/AuroraBackground.jsx` | Unused |
| `components/layout/LoadingScreen.jsx` | Unused |
| `ui/AnimatedTitle.jsx` | Unused |
| `ui/ScrollRevealText.jsx` | Unused |
| `ui/ImagePlaceholder.jsx` | Unused |
| `ui/CodingActivity.jsx` | Unused |
| `ui/TextScramble.jsx` | Unused |
| `hooks/useScrollReveal.js` | Unused |
| `hooks/useActiveSection.js` | Unused |
| `data/timeline.js` | Journey removed |
| `data/testimonials.js` | Testimonials removed |

**16 files to delete** -- significant reduction in bundle size and complexity.
