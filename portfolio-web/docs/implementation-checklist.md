# PHASE I: Implementation Checklist

## Pre-flight

- [ ] Create a git branch: `refactor/portfolio-v2`
- [ ] Run `npm run build` on current code to confirm baseline builds
- [ ] Take screenshots of current site for before/after comparison

---

## Step 1: Update projects.js data

**File**: `src/data/projects.js`

- [ ] Replace PROJECTS array with new schema (category: featured/secondary/other, priority, problem, solution, metrics)
- [ ] Remove old fields: description, description_en, featured, keyMetric, presentationUrl, tagline, terminalLines, impactMetric
- [ ] Remove FEATURED_ORDER export (no longer needed)
- [ ] Remove PROJECT_CATEGORIES export (no longer needed)
- [ ] Keep CATEGORIES export if tech-domain filtering is desired later
- [ ] Keep PROJECT_METRICS export (now embedded in each project, but keep for backward compat during migration)
- [ ] Verify all 18 projects have demoUrl and repoUrl fields

**Estimated time**: 30 min

---

## Step 2: Create MetricsBadge.jsx

**File**: `src/ui/MetricsBadge.jsx` (NEW)

- [ ] Create component with props: value, label, color
- [ ] Style: pill badge with background tint and border
- [ ] Export default

**Estimated time**: 10 min

---

## Step 3: Extract and refactor ProjectCard.jsx

**File**: `src/components/projects/ProjectCard.jsx` (NEW, extracted from Projects.jsx)

- [ ] Extract ProjectCard from Projects.jsx into its own file
- [ ] Add `size` prop: 'large' | 'medium' | 'compact'
- [ ] Add problem/solution display for large and medium sizes
- [ ] Add MetricsBadge rendering from project.metrics array
- [ ] Compact size: title + tech (3 max) + links only
- [ ] Import StackTag, MetricsBadge, Icons

**Estimated time**: 45 min

---

## Step 4: Create FeaturedProjects.jsx

**File**: `src/components/projects/FeaturedProjects.jsx` (NEW)

- [ ] Import ProjectCard, PROJECTS (filtered by category === 'featured')
- [ ] Sort by priority
- [ ] 2-column grid, first card spans full width
- [ ] Section header: "PORTFOLIO" label + "Featured Projects" title + subtitle
- [ ] Add reveal animation class
- [ ] Responsive: 1-column on mobile

**Estimated time**: 30 min

---

## Step 5: Create SecondaryProjects.jsx

**File**: `src/components/projects/SecondaryProjects.jsx` (NEW)

- [ ] Import ProjectCard, PROJECTS (filtered by category === 'secondary')
- [ ] Sort by priority
- [ ] 2-column grid, even columns
- [ ] Section header: "More Projects"
- [ ] Responsive: 1-column on mobile

**Estimated time**: 20 min

---

## Step 6: Create OtherProjects.jsx

**File**: `src/components/projects/OtherProjects.jsx` (NEW)

- [ ] Import ProjectCard, PROJECTS (filtered by category === 'other')
- [ ] Sort by priority
- [ ] 3-column compact grid
- [ ] Collapsed by default (show first 6, toggle to show all)
- [ ] useState for expanded state
- [ ] "Show all N projects" / "Show less" button
- [ ] Section header: "Other Projects"
- [ ] Responsive: 2-column tablet, 1-column mobile

**Estimated time**: 30 min

---

## Step 7: Update Hero.jsx

**File**: `src/components/hero/Hero.jsx`

- [ ] Update heroRole string key (already in strings.js)
- [ ] Add stack badges row: Python, FastAPI, React, PostgreSQL, pgvector, Flutter, Docker, Claude API
- [ ] Add credential badges: Scale AI, Remote OK, CDMX
- [ ] Use StackTag component for tech badges
- [ ] Keep existing stats, CTAs

**Estimated time**: 20 min

---

## Step 8: Update strings.js

**File**: `src/data/strings.js`

- [ ] Update heroRole with new expanded title
- [ ] Update heroSubtitle with numbers inline
- [ ] Remove About-related strings (aboutLabel, aboutTitle, aboutBody, aboutStatement)
- [ ] Remove Journey-related strings (journeyLabel, journeyTitle)
- [ ] Remove Testimonials-related strings (testimonialsLabel, testimonialsTitle, navTestimonials, navJourney)
- [ ] Add new strings for section headers if needed

**Estimated time**: 15 min

---

## Step 9: Update App.jsx

**File**: `src/App.jsx`

- [ ] Remove lazy import for About
- [ ] Remove lazy import for Journey
- [ ] Add lazy imports for FeaturedProjects, SecondaryProjects, OtherProjects
- [ ] Remove About section from JSX
- [ ] Remove Journey section from JSX
- [ ] Replace Projects section with: FeaturedProjects + SecondaryProjects + OtherProjects
- [ ] Keep Skills, Contact, Footer, PortfolioChatbot
- [ ] Update scroll reveal section list if needed

**Estimated time**: 15 min

---

## Step 10: Update Navbar.jsx

**File**: `src/components/layout/Navbar.jsx`

- [ ] Remove 'about' and 'journey' from links array
- [ ] Remove 'testimonials' from IntersectionObserver sections array
- [ ] Links should be: Projects, Skills, Contact only
- [ ] Verify mobile menu also updated

**Estimated time**: 10 min

---

## Step 11: Simplify Skills.jsx

**File**: `src/components/skills/Skills.jsx`

- [ ] Remove FloatingTagCloud component (inline, ~50 lines)
- [ ] Remove SkillMatcher import and JSX
- [ ] Remove ConfettiBurst component (inline, ~30 lines)
- [ ] Keep SkillsRadar and SkillBarAnimated
- [ ] Optionally extract SkillsRadar and SkillBarAnimated to their own files

**Estimated time**: 20 min

---

## Step 12: Delete unused files

- [ ] `src/components/about/About.jsx`
- [ ] `src/components/journey/Journey.jsx`
- [ ] `src/components/testimonials/Testimonials.jsx`
- [ ] `src/components/skills/SkillMatcher.jsx`
- [ ] `src/components/layout/AnimatedSpacer.jsx`
- [ ] `src/components/layout/AuroraBackground.jsx`
- [ ] `src/components/layout/LoadingScreen.jsx`
- [ ] `src/ui/AnimatedTitle.jsx`
- [ ] `src/ui/ScrollRevealText.jsx`
- [ ] `src/ui/ImagePlaceholder.jsx`
- [ ] `src/ui/CodingActivity.jsx`
- [ ] `src/ui/TextScramble.jsx`
- [ ] `src/hooks/useScrollReveal.js`
- [ ] `src/hooks/useActiveSection.js`
- [ ] `src/data/timeline.js`
- [ ] `src/data/testimonials.js`

**16 files to delete**

**Estimated time**: 5 min

---

## Step 13: Fix bugs

- [ ] **Projects.jsx CountUpMetric bug**: Add `import { useInView as useFramerInView } from 'framer-motion'` or remove CountUpMetric (it's only used in TheaterPanel which is dead code)
- [ ] Remove TheaterPanel from Projects.jsx (dead code, ~230 lines)
- [ ] Remove BrowserMockup and TerminalContent from Projects.jsx (only used by TheaterPanel)
- [ ] Remove ProjectTable if table view is no longer desired

**Estimated time**: 15 min

---

## Step 14: Clean up old Projects.jsx

**File**: `src/components/projects/Projects.jsx`

- [ ] This file can be deleted entirely once FeaturedProjects, SecondaryProjects, and OtherProjects are working
- [ ] Or keep as a thin wrapper that renders all three sections
- [ ] Remove all dead internal components (TheaterPanel, BrowserMockup, TerminalContent, CountUpMetric, ProjectTable)
- [ ] Remove category filter pills and view mode toggle

**Estimated time**: 10 min

---

## Step 15: Build and verify

- [ ] Run `npm run build` -- must succeed with 0 errors
- [ ] Run `npm run dev` -- verify all sections render
- [ ] Test mobile responsive (768px breakpoint)
- [ ] Test language toggle (ES/EN)
- [ ] Verify all demo links work
- [ ] Verify all GitHub links work
- [ ] Check Lighthouse score (target: 90+ performance)
- [ ] Take after screenshots for comparison

**Estimated time**: 20 min

---

## Step 16: Deploy

- [ ] Commit all changes
- [ ] Push to main or merge PR
- [ ] Verify Vercel deployment succeeds
- [ ] Test production URL

**Estimated time**: 10 min

---

## Summary

| Step | Task | Est. Time |
|---|---|---|
| 1 | Update projects.js data | 30 min |
| 2 | Create MetricsBadge.jsx | 10 min |
| 3 | Extract ProjectCard.jsx | 45 min |
| 4 | Create FeaturedProjects.jsx | 30 min |
| 5 | Create SecondaryProjects.jsx | 20 min |
| 6 | Create OtherProjects.jsx | 30 min |
| 7 | Update Hero.jsx | 20 min |
| 8 | Update strings.js | 15 min |
| 9 | Update App.jsx | 15 min |
| 10 | Update Navbar.jsx | 10 min |
| 11 | Simplify Skills.jsx | 20 min |
| 12 | Delete unused files (16) | 5 min |
| 13 | Fix bugs | 15 min |
| 14 | Clean up Projects.jsx | 10 min |
| 15 | Build and verify | 20 min |
| 16 | Deploy | 10 min |
| **Total** | | **~5 hours** |

---

## Risk Mitigation

1. **PortfolioChatbot dependency**: The chatbot imports from `api/kb.js` which may reference project data. Verify that the chatbot knowledge base is updated after data schema changes.
2. **SEO impact**: Removing About and Journey sections removes content that may be indexed. Update meta description if needed.
3. **Scroll behavior**: The App.jsx scroll reveal system checks for `.reveal` classes. Ensure new components use the `reveal` class.
4. **Framer Motion**: FeaturedProjects and SecondaryProjects should NOT add Framer Motion dependency for animations -- use CSS `.reveal` system to keep bundle small.
