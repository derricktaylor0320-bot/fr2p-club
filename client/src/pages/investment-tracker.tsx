import { HeaderNav } from "@/components/ui/header-nav";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { MemberResponse, HustleInvestment } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import {
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  Circle,
  Brain,
  Users,
  Zap,
  Target,
  BarChart3,
  Rocket,
  Crown,
  ArrowRight,
  Calendar,
  PieChart,
  Star,
} from "lucide-react";
import { getLoggedInMemberId } from "@/lib/auth";
import { Link } from "wouter";

const DEMO_USER_ID = getLoggedInMemberId();

const TIER_CONFIG = {
  Basic: {
    amount: 1000,
    color: "text-blue-400",
    border: "border-blue-400",
    badge: "bg-blue-500",
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
    amount: 2500,
    color: "text-[#FFD700]",
    border: "border-[#FFD700]",
    badge: "bg-[#FFD700] text-[#001f3f]",
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
    amount: 5000,
    color: "text-purple-400",
    border: "border-purple-400",
    badge: "bg-purple-600",
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

function daysSince(date: string | Date) {
  return Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
}

function formatMoney(cents: number) {
  return `$${(cents / 100).toLocaleString()}`;
}

function ROISimulator() {
  const [tier, setTier] = useState<keyof typeof TIER_CONFIG>("Growth");
  const cfg = TIER_CONFIG[tier];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-white font-medium">Simulate your tier:</span>
        {(Object.keys(TIER_CONFIG) as (keyof typeof TIER_CONFIG)[]).map(t => (
          <button
            key={t}
            onClick={() => setTier(t)}
            className={`px-5 py-2 rounded-full font-bold text-sm border-2 transition-all ${tier === t ? `${TIER_CONFIG[t].border} ${TIER_CONFIG[t].color} bg-white/10` : "border-white/20 text-white/50 hover:border-white/40"}`}
          >
            {t} — ${TIER_CONFIG[t].amount.toLocaleString()}
          </button>
        ))}
      </div>

      {/* Allocation Breakdown */}
      <div>
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <PieChart className="h-5 w-5 text-[#FFD700]" /> Where Your Investment Goes
        </h3>
        <div className="space-y-3">
          {cfg.allocation.map((a) => (
            <div key={a.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white/80">{a.label}</span>
                <span className="text-white font-bold">{a.pct}% — ${(cfg.amount * a.pct / 100).toLocaleString()}</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full ${a.color} rounded-full transition-all duration-700`} style={{ width: `${a.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ROI Projections */}
      <div>
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-[#FFD700]" /> Estimated Monthly Income Potential
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "6 Months", range: cfg.roiProjections.m6, color: "border-blue-400" },
            { label: "12 Months", range: cfg.roiProjections.m12, color: "border-[#FFD700]" },
            { label: "24 Months", range: cfg.roiProjections.m24, color: "border-emerald-400" },
          ].map((proj) => (
            <div key={proj.label} className={`bg-[#001f3f] border-2 ${proj.color} rounded-xl p-4 text-center`}>
              <div className="text-white/60 text-xs mb-1">{proj.label}</div>
              <div className="text-white font-bold text-sm">${proj.range[0].toLocaleString()}</div>
              <div className="text-white/40 text-xs">to</div>
              <div className="text-emerald-400 font-bold">${proj.range[1].toLocaleString()}/mo</div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-start gap-2">
          <Star className="h-4 w-4 text-[#FFD700] mt-0.5 flex-shrink-0" />
          <p className="text-white/40 text-xs">
            Projections based on members applying the system consistently. Results vary by effort, skill track, and market. Not a guarantee of income.
          </p>
        </div>
      </div>

      {/* Turnaround */}
      <div className="bg-[#001f3f] border border-[#FFD700]/30 rounded-xl p-5">
        <h3 className="text-white font-bold mb-3 flex items-center gap-2">
          <Clock className="h-5 w-5 text-[#FFD700]" /> Expected Turnaround Time
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-[#FFD700] text-2xl font-bold">30–60</div>
            <div className="text-white/60 text-xs">days to first asset launched</div>
          </div>
          <div>
            <div className="text-emerald-400 text-2xl font-bold">90–120</div>
            <div className="text-white/60 text-xs">days to first revenue</div>
          </div>
          <div>
            <div className="text-purple-400 text-2xl font-bold">{cfg.timelineMonths}</div>
            <div className="text-white/60 text-xs">months full roadmap</div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
      toast({ title: "Phase advanced!", description: "Your investment tracker has been updated." });
    },
  });

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-[#001f3f] border border-white/10">
          <CardContent className="p-4 text-center">
            <DollarSign className="h-6 w-6 text-[#FFD700] mx-auto mb-1" />
            <div className={`text-2xl font-bold ${cfg.color}`}>{formatMoney(investment.amount)}</div>
            <div className="text-white/50 text-xs">Invested</div>
          </CardContent>
        </Card>
        <Card className="bg-[#001f3f] border border-white/10">
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-blue-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-white">{days}</div>
            <div className="text-white/50 text-xs">Days Active</div>
          </CardContent>
        </Card>
        <Card className="bg-[#001f3f] border border-white/10">
          <CardContent className="p-4 text-center">
            <Target className="h-6 w-6 text-emerald-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-emerald-400">Phase {investment.currentPhase}</div>
            <div className="text-white/50 text-xs">{PHASES[investment.currentPhase - 1]?.name}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#001f3f] border border-white/10">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-purple-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-purple-400">{phasePct}%</div>
            <div className="text-white/50 text-xs">Journey Complete</div>
          </CardContent>
        </Card>
      </div>

      {/* Fund Allocation */}
      <div>
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <PieChart className="h-5 w-5 text-[#FFD700]" /> Your Fund Allocation
        </h3>
        <div className="space-y-3">
          {cfg.allocation.map((a) => (
            <div key={a.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white/80">{a.label}</span>
                <span className="text-white font-bold">{a.pct}% · ${(investment.amount / 100 * a.pct / 100 * 100).toFixed(0) !== String(Math.round(investment.amount / 100 * a.pct / 100)) ? `${Math.round(investment.amount / 100 * a.pct / 100).toLocaleString()}` : `${Math.round(investment.amount / 100 * a.pct / 100).toLocaleString()}`}</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full ${a.color} rounded-full`} style={{ width: `${a.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ROI Projections */}
      <div>
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-[#FFD700]" /> Your Projected Returns
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "6 Months", range: cfg.roiProjections.m6, color: "border-blue-400", done: days >= 180 },
            { label: "12 Months", range: cfg.roiProjections.m12, color: "border-[#FFD700]", done: days >= 365 },
            { label: "24 Months", range: cfg.roiProjections.m24, color: "border-emerald-400", done: days >= 730 },
          ].map((proj) => (
            <div key={proj.label} className={`bg-[#001f3f] border-2 ${proj.color} rounded-xl p-4 text-center relative`}>
              {proj.done && <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs">Reached!</Badge>}
              <div className="text-white/60 text-xs mb-1">{proj.label}</div>
              <div className="text-white text-sm font-bold">${proj.range[0].toLocaleString()}</div>
              <div className="text-white/30 text-xs">to</div>
              <div className="text-emerald-400 font-bold">${proj.range[1].toLocaleString()}/mo</div>
            </div>
          ))}
        </div>
        <p className="text-white/30 text-xs mt-3">* Potential monthly income ranges. Not a guarantee of returns. Results depend on effort and consistency.</p>
      </div>

      {/* Phase Timeline */}
      <div>
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-[#FFD700]" /> Your Journey Timeline
        </h3>
        <div className="space-y-3">
          {PHASES.map((phase) => {
            const done = investment.currentPhase > phase.num;
            const active = investment.currentPhase === phase.num;
            return (
              <div key={phase.num} className={`flex gap-4 items-start p-4 rounded-xl border transition-all ${active ? "border-[#FFD700]/60 bg-[#FFD700]/5" : done ? "border-emerald-500/30 bg-emerald-500/5" : "border-white/10 bg-white/2"}`}>
                <div className={`rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 ${done ? "bg-emerald-500" : active ? "bg-[#FFD700]" : "bg-white/10"}`}>
                  {done ? <CheckCircle className="h-5 w-5 text-white" /> : active ? <Zap className="h-5 w-5 text-[#001f3f]" /> : <Circle className="h-5 w-5 text-white/30" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
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
          <Button
            onClick={() => advanceMutation.mutate()}
            disabled={advanceMutation.isPending}
            className="mt-4 bg-[#FFD700] text-[#001f3f] hover:bg-yellow-400 font-bold"
          >
            Mark Phase {investment.currentPhase + 1} Started <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Turnaround Summary */}
      <Card className="bg-[#001f3f] border border-[#FFD700]/30">
        <CardContent className="p-6">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#FFD700]" /> Turnaround Summary
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className={`text-2xl font-bold ${days >= 60 ? "text-emerald-400" : "text-white"}`}>{days >= 60 ? "✓" : `${60 - days}d`}</div>
              <div className="text-white/50 text-xs">Days to first asset launch</div>
              <div className="text-white/30 text-xs mt-1">Goal: 60 days</div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${days >= 120 ? "text-emerald-400" : "text-white"}`}>{days >= 120 ? "✓" : `${Math.max(0, 120 - days)}d`}</div>
              <div className="text-white/50 text-xs">Days to first revenue</div>
              <div className="text-white/30 text-xs mt-1">Goal: 120 days</div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${cfg.color}`}>{cfg.timelineMonths} mo</div>
              <div className="text-white/50 text-xs">Full roadmap timeline</div>
              <div className="text-white/30 text-xs mt-1">{investment.tier} tier</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function InvestmentTracker() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [simTier, setSimTier] = useState<string>("");

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
        memberId: DEMO_USER_ID,
        tier,
        amount: amounts[tier],
        status: "active",
        currentPhase: 1,
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

      <div className="max-w-5xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <div>
              <Badge className="bg-purple-600 text-white font-bold mb-3">BACK OFFICE</Badge>
              <h1 className="text-4xl font-bold text-[#FFD700] flex items-center gap-3">
                <BarChart3 className="h-9 w-9" />
                My Investment Tracker
              </h1>
              <p className="text-white/70 mt-2">
                See exactly where your investment went, what it's projected to return, and where you are in your journey.
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

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-white/50 text-lg">Loading your tracker...</div>
          </div>
        ) : investment ? (
          <ActiveTracker investment={investment} />
        ) : (
          <div className="space-y-10">
            {/* Not yet enrolled — show simulator + enroll option */}
            <Card className="bg-[#001f3f] border border-[#FFD700]/30">
              <CardHeader>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <CardTitle className="text-[#FFD700] text-2xl mb-1">No Active Investment Yet</CardTitle>
                    <p className="text-white/60">Once you enroll in the Side Hustle Incubator, this page becomes your live ROI dashboard. Use the simulator below to preview what you'd see.</p>
                  </div>
                  <Badge className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">Preview Mode</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <ROISimulator />
              </CardContent>
            </Card>

            {/* Quick Enroll CTA */}
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
                  <Button
                    onClick={() => simTier && enrollMutation.mutate(simTier)}
                    disabled={!simTier || enrollMutation.isPending}
                    className="bg-[#FFD700] text-[#001f3f] hover:bg-yellow-400 font-bold w-full sm:w-auto"
                  >
                    {enrollMutation.isPending ? "Activating..." : "Activate My Tracker"}
                  </Button>
                </div>
                <p className="text-white/30 text-xs mt-4">This records your investment tier and activates your live dashboard. Payment is handled separately.</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
