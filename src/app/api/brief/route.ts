import { searchBrands, searchArticles, searchDiscussions } from "@/lib/exa";
import { generateSummary } from "@/lib/claude";

export async function POST(request: Request) {
  const body = await request.json();
  const { topic, vertical } = body as { topic: string; vertical?: string };

  if (!topic || typeof topic !== "string") {
    return new Response(JSON.stringify({ error: "Topic is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        console.log(`[brief] Starting searches for topic="${topic}" vertical="${vertical}"`);

        const brandsPromise = searchBrands(topic, vertical).then((data) => {
          console.log(`[brief] Brands: ${data.length} results`);
          send({ type: "brands", data });
          return data;
        });

        const articlesPromise = searchArticles(topic, vertical).then((data) => {
          console.log(`[brief] Articles: ${data.length} results`);
          send({ type: "articles", data });
          return data;
        });

        const discussionsPromise = searchDiscussions(topic, vertical).then((data) => {
          console.log(`[brief] Discussions: ${data.length} results`);
          send({ type: "discussions", data });
          return data;
        });

        const [brands, articles, discussions] = await Promise.all([
          brandsPromise,
          articlesPromise,
          discussionsPromise,
        ]);

        console.log("[brief] Starting Claude summary generation...");
        const summary = await generateSummary(topic, vertical, brands, articles, discussions);
        console.log(`[brief] Summary generated (${summary.length} chars)`);
        send({ type: "summary", data: summary });

        send({ type: "done" });
      } catch (error) {
        console.error("[brief] Error:", error);
        send({
          type: "error",
          data: error instanceof Error ? error.message : "An error occurred",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
