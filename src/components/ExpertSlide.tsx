"use client";

import { ExaResult } from "@/lib/exa";

interface ExpertSlideProps {
  results: ExaResult[];
  isLoading: boolean;
  insight?: string;
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  } catch {
    return "";
  }
}

function stripMarkdown(text: string, maxLen = 300): string {
  const cleaned = text
    .replace(/#{1,6}\s*/g, "")       // ## headers
    .replace(/\*\*/g, "")             // **bold**
    .replace(/\*/g, "")               // *italic*
    .replace(/^[\s]*[-–•]\s*/gm, "")  // - list items
    .replace(/\n+/g, " ")             // collapse newlines
    .replace(/\s{2,}/g, " ")          // collapse spaces
    .trim();
  if (cleaned.length <= maxLen) return cleaned;
  return cleaned.slice(0, maxLen).replace(/\s\S*$/, "") + "...";
}

function PublicationBadge({ domain }: { domain: string }) {
  return (
    <span className="inline-block text-xs font-semibold tracking-widest uppercase text-indigo-600 border border-indigo-200 rounded px-2 py-0.5 bg-indigo-50 max-w-[200px] truncate">
      {domain}
    </span>
  );
}

function FeaturedArticleCard({ result }: { result: ExaResult }) {
  const domain = getDomain(result.url);
  const date = formatDate(result.publishedDate);
  const rawQuote = result.highlights?.[0] || result.text?.slice(0, 300) || "";
  const pullQuote = stripMarkdown(rawQuote, 200);

  return (
    <a
      href={result.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-2xl overflow-hidden border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all group animate-fade-in"
    >
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        {result.image ? (
          <div className="md:w-2/5 h-56 md:h-auto overflow-hidden bg-slate-100 shrink-0">
            <img
              src={result.image}
              alt={result.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                const parent = (e.target as HTMLImageElement).closest(".md\\:w-2\\/5") as HTMLElement;
                if (parent) parent.style.display = "none";
              }}
            />
          </div>
        ) : (
          <div className="md:w-2/5 h-48 md:h-auto bg-gradient-to-br from-indigo-50 to-indigo-100 shrink-0 hidden md:block" />
        )}

        {/* Content */}
        <div className="flex-1 p-7 bg-white flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-3">
            <PublicationBadge domain={domain} />
            {date && <span className="text-xs text-slate-400">{date}</span>}
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight mb-4">
            {result.title}
          </h3>
          {pullQuote && (
            <blockquote className="border-l-2 border-indigo-200 pl-4 italic text-slate-600 text-sm leading-relaxed">
              &ldquo;{pullQuote}&rdquo;
            </blockquote>
          )}
          {result.author && (
            <p className="mt-3 text-xs text-slate-400">— {result.author}</p>
          )}
        </div>
      </div>
    </a>
  );
}

function ArticleGridCard({ result, index }: { result: ExaResult; index: number }) {
  const domain = getDomain(result.url);
  const date = formatDate(result.publishedDate);
  const rawExcerpt = result.highlights?.[0] || result.text?.slice(0, 200) || "";
  const excerpt = stripMarkdown(rawExcerpt, 150);

  return (
    <a
      href={result.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-xl border border-slate-200 bg-white p-5 hover:border-indigo-300 hover:shadow-md transition-all animate-slide-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-center justify-between mb-2">
        <PublicationBadge domain={domain} />
        {date && <span className="text-xs text-slate-400">{date}</span>}
      </div>
      <h3 className="font-semibold text-slate-900 text-sm leading-tight line-clamp-2 mt-3 mb-2">
        {result.title}
      </h3>
      {excerpt && (
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
          {excerpt}
        </p>
      )}
      {result.author && (
        <p className="text-xs text-slate-400 mt-3">— {result.author}</p>
      )}
    </a>
  );
}

function SkeletonFeatured() {
  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 animate-pulse flex flex-col md:flex-row">
      <div className="md:w-2/5 h-56 bg-slate-100" />
      <div className="flex-1 p-7 bg-white space-y-4">
        <div className="h-5 bg-slate-100 rounded w-32" />
        <div className="h-8 bg-slate-200 rounded w-4/5" />
        <div className="h-4 bg-slate-100 rounded w-full" />
        <div className="h-4 bg-slate-100 rounded w-5/6" />
      </div>
    </div>
  );
}

function SkeletonArticleCard() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 animate-pulse space-y-3">
      <div className="flex justify-between">
        <div className="h-5 bg-slate-100 rounded w-28" />
        <div className="h-4 bg-slate-100 rounded w-16" />
      </div>
      <div className="h-4 bg-slate-200 rounded w-full" />
      <div className="h-4 bg-slate-200 rounded w-4/5" />
      <div className="h-3 bg-slate-100 rounded w-full" />
      <div className="h-3 bg-slate-100 rounded w-3/4" />
    </div>
  );
}

export default function ExpertSlide({ results, isLoading, insight }: ExpertSlideProps) {
  const featured = results[0];
  const grid = results.slice(1);

  return (
    <section className="h-screen w-full snap-start bg-white flex flex-col">
      {/* Section header */}
      <div className="bg-indigo-600 px-8 py-6 md:px-16">
        <div className="max-w-6xl mx-auto flex items-baseline gap-5">
          <span className="text-indigo-300 text-xs font-mono tracking-[0.3em] shrink-0">02</span>
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-white">Expert Voices</h2>
            <p className="text-indigo-200/60 text-xs tracking-wider mt-0.5">Industry analysis & journalism</p>
          </div>
        </div>
      </div>

      {/* Insight callout */}
      {insight && (
        <div className="px-8 py-3 md:px-16 bg-indigo-50 border-b border-indigo-100">
          <div className="max-w-6xl mx-auto flex items-start gap-3">
            <span className="text-indigo-400 mt-0.5 shrink-0">◆</span>
            <p className="text-indigo-800 text-sm leading-relaxed italic line-clamp-2">{insight}</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-h-0 px-8 py-5 md:px-16 md:py-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          {isLoading ? (
            <>
              <SkeletonFeatured />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 3 }).map((_, i) => <SkeletonArticleCard key={i} />)}
              </div>
            </>
          ) : results.length === 0 ? (
            <p className="text-slate-400 text-center py-16">No articles found for this topic.</p>
          ) : (
            <>
              {featured && <FeaturedArticleCard result={featured} />}
              {grid.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {grid.map((result, i) => (
                    <ArticleGridCard key={result.url} result={result} index={i} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
