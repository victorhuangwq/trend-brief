"use client";

import { useState, KeyboardEvent } from "react";

interface TitleSlideProps {
  onGenerate: (category: string) => void;
  isGenerating: boolean;
  summary?: string;
  category?: string;
}

export default function TitleSlide({
  onGenerate,
  isGenerating,
  summary,
  category,
}: TitleSlideProps) {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim() && !isGenerating) {
      onGenerate(input.trim());
    }
  };

  const displayTitle = category || input;

  return (
    <section className="h-screen w-full flex flex-col items-center justify-center relative snap-start bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(rgba(255,255,255,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.1)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative z-10 flex flex-col items-center gap-8 max-w-4xl px-8">
        {/* Small label */}
        <span className="text-sm font-medium tracking-[0.3em] uppercase text-slate-400">
          Trend Brief
        </span>

        {/* The title IS the input */}
        {!category ? (
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter a category..."
            disabled={isGenerating}
            className="text-5xl md:text-7xl font-light text-center bg-transparent border-none outline-none text-white placeholder:text-slate-600 w-full caret-white transition-all focus:placeholder:text-slate-500"
            autoFocus
          />
        ) : (
          <h1 className="text-5xl md:text-7xl font-light text-center text-white">
            {displayTitle}
          </h1>
        )}

        {/* Date line */}
        <p className="text-slate-500 text-sm tracking-wider">
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </p>

        {/* Summary appears after generation */}
        {summary && (
          <p className="text-slate-300 text-lg text-center max-w-2xl leading-relaxed animate-fade-in">
            {summary}
          </p>
        )}

        {/* Generate button */}
        {!category && (
          <button
            onClick={() => input.trim() && onGenerate(input.trim())}
            disabled={!input.trim() || isGenerating}
            className="mt-4 flex items-center gap-2 text-slate-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed group"
          >
            {isGenerating ? (
              <span className="flex items-center gap-3 text-sm tracking-wider">
                <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                Generating...
              </span>
            ) : (
              <span className="flex items-center gap-2 text-sm tracking-wider">
                Press Enter to generate
                <svg
                  className="w-4 h-4 group-hover:translate-y-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </span>
            )}
          </button>
        )}

        {/* Powered by Exa */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <span className="text-xs text-slate-600 tracking-wider">
            Powered by{" "}
            <span className="text-slate-400 font-medium">Exa</span>
          </span>
        </div>
      </div>
    </section>
  );
}
