"use client";

import { ExaResult } from "@/lib/exa";

interface CommunitySlideProps {
  results: ExaResult[];
  isLoading: boolean;
  insight?: string;
}

function normalizeUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
}

function getDomain(url: string): string {
  try {
    return new URL(normalizeUrl(url)).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

function getHandle(url: string): string | null {
  try {
    const u = new URL(normalizeUrl(url));
    if (u.hostname === "x.com" || u.hostname === "twitter.com") {
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts.length > 0) return parts[0];
    }
  } catch {}
  return null;
}

function TweetCard({ result, index }: { result: ExaResult; index: number }) {
  const domain = getDomain(result.url);
  const text = result.title;
  const handle = result.author || getHandle(result.url);

  return (
    <a
      href={normalizeUrl(result.url)}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-2xl border border-amber-100 bg-white p-5 hover:border-amber-300 hover:shadow-md transition-all animate-slide-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Open quote mark */}
      <div className="text-4xl leading-none text-amber-200 font-serif mb-1 select-none">&ldquo;</div>

      {/* Tweet text */}
      <p className="text-sm text-slate-700 leading-relaxed line-clamp-4">
        {text}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
        {handle ? (
          <span className="text-xs text-slate-400 font-medium">@{handle.replace("@", "")}</span>
        ) : (
          <span />
        )}
        <span className="text-xs text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 shrink-0">
          {domain}
        </span>
      </div>
    </a>
  );
}

function SkeletonTweetCard() {
  return (
    <div className="rounded-2xl border border-amber-100 bg-white p-5 animate-pulse">
      <div className="text-4xl leading-none text-amber-100 font-serif mb-1">&ldquo;</div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-5/6" />
        <div className="h-3 bg-slate-100 rounded w-4/5" />
        <div className="h-3 bg-slate-100 rounded w-3/4" />
      </div>
      <div className="flex justify-between mt-4 pt-3 border-t border-slate-100">
        <div className="h-3 bg-slate-100 rounded w-16" />
        <div className="h-5 bg-amber-50 rounded-full w-20" />
      </div>
    </div>
  );
}

export default function CommunitySlide({ results, isLoading, insight }: CommunitySlideProps) {
  return (
    <section className="min-h-screen w-full snap-start bg-amber-50/40 flex flex-col">
      {/* Section header */}
      <div className="bg-amber-500 px-8 py-8 md:px-16">
        <div className="max-w-6xl mx-auto flex items-baseline gap-5">
          <span className="text-amber-200 text-xs font-mono tracking-[0.3em] shrink-0">03</span>
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-white">Community Pulse</h2>
            <p className="text-amber-100/60 text-xs tracking-wider mt-0.5">Real voices from the web</p>
          </div>
        </div>
      </div>

      {/* Insight callout */}
      {insight && (
        <div className="px-8 py-4 md:px-16 bg-amber-50 border-b border-amber-100">
          <div className="max-w-6xl mx-auto flex items-start gap-3">
            <span className="text-amber-500 mt-0.5 shrink-0">◆</span>
            <p className="text-amber-900 text-sm leading-relaxed italic">{insight}</p>
          </div>
        </div>
      )}

      {/* Content — uniform grid, no featured card */}
      <div className="flex-1 px-8 py-8 md:px-16 md:py-10">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonTweetCard key={i} />)}
            </div>
          ) : results.length === 0 ? (
            <p className="text-slate-400 text-center py-16">No community signals found for this topic.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((result, i) => (
                <TweetCard key={result.url} result={result} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
