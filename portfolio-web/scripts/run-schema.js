// Execute schema SQL against Supabase using individual table creation via REST API
// For DDL operations, we create tables using supabase-js workarounds
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://rwhvjtfargojxccqblfb.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

if (!SUPABASE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY')
  process.exit(1)
}

const schemaSQL = readFileSync(join(__dirname, 'schema.sql'), 'utf-8')

async function main() {
  console.log('=== Running Schema SQL ===\n')
  console.log(`Target: ${SUPABASE_URL}\n`)

  // Split SQL into individual statements
  const statements = schemaSQL
    .split(/;\s*\n/)
    .map(s => s.trim())
    .filter(s => s && !s.match(/^\s*--/))

  // Execute each statement via Supabase's internal pg endpoint
  for (let i = 0; i < statements.length; i++) {
    const sql = statements[i] + ';'
    const label = sql.slice(0, 60).replace(/\n/g, ' ')
    process.stdout.write(`[${i + 1}/${statements.length}] ${label}... `)

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({ _sql: sql })
      })

      // Alternative: use the /query endpoint available in some Supabase versions
      if (!response.ok) {
        // Try via the query endpoint
        const resp2 = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
          },
          body: JSON.stringify({ sql })
        })

        if (resp2.ok) {
          console.log('✓')
        } else {
          console.log(`⚠ ${resp2.status}`)
        }
      } else {
        console.log('✓')
      }
    } catch (err) {
      console.log(`✗ ${err.message}`)
    }
  }

  console.log('\n---')
  console.log('If statements failed, copy the SQL from scripts/schema.sql')
  console.log('and paste it in: Supabase Dashboard → SQL Editor → New Query → Run')
}

main().catch(console.error)
