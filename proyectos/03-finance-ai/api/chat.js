// Vercel serverless function — proxies LLM API calls (Groq primary, Claude fallback)
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const groqKey = process.env.GROQ_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  // Try Groq first (free, fast)
  if (groqKey) {
    try {
      const { messages, system, max_tokens, tools } = req.body;

      // Convert Claude format to Groq/OpenAI format
      const groqMessages = [];
      if (system) groqMessages.push({ role: "system", content: system });
      if (messages) groqMessages.push(...messages);

      const groqBody = {
        model: "llama-3.3-70b-versatile",
        max_tokens: max_tokens || 1024,
        messages: groqMessages,
        temperature: 0.3,
      };

      // If tools are present, convert to OpenAI function calling format
      if (tools && tools.length > 0) {
        groqBody.tools = tools.map(t => ({
          type: "function",
          function: {
            name: t.name,
            description: t.description,
            parameters: t.input_schema || {},
          },
        }));
      }

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqKey}`,
        },
        body: JSON.stringify(groqBody),
      });

      if (response.ok) {
        const data = await response.json();
        // Convert Groq response to Claude-compatible format
        const choice = data.choices?.[0];
        const toolCalls = choice?.message?.tool_calls;

        if (toolCalls && toolCalls.length > 0) {
          return res.status(200).json({
            content: toolCalls.map(tc => ({
              type: "tool_use",
              id: tc.id,
              name: tc.function.name,
              input: JSON.parse(tc.function.arguments || "{}"),
            })),
            stop_reason: "tool_use",
            _provider: "groq",
          });
        }

        return res.status(200).json({
          content: [{ type: "text", text: choice?.message?.content || "" }],
          stop_reason: "end_turn",
          _provider: "groq",
        });
      }
    } catch (err) {
      console.error("Groq error, falling back to Claude:", err.message);
    }
  }

  // Fallback to Claude
  if (!anthropicKey) return res.status(500).json({ error: 'No API keys configured' });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    data._provider = "claude";
    if (!response.ok) return res.status(response.status).json(data);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
