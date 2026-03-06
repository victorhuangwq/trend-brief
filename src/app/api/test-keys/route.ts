import Anthropic from "@anthropic-ai/sdk";
import Exa from "exa-js";

export async function GET() {
  const results: { exa: { ok: boolean; error?: string }; anthropic: { ok: boolean; error?: string } } = {
    exa: { ok: false },
    anthropic: { ok: false },
  };

  // Test Exa
  try {
    const exa = new Exa(process.env.EXA_API_KEY);
    await exa.search("test", { numResults: 1 });
    results.exa.ok = true;
  } catch (e) {
    results.exa.error = e instanceof Error ? e.message : "Unknown error";
  }

  // Test Anthropic
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 10,
      messages: [{ role: "user", content: "Say hi" }],
    });
    results.anthropic.ok = true;
  } catch (e) {
    results.anthropic.error = e instanceof Error ? e.message : "Unknown error";
  }

  return Response.json(results);
}
