/**
 * Embeddings Middleware
 * Voyage AI vector embedding generation (voyage-3-lite, 512d, multilingual).
 * Used by the recommendation endpoint for semantic search via pgvector.
 */
const VOYAGE_URL = 'https://api.voyageai.com/v1/embeddings'

export async function getQueryEmbedding(text) {
  const VOYAGE_API_KEY = process.env.VOYAGE_API_KEY || ''
  if (!VOYAGE_API_KEY) throw new Error('VOYAGE_API_KEY not configured')

  const response = await fetch(VOYAGE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${VOYAGE_API_KEY}`,
    },
    body: JSON.stringify({
      input: [text],
      model: 'voyage-3-lite',
    }),
  })

  if (!response.ok) throw new Error(`Voyage API error: ${response.status}`)

  const result = await response.json()
  return result.data?.[0]?.embedding
}
