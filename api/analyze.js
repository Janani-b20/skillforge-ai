// api/analyze.js  — Vercel serverless function
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { pdfBase64, jobDescription, githubUsername } = req.body;

  if (!pdfBase64) {
    return res.status(400).json({ error: 'pdfBase64 is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY; // server-side only, no REACT_APP_ prefix
  const model = 'gemini-2.5-flash';

  const prompt = `
You are an expert ATS resume analyzer. Analyze the provided resume PDF against the job description below.

Job Description:
${jobDescription || 'No job description provided. Return matchScore: 0 and ask the user to provide one.'}

GitHub Username (optional, for context): ${githubUsername || 'Not provided'}

Return ONLY valid JSON with this exact shape — no markdown, no explanation:
{
  "matchScore": <0-100 integer>,
  "verdict": "<one sentence summary>",
  "strengths": ["<strength 1>", "<strength 2>", ...],
  "skillGaps": ["<gap 1>", "<gap 2>", ...],
  "recommendations": ["<rec 1>", "<rec 2>", ...],
  "keywordsMatched": ["<keyword>", ...],
  "keywordsMissing": ["<keyword>", ...]
}
`;

  const payload = {
    contents: [
      {
        parts: [
          {
            inline_data: {
              mime_type: 'application/pdf',
              data: pdfBase64,
            },
          },
          { text: prompt },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: 'application/json',
    },
  };

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      // Fallback to lite model on overload
      if (geminiRes.status === 503 || errText.includes('overloaded')) {
        const liteRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }
        );
        if (!liteRes.ok) {
          const liteErr = await liteRes.text();
          return res.status(502).json({ error: `Gemini lite error: ${liteErr}` });
        }
        const liteData = await liteRes.json();
        const liteText = liteData.candidates[0].content.parts[0].text;
        return res.status(200).json(JSON.parse(liteText));
      }
      return res.status(502).json({ error: `Gemini error: ${errText}` });
    }

    const data = await geminiRes.json();
    const text = data.candidates[0].content.parts[0].text;
    return res.status(200).json(JSON.parse(text));
  } catch (err) {
    console.error('analyze error:', err);
    return res.status(500).json({ error: err.message });
  }
}