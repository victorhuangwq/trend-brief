"use client";

import { ParsedSummary } from "@/lib/claude";

interface AnalystBriefSlideProps {
  parsed?: ParsedSummary;
  isLoading: boolean;
  topic?: string;
}

export default function AnalystBriefSlide({ parsed, isLoading, topic }: AnalystBriefSlideProps) {
  return (
    <section className="min-h-screen w-full snap-start bg-slate-950 flex flex-col">
      {/* Section header */}
      <div className="px-8 pt-14 pb-6 md:px-16">
        <div className="max-w-4xl mx-auto">
          <span className="text-slate-600 text-xs font-mono tracking-[0.3em]">04</span>
          <h2 className="text-3xl md:text-4xl font-light text-white mt-2">Analyst Brief</h2>
          <div className="h-px bg-slate-800 mt-6" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-8 py-8 md:px-16">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="space-y-6 animate-pulse">
              <div className="h-6 bg-slate-800 rounded w-48" />
              <div className="space-y-3 mt-8">
                <div className="h-5 bg-slate-800 rounded w-full" />
                <div className="h-5 bg-slate-800 rounded w-5/6" />
                <div className="h-5 bg-slate-800 rounded w-4/5" />
                <div className="h-5 bg-slate-800 rounded w-full" />
              </div>
            </div>
          ) : parsed?.analystBrief ? (
            <div className="animate-fade-in space-y-10">
              {/* Signal strength pill */}
              {parsed.signalStrength && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 border border-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-slate-200 text-sm">{parsed.signalStrength}</span>
                </div>
              )}

              {/* Main brief */}
              <p className="text-slate-300 text-lg md:text-xl leading-loose">
                {parsed.analystBrief}
              </p>

              {/* Signal footnotes */}
              {(parsed.brandSignal || parsed.expertSignal || parsed.communitySignal) && (
                <div className="border-t border-slate-800 pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                  {parsed.brandSignal && (
                    <div>
                      <p className="text-slate-600 text-xs uppercase tracking-widest font-semibold mb-2">
                        Brand Signal
                      </p>
                      <p className="text-slate-500 text-sm leading-relaxed">
                        {parsed.brandSignal}
                      </p>
                    </div>
                  )}
                  {parsed.expertSignal && (
                    <div>
                      <p className="text-slate-600 text-xs uppercase tracking-widest font-semibold mb-2">
                        Expert Signal
                      </p>
                      <p className="text-slate-500 text-sm leading-relaxed">
                        {parsed.expertSignal}
                      </p>
                    </div>
                  )}
                  {parsed.communitySignal && (
                    <div>
                      <p className="text-slate-600 text-xs uppercase tracking-widest font-semibold mb-2">
                        Community Signal
                      </p>
                      <p className="text-slate-500 text-sm leading-relaxed">
                        {parsed.communitySignal}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-slate-600 text-center py-16">
              {topic ? "Generating analysis..." : "Enter a topic to generate a brief."}
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 pb-8 md:px-16">
        <div className="max-w-4xl mx-auto">
          <p className="text-slate-700 text-xs tracking-wider">
            Powered by <span className="text-slate-500">Exa</span> + <span className="text-slate-500">Claude Sonnet</span>
          </p>
        </div>
      </div>
    </section>
  );
}
