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
const TCE_HOLDINGS_URL = "https://tceholdings.org";

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

const STEPS = ["Loan Details", "Employer Info", "Banking & Authorization"];

// ── Set to false when applications are officially open ──
const LOAN_PREVIEW_MODE = true;

const emptyLoanForm = {
  // Step 1
  firstName: "", lastName: "", email: "", phone: "",
  loanAmount: "", loanPurpose: "", repaymentSchedule: "",
  // Step 2
  employerName: "", employerAddress: "", employerPhone: "",
  hrContactName: "", hrContactEmail: "",
  jobTitle: "", employmentStartDate: "", payFrequency: "", nextPayDate: "",
  // Step 3
  bankName: "", routingNumber: "", accountNumber: "", accountType: "",
  authorizedDeduction: false,
};

export default function PocketBooster() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(emptyLoanForm);
  const set = (field: keyof typeof emptyLoanForm, val: string | boolean) =>
    setForm(f => ({ ...f, [field]: val }));

  const { data: memberData } = useQuery<MemberResponse>({
    queryKey: ["/api/member", DEMO_USER_ID],
  });

  const { data: countData } = useQuery<{ count: number }>({
    queryKey: ["/api/pocket-booster/waitlist-count"],
  });

  const applyMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/micro-loan/apply", {
        ...form,
        memberId: DEMO_USER_ID !== "fr2p-founder" ? DEMO_USER_ID : null,
        authorizedDeduction: form.authorizedDeduction,
      });
      return res.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({ title: "Application submitted! 🚀", description: "We'll review your application and contact you within 3–5 business days." });
    },
    onError: () => {
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
    },
  });

  const validateStep = () => {
    if (step === 0) {
      if (!form.firstName || !form.lastName || !form.email || !form.phone)
        return "Please fill in your name, email, and phone number.";
      if (!form.loanAmount) return "Please select a loan amount.";
      if (!form.loanPurpose) return "Please describe what you'll use the loan for.";
      if (!form.repaymentSchedule) return "Please choose a repayment schedule.";
    }
    if (step === 1) {
      if (!form.employerName || !form.employerAddress || !form.employerPhone)
        return "Please fill in your employer name, address, and phone.";
      if (!form.jobTitle || !form.employmentStartDate || !form.payFrequency || !form.nextPayDate)
        return "Please fill in your job title, start date, pay frequency, and next pay date.";
    }
    if (step === 2) {
      if (!form.bankName || !form.routingNumber || !form.accountNumber || !form.accountType)
        return "Please fill in all banking information.";
      if (!form.authorizedDeduction)
        return "You must authorize payroll deduction to proceed.";
    }
    return null;
  };

  const nextStep = () => {
    if (LOAN_PREVIEW_MODE) {
      if (step < 2) setStep(s => s + 1);
      return;
    }
    const err = validateStep();
    if (err) { toast({ title: "Missing information", description: err, variant: "destructive" }); return; }
    if (step < 2) setStep(s => s + 1);
    else applyMutation.mutate();
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
            Open to Everyone · Standalone at{" "}
            <a href={TCE_HOLDINGS_URL} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white underline underline-offset-2">
              TCE Holdings
            </a>
            {" "}· Also inside The FR2P Club · Built for the 9-to-5 worker ready to level up
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
            <Badge className="mb-3 px-5 py-1.5 text-sm font-bold text-black" style={{ background: TEAL }}>
              📋 APPLY NOW — PRE-LAUNCH
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2">Pocket Micro-Loan Program</h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Community-backed micro-loans from $100 to $1,000 — open to anyone, not just FR2P members.
              No hard credit pull. No FICO score needed. Repaid via payroll deduction — you choose your pay dates in the application.
            </p>
          </div>

          {/* Standalone access callout */}
          <div className="rounded-2xl p-5 mb-8 border flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left" style={{ background: `${TEAL}08`, borderColor: `${TEAL}30` }}>
            <div className="rounded-xl p-3 flex-shrink-0" style={{ background: `${TEAL}15` }}>
              <Unlock className="h-6 w-6" style={{ color: TEAL }} />
            </div>
            <div>
              <p className="text-white font-bold text-sm mb-1">Open to Everyone — No Membership Required</p>
              <p className="text-white/60 text-xs leading-relaxed">
                Access Pocket Booster directly through{" "}
                <a href={TCE_HOLDINGS_URL} target="_blank" rel="noopener noreferrer" className="text-white font-semibold hover:underline">
                  TCE Holdings
                </a>{" "}
                or from inside The FR2P Club.
                Same program, same experience — FR2P members simply get priority access as a membership perk.
              </p>
            </div>
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
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" /> Open to anyone — no FR2P Club membership required</li>
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" /> Steady employment with payroll deduction available</li>
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" /> Clear purpose for the loan — business or personal use</li>
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" /> No default history within the Consolidatus community</li>
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" /> Mobile phone + internet access (that's all you need)</li>
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-[#FFD700] flex-shrink-0 mt-0.5" /> FR2P members in good standing get priority access</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-amber-400 font-bold mb-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" /> Good to Know
                  </h3>
                  <ul className="space-y-2 text-white/70 text-sm">
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" /> Pre-launch — final terms set at launch</li>
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" /> Waitlist does NOT guarantee approval</li>
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" /> Funds can be used for business or personal needs</li>
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" /> All repayments via payroll deduction — select your pay dates in the application</li>
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" /> Pay early = better odds of advancing faster</li>
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" /> Max $1,000 now — may increase to $2,000 as momentum builds</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loan Application Form */}
          <div className="max-w-2xl mx-auto" id="waitlist">
            {submitted && !LOAN_PREVIEW_MODE ? (
              <Card className="bg-[#0d1f35] border-2 border-emerald-500 text-center">
                <CardContent className="p-10">
                  <div className="bg-emerald-500 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-black mb-3" style={{ color: TEAL }}>Application Submitted! 🚀</h2>
                  <p className="text-white/70 mb-3 leading-relaxed">
                    Your Pocket Micro-Loan application is in. We'll verify your employment and review your application within <strong className="text-white">3–5 business days</strong>.
                  </p>
                  <div className="bg-black/20 rounded-xl p-4 text-left space-y-2 mb-4">
                    <p className="text-white/60 text-sm flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" /> Employment verification call to your employer</p>
                    <p className="text-white/60 text-sm flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" /> Payroll deduction authorization on file</p>
                    <p className="text-white/60 text-sm flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" /> Decision sent to your email</p>
                  </div>
                  <p className="text-white/40 text-xs">
                    Your selected pay dates will be used to schedule payroll deductions. FR2P members with referrals may receive priority review.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-[#0d1f35] border-2" style={{ borderColor: LOAN_PREVIEW_MODE ? "rgba(255,215,0,0.4)" : `${TEAL}50` }}>

                {/* ── PREVIEW MODE BANNER ── */}
                {LOAN_PREVIEW_MODE && (
                  <div className="rounded-t-xl px-6 py-3 flex items-center justify-between gap-3" style={{ background: "linear-gradient(90deg, #FFD70020, #FFD70008)" }}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      <span className="text-amber-300 text-xs font-bold uppercase tracking-widest">Preview Mode — Coming Soon</span>
                    </div>
                    <span className="text-white/40 text-xs">Navigate freely — nothing is submitted</span>
                  </div>
                )}

                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-1">
                    <Badge className="text-black font-bold" style={{ background: LOAN_PREVIEW_MODE ? "#FFD700" : TEAL }}>
                      {LOAN_PREVIEW_MODE ? "🔒 COMING SOON" : "LOAN APPLICATION"}
                    </Badge>
                    <span className="text-white/40 text-xs">Step {step + 1} of {STEPS.length}</span>
                  </div>
                  <CardTitle className="text-white text-2xl font-black">{STEPS[step]}</CardTitle>

                  {/* Progress bar */}
                  <div className="flex gap-1.5 mt-3">
                    {STEPS.map((s, i) => (
                      <div key={s} className="flex-1 h-1.5 rounded-full overflow-hidden bg-white/10">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: i <= step ? "100%" : "0%", background: LOAN_PREVIEW_MODE ? "#FFD700" : TEAL }}
                        />
                      </div>
                    ))}
                  </div>
                </CardHeader>

                <CardContent className="p-6 pt-0">
                  <div className={`space-y-4 ${LOAN_PREVIEW_MODE ? "opacity-60 pointer-events-none select-none" : ""}`}>

                    {/* ── STEP 1: Loan Details ── */}
                    {step === 0 && <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-white/70 mb-1.5 block text-sm">First Name *</Label>
                          <Input value={form.firstName} onChange={e => set("firstName", e.target.value)}
                            placeholder="Derrick" className="bg-[#001520] border-white/20 text-white placeholder:text-white/30" />
                        </div>
                        <div>
                          <Label className="text-white/70 mb-1.5 block text-sm">Last Name *</Label>
                          <Input value={form.lastName} onChange={e => set("lastName", e.target.value)}
                            placeholder="Taylor" className="bg-[#001520] border-white/20 text-white placeholder:text-white/30" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-white/70 mb-1.5 block text-sm">Email Address *</Label>
                        <Input type="email" value={form.email} onChange={e => set("email", e.target.value)}
                          placeholder="you@email.com" className="bg-[#001520] border-white/20 text-white placeholder:text-white/30" />
                      </div>
                      <div>
                        <Label className="text-white/70 mb-1.5 block text-sm">Phone Number *</Label>
                        <Input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)}
                          placeholder="(555) 000-0000" className="bg-[#001520] border-white/20 text-white placeholder:text-white/30" />
                      </div>
                      <div>
                        <Label className="text-white/70 mb-1.5 block text-sm">Loan Amount *</Label>
                        <Select value={form.loanAmount} onValueChange={v => set("loanAmount", v)}>
                          <SelectTrigger className="bg-[#001520] border-white/20 text-white">
                            <SelectValue placeholder="Select an amount" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#001520] border-white/20 text-white">
                            <SelectItem value="$100">$100 — Starter Boost (1 month repayment)</SelectItem>
                            <SelectItem value="$250">$250 — Side Hustle Fuel (2 months repayment)</SelectItem>
                            <SelectItem value="$500">$500 — Business Accelerator (5 months repayment)</SelectItem>
                            <SelectItem value="$1,000">$1,000 — Growth Capital (must earn through trust ladder)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-white/70 mb-1.5 block text-sm">Repayment Schedule *</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {["$50/paycheck", "$100/paycheck"].map(opt => (
                            <button key={opt} type="button"
                              onClick={() => set("repaymentSchedule", opt)}
                              className={`rounded-xl border-2 p-4 text-center font-bold transition-all ${form.repaymentSchedule === opt ? "border-[#00C2CB] bg-[#00C2CB]/10 text-[#00C2CB]" : "border-white/20 text-white/60 hover:border-white/40"}`}>
                              {opt}
                              <div className="text-xs font-normal text-white/40 mt-1">per paycheck</div>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-white/70 mb-1.5 block text-sm">What will you use it for? (business or personal) *</Label>
                        <Textarea value={form.loanPurpose} onChange={e => set("loanPurpose", e.target.value)}
                          placeholder="e.g., Run ads for my side hustle, cover an unexpected bill, restock inventory, pay for a certification course..."
                          className="bg-[#001520] border-white/20 text-white placeholder:text-white/30 min-h-[80px]" />
                      </div>
                    </>}

                    {/* ── STEP 2: Employer Info ── */}
                    {step === 1 && <>
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-start gap-2 mb-2">
                        <Shield className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        <p className="text-amber-300 text-xs leading-relaxed">
                          We will call your employer to verify employment and tenure. This is how we guarantee repayment — no credit score required.
                        </p>
                      </div>
                      <div>
                        <Label className="text-white/70 mb-1.5 block text-sm">Employer / Company Name *</Label>
                        <Input value={form.employerName} onChange={e => set("employerName", e.target.value)}
                          placeholder="Acme Corp" className="bg-[#001520] border-white/20 text-white placeholder:text-white/30" />
                      </div>
                      <div>
                        <Label className="text-white/70 mb-1.5 block text-sm">Employer Address *</Label>
                        <Input value={form.employerAddress} onChange={e => set("employerAddress", e.target.value)}
                          placeholder="123 Main St, City, State 00000" className="bg-[#001520] border-white/20 text-white placeholder:text-white/30" />
                      </div>
                      <div>
                        <Label className="text-white/70 mb-1.5 block text-sm">Employer Phone Number *</Label>
                        <Input type="tel" value={form.employerPhone} onChange={e => set("employerPhone", e.target.value)}
                          placeholder="(555) 000-0000" className="bg-[#001520] border-white/20 text-white placeholder:text-white/30" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-white/70 mb-1.5 block text-sm">HR Contact Name (if known)</Label>
                          <Input value={form.hrContactName} onChange={e => set("hrContactName", e.target.value)}
                            placeholder="Jane Smith" className="bg-[#001520] border-white/20 text-white placeholder:text-white/30" />
                        </div>
                        <div>
                          <Label className="text-white/70 mb-1.5 block text-sm">HR Contact Email (if known)</Label>
                          <Input type="email" value={form.hrContactEmail} onChange={e => set("hrContactEmail", e.target.value)}
                            placeholder="hr@company.com" className="bg-[#001520] border-white/20 text-white placeholder:text-white/30" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-white/70 mb-1.5 block text-sm">Your Job Title *</Label>
                        <Input value={form.jobTitle} onChange={e => set("jobTitle", e.target.value)}
                          placeholder="e.g., Warehouse Associate, Nurse, Driver" className="bg-[#001520] border-white/20 text-white placeholder:text-white/30" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-white/70 mb-1.5 block text-sm">Employment Start Date *</Label>
                          <Input type="month" value={form.employmentStartDate} onChange={e => set("employmentStartDate", e.target.value)}
                            className="bg-[#001520] border-white/20 text-white" />
                        </div>
                        <div>
                          <Label className="text-white/70 mb-1.5 block text-sm">Pay Frequency *</Label>
                          <Select value={form.payFrequency} onValueChange={v => set("payFrequency", v)}>
                            <SelectTrigger className="bg-[#001520] border-white/20 text-white">
                              <SelectValue placeholder="How often paid?" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#001520] border-white/20 text-white">
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="biweekly">Bi-weekly (every 2 weeks)</SelectItem>
                              <SelectItem value="semimonthly">Semi-monthly (1st & 15th)</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-white/70 mb-1.5 block text-sm">Next Pay Date *</Label>
                        <Input type="date" value={form.nextPayDate} onChange={e => set("nextPayDate", e.target.value)}
                          className="bg-[#001520] border-white/20 text-white" />
                        <p className="text-white/40 text-xs mt-1.5">
                          Payroll deductions will align with your pay schedule. Select your upcoming pay date so we know when to deduct.
                        </p>
                      </div>
                    </>}

                    {/* ── STEP 3: Banking & Authorization ── */}
                    {step === 2 && <>
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 flex items-start gap-2 mb-2">
                        <Lock className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                        <p className="text-blue-300 text-xs leading-relaxed">
                          Your banking info is used solely to set up payroll deduction for loan repayment. It is stored securely and never shared.
                        </p>
                      </div>
                      <div>
                        <Label className="text-white/70 mb-1.5 block text-sm">Bank Name *</Label>
                        <Input value={form.bankName} onChange={e => set("bankName", e.target.value)}
                          placeholder="e.g., Chase, Wells Fargo, Bank of America" className="bg-[#001520] border-white/20 text-white placeholder:text-white/30" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-white/70 mb-1.5 block text-sm">Routing Number *</Label>
                          <Input value={form.routingNumber} onChange={e => set("routingNumber", e.target.value)}
                            placeholder="9-digit routing #" maxLength={9}
                            className="bg-[#001520] border-white/20 text-white placeholder:text-white/30 font-mono" />
                        </div>
                        <div>
                          <Label className="text-white/70 mb-1.5 block text-sm">Account Number *</Label>
                          <Input value={form.accountNumber} onChange={e => set("accountNumber", e.target.value)}
                            placeholder="Account number" className="bg-[#001520] border-white/20 text-white placeholder:text-white/30 font-mono" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-white/70 mb-1.5 block text-sm">Account Type *</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {["checking", "savings"].map(t => (
                            <button key={t} type="button"
                              onClick={() => set("accountType", t)}
                              className={`rounded-xl border-2 p-3 text-center font-bold capitalize transition-all ${form.accountType === t ? "border-[#00C2CB] bg-[#00C2CB]/10 text-[#00C2CB]" : "border-white/20 text-white/60 hover:border-white/40"}`}>
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Authorization */}
                      <div className="bg-[#001520] border-2 border-[#00C2CB]/40 rounded-xl p-5 mt-2">
                        <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                          <Shield className="h-5 w-5 text-[#00C2CB]" /> Payroll Deduction Authorization
                        </h3>
                        <p className="text-white/60 text-sm leading-relaxed mb-4">
                          By checking the box below, I <strong className="text-white">{form.firstName} {form.lastName}</strong> authorize Pocket Booster (a Consolidatus Empire company) to initiate payroll deductions 
                          of <strong className="text-white">{form.repaymentSchedule || "[repayment schedule]"}</strong> from my paycheck at <strong className="text-white">{form.employerName || "[employer]"}</strong>, 
                          deposited to the bank account provided above, until my loan of <strong className="text-white">{form.loanAmount || "[loan amount]"}</strong> is paid in full. 
                          I understand this authorization will be verified with my employer and that I must notify Pocket Booster of any employment changes.
                        </p>
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <div
                            onClick={() => set("authorizedDeduction", !form.authorizedDeduction)}
                            className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all cursor-pointer ${form.authorizedDeduction ? "border-[#00C2CB] bg-[#00C2CB]" : "border-white/40 group-hover:border-[#00C2CB]/60"}`}
                          >
                            {form.authorizedDeduction && <CheckCircle className="h-3 w-3 text-black" />}
                          </div>
                          <span className="text-white/80 text-sm leading-relaxed">
                            I authorize the payroll deduction described above and confirm all information provided is accurate and truthful.
                          </span>
                        </label>
                      </div>
                    </>}

                  </div>

                  {/* Navigation — always clickable, outside faded area */}
                  <div className="flex gap-3 pt-4">
                    {step > 0 && (
                      <Button type="button" variant="outline" onClick={() => setStep(s => s - 1)}
                        className="flex-1 border-white/20 text-white hover:bg-white/5">
                        ← Back
                      </Button>
                    )}
                    {LOAN_PREVIEW_MODE ? (
                      step < 2 ? (
                        <Button type="button" onClick={nextStep}
                          className="flex-1 font-black py-5 text-base text-black rounded-xl flex items-center justify-center gap-2"
                          style={{ background: TEAL }}>
                          Preview Next Step <ArrowRight className="h-4 w-4" />
                        </Button>
                      ) : (
                        <div className="flex-1 flex flex-col items-center gap-2">
                          <div className="w-full rounded-xl py-4 flex items-center justify-center gap-2 font-black text-base border-2 border-dashed border-amber-400/50 text-amber-300 bg-amber-400/5 cursor-not-allowed">
                            <Lock className="h-5 w-5" /> Applications Opening Soon
                          </div>
                          <p className="text-white/30 text-xs text-center">
                            Join the waitlist above to be notified the moment applications go live.
                          </p>
                        </div>
                      )
                    ) : (
                      <Button type="button" onClick={nextStep}
                        disabled={applyMutation.isPending}
                        className="flex-1 font-black py-5 text-base text-black rounded-xl flex items-center justify-center gap-2"
                        style={{ background: TEAL }}>
                        {applyMutation.isPending ? "Submitting..." : step < 2 ? (
                          <>Next: {STEPS[step + 1]} <ArrowRight className="h-4 w-4" /></>
                        ) : (
                          <><Shield className="h-5 w-5" /> Submit Application</>
                        )}
                      </Button>
                    )}
                  </div>

                  {!LOAN_PREVIEW_MODE && (
                    <p className="text-white/30 text-xs text-center pt-2">
                      {step === 2
                        ? "Submitting this application does not guarantee approval. We will contact you within 3–5 business days."
                        : "Your information is kept confidential and used only for loan processing."}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* ── EMPIRE FOOTER ── */}
        <div className="rounded-2xl p-8 border text-center" style={{ background: `${TEAL}08`, borderColor: `${TEAL}20` }}>
          <Handshake className="h-8 w-8 mx-auto mb-3" style={{ color: TEAL }} />
          <h3 className="text-white font-black text-xl mb-2">Standalone at TCE Holdings · Part of the Consolidatus Empire</h3>
          <p className="text-white/50 text-sm max-w-2xl mx-auto mb-5">
            Pocket Booster is open to anyone through{" "}
            <a href={TCE_HOLDINGS_URL} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white underline underline-offset-2">
              TCE Holdings
            </a>
            {" "}— no membership required.
            It also lives inside The FR2P Club as a member benefit, with priority access for active members.
            One program, two ways in. Multiple paths to prosperity.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href={TCE_HOLDINGS_URL} target="_blank" rel="noopener noreferrer">
              <Badge className="bg-white/5 text-white/60 border border-white/10 px-4 py-1.5 hover:bg-white/10 cursor-pointer">TCE Holdings</Badge>
            </a>
            <Link href="/"><Badge className="bg-white/5 text-white/60 border border-white/10 px-4 py-1.5 hover:bg-white/10 cursor-pointer">The FR2P Club</Badge></Link>
            <a href={TCE_HOLDINGS_URL} target="_blank" rel="noopener noreferrer">
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
