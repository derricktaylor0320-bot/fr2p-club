import { useQuery } from "@tanstack/react-query";
import type { MemberResponse } from "@shared/schema";
import { KONNECTMD_AMBASSADOR_LINK } from "@shared/schema";
import { HeaderNav } from "@/components/ui/header-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Lock,
  Heart,
  Stethoscope,
  Pill,
  Plane,
  Phone,
  Shield,
  Star,
  ExternalLink,
  CheckCircle2,
  Crown,
  PawPrint,
  Receipt,
  Weight,
  Sparkles,
} from "lucide-react";
import { Link } from "wouter";

import { getLoggedInMemberId } from "@/lib/auth";
const DEMO_USER_ID = getLoggedInMemberId();

const konnectMDPlans = {
  lifestyle: [
    {
      name: "VIP Booking Engine",
      price: "$49.99/month",
      tag: "Travel & Lifestyle",
      icon: Plane,
      color: "from-sky-700 to-sky-900",
      border: "border-sky-400",
      badge: "bg-sky-400 text-sky-900",
      description: "Access to a private travel booking portal with member-only rates on hotels, flights, cruises, and car rentals.",
      features: [
        "Private members-only travel portal",
        "Hotel & resort discounts",
        "Cruise cash-back rewards",
        "Car rental savings",
        "Fine dining perks",
      ],
    },
    {
      name: "Lifestyle Membership",
      price: "$99.99/month",
      tag: "Full Lifestyle Bundle",
      icon: Sparkles,
      color: "from-violet-700 to-violet-900",
      border: "border-violet-400",
      badge: "bg-violet-400 text-violet-900",
      description: "The complete lifestyle package — travel portal plus wellness perks, discount programs, and exclusive member experiences.",
      features: [
        "Everything in VIP Booking Engine",
        "Wellness & fitness discounts",
        "Entertainment & dining rewards",
        "Member concierge service",
        "Exclusive event access",
      ],
    },
  ],
  healthcare: [
    {
      name: "Silver Plan",
      price: "$59.99/month",
      tag: "Healthcare",
      icon: Shield,
      color: "from-slate-600 to-slate-800",
      border: "border-slate-400",
      badge: "bg-slate-300 text-slate-900",
      description: "Essential virtual healthcare access. Talk to a doctor 24/7 without insurance.",
      features: [
        "24/7 virtual doctor access",
        "Prescription discount card",
        "Basic telemedicine visits",
        "Mental health support",
      ],
    },
    {
      name: "Gold Plan",
      price: "$79.99/month",
      tag: "Healthcare",
      icon: Star,
      color: "from-yellow-700 to-yellow-900",
      border: "border-yellow-400",
      badge: "bg-yellow-400 text-yellow-900",
      description: "Enhanced healthcare with prescription benefits, urgent care, and specialist access.",
      features: [
        "Everything in Silver",
        "Free acute medications shipped",
        "Specialist consultations",
        "Chronic care management",
      ],
    },
    {
      name: "Platinum Plan",
      price: "$99.99/month",
      tag: "Healthcare",
      icon: Crown,
      color: "from-gray-600 to-gray-900",
      border: "border-gray-300",
      badge: "bg-gray-200 text-gray-900",
      description: "Full healthcare suite — primary, urgent, mental health, prescriptions, and family coverage.",
      features: [
        "Everything in Gold",
        "Family coverage included",
        "Unlimited telemedicine",
        "Advanced mental health access",
        "Prescription savings up to 70%",
      ],
    },
    {
      name: "Titanium Membership",
      price: "$149.99/month",
      tag: "Premium Bundle — Best Value",
      icon: Sparkles,
      color: "from-[#001f3f] to-[#002855]",
      border: "border-[#FFD700]",
      badge: "bg-[#FFD700] text-[#001f3f]",
      description: "The top-tier bundle. Full Platinum healthcare PLUS Lifestyle access — everything KonnectMD offers in one plan.",
      features: [
        "Full Platinum healthcare plan",
        "Lifestyle & travel portal included",
        "Family coverage included",
        "VIP booking engine access",
        "Medical debt advocate included",
        "Top-tier concierge service",
      ],
      featured: true,
    },
  ],
  addons: [
    {
      name: "Pet Care",
      price: "$19.99/month",
      icon: PawPrint,
      color: "from-orange-700 to-orange-900",
      border: "border-orange-400",
      description: "Veterinary telehealth, pet prescriptions discounts, and wellness guidance for your furry family members.",
    },
    {
      name: "Medical Bill Advocate",
      price: "$29.99/month",
      icon: Receipt,
      color: "from-teal-700 to-teal-900",
      border: "border-teal-400",
      description: "A certified medical billing advocate who negotiates your hospital and doctor bills on your behalf. Saves members hundreds to thousands.",
    },
    {
      name: "GLP-1 Weight Loss Program",
      price: "$375/month",
      icon: Weight,
      color: "from-pink-700 to-pink-900",
      border: "border-pink-400",
      description: "Medically supervised GLP-1 weight loss program (Semaglutide/Tirzepatide). Prescribed, monitored, and delivered.",
    },
  ],
};

export default function KonnectMD() {
  const { data: memberData, isLoading } = useQuery<MemberResponse>({
    queryKey: ["/api/member", DEMO_USER_ID],
  });

  const isPremium = memberData?.member?.membershipLevel === "premium";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#001f3f]">
        <HeaderNav user={undefined} />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-[#FFD700] border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001f3f] to-[#002855]">
      <HeaderNav user={memberData?.member || undefined} />

      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* ── HEADER ── */}
        <div className="text-center mb-10">
          <Badge className="bg-[#FFD700] text-[#001f3f] font-bold mb-4 text-sm px-4 py-1">
            <Crown className="w-4 h-4 mr-2 inline" />
            PREMIUM MEMBER BENEFIT
          </Badge>
          <h1 className="text-4xl font-bold text-white mb-3">
            KonnectMD Health & Lifestyle
          </h1>
          <p className="text-white/75 max-w-2xl mx-auto text-base">
            Your FR2P Premium membership is your <strong className="text-[#FFD700]">gateway to the KonnectMD marketplace</strong>.
            Browse every plan below and choose what fits your life — at KonnectMD's official prices.
          </p>
        </div>

        {/* ── ACCESS EXPLANATION ── */}
        <div className="mb-10 bg-[#FFD700]/10 border-2 border-[#FFD700]/40 rounded-xl p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="text-6xl">🔗</div>
            <div className="flex-1">
              <h2 className="text-[#FFD700] font-bold text-xl mb-2">How This Works — No Double Payment</h2>
              <p className="text-white/80 text-sm mb-3">
                FR2P is a <strong className="text-white">gateway</strong>, not a reseller.
                Your $50/month Premium membership gives you <strong className="text-white">access to choose</strong> from the full KonnectMD plan catalog.
                You pay KonnectMD directly at their official prices — no markup, no bundling confusion.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2 text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-[#FFD700] shrink-0" />
                  FR2P $50/mo = Marketplace Access
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-[#FFD700] shrink-0" />
                  KonnectMD = Your Chosen Plan
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-[#FFD700] shrink-0" />
                  Official Prices — No Markup
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── GATE FOR NON-PREMIUM ── */}
        {!isPremium && (
          <div className="mb-10 bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-500 rounded-xl p-8 max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-amber-900 mb-2">Upgrade to Premium to Access This Marketplace</h2>
            <p className="text-amber-800 mb-4 text-sm">
              FR2P Premium ($50/month) gives you the ability to browse and purchase any KonnectMD plan below at official prices.
              Standard members see the catalog — Premium members can activate any plan they choose.
            </p>
            <div className="bg-white rounded-lg p-4 mb-5 space-y-2 text-left">
              <p className="text-amber-900 font-semibold text-sm mb-2">Premium unlocks access to:</p>
              {["KonnectMD Healthcare (Silver, Gold, Platinum)", "Lifestyle & Travel Plans ($49.99–$99.99/mo)", "Titanium Bundle ($149.99/mo) — best value", "Pet Care, Medical Bill Advocate, GLP-1 program"].map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-amber-800">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  {f}
                </div>
              ))}
            </div>
            <Link href="/store">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-5 text-base font-bold" data-testid="button-upgrade-premium">
                <Star className="w-5 h-5 mr-2" />
                Upgrade to Premium — $50/month
              </Button>
            </Link>
            <p className="text-amber-600 text-xs mt-3">Only $15/month more than Standard. Worth it for the marketplace access alone.</p>
          </div>
        )}

        {/* ── LIFESTYLE & TRAVEL PLANS ── */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Plane className="h-7 w-7 text-[#FFD700]" />
            <h2 className="text-2xl font-bold text-[#FFD700]">Lifestyle & Travel Plans</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {konnectMDPlans.lifestyle.map((plan, i) => {
              const Icon = plan.icon;
              return (
                <Card key={i} className={`border-2 ${plan.border} bg-gradient-to-br ${plan.color}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-1">
                      <Badge className={plan.badge + " font-bold text-xs"}>{plan.tag}</Badge>
                      <Icon className="w-5 h-5 text-white/70" />
                    </div>
                    <CardTitle className="text-white text-xl">{plan.name}</CardTitle>
                    <div className="text-2xl font-black text-white">{plan.price}</div>
                    <p className="text-white/75 text-sm">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {plan.features.map((f, j) => (
                      <div key={j} className="flex items-start gap-2 text-sm text-white/85">
                        <CheckCircle2 className="w-4 h-4 text-[#FFD700] shrink-0 mt-0.5" />
                        {f}
                      </div>
                    ))}
                    <div className="pt-3">
                      <Button
                        className="w-full bg-white/15 hover:bg-white/25 text-white border border-white/30 font-bold"
                        onClick={() => window.open(KONNECTMD_AMBASSADOR_LINK, "_blank")}
                        disabled={!isPremium}
                        data-testid={`button-konnectmd-${plan.name.toLowerCase().replace(/\s/g, "-")}`}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        {isPremium ? `Select ${plan.name}` : "Upgrade to Access"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* ── HEALTHCARE PLANS ── */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Stethoscope className="h-7 w-7 text-[#FFD700]" />
            <h2 className="text-2xl font-bold text-[#FFD700]">Healthcare Plans</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {konnectMDPlans.healthcare.map((plan, i) => {
              const Icon = plan.icon;
              return (
                <Card key={i} className={`border-2 ${plan.border} bg-gradient-to-br ${plan.color} ${plan.featured ? "md:col-span-2" : ""}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-1">
                      <Badge className={(plan.badge || "bg-white/20 text-white") + " font-bold text-xs"}>
                        {plan.tag}
                        {plan.featured && <span className="ml-1">⭐</span>}
                      </Badge>
                      <Icon className="w-5 h-5 text-white/70" />
                    </div>
                    <CardTitle className="text-white text-xl">{plan.name}</CardTitle>
                    <div className="text-2xl font-black text-white">{plan.price}</div>
                    <p className="text-white/75 text-sm">{plan.description}</p>
                  </CardHeader>
                  <CardContent className={plan.featured ? "grid md:grid-cols-2 gap-x-8 gap-y-2" : "space-y-2"}>
                    {plan.features.map((f, j) => (
                      <div key={j} className={`flex items-start gap-2 text-sm text-white/85 ${!plan.featured ? "" : ""}`}>
                        <CheckCircle2 className="w-4 h-4 text-[#FFD700] shrink-0 mt-0.5" />
                        {f}
                      </div>
                    ))}
                    <div className={plan.featured ? "md:col-span-2 pt-3" : "pt-3"}>
                      <Button
                        className="w-full bg-white/15 hover:bg-white/25 text-white border border-white/30 font-bold"
                        onClick={() => window.open(KONNECTMD_AMBASSADOR_LINK, "_blank")}
                        disabled={!isPremium}
                        data-testid={`button-konnectmd-${plan.name.toLowerCase().replace(/\s/g, "-")}`}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        {isPremium ? `Select ${plan.name}` : "Upgrade to Access"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* ── ADD-ONS ── */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Pill className="h-7 w-7 text-[#FFD700]" />
            <h2 className="text-2xl font-bold text-[#FFD700]">Add-Ons</h2>
            <span className="text-white/50 text-sm">Pair with any plan</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {konnectMDPlans.addons.map((addon, i) => {
              const Icon = addon.icon;
              return (
                <Card key={i} className={`border-2 ${addon.border} bg-gradient-to-br ${addon.color}`}>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="w-6 h-6 text-white/80" />
                      <div>
                        <CardTitle className="text-white text-base">{addon.name}</CardTitle>
                        <div className="text-white font-black text-lg">{addon.price}</div>
                      </div>
                    </div>
                    <p className="text-white/70 text-xs">{addon.description}</p>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full bg-white/15 hover:bg-white/25 text-white border border-white/30 font-bold text-sm"
                      onClick={() => window.open(KONNECTMD_AMBASSADOR_LINK, "_blank")}
                      disabled={!isPremium}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {isPremium ? "Add to My Plan" : "Upgrade to Access"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* ── ACTIVATE / SUMMARY ── */}
        {isPremium && (
          <div className="bg-gradient-to-r from-[#001f3f] to-[#002855] border-2 border-[#FFD700] rounded-xl p-8 text-center">
            <Crown className="h-10 w-10 text-[#FFD700] mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-[#FFD700] mb-2">You're a Premium Member — Your Access is Active</h2>
            <p className="text-white/75 text-sm max-w-xl mx-auto mb-6">
              Click any "Select" button above to be taken to KonnectMD's secure signup using the FR2P ambassador link.
              You pay KonnectMD directly at their official prices. FR2P handles the introduction.
            </p>
            <Button
              className="bg-[#FFD700] hover:bg-yellow-300 text-[#001f3f] font-black px-10 py-5 text-base"
              onClick={() => window.open(KONNECTMD_AMBASSADOR_LINK, "_blank")}
              data-testid="button-activate-konnectmd"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Browse KonnectMD Plans Directly
            </Button>
            <p className="text-white/40 text-xs mt-3">
              You'll be redirected to KonnectMD's secure signup page using The FR2P Club's ambassador link.
            </p>
          </div>
        )}

        {/* ── DISCLAIMER ── */}
        <div className="mt-10 text-center text-white/35 text-xs max-w-2xl mx-auto">
          <Heart className="w-4 h-4 inline mr-1" />
          KonnectMD plans are provided by KonnectMD, an independent service provider. The FR2P Club is not a healthcare company.
          All KonnectMD plans are purchased directly from and managed by KonnectMD.
          Prices shown are KonnectMD's official rates and may be subject to change. FR2P does not alter, mark up, or bundle healthcare plans.
        </div>
      </div>
    </div>
  );
}
