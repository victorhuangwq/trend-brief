"use client";

import { ExaResult } from "@/lib/exa";

interface BrandsSlideProps {
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

function FeaturedBrandCard({ result }: { result: ExaResult }) {
  const domain = getDomain(result.url);
  const excerpt = result.highlights?.[0] || result.text?.slice(0, 300) || "";

  return (
    <a
      href={result.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-2xl overflow-hidden border border-slate-200 hover:border-teal-300 hover:shadow-lg transition-all group animate-fade-in"
    >
      {/* Image banner or gradient placeholder */}
      {result.image ? (
        <div className="h-52 w-full overflow-hidden bg-teal-50">
          <img
            src={result.image}
            alt={result.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              const parent = (e.target as HTMLImageElement).parentElement;
              if (parent) parent.className = "h-52 w-full bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center";
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      ) : (
        <div className="h-52 w-full bg-gradient-to-br from-teal-50 via-teal-100 to-emerald-50 flex items-center justify-center">
          {result.favicon && (
            <img
              src={result.favicon}
              alt=""
              className="w-12 h-12 rounded-xl opacity-40"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          )}
        </div>
      )}

      <div className="p-6 bg-white">
        <div className="flex items-center gap-2 mb-3">
          {result.favicon && (
            <img
              src={result.favicon}
              alt=""
              className="w-5 h-5 rounded"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          )}
          <span className="text-xs text-teal-700 font-medium bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
            {domain}
          </span>
        </div>
        <h3 className="text-xl font-semibold text-slate-900 leading-tight mb-2">
          {result.title}
        </h3>
        {excerpt && (
          <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
            {excerpt}
          </p>
        )}
      </div>
    </a>
  );
}

function BrandGridCard({ result, index }: { result: ExaResult; index: number }) {
  const domain = getDomain(result.url);

  return (
    <a
      href={result.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center rounded-xl border border-slate-200 bg-white p-5 hover:border-teal-300 hover:shadow-md transition-all animate-slide-up h-full"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="mb-3">
        {result.favicon ? (
          <img
            src={result.favicon}
            alt=""
            className="w-10 h-10 rounded-lg"
            onError={(e) => {
              const el = e.target as HTMLImageElement;
              el.style.display = "none";
              el.nextElementSibling?.classList.remove("hidden");
            }}
          />
        ) : null}
        <div className={`w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center ${result.favicon ? "hidden" : ""}`}>
          <span className="text-teal-600 text-sm font-bold">{result.title.charAt(0)}</span>
        </div>
      </div>
      <h3 className="font-semibold text-slate-900 text-sm leading-tight line-clamp-2 text-center mb-1">
        {result.title}
      </h3>
      <span className="text-xs text-slate-400">{domain}</span>
    </a>
  );
}

function SkeletonFeatured() {
  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 animate-pulse">
      <div className="h-52 bg-slate-100" />
      <div className="p-6 bg-white space-y-3">
        <div className="h-4 bg-slate-100 rounded w-24" />
        <div className="h-6 bg-slate-200 rounded w-3/4" />
        <div className="h-4 bg-slate-100 rounded w-full" />
        <div className="h-4 bg-slate-100 rounded w-5/6" />
      </div>
    </div>
  );
}

function SkeletonGridCard() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 animate-pulse">
      <div className="w-8 h-8 rounded-lg bg-slate-100 mb-3" />
      <div className="h-4 bg-slate-200 rounded w-3/4 mb-1" />
      <div className="h-3 bg-slate-100 rounded w-1/2" />
    </div>
  );
}

export default function BrandsSlide({ results, isLoading, insight }: BrandsSlideProps) {
  const featured = results[0];
  const grid = results.slice(1);

  return (
    <section className="h-screen w-full snap-start bg-white flex flex-col">
      {/* Section header */}
      <div className="bg-teal-600 px-8 py-6 md:px-16">
        <div className="max-w-6xl mx-auto flex items-baseline gap-5">
          <span className="text-teal-300 text-xs font-mono tracking-[0.3em] shrink-0">01</span>
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-white">Brands to Watch</h2>
            <p className="text-teal-200/60 text-xs tracking-wider mt-0.5">Indie & DTC brands gaining early traction</p>
          </div>
        </div>
      </div>

      {/* Insight callout */}
      {insight && (
        <div className="px-8 py-3 md:px-16 bg-teal-50 border-b border-teal-100">
          <div className="max-w-6xl mx-auto flex items-start gap-3">
            <span className="text-teal-400 mt-0.5 shrink-0">◆</span>
            <p className="text-teal-800 text-sm leading-relaxed italic line-clamp-2">{insight}</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-h-0 px-8 py-5 md:px-16 md:py-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          {isLoading ? (
            <>
              <SkeletonFeatured />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => <SkeletonGridCard key={i} />)}
              </div>
            </>
          ) : results.length === 0 ? (
            <p className="text-slate-400 text-center py-16">No brands found for this topic.</p>
          ) : (
            <>
              {featured && <FeaturedBrandCard result={featured} />}
              {grid.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {grid.map((result, i) => (
                    <BrandGridCard key={result.url} result={result} index={i} />
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
