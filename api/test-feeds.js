/**
 * Debug endpoint — tests RSS feeds without saving anything.
 * GET /api/test-feeds
 * No auth required (read-only, harmless).
 */

const FEEDS = [
  { label: "BBC World",       url: "https://feeds.bbci.co.uk/news/world/rss.xml" },
  { label: "BBC Top",         url: "https://feeds.bbci.co.uk/news/rss.xml" },
  { label: "Guardian World",  url: "https://www.theguardian.com/world/rss" },
  { label: "Guardian US",     url: "https://www.theguardian.com/us-news/rss" },
  { label: "Japan Times",     url: "https://www.japantimes.co.jp/feed/" },
];

function parseRSS(xml) {
  const items = [];
  const itemRegex = /<item[\s>]([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const rawTitle = block.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1] ?? "";
    const title = rawTitle.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/, "$1").replace(/<[^>]*>/g, "").trim();
    if (title) items.push(title);
  }
  return items;
}

export default async function handler(req, res) {
  const results = [];

  for (const { label, url } of FEEDS) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    try {
      const r = await fetch(url, {
        headers: { "User-Agent": "ShadowPro-PodcastBot/1.0" },
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (!r.ok) {
        results.push({ label, url, status: r.status, items: 0, sample: [] });
        continue;
      }
      const xml = await r.text();
      const titles = parseRSS(xml);
      results.push({ label, url, status: r.status, items: titles.length, sample: titles.slice(0, 3) });
    } catch (err) {
      clearTimeout(timer);
      results.push({ label, url, error: err.message, items: 0, sample: [] });
    }
  }

  return res.status(200).json({ results });
}
