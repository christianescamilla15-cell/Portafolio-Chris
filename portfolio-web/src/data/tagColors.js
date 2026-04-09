export const TAG_COLORS = {
  'Claude API': '#818CF8', 'GPT-4o': '#818CF8', 'LangChain': '#818CF8', 'RLHF': '#818CF8', 'DALL-E 3': '#818CF8',
  'anthropic SDK': '#818CF8', 'EARS': '#818CF8', 'CrewAI': '#818CF8', 'MCP': '#818CF8', 'MLOps': '#818CF8',
  'Pydantic v2': '#818CF8', 'AWS Bedrock': '#818CF8',
  'Node.js': '#6EE7C7', 'FastAPI': '#6EE7C7', 'Laravel': '#6EE7C7', 'Express': '#6EE7C7', 'Flask': '#6EE7C7',
  'Fastify': '#6EE7C7', 'Supabase': '#6EE7C7',
  'Flutter': '#FCD34D', 'Kotlin': '#FCD34D', 'Jetpack Compose': '#FCD34D', 'Dart': '#FCD34D', 'Room': '#FCD34D',
  'Riverpod': '#FCD34D', 'RevenueCat': '#FCD34D', 'Material 3': '#FCD34D',
  'React': '#67E8F9', 'Vue.js': '#67E8F9', 'Vue.js 3': '#67E8F9', 'Tailwind CSS': '#67E8F9', 'TypeScript': '#67E8F9',
  'PostgreSQL': '#FDA4AF', 'MySQL': '#FDA4AF', 'pgvector': '#FDA4AF', 'Redis': '#FDA4AF', 'Pandas': '#FDA4AF',
  'Terraform': '#C4B5FD', 'Kubernetes': '#C4B5FD',
  'Docker': '#C4B5FD', 'Meta API': '#67E8F9', 'Google API': '#67E8F9', 'GA4': '#67E8F9',
  'AWS S3': '#C4B5FD', 'Lambda': '#C4B5FD',
  'Playwright': '#C4B5FD', 'SQLite': '#FDA4AF', 'pytest': '#F472B6',
  'PyTorch': '#818CF8', 'HuggingFace': '#818CF8', 'Transformers': '#818CF8', 'scikit-learn': '#818CF8',
  'Bootstrap 5': '#67E8F9', 'Vercel Serverless': '#C4B5FD',
  'Notion': '#818CF8', 'n8n': '#C4B5FD', 'Softr': '#67E8F9', 'Airtable': '#67E8F9',
}

export function getTagColor(tag) {
  return TAG_COLORS[tag] || '#9CA3AF'
}

export function getTagBg(tag) {
  const color = getTagColor(tag)
  const r = parseInt(color.slice(1, 3), 16)
  const g = parseInt(color.slice(3, 5), 16)
  const b = parseInt(color.slice(5, 7), 16)
  return `rgba(${r},${g},${b},0.08)`
}

export function getTagBorder(tag) {
  const color = getTagColor(tag)
  const r = parseInt(color.slice(1, 3), 16)
  const g = parseInt(color.slice(3, 5), 16)
  const b = parseInt(color.slice(5, 7), 16)
  return `rgba(${r},${g},${b},0.12)`
}
