import { HeaderNav } from "@/components/ui/header-nav";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { MemberResponse } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import {
  Brain,
  Rocket,
  CheckCircle,
  Star,
  ArrowRight,
  Zap,
  Users,
  TrendingUp,
  Target,
  DollarSign,
  BookOpen,
  Crown,
  BarChart3,
  Lightbulb,
  Shield,
  Clock,
  Play,
  Award,
  Layers,
} from "lucide-react";
import { getLoggedInMemberId } from "@/lib/auth";

const DEMO_USER_ID = getLoggedInMemberId();

const tiers = [
  {
    name: "Basic",
    price: "$1,000",
    label: "Starter Investor",
    timeline: "6–12 months",
    color: "border-blue-400",
    badgeColor: "bg-blue-500",
    highlight: false,
    tagline: "For beginners ready to start earning",
    features: [
      "AI-powered business builder",
      "1 skill track (digital marketing, AI automation, or content creation)",
      "Landing page, ad & offer templates",
      "Weekly group coaching sessions",
      "FR2P community access",
      "6-month growth roadmap",
      "Income calculator & projections",
    ],
  },
  {
    name: "Growth",
    price: "$2,500",
    label: "Scale Investor",
    timeline: "6–18 months",
    color: "border-[#FFD700]",
    badgeColor: "bg-[#FFD700] text-[#001f3f]",
    highlight: true,
    tagline: "For people ready to scale fast",
    features: [
      "Everything in Basic",
      "3 skill tracks (your choice)",
      "Automated affiliate funnels",
      "Digital product builder",
      "Personalized 90-day action plan",
      "Monthly 1-on-1 coaching session",
      "Access to premium AI tools",
      "12-month growth roadmap",
    ],
  },
  {
    name: "Elite",
    price: "$5,000",
    label: "Elite Investor",
    timeline: "12–24 months",
    color: "border-purple-500",
    badgeColor: "bg-purple-600",
    highlight: false,
    tagline: "For serious wealth builders",
    features: [
      "All skill tracks — unlimited",
      "Done-with-you business setup",
      "AI business automation suite",
      "Private mastermind group",
      "Revenue-tracking dashboard",
      "Priority 1-on-1 coaching",
      "Annual virtual summit access",
      "24-month roadmap with check-ins",
    ],
  },
];

const skillTracks = [
  { icon: Brain, name: "AI Automation", desc: "Build systems that work while you sleep using AI tools" },
  { icon: Target, name: "Digital Marketing", desc: "Ads, funnels, SEO — drive traffic that converts to cash" },
  { icon: Play, name: "Content Creation", desc: "Monetize your voice, face, or pen across platforms" },
  { icon: Layers, name: "Affiliate Marketing", desc: "Earn commissions promoting products you believe in" },
  { icon: BookOpen, name: "Digital Products", desc: "Create once, sell forever — ebooks, courses, templates" },
  { icon: BarChart3, name: "E-commerce & Drop-shipping", desc: "Sell physical or digital goods without holding inventory" },
];

const appFeatures = [
  { icon: Brain, title: "AI Business Builder", desc: "Step-by-step AI guides you through building your side hustle from scratch — no experience needed." },
  { icon: TrendingUp, title: "Income Projection Calculator", desc: "See your 6, 12, and 24-month earning potential before you invest a single dollar." },
  { icon: Layers, title: "Digital Product Studio", desc: "Create ebooks, templates, mini-courses, and digital assets directly inside the app." },
  { icon: Target, title: "Affiliate Marketplace", desc: "Browse and join affiliate programs that match your niche and audience." },
  { icon: Users, title: "Community Accountability", desc: "Join weekly challenges, share wins, and stay on track with a community that's building right alongside you." },
  { icon: Award, title: "Progress & Milestone Tracking", desc: "Track your skill level, completed modules, and earnings milestones with visual dashboards." },
  { icon: Lightbulb, title: "Weekly Wealth Lessons", desc: "Bite-sized lessons on money, mindset, marketing, and momentum — delivered every week." },
  { icon: Shield, title: "Business Templates Vault", desc: "Hundreds of plug-and-play templates for landing pages, email sequences, social posts, and offers." },
];

const timeline = [
  { month: "Month 1–2", milestone: "Foundation", desc: "Complete your skill track onboarding. Build your AI-powered business profile. Choose your income model.", color: "bg-blue-500" },
  { month: "Month 3–4", milestone: "Build", desc: "Create your first digital asset or funnel. Launch your affiliate setup. Get your first traffic flowing.", color: "bg-emerald-500" },
  { month: "Month 5–6", milestone: "Earn", desc: "First revenue milestone. Optimize what's working. Add a second income stream.", color: "bg-[#FFD700]" },
  { month: "Month 7–12", milestone: "Scale", desc: "Automate your systems. Expand to new platforms. Hit your 12-month income goal.", color: "bg-purple-500" },
  { month: "Month 13–24", milestone: "Multiply", desc: "Reinvest profits. Add team members. Build real, lasting wealth.", color: "bg-orange-500" },
];

export default function HustleIncubator() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [selectedTier, setSelectedTier] = useState("");
  const [form, setForm] = useState({ firstName: "", email: "", tier: "", track: "" });

  const { data: memberData } = useQuery<MemberResponse>({
    queryKey: ["/api/member", DEMO_USER_ID],
  });

  const waitlistMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const res = await apiRequest("POST", "/api/hustle-incubator/waitlist", data);
      return res.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({ title: "You're in! 🔥", description: "We'll notify you when the incubator opens." });
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
    <div className="min-h-screen bg-gradient-to-b from-[#001f3f] to-[#002855]">
      <HeaderNav user={memberData?.member || undefined} />

      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* Hero */}
        <div className="text-center mb-16">
          <Badge className="bg-purple-600 text-white font-bold mb-4 text-sm px-4 py-1 animate-pulse">
            🔥 COMING SOON — FOUNDING MEMBER WAITLIST OPEN
          </Badge>
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="bg-gradient-to-br from-[#FFD700] to-orange-400 rounded-full p-5 shadow-xl shadow-yellow-400/30">
                <Brain className="h-14 w-14 text-[#001f3f]" />
              </div>
              <div className="absolute -top-1 -right-1 bg-purple-500 rounded-full p-1.5">
                <Zap className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-[#FFD700] mb-4 leading-tight">
            FR2P AI-Powered<br />Side Hustle Incubator
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-4 max-w-3xl mx-auto">
            You're not investing in us — you're investing in <span className="text-[#FFD700] font-bold">your own ability to earn more.</span>
          </p>
          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
            AI builds your business step by step. You learn the skills. You own the assets. You keep the income.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-4 py-2 text-sm">$1,000 · $2,500 · $5,000</Badge>
            <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-4 py-2 text-sm">6–24 Month Roadmaps</Badge>
            <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-4 py-2 text-sm">AI-Powered Tools</Badge>
            <Badge className="bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30 px-4 py-2 text-sm">Skill Tracks + Coaching</Badge>
          </div>
          <Button
            onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-[#FFD700] text-[#001f3f] hover:bg-yellow-400 font-bold px-8 py-4 text-lg rounded-xl"
          >
            Join the Founding Member Waitlist <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Core Idea */}
        <Card className="bg-[#001f3f] border border-[#FFD700]/40 mb-14">
          <CardContent className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <Badge className="bg-[#FFD700] text-[#001f3f] font-bold mb-4">THE CORE IDEA</Badge>
                <h2 className="text-3xl font-bold text-white mb-5">
                  A Wealth-Building Machine Powered by AI
                </h2>
                <p className="text-white/80 text-lg leading-relaxed mb-4">
                  Ordinary people don't lack ambition — they lack systems, skills, and someone to show them the roadmap. That's exactly what the FR2P Side Hustle Incubator delivers.
                </p>
                <p className="text-white/70 leading-relaxed">
                  AI builds your business step by step. Skill tracks teach you to earn faster. Community keeps you accountable. And you own everything you build.
                </p>
              </div>
              <div className="space-y-4">
                {[
                  { icon: Brain, label: "AI-Powered Skill Training", color: "text-purple-400" },
                  { icon: Layers, label: "Digital Asset Creation Tools", color: "text-blue-400" },
                  { icon: Target, label: "Automated Income Systems", color: "text-emerald-400" },
                  { icon: Users, label: "Community Accountability", color: "text-orange-400" },
                  { icon: TrendingUp, label: "6–24 Month Growth Roadmaps", color: "text-[#FFD700]" },
                  { icon: BarChart3, label: "Revenue Tracking Dashboard", color: "text-pink-400" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-[#002855] rounded-lg px-4 py-3">
                    <item.icon className={`h-5 w-5 ${item.color} flex-shrink-0`} />
                    <span className="text-white font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tier Structure */}
        <div className="mb-14">
          <div className="text-center mb-10">
            <Badge className="bg-[#FFD700] text-[#001f3f] font-bold mb-3">INVESTMENT TIERS</Badge>
            <h2 className="text-4xl font-bold text-[#FFD700] mb-3">Choose Your Level</h2>
            <p className="text-white/70 text-lg">You're not buying a product — you're investing in a system that builds your income.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <Card key={tier.name} className={`bg-[#001f3f] border-2 ${tier.color} relative ${tier.highlight ? "ring-2 ring-[#FFD700]/40 scale-105" : ""} transition-transform hover:scale-105`}>
                {tier.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-[#FFD700] text-[#001f3f] font-bold px-4 py-1 text-sm">⭐ MOST POPULAR</Badge>
                  </div>
                )}
                <CardHeader className="text-center pt-8 pb-4">
                  <Badge className={`${tier.badgeColor} w-fit mx-auto mb-3 px-3 py-1`}>{tier.label}</Badge>
                  <CardTitle className="text-white text-2xl">{tier.name} Tier</CardTitle>
                  <div className="text-5xl font-bold text-[#FFD700] mt-2">{tier.price}</div>
                  <p className="text-white/60 text-sm mt-1">one-time investment</p>
                  <p className="text-emerald-400 font-semibold text-sm mt-2 flex items-center justify-center gap-1">
                    <Clock className="h-4 w-4" /> Results in {tier.timeline}
                  </p>
                  <p className="text-white/70 text-sm mt-2 italic">"{tier.tagline}"</p>
                </CardHeader>
                <CardContent className="px-6 pb-8">
                  <ul className="space-y-3">
                    {tier.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                        <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => {
                      setForm(f => ({ ...f, tier: tier.name }));
                      setSelectedTier(tier.name);
                      document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`w-full mt-6 font-bold py-3 rounded-xl ${tier.highlight ? "bg-[#FFD700] text-[#001f3f] hover:bg-yellow-400" : "bg-white/10 text-white hover:bg-white/20"}`}
                  >
                    Reserve My Spot <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Skill Tracks */}
        <div className="mb-14">
          <div className="text-center mb-10">
            <Badge className="bg-purple-600 text-white font-bold mb-3">6 SKILL TRACKS</Badge>
            <h2 className="text-3xl font-bold text-[#FFD700] mb-3">Pick Your Income Path</h2>
            <p className="text-white/70">Each track is an AI-guided journey from zero to earning. You choose what fits your life.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {skillTracks.map((track) => (
              <Card key={track.name} className="bg-[#001f3f] border border-white/10 hover:border-[#FFD700]/40 transition-colors group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-[#FFD700]/10 rounded-lg p-2.5 group-hover:bg-[#FFD700]/20 transition-colors">
                      <track.icon className="h-5 w-5 text-[#FFD700]" />
                    </div>
                    <h3 className="text-white font-bold">{track.name}</h3>
                  </div>
                  <p className="text-white/60 text-sm">{track.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* App Features */}
        <div className="mb-14">
          <div className="text-center mb-10">
            <Badge className="bg-[#FFD700] text-[#001f3f] font-bold mb-3">WHAT THE APP DOES</Badge>
            <h2 className="text-3xl font-bold text-[#FFD700] mb-3">Your Wealth-Building Machine</h2>
            <p className="text-white/70">Eight powerful tools in one platform — all working together to build your income.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {appFeatures.map((feat) => (
              <Card key={feat.title} className="bg-[#001f3f] border border-white/10 hover:border-purple-400/40 transition-colors">
                <CardContent className="p-5">
                  <div className="bg-purple-500/10 rounded-lg p-2.5 w-fit mb-3">
                    <feat.icon className="h-5 w-5 text-purple-400" />
                  </div>
                  <h3 className="text-white font-bold text-sm mb-2">{feat.title}</h3>
                  <p className="text-white/60 text-xs leading-relaxed">{feat.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Income Projection Teaser */}
        <Card className="bg-gradient-to-r from-[#001f3f] to-[#002855] border-2 border-[#FFD700]/40 mb-14">
          <CardContent className="p-8 md:p-12">
            <div className="text-center mb-8">
              <Badge className="bg-emerald-500 text-white font-bold mb-3">INCOME PROJECTIONS</Badge>
              <h2 className="text-3xl font-bold text-[#FFD700] mb-3">See Your Results Before You Start</h2>
              <p className="text-white/70">These aren't guarantees — they're models based on members who apply the system consistently.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left text-white/60 pb-4 font-medium">Tier</th>
                    <th className="text-center text-white/60 pb-4 font-medium">6 Months</th>
                    <th className="text-center text-white/60 pb-4 font-medium">12 Months</th>
                    <th className="text-center text-white/60 pb-4 font-medium">24 Months</th>
                  </tr>
                </thead>
                <tbody className="space-y-3">
                  {[
                    { tier: "Basic ($1,000)", m6: "$500–$1,500/mo", m12: "$1,000–$3,000/mo", m24: "$2,000–$5,000/mo", color: "text-blue-400" },
                    { tier: "Growth ($2,500)", m6: "$1,500–$3,500/mo", m12: "$3,000–$7,000/mo", m24: "$6,000–$15,000/mo", color: "text-[#FFD700]" },
                    { tier: "Elite ($5,000)", m6: "$3,000–$6,000/mo", m12: "$6,000–$15,000/mo", m24: "$15,000–$35,000/mo", color: "text-purple-400" },
                  ].map((row) => (
                    <tr key={row.tier} className="border-b border-white/10">
                      <td className={`py-4 font-bold ${row.color}`}>{row.tier}</td>
                      <td className="py-4 text-center text-white/80">{row.m6}</td>
                      <td className="py-4 text-center text-white/80">{row.m12}</td>
                      <td className="py-4 text-center text-emerald-400 font-semibold">{row.m24}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-white/40 text-xs text-center mt-4">
              * Results vary based on effort, consistency, and skill track chosen. These represent potential outcomes for active participants — not guarantees.
            </p>
          </CardContent>
        </Card>

        {/* 24-Month Timeline */}
        <div className="mb-14">
          <div className="text-center mb-10">
            <Badge className="bg-[#FFD700] text-[#001f3f] font-bold mb-3">YOUR ROADMAP</Badge>
            <h2 className="text-3xl font-bold text-[#FFD700] mb-3">What 24 Months Looks Like</h2>
            <p className="text-white/70">A clear path from where you are to where you want to be.</p>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[#FFD700]/20 hidden md:block" />
            <div className="space-y-6">
              {timeline.map((step, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className={`${step.color} rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0 shadow-lg text-white font-bold text-xs text-center leading-tight p-2`}>
                    {step.month}
                  </div>
                  <Card className="bg-[#001f3f] border border-white/10 flex-1">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={`${step.color} text-white text-xs`}>{step.milestone}</Badge>
                      </div>
                      <p className="text-white/80 text-sm">{step.desc}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Why This Works */}
        <Card className="bg-[#001f3f] border border-purple-500/30 mb-14">
          <CardContent className="p-8 md:p-12">
            <div className="text-center mb-8">
              <Badge className="bg-purple-600 text-white font-bold mb-3">WHY THIS WORKS</Badge>
              <h2 className="text-3xl font-bold text-[#FFD700] mb-3">You're Not Buying Hype. You're Buying a System.</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-white font-bold mb-4">Same model used by:</h3>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li className="flex items-center gap-2"><Star className="h-4 w-4 text-[#FFD700]" /> Digital academies & online schools</li>
                  <li className="flex items-center gap-2"><Star className="h-4 w-4 text-[#FFD700]" /> AI automation training programs</li>
                  <li className="flex items-center gap-2"><Star className="h-4 w-4 text-[#FFD700]" /> High-ticket coaching communities</li>
                  <li className="flex items-center gap-2"><Star className="h-4 w-4 text-[#FFD700]" /> Skill accelerator bootcamps</li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-bold mb-4">But packaged as a mobile app — making it:</h3>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-400" /> More accessible (phone in your pocket)</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-400" /> More scalable (thousands at once)</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-400" /> More modern (AI + community-first)</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-400" /> More trustworthy (you own your assets)</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 bg-[#002855] rounded-xl p-6 border border-[#FFD700]/20">
              <p className="text-white text-lg text-center font-medium">
                "Ordinary people don't lack ambition. They lack <span className="text-[#FFD700] font-bold">systems, skills, and a roadmap.</span> That's what we deliver."
              </p>
              <p className="text-white/50 text-center text-sm mt-2">— Derrick Taylor, Founder of The FR2P Club</p>
            </div>
          </CardContent>
        </Card>

        {/* Waitlist Form */}
        <div className="max-w-xl mx-auto" id="waitlist">
          {submitted ? (
            <Card className="bg-[#001f3f] border-2 border-[#FFD700]">
              <CardContent className="p-10 text-center">
                <div className="bg-[#FFD700] rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Crown className="h-10 w-10 text-[#001f3f]" />
                </div>
                <h2 className="text-3xl font-bold text-[#FFD700] mb-4">Founding Member Reserved! 🔥</h2>
                <p className="text-white/80 text-lg mb-4">
                  You're on the list. When the FR2P Side Hustle Incubator launches, you'll get first access — along with any founding member pricing or bonuses.
                </p>
                <p className="text-white/50 text-sm">
                  Keep building your FR2P network in the meantime. Active members get priority placement.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-[#001f3f] border-2 border-[#FFD700]/50">
              <CardHeader className="text-center pb-2">
                <Badge className="bg-purple-600 text-white w-fit mx-auto mb-3">FOUNDING MEMBER WAITLIST</Badge>
                <CardTitle className="text-[#FFD700] text-3xl">Reserve Your Spot</CardTitle>
                <p className="text-white/70">Founding members get early access + exclusive pricing. No payment now.</p>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
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
                    <Label className="text-white/80 mb-2 block">Which Tier Interests You?</Label>
                    <Select value={form.tier} onValueChange={val => setForm(f => ({ ...f, tier: val }))}>
                      <SelectTrigger className="bg-[#002855] border-white/20 text-white">
                        <SelectValue placeholder="Select a tier" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#002855] border-white/20 text-white">
                        <SelectItem value="Basic">Basic — $1,000 (6–12 month roadmap)</SelectItem>
                        <SelectItem value="Growth">Growth — $2,500 (6–18 month roadmap)</SelectItem>
                        <SelectItem value="Elite">Elite — $5,000 (12–24 month roadmap)</SelectItem>
                        <SelectItem value="Not sure yet">Not sure yet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white/80 mb-2 block">Which Skill Track Excites You Most?</Label>
                    <Select value={form.track} onValueChange={val => setForm(f => ({ ...f, track: val }))}>
                      <SelectTrigger className="bg-[#002855] border-white/20 text-white">
                        <SelectValue placeholder="Select a track" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#002855] border-white/20 text-white">
                        <SelectItem value="AI Automation">AI Automation</SelectItem>
                        <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                        <SelectItem value="Content Creation">Content Creation</SelectItem>
                        <SelectItem value="Affiliate Marketing">Affiliate Marketing</SelectItem>
                        <SelectItem value="Digital Products">Digital Products</SelectItem>
                        <SelectItem value="E-commerce">E-commerce & Drop-shipping</SelectItem>
                        <SelectItem value="Not sure yet">Not sure yet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="submit"
                    disabled={waitlistMutation.isPending}
                    className="w-full bg-[#FFD700] text-[#001f3f] hover:bg-yellow-400 font-bold py-4 text-lg rounded-xl flex items-center justify-center gap-2"
                  >
                    {waitlistMutation.isPending ? "Reserving Your Spot..." : (
                      <>
                        <Rocket className="h-5 w-5" />
                        Reserve My Founding Member Spot
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </Button>
                  <p className="text-white/40 text-xs text-center">
                    No credit card. No payment now. Just your spot in line for early access and founding member pricing.
                  </p>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
}
