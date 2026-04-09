/**
 * CORS Middleware
 * Whitelist-based origin validation with preflight handling.
 * Returns true on OPTIONS (preflight) — caller should short-circuit with 200.
 * Origins configured via ALLOWED_ORIGINS env var (comma-separated, or '*' for dev).
 */
export function cors(req, res) {
  const allowed = (process.env.ALLOWED_ORIGINS || '*').split(',').map(s => s.trim())
  const origin = req.headers.origin || ''

  if (allowed.includes('*') || allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*')
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Key')

  // Return true if preflight (caller should end response)
  return req.method === 'OPTIONS'
}
