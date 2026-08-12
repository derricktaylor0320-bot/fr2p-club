export interface Emblem {
  id: string;
  src: string;
  alt: string;
  name: string;
  meaning: string;
  description: string;
}

export const FR2P_EMBLEMS: Emblem[] = [
  {
    id: "triangle",
    src: "/emblems/triangle.jpeg",
    alt: "FR2P Triangle Emblem",
    name: "Triangle",
    meaning: "Structure",
    description:
      "The foundation of every empire — clear lines, sharp focus, unshakeable direction.",
  },
  {
    id: "pentagon",
    src: "/emblems/pentagon.jpeg",
    alt: "FR2P Pentagonal Emblem",
    name: "Pentagon",
    meaning: "Balance",
    description:
      "Five points of harmony — wealth, power, prestige, growth, and unity in perfect proportion.",
  },
  {
    id: "spiral",
    src: "/emblems/spiral.jpeg",
    alt: "FR2P Spiral Emblem",
    name: "Spiral",
    meaning: "Growth",
    description:
      "The upward path of prosperity — each turn building on the last, compounding success.",
  },
  {
    id: "gomboc",
    src: "/emblems/gomboc.jpeg",
    alt: "FR2P Gomboc Emblem",
    name: "Gomboc",
    meaning: "Resilience",
    description:
      "Self-righting strength — no matter the setback, true leaders always rise again.",
  },
  {
    id: "cube",
    src: "/emblems/cube.jpeg",
    alt: "FR2P Cube Emblem",
    name: "Cube",
    meaning: "Unity",
    description:
      "The sphere of togetherness — every member connected through the blue diamond of prosperity.",
  },
];
