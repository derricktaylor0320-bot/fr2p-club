import type { LucideIcon } from "lucide-react";
import {
  Car, Handshake, QrCode, DollarSign, Printer, Smartphone,
  CheckCircle2, Users,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HIHELLO_APP_STORE_URL, HIHELLO_GOOGLE_PLAY_URL, GOTPRINT_URL, VISTAPRINT_URL } from "@shared/schema";

export type FuelRewardsFeatureId =
  | "community-fuel-pool"
  | "qr-marketing"
  | "car-magnets"
  | "station-partnerships"
  | "digital-business-suite"
  | "print-materials"
  | "recurring-commissions";

export interface FuelRewardsFeatureGuide {
  id: FuelRewardsFeatureId;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  steps: string[];
  proTip?: string;
  marketingMaterialId?: string;
  externalLinks?: { label: string; href: string }[];
}

export const FUEL_REWARDS_FEATURE_GUIDES: FuelRewardsFeatureGuide[] = [
  {
    id: "community-fuel-pool",
    title: "Community Fuel Pool",
    subtitle: "How subscription revenue funds your potential recurring commissions",
    icon: Users,
    steps: [
      "When a new partner picks a Fuel Rewards tier, they pay their monthly subscription through Stripe — secure checkout, no cash handled by you.",
      "That subscription revenue goes into the platform operating account. This is the community fuel pool that commissions are paid from — not from anyone's personal pocket.",
      "When someone joins through your referral link and keeps an active paid subscription, you may earn a potential recurring commission based on your tier level.",
      "Payouts are processed through Stripe once commissions meet the minimum threshold and holding period.",
      "Your results depend on how many active referrals you build and maintain. There are no income guarantees.",
    ],
    proTip: "Think of the fuel pool like a shared subscription fund — the more active partners in the program, the more the pool can support affiliate payouts.",
  },
  {
    id: "recurring-commissions",
    title: "Potential Recurring Commissions",
    subtitle: "How your $29.99/mo tier may earn month after month",
    icon: DollarSign,
    steps: [
      "Share your personal Fuel Rewards referral link by text, email, social media, or QR code.",
      "When someone signs up through your link and pays their active subscription, you may earn a potential recurring commission each month they stay active.",
      "At the Pro tier ($29.99/mo), your illustrative share is ~20% — for example, ~$6/mo per active $29.99 referral. Actual amounts vary.",
      "Higher tiers unlock higher potential recurring share rates. Elite ($39.99) reaches ~25%.",
      "Commissions come from the subscription revenue pool, processed by Stripe — not paid manually out of pocket.",
    ],
    proTip: "Focus on quality referrals who will stay active. One loyal referral paying monthly beats ten signups who cancel.",
  },
  {
    id: "qr-marketing",
    title: "QR Code Marketing",
    subtitle: "Turn gas pumps and waiting areas into signup moments",
    icon: QrCode,
    steps: [
      "Open the Marketing Back Office and enter your name, phone, and Fuel Rewards referral link.",
      "Download or print the Gas Pump QR Sign template — it is designed for drivers who are already standing at the pump.",
      "Ask the gas station manager for permission to display your sign near the pump area or on the pump island.",
      "Drivers scan your QR while they wait, land on your referral page, and can sign up for Fuel Rewards on the spot.",
      "Every signup through your link is tracked to you for potential recurring commissions while they stay active.",
    ],
    marketingMaterialId: "pump-qr-flyer",
    proTip: "Position the QR at eye level where drivers stand while filling up — not on the ground or behind equipment.",
  },
  {
    id: "car-magnets",
    title: "Car & Station Magnets",
    subtitle: "Turn your vehicle into a rolling advertisement",
    icon: Car,
    steps: [
      "Set up your HiHello digital business card first — add your name, role, phone, and Fuel Rewards referral link.",
      "Open the Marketing Back Office and customize the Car Magnet template with your contact info.",
      "Order custom car magnets through VistaPrint (best for bulk) or a local sign shop. Include your HiHello QR code on the design.",
      "Apply the magnet to your vehicle doors or rear — every drive becomes a marketing opportunity.",
      "For gas stations, ask the manager if you can leave a small magnet-style sign on their community board or counter.",
    ],
    marketingMaterialId: "car-magnet-guide",
    externalLinks: [
      { label: "Order at VistaPrint", href: VISTAPRINT_URL },
    ],
    proTip: "Use weather-resistant magnetic signs rated for outdoor use. Remove and reapply monthly to protect your paint.",
  },
  {
    id: "station-partnerships",
    title: "Gas Station Partnerships",
    subtitle: "Partner with station owners to display your QR where drivers wait",
    icon: Handshake,
    steps: [
      "Visit a local gas station and ask to speak with the manager or business owner.",
      "Explain that your QR code helps their customers save money on fuel — it is a value-add for their pumps, not a sales pitch.",
      "Offer a small QR sign or sticker for the pump area using the Gas Pump QR Sign from the Marketing Back Office.",
      "While someone fills up, they scan your code, sign up for Fuel Rewards, and start saving — you may earn potential recurring commissions.",
      "Repeat at multiple stations in your area to build a local network of referral points.",
    ],
    marketingMaterialId: "pump-qr-flyer",
    proTip: "Start with stations you already visit regularly. Familiar faces get better responses than cold walk-ins.",
  },
  {
    id: "digital-business-suite",
    title: "Digital Business Suite (HiHello)",
    subtitle: "Your free digital business card with a live-updating QR code",
    icon: Smartphone,
    steps: [
      "Download HiHello free on iPhone (Apple App Store) or Android (Google Play Store).",
      "Create your digital card: add your name, title (Fuel Rewards Partner), phone number, and your Fuel Rewards referral link.",
      "HiHello generates a QR code that updates automatically — change your phone or link anytime without reprinting.",
      "Share your QR via text, email, Bluetooth, WhatsApp, or any app on your phone's share sheet.",
      "Add the same QR to your printed business cards, postcards, pump signs, and car magnets from the Marketing Back Office.",
    ],
    externalLinks: [
      { label: "Apple App Store", href: HIHELLO_APP_STORE_URL },
      { label: "Google Play Store", href: HIHELLO_GOOGLE_PLAY_URL },
      { label: "HiHello.me", href: "https://www.hihello.me" },
    ],
    proTip: "Set your referral link as the primary action on your HiHello card so every scan goes straight to your signup page.",
  },
  {
    id: "print-materials",
    title: "Print Materials & Marketing Back Office",
    subtitle: "Business cards, postcards, pump signs, and car magnet templates",
    icon: Printer,
    steps: [
      "Go to the Marketing Back Office tab and enter your contact info once — it auto-fills every template.",
      "Choose a material: business card, fuel savings postcard, gas pump QR sign, or car magnet guide.",
      "Click Customize & Print to preview your design with your personal info overlaid.",
      "Print at home, or order professionally through GotPrint (postcards from $49) or VistaPrint (bulk cards and magnets).",
      "Hand cards to station managers, drop postcards locally, and display pump signs where drivers can scan.",
    ],
    marketingMaterialId: "fuel-business-card",
    externalLinks: [
      { label: "GotPrint.com", href: GOTPRINT_URL },
      { label: "VistaPrint.com", href: VISTAPRINT_URL },
    ],
    proTip: "Save your info in the Marketing Back Office first — then every template is one click away from being print-ready.",
  },
];

const GUIDE_BY_ID = new Map(FUEL_REWARDS_FEATURE_GUIDES.map(g => [g.id, g]));

export function getFeatureGuide(id: FuelRewardsFeatureId): FuelRewardsFeatureGuide {
  return GUIDE_BY_ID.get(id)!;
}

export function matchFeatureTextToGuide(text: string): FuelRewardsFeatureId | null {
  const lower = text.toLowerCase();
  if (lower.includes("car magnet") || lower.includes("vehicle")) return "car-magnets";
  if (lower.includes("hihello") || lower.includes("digital business")) return "digital-business-suite";
  if (lower.includes("gas pump") || lower.includes("station partnership") || lower.includes("pump qr")) return "station-partnerships";
  if (lower.includes("marketing back office") || lower.includes("business card") || lower.includes("postcard") || lower.includes("gotprint") || lower.includes("vistaprint") || lower.includes("print")) return "print-materials";
  if (lower.includes("qr") || lower.includes("scan")) return "qr-marketing";
  if (lower.includes("fuel pool") || lower.includes("revenue pool") || lower.includes("subscription revenue")) return "community-fuel-pool";
  if (lower.includes("recurring commission") || lower.includes("potential recurring") || lower.includes("%")) return "recurring-commissions";
  return null;
}

interface FeatureGuideDialogProps {
  guideId: FuelRewardsFeatureId | null;
  onClose: () => void;
  onOpenMarketing?: (materialId?: string) => void;
}

export function FeatureGuideDialog({ guideId, onClose, onOpenMarketing }: FeatureGuideDialogProps) {
  const guide = guideId ? GUIDE_BY_ID.get(guideId) : null;
  if (!guide) return null;

  const Icon = guide.icon;

  return (
    <Dialog open={!!guideId} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-[#001f3f] border-[#FFD700]/30 text-white">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 bg-[#FFD700]/20 border border-[#FFD700]/40 rounded-xl">
              <Icon className="h-5 w-5 text-[#FFD700]" />
            </div>
            <div>
              <DialogTitle className="text-white text-lg">{guide.title}</DialogTitle>
              <DialogDescription className="text-white/60 text-sm">{guide.subtitle}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ol className="space-y-3 mt-2">
          {guide.steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-white/80 text-sm leading-relaxed">
              <span className="w-6 h-6 rounded-full bg-[#FFD700]/20 text-[#FFD700] text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>

        {guide.proTip && (
          <div className="mt-4 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-xl p-3">
            <p className="text-[#FFD700] text-xs font-bold mb-1">Pro Tip</p>
            <p className="text-white/70 text-xs leading-relaxed">{guide.proTip}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-4">
          {guide.marketingMaterialId && onOpenMarketing && (
            <Button
              onClick={() => {
                onClose();
                onOpenMarketing(guide.marketingMaterialId);
              }}
              className="bg-[#FFD700] hover:bg-yellow-300 text-[#001f3f] font-bold text-sm"
            >
              Open in Marketing Back Office
            </Button>
          )}
          {guide.externalLinks?.map(link => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-2 rounded-lg border border-white/20 transition-colors"
            >
              {link.label} →
            </a>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ClickableFeatureCardProps {
  icon: LucideIcon;
  title: string;
  desc: string;
  guideId: FuelRewardsFeatureId;
  onOpenGuide: (id: FuelRewardsFeatureId) => void;
}

export function ClickableFeatureCard({ icon: Icon, title, desc, guideId, onOpenGuide }: ClickableFeatureCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpenGuide(guideId)}
      className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-[#FFD700]/50 hover:bg-white/10 transition-all text-left group w-full"
    >
      <Icon className="h-5 w-5 text-[#FFD700] mb-2" />
      <p className="text-white font-semibold text-sm">{title}</p>
      <p className="text-white/50 text-xs mt-1 leading-relaxed">{desc}</p>
      <p className="text-[#FFD700] text-[10px] font-semibold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        Tap to see how it works →
      </p>
    </button>
  );
}

interface ClickableFeatureListItemProps {
  text: string;
  onOpenGuide: (id: FuelRewardsFeatureId) => void;
}

export function ClickableFeatureListItem({ text, onOpenGuide }: ClickableFeatureListItemProps) {
  const guideId = matchFeatureTextToGuide(text);

  if (!guideId) {
    return (
      <li className="flex items-start gap-2 text-white/75 text-[11px] leading-relaxed">
        <CheckCircle2 className="h-3 w-3 text-green-400 flex-shrink-0 mt-0.5" />
        {text}
      </li>
    );
  }

  return (
    <li>
      <button
        type="button"
        onClick={() => onOpenGuide(guideId)}
        className="flex items-start gap-2 text-white/75 text-[11px] leading-relaxed hover:text-[#FFD700] transition-colors text-left w-full group"
      >
        <CheckCircle2 className="h-3 w-3 text-green-400 flex-shrink-0 mt-0.5 group-hover:text-[#FFD700]" />
        <span className="underline decoration-dotted decoration-white/30 underline-offset-2 group-hover:decoration-[#FFD700]">
          {text}
        </span>
        <span className="text-[#FFD700] text-[9px] font-semibold ml-auto flex-shrink-0 opacity-70 group-hover:opacity-100">
          How it works →
        </span>
      </button>
    </li>
  );
}
