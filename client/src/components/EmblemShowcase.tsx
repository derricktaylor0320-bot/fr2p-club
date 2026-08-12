import { useState, useEffect } from "react";
import { Link } from "wouter";
import { FR2P_EMBLEMS, type Emblem } from "@/data/emblems";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronRight } from "lucide-react";

interface EmblemShowcaseProps {
  variant?: "dashboard" | "full";
  showScroll?: boolean;
}

export function EmblemShowcase({ variant = "dashboard", showScroll = true }: EmblemShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = FR2P_EMBLEMS[activeIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % FR2P_EMBLEMS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const isFull = variant === "full";

  return (
    <section
      className={`relative overflow-hidden rounded-2xl border-2 border-[#FFD700]/40 ${
        isFull ? "py-12 px-6" : "py-8 px-4 md:px-6"
      }`}
      style={{ background: "linear-gradient(135deg, #0b0c2a 0%, #001428 50%, #0b1d3a 100%)" }}
      aria-label="FR2P Emblem Collection"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#3b82f6]/10 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-6 md:mb-8">
          <p className="text-[#FFD700] text-xs font-bold tracking-[0.3em] uppercase mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            The Geometry of Success
          </p>
          <h2 className={`font-bold text-[#FFD700] ${isFull ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"}`}>
            The Five FR2P Emblems
          </h2>
          <p className="text-white/80 text-sm md:text-base mt-2 max-w-2xl mx-auto">
            Structure, balance, growth, resilience, and unity — each symbol tells the story of The FR2P Club.
          </p>
        </div>

        <div className={`grid ${showScroll ? "md:grid-cols-[1fr_auto]" : ""} gap-8 items-center`}>
          {/* Levitating sphere + featured emblem */}
          <div className="flex flex-col items-center">
            <div className="emblem-sphere-container mb-6">
              <div className="emblem-sphere-outer">
                <div className="emblem-sphere-inner">
                  <img
                    key={active.id}
                    src={active.src}
                    alt={active.alt}
                    className="emblem-sphere-image"
                  />
                </div>
              </div>
              <div className="emblem-sphere-shadow" />
            </div>

            <div className="text-center max-w-md px-4 emblem-fade-in" key={active.id}>
              <h3 className="text-2xl font-bold text-[#FFD700]">{active.name}</h3>
              <p className="text-white/60 italic text-sm mb-2">{active.meaning}</p>
              <p className="text-white/90 text-sm leading-relaxed">{active.description}</p>
            </div>
          </div>

          {/* Scroll banner — desktop beside sphere, mobile below */}
          {showScroll && (
            <div className="flex flex-col items-center lg:items-start">
              <div className="emblem-scroll-frame">
                <img
                  src="/fr2p-scroll.jpeg"
                  alt="Welcome to The FR2P Club — Founded by Derrick Taylor"
                  className="emblem-scroll-image max-w-[200px] lg:max-w-[240px]"
                />
              </div>
              <p className="text-white/50 text-xs mt-3 text-center italic max-w-[200px]">
                The FR2P Club scroll — our founding vision
              </p>
            </div>
          )}
        </div>

        {/* Horizontal emblem scroll strip */}
        <div className="mt-8">
          <div className="flex gap-4 overflow-x-auto pb-3 px-1 emblem-scroll-strip snap-x snap-mandatory">
            {FR2P_EMBLEMS.map((emblem, index) => (
              <EmblemThumb
                key={emblem.id}
                emblem={emblem}
                isActive={index === activeIndex}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>

        {!isFull && (
          <div className="text-center mt-6">
            <Link href="/collection">
              <Button
                variant="outline"
                className="border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700]/10 font-semibold"
              >
                Explore Full Emblem Collection
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function EmblemThumb({
  emblem,
  isActive,
  onClick,
}: {
  emblem: Emblem;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-shrink-0 snap-center group text-left transition-all duration-300 ${
        isActive ? "scale-105" : "opacity-70 hover:opacity-100"
      }`}
      aria-label={`View ${emblem.name} emblem — ${emblem.meaning}`}
      aria-pressed={isActive}
    >
      <div
        className={`w-[100px] h-[100px] md:w-[120px] md:h-[120px] rounded-xl overflow-hidden border-2 transition-all ${
          isActive
            ? "border-[#FFD700] shadow-lg shadow-[#FFD700]/30"
            : "border-[#FFD700]/30 group-hover:border-[#FFD700]/60"
        }`}
      >
        <img src={emblem.src} alt={emblem.alt} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <p className={`text-xs font-bold mt-2 text-center ${isActive ? "text-[#FFD700]" : "text-white/70"}`}>
        {emblem.name}
      </p>
    </button>
  );
}
