# PHASE G: Secondary & Other Projects Layout

## Secondary Projects Section

### Header

```
More Projects
```

- Title: Syne font, 24px, weight 700, #FAFAFA
- No label/subtitle needed (keep it compact)

### Grid

```
+---------------------------+---------------------------+
|                           |                           |
|  Chatbot Multiagente      |  Playwright Automation    |
|  (medium card)             |  (medium card)             |
|                           |                           |
+---------------------------+---------------------------+
```

CSS:
```css
.secondary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .secondary-grid {
    grid-template-columns: 1fr;
  }
}
```

### Medium Card Anatomy

Same structure as featured cards but with smaller sizes:

```
+-------------------------------------------------------+
|  [emoji]  Title                                        |
|                                                         |
|  PROBLEM: One-line problem statement                    |
|  SOLUTION: One-line solution statement                  |
|                                                         |
|  [5 AI Agents]  [120 Tests]  [80% Auto-resolved]       |
|                                                         |
|  [React] [Node.js] [n8n] [Claude API]                  |
|                                                         |
|  [View Demo ->]  [GitHub]                               |
+-------------------------------------------------------+
```

### Medium Card Style Differences from Featured

| Property | Featured Card | Medium Card |
|---|---|---|
| Emoji size | 32px | 28px |
| Title size | 22px | 18px |
| Padding | 28px | 24px |
| Problem/Solution font | 14px | 13px |
| Max tech tags shown | 8 | 5 (+N more) |
| Button padding | 10px 20px | 9px 18px |
| Button font | 13px | 12px |

---

## Other Projects Section

### Header

```
Other Projects
```

- Title: Syne font, 20px, weight 600, rgba(255,255,255,0.7)
- Optional toggle: "Show all" / "Show less" to expand/collapse

### Collapsed State (default)

Show first 6 projects. Hide remaining 5 behind "Show all" button.

### Grid

```
+------------------+------------------+------------------+
|  HRScout          |  Ad Analytics    |  Fine-tuning     |
+------------------+------------------+------------------+
|  Lobos            |  La 5ta Esencia  |  Invoice Mgr     |
+------------------+------------------+------------------+
|  QuoteFlow        |  AgenticDev      |  ContentStudio   |  <- hidden by default
+------------------+------------------+------------------+
|  Multi-Agent      |  WordForge       |  ClientHub       |  <- hidden by default
+------------------+------------------+------------------+
```

CSS:
```css
.other-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 1024px) {
  .other-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .other-grid {
    grid-template-columns: 1fr;
  }
}
```

### Compact Card Anatomy

Minimal info only:

```
+----------------------------------+
|  [emoji]  Title                   |
|                                    |
|  [React] [FastAPI] [Claude API]   |
|                                    |
|  [Demo]  [GitHub]                 |
+----------------------------------+
```

No problem/solution lines. No metrics. Just title + tech + links.

### Compact Card Styles

```css
.compact-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: border-color 0.3s ease;
}
.compact-card:hover {
  border-color: rgba(99, 102, 241, 0.15);
}
.compact-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
}
.compact-card__header .emoji {
  font-size: 22px;
  line-height: 1;
}
.compact-card__header h4 {
  font-family: 'Syne', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #FAFAFA;
  margin: 0;
}
.compact-card__tech {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.compact-card__tech .tag {
  font-size: 11px;
  padding: 3px 8px;
}
.compact-card__actions {
  display: flex;
  gap: 8px;
  margin-top: auto;
}
.compact-card__actions a {
  font-size: 11px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 8px;
}
```

### Show All/Less Toggle

```
+-------------------------------------------------------+
|  [Show all 11 projects]  or  [Show less]               |
+-------------------------------------------------------+
```

Style:
```css
.toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin: 24px auto 0;
  padding: 10px 24px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}
.toggle-btn:hover {
  border-color: rgba(99, 102, 241, 0.2);
  color: rgba(255, 255, 255, 0.7);
}
```

---

## Full Projects Section Spacing

| Element | Spacing |
|---|---|
| Featured section padding-top | 120px |
| Featured header to grid | 48px |
| Featured grid to Secondary header | 80px |
| Secondary header to grid | 28px |
| Secondary grid to Other header | 64px |
| Other header to grid | 24px |
| Other section padding-bottom | 80px |

---

## Category Filter Removal

The current category filter pills (All | AI & Agents | Full Stack | Mobile | Automation) are **removed** in the new layout. The tiered layout (featured/secondary/other) replaces filtering.

Rationale:
1. Filtering hides your best work behind a click
2. Recruiters rarely filter -- they scroll
3. The tier system already creates visual hierarchy
4. Fewer UI controls = faster scanning

If filtering is desired later, add it as a sub-filter within the "Other Projects" section only.
