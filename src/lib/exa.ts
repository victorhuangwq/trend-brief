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

export async function searchBrands(category: string): Promise<ExaResult[]> {
  const response = await getExa().search(
    `emerging indie brands and startups in ${category} that are gaining traction in 2025 2026`,
    {
      type: "auto",
      numResults: 8,
      contents: {
        text: { maxCharacters: 500 },
        highlights: { maxCharacters: 300 },
      },
      category: "company",
    }
  );
  return mapResults(response.results);
}

export async function searchArticles(category: string): Promise<ExaResult[]> {
  const response = await getExa().search(
    `expert analysis and industry insights about trending ${category} topics and innovations`,
    {
      type: "auto",
      numResults: 8,
      contents: {
        text: { maxCharacters: 500 },
        highlights: { maxCharacters: 300 },
      },
    }
  );
  return mapResults(response.results);
}

export async function searchDiscussions(category: string): Promise<ExaResult[]> {
  const response = await getExa().search(
    `${category} trending products and ingredients discussion consumer opinions`,
    {
      type: "auto",
      numResults: 8,
      includeDomains: ["reddit.com", "quora.com"],
      contents: {
        text: { maxCharacters: 500 },
        highlights: { maxCharacters: 300 },
      },
    }
  );
  return mapResults(response.results);
}
