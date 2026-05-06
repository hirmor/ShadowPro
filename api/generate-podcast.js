/**
 * Podcast generation endpoint
 *
 * Called by Vercel Cron at 21:00 UTC (= 06:00 JST) every day.
 * Can also be triggered manually:
 *   curl -X POST https://your-app.vercel.app/api/generate-podcast \
 *        -H "Authorization: Bearer <CRON_SECRET>"
 *
 * Required env vars:
 *   CRON_SECRET      – any random string; protects manual triggers
 *   JSONBIN_BIN_ID   – JSONbin.io bin ID (create a free bin at jsonbin.io)
 *   JSONBIN_API_KEY  – JSONbin.io master key
 *
 * Optional:
 *   ANTHROPIC_API_KEY – enables Claude-generated scripts (much better quality)
 */

const RSS_EPISODES = [
  {
    id: "world",
    topic: "World News",
    feeds: [
      "https://feeds.bbci.co.uk/news/world/rss.xml",
      "https://feeds.bbci.co.uk/news/rss.xml",
    ],
  },
  {
    id: "business",
    topic: "Business & Economy",
    feeds: [
      "https://feeds.bbci.co.uk/news/business/rss.xml",
    ],
  },
  {
    id: "tech",
    topic: "Tech & Science",
    feeds: [
      "https://feeds.bbci.co.uk/news/technology/rss.xml",
      "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml",
    ],
  },
];

function stripHtml(html = "") {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchFeed(url) {
  const res = await fetch(
    `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}&count=6`
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.status === "ok" ? data.items : [];
}

async function fetchEpisodeStories(feeds) {
  const allItems = [];
  for (const url of feeds) {
    try {
      const items = await fetchFeed(url);
      allItems.push(...items);
    } catch {
      // skip failed feeds
    }
  }
  // deduplicate by title, take top 5 by recency
  const seen = new Set();
  return allItems
    .filter((item) => {
      if (seen.has(item.title)) return false;
      seen.add(item.title);
      return true;
    })
    .slice(0, 5);
}

// Template-based script (~400 words, ~3 min at 130 wpm)
function buildTemplateScript(topic, stories, dateStr) {
  const lines = [];

  lines.push(`Good morning. Welcome to your ${topic} briefing for ${dateStr}.`);
  lines.push(
    `I'm your AI host, and here are the three stories you need to know today.`
  );
  lines.push("");

  stories.slice(0, 3).forEach((story, i) => {
    const desc = stripHtml(story.description || story.content || "")
      .replace(/\n/g, " ")
      .slice(0, 280);

    lines.push(`Story ${i + 1}: ${story.title}.`);
    if (desc) lines.push(desc);
    lines.push("");
  });

  lines.push(
    `That's your ${topic} briefing for ${dateStr}. ` +
    `Stay informed, keep practicing your English, and have a great day. ` +
    `We'll be back tomorrow morning with your next briefing.`
  );

  return lines.join("\n");
}

// Claude-powered script (natural, broadcast-quality)
async function buildClaudeScript(topic, stories, dateStr) {
  const storySummaries = stories
    .slice(0, 4)
    .map(
      (s, i) =>
        `${i + 1}. ${s.title}\n   ${stripHtml(s.description || "").slice(0, 220)}`
    )
    .join("\n\n");

  const prompt = `You are a professional radio broadcaster. Write a 3-minute English news podcast script for the topic "${topic}" dated ${dateStr}.

Requirements:
- Natural spoken English only — NO music cues, NO [brackets], NO stage directions, NO asterisks
- Target: exactly 400–430 words (≈ 3 minutes at 130 wpm)
- Tone: warm, clear, professional; suitable for English learners at B2 level
- Structure: brief greeting intro → 3 news stories (each ~1 minute) → short sign-off
- Do NOT add section headings or numbers — just continuous natural speech

Today's stories (use all three as the basis):
${storySummaries}

Begin the script directly with "Good morning."`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 800,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.content?.[0]?.text?.trim() || null;
}

async function generateEpisode(ep, dateStr) {
  const stories = await fetchEpisodeStories(ep.feeds);

  let script;
  if (process.env.ANTHROPIC_API_KEY) {
    script =
      (await buildClaudeScript(ep.topic, stories, dateStr).catch(() => null)) ||
      buildTemplateScript(ep.topic, stories, dateStr);
  } else {
    script = buildTemplateScript(ep.topic, stories, dateStr);
  }

  const wordCount = script.split(/\s+/).length;

  return {
    id: ep.id,
    topic: ep.topic,
    title: `${ep.topic} Briefing`,
    script,
    stories: stories.slice(0, 3).map((s) => ({
      title: s.title,
      description: stripHtml(s.description || "").slice(0, 200),
      link: s.link,
      pubDate: s.pubDate,
    })),
    wordCount,
    durationMin: Math.round(wordCount / 130),
  };
}

async function savePodcast(payload) {
  if (!process.env.JSONBIN_BIN_ID || !process.env.JSONBIN_API_KEY) return;

  await fetch(`https://api.jsonbin.io/v3/b/${process.env.JSONBIN_BIN_ID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": process.env.JSONBIN_API_KEY,
    },
    body: JSON.stringify(payload),
  });
}

export default async function handler(req, res) {
  // Only POST allowed
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Auth: Vercel Cron sends x-vercel-cron header; manual calls need Bearer secret
  const isVercelCron = req.headers["x-vercel-cron"] === "1";
  const secret = process.env.CRON_SECRET;
  const hasSecret =
    secret && req.headers["authorization"] === `Bearer ${secret}`;

  if (!isVercelCron && !hasSecret) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Tokyo",
  });

  try {
    console.log(`[podcast] Generating episodes for ${dateStr}…`);

    const episodes = await Promise.all(
      RSS_EPISODES.map((ep) => generateEpisode(ep, dateStr))
    );

    const payload = {
      date: new Date().toISOString(),
      dateLabel: dateStr,
      generatedAt: new Date().toISOString(),
      episodes,
    };

    await savePodcast(payload);
    console.log(`[podcast] Done. ${episodes.length} episodes saved.`);

    return res.status(200).json({
      success: true,
      episodeCount: episodes.length,
      ai: !!process.env.ANTHROPIC_API_KEY,
    });
  } catch (err) {
    console.error("[podcast] Generation failed:", err);
    return res.status(500).json({ error: err.message });
  }
}
