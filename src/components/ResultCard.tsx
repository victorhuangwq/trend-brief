"use client";

import { ExaResult } from "@/lib/exa";

interface ResultCardProps {
  result: ExaResult;
  index: number;
  variant: "brand" | "article" | "discussion";
}

const variantStyles = {
  brand: {
    accent: "bg-teal-50 border-teal-200",
    badge: "bg-teal-100 text-teal-700",
    hover: "hover:border-teal-300",
  },
  article: {
    accent: "bg-indigo-50 border-indigo-200",
    badge: "bg-indigo-100 text-indigo-700",
    hover: "hover:border-indigo-300",
  },
  discussion: {
    accent: "bg-amber-50 border-amber-200",
    badge: "bg-amber-100 text-amber-700",
    hover: "hover:border-amber-300",
  },
};

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
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default function ResultCard({ result, index, variant }: ResultCardProps) {
  const styles = variantStyles[variant];
  const snippet =
    result.highlights?.[0] || result.text?.slice(0, 200) || "";
  const domain = getDomain(result.url);
  const date = formatDate(result.publishedDate);

  return (
    <a
      href={result.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block rounded-xl border ${styles.accent} ${styles.hover} p-5 transition-all hover:shadow-md animate-slide-up`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start gap-3 mb-2">
        {result.favicon && (
          <img
            src={result.favicon}
            alt=""
            className="w-5 h-5 rounded shrink-0 mt-0.5"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-slate-900 text-sm leading-tight line-clamp-2">
            {result.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-slate-500">{domain}</span>
            {date && (
              <>
                <span className="text-xs text-slate-300">·</span>
                <span className="text-xs text-slate-500">{date}</span>
              </>
            )}
          </div>
        </div>
      </div>
      {snippet && (
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mt-2">
          {snippet}
        </p>
      )}
      {result.author && (
        <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${styles.badge}`}>
          {result.author}
        </span>
      )}
    </a>
  );
}
