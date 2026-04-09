# PHASE F: Featured Projects Design Spec

## Section Header

```
PORTFOLIO

Featured Projects

Real AI and automation solutions with live demos, from multi-agent orchestration to LLM pipelines.
```

- Label: 12px, uppercase, #6366F1, letter-spacing 0.15em
- Title: Syne font, clamp(2rem, 5vw, 3.5rem), weight 700, #FAFAFA
- Subtitle: 16px, rgba(255,255,255,0.4), max-width 600px, centered

---

## Grid Layout

```
+-------------------------------------------------------+
|                                                       |
|              NexusForge AI (full width)                |
|              priority 1, grid-column: span 2           |
|                                                       |
+---------------------------+---------------------------+
|                           |                           |
|   LangChain Pipeline      |   AI Document Pipeline    |
|   priority 2               |   priority 3               |
|                           |                           |
+---------------------------+---------------------------+
|                           |                           |
|   MindScrolling            |   FinanceAI Dashboard     |
|   priority 4               |   priority 5               |
|                           |                           |
+---------------------------+---------------------------+
```

CSS Grid:
```css
.featured-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
.featured-grid > :first-child {
  grid-column: span 2;
}

@media (max-width: 768px) {
  .featured-grid {
    grid-template-columns: 1fr;
  }
  .featured-grid > :first-child {
    grid-column: span 1;
  }
}
```

---

## Featured Card Anatomy

```
+-------------------------------------------------------+
|  [emoji]  Title                             [NEW badge] |
|                                                         |
|  PROBLEM: One-line problem statement                    |
|  SOLUTION: One-line solution statement                  |
|                                                         |
|  [247 Tests]  [22 Agents]  [6 Topologies]              |
|                                                         |
|  [Python] [FastAPI] [React] [PostgreSQL] [Redis] [Docker] |
|                                                         |
|  [View Demo ->]  [GitHub]                               |
+-------------------------------------------------------+
```

---

## Card Styles

### Container
```css
.featured-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: border-color 0.3s ease;
}
.featured-card:hover {
  border-color: rgba(99, 102, 241, 0.2);
}
```

No glass effects. No backdrop-filter. No gradients on cards. Flat and clean.

### Header Row
```css
.featured-card__header {
  display: flex;
  align-items: center;
  gap: 12px;
}
.featured-card__header .emoji {
  font-size: 32px;   /* 40px for hero card */
  line-height: 1;
}
.featured-card__header h3 {
  font-family: 'Syne', sans-serif;
  font-size: 22px;   /* 28px for hero card */
  font-weight: 700;
  color: #FAFAFA;
  letter-spacing: -0.01em;
  margin: 0;
}
```

### Problem/Solution Lines
```css
.featured-card__problem,
.featured-card__solution {
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}
.featured-card__problem {
  color: rgba(255, 255, 255, 0.45);
}
.featured-card__problem::before {
  content: 'Problem: ';
  font-weight: 600;
  color: #EF4444;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.featured-card__solution {
  color: rgba(255, 255, 255, 0.55);
}
.featured-card__solution::before {
  content: 'Solution: ';
  font-weight: 600;
  color: #6366F1;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

### Metrics Row
```css
.featured-card__metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
/* Uses MetricsBadge component */
```

### Tech Tags Row
```css
.featured-card__tech {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
/* Uses existing StackTag component */
```

### Action Buttons
```css
.featured-card__actions {
  display: flex;
  gap: 10px;
  margin-top: auto;    /* push to bottom */
}
.featured-card__actions a.primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #6366F1;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 10px;
  text-decoration: none;
  transition: opacity 0.2s ease;
}
.featured-card__actions a.secondary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 10px;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: border-color 0.2s ease, color 0.2s ease;
}
```

---

## Hero Card Differences (first card, full-width)

The NexusForge card spans full width and gets slightly larger typography:

| Property | Standard Card | Hero Card |
|---|---|---|
| Emoji size | 32px | 40px |
| Title size | 22px | 28px |
| Padding | 28px | 36px |
| Problem/Solution font | 14px | 15px |
| Metrics badge size | 12px | 13px |

---

## Animation

Each card uses the existing `.reveal` class with staggered delays:
- Card 1 (hero): delay 0s
- Card 2: delay 0.1s
- Card 3: delay 0.15s
- Card 4: delay 0.2s
- Card 5: delay 0.25s

No Framer Motion needed -- the CSS `.reveal` + `.reveal-stagger` system is sufficient and lighter.

---

## Spacing Summary

| Element | Value |
|---|---|
| Section padding top | 120px |
| Section header to grid | 48px |
| Grid gap | 20px |
| Card padding | 28px (36px hero) |
| Card border-radius | 16px |
| Between card elements | 16px |
| Section padding bottom | 80px |
