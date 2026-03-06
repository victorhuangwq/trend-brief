"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import TitleSlide from "@/components/TitleSlide";
import ContentSlide from "@/components/ContentSlide";
import NavigationDots from "@/components/NavigationDots";
import { ExaResult } from "@/lib/exa";

interface BriefState {
  brands: ExaResult[];
  articles: ExaResult[];
  discussions: ExaResult[];
  summary: string;
  brandsLoaded: boolean;
  articlesLoaded: boolean;
  discussionsLoaded: boolean;
}

const SECTIONS = [
  "Title",
  "Emerging Brands",
  "Expert Analysis",
  "Community Sentiment",
];

export default function Home() {
  const [category, setCategory] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [brief, setBrief] = useState<BriefState>({
    brands: [],
    articles: [],
    discussions: [],
    summary: "",
    brandsLoaded: false,
    articlesLoaded: false,
    discussionsLoaded: false,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  const handleGenerate = useCallback(async (cat: string) => {
    setCategory(cat);
    setIsGenerating(true);
    setBrief({
      brands: [],
      articles: [],
      discussions: [],
      summary: "",
      brandsLoaded: false,
      articlesLoaded: false,
      discussionsLoaded: false,
    });

    try {
      const response = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: cat }),
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
              setBrief((prev) => ({
                ...prev,
                brands: event.data,
                brandsLoaded: true,
              }));
            } else if (event.type === "articles") {
              setBrief((prev) => ({
                ...prev,
                articles: event.data,
                articlesLoaded: true,
              }));
            } else if (event.type === "discussions") {
              setBrief((prev) => ({
                ...prev,
                discussions: event.data,
                discussionsLoaded: true,
              }));
            } else if (event.type === "summary") {
              setBrief((prev) => ({
                ...prev,
                summary: event.data,
              }));
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }
    } catch (error) {
      console.error("Brief generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Scroll observation for active section tracking
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.indexOf(
              entry.target as HTMLElement
            );
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
  }, [category]);

  const navigateToSection = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
  };

  const showSlides = category !== null;

  return (
    <div ref={containerRef} className="snap-container">
      <div
        ref={(el) => {
          sectionRefs.current[0] = el;
        }}
      >
        <TitleSlide
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          summary={brief.summary}
          category={category ?? undefined}
        />
      </div>

      {showSlides && (
        <>
          <div
            ref={(el) => {
              sectionRefs.current[1] = el;
            }}
          >
            <ContentSlide
              title="Emerging Brands"
              subtitle="Indie and DTC brands building around this trend"
              results={brief.brands}
              isLoading={!brief.brandsLoaded}
              variant="brand"
              accentColor="bg-gradient-to-r from-teal-700 to-teal-600"
            />
          </div>

          <div
            ref={(el) => {
              sectionRefs.current[2] = el;
            }}
          >
            <ContentSlide
              title="Expert Analysis"
              subtitle="Industry insights and thought leadership"
              results={brief.articles}
              isLoading={!brief.articlesLoaded}
              variant="article"
              accentColor="bg-gradient-to-r from-indigo-700 to-indigo-600"
            />
          </div>

          <div
            ref={(el) => {
              sectionRefs.current[3] = el;
            }}
          >
            <ContentSlide
              title="Community Sentiment"
              subtitle="What real consumers are saying"
              results={brief.discussions}
              isLoading={!brief.discussionsLoaded}
              variant="discussion"
              accentColor="bg-gradient-to-r from-amber-700 to-amber-600"
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
