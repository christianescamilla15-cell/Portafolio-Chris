// Seed script — populates Supabase with portfolio KB data
// Run: node scripts/seed-kb.js
import { createClient } from '@supabase/supabase-js'
import { PORTFOLIO_KB } from '../api/kb.js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function seedProjects() {
  console.log('Seeding portfolio_projects...')
  const rows = PORTFOLIO_KB.projects.map(p => ({
    name: p.name,
    description_en: p.description.en,
    description_es: p.description.es,
    stack: p.stack,
    tests: p.tests || null,
    demo: p.demo || null,
    github: p.github || null,
    key_metric: p.keyMetric || null,
  }))

  const { error } = await supabase
    .from('portfolio_projects')
    .upsert(rows, { onConflict: 'name' })

  if (error) {
    console.error('Error seeding projects:', error.message)
  } else {
    console.log(`  ✓ ${rows.length} projects seeded`)
  }
}

async function seedMeta() {
  console.log('Seeding portfolio_meta...')
  const metaKeys = ['about', 'skills', 'experience', 'contact', 'availability', 'metrics']
  const rows = metaKeys.map(key => ({
    key,
    value_en: PORTFOLIO_KB[key]?.en || '',
    value_es: PORTFOLIO_KB[key]?.es || '',
  }))

  const { error } = await supabase
    .from('portfolio_meta')
    .upsert(rows, { onConflict: 'key' })

  if (error) {
    console.error('Error seeding meta:', error.message)
  } else {
    console.log(`  ✓ ${rows.length} meta entries seeded`)
  }
}

async function main() {
  console.log('=== Portfolio KB Seed ===\n')
  await seedProjects()
  await seedMeta()
  console.log('\n✓ Done!')
}

main().catch(console.error)
