import { Link } from "wouter";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmblemShowcase } from "@/components/EmblemShowcase";
import { EmblemImage } from "@/components/EmblemImage";
import { FR2P_EMBLEMS } from "@/data/emblems";
import { Gem, ShoppingBag } from "lucide-react";

export default function Collection() {
  return (
    <div className="min-h-screen bg-secondary">
      <SidebarNav />

      <div className="md:ml-64">
        <section
          id="fr2p-collection"
          className="text-center px-5 py-12 md:py-16"
          style={{ backgroundColor: "#0b0c2a", color: "#f5f5f5" }}
        >
          <div className="max-w-5xl mx-auto">
            <Badge
              className="mb-4 text-sm font-bold px-4 py-1"
              style={{ backgroundColor: "#d4af37", color: "#0b0c2a" }}
            >
              The Geometry of Success
            </Badge>

            <h1
              className="text-4xl md:text-5xl font-bold mb-5"
              style={{ color: "#d4af37" }}
            >
              The FR2P Club
            </h1>

            <p className="max-w-3xl mx-auto text-lg md:text-xl leading-relaxed mb-10 text-white/90">
              The FR2P Club is where ambition meets affluence. Each emblem represents a different
              facet of success — from the spiral of growth to the sphere of unity — all centered
              around the blue diamond of prosperity. More than a brand, it's a movement that stands
              for{" "}
              <strong className="text-[#d4af37]">money, power, wealth, and prestige</strong>.
            </p>
          </div>
        </section>

        <div className="md:ml-0 px-4 md:px-8 pb-8" style={{ backgroundColor: "#0b0c2a" }}>
          <EmblemShowcase variant="full" showScroll={true} />
        </div>

        <section className="px-5 py-12" style={{ backgroundColor: "#0b0c2a", color: "#f5f5f5" }}>
          <div className="max-w-5xl mx-auto">
            <p className="text-base md:text-lg text-[#c0c0c0] max-w-3xl mx-auto mb-10 text-center">
              Each symbol — triangle, pentagon, spiral, Gomboc, and cube — embodies The FR2P
              Club's evolution:{" "}
              <em className="text-[#d4af37]">
                structure, balance, growth, resilience, and unity
              </em>
              . Together, they form the geometry of success.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left mb-12">
              {FR2P_EMBLEMS.map((emblem) => (
                <div
                  key={`detail-${emblem.name}`}
                  className="rounded-xl border border-[#d4af37]/30 bg-white/5 p-5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <EmblemImage
                      src={emblem.src}
                      fallbackSrc={emblem.fallbackSrc}
                      alt={emblem.alt}
                      className="w-14 h-14 rounded-lg border border-[#d4af37]/40 object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <Gem className="w-4 h-4 text-[#d4af37]" />
                        <span className="font-semibold text-[#d4af37]">{emblem.name}</span>
                      </div>
                      <span className="text-white/40 text-sm">{emblem.meaning}</span>
                    </div>
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
                  Shop The FR2P Club Merchandise
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
