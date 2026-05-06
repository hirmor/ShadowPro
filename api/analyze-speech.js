/**
 * POST /api/analyze-speech
 * Body: { originalScript, transcript, materialTitle, sentences }
 * Returns structured analysis of shadowing performance.
 * Falls back to local word-diff analysis if ANTHROPIC_API_KEY is not set.
 */

function localAnalysis(originalScript, transcript) {
  const normalize = (s) =>
    (s || "").toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/).filter(Boolean);
  const origWords = normalize(originalScript);
  const transWords = new Set(normalize(transcript));
  const hits = origWords.filter((w) => transWords.has(w)).length;
  const coverage = origWords.length > 0 ? Math.round((hits / origWords.length) * 100) : 0;

  return {
    coveragePct: coverage,
    summary:
      coverage >= 70
        ? `You covered about ${coverage}% of the script. Good attempt — keep refining your pace and clarity.`
        : `You covered about ${coverage}% of the script. Try following the text more closely in your next session.`,
    strengths: coverage >= 60 ? ["Attempted most of the material"] : [],
    missed: coverage < 80 ? ["Some words or phrases were unclear or skipped"] : [],
    rhythm:
      "Add ANTHROPIC_API_KEY to Vercel environment variables for detailed rhythm and stress analysis.",
    improvements: [
      {
        type: "rhythm",
        note: "Try to match the pace of the original speaker sentence by sentence.",
      },
      {
        type: "stress",
        note: "Focus on stressing the key content words (nouns, verbs, adjectives) in each sentence.",
      },
    ],
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { originalScript, transcript, materialTitle, sentences } = req.body;

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(200).json(localAnalysis(originalScript, transcript));
  }

  const sentList = (sentences || [])
    .slice(0, 20)
    .map((s, i) => `${i + 1}. ${s}`)
    .join("\n");

  const prompt = `You are an expert English speaking coach reviewing a shadowing practice recording.

Material: "${materialTitle}"

Original script:
${sentList}

Student's speech recognition transcript:
"${transcript || "(nothing detected — mic may not have captured voice)"}"

Analyze the student's shadowing performance. Return ONLY valid JSON, no extra text:
{
  "coveragePct": <integer 0-100, estimated % of script the student said>,
  "summary": "<2 sentences: overall honest impression>",
  "strengths": ["<specific thing they did well>", "<another strength if any>"],
  "missed": ["<specific phrase or sentence that was skipped or unclear>"],
  "rhythm": "<1-2 sentences about pacing, pausing, or sentence-level rhythm>",
  "improvements": [
    {"type": "rhythm|stress|flow|linking", "note": "<specific actionable coaching tip, 20-35 words>"},
    {"type": "rhythm|stress|flow|linking", "note": "<another tip>"},
    {"type": "rhythm|stress|flow|linking", "note": "<another tip>"}
  ]
}`;

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 700,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!r.ok) throw new Error(`Claude API ${r.status}`);
    const data = await r.json();
    const text = data.content?.[0]?.text?.trim() || "";
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON in response");
    return res.status(200).json(JSON.parse(match[0]));
  } catch (err) {
    console.error("[analyze-speech]", err.message);
    return res.status(200).json(localAnalysis(originalScript, transcript));
  }
}
