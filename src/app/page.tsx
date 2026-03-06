"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import TitleSlide from "@/components/TitleSlide";
import BrandsSlide from "@/components/BrandsSlide";
import ExpertSlide from "@/components/ExpertSlide";
import CommunitySlide from "@/components/CommunitySlide";
import AnalystBriefSlide from "@/components/AnalystBriefSlide";
import NavigationDots from "@/components/NavigationDots";
import { ExaResult } from "@/lib/exa";
import { ParsedSummary, parseSummary } from "@/lib/claude";

interface BriefState {
  brands: ExaResult[];
  articles: ExaResult[];
  discussions: ExaResult[];
  parsedSummary: ParsedSummary | null;
  brandsLoaded: boolean;
  articlesLoaded: boolean;
  discussionsLoaded: boolean;
  summaryLoaded: boolean;
}

const SECTIONS = [
  "Cover",
  "Brands to Watch",
  "Expert Voices",
  "Community Pulse",
  "Analyst Brief",
];

const INITIAL_STATE: BriefState = {
  brands: [],
  articles: [],
  discussions: [],
  parsedSummary: null,
  brandsLoaded: false,
  articlesLoaded: false,
  discussionsLoaded: false,
  summaryLoaded: false,
};

export default function Home() {
  const [topic, setTopic] = useState<string | null>(null);
  const [vertical, setVertical] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [brief, setBrief] = useState<BriefState>(INITIAL_STATE);

  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  const handleGenerate = useCallback(async (t: string, v: string) => {
    setTopic(t);
    setVertical(v || null);
    setIsGenerating(true);
    setBrief(INITIAL_STATE);

    containerRef.current?.scrollTo({ top: 0 });

    try {
      const response = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: t, vertical: v || undefined }),
      });

      if (!response.ok) throw new Error("Failed to generate brief");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const event = JSON.parse(line.slice(6));

            if (event.type === "brands") {
              setBrief((prev) => ({ ...prev, brands: event.data, brandsLoaded: true }));
            } else if (event.type === "articles") {
              setBrief((prev) => ({ ...prev, articles: event.data, articlesLoaded: true }));
            } else if (event.type === "discussions") {
              setBrief((prev) => ({ ...prev, discussions: event.data, discussionsLoaded: true }));
            } else if (event.type === "summary") {
              const parsed = parseSummary(event.data as string);
              setBrief((prev) => ({ ...prev, parsedSummary: parsed, summaryLoaded: true }));
            } else if (event.type === "error") {
              console.error("Brief API error:", event.data);
            }
          } catch {
            // skip malformed events
          }
        }
      }
    } catch (error) {
      console.error("Brief generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.indexOf(entry.target as HTMLElement);
            if (index !== -1) setActiveSection(index);
          }
        }
      },
      { root: container, threshold: 0.5 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [topic]);

  const navigateToSection = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
  };

  const showSlides = topic !== null;

  const setRef = (index: number) => (el: HTMLElement | null) => {
    sectionRefs.current[index] = el;
  };

  return (
    <div ref={containerRef} className="snap-container">
      <div ref={setRef(0)}>
        <TitleSlide
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          signalStrength={brief.parsedSummary?.signalStrength}
          topic={topic ?? undefined}
          vertical={vertical ?? undefined}
        />
      </div>

      {showSlides && (
        <>
          <div ref={setRef(1)}>
            <BrandsSlide
              results={brief.brands}
              isLoading={!brief.brandsLoaded}
              insight={brief.parsedSummary?.brandSignal}
            />
          </div>

          <div ref={setRef(2)}>
            <ExpertSlide
              results={brief.articles}
              isLoading={!brief.articlesLoaded}
              insight={brief.parsedSummary?.expertSignal}
            />
          </div>

          <div ref={setRef(3)}>
            <CommunitySlide
              results={brief.discussions}
              isLoading={!brief.discussionsLoaded}
              insight={brief.parsedSummary?.communitySignal}
            />
          </div>

          <div ref={setRef(4)}>
            <AnalystBriefSlide
              parsed={brief.parsedSummary ?? undefined}
              isLoading={!brief.summaryLoaded}
              topic={topic}
            />
          </div>
        </>
      )}

      <NavigationDots
        sections={SECTIONS}
        activeIndex={activeSection}
        onNavigate={navigateToSection}
        visible={showSlides}
      />
    </div>
  );
}
