import Anthropic from "@anthropic-ai/sdk";
import { ExaResult } from "./exa";

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

export async function generateSummary(
  category: string,
  brands: ExaResult[],
  articles: ExaResult[],
  discussions: ExaResult[]
): Promise<string> {
  const message = await getClient().messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 300,
    messages: [
      {
        role: "user",
        content: `You are writing a 2-3 sentence executive summary for a trend brief about "${category}". Based on these search results, write a concise summary of what's trending and why it matters for consumer brands.

Brands found: ${brands.map((b) => b.title).join(", ")}
Articles: ${articles.map((a) => a.title).join(", ")}
Community topics: ${discussions.map((d) => d.title).join(", ")}

Write ONLY the summary, no preamble. Keep it sharp and insightful.`,
      },
    ],
  });

  const block = message.content[0];
  return block.type === "text" ? block.text : "";
}
