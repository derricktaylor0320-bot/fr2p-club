import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { MarketingToolsHub, FUEL_REWARDS_MARKETING_CONFIG } from "@/components/marketing-tools-hub";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { MemberResponse } from "@shared/schema";
import { FUEL_REWARDS_TIERS, HIHELLO_APP_STORE_URL, HIHELLO_GOOGLE_PLAY_URL, GOTPRINT_URL, VISTAPRINT_URL } from "@shared/schema";
import { getLoggedInMemberId } from "@/lib/auth";
import {
  Fuel, Crown, Star, Zap, QrCode, MapPin, Car, Handshake,
  DollarSign, Users, TrendingUp, CheckCircle2, ChevronRight,
  Megaphone, ExternalLink, Smartphone, Printer, FileImage,
} from "lucide-react";
import { Link } from "wouter";

const MEMBER_ID = getLoggedInMemberId();

const tierIcons = [Fuel, Star, Zap, Crown];
const tierColors = [
  { border: "border-slate-400", badge: "bg-slate-400 text-slate-900", btn: "bg-slate-400 hover:bg-slate-500 text-slate-900" },
  { border: "border-emerald-400", badge: "bg-emerald-400 text-emerald-900", btn: "bg-emerald-500 hover:bg-emerald-600 text-white" },
  { border: "border-sky-400", badge: "bg-sky-400 text-sky-900", btn: "bg-sky-500 hover:bg-sky-600 text-white" },
  { border: "border-[#FFD700]", badge: "bg-[#FFD700] text-[#001f3f]", btn: "bg-[#FFD700] hover:bg-yellow-300 text-[#001f3f]" },
];

export default function FuelRewards() {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<"overview" | "marketing">("overview");

  const { data: memberData } = useQuery<MemberResponse>({
    queryKey: ["/api/member", MEMBER_ID],
  });

  const handleSubscribe = async (tierName: string, price: string) => {
    if (price === "Included") {
      toast({
        title: "Already Included!",
        description: "Member Access comes free with your active FR2P Club membership.",
      });
      return;
    }

    toast({
      title: `${tierName} — Checkout Starting`,
      description: `Redirecting to secure checkout for ${price}/month...`,
    });

    try {
      const amount = parseFloat(price.replace(/[^0-9.]+/g, ""));
      const response = await apiRequest("POST", "/api/create-payment-intent", {
        amount,
        productName: `The FR2P Club Fuel Rewards — ${tierName}`,
        type: "product",
      });
      const data = await response.json();
      if (data.url) {
        setTimeout(() => { window.location.href = data.url; }, 800);
      } else {
        throw new Error("No checkout URL received");
      }
    } catch {
      toast({
        title: "Payment Error",
        description: "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isActiveMember = !!memberData?.member;

  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #001a2e 0%, #002040 50%, #001a2e 100%)" }}>
      <SidebarNav />

      <div className="flex-1 md:ml-64 p-6">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl border border-[#FFD700]/30 mb-8" style={{ background: "linear-gradient(135deg, #001f3f 0%, #003366 50%, #001f3f 100%)" }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-10 bg-[#FFD700]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl opacity-10 bg-orange-500" />
          </div>

          <div className="relative p-8 lg:p-10">
            <Badge className="bg-orange-500/20 text-orange-300 border border-orange-400/40 mb-4">
              Affiliate Marketing Program · Standalone or Inside The FR2P Club
            </Badge>

            <div className="flex items-start gap-4 mb-4">
              <div className="p-4 bg-[#FFD700]/20 border border-[#FFD700]/40 rounded-2xl flex-shrink-0">
                <Fuel className="h-10 w-10 text-[#FFD700]" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
                  The FR2P Club Fuel Rewards
                </h1>
                <p className="text-[#FFD700] font-semibold text-lg mt-1">Save at the Pump. Earn While You Drive.</p>
              </div>
            </div>

            <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-3xl mb-6">
              The FR2P Club Fuel Rewards is an affiliate marketing program that helps everyday drivers save money on fuel
              while giving you a real business opportunity. Share your personal referral link, place QR codes at gas stations,
              put magnets on your car, and build recurring income — all while helping people cut their fuel costs.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setActiveSection("overview")}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-colors ${
                  activeSection === "overview"
                    ? "bg-[#FFD700] text-[#001f3f]"
                    : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                }`}
              >
                Program Overview & Tiers
              </button>
              <button
                onClick={() => setActiveSection("marketing")}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-colors ${
                  activeSection === "marketing"
                    ? "bg-[#FFD700] text-[#001f3f]"
                    : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                }`}
              >
                Marketing Back Office
              </button>
            </div>
          </div>
        </div>

        {activeSection === "overview" && (
          <>
            {/* What Is This Program */}
            <Card className="bg-[#002855]/80 border border-[#FFD700]/20 mb-8">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Megaphone className="h-5 w-5 text-[#FFD700]" />
                  What Is The FR2P Club Fuel Rewards?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-white/80 text-sm leading-relaxed">
                <p>
                  Fuel Rewards is a <strong className="text-white">standalone affiliate program</strong> that also lives inside
                  The FR2P Club ecosystem. It is built for people who want to help others save money at the gas pump while
                  building their own income stream through referrals and local marketing.
                </p>
                <p>
                  As a Fuel Rewards partner, you get access to fuel savings benefits for yourself and everyone you refer.
                  You also get the tools to market locally — business cards, postcards, QR codes, car magnets, and gas pump
                  signage — so you can turn everyday moments (filling up, driving, waiting at a pump) into income opportunities.
                </p>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                  {[
                    { icon: QrCode, title: "QR Code Marketing", desc: "Place your QR at gas pumps so drivers scan while they wait" },
                    { icon: Car, title: "Car Magnets", desc: "Turn your vehicle into a rolling ad with your referral QR" },
                    { icon: Handshake, title: "Station Partnerships", desc: "Partner with gas station managers to display your sign" },
                    { icon: DollarSign, title: "Affiliate Income", desc: "Earn commissions on every person who joins through you" },
                  ].map(item => (
                    <div key={item.title} className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <item.icon className="h-5 w-5 text-[#FFD700] mb-2" />
                      <p className="text-white font-semibold text-sm">{item.title}</p>
                      <p className="text-white/50 text-xs mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* How To Make Money */}
            <Card className="bg-[#002855]/80 border border-[#FFD700]/20 mb-8">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#FFD700]" />
                  How You Make Money
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      step: "1",
                      title: "Share Your Link",
                      desc: "Send your personal Fuel Rewards referral link by text, email, social media, or QR code. Every signup through your link is tracked to you.",
                    },
                    {
                      step: "2",
                      title: "Market Locally",
                      desc: "Print business cards and postcards. Ask gas station managers if you can display your QR sign on their pumps. Add a car magnet with your QR.",
                    },
                    {
                      step: "3",
                      title: "Earn Recurring Income",
                      desc: "Every active member you refer generates monthly affiliate commissions. Higher tiers unlock bigger commission rates and premium marketing tools.",
                    },
                  ].map(s => (
                    <div key={s.step} className="relative bg-white/5 rounded-xl p-5 border border-white/10">
                      <div className="absolute -top-3 -left-1 w-8 h-8 bg-[#FFD700] text-[#001f3f] rounded-full flex items-center justify-center font-black text-sm">
                        {s.step}
                      </div>
                      <p className="text-white font-bold mt-2 mb-2">{s.title}</p>
                      <p className="text-white/60 text-xs leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-xl p-4">
                  <p className="text-[#FFD700] font-semibold text-sm mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Gas Station Partnership Playbook
                  </p>
                  <ol className="text-white/70 text-xs space-y-2 list-decimal list-inside leading-relaxed">
                    <li>Visit a local gas station and ask to speak with the manager or business owner.</li>
                    <li>Explain that your QR code helps their customers save money on fuel — it's a value-add for their pumps.</li>
                    <li>Offer a small sign or sticker with your QR code for the pump area (use the Gas Pump QR Sign in the Marketing Back Office).</li>
                    <li>While someone is filling up, they scan your code, sign up for Fuel Rewards, and start saving — and you earn.</li>
                    <li>Repeat at multiple stations in your area to build a local network of referral points.</li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            {/* Marketing Back Office Overview */}
            <Card className="bg-gradient-to-br from-[#001f3f] to-[#002855] border-2 border-[#FFD700]/40 mb-8">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileImage className="h-5 w-5 text-[#FFD700]" />
                  Marketing Back Office & Marketing Tools
                </CardTitle>
                <p className="text-white/60 text-sm mt-1">
                  Included with Pro ($29.99/mo) and Elite Premium ($39.99/mo) — your command center for growing your Fuel Rewards business.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[
                    {
                      icon: Printer,
                      title: "Print Materials",
                      desc: "Business cards, postcards, gas pump QR signs, and car magnet templates — customize with your info and print.",
                    },
                    {
                      icon: QrCode,
                      title: "HiHello Digital Card",
                      desc: "Free app for iPhone (Apple App Store) and Android (Google Play Store). Add your role, contact info, and referral link — share your QR anywhere.",
                    },
                    {
                      icon: ExternalLink,
                      title: "GotPrint.com",
                      desc: "Order professional postcards starting at $49. Best for single-run and local direct-mail fuel savings campaigns.",
                    },
                    {
                      icon: ExternalLink,
                      title: "VistaPrint",
                      desc: "Best for bulk business cards, car magnets, and large quantity runs — not ideal for single one-off items.",
                    },
                  ].map(item => (
                    <div key={item.title} className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <item.icon className="h-5 w-5 text-[#FFD700] mb-2" />
                      <p className="text-white font-semibold text-sm">{item.title}</p>
                      <p className="text-white/50 text-xs mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-xl p-4">
                  <p className="text-[#FFD700] font-bold text-sm mb-3 flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    HiHello — Digital Business Card App
                  </p>
                  <p className="text-white/70 text-xs leading-relaxed mb-3">
                    Download HiHello on your phone, enter your name, role, phone number, and Fuel Rewards referral link,
                    then share your QR code via text, email, Bluetooth, WhatsApp, or any app. Your QR updates automatically — no reprinting needed.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={HIHELLO_APP_STORE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-black hover:bg-gray-900 text-white text-xs font-bold px-4 py-2 rounded-lg border border-white/20 transition-colors"
                    >
                      <Smartphone className="h-3.5 w-3.5" />
                      Apple App Store (iPhone)
                    </a>
                    <a
                      href={HIHELLO_GOOGLE_PLAY_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                    >
                      <Smartphone className="h-3.5 w-3.5" />
                      Google Play Store (Android)
                    </a>
                    <a
                      href={GOTPRINT_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-lg border border-white/20 transition-colors"
                    >
                      GotPrint.com →
                    </a>
                    <a
                      href={VISTAPRINT_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-lg border border-white/20 transition-colors"
                    >
                      VistaPrint.com →
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Tiers */}
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-white mb-1">Choose Your Tier — Monthly Breakdown</h2>
              <p className="text-white/60 text-sm mb-2">
                Four options — from free with FR2P membership to Elite Premium at $39.99/month. Each tier shows exactly what you get every month.
              </p>
              <p className="text-[#FFD700] text-xs font-semibold mb-6">
                Paid tiers: Starter $19.99/mo · Pro $29.99/mo (Marketing Back Office) · Elite Premium $39.99/mo
              </p>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              {FUEL_REWARDS_TIERS.map((tier, i) => {
                const Icon = tierIcons[i];
                const colors = tierColors[i];
                const isIncluded = tier.price === "Included";
                const isFeatured = tier.featured;

                return (
                  <Card
                    key={tier.id}
                    className={`relative bg-[#001f3f]/90 border-2 ${colors.border} ${isFeatured ? "shadow-lg shadow-[#FFD700]/20 scale-[1.02]" : ""}`}
                  >
                    {isFeatured && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-[#FFD700] text-[#001f3f] font-bold px-3">TOP TIER</Badge>
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="h-5 w-5 text-[#FFD700]" />
                        <Badge className={colors.badge}>{tier.tag}</Badge>
                      </div>
                      <CardTitle className="text-white text-xl">{tier.name}</CardTitle>
                      <div className="mt-2">
                        <span className="text-3xl font-black text-[#FFD700]">{tier.price}</span>
                        {!isIncluded && <span className="text-white/50 text-sm">/month</span>}
                      </div>
                      {!isIncluded && (
                        <p className="text-white/40 text-[10px] mt-1">{tier.billingNote}</p>
                      )}
                      <p className="text-white/60 text-xs mt-2 leading-relaxed">{tier.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-white/5 rounded-lg p-3 border border-[#FFD700]/20">
                        <p className="text-[#FFD700] text-xs font-bold uppercase tracking-wide mb-2">
                          What You Get Every Month
                        </p>
                        <ul className="space-y-1.5">
                          {tier.monthlyIncludes.map(item => (
                            <li key={item} className="flex items-start gap-2 text-white/75 text-[11px] leading-relaxed">
                              <CheckCircle2 className="h-3 w-3 text-green-400 flex-shrink-0 mt-0.5" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="text-[#FFD700] text-xs font-bold uppercase tracking-wide mb-2">How You Earn</p>
                        <p className="text-white/70 text-xs leading-relaxed">{tier.earnDescription}</p>
                      </div>

                      {tier.hasMarketingBackOffice && (
                        <div className="flex items-center gap-1.5 bg-sky-500/10 border border-sky-400/30 rounded-lg px-2 py-1.5">
                          <FileImage className="h-3.5 w-3.5 text-sky-300" />
                          <span className="text-sky-200 text-[10px] font-semibold">Includes Marketing Back Office</span>
                        </div>
                      )}

                      <ul className="space-y-1.5">
                        {tier.features.map(f => (
                          <li key={f} className="flex items-start gap-2 text-white/80 text-xs">
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-400 flex-shrink-0 mt-0.5" />
                            {f}
                          </li>
                        ))}
                      </ul>

                      <Button
                        className={`w-full font-bold ${colors.btn}`}
                        onClick={() => handleSubscribe(tier.name, tier.price)}
                        disabled={isIncluded && !isActiveMember}
                      >
                        {isIncluded
                          ? isActiveMember
                            ? "Included With Membership"
                            : "Join The FR2P Club First"
                          : `Subscribe — ${tier.priceDisplay}/mo`}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-8">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                <Users className="h-5 w-5 text-[#FFD700]" />
                Tier Comparison — Monthly Features
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-white/70">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 pr-4 text-[#FFD700]">Feature / Month</th>
                      <th className="text-center py-2 px-2">Member</th>
                      <th className="text-center py-2 px-2">$19.99</th>
                      <th className="text-center py-2 px-2">$29.99</th>
                      <th className="text-center py-2 px-2">$39.99</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[
                      ["Fuel savings access", "✓", "✓", "✓", "✓"],
                      ["Personal referral link", "✓", "✓", "✓", "✓"],
                      ["Starter commission rate", "—", "✓", "✓", "✓"],
                      ["Basic business card template", "—", "✓", "✓", "✓"],
                      ["Marketing Back Office", "—", "—", "✓", "✓"],
                      ["Marketing Tools (print & customize)", "—", "—", "✓", "✓"],
                      ["HiHello digital QR card (App Store & Google Play)", "—", "—", "✓", "✓"],
                      ["GotPrint.com postcard guide (from $49)", "—", "—", "✓", "✓"],
                      ["VistaPrint bulk print guide", "—", "—", "✓", "✓"],
                      ["Gas pump QR signage", "—", "—", "✓", "✓"],
                      ["Car magnet templates", "—", "—", "—", "✓"],
                      ["Station partnership toolkit", "—", "—", "—", "✓"],
                      ["Priority commission rate (highest)", "—", "—", "—", "✓"],
                      ["Elite partner badge & support", "—", "—", "—", "✓"],
                    ].map(([feature, m, s, p, e]) => (
                      <tr key={feature}>
                        <td className="py-2 pr-4">{feature}</td>
                        <td className="text-center py-2 px-2">{m}</td>
                        <td className="text-center py-2 px-2">{s}</td>
                        <td className="text-center py-2 px-2">{p}</td>
                        <td className="text-center py-2 px-2 text-[#FFD700] font-semibold">{e}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-white/40 text-[10px] mt-4">
                Member Access is free with active FR2P membership. Starter ($19.99), Pro ($29.99 with Marketing Back Office), and Elite Premium ($39.99) are monthly subscriptions — cancel anytime.
              </p>
            </div>

            <div className="text-center">
              <Button
                onClick={() => setActiveSection("marketing")}
                className="bg-[#FFD700] hover:bg-yellow-300 text-[#001f3f] font-bold px-8"
              >
                Open Marketing Back Office
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
              {!isActiveMember && (
                <p className="text-white/50 text-xs mt-3">
                  Not a member yet?{" "}
                  <Link href="/join" className="text-[#FFD700] underline hover:text-yellow-300">
                    Join The FR2P Club
                  </Link>{" "}
                  to unlock free Member Access.
                </p>
              )}
            </div>
          </>
        )}

        {activeSection === "marketing" && (
          <>
            <div className="mb-6 rounded-xl border border-orange-400/30 bg-orange-500/10 p-4">
              <p className="text-orange-200 text-sm leading-relaxed">
                <strong className="text-orange-100">Fuel Rewards Marketing Back Office</strong> — Your standalone command center
                for business cards, postcards, HiHello digital cards, QR sharing, and print vendor recommendations.
                Enter your info once, customize every material, and start marketing at gas stations and on the road.
              </p>
              <p className="text-orange-200/70 text-xs mt-2">
                Pro ($29.99/mo) and Elite Premium ($39.99/mo) include full Marketing Back Office access.
                Uses HiHello (App Store & Google Play), GotPrint.com, and VistaPrint.{" "}
                <button onClick={() => setActiveSection("overview")} className="text-[#FFD700] underline hover:text-yellow-300">
                  View tier breakdown →
                </button>
              </p>
            </div>

            <MarketingToolsHub config={FUEL_REWARDS_MARKETING_CONFIG} />

            <div className="mt-8 rounded-2xl border border-[#FFD700]/20 bg-[#002855]/50 p-6">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-[#FFD700]" />
                Recommended Print Partners
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-[#FFD700] font-bold text-sm">GotPrint.com — Best for Postcards</p>
                  <p className="text-white/60 text-xs mt-1 leading-relaxed">
                    Postcards starting at <strong className="text-white">$49</strong>. Ideal for single-run fuel savings campaigns,
                    direct mail, and professional-quality postcards you can drop locally.
                  </p>
                  <a href="https://www.gotprint.com" target="_blank" rel="noopener noreferrer" className="text-[#FFD700] text-xs underline mt-2 inline-block">
                    Visit GotPrint.com →
                  </a>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-[#FFD700] font-bold text-sm">VistaPrint — Best for Bulk Orders</p>
                  <p className="text-white/60 text-xs mt-1 leading-relaxed">
                    Better suited for <strong className="text-white">bulk business cards, car magnets, and large quantity runs</strong> —
                    not ideal for single one-off items. Use when you need 100+ pieces.
                  </p>
                  <a href="https://www.vistaprint.com" target="_blank" rel="noopener noreferrer" className="text-[#FFD700] text-xs underline mt-2 inline-block">
                    Visit VistaPrint.com →
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
