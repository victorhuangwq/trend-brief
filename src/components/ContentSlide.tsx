"use client";

import { ExaResult } from "@/lib/exa";
import ResultCard from "./ResultCard";
import SkeletonCard from "./SkeletonCard";

interface ContentSlideProps {
  title: string;
  subtitle: string;
  results: ExaResult[];
  isLoading: boolean;
  variant: "brand" | "article" | "discussion";
  accentColor: string;
}

export default function ContentSlide({
  title,
  subtitle,
  results,
  isLoading,
  variant,
  accentColor,
}: ContentSlideProps) {
  return (
    <section className="min-h-screen w-full flex flex-col snap-start bg-slate-50">
      {/* Section header */}
      <div className={`${accentColor} px-8 py-12 md:px-16 md:py-16`}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-2">
            {title}
          </h2>
          <p className="text-white/60 text-sm tracking-wider">{subtitle}</p>
        </div>
      </div>

      {/* Cards grid */}
      <div className="flex-1 px-8 py-8 md:px-16 md:py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))
            : results.map((result, i) => (
                <ResultCard
                  key={result.url}
                  result={result}
                  index={i}
                  variant={variant}
                />
              ))}
        </div>
        {!isLoading && results.length === 0 && (
          <p className="text-slate-400 text-center py-12">
            No results found for this section.
          </p>
        )}
      </div>
    </section>
  );
}
