import { HeaderNav } from "@/components/ui/header-nav";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { MemberResponse, HustleInvestment, IncubatorSuccessStory } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient as qc } from "@/lib/queryClient";
import { useState } from "react";
import {
  TrendingUp, DollarSign, Clock, CheckCircle, Circle, Brain, Zap, Target,
  BarChart3, Rocket, Crown, ArrowRight, Calendar, PieChart, Star, Calculator,
  Trophy, MessageSquarePlus, Heart, Shield, AlertTriangle,
} from "lucide-react";
import { getLoggedInMemberId, getLoggedInName } from "@/lib/auth";
import { Link } from "wouter";

const DEMO_USER_ID = getLoggedInMemberId();

const TIER_CONFIG = {
  Basic: {
    amount: 1000, color: "text-blue-400", border: "border-blue-400", badge: "bg-blue-500",
    timelineMonths: 12,
    roiProjections: { m6: [500, 1500], m12: [1000, 3000], m24: [2000, 5000] },
    allocation: [
      { label: "AI Tools & Technology", pct: 30, color: "bg-blue-400" },
      { label: "Group Coaching Sessions", pct: 25, color: "bg-emerald-400" },
      { label: "Digital Asset Studio", pct: 20, color: "bg-purple-400" },
      { label: "Community & Accountability", pct: 15, color: "bg-orange-400" },
      { label: "Platform & Operations", pct: 10, color: "bg-gray-400" },
    ],
  },
  Growth: {
    amount: 2500, color: "text-[#FFD700]", border: "border-[#FFD700]", badge: "bg-[#FFD700] text-[#001f3f]",
    timelineMonths: 18,
    roiProjections: { m6: [1500, 3500], m12: [3000, 7000], m24: [6000, 15000] },
    allocation: [
      { label: "AI Tools & Technology", pct: 28, color: "bg-blue-400" },
      { label: "1-on-1 Coaching Sessions", pct: 28, color: "bg-emerald-400" },
      { label: "Digital Asset Studio", pct: 22, color: "bg-purple-400" },
      { label: "Affiliate Funnel Build-Out", pct: 12, color: "bg-[#FFD700]" },
      { label: "Community & Operations", pct: 10, color: "bg-gray-400" },
    ],
  },
  Elite: {
    amount: 5000, color: "text-purple-400", border: "border-purple-400", badge: "bg-purple-600",
    timelineMonths: 24,
    roiProjections: { m6: [3000, 6000], m12: [6000, 15000], m24: [15000, 35000] },
    allocation: [
      { label: "AI Automation Suite", pct: 25, color: "bg-blue-400" },
      { label: "Done-With-You Setup", pct: 25, color: "bg-emerald-400" },
      { label: "Private Mastermind Access", pct: 20, color: "bg-purple-400" },
      { label: "Revenue Dashboard & Tools", pct: 15, color: "bg-[#FFD700]" },
      { label: "Virtual Summit + Retreat", pct: 10, color: "bg-orange-400" },
      { label: "Platform & Operations", pct: 5, color: "bg-gray-400" },
    ],
  },
};

const PHASES = [
  { num: 1, name: "Foundation", months: "Months 1–2", desc: "Onboard, pick skill track, build AI business profile" },
  { num: 2, name: "Build", months: "Months 3–4", desc: "Create first digital asset or funnel, launch affiliate setup" },
  { num: 3, name: "Earn", months: "Months 5–6", desc: "First revenue milestone, optimize, add second income stream" },
  { num: 4, name: "Scale", months: "Months 7–12", desc: "Automate systems, expand platforms, hit 12-month income goal" },
  { num: 5, name: "Multiply", months: "Months 13–24", desc: "Reinvest profits, expand team, build lasting wealth" },
];

// ── hourly rate by skill track ──────────────────────────────────────────────
const TRACK_RATES: Record<string, { low: number; high: number; rampMonths: number }> = {
  "AI Automation":       { low: 25, high: 75,  rampMonths: 3 },
  "Digital Marketing":   { low: 20, high: 60,  rampMonths: 4 },
  "Content Creation":    { low: 15, high: 50,  rampMonths: 5 },
  "Affiliate Marketing": { low: 10, high: 40,  rampMonths: 4 },
  "Digital Products":    { low: 20, high: 80,  rampMonths: 5 },
  "E-commerce":          { low: 15, high: 55,  rampMonths: 6 },
};

function daysSince(date: string | Date) {
  return Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
}
function formatMoney(cents: number) {
  return `$${(cents / 100).toLocaleString()}`;
}

// ── SKILL ROI CALCULATOR ────────────────────────────────────────────────────
function SkillROICalculator() {
  const [hours, setHours] = useState(10);
  const [track, setTrack] = useState("Digital Marketing");
  const [tier, setTier] = useState<keyof typeof TIER_CONFIG>("Growth");

  const rates = TRACK_RATES[track] || TRACK_RATES["Digital Marketing"];
  const cfg = TIER_CONFIG[tier];

  // Ramp curve: skill starts at 30% efficiency, reaches 100% after rampMonths
  function monthlyEarnings(month: number, rate: number) {
    const ramp = Math.min(1, 0.3 + (0.7 * month) / rates.rampMonths);
    return Math.round(hours * 4.33 * rate * ramp); // 4.33 weeks/month
  }

  const milestones = [1, 3, 6, 12, 24];

  return (
    <Card className="bg-[#001f3f] border border-[#FFD700]/30">
      <CardHeader>
        <CardTitle className="text-[#FFD700] flex items-center gap-2 text-2xl">
          <Calculator className="h-6 w-6" /> Skill ROI Calculator
        </CardTitle>
        <p className="text-white/60 text-sm">
          Enter how many hours per week you'll put in — see what your skills can realistically earn you.
        </p>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-6">
        {/* Inputs */}
        <div className="grid sm:grid-cols-3 gap-5">
          <div>
            <Label className="text-white/80 mb-2 block">Hours Per Week</Label>
            <div className="flex items-center gap-3">
              <input
                type="range" min={2} max={40} value={hours}
                onChange={e => setHours(Number(e.target.value))}
                className="flex-1 accent-[#FFD700]"
              />
              <span className="text-[#FFD700] font-bold text-lg w-10 text-right">{hours}</span>
            </div>
            <div className="flex justify-between text-white/30 text-xs mt-1">
              <span>2 hrs</span><span>Part-time</span><span>Full-time 40</span>
            </div>
          </div>

          <div>
            <Label className="text-white/80 mb-2 block">Skill Track</Label>
            <Select value={track} onValueChange={setTrack}>
              <SelectTrigger className="bg-[#002855] border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#002855] border-white/20 text-white">
                {Object.keys(TRACK_RATES).map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-white/80 mb-2 block">Investment Tier</Label>
            <Select value={tier} onValueChange={v => setTier(v as keyof typeof TIER_CONFIG)}>
              <SelectTrigger className="bg-[#002855] border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#002855] border-white/20 text-white">
                <SelectItem value="Basic">Basic — $1,000</SelectItem>
                <SelectItem value="Growth">Growth — $2,500</SelectItem>
                <SelectItem value="Elite">Elite — $5,000</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div>
          <h3 className="text-white font-bold mb-3 text-sm uppercase tracking-wide">
            Projected Monthly Earnings at {hours} hrs/week · {track}
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {milestones.map(m => {
              const low  = monthlyEarnings(m, rates.low);
              const high = monthlyEarnings(m, rates.high);
              const isBreakeven = high >= cfg.amount;
              return (
                <div
                  key={m}
                  className={`rounded-xl p-3 text-center border ${isBreakeven ? "border-emerald-500 bg-emerald-500/10" : "border-white/10 bg-[#002855]"}`}
                >
                  <div className="text-white/50 text-xs mb-1">Mo {m}</div>
                  <div className="text-white text-xs">${low.toLocaleString()}</div>
                  <div className="text-white/30 text-xs">–</div>
                  <div className={`font-bold text-sm ${isBreakeven ? "text-emerald-400" : "text-[#FFD700]"}`}>
                    ${high.toLocaleString()}
                  </div>
                  {isBreakeven && <div className="text-emerald-400 text-xs mt-1">🎯 ROI+</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Breakeven callout */}
        <div className="bg-[#002855] border border-[#FFD700]/20 rounded-xl p-4 flex items-start gap-3">
          <TrendingUp className="h-5 w-5 text-[#FFD700] mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-white font-semibold text-sm">
              At {hours} hrs/week, the high-end projection covers your ${cfg.amount.toLocaleString()} investment within{" "}
              <span className="text-emerald-400">
                {milestones.find(m => monthlyEarnings(m, rates.high) >= cfg.amount) ?? "24"}+ months
              </span>
              {" "}— then everything beyond is pure profit.
            </p>
            <p className="text-white/40 text-xs mt-1">
              Your return comes from your skills — not from our pocket. That's what makes it real and legal.
            </p>
          </div>
        </div>

        {/* Legal clarity box */}
        <div className="bg-[#001f3f] border border-white/10 rounded-xl p-4 flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-blue-300 font-semibold text-sm mb-1">Why This Is Different From Scams</p>
            <p className="text-white/60 text-xs leading-relaxed">
              Programs that promise "invest $100, get $1,000 back from us" are Ponzi schemes — they pay old investors with new investors' money until it collapses.
              Here, your return comes from <strong className="text-white">what you earn using your skills</strong> — affiliate commissions, digital product sales, client work.
              We invest in your tools and training. <strong className="text-white">The market pays you. Not us.</strong>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── SUCCESS STORY BOARD ─────────────────────────────────────────────────────
function SuccessStoryBoard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    memberName: getLoggedInName() || "",
    tier: "", skillTrack: "", monthsIn: "", incomeGained: "", story: "",
  });

  const { data, isLoading } = useQuery<{ stories: IncubatorSuccessStory[] }>({
    queryKey: ["/api/incubator-stories"],
  });

  const postMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/incubator-stories", {
        memberId: DEMO_USER_ID !== "fr2p-founder" ? DEMO_USER_ID : null,
        memberName: form.memberName,
        tier: form.tier || null,
        skillTrack: form.skillTrack || null,
        monthsIn: form.monthsIn ? parseInt(form.monthsIn) : null,
        incomeGained: form.incomeGained ? parseInt(form.incomeGained) : null,
        story: form.story,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/incubator-stories"] });
      setShowForm(false);
      setForm({ memberName: getLoggedInName() || "", tier: "", skillTrack: "", monthsIn: "", incomeGained: "", story: "" });
      toast({ title: "Win posted! 🏆", description: "Your success story is now visible to the community." });
    },
    onError: () => {
      toast({ title: "Error", description: "Please try again.", variant: "destructive" });
    },
  });

  const stories = data?.stories ?? [];

  // Seed placeholder stories until real ones exist
  const displayStories: Partial<IncubatorSuccessStory>[] = stories.length > 0 ? stories : [
    { id: "seed-1", memberName: "Marcus T.", tier: "Growth", skillTrack: "Affiliate Marketing", monthsIn: 7, incomeGained: 2400, story: "I was skeptical at first — I've been burned before too. But 7 months in I'm clearing $2,400/month from two affiliate programs I set up using the templates. My investment paid for itself in month 5.", isVerified: true, postedAt: new Date("2026-05-12") as any },
    { id: "seed-2", memberName: "Tanya W.", tier: "Elite", skillTrack: "Digital Products", monthsIn: 11, incomeGained: 5800, story: "I created 3 digital templates using the studio tools. Month 11 I hit $5,800 in sales. Best decision I've ever made. This isn't a scam — YOUR work produces the results.", isVerified: true, postedAt: new Date("2026-06-01") as any },
    { id: "seed-3", memberName: "James R.", tier: "Basic", skillTrack: "AI Automation", monthsIn: 4, incomeGained: 900, story: "Still early but I landed my first AI automation client at month 4 for $900/month retainer. Building from here.", isVerified: false, postedAt: new Date("2026-06-18") as any },
  ];

  return (
    <Card className="bg-[#001f3f] border border-purple-500/30">
      <CardHeader>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <CardTitle className="text-[#FFD700] flex items-center gap-2 text-2xl">
              <Trophy className="h-6 w-6" /> Community Win Board
            </CardTitle>
            <p className="text-white/60 text-sm mt-1">
              Real results from real members. Post your income wins — inspire the next person.
            </p>
          </div>
          <Button
            onClick={() => setShowForm(s => !s)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center gap-2"
          >
            <MessageSquarePlus className="h-4 w-4" />
            {showForm ? "Cancel" : "Post My Win"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-0 space-y-6">
        {/* Post form */}
        {showForm && (
          <Card className="bg-[#002855] border border-[#FFD700]/30">
            <CardContent className="p-5 space-y-4">
              <h3 className="text-[#FFD700] font-bold">Share Your Win 🏆</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/70 mb-1 block text-sm">Your Name *</Label>
                  <Input value={form.memberName} onChange={e => setForm(f => ({ ...f, memberName: e.target.value }))}
                    placeholder="First name or initials"
                    className="bg-[#001f3f] border-white/20 text-white placeholder:text-white/30" required />
                </div>
                <div>
                  <Label className="text-white/70 mb-1 block text-sm">Monthly Income Gained ($)</Label>
                  <Input type="number" value={form.incomeGained}
                    onChange={e => setForm(f => ({ ...f, incomeGained: e.target.value }))}
                    placeholder="e.g. 1500"
                    className="bg-[#001f3f] border-white/20 text-white placeholder:text-white/30" />
                </div>
                <div>
                  <Label className="text-white/70 mb-1 block text-sm">Tier</Label>
                  <Select onValueChange={v => setForm(f => ({ ...f, tier: v }))}>
                    <SelectTrigger className="bg-[#001f3f] border-white/20 text-white">
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#001f3f] border-white/20 text-white">
                      <SelectItem value="Basic">Basic ($1,000)</SelectItem>
                      <SelectItem value="Growth">Growth ($2,500)</SelectItem>
                      <SelectItem value="Elite">Elite ($5,000)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white/70 mb-1 block text-sm">Months Into Program</Label>
                  <Input type="number" value={form.monthsIn}
                    onChange={e => setForm(f => ({ ...f, monthsIn: e.target.value }))}
                    placeholder="e.g. 6"
                    className="bg-[#001f3f] border-white/20 text-white placeholder:text-white/30" />
                </div>
              </div>
              <div>
                <Label className="text-white/70 mb-1 block text-sm">Your Story *</Label>
                <Textarea value={form.story} onChange={e => setForm(f => ({ ...f, story: e.target.value }))}
                  placeholder="Tell us what worked, what you earned, and what you want others to know..."
                  className="bg-[#001f3f] border-white/20 text-white placeholder:text-white/30 min-h-[100px]" />
              </div>
              <div className="flex items-start gap-2 text-xs text-white/40">
                <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                <span>By posting, you confirm this is your real result. Stories may be reviewed before display. Don't exaggerate — authenticity builds trust.</span>
              </div>
              <Button
                onClick={() => postMutation.mutate()}
                disabled={!form.memberName || !form.story || postMutation.isPending}
                className="bg-[#FFD700] text-[#001f3f] hover:bg-yellow-400 font-bold"
              >
                {postMutation.isPending ? "Posting..." : "Post My Win →"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Story grid */}
        {isLoading ? (
          <div className="text-white/40 text-center py-8">Loading stories...</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {displayStories.map(story => (
              <div key={story.id} className="bg-[#002855] border border-white/10 rounded-xl p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-bold">{story.memberName}</span>
                      {story.isVerified && (
                        <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" /> Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {story.tier && <Badge className="bg-white/10 text-white/60 text-xs">{story.tier}</Badge>}
                      {story.skillTrack && <Badge className="bg-purple-500/20 text-purple-300 text-xs">{story.skillTrack}</Badge>}
                      {story.monthsIn && <span className="text-white/40 text-xs">Month {story.monthsIn}</span>}
                    </div>
                  </div>
                  {story.incomeGained && (
                    <div className="text-right flex-shrink-0">
                      <div className="text-2xl font-bold text-emerald-400">${story.incomeGained.toLocaleString()}</div>
                      <div className="text-white/40 text-xs">/month gained</div>
                    </div>
                  )}
                </div>
                <p className="text-white/70 text-sm leading-relaxed italic">"{story.story}"</p>
                <div className="flex items-center gap-1 text-white/30 text-xs">
                  <Heart className="h-3 w-3" />
                  <span>{new Date(story.postedAt!).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {stories.length === 0 && (
          <p className="text-white/30 text-xs text-center">
            These are example stories to show what the board looks like. Real member wins will appear here as they're posted.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// ── ROI SIMULATOR (for non-enrolled) ───────────────────────────────────────
function ROISimulator() {
  const [tier, setTier] = useState<keyof typeof TIER_CONFIG>("Growth");
  const cfg = TIER_CONFIG[tier];
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-white font-medium">Simulate your tier:</span>
        {(Object.keys(TIER_CONFIG) as (keyof typeof TIER_CONFIG)[]).map(t => (
          <button key={t} onClick={() => setTier(t)}
            className={`px-5 py-2 rounded-full font-bold text-sm border-2 transition-all ${tier === t ? `${TIER_CONFIG[t].border} ${TIER_CONFIG[t].color} bg-white/10` : "border-white/20 text-white/50 hover:border-white/40"}`}
          >{t} — ${TIER_CONFIG[t].amount.toLocaleString()}</button>
        ))}
      </div>
      <div>
        <h3 className="text-white font-bold mb-4 flex items-center gap-2"><PieChart className="h-5 w-5 text-[#FFD700]" /> Where Your Investment Goes</h3>
        <div className="space-y-3">
          {cfg.allocation.map(a => (
            <div key={a.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white/80">{a.label}</span>
                <span className="text-white font-bold">{a.pct}% — ${Math.round(cfg.amount * a.pct / 100).toLocaleString()}</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full ${a.color} rounded-full transition-all duration-700`} style={{ width: `${a.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-white font-bold mb-4 flex items-center gap-2"><TrendingUp className="h-5 w-5 text-[#FFD700]" /> Estimated Monthly Income Potential</h3>
        <div className="grid grid-cols-3 gap-4">
          {[{ label: "6 Months", range: cfg.roiProjections.m6, color: "border-blue-400" },
            { label: "12 Months", range: cfg.roiProjections.m12, color: "border-[#FFD700]" },
            { label: "24 Months", range: cfg.roiProjections.m24, color: "border-emerald-400" }].map(proj => (
            <div key={proj.label} className={`bg-[#001f3f] border-2 ${proj.color} rounded-xl p-4 text-center`}>
              <div className="text-white/60 text-xs mb-1">{proj.label}</div>
              <div className="text-white font-bold text-sm">${proj.range[0].toLocaleString()}</div>
              <div className="text-white/40 text-xs">to</div>
              <div className="text-emerald-400 font-bold">${proj.range[1].toLocaleString()}/mo</div>
            </div>
          ))}
        </div>
        <p className="text-white/30 text-xs mt-3">* Potential ranges based on consistent effort. Not a guarantee — your work drives your results.</p>
      </div>
    </div>
  );
}

// ── ACTIVE TRACKER ──────────────────────────────────────────────────────────
function ActiveTracker({ investment }: { investment: HustleInvestment }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const cfg = TIER_CONFIG[investment.tier as keyof typeof TIER_CONFIG];
  const days = daysSince(investment.investedAt);
  const phasePct = Math.min(100, Math.round((investment.currentPhase / 5) * 100));

  const advanceMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("PATCH", `/api/hustle-investments/${investment.id}/phase`, {
        currentPhase: Math.min(5, investment.currentPhase + 1),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hustle-investments", DEMO_USER_ID] });
      toast({ title: "Phase advanced!", description: "Your tracker has been updated." });
    },
  });

  return (
    <div className="space-y-8">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: DollarSign, label: "Invested", value: formatMoney(investment.amount), color: cfg.color },
          { icon: Clock, label: "Days Active", value: String(days), color: "text-blue-400" },
          { icon: Target, label: "Current Phase", value: `Phase ${investment.currentPhase}`, color: "text-emerald-400" },
          { icon: TrendingUp, label: "Journey", value: `${phasePct}%`, color: "text-purple-400" },
        ].map(({ icon: Icon, label, value, color }) => (
          <Card key={label} className="bg-[#001f3f] border border-white/10">
            <CardContent className="p-4 text-center">
              <Icon className={`h-6 w-6 ${color} mx-auto mb-1`} />
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
              <div className="text-white/50 text-xs">{label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Fund allocation */}
      <div>
        <h3 className="text-white font-bold mb-4 flex items-center gap-2"><PieChart className="h-5 w-5 text-[#FFD700]" /> Your Fund Allocation</h3>
        <div className="space-y-3">
          {cfg.allocation.map(a => (
            <div key={a.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white/80">{a.label}</span>
                <span className="text-white font-bold">{a.pct}% · ${Math.round(investment.amount / 100 * a.pct / 100 * 100).toLocaleString()}</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full ${a.color} rounded-full`} style={{ width: `${a.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ROI projections */}
      <div>
        <h3 className="text-white font-bold mb-4 flex items-center gap-2"><BarChart3 className="h-5 w-5 text-[#FFD700]" /> Your Projected Returns</h3>
        <div className="grid grid-cols-3 gap-4">
          {[{ label: "6 Months", range: cfg.roiProjections.m6, color: "border-blue-400", done: days >= 180 },
            { label: "12 Months", range: cfg.roiProjections.m12, color: "border-[#FFD700]", done: days >= 365 },
            { label: "24 Months", range: cfg.roiProjections.m24, color: "border-emerald-400", done: days >= 730 }].map(proj => (
            <div key={proj.label} className={`bg-[#001f3f] border-2 ${proj.color} rounded-xl p-4 text-center relative`}>
              {proj.done && <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs">Reached!</Badge>}
              <div className="text-white/60 text-xs mb-1">{proj.label}</div>
              <div className="text-white text-sm font-bold">${proj.range[0].toLocaleString()}</div>
              <div className="text-white/30 text-xs">to</div>
              <div className="text-emerald-400 font-bold">${proj.range[1].toLocaleString()}/mo</div>
            </div>
          ))}
        </div>
        <p className="text-white/30 text-xs mt-3">* Potential monthly income ranges based on consistent effort. Not a guarantee of returns.</p>
      </div>

      {/* Phase timeline */}
      <div>
        <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Calendar className="h-5 w-5 text-[#FFD700]" /> Your Journey Timeline</h3>
        <div className="space-y-3">
          {PHASES.map(phase => {
            const done = investment.currentPhase > phase.num;
            const active = investment.currentPhase === phase.num;
            return (
              <div key={phase.num} className={`flex gap-4 items-start p-4 rounded-xl border transition-all ${active ? "border-[#FFD700]/60 bg-[#FFD700]/5" : done ? "border-emerald-500/30 bg-emerald-500/5" : "border-white/10"}`}>
                <div className={`rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 ${done ? "bg-emerald-500" : active ? "bg-[#FFD700]" : "bg-white/10"}`}>
                  {done ? <CheckCircle className="h-5 w-5 text-white" /> : active ? <Zap className="h-5 w-5 text-[#001f3f]" /> : <Circle className="h-5 w-5 text-white/30" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`font-bold ${done ? "text-emerald-400" : active ? "text-[#FFD700]" : "text-white/40"}`}>{phase.name}</span>
                    <span className="text-white/30 text-xs">{phase.months}</span>
                    {active && <Badge className="bg-[#FFD700] text-[#001f3f] text-xs">Current Phase</Badge>}
                    {done && <Badge className="bg-emerald-500 text-white text-xs">Complete</Badge>}
                  </div>
                  <p className={`text-sm ${active ? "text-white/80" : done ? "text-white/50" : "text-white/30"}`}>{phase.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
        {investment.currentPhase < 5 && (
          <Button onClick={() => advanceMutation.mutate()} disabled={advanceMutation.isPending}
            className="mt-4 bg-[#FFD700] text-[#001f3f] hover:bg-yellow-400 font-bold">
            Mark Phase {investment.currentPhase + 1} Started <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Turnaround */}
      <Card className="bg-[#001f3f] border border-[#FFD700]/30">
        <CardContent className="p-6">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Clock className="h-5 w-5 text-[#FFD700]" /> Turnaround Summary</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className={`text-2xl font-bold ${days >= 60 ? "text-emerald-400" : "text-white"}`}>{days >= 60 ? "✓" : `${60 - days}d`}</div>
              <div className="text-white/50 text-xs">Days to first asset</div>
              <div className="text-white/30 text-xs mt-1">Goal: 60 days</div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${days >= 120 ? "text-emerald-400" : "text-white"}`}>{days >= 120 ? "✓" : `${Math.max(0, 120 - days)}d`}</div>
              <div className="text-white/50 text-xs">Days to first revenue</div>
              <div className="text-white/30 text-xs mt-1">Goal: 120 days</div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${cfg.color}`}>{cfg.timelineMonths} mo</div>
              <div className="text-white/50 text-xs">Full roadmap</div>
              <div className="text-white/30 text-xs mt-1">{investment.tier} tier</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function InvestmentTracker() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [simTier, setSimTier] = useState("");

  const { data: memberData } = useQuery<MemberResponse>({
    queryKey: ["/api/member", DEMO_USER_ID],
  });

  const { data: investmentData, isLoading } = useQuery<{ investment: HustleInvestment | null }>({
    queryKey: ["/api/hustle-investments", DEMO_USER_ID],
  });

  const enrollMutation = useMutation({
    mutationFn: async (tier: string) => {
      const amounts: Record<string, number> = { Basic: 100000, Growth: 250000, Elite: 500000 };
      const res = await apiRequest("POST", "/api/hustle-investments", {
        memberId: DEMO_USER_ID, tier, amount: amounts[tier], status: "active", currentPhase: 1,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hustle-investments", DEMO_USER_ID] });
      toast({ title: "Investment tracked! 🚀", description: "Your ROI dashboard is now active." });
    },
    onError: () => {
      toast({ title: "Error", description: "Could not create investment. Please try again.", variant: "destructive" });
    },
  });

  const investment = investmentData?.investment;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001f3f] to-[#002855]">
      <HeaderNav user={memberData?.member || undefined} />

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">

        {/* Header */}
        <div>
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <div>
              <Badge className="bg-purple-600 text-white font-bold mb-3">BACK OFFICE</Badge>
              <h1 className="text-4xl font-bold text-[#FFD700] flex items-center gap-3">
                <BarChart3 className="h-9 w-9" /> My Investment Tracker
              </h1>
              <p className="text-white/70 mt-2">
                See where your investment went, what it's projected to return, and where you stand in your journey.
              </p>
            </div>
            {!investment && (
              <Link href="/hustle-incubator">
                <Button className="bg-[#FFD700] text-[#001f3f] hover:bg-yellow-400 font-bold flex items-center gap-2">
                  <Rocket className="h-4 w-4" /> View Incubator Program
                </Button>
              </Link>
            )}
          </div>
          {investment && (
            <div className={`inline-flex items-center gap-2 border-2 ${TIER_CONFIG[investment.tier as keyof typeof TIER_CONFIG]?.border} rounded-full px-4 py-2`}>
              <Crown className="h-4 w-4 text-[#FFD700]" />
              <span className="text-white font-bold">{investment.tier} Tier Investor</span>
              <span className="text-white/50">·</span>
              <span className="text-white/60 text-sm">{investment.skillTrack || "Skill track TBD"}</span>
            </div>
          )}
        </div>

        {/* Active Tracker OR Simulator */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-white/50 text-lg">Loading your tracker...</div>
          </div>
        ) : investment ? (
          <ActiveTracker investment={investment} />
        ) : (
          <>
            <Card className="bg-[#001f3f] border border-[#FFD700]/30">
              <CardHeader>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <CardTitle className="text-[#FFD700] text-2xl mb-1">No Active Investment Yet</CardTitle>
                    <p className="text-white/60">Once you enroll, this page becomes your live ROI dashboard. Preview it below.</p>
                  </div>
                  <Badge className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">Preview Mode</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <ROISimulator />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900/40 to-[#001f3f] border-2 border-purple-500/50">
              <CardContent className="p-8 text-center">
                <Brain className="h-12 w-12 text-[#FFD700] mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Ready to Activate Your Tracker?</h2>
                <p className="text-white/70 mb-6">Select your tier to record your investment and unlock your live ROI dashboard.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                  <Select onValueChange={setSimTier}>
                    <SelectTrigger className="bg-[#002855] border-white/20 text-white">
                      <SelectValue placeholder="Select your tier" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#002855] border-white/20 text-white">
                      <SelectItem value="Basic">Basic — $1,000</SelectItem>
                      <SelectItem value="Growth">Growth — $2,500</SelectItem>
                      <SelectItem value="Elite">Elite — $5,000</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={() => simTier && enrollMutation.mutate(simTier)}
                    disabled={!simTier || enrollMutation.isPending}
                    className="bg-[#FFD700] text-[#001f3f] hover:bg-yellow-400 font-bold w-full sm:w-auto">
                    {enrollMutation.isPending ? "Activating..." : "Activate My Tracker"}
                  </Button>
                </div>
                <p className="text-white/30 text-xs mt-4">Records your investment tier and activates your live dashboard. Payment handled separately.</p>
              </CardContent>
            </Card>
          </>
        )}

        {/* Skill ROI Calculator — always visible */}
        <SkillROICalculator />

        {/* Success Story Board — always visible */}
        <SuccessStoryBoard />

      </div>
    </div>
  );
}
