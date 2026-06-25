import { HeaderNav } from "@/components/ui/header-nav";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { MemberResponse } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import {
  Rocket, CheckCircle, Clock, Shield, Users, DollarSign, Zap, Star,
  ArrowRight, AlertCircle, TrendingUp, CreditCard, Handshake,
  Brain, BarChart3, ChevronRight, Gift, Crown, Lock, Unlock,
} from "lucide-react";
import { Link } from "wouter";
import { getLoggedInMemberId } from "@/lib/auth";

const DEMO_USER_ID = getLoggedInMemberId();

const TEAL = "#00C2CB";
const TEAL_DARK = "#008F96";

const loanLadder = [
  {
    amount: "$100",
    label: "Starter Boost",
    repayTimes: 2,
    repayMonths: 1,
    monthly: "$50/mo",
    color: "border-emerald-400",
    bg: "bg-emerald-400/10",
    textColor: "text-emerald-400",
    use: "Registration fees, small restock, urgent business need",
    unlocks: "$250",
  },
  {
    amount: "$250",
    label: "Side Hustle Fuel",
    repayTimes: 2,
    repayMonths: 2,
    monthly: "$125/mo",
    color: "border-cyan-400",
    bg: "bg-cyan-400/10",
    textColor: "text-cyan-400",
    use: "Social media ads, supplies, a tool you need to grow",
    unlocks: "$500",
  },
  {
    amount: "$500",
    label: "Business Accelerator",
    repayTimes: 2,
    repayMonths: 5,
    monthly: "$100/mo",
    color: "border-purple-400",
    bg: "bg-purple-400/10",
    textColor: "text-purple-400",
    use: "Inventory restock, website build, certification course",
    unlocks: "$1,000",
  },
  {
    amount: "$1,000",
    label: "Growth Capital",
    repayTimes: 1,
    repayMonths: null,
    monthly: "Terms set at approval",
    color: "border-[#FFD700]",
    bg: "bg-[#FFD700]/10",
    textColor: "text-[#FFD700]",
    use: "Scale your business, bridge a cash gap, seize a big opportunity",
    unlocks: null,
  },
];

export default function PocketBooster() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", loanAmount: "", purpose: "",
  });

  const { data: memberData } = useQuery<MemberResponse>({
    queryKey: ["/api/member", DEMO_USER_ID],
  });

  const { data: countData } = useQuery<{ count: number }>({
    queryKey: ["/api/pocket-booster/waitlist-count"],
  });

  const waitlistMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const res = await apiRequest("POST", "/api/pocket-booster/waitlist", {
        ...data,
        memberId: DEMO_USER_ID !== "fr2p-founder" ? DEMO_USER_ID : null,
      });
      return res.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({ title: "You're on the list! 🚀", description: "We'll notify you the moment Pocket Booster launches." });
    },
    onError: () => {
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.email) {
      toast({ title: "Required fields missing", description: "Please enter your name and email.", variant: "destructive" });
      return;
    }
    waitlistMutation.mutate(form);
  };

  return (
    <div className="min-h-screen bg-[#001520]">
      <HeaderNav user={memberData?.member || undefined} />

      {/* ── BRAND HEADER ── */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #001520 0%, #002040 50%, #001520 100%)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ background: TEAL }} />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-8" style={{ background: TEAL }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-14 text-center">
          {/* Sub-brand badge */}
          <div className="inline-flex items-center gap-2 border rounded-full px-4 py-1.5 mb-6 text-xs font-semibold tracking-widest uppercase" style={{ borderColor: `${TEAL}40`, color: TEAL }}>
            <Building2Icon /> A Consolidatus Empire Company
          </div>

          {/* Logo */}
          <div className="flex justify-center mb-5">
            <div className="rounded-2xl p-5 shadow-2xl" style={{ background: `${TEAL}20`, border: `2px solid ${TEAL}60`, boxShadow: `0 0 40px ${TEAL}30` }}>
              <Rocket className="h-14 w-14" style={{ color: TEAL }} />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-3" style={{ color: TEAL }}>
            Pocket Booster
          </h1>
          <p className="text-xl text-white/70 mb-2 font-medium">Your Financial Acceleration Ecosystem</p>
          <p className="text-white/50 text-sm mb-8 max-w-xl mx-auto">
            Inside The FR2P Club · Powered by Consolidatus Empire · Built for the 9-to-5 worker ready to level up
          </p>

          {/* Two CTAs */}
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#available-now">
              <Button size="lg" className="font-bold text-black px-8" style={{ background: TEAL }}>
                Start Now — Tools Available <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </a>
            <a href="#micro-loan">
              <Button size="lg" variant="outline" className="font-bold px-8" style={{ borderColor: `${TEAL}50`, color: TEAL }}>
                Micro-Loan Waitlist
              </Button>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-16">

        {/* ── MISSION STATEMENT ── */}
        <div className="text-center py-10 border-b border-white/5 mb-12">
          <p className="text-white/80 text-lg max-w-3xl mx-auto leading-relaxed italic">
            "All you need is a mobile phone and internet access — it doesn't matter where you are. 
            I build six-figure programs for the people who look like they don't deserve the opportunity. 
            Because they do."
          </p>
          <p className="text-sm mt-3 font-semibold" style={{ color: TEAL }}>— Derrick Taylor, Founder · Consolidatus Empire</p>
        </div>

        {/* ══════════════════════════════════════════
            SECTION 1 — AVAILABLE NOW
        ══════════════════════════════════════════ */}
        <div id="available-now" className="mb-16">
          <div className="text-center mb-8">
            <Badge className="text-black font-bold mb-3 px-5 py-1.5 text-sm" style={{ background: TEAL }}>
              ✅ AVAILABLE RIGHT NOW
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2">Start Your Journey Today</h2>
            <p className="text-white/60 max-w-xl mx-auto">
              No waiting. These two tools are live inside your FR2P back office. 
              Invest in your skills, track your ROI, and get paid.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Incubator card */}
            <Card className="bg-[#0d1f35] border-2 border-purple-500/50 hover:border-purple-400 transition-all hover:shadow-lg hover:shadow-purple-500/10 group">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-5">
                  <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-3.5">
                    <Brain className="h-8 w-8 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-black text-xl">AI Side Hustle Incubator</h3>
                    <p className="text-purple-400 text-sm font-semibold">Pocket Booster · Investment Program</p>
                  </div>
                </div>

                <p className="text-white/70 mb-5 leading-relaxed">
                  Choose your investment level, pick your skill track, and let AI guide you step by step to building 
                  real income. Digital assets, automated systems, 24-month roadmap — all included.
                </p>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[["$1,000", "Starter"], ["$2,500", "Builder"], ["$5,000", "Accelerator"]].map(([amt, label]) => (
                    <div key={amt} className="text-center bg-purple-500/10 border border-purple-500/20 rounded-lg p-2.5">
                      <div className="text-purple-300 font-black text-lg">{amt}</div>
                      <div className="text-white/50 text-xs">{label}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 mb-6 text-sm">
                  {["6 AI-powered skill tracks", "Digital asset creation included", "6-track income diversification", "Community Win Board access"].map(item => (
                    <div key={item} className="flex items-center gap-2 text-white/70">
                      <CheckCircle className="h-3.5 w-3.5 text-purple-400 flex-shrink-0" /> {item}
                    </div>
                  ))}
                </div>

                <Link href="/hustle-incubator">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-5 text-base group-hover:shadow-lg group-hover:shadow-purple-500/20 transition-all flex items-center justify-center gap-2">
                    Explore the Incubator <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Tracker card */}
            <Card className="bg-[#0d1f35] border-2 border-emerald-500/50 hover:border-emerald-400 transition-all hover:shadow-lg hover:shadow-emerald-500/10 group">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-5">
                  <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-3.5">
                    <BarChart3 className="h-8 w-8 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-black text-xl">Investment Tracker</h3>
                    <p className="text-emerald-400 text-sm font-semibold">Pocket Booster · Back Office Dashboard</p>
                  </div>
                </div>

                <p className="text-white/70 mb-5 leading-relaxed">
                  Your personal ROI dashboard. See exactly where your money went, calculate your breakeven point, 
                  track your phase progress, and see real wins from the community.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[["Skill ROI", "Calculator"], ["Fund", "Allocation"], ["Phase", "Timeline"], ["Win", "Board"]].map(([top, bot]) => (
                    <div key={top} className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2.5 text-center">
                      <div className="text-emerald-300 font-bold text-sm">{top}</div>
                      <div className="text-white/50 text-xs">{bot}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 mb-6 text-sm">
                  {["Month 1–24 earnings projection", "Hours/week slider calculator", "6 skill tracks with rate data", "Community success stories"].map(item => (
                    <div key={item} className="flex items-center gap-2 text-white/70">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" /> {item}
                    </div>
                  ))}
                </div>

                <Link href="/investment-tracker">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 text-base group-hover:shadow-lg group-hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2">
                    Open My Tracker <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            SECTION 2 — MICRO-LOAN (COMING SOON)
        ══════════════════════════════════════════ */}
        <div id="micro-loan" className="mb-16">

          {/* Section header */}
          <div className="text-center mb-10">
            <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/40 mb-3 px-5 py-1.5 text-sm font-bold">
              🕐 COMING SOON — WAITLIST OPEN
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2">Pocket Micro-Loan Program</h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Community-backed micro-loans from $100 to $1,000. No hard credit pull. 
              Built on trust — you earn your way to bigger amounts by showing us you can pay back.
            </p>
          </div>

          {/* Philosophy banner */}
          <div className="rounded-2xl p-6 mb-10 border" style={{ background: `${TEAL}08`, borderColor: `${TEAL}30` }}>
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="rounded-xl p-3 flex-shrink-0" style={{ background: `${TEAL}15` }}>
                <Handshake className="h-7 w-7" style={{ color: TEAL }} />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">Building Trust. Building Credit.</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  You borrow $100, you pay it back twice — you move to $250. You borrow $250, pay it back twice — you move to $500. 
                  This isn't charity. It's a track record. The faster you pay back, the better your odds of reaching $1,000. 
                  We're separating the curious from the serious.
                </p>
              </div>
            </div>
          </div>

          {/* Trust Ladder */}
          <h3 className="text-2xl font-black text-white text-center mb-6">The Trust Ladder</h3>
          <div className="space-y-4 mb-12">
            {loanLadder.map((tier, i) => (
              <div key={tier.amount} className={`rounded-2xl border-2 ${tier.color} ${tier.bg} p-5 md:p-6`}>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Step number + amount */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full border-2 ${tier.color} flex items-center justify-center font-black text-lg ${tier.textColor}`}>
                      {i + 1}
                    </div>
                    <div>
                      <div className={`text-3xl font-black ${tier.textColor}`}>{tier.amount}</div>
                      <div className="text-white/60 text-xs font-semibold uppercase tracking-wider">{tier.label}</div>
                    </div>
                  </div>

                  {/* Repayment terms */}
                  <div className="flex-grow grid sm:grid-cols-3 gap-3">
                    <div className="bg-black/20 rounded-xl p-3 text-center">
                      <div className="text-white/50 text-xs mb-1">Pay Back</div>
                      <div className="text-white font-bold">{tier.repayTimes}× to advance</div>
                    </div>
                    <div className="bg-black/20 rounded-xl p-3 text-center">
                      <div className="text-white/50 text-xs mb-1">Repayment Window</div>
                      <div className="text-white font-bold">
                        {tier.repayMonths ? `${tier.repayMonths} month${tier.repayMonths > 1 ? "s" : ""}` : "Set at approval"}
                      </div>
                    </div>
                    <div className="bg-black/20 rounded-xl p-3 text-center">
                      <div className="text-white/50 text-xs mb-1">Best For</div>
                      <div className="text-white font-bold text-xs leading-tight">{tier.use.split(",")[0]}</div>
                    </div>
                  </div>

                  {/* Unlocks arrow */}
                  {tier.unlocks && (
                    <div className="flex-shrink-0 flex flex-col items-center gap-1 text-center">
                      <Unlock className="h-4 w-4 text-white/40" />
                      <div className="text-white/40 text-xs">Unlocks</div>
                      <div className={`font-black text-lg ${loanLadder[i + 1]?.textColor}`}>{tier.unlocks}</div>
                    </div>
                  )}
                  {!tier.unlocks && (
                    <div className="flex-shrink-0 flex flex-col items-center gap-1 text-center">
                      <Crown className="h-5 w-5 text-[#FFD700]" />
                      <div className="text-[#FFD700] text-xs font-bold">Max Tier</div>
                    </div>
                  )}
                </div>

                {/* Pro tip for fast payers */}
                <div className="mt-3 flex items-center gap-2 text-xs text-white/50">
                  <Zap className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
                  <span>Pay early? Your odds of advancing faster — and eventually reaching $1,000 — go up significantly.</span>
                </div>
              </div>
            ))}
          </div>

          {/* Affiliate Program */}
          <Card className="bg-[#0d1f35] border-2 mb-10" style={{ borderColor: `${TEAL}50` }}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3" style={{ color: TEAL }}>
                <div className="rounded-lg p-2" style={{ background: `${TEAL}20` }}>
                  <Gift className="h-5 w-5" style={{ color: TEAL }} />
                </div>
                Pocket Booster Affiliate Program
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-white font-bold text-lg mb-3">Refer People. Save on Your Loan.</h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-4">
                    Every person you refer to Pocket Booster earns you <span className="text-white font-bold">$10 off your loan amount</span>. 
                    Refer 5 people? That's $50 off your next loan. 
                    Refer 10 people? That's $100 off — and you've basically funded your $100 starter loan for free.
                  </p>
                  <div className="space-y-2">
                    {[
                      { refs: "1 referral", saves: "$10 off your loan" },
                      { refs: "5 referrals", saves: "$50 off your loan" },
                      { refs: "10 referrals", saves: "$100 off your loan" },
                    ].map(r => (
                      <div key={r.refs} className="flex justify-between items-center bg-black/20 rounded-lg px-4 py-2.5">
                        <span className="text-white/70 text-sm font-medium">{r.refs}</span>
                        <span className="font-bold text-sm" style={{ color: TEAL }}>{r.saves}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-bold text-lg mb-3">High Referrers Get Noticed</h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-4">
                    If you're consistently referring people into Pocket Booster, Derrick personally wants to know who you are. 
                    That kind of sales ability is rare — and it's exactly the type of person he's looking for to join the 
                    <span className="text-white font-bold"> administrative team</span>.
                  </p>
                  <div className="rounded-xl p-4 border" style={{ background: `${TEAL}10`, borderColor: `${TEAL}30` }}>
                    <div className="flex items-start gap-3">
                      <Star className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: TEAL }} />
                      <div>
                        <p className="text-white font-semibold text-sm mb-1">Path to the Admin Team</p>
                        <p className="text-white/60 text-xs leading-relaxed">
                          Pocket Booster's affiliate side has six-figure income potential on its own. 
                          Top referrers aren't just saving money — they're building a track record that 
                          opens doors to working directly with the company.
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-white/40 text-xs mt-3 italic">
                    * Affiliate referral discounts applied at loan approval. Full terms set at launch.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Who Qualifies */}
          <Card className="bg-[#0d1f35] border border-white/10 mb-10">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[#FFD700]" /> Who Qualifies?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-emerald-400 font-bold mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" /> You Likely Qualify If...
                  </h3>
                  <ul className="space-y-2 text-white/70 text-sm">
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" /> Active FR2P Club member in good standing</li>
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" /> 60+ days as a paid member (2 consecutive payments)</li>
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" /> Clear entrepreneurial purpose for the loan</li>
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" /> No default history within the Consolidatus community</li>
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" /> Mobile phone + internet access (that's all you need)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-amber-400 font-bold mb-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" /> Good to Know
                  </h3>
                  <ul className="space-y-2 text-white/70 text-sm">
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" /> Pre-launch — final terms set at launch</li>
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" /> Waitlist does NOT guarantee approval</li>
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" /> Funds are for business use, not personal debt</li>
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" /> Pay early = better odds of advancing faster</li>
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" /> Max $1,000 now — may increase to $2,000 as momentum builds</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Waitlist Form */}
          <div className="max-w-2xl mx-auto" id="waitlist">
            {submitted ? (
              <Card className="bg-[#0d1f35] border-2 border-emerald-500 text-center">
                <CardContent className="p-10">
                  <div className="bg-emerald-500 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-black mb-3" style={{ color: TEAL }}>You're On The List! 🚀</h2>
                  <p className="text-white/70 mb-2">We'll send you an email the moment Pocket Booster goes live.</p>
                  <p className="text-white/50 text-sm">
                    Keep building your FR2P network in the meantime — active members with more referrals move to the front of the line.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-[#0d1f35] border-2" style={{ borderColor: `${TEAL}50` }}>
                <CardHeader className="text-center pb-2">
                  <Badge className="text-black font-bold w-fit mx-auto mb-3" style={{ background: TEAL }}>
                    JOIN THE WAITLIST — FREE
                  </Badge>
                  <CardTitle className="text-white text-2xl font-black">Get Early Access</CardTitle>
                  {countData && countData.count > 0 && (
                    <p className="text-emerald-400 font-semibold text-sm">🔥 {countData.count} people already waiting</p>
                  )}
                  <p className="text-white/60 text-sm">Be first in line when Pocket Booster launches. No commitment required.</p>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white/70 mb-1.5 block text-sm">First Name *</Label>
                        <Input value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                          placeholder="Derrick" className="bg-[#001520] border-white/20 text-white placeholder:text-white/30" required />
                      </div>
                      <div>
                        <Label className="text-white/70 mb-1.5 block text-sm">Last Name</Label>
                        <Input value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                          placeholder="Taylor" className="bg-[#001520] border-white/20 text-white placeholder:text-white/30" />
                      </div>
                    </div>

                    <div>
                      <Label className="text-white/70 mb-1.5 block text-sm">Email Address *</Label>
                      <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="you@email.com" className="bg-[#001520] border-white/20 text-white placeholder:text-white/30" required />
                    </div>

                    <div>
                      <Label className="text-white/70 mb-1.5 block text-sm">Phone (Optional)</Label>
                      <Input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="(555) 000-0000" className="bg-[#001520] border-white/20 text-white placeholder:text-white/30" />
                    </div>

                    <div>
                      <Label className="text-white/70 mb-1.5 block text-sm">Loan Amount You're Interested In</Label>
                      <Select onValueChange={val => setForm(f => ({ ...f, loanAmount: val }))}>
                        <SelectTrigger className="bg-[#001520] border-white/20 text-white">
                          <SelectValue placeholder="Select an amount" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#001520] border-white/20 text-white">
                          <SelectItem value="$100">$100 — Starter Boost (1 month repayment)</SelectItem>
                          <SelectItem value="$250">$250 — Side Hustle Fuel (2 months repayment)</SelectItem>
                          <SelectItem value="$500">$500 — Business Accelerator (5 months repayment)</SelectItem>
                          <SelectItem value="$1,000">$1,000 — Growth Capital (must earn it)</SelectItem>
                          <SelectItem value="Not sure yet">Not sure yet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-white/70 mb-1.5 block text-sm">What Would You Use It For?</Label>
                      <Textarea value={form.purpose} onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))}
                        placeholder="e.g., Run ads for my side hustle, restock inventory, pay for a certification..."
                        className="bg-[#001520] border-white/20 text-white placeholder:text-white/30 min-h-[80px]" />
                    </div>

                    <Button type="submit" disabled={waitlistMutation.isPending}
                      className="w-full font-black py-5 text-base text-black rounded-xl flex items-center justify-center gap-2"
                      style={{ background: TEAL }}>
                      {waitlistMutation.isPending ? "Joining..." : (
                        <><Rocket className="h-5 w-5" /> Join the Pocket Booster Waitlist <ArrowRight className="h-4 w-4" /></>
                      )}
                    </Button>

                    <p className="text-white/40 text-xs text-center">
                      No credit card. No commitment. Just your spot in line.
                    </p>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* ── EMPIRE FOOTER ── */}
        <div className="rounded-2xl p-8 border text-center" style={{ background: `${TEAL}08`, borderColor: `${TEAL}20` }}>
          <Handshake className="h-8 w-8 mx-auto mb-3" style={{ color: TEAL }} />
          <h3 className="text-white font-black text-xl mb-2">Part of the Consolidatus Empire</h3>
          <p className="text-white/50 text-sm max-w-2xl mx-auto mb-5">
            Pocket Booster lives inside The FR2P Club but operates as its own brand — 
            alongside Khomplete Khemistri Apparel, GuardConnect DMV Security, and Studio Business. 
            One community. Multiple paths to prosperity.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/"><Badge className="bg-white/5 text-white/60 border border-white/10 px-4 py-1.5 hover:bg-white/10 cursor-pointer">The FR2P Club</Badge></Link>
            <a href="https://khomplete-khemistri-apparel.up.railway.app" target="_blank" rel="noopener noreferrer">
              <Badge className="bg-white/5 text-white/60 border border-white/10 px-4 py-1.5 hover:bg-white/10 cursor-pointer">KK Apparel</Badge>
            </a>
            <Link href="/empire"><Badge className="bg-white/5 text-white/60 border border-white/10 px-4 py-1.5 hover:bg-white/10 cursor-pointer">Empire Hub</Badge></Link>
          </div>
        </div>

      </div>
    </div>
  );
}

function Building2Icon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>
    </svg>
  );
}
