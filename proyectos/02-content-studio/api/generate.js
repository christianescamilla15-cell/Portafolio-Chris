// api/generate.js — Vercel Serverless Function that calls Cloudflare Workers AI
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { brandText, platform, tone, format, lang } = req.body

  if (!brandText) return res.status(400).json({ error: 'brandText is required' })

  // Try Cloudflare Workers AI
  const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID || ''
  const CF_API_TOKEN = process.env.CF_API_TOKEN || ''

  if (!CF_ACCOUNT_ID || !CF_API_TOKEN) {
    // Fallback: use HuggingFace free tier
    try {
      const hfResponse = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs: `<s>[INST] You are a senior social media copywriter. Generate marketing content for ${platform} in ${lang === 'es' ? 'Spanish' : 'English'}.

Brand: ${brandText}
Tone: ${tone}
Format: ${format}

Respond ONLY with valid JSON:
{"headline":"compelling headline max 10 words","subheadline":"supporting line max 15 words","body":"2-3 sentences about this specific brand","cta":"call to action max 5 words","hashtags":["5 relevant hashtags"]} [/INST]`,
          parameters: { max_new_tokens: 400, temperature: 0.8, return_full_text: false }
        })
      })

      if (hfResponse.ok) {
        const data = await hfResponse.json()
        const text = data[0]?.generated_text || ''
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          return res.status(200).json({ ...parsed, _source: 'huggingface-server', _model: 'Mistral-7B' })
        }
      }
    } catch (e) {
      // Fall through to error
    }

    return res.status(503).json({ error: 'No AI backend configured. Set CF_ACCOUNT_ID and CF_API_TOKEN, or content will use local generation.' })
  }

  // Cloudflare Workers AI
  try {
    const prompt = lang === 'es'
      ? `Eres un copywriter senior de redes sociales. Genera contenido de marketing para ${platform}.

Marca: ${brandText}
Tono: ${tone}
Formato: ${format}

Responde SOLO con JSON valido:
{"headline":"titular impactante max 10 palabras","subheadline":"subtitulo max 15 palabras","body":"2-3 oraciones sobre esta marca especifica","cta":"call to action max 5 palabras","hashtags":["5 hashtags relevantes"]}`
      : `You are a senior social media copywriter. Generate marketing content for ${platform}.

Brand: ${brandText}
Tone: ${tone}
Format: ${format}

Respond ONLY with valid JSON:
{"headline":"compelling headline max 10 words","subheadline":"supporting line max 15 words","body":"2-3 sentences about this specific brand","cta":"call to action max 5 words","hashtags":["5 relevant hashtags"]}`

    const cfResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.1-8b-instruct`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CF_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: `You are a senior social media copywriter. Always respond with valid JSON only.` },
            { role: 'user', content: prompt }
          ],
          max_tokens: 400,
          temperature: 0.8,
        })
      }
    )

    if (!cfResponse.ok) {
      return res.status(502).json({ error: 'Cloudflare AI error', status: cfResponse.status })
    }

    const cfData = await cfResponse.json()
    const responseText = cfData.result?.response || ''

    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return res.status(200).json({ ...parsed, _source: 'cloudflare-ai', _model: 'Llama-3.1-8B' })
    }

    return res.status(200).json({ headline: responseText.slice(0, 80), body: responseText, _source: 'cloudflare-ai', _model: 'Llama-3.1-8B' })

  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
