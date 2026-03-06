"use client";

interface NavigationDotsProps {
  sections: string[];
  activeIndex: number;
  onNavigate: (index: number) => void;
  visible: boolean;
}

export default function NavigationDots({
  sections,
  activeIndex,
  onNavigate,
  visible,
}: NavigationDotsProps) {
  if (!visible) return null;

  return (
    <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
      {sections.map((label, i) => (
        <button
          key={label}
          onClick={() => onNavigate(i)}
          className="group relative flex items-center justify-end"
          aria-label={`Go to ${label}`}
        >
          {/* Tooltip */}
          <span className="absolute right-6 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {label}
          </span>
          {/* Dot */}
          <span
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === activeIndex
                ? "bg-white scale-125 shadow-lg shadow-white/30"
                : "bg-white/30 hover:bg-white/60"
            }`}
          />
        </button>
      ))}
    </nav>
  );
}
