/**
 * Podcast read endpoint — called by the frontend on mount.
 *
 * Returns today's pre-generated podcast from JSONbin.
 * If JSONbin is not configured, returns { configured: false }
 * so the frontend knows to show a setup message.
 */
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");

  if (!process.env.JSONBIN_BIN_ID || !process.env.JSONBIN_API_KEY) {
    return res.status(200).json({ configured: false, episodes: [] });
  }

  try {
    const r = await fetch(
      `https://api.jsonbin.io/v3/b/${process.env.JSONBIN_BIN_ID}/latest`,
      { headers: { "X-Master-Key": process.env.JSONBIN_API_KEY } }
    );

    if (!r.ok) throw new Error(`JSONbin error: ${r.status}`);

    const data = await r.json();
    return res.status(200).json({ ...data.record, configured: true });
  } catch (err) {
    console.error("[podcast] Read failed:", err);
    return res.status(500).json({ error: err.message, episodes: [] });
  }
}
