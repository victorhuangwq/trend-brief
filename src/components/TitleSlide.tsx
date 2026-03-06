"use client";

import { useState, KeyboardEvent, useRef } from "react";

interface TitleSlideProps {
  onGenerate: (topic: string, vertical: string) => void;
  isGenerating: boolean;
  signalStrength?: string;
  topic?: string;
  vertical?: string;
}

export default function TitleSlide({
  onGenerate,
  isGenerating,
  signalStrength,
  topic,
  vertical,
}: TitleSlideProps) {
  const [topicInput, setTopicInput] = useState("");
  const [verticalInput, setVerticalInput] = useState("");
  const verticalRef = useRef<HTMLInputElement>(null);

  const canGenerate = topicInput.trim().length > 0 && !isGenerating;

  const handleTopicKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && topicInput.trim()) {
      verticalRef.current?.focus();
    }
  };

  const handleVerticalKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && canGenerate) {
      onGenerate(topicInput.trim(), verticalInput.trim());
    }
  };

  const handleSubmit = () => {
    if (canGenerate) {
      onGenerate(topicInput.trim(), verticalInput.trim());
    }
  };

  const isGenerated = topic !== undefined;

  return (
    <section className="h-screen w-full flex flex-col items-center justify-center relative snap-start bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 overflow-hidden">
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(rgba(255,255,255,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.15)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_60%,rgba(99,102,241,0.08),transparent)]" />

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-3xl w-full px-8">
        {/* Label */}
        <span className="text-xs font-semibold tracking-[0.35em] uppercase text-slate-500">
          Trend Brief
        </span>

        {isGenerated ? (
          /* Post-generation: title + badge + signal */
          <div className="flex flex-col items-center gap-4 text-center animate-fade-in">
            {vertical && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium tracking-wide">
                {vertical}
              </span>
            )}
            <h1 className="text-5xl md:text-7xl font-light text-white leading-tight">
              {topic}
            </h1>
            <p className="text-slate-500 text-sm tracking-wider">
              {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>
            {signalStrength && (
              <div className="mt-2 flex items-start gap-3 max-w-xl">
                <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
                <p className="text-slate-300 text-base leading-relaxed text-left">
                  {signalStrength}
                </p>
              </div>
            )}
            {isGenerating && !signalStrength && (
              <div className="flex items-center gap-3 text-slate-500 text-sm mt-2">
                <span className="w-4 h-4 border-2 border-slate-600 border-t-slate-300 rounded-full animate-spin" />
                Generating your brief...
              </div>
            )}
          </div>
        ) : (
          /* Pre-generation: two-field input */
          <div className="flex flex-col items-center gap-4 w-full">
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              onKeyDown={handleTopicKeyDown}
              placeholder="Enter a trend topic..."
              disabled={isGenerating}
              className="text-4xl md:text-6xl font-light text-center bg-transparent border-none outline-none text-white placeholder:text-slate-700 w-full caret-white transition-all"
              autoFocus
            />
            <input
              ref={verticalRef}
              type="text"
              value={verticalInput}
              onChange={(e) => setVerticalInput(e.target.value)}
              onKeyDown={handleVerticalKeyDown}
              placeholder="Industry vertical (e.g. Beauty)"
              disabled={isGenerating}
              className="text-lg text-center bg-transparent border-none outline-none text-slate-400 placeholder:text-slate-700 w-full max-w-sm caret-white transition-all focus:text-slate-200"
            />

            <button
              onClick={handleSubmit}
              disabled={!canGenerate}
              className="mt-4 flex items-center gap-2 text-slate-500 hover:text-white transition-colors disabled:opacity-20 disabled:cursor-not-allowed group"
            >
              {isGenerating ? (
                <span className="flex items-center gap-3 text-sm tracking-wider">
                  <span className="w-4 h-4 border-2 border-slate-500 border-t-slate-200 rounded-full animate-spin" />
                  Generating...
                </span>
              ) : (
                <span className="flex items-center gap-2 text-sm tracking-wider">
                  Press Enter to generate
                  <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </span>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Scroll prompt */}
      {isGenerated && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in">
          <span className="text-xs text-slate-600 tracking-wider flex items-center gap-2">
            Scroll to explore
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </span>
        </div>
      )}

      {/* Powered by */}
      {!isGenerated && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <span className="text-xs text-slate-700 tracking-wider">
            Powered by <span className="text-slate-500 font-medium">Exa</span> + <span className="text-slate-500 font-medium">Claude</span>
          </span>
        </div>
      )}
    </section>
  );
}
