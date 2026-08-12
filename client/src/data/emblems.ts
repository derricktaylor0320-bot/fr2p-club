export interface Emblem {
  id: string;
  /** Original artwork path — files belong in client/public/attachments/ */
  src: string;
  /** SVG fallback when JPEG is unavailable */
  fallbackSrc: string;
  alt: string;
  name: string;
  meaning: string;
  description: string;
}

export const FR2P_EMBLEMS: Emblem[] = [
  {
    id: "triangle",
    src: "/attachments/CBz3uXtNb8qBFmgDAs9AF.jpeg",
    fallbackSrc: "/emblems/triangle.svg",
    alt: "FR2P Triangle Emblem",
    name: "Triangle",
    meaning: "Structure",
    description:
      "The foundation of every empire — clear lines, sharp focus, unshakeable direction.",
  },
  {
    id: "pentagon",
    src: "/attachments/MBpwk3MCU2TJRnwxmTgYg.jpeg",
    fallbackSrc: "/emblems/pentagon.svg",
    alt: "FR2P Pentagonal Emblem",
    name: "Pentagon",
    meaning: "Balance",
    description:
      "Five points of harmony — wealth, power, prestige, growth, and unity in perfect proportion.",
  },
  {
    id: "spiral",
    src: "/attachments/1dKfesnc2wxchnPxZCmYk.jpeg",
    fallbackSrc: "/emblems/spiral.svg",
    alt: "FR2P Spiral Emblem",
    name: "Spiral",
    meaning: "Growth",
    description:
      "The upward path of prosperity — each turn building on the last, compounding success.",
  },
  {
    id: "gomboc",
    src: "/attachments/cN7RtfrYN7sfpxazMyrMJ.jpeg",
    fallbackSrc: "/emblems/gomboc.svg",
    alt: "FR2P Gomboc Emblem",
    name: "Gomboc",
    meaning: "Resilience",
    description:
      "Self-righting strength — no matter the setback, true leaders always rise again.",
  },
  {
    id: "cube",
    src: "/attachments/PAecUhfTf5adgq8hTMGVk.jpeg",
    fallbackSrc: "/emblems/cube.svg",
    alt: "FR2P Cube Emblem",
    name: "Cube",
    meaning: "Unity",
    description:
      "The sphere of togetherness — every member connected through the blue diamond of prosperity.",
  },
];
