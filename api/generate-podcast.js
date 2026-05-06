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
 *   JSONBIN_BIN_ID   – JSONbin.io bin ID
 *   JSONBIN_API_KEY  – JSONbin.io master key
 *
 * Optional:
 *   ANTHROPIC_API_KEY – enables Claude-generated scripts (much better quality)
 */

const RSS_EPISODES = [
  {
    id: "bbc",
    topic: "BBC World News",
    feeds: [
      "https://feeds.bbci.co.uk/news/world/rss.xml",
      "https://feeds.bbci.co.uk/news/rss.xml",
    ],
  },
  {
    id: "guardian",
    topic: "The Guardian",
    feeds: [
      "https://www.theguardian.com/world/rss",
      "https://www.theguardian.com/us-news/rss",
    ],
  },
  {
    id: "japantimes",
    topic: "Japan Times",
    feeds: [
      "https://www.japantimes.co.jp/feed/",
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

function extractCDATA(str = "") {
  const m = str.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
  return m ? m[1].trim() : str.trim();
}

function parseRSS(xml) {
  const items = [];
  const itemRegex = /<item[\s>]([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];

    const rawTitle = block.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1] ?? "";
    const rawDesc =
      block.match(/<description[^>]*>([\s\S]*?)<\/description>/)?.[1] ??
      block.match(/<content:encoded[^>]*>([\s\S]*?)<\/content:encoded>/)?.[1] ??
      "";
    const rawLink =
      block.match(/<link>([\s\S]*?)<\/link>/)?.[1] ??
      block.match(/<link[^>]+href="([^"]+)"/)?.[1] ??
      "";
    const pubDate = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim() ?? "";

    const title = stripHtml(extractCDATA(rawTitle));
    const description = stripHtml(extractCDATA(rawDesc)).slice(0, 300);
    const link = extractCDATA(rawLink).trim();

    if (title) items.push({ title, description, link, pubDate });
  }
  return items;
}

async function fetchFeed(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "ShadowPro-PodcastBot/1.0",
        Accept: "application/rss+xml, application/xml, text/xml",
      },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) {
      console.warn(`[rss] ${url} → HTTP ${res.status}`);
      return [];
    }
    const xml = await res.text();
    const items = parseRSS(xml);
    console.log(`[rss] ${url} → ${items.length} items`);
    return items;
  } catch (err) {
    clearTimeout(timer);
    console.warn(`[rss] ${url} → ${err.message}`);
    return [];
  }
}

async function fetchEpisodeStories(feeds) {
  const allItems = [];
  for (const url of feeds) {
    const items = await fetchFeed(url);
    allItems.push(...items);
  }
  const seen = new Set();
  return allItems
    .filter((item) => {
      if (seen.has(item.title)) return false;
      seen.add(item.title);
      return true;
    })
    .slice(0, 8);
}

const TRANSITIONS = [
  "Analysts say this situation is likely to develop further in the coming days.",
  "Officials are closely monitoring the situation and have not yet issued a formal statement.",
  "This comes amid broader concerns that experts say could have lasting implications.",
  "Observers note that this marks a significant shift in the ongoing discussions.",
  "The international community is watching closely as events continue to unfold.",
  "This development follows weeks of mounting pressure from multiple sides.",
  "Experts warn that the full impact may not be felt for some time.",
  "Local authorities have urged calm while investigations remain ongoing.",
];

function buildTemplateScript(topic, stories, dateStr) {
  const lines = [];
  lines.push(`Good morning and welcome to your ${topic} briefing for ${dateStr}.`);
  lines.push(`I'm your AI host, bringing you the stories that matter most today. We have four reports for you this morning, so let's get straight into it.`);
  lines.push("");

  stories.slice(0, 4).forEach((story, i) => {
    const desc = story.description.replace(/\n/g, " ").slice(0, 400);
    const words = desc.split(/\s+/).length;
    lines.push(`Our ${["first", "second", "third", "fourth"][i]} story: ${story.title}.`);
    if (desc) lines.push(desc);
    // pad short descriptions to keep total close to 450 words
    if (words < 35) {
      lines.push(TRANSITIONS[i % TRANSITIONS.length]);
      lines.push(TRANSITIONS[(i + 4) % TRANSITIONS.length]);
    } else if (words < 60) {
      lines.push(TRANSITIONS[i % TRANSITIONS.length]);
    }
    lines.push("");
  });

  lines.push(
    `That brings us to the end of today's ${topic} briefing for ${dateStr}. ` +
    `Thank you for tuning in with us this morning. ` +
    `Whether you are commuting, exercising, or enjoying a quiet start to your day, ` +
    `we hope today's stories have given you a clearer picture of what is happening around the world. ` +
    `Stay curious, keep practicing your English, and we will be back tomorrow morning with your next update. ` +
    `Have a great day.`
  );

  return lines.join("\n");
}

async function buildClaudeScript(topic, stories, dateStr) {
  const storySummaries = stories
    .slice(0, 5)
    .map((s, i) => `${i + 1}. ${s.title}\n   ${s.description.slice(0, 300)}`)
    .join("\n\n");

  const prompt = `You are a professional radio broadcaster. Write a full 3-minute English news podcast script for "${topic}" dated ${dateStr}.

Requirements:
- Natural spoken English only — NO music cues, NO [brackets], NO stage directions, NO asterisks
- Target: EXACTLY 450–480 words. Count carefully. This is strict.
- Tone: warm, clear, professional; suitable for English learners at B2 level
- Structure: greeting intro (30 words) → 4 news stories (~100 words each) → sign-off (30 words)
- Each story: introduce the headline, explain the background, add one sentence of context or implication
- Do NOT add section headings or numbers — just continuous natural speech
- Do NOT truncate. Write all 4 stories in full.

Today's stories:
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
      max_tokens: 1200,
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
      description: s.description.slice(0, 200),
      link: s.link,
      pubDate: s.pubDate,
    })),
    wordCount,
    durationMin: Math.round(wordCount / 150),
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
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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
    console.log(
      episodes.map((e) => `  ${e.id}: ${e.wordCount} words, ${e.stories.length} stories`)
    );

    return res.status(200).json({
      success: true,
      episodeCount: episodes.length,
      ai: !!process.env.ANTHROPIC_API_KEY,
      episodes: episodes.map((e) => ({
        id: e.id,
        topic: e.topic,
        wordCount: e.wordCount,
        storiesFound: e.stories.length,
      })),
    });
  } catch (err) {
    console.error("[podcast] Generation failed:", err);
    return res.status(500).json({ error: err.message });
  }
}
