// Generate embeddings for all portfolio projects using Voyage AI
// Run: node scripts/generate-embeddings.js
import { createClient } from '@supabase/supabase-js'

const VOYAGE_URL = 'https://api.voyageai.com/v1/embeddings'
const VOYAGE_API_KEY = process.env.VOYAGE_API_KEY || ''

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY')
  process.exit(1)
}
if (!VOYAGE_API_KEY) {
  console.error('Missing VOYAGE_API_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function getEmbedding(text) {
  const response = await fetch(VOYAGE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${VOYAGE_API_KEY}`,
    },
    body: JSON.stringify({ input: [text], model: 'voyage-3-lite' }),
  })

  if (!response.ok) throw new Error(`Voyage API error: ${response.status} — ${await response.text()}`)
  const result = await response.json()
  return result.data?.[0]?.embedding
}

async function main() {
  console.log('=== Generate Embeddings (Voyage AI) ===\n')

  const { data: projects, error } = await supabase
    .from('portfolio_projects')
    .select('id, name, description_en, description_es, stack')

  if (error) { console.error('Error loading projects:', error.message); process.exit(1) }
  console.log(`Found ${projects.length} projects\n`)

  for (const project of projects) {
    const textEn = `${project.name}. ${project.description_en}. Technologies: ${project.stack}`
    const textEs = `${project.name}. ${project.description_es}. Tecnologias: ${project.stack}`

    console.log(`Embedding: ${project.name}...`)

    try {
      const [embeddingEn, embeddingEs] = await Promise.all([
        getEmbedding(textEn),
        getEmbedding(textEs),
      ])

      const { error: updateError } = await supabase
        .from('portfolio_projects')
        .update({
          embedding: JSON.stringify(embeddingEn),
          embedding_es: JSON.stringify(embeddingEs),
        })
        .eq('id', project.id)

      if (updateError) {
        console.error(`  ✗ ${project.name}: ${updateError.message}`)
      } else {
        console.log(`  ✓ ${project.name} (EN: ${embeddingEn.length}d, ES: ${embeddingEs.length}d)`)
      }
    } catch (err) {
      console.error(`  ✗ ${project.name}: ${err.message}`)
    }

    await new Promise(r => setTimeout(r, 300))
  }

  console.log('\n✓ Done!')
}

main().catch(console.error)
