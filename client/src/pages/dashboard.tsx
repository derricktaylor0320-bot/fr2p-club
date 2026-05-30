import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import type { DashboardResponse } from "@shared/schema";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatsCard } from "@/components/ui/stats-card";
import { LevelDisplay } from "@/components/ui/tier-display";
import { Users, DollarSign, TrendingUp, CheckCircle2, Heart, CreditCard, Calendar, Info, PiggyBank, Lock, Unlock, Gem, Building2, ShoppingBag, Shield, ExternalLink, Newspaper } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MusicPlayer } from "@/components/ui/music-player";
import { InstallPWA } from "@/components/InstallPWA";

import { getLoggedInMemberId } from "@/lib/auth";
const DEMO_USER_ID = getLoggedInMemberId();

const FR2P_TAGLINES = [
  "Turning Ordinary People Into Extraordinary Earners.",
  "Your One‑Stop Roadway to Multiple Streams of Income.",
  "Where Everyday People Build Lifelong Prosperity.",
  "Empowering You to Earn More, Learn Faster, and Live Freely.",
  "One Platform. Multiple Incomes. Unlimited Potential.",
  "Build It Once. Prosper for Life.",
  "The Future of Wealth Starts With You — And Starts Here.",
  "Your Shortcut to Six‑Figure Success.",
  "Invest a Year or Two. Reap the Rewards for Life.",
  "The FR2P Club: Where Ambition Meets Opportunity.",
];

function TaglineRotator() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % FR2P_TAGLINES.length);
        setVisible(true);
      }, 500);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-5 mb-2">
      {/* Tagline display */}
      <div className="relative mx-auto max-w-3xl bg-gradient-to-r from-[#001f3f] via-[#002855] to-[#001f3f] border border-[#FFD700]/30 rounded-xl px-6 py-4 shadow-lg shadow-[#FFD700]/5 overflow-hidden">
        {/* Gold accent line top */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />
        {/* Gold accent line bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />

        <p
          className="text-base md:text-lg font-bold text-[#FFD700] text-center leading-snug transition-all duration-500"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(6px)" }}
        >
          "{FR2P_TAGLINES[index]}"
        </p>

        {/* Dot indicators */}
        <div className="flex justify-center gap-1.5 mt-3">
          {FR2P_TAGLINES.map((_, i) => (
            <button
              key={i}
              onClick={() => { setVisible(false); setTimeout(() => { setIndex(i); setVisible(true); }, 300); }}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "bg-[#FFD700] w-4" : "bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { toast } = useToast();
  
  const { data: dashboardData, isLoading } = useQuery<DashboardResponse>({
    queryKey: ["/api/dashboard", DEMO_USER_ID],
  });

  const { data: savingsData, isLoading: savingsLoading } = useQuery<{
    balance: number;
    canWithdraw: boolean;
    account: any;
    transactions: any[];
  }>({
    queryKey: ["/api/savings", DEMO_USER_ID],
  });

  const handleCopyLink = async () => {
    const link = `${window.location.origin}/join/${member.id}`;
    try {
      await navigator.clipboard.writeText(link);
      toast({
        title: "Link Copied!",
        description: "Your personal club link has been copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Please manually copy the link above.",
        variant: "destructive",
      });
    }
  };

  const handleShareMobile = async () => {
    const link = `${window.location.origin}/join/${member.id}`;
    const shareData = {
      title: 'Join The FR2P Club - Financial Roadway 2 Prosperity',
      text: 'Build your financial freedom with this exclusive invite! Join The FR2P Club and start earning recurring monthly commissions through our proven 5-tier Affiliate Ambassador achievement system.',
      url: link,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for desktop - copy to clipboard
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        toast({
          title: "Share Content Copied",
          description: "Share content copied to clipboard. Paste it wherever you'd like to share!",
        });
      }
    } catch (err) {
      toast({
        title: "Share Failed",
        description: "Unable to share. Try copying the link instead.",
        variant: "destructive",
      });
    }
  };

  const handleChooseCharity = () => {
    // Navigate to resources page and open charity selection
    window.location.href = '/resources#charity';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary flex">
        <SidebarNav />
        <div className="flex-1 md:ml-64">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-card p-6 rounded-lg shadow-sm border border-border">
                    <div className="h-20 bg-muted rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-secondary flex">
        <SidebarNav />
        <div className="flex-1 md:ml-64">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-card-foreground">No data available</h2>
              <p className="text-muted-foreground">Please contact support if this issue persists.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { member, stats, recentTransactions, recentReferrals } = dashboardData;
  const commissionEligible = (dashboardData as any).commissionEligible;
  const daysUntilCommissionEligible = (dashboardData as any).daysUntilCommissionEligible;
  const accountStatus = (dashboardData as any).accountStatus;
  const gracePeriodDaysRemaining = (dashboardData as any).gracePeriodDaysRemaining;

  const levelData = [
    { level: 1, count: stats.level1Count, calculation: "Your direct referrals", color: "bg-primary" },
    { level: 2, count: stats.level2Count, calculation: `${stats.level1Count} × 5 = ${stats.level2Count}`, color: "bg-primary/80" },
    { level: 3, count: stats.level3Count, calculation: `${stats.level2Count} × 5 = ${stats.level3Count}`, color: "bg-primary/60" },
    { level: 4, count: stats.level4Count, calculation: `${stats.level3Count} × 5 = ${stats.level4Count}`, color: "bg-primary/40" },
    { level: 5, count: stats.level5Count, calculation: `${stats.level4Count} × 5 = ${stats.level5Count}`, color: "bg-primary/20" },
  ];

  return (
    <div className="min-h-screen bg-secondary flex">
      <SidebarNav />
      <div className="flex-1 md:ml-64">
        {/* Top Header with User Info */}
        <div className="bg-card border-b border-border px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-semibold text-gold-500">
                {member ? `${member.firstName} ${member.lastName}` : "Loading..."}
              </span>
              <Avatar className="h-8 w-8">
                <AvatarImage 
                  src={member?.profilePicture || undefined} 
                  alt={member ? `${member.firstName} ${member.lastName}` : "User"}
                />
                <AvatarFallback className="bg-accent text-accent-foreground text-sm font-medium">
                  {member ? `${member.firstName[0]}${member.lastName[0]}` : "JD"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Message */}
          <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">The FR2P Club Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome to the exclusive club - From paycheck to prosperity starts here</p>

          {/* ── ROTATING TAGLINES ── */}
          <TaglineRotator />
          
          {/* Membership Level Badge */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            {member.membershipLevel === 'premium' ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full shadow-lg" data-testid="badge-premium-member">
                <span className="text-sm font-bold">💎 PREMIUM MEMBER</span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">KonnectMD Access</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-lg" data-testid="badge-standard-member">
                <span className="text-sm font-bold">⭐ STANDARD MEMBER</span>
              </div>
            )}
            
            {/* Founding Member Special Status */}
            {member.isFoundingMember && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-full shadow-lg" data-testid="badge-founding-member">
                <span className="text-sm font-bold">🏆 FOUNDING MEMBER #{member.memberNumber}</span>
                <span className="text-xs bg-background/20 px-2 py-1 rounded-full">2x Rewards</span>
              </div>
            )}
          </div>
          
          {/* Commission Eligibility Status Banner */}
          {commissionEligible === false && daysUntilCommissionEligible > 0 && (
            <div className="mt-4 max-w-4xl mx-auto bg-amber-50 border-2 border-amber-400 rounded-lg p-4" data-testid="banner-commission-eligibility">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-full">
                  <Calendar className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold text-amber-800">Commission Eligibility: {daysUntilCommissionEligible} Days Remaining</p>
                  <p className="text-sm text-amber-700">
                    You need to be enrolled and paid for 2 consecutive months (60 days) before you're eligible to earn commissions. Keep building your network — your commissions will start flowing once you hit day 60!
                  </p>
                </div>
              </div>
              <div className="mt-3 bg-amber-100 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, ((60 - daysUntilCommissionEligible) / 60) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-amber-600 mt-1 text-right">{60 - daysUntilCommissionEligible} of 60 days completed</p>
            </div>
          )}

          {/* Grace Period Warning Banner */}
          {accountStatus === 'grace_period' && gracePeriodDaysRemaining > 0 && (
            <div className="mt-4 max-w-4xl mx-auto bg-red-50 border-2 border-red-400 rounded-lg p-4" data-testid="banner-grace-period">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <Shield className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-semibold text-red-800">Account Grace Period: {gracePeriodDaysRemaining} Days Left</p>
                  <p className="text-sm text-red-700">
                    Your membership has lapsed. You have {gracePeriodDaysRemaining} days to renew and pick up right where you left off. After 90 days, you'll need to rejoin as a new member.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Unified Mission Statement */}
          <div className="mt-6 max-w-4xl mx-auto relative overflow-hidden rounded-xl border border-[#FFD700]/40 shadow-xl shadow-[#FFD700]/5">
            {/* Navy gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#001f3f] via-[#002855] to-[#001020]" />
            {/* Top gold accent */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />
            {/* Bottom gold accent */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />
            {/* Corner decorations */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#FFD700]/60 rounded-tl" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#FFD700]/60 rounded-tr" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#FFD700]/60 rounded-bl" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#FFD700]/60 rounded-br" />

            <div className="relative px-8 py-6 text-center">
              <p className="text-xs font-bold tracking-[0.25em] text-[#FFD700]/70 uppercase mb-3">Our Unified Mission</p>
              <p className="text-white/95 leading-relaxed text-sm md:text-base">
                <span className="text-[#FFD700] font-bold">THE FR2P Club</span> exists to empower everyday individuals to build extraordinary income through multiple streams under one unified platform. We bridge the gap between where people are and where they want to be by providing a one‑stop wealth ecosystem that leverages innovation, AI‑driven learning, and real business opportunities.
              </p>
              <p className="text-white/90 leading-relaxed text-sm md:text-base mt-3">
                Our mission is to help members master new skills faster, create sustainable prosperity, and build <span className="text-[#FFD700] font-semibold">residual income that lasts a lifetime</span> — all through the power of community, access, and self‑investment.
              </p>
              {/* Paycheck to Paycheck catchphrase */}
              <div className="mt-5 pt-4 border-t border-[#FFD700]/20">
                <p className="text-[#FFD700] font-bold text-sm md:text-base italic">
                  "The bridge for everyone living from paycheck to paycheck —
                  until you can finally sign your own check."
                </p>
                <p className="text-white/50 text-xs mt-1 tracking-widest uppercase">The FR2P Club — Financial Roadway 2 Prosperity</p>
              </div>
            </div>
          </div>
        </div>

        {/* Get 5, Teach 5 Duplication Model */}
        <div className="mb-6 bg-gradient-to-br from-[#001f3f] to-[#003366] border-2 border-[#FFD700] rounded-lg p-6 shadow-xl">
          <div className="text-center mb-4">
            <h3 className="text-2xl font-bold text-[#FFD700]">The FR2P Club Duplication Model</h3>
            <p className="text-white/90 mt-2">Exclusive Invite-Only Community • Get 5, Teach 5</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-[#FFD700]/10 border border-[#FFD700] rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">👥</div>
              <div className="font-bold text-[#FFD700] mb-1">Find YOUR 5</div>
              <p className="text-white/80 text-sm">
                Just 5 people who share your vision
              </p>
            </div>
            <div className="bg-[#FFD700]/10 border border-[#FFD700] rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">🎓</div>
              <div className="font-bold text-[#FFD700] mb-1">Teach Them</div>
              <p className="text-white/80 text-sm">
                Show them how to find their 5
              </p>
            </div>
            <div className="bg-[#FFD700]/10 border border-[#FFD700] rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">🌟</div>
              <div className="font-bold text-[#FFD700] mb-1">Watch It Grow</div>
              <p className="text-white/80 text-sm">
                5 → 25 → 125 → 625 → 3,125
              </p>
            </div>
          </div>
          <div className="mt-4 text-center text-white/90 text-sm">
            <span className="font-semibold text-[#FFD700]">Not mass recruiting.</span> Success through leadership, mentorship & duplication.
          </div>
        </div>

        {/* Install PWA Banner */}
        <InstallPWA />
        
        {/* Consolidators Empire Banner */}
        <div className="mb-6 bg-gradient-to-r from-purple-900/80 via-[#001f3f] to-purple-900/80 border-2 border-purple-400 rounded-lg p-5 shadow-xl shadow-purple-500/10" data-testid="banner-empire">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <Badge className="bg-purple-400 text-[#001f3f] font-bold mb-1">PART OF SOMETHING BIGGER</Badge>
                <h3 className="text-xl font-bold text-purple-300">The Consolidatus Empire</h3>
                <p className="text-white/80 text-sm max-w-md">
                  Access the entire empire: Khomplete Khemistri Apparel, GuardConnect Security, Studio Business & more.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                className="bg-gradient-to-r from-purple-400 to-purple-600 text-white hover:from-purple-500 hover:to-purple-700 font-bold"
                data-testid="button-empire-dashboard"
                onClick={() => window.location.href = '/empire'}
              >
                <Building2 className="w-4 h-4 mr-2" />
                Explore Empire
              </Button>
            </div>
          </div>
        </div>

        {/* Executive Investor Tier Banner */}
        <div className="mb-6 bg-gradient-to-r from-[#001f3f] via-[#002855] to-[#001f3f] border-2 border-[#FFD700] rounded-lg p-5 shadow-xl shadow-[#FFD700]/10" data-testid="banner-executive-tier">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-full">
                <Gem className="h-8 w-8 text-[#001f3f]" />
              </div>
              <div>
                <Badge className="bg-[#FFD700] text-[#001f3f] font-bold mb-1">EXCLUSIVE PROGRAM</Badge>
                <h3 className="text-xl font-bold text-[#FFD700]">Executive Investor Tier</h3>
                <p className="text-white/80 text-sm max-w-md">
                  Become a stakeholder with elite privileges: personal concierge, bank cards, vehicle programs & more.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1">Coming Q1 2026</Badge>
              <Button 
                className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#001f3f] hover:from-[#FFC700] hover:to-[#FF9500] font-bold"
                data-testid="button-executive-tier-dashboard"
                onClick={() => window.location.href = '/executive-tier'}
              >
                <Gem className="w-4 h-4 mr-2" />
                Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* ── FOUNDING 50 TRIAL CONVERSION BANNER ── */}
        {member.isFounding50Member && member.subscriptionStatus === "trial" && (() => {
          const trialEnds = member.founding50TrialEnds ? new Date(member.founding50TrialEnds) : null;
          const daysLeft = trialEnds ? Math.max(0, Math.ceil((trialEnds.getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0;
          const isUrgent = daysLeft <= 7;
          return (
            <div className={`mb-6 relative overflow-hidden rounded-xl border-2 shadow-2xl ${isUrgent ? "border-red-400" : "border-[#FFD700]"}`}
                 style={{ background: "linear-gradient(135deg, #001f3f 0%, #002855 50%, #001f3f 100%)" }}>
              <div className="absolute inset-0 opacity-10"
                   style={{ background: "radial-gradient(ellipse at 50% 0%, #FFD700 0%, transparent 70%)" }} />
              <div className="relative z-10 p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="text-4xl">{isUrgent ? "⚠️" : "👑"}</div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className={`font-black text-base ${isUrgent ? "text-red-300" : "text-[#FFD700]"}`}>
                      {isUrgent
                        ? `⚡ Only ${daysLeft} day${daysLeft !== 1 ? "s" : ""} left on your free trial!`
                        : `👑 Founding Member Free Trial — ${daysLeft} day${daysLeft !== 1 ? "s" : ""} remaining`}
                    </h3>
                    <p className="text-white/75 text-xs mt-1">
                      {isUrgent
                        ? "Subscribe now to keep your Founding Member status, all your referrals, and your earning potential."
                        : "You're one of the First 50 — explore everything, invite your 5, then convert to a paid plan before your trial ends."}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <a href={`/join`}>
                      <Button className={`font-bold text-sm px-5 whitespace-nowrap ${isUrgent ? "bg-red-500 hover:bg-red-600 text-white" : "bg-[#FFD700] hover:bg-[#e6c200] text-[#001f3f]"}`}>
                        {isUrgent ? "🚨 Subscribe Now" : "Convert to Paid →"}
                      </Button>
                    </a>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${isUrgent ? "bg-red-400" : "bg-[#FFD700]"}`}
                    style={{ width: `${Math.max(5, (daysLeft / 30) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })()}

        {/* FR2P Wealth Monthly Magazine Banner */}
        <div className="mb-6 bg-gradient-to-r from-[#001f3f] via-[#002855] to-[#001f3f] border border-[#FFD700]/30 rounded-lg p-4 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#FFD700]/20 rounded-full">
                <Newspaper className="h-6 w-6 text-[#FFD700]" />
              </div>
              <div>
                <h3 className="font-bold text-[#FFD700] text-sm">FR2P Wealth Monthly</h3>
                <p className="text-white/70 text-xs">Free digital magazine - success stories, blueprints & resources</p>
              </div>
            </div>
            <a href="/magazine">
              <Button 
                className="bg-[#FFD700] hover:bg-[#e6c200] text-[#001f3f] font-bold text-sm px-4"
              >
                <Newspaper className="w-4 h-4 mr-1.5" />
                Subscribe Free
              </Button>
            </a>
          </div>
        </div>

        {/* Prospect Manager Banner */}
        <div className="mb-6 bg-gradient-to-r from-[#001f3f] via-[#002855] to-[#001f3f] border border-green-400/40 rounded-lg p-4 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-green-400/20 rounded-full">
                <span className="text-xl">🎯</span>
              </div>
              <div>
                <h3 className="font-bold text-green-400 text-sm">Prospect Manager — Included with Your Membership</h3>
                <p className="text-white/70 text-xs">Track warm market, cold market, names, contact info & follow-ups all in one place</p>
              </div>
            </div>
            <a href="/prospects">
              <Button className="bg-green-500 hover:bg-green-600 text-white font-bold text-sm px-4">
                🎯 Open Prospect Manager
              </Button>
            </a>
          </div>
        </div>

        {/* Personal Referral Link */}
        <div className="mb-6 bg-gradient-to-r from-navy-900 to-navy-800 border border-gold-400 rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gold-400 mb-2">📱 Your Personal Club Link</h3>
              <p className="text-sm text-cream-100 mb-3">Share this exclusive invite link from your phone or anywhere!</p>
              <div className="bg-navy-950 p-3 rounded border border-gold-400/30 font-mono text-sm text-gold-300 font-semibold">
                {window.location.origin}/join/{member.id}
              </div>
            </div>
            <div className="ml-4 space-y-2">
              <Button 
                className="bg-navy-800 hover:bg-navy-700 text-gold-400 border border-gold-400 w-full" 
                data-testid="button-copy-link"
                onClick={handleCopyLink}
              >
                📋 Copy Link
              </Button>
              <Button 
                variant="outline" 
                className="w-full text-accent border-accent hover:bg-accent/10" 
                data-testid="button-share-mobile"
                onClick={handleShareMobile}
              >
                📲 Share on Mobile
              </Button>
            </div>
          </div>
        </div>
        
        {/* Charity Giving Option */}
        <div className="mb-6 bg-card border border-border rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-card-foreground">💝 Community Impact</h3>
              <p className="text-sm text-muted-foreground">
                Optional 5% of your earnings donated to community charities - helping others while building your wealth
              </p>
            </div>
            <Button 
              variant="outline" 
              className="text-accent border-accent hover:bg-accent/10" 
              data-testid="button-enable-giving"
              onClick={handleChooseCharity}
            >
              <Heart className="w-4 h-4 mr-2" />
              Choose Charity
            </Button>
          </div>
        </div>

        {/* Membership Progress */}
        <div className="mb-6 bg-gradient-to-r from-navy-900 to-navy-800 border-2 border-gold-400 rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gold-400 text-lg mb-2">🎯 Your The FR2P Club Status</h3>
              <div className="space-y-2 text-sm">
                <div className="text-gold-200">
                  <strong className="text-gold-300">{member.isActiveMember ? 'Active' : 'Inactive'} {member.rank} Member</strong>
                </div>
                <div className="text-blue-200">
                  💰 <strong>Recurring Commissions:</strong> $5/month per referral (flat rate) + achievement bonuses at each tier milestone
                </div>
                <div className="text-blue-200">
                  🎁 <strong>Achievement Bonuses:</strong> Bronze $50, Silver $100, Gold $200, Platinum $300, Diamond $500 {member.isFoundingMember && '(2x for Founding Members!)'}
                </div>
                <div className="text-amber-200 font-semibold">
                  🏆 <strong>5-Tier Achievement System:</strong> Bronze Affiliate Ambassador → Silver Affiliate Ambassador → Gold Affiliate Ambassador → Platinum Affiliate Ambassador → Diamond Affiliate Ambassador
                </div>
                <div className="text-green-200 text-xs mt-2 bg-navy-950/50 p-2 rounded border border-gold-400/30">
                  ⏱️ <strong>Commission Hold:</strong> 1 month (30 days) with investor funding • First payout after 1 full month of membership
                </div>
              </div>
            </div>
            <Badge className="bg-gold-400 text-navy-900 font-bold text-sm px-4 py-2">
              {member.isActive ? '✓ Active' : 'Inactive'}
            </Badge>
          </div>
        </div>

        {/* Financial Asset Savings Section */}
        {(() => {
          const balanceCents = savingsData?.balance || 0;
          const balanceDollars = balanceCents / 100;
          const goalDollars = 420; // $35 × 12 months
          const progressPct = Math.min(100, (balanceDollars / goalDollars) * 100);

          // Anniversary countdown
          const joinDate = member?.joinDate ? new Date(member.joinDate) : new Date();
          const anniversaryDate = new Date(joinDate);
          anniversaryDate.setFullYear(anniversaryDate.getFullYear() + 1);
          const today = new Date();
          const daysUntilAnniversary = Math.max(0, Math.ceil((anniversaryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
          return (
            <div className="mb-6 bg-gradient-to-br from-[#001f3f] to-[#002855] border-2 border-green-400/50 rounded-xl p-6 shadow-xl shadow-green-400/10">
              <div className="flex items-center gap-3 mb-5">
                <PiggyBank className="w-7 h-7 text-green-400" />
                <div>
                  <h3 className="font-bold text-green-300 text-lg">💰 Financial Asset Savings Account</h3>
                  <p className="text-white/60 text-sm">Building your financial future — automatically, every month</p>
                </div>
                {savingsData?.canWithdraw && (
                  <Badge className="ml-auto bg-green-500 text-white animate-pulse">
                    <Unlock className="w-3 h-3 mr-1" />
                    Ready to Withdraw!
                  </Badge>
                )}
              </div>

              {/* Main stats row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                <div className="bg-white/8 rounded-xl p-4 text-center border border-white/10">
                  <div className="text-2xl font-black text-green-300" data-testid="text-savings-balance">
                    {savingsLoading ? "..." : `$${balanceDollars.toFixed(2)}`}
                  </div>
                  <div className="text-xs text-white/50 mt-1">Saved So Far</div>
                </div>
                <div className="bg-white/8 rounded-xl p-4 text-center border border-white/10">
                  <div className="text-2xl font-black text-[#FFD700]">$420</div>
                  <div className="text-xs text-white/50 mt-1">Year-End Goal</div>
                </div>
                <div className="bg-white/8 rounded-xl p-4 text-center border border-white/10">
                  <div className="text-2xl font-black text-white">{daysUntilAnniversary}</div>
                  <div className="text-xs text-white/50 mt-1">Days to Anniversary</div>
                </div>
                <div className="bg-white/8 rounded-xl p-4 text-center border border-white/10">
                  <div className="text-2xl font-black text-white">$35</div>
                  <div className="text-xs text-white/50 mt-1">Auto-saved/month</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-5">
                <div className="flex justify-between text-xs text-white/60 mb-2">
                  <span>Progress toward year-end payout</span>
                  <span className="text-green-400 font-bold">{progressPct.toFixed(0)}% of $420 goal</span>
                </div>
                <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-white/40 mt-1">
                  <span>$0</span>
                  <span className="text-[#FFD700]">🎯 {anniversaryDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} — Your Payout Date</span>
                </div>
              </div>

              {/* Bank comparison + how it works */}
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-green-900/30 border border-green-400/30 rounded-xl p-4">
                  <h4 className="text-green-300 font-bold text-sm mb-3">📈 More Than Any Bank Gives You</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Average bank savings rate</span>
                      <span className="text-white/60">~0.5% APY on $420 = <span className="text-red-400 font-bold">$2.10/yr</span></span>
                    </div>
                    <div className="h-px bg-white/10" />
                    <div className="flex justify-between">
                      <span className="text-white/70 font-semibold">Your FR2P savings</span>
                      <span className="text-green-400 font-black">potential $420/yr in savings</span>
                    </div>
                  </div>
                  <p className="text-xs text-green-400/70 mt-2">
                    That's 200× what a traditional savings account returns. And it pays your annual membership too.
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <h4 className="text-[#FFD700] font-bold text-sm mb-3">⚙️ How It Works</h4>
                  <div className="space-y-1.5 text-xs text-white/70">
                    <div className="flex items-start gap-2">
                      <span className="text-green-400 font-bold shrink-0">1.</span>
                      Reach 14 locked-in referrals ($70+/month commission)
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-400 font-bold shrink-0">2.</span>
                      $35 is automatically moved to your savings each month
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-400 font-bold shrink-0">3.</span>
                      On your membership anniversary date, $420 is released to you
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-400 font-bold shrink-0">4.</span>
                      That $420 covers your entire annual membership — you're now in for free
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  className="border-green-400/40 text-green-300 hover:bg-green-400/10 text-sm"
                  data-testid="button-view-savings"
                >
                  <PiggyBank className="w-4 h-4 mr-2" />
                  View Full History
                </Button>
                {savingsData?.canWithdraw && (
                  <Button
                    className="bg-green-500 hover:bg-green-400 text-white font-bold text-sm"
                    data-testid="button-withdraw-savings"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Withdraw $420 Now
                  </Button>
                )}
                {!savingsData?.canWithdraw && (
                  <div className="flex items-center gap-2 text-white/40 text-xs">
                    <Lock className="w-3 h-3" />
                    Locked until {anniversaryDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} · {daysUntilAnniversary} days remaining
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Available Earnings"
            value={`$${(recentTransactions.filter(t => (t.type === 'commission' || t.type === 'bonus') && t.status === 'available')
              .reduce((sum, t) => sum + t.amount, 0) / 100).toFixed(2)}`}
            icon={DollarSign}
            iconColor="text-green-500"
            valueColor="text-gray-900"
          />
          <StatsCard
            title="Pending (1-Month Hold)"
            value={`$${(recentTransactions.filter(t => (t.type === 'commission' || t.type === 'bonus') && t.status === 'holding')
              .reduce((sum, t) => sum + t.amount, 0) / 100).toFixed(2)}`}
            icon={CreditCard}
            iconColor="text-yellow-500"
            valueColor="text-gray-900"
          />
          <StatsCard
            title="Locked-In Referrals"
            value={(member.permanentReferralCount || stats.totalReferrals || 0).toLocaleString()}
            icon={Users}
            iconColor="text-primary"
          />
          <StatsCard
            title="Current Rank"
            value={member.rank}
            icon={TrendingUp}
            iconColor="text-yellow-500"
          />
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="text-white text-sm h-4 w-4" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Status</p>
                <p className={`text-lg font-semibold ${member.isActive ? 'text-green-500' : 'text-yellow-500'}`}>
                  {member.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Permanent Residual Income Banner */}
        <div className="mb-6 bg-gradient-to-r from-green-900 to-emerald-800 border-2 border-green-400 rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-400/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Lock className="h-5 w-5 text-green-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-green-300 font-bold text-sm uppercase tracking-wide">Permanent Residual Income</h3>
              <p className="text-white/80 text-xs mt-0.5">
                Each active referral contributes $5 to your monthly volume — <strong className="text-green-300">permanently locked in</strong>. 
                {(member.permanentReferralCount || stats.totalReferrals || 0) > 0 
                  ? ` Current monthly volume: $${((member.permanentReferralCount || stats.totalReferrals || 0) * 5).toFixed(2)} from ${member.permanentReferralCount || stats.totalReferrals || 0} active referral${(member.permanentReferralCount || stats.totalReferrals || 0) > 1 ? 's' : ''}.`
                  : ' Refer your first member to start building your monthly volume.'}
              </p>
            </div>
            {(member.permanentReferralCount || stats.totalReferrals || 0) > 0 && (
              <div className="text-right flex-shrink-0">
                <div className="text-green-300 text-xl font-bold">${((member.permanentReferralCount || stats.totalReferrals || 0) * 5).toFixed(2)}</div>
                <div className="text-green-400/70 text-xs">/month forever</div>
              </div>
            )}
          </div>
        </div>

        {/* Annual Membership Upgrade (Preferred) */}
        <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-green-900 flex items-center gap-2">
                💰 Upgrade to Annual Membership (Preferred) - Save 17%!
              </h3>
              <p className="text-sm text-green-700 mt-1">
                <strong>Pay $350/year instead of $420</strong> (monthly payments) and save $70 annually! 
                Annual members get priority support and locked-in rates.
              </p>
            </div>
            <div className="text-center">
              <div className="text-xs text-green-600 font-medium mb-1">Currently: Monthly ($35/month)</div>
              <Button className="bg-green-600 hover:bg-green-700 text-white" data-testid="button-upgrade-annual">
                Upgrade to Annual
              </Button>
            </div>
          </div>
        </div>

        {/* Spillover Tier System - "Where Effort Meets Reward" */}
        <div className="mb-6 bg-gradient-to-r from-navy-50 to-cream-50 border border-navy-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-navy-900 flex items-center gap-2">
                🏆 FR2P Spillover System: "Where Effort Meets Reward"
              </h3>
              <div className="text-sm text-navy-700 mt-1">
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className={`p-2 rounded border ${member.isActiveMember ? 'bg-green-100 border-green-300' : 'bg-gray-100 border-gray-300'}`}>
                    <div className="font-medium">Active Members</div>
                    <div className="text-xs">Monthly engagement required</div>
                    <div className="font-bold text-green-700">{member.isFoundingMember ? '10%' : '5%'} Spillover Rate</div>
                  </div>
                  <div className={`p-2 rounded border ${!member.isActiveMember ? 'bg-yellow-100 border-yellow-300' : 'bg-gray-100 border-gray-300'}`}>
                    <div className="font-medium">Inactive Members</div>
                    <div className="text-xs">Baseline participation</div>
                    <div className="font-bold text-yellow-700">{member.isFoundingMember ? '4%' : '2%'} Spillover Rate</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="ml-4 text-center">
              <div className={`text-xs font-bold mb-1 ${member.isActiveMember ? 'text-green-600' : 'text-yellow-600'}`}>
                Your Status: {member.isActiveMember ? 'ACTIVE' : 'INACTIVE'}
              </div>
              <div className={`text-lg font-bold ${member.isActiveMember ? 'text-green-700' : 'text-yellow-700'}`}>
                {member.isFoundingMember 
                  ? (member.isActiveMember ? '10%' : '4%')
                  : (member.isActiveMember ? '5%' : '2%')
                } Spillover
              </div>
            </div>
          </div>
        </div>

        {/* Commission Holding Period Notice */}
        <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-green-900 flex items-center gap-2">
                ⏰ Commission Holding Period - Investor-Funded Advantage
              </h3>
              <p className="text-sm text-green-700 mt-1">
                <strong>🎉 With investor funding: New commissions are held for just 1 month (30 days)</strong> to ensure sufficient funds from membership payments before payout. 
                This protects the platform's cash flow and helps ensure members receive their earnings. <span className="font-semibold text-green-800">Join early to help us secure this funding and get faster payouts!</span>
              </p>
            </div>
            <div className="text-center">
              <div className="text-xs text-green-600 font-medium mb-1">ACH Banking Required for Payouts</div>
              <Button variant="outline" className="text-green-600 border-green-300 hover:bg-green-50 font-semibold" data-testid="button-add-banking">
                Add Banking Info
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Referral Network Structure */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-navy-900 to-navy-800 rounded-lg shadow-lg border border-gold-400 p-6">
              <h2 className="text-lg font-semibold text-gold-400 mb-6">Referral Network Structure</h2>
              
              <div className="space-y-4">
                {levelData.map((level) => (
                  <LevelDisplay key={level.level} {...level} />
                ))}
              </div>

              <div className="mt-6 p-4 bg-navy-950 rounded-lg border border-gold-400">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gold-400">Total Referral Network:</span>
                  <span className="text-2xl font-bold text-gold-400">
                    {stats.totalReferrals.toLocaleString()} affiliates
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Activation Progress */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Activation Progress</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Direct Referrals</span>
                    <span className="text-sm text-gray-600">{stats.level1Count}/5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${Math.min((stats.level1Count / 5) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className={`p-3 rounded-lg border ${member.isActive ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                  <div className="flex items-center">
                    <CheckCircle2 className={`${member.isActive ? 'text-green-500' : 'text-yellow-500'} mr-2 h-4 w-4`} />
                    <span className={`text-sm font-medium ${member.isActive ? 'text-green-700' : 'text-yellow-700'}`}>
                      {member.isActive ? 'Active Affiliate - Earning Commissions' : 'Working Towards Activation'}
                    </span>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <p className="text-sm text-gray-600 mb-2">Next Goal:</p>
                  <p className="font-semibold text-gray-900">
                    {member.isActive ? 'Help Your Referrals Succeed' : 'Build Your Referral Network'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Affiliate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentReferrals.map((referral: DashboardResponse['recentReferrals'][0]) => (
                    <tr key={referral.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                            <span className="text-gray-700 text-sm font-medium">
                              {referral.firstName[0]}{referral.lastName[0]}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {referral.firstName} {referral.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="secondary">Level {referral.level}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={referral.isActive ? "default" : "secondary"}>
                          {referral.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(referral.joinDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$35.00</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Music Player and Commission Payment Information */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Music Player */}
          <div>
            <MusicPlayer />
          </div>

          {/* Commission Payment Information */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-navy-600" />
                  Commission Payment Schedule
                </CardTitle>
                <CardDescription>
                  Get paid for your hard work building your FR2P network
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-cream-50 dark:bg-navy-950 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-navy-600 dark:text-navy-400 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-navy-900 dark:text-navy-100 mb-2">
                          Monthly Commission Payments
                        </h3>
                        <p className="text-navy-800 dark:text-navy-200 mb-3">
                          All earned commissions are paid monthly on the <strong>last day of each month</strong>. 
                          Payments are processed via ACH transfer and typically take 1-3 business days to appear in your account.
                        </p>
                        <ul className="text-sm text-navy-700 dark:text-navy-300 space-y-1">
                          <li>• $5/month per referral (flat rate, unlimited)</li>
                          <li>• Direct referrals only (FTC compliant)</li>
                          <li>• Achievement bonuses: $50-$500 per tier milestone</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-8 w-8 text-gray-400" />
                      <div>
                        <h4 className="font-medium text-gray-900">Banking Information Required</h4>
                        <p className="text-sm text-gray-600">
                          Set up your ACH banking details to receive commission payments on time
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <a href="/profile" className="flex items-center gap-2">
                        Setup Banking
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
