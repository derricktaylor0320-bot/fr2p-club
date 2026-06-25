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
  Rocket,
  CheckCircle,
  Clock,
  Shield,
  Users,
  DollarSign,
  Zap,
  Star,
  ArrowRight,
  AlertCircle,
  Heart,
  TrendingUp,
  CreditCard,
  Handshake,
  Brain,
  BarChart3,
} from "lucide-react";
import { Link } from "wouter";
import { getLoggedInMemberId } from "@/lib/auth";

const DEMO_USER_ID = getLoggedInMemberId();

export default function PocketBooster() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    loanAmount: "",
    purpose: "",
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
      toast({
        title: "You're on the list! 🚀",
        description: "We'll notify you the moment Pocket Booster launches.",
      });
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        variant: "destructive",
      });
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

  const loanTiers = [
    { amount: "$100", label: "Starter Boost", color: "border-emerald-400", use: "Cover a registration fee, restock a small item, or handle an urgent expense" },
    { amount: "$250", label: "Side Hustle Fuel", color: "border-blue-400", use: "Launch a social media ad campaign, buy supplies, or invest in a tool" },
    { amount: "$500", label: "Business Accelerator", color: "border-purple-400", use: "Restock inventory, build a website, or take a certification course" },
    { amount: "$1,000", label: "Growth Capital", color: "border-[#FFD700]", use: "Scale your business, cover a big opportunity, or bridge a cash gap" },
  ];

  const steps = [
    { icon: CheckCircle, title: "Join the Waitlist", desc: "Sign up below. FR2P members get priority access when we launch." },
    { icon: Shield, title: "Quick Review", desc: "No hard credit pull. We look at your FR2P membership status and community standing." },
    { icon: Zap, title: "Fast Decision", desc: "Get a yes or no in 24–48 hours. No waiting weeks for a bank to decide." },
    { icon: DollarSign, title: "Funds Released", desc: "Money hits your account fast. Use it for your business — no restrictions." },
  ];

  const benefits = [
    { icon: Shield, title: "No Hard Credit Pull", desc: "We don't run a hard inquiry that hurts your credit score." },
    { icon: Users, title: "Community-Backed", desc: "Loans funded by the FR2P community — people who want to see you win." },
    { icon: Zap, title: "Fast Decisions", desc: "24–48 hour approval window. No traditional bank delays." },
    { icon: Star, title: "FR2P Members First", desc: "Active members in good standing move to the front of the line." },
    { icon: TrendingUp, title: "Build Credit History", desc: "Responsible repayment is reported to help build your credit profile." },
    { icon: Heart, title: "Rooted in Brotherhood", desc: "This isn't a loan shark — it's your community investing in you." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001f3f] to-[#002855]">
      <HeaderNav user={memberData?.member || undefined} />

      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* Hero */}
        <div className="text-center mb-14">
          <Badge className="bg-emerald-500 text-white font-bold mb-4 text-sm px-4 py-1 animate-pulse">
            🚀 COMING SOON — PRE-LAUNCH WAITLIST OPEN
          </Badge>
          <div className="flex justify-center mb-6">
            <div className="bg-[#FFD700] rounded-full p-5 shadow-lg shadow-yellow-400/30">
              <Rocket className="h-12 w-12 text-[#001f3f]" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-[#FFD700] mb-4">
            Pocket Booster
          </h1>
          <p className="text-xl text-white/80 mb-2">
            Community-Backed Micro-Loans for Entrepreneurs
          </p>
          <p className="text-2xl font-bold text-white mb-6">
            $100 – $1,000 · No Hard Credit Pull · Fast Decisions
          </p>
          {countData && countData.count > 0 && (
            <p className="text-emerald-400 font-semibold text-lg">
              🔥 {countData.count} people already on the waitlist
            </p>
          )}
        </div>

        {/* What Is Pocket Booster */}
        <Card className="bg-[#002855] border border-[#FFD700]/40 mb-10">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <Badge className="bg-[#FFD700] text-[#001f3f] font-bold mb-4">WHAT IS POCKET BOOSTER?</Badge>
                <h2 className="text-3xl font-bold text-white mb-4">
                  The Capital Boost Your Community Has Your Back On
                </h2>
                <p className="text-white/80 text-lg leading-relaxed mb-4">
                  Pocket Booster is The FR2P Club's micro-loan program — designed for entrepreneurs and members of the Consolidatus Empire community who need a small financial push to launch, grow, or handle an opportunity.
                </p>
                <p className="text-white/80 leading-relaxed">
                  Banks say no. We say yes. If you're a member in good standing, your community is ready to invest in you. This isn't charity — it's calculated community trust.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  "Available exclusively to Consolidatus Empire members",
                  "Loan amounts from $100 to $1,000",
                  "No hard credit pull — soft review only",
                  "24–48 hour decision window",
                  "Repayment helps build your credit history",
                  "FR2P members in good standing get priority",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <p className="text-white/90">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loan Tiers */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-[#FFD700] text-center mb-2">Choose Your Boost</h2>
          <p className="text-white/70 text-center mb-8">Four tiers. One goal — get you moving.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {loanTiers.map((tier) => (
              <Card key={tier.amount} className={`bg-[#001f3f] border-2 ${tier.color} hover:scale-105 transition-transform`}>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-[#FFD700] mb-2">{tier.amount}</div>
                  <Badge className="bg-white/10 text-white mb-4 text-xs">{tier.label}</Badge>
                  <p className="text-white/70 text-sm leading-relaxed">{tier.use}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-[#FFD700] text-center mb-2">How It Works</h2>
          <p className="text-white/70 text-center mb-8">Simple. Fast. Community-powered.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="bg-[#FFD700] rounded-full p-4 mb-4 shadow-lg shadow-yellow-400/20">
                  <step.icon className="h-7 w-7 text-[#001f3f]" />
                </div>
                <div className="bg-[#FFD700] text-[#001f3f] rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm mb-2">{i + 1}</div>
                <h3 className="text-white font-bold mb-2">{step.title}</h3>
                <p className="text-white/70 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-[#FFD700] text-center mb-8">Why Pocket Booster?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((b, i) => (
              <Card key={i} className="bg-[#001f3f] border border-white/10 hover:border-[#FFD700]/40 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-[#FFD700]/10 rounded-lg p-2">
                      <b.icon className="h-5 w-5 text-[#FFD700]" />
                    </div>
                    <h3 className="text-white font-bold">{b.title}</h3>
                  </div>
                  <p className="text-white/70 text-sm">{b.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Eligibility */}
        <Card className="bg-[#001f3f] border border-[#FFD700]/30 mb-12">
          <CardHeader>
            <CardTitle className="text-[#FFD700] flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Who Qualifies?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-emerald-400 font-bold mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" /> You Likely Qualify If...
                </h3>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li>• Active FR2P Club member in good standing</li>
                  <li>• 60+ days as a paid member (same as commission eligibility)</li>
                  <li>• At least 2 consecutive payments completed</li>
                  <li>• Clear purpose for the loan (business or entrepreneurial)</li>
                  <li>• No history of default within the Consolidatus community</li>
                </ul>
              </div>
              <div>
                <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" /> Important Notes
                </h3>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li>• This is a pre-launch program — final terms set at launch</li>
                  <li>• Waitlist sign-up does NOT guarantee approval</li>
                  <li>• Repayment terms will be disclosed before acceptance</li>
                  <li>• Funds are for business/entrepreneurial use, not personal debt</li>
                  <li>• Pocket Booster is part of the Consolidatus Empire ecosystem</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Waitlist Form */}
        <div className="max-w-2xl mx-auto" id="waitlist">
          {submitted ? (
            <Card className="bg-[#001f3f] border-2 border-emerald-500">
              <CardContent className="p-10 text-center">
                <div className="bg-emerald-500 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-[#FFD700] mb-4">You're On The List! 🚀</h2>
                <p className="text-white/80 text-lg mb-4">
                  We'll send you an email the moment Pocket Booster goes live. You're among the first to know.
                </p>
                <p className="text-white/60 text-sm">
                  In the meantime, keep building your network in The FR2P Club — active members get priority when applications open.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-[#001f3f] border-2 border-[#FFD700]/50">
              <CardHeader className="text-center pb-2">
                <Badge className="bg-emerald-500 text-white w-fit mx-auto mb-3">JOIN THE WAITLIST — FREE</Badge>
                <CardTitle className="text-[#FFD700] text-3xl">Get Early Access</CardTitle>
                <p className="text-white/70">Be first in line when Pocket Booster launches. No commitment required.</p>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white/80 mb-2 block">First Name *</Label>
                      <Input
                        value={form.firstName}
                        onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                        placeholder="Derrick"
                        className="bg-[#002855] border-white/20 text-white placeholder:text-white/40"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-white/80 mb-2 block">Last Name</Label>
                      <Input
                        value={form.lastName}
                        onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                        placeholder="Taylor"
                        className="bg-[#002855] border-white/20 text-white placeholder:text-white/40"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-white/80 mb-2 block">Email Address *</Label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="you@email.com"
                      className="bg-[#002855] border-white/20 text-white placeholder:text-white/40"
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-white/80 mb-2 block">Phone (Optional)</Label>
                    <Input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="(555) 000-0000"
                      className="bg-[#002855] border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>

                  <div>
                    <Label className="text-white/80 mb-2 block">Loan Amount You're Interested In</Label>
                    <Select onValueChange={val => setForm(f => ({ ...f, loanAmount: val }))}>
                      <SelectTrigger className="bg-[#002855] border-white/20 text-white">
                        <SelectValue placeholder="Select an amount" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#002855] border-white/20 text-white">
                        <SelectItem value="$100">$100 — Starter Boost</SelectItem>
                        <SelectItem value="$250">$250 — Side Hustle Fuel</SelectItem>
                        <SelectItem value="$500">$500 — Business Accelerator</SelectItem>
                        <SelectItem value="$1,000">$1,000 — Growth Capital</SelectItem>
                        <SelectItem value="Not sure yet">Not sure yet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white/80 mb-2 block">What Would You Use It For? (Optional)</Label>
                    <Textarea
                      value={form.purpose}
                      onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))}
                      placeholder="e.g., Restock my KK Apparel inventory, run Facebook ads for my side hustle, pay for a certification course..."
                      className="bg-[#002855] border-white/20 text-white placeholder:text-white/40 min-h-[90px]"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={waitlistMutation.isPending}
                    className="w-full bg-[#FFD700] text-[#001f3f] hover:bg-yellow-400 font-bold py-4 text-lg rounded-xl flex items-center justify-center gap-2"
                  >
                    {waitlistMutation.isPending ? (
                      "Joining Waitlist..."
                    ) : (
                      <>
                        <Rocket className="h-5 w-5" />
                        Join the Pocket Booster Waitlist
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </Button>

                  <p className="text-white/50 text-xs text-center">
                    No credit card. No commitment. Just your spot in line. 
                    We'll email you when Pocket Booster launches.
                  </p>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pocket Booster Program Suite */}
        <div className="mt-12">
          <div className="text-center mb-6">
            <Badge className="bg-[#FFD700] text-[#001f3f] font-bold mb-3">POCKET BOOSTER PROGRAM SUITE</Badge>
            <h3 className="text-2xl font-bold text-white">More Than Just a Loan</h3>
            <p className="text-white/60 mt-2">Pocket Booster is a full financial acceleration ecosystem. Explore the tools built alongside it.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            <Card className="bg-[#001f3f] border-2 border-purple-500/50 hover:border-purple-400 transition-colors group">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-purple-500/20 rounded-lg p-2.5">
                    <Brain className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">AI Side Hustle Incubator</h4>
                    <Badge className="bg-purple-500/20 text-purple-300 text-xs">$1,000 · $2,500 · $5,000</Badge>
                  </div>
                </div>
                <p className="text-white/60 text-sm mb-4">
                  Invest in yourself. AI builds your business step by step — skill tracks, digital assets, automated income systems, and a 6–24 month growth roadmap.
                </p>
                <Link href="/hustle-incubator">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center justify-center gap-2">
                    Explore the Incubator <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-[#001f3f] border-2 border-emerald-500/50 hover:border-emerald-400 transition-colors group">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-emerald-500/20 rounded-lg p-2.5">
                    <BarChart3 className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">Investment Tracker</h4>
                    <Badge className="bg-emerald-500/20 text-emerald-300 text-xs">Back Office ROI Dashboard</Badge>
                  </div>
                </div>
                <p className="text-white/60 text-sm mb-4">
                  See exactly where your investment went, projected returns at 6/12/24 months, your phase timeline, and community win stories from real members.
                </p>
                <Link href="/investment-tracker">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2">
                    View My Tracker <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <div className="bg-[#001f3f] border border-[#FFD700]/20 rounded-2xl p-6 max-w-3xl mx-auto">
              <Handshake className="h-8 w-8 text-[#FFD700] mx-auto mb-3" />
              <h3 className="text-xl font-bold text-[#FFD700] mb-2">Part of the Consolidatus Empire</h3>
              <p className="text-white/60 text-sm">
                Pocket Booster sits under the Consolidatus Empire alongside The FR2P Club, Khomplete Khemistri Apparel, GuardConnect DMV, and Studio Business — one community, multiple ways to win.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
