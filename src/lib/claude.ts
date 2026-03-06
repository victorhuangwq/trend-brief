import Anthropic from "@anthropic-ai/sdk";
import { ExaResult } from "./exa";

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

export interface ParsedSummary {
  signalStrength: string;
  brandSignal: string;
  expertSignal: string;
  communitySignal: string;
  analystBrief: string;
  raw: string;
}

export function parseSummary(summary: string): ParsedSummary {
  const extract = (label: string): string => {
    const regex = new RegExp(`\\*\\*${label}:\\*\\*\\s*([\\s\\S]*?)(?=\\n\\n\\*\\*[A-Z]|$)`, "i");
    const match = summary.match(regex);
    return match ? match[1].trim() : "";
  };

  return {
    signalStrength: extract("SIGNAL STRENGTH"),
    brandSignal: extract("BRAND SIGNAL"),
    expertSignal: extract("EXPERT SIGNAL"),
    communitySignal: extract("COMMUNITY SIGNAL"),
    analystBrief: extract("ANALYST BRIEF"),
    raw: summary,
  };
}

function buildContentDigest(
  topic: string,
  vertical: string | undefined,
  brands: ExaResult[],
  articles: ExaResult[],
  discussions: ExaResult[]
): string {
  const formatItem = (r: ExaResult, label: string): string => {
    let domain = r.url;
    try { domain = new URL(r.url).hostname.replace("www.", ""); } catch {}
    const date = r.publishedDate
      ? new Date(r.publishedDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
      : "";
    const excerpt = r.highlights?.join(" ... ") || r.text?.slice(0, 800) || "";
    return `[${label}] ${r.title} (${domain}${date ? `, ${date}` : ""})\n${excerpt}`;
  };

  const brandLines = brands.map((b) => formatItem(b, "BRAND")).join("\n\n");
  const articleLines = articles.map((a) => formatItem(a, "ARTICLE")).join("\n\n");
  const discussionLines = discussions.map((d) => formatItem(d, "SIGNAL")).join("\n\n");
  const verticalContext = vertical ? ` (${vertical} vertical)` : "";

  return `Topic: ${topic}${verticalContext}\n\n## Emerging Brands\n${brandLines}\n\n## Expert Analysis\n${articleLines}\n\n## Community Signals\n${discussionLines}`;
}

export async function generateSummary(
  topic: string,
  vertical: string | undefined,
  brands: ExaResult[],
  articles: ExaResult[],
  discussions: ExaResult[]
): Promise<string> {
  const digest = buildContentDigest(topic, vertical, brands, articles, discussions);

  const message = await getClient().messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 500,
    system:
      "You are a pre-trend analyst. You write ultra-concise briefs for experienced strategists. Every sentence must earn its place. No filler, no hedging, no generic marketing language. Ground every claim in the research provided.",
    messages: [
      {
        role: "user",
        content: `Analyze this live research about the consumer trend: "${topic}"${vertical ? ` in the ${vertical} category` : ""}.

${digest}

Write a structured pre-trend brief in EXACTLY this format (use the exact bold labels). Be extremely concise — this will be displayed on presentation slides.

**SIGNAL STRENGTH:** [one short phrase: weak early signal / building signal / confirmed emerging trend]

**BRAND SIGNAL:**
[1 sentence: what the brand landscape reveals]

**EXPERT SIGNAL:**
[1 sentence: what expert/industry coverage reveals]

**COMMUNITY SIGNAL:**
[1 sentence: what community/social signals reveal]

**ANALYST BRIEF:**
[2-3 punchy sentences max: what this means for brands, who should act now, the pre-mainstream opportunity]

Keep it tight. No more than 2-3 sentences per section. This is a slide deck, not a report.`,
      },
    ],
  });

  const block = message.content[0];
  return block.type === "text" ? block.text : "";
}
