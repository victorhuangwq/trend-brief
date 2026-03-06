import Exa from "exa-js";

function getExa() {
  return new Exa(process.env.EXA_API_KEY);
}

export interface ExaResult {
  title: string;
  url: string;
  publishedDate?: string;
  author?: string;
  text?: string;
  highlights?: string[];
  image?: string;
  favicon?: string;
}

function mapResults(results: { title: string | null; url: string; publishedDate?: string; author?: string; text?: string; highlights?: string[]; image?: string; favicon?: string }[]): ExaResult[] {
  return results.map((r) => ({
    title: r.title ?? "Untitled",
    url: r.url,
    publishedDate: r.publishedDate,
    author: r.author,
    text: r.text,
    highlights: r.highlights,
    image: r.image,
    favicon: r.favicon,
  }));
}

export async function searchBrands(topic: string, vertical?: string): Promise<ExaResult[]> {
  const context = vertical ? ` in ${vertical}` : "";
  const response = await getExa().search(
    `early-stage indie brand startup ${topic}${context} pre-launch traction cult following direct-to-consumer 2025 2026`,
    {
      type: "auto",
      numResults: 10,
      category: "company",
      contents: {
        livecrawl: "preferred",
        text: { maxCharacters: 3000 },
        highlights: { maxCharacters: 500 },
      },
    }
  );
  return mapResults(response.results);
}

export async function searchArticles(topic: string, vertical?: string): Promise<ExaResult[]> {
  const context = vertical ? ` ${vertical} industry` : "";
  const response = await getExa().search(
    `emerging signal early trend ${topic}${context} what's next 2025 2026 analyst insight whitespace opportunity`,
    {
      type: "auto",
      numResults: 10,
      category: "news",
      contents: {
        livecrawl: "preferred",
        text: { maxCharacters: 4000 },
        highlights: { maxCharacters: 600 },
      },
    }
  );
  return mapResults(response.results);
}

export async function searchDiscussions(topic: string, vertical?: string): Promise<ExaResult[]> {
  const context = vertical ? ` ${vertical}` : "";
  const response = await getExa().search(
    `${topic}${context} obsessed discovering trying niche underground alternative cult 2025`,
    {
      type: "auto",
      numResults: 10,
      category: "tweet",
      contents: {
        livecrawl: "preferred",
        text: { maxCharacters: 3000 },
        highlights: { maxCharacters: 500 },
      },
    }
  );
  return mapResults(response.results);
}
