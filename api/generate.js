export default async function handler(req, res) {
  console.log("=== OPENAI generate route is running ===");

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { prompt } = req.body;
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  try {
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OPENAI_API_KEY 未读取到' });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500,
        temperature: 0.8
      })
    });

    const data = await response.json();
    console.log("openai response:", JSON.stringify(data));

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const text = data.choices?.[0]?.message?.content || '';
    return res.status(200).json({ text });

  } catch (err) {
    console.error("generate error:", err);
    return res.status(500).json({ error: err.message });
  }
}
