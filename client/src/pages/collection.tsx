import { Link } from "wouter";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gem, Sparkles, ShoppingBag } from "lucide-react";

const emblems = [
  {
    src: "/attachments/CBz3uXtNb8qBFmgDAs9AF.jpeg",
    alt: "FR2P Triangle Emblem",
    name: "Triangle",
    meaning: "Structure",
    description: "The foundation of every empire — clear lines, sharp focus, unshakeable direction.",
  },
  {
    src: "/attachments/MBpwk3MCU2TJRnwxmTgYg.jpeg",
    alt: "FR2P Pentagonal Emblem",
    name: "Pentagon",
    meaning: "Balance",
    description: "Five points of harmony — wealth, power, prestige, growth, and unity in perfect proportion.",
  },
  {
    src: "/attachments/1dKfesnc2wxchnPxZCmYk.jpeg",
    alt: "FR2P Spiral Emblem",
    name: "Spiral",
    meaning: "Growth",
    description: "The upward path of prosperity — each turn building on the last, compounding success.",
  },
  {
    src: "/attachments/cN7RtfrYN7sfpxazMyrMJ.jpeg",
    alt: "FR2P Gomboc Emblem",
    name: "Gomboc",
    meaning: "Resilience",
    description: "Self-righting strength — no matter the setback, true leaders always rise again.",
  },
  {
    src: "/attachments/PAecUhfTf5adgq8hTMGVk.jpeg",
    alt: "FR2P Cube Emblem",
    name: "Cube",
    meaning: "Unity",
    description: "The sphere of togetherness — every member connected through the blue diamond of prosperity.",
  },
];

export default function Collection() {
  return (
    <div className="min-h-screen bg-secondary">
      <SidebarNav />

      <div className="md:ml-64">
        <section
          id="fr2p-collection"
          className="text-center px-5 py-16 md:py-20"
          style={{ backgroundColor: "#0b0c2a", color: "#f5f5f5" }}
        >
          <div className="max-w-5xl mx-auto">
            <Badge
              className="mb-4 text-sm font-bold px-4 py-1"
              style={{ backgroundColor: "#d4af37", color: "#0b0c2a" }}
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 inline" />
              The Geometry of Success
            </Badge>

            <h1
              className="text-4xl md:text-5xl font-bold mb-5"
              style={{ color: "#d4af37" }}
            >
              The FR2P Club
            </h1>

            <p className="max-w-3xl mx-auto text-lg md:text-xl leading-relaxed mb-12 text-white/90">
              The FR2P Club is where ambition meets affluence. Each emblem represents a different
              facet of success — from the spiral of growth to the sphere of unity — all centered
              around the blue diamond of prosperity. More than a brand, it's a movement that stands
              for{" "}
              <strong className="text-[#d4af37]">money, power, wealth, and prestige</strong>.
              Every design tells the story of those who rise, earn, and lead.
            </p>

            <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-12">
              {emblems.map((emblem) => (
                <div key={emblem.name} className="group w-[220px]">
                  <div
                    className="overflow-hidden rounded-[10px] border-2 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-[#d4af37]/20"
                    style={{ borderColor: "#d4af37" }}
                  >
                    <img
                      src={emblem.src}
                      alt={emblem.alt}
                      className="w-full aspect-square object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-3 text-left">
                    <p className="font-bold text-[#d4af37]">{emblem.name}</p>
                    <p className="text-sm text-white/60 italic">{emblem.meaning}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-base md:text-lg text-[#c0c0c0] max-w-3xl mx-auto mb-10">
              Each symbol — triangle, pentagon, spiral, Gomboc, and cube — embodies The FR2P
              Club's evolution:{" "}
              <em className="text-[#d4af37]">
                structure, balance, growth, resilience, and unity
              </em>
              . Together, they form the geometry of success.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left mb-12">
              {emblems.map((emblem) => (
                <div
                  key={`detail-${emblem.name}`}
                  className="rounded-xl border border-[#d4af37]/30 bg-white/5 p-5"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Gem className="w-4 h-4 text-[#d4af37]" />
                    <span className="font-semibold text-[#d4af37]">{emblem.name}</span>
                    <span className="text-white/40 text-sm">— {emblem.meaning}</span>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed">{emblem.description}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/store">
                <Button
                  className="font-bold px-8 py-6 text-base"
                  style={{ backgroundColor: "#d4af37", color: "#0b0c2a" }}
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Shop FR2P Merchandise
                </Button>
              </Link>
              <Link href="/join">
                <Button
                  variant="outline"
                  className="font-bold px-8 py-6 text-base border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10"
                >
                  Join The Movement
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
