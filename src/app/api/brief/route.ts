import { searchBrands, searchArticles, searchDiscussions } from "@/lib/exa";
import { generateSummary } from "@/lib/claude";

export async function POST(request: Request) {
  const { category } = await request.json();

  if (!category || typeof category !== "string") {
    return new Response(JSON.stringify({ error: "Category is required" }), {
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
        // Fire all 3 Exa searches in parallel, stream each as it completes
        const brandsPromise = searchBrands(category).then((data) => {
          send({ type: "brands", data });
          return data;
        });

        const articlesPromise = searchArticles(category).then((data) => {
          send({ type: "articles", data });
          return data;
        });

        const discussionsPromise = searchDiscussions(category).then((data) => {
          send({ type: "discussions", data });
          return data;
        });

        const [brands, articles, discussions] = await Promise.all([
          brandsPromise,
          articlesPromise,
          discussionsPromise,
        ]);

        // Generate summary with Claude after all results are in
        const summary = await generateSummary(
          category,
          brands,
          articles,
          discussions
        );
        send({ type: "summary", data: summary });

        send({ type: "done" });
      } catch (error) {
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
