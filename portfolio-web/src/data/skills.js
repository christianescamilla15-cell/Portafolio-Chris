export const SKILLS = [
  {
    category: { es: 'IA & LLMs', en: 'AI & LLMs' },
    items: ['Claude API', 'GPT-4o', 'LangChain', 'RLHF', 'Prompt Engineering', 'Multiagentes'],
    gradient: 'linear-gradient(135deg, rgba(99,102,241,.12), rgba(139,92,246,.08))',
    accentColor: '#818CF8',
    span: 2,
  },
  {
    category: { es: 'Backend & APIs', en: 'Backend & APIs' },
    items: ['Node.js', 'FastAPI', 'Laravel', 'Express', 'Supabase', 'PostgreSQL'],
    gradient: 'linear-gradient(135deg, rgba(16,185,129,.1), rgba(52,211,153,.06))',
    accentColor: '#34D399',
    span: 1,
  },
  {
    category: { es: 'Mobile & Frontend', en: 'Mobile & Frontend' },
    items: ['Flutter', 'React', 'Kotlin', 'Vue.js', 'Tailwind CSS', 'TypeScript'],
    gradient: 'linear-gradient(135deg, rgba(103,232,249,.1), rgba(34,211,238,.06))',
    accentColor: '#67E8F9',
    span: 1,
  },
  {
    category: { es: 'DevOps & Automatización', en: 'DevOps & Automation' },
    items: ['Docker', 'GitHub Actions', 'n8n', 'Vercel', 'Render', 'AWS'],
    gradient: 'linear-gradient(135deg, rgba(251,146,60,.1), rgba(253,186,116,.06))',
    accentColor: '#FDBA74',
    span: 1,
  },
  {
    category: { es: 'Testing & QA', en: 'Testing & QA' },
    items: ['Jest', 'Pytest', 'PHPUnit', 'Vitest', 'CI/CD', 'TDD'],
    gradient: 'linear-gradient(135deg, rgba(244,114,182,.1), rgba(251,113,133,.06))',
    accentColor: '#F472B6',
    span: 1,
  },
]

export const SKILL_BARS = [
  { name: 'AI & LLMs', level: 95, color: '#818CF8', items: ['Claude API','Groq','LangChain','CrewAI','RLHF','RAG','pgvector','Prompt Engineering'] },
  { name: 'Backend & APIs', level: 85, color: '#34D399', items: ['FastAPI','Node.js','Express','Laravel','Supabase','PostgreSQL','Redis'] },
  { name: 'Frontend & Mobile', level: 80, color: '#67E8F9', items: ['React 18','Flutter','Vue.js','Vite','Tailwind'] },
  { name: 'DevOps & Infra', level: 75, color: '#FDBA74', items: ['Docker','Terraform','Kubernetes','GitHub Actions','AWS','Vercel'] },
  { name: 'Testing & QA', level: 85, color: '#F472B6', items: ['Vitest','pytest','PHPUnit','CI/CD','1,346+ tests','ESLint'] },
]
