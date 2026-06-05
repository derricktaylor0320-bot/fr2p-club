import { SidebarNav } from "@/components/ui/sidebar-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Gift,
  Target,
  Award,
  Star,
  Percent,
  ArrowRight,
  Crown,
  Zap,
  Gem,
  Building2,
  Car,
  Briefcase,
  UserCheck,
  Home,
  Calendar,
  Lock
} from "lucide-react";

import { getLoggedInMemberId } from "@/lib/auth";
const DEMO_USER_ID = getLoggedInMemberId();

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  memberNumber: number;
  isFoundingMember: boolean;
}

export default function CompensationPlan() {
  // Get member data for founding member status from dashboard endpoint
  const { data: dashboardData } = useQuery({
    queryKey: ["/api/dashboard", DEMO_USER_ID],
  });

  const member = (dashboardData as any)?.member as Member | undefined;
  const isFoundingMember = member?.isFoundingMember || false;

  return (
    <div className="min-h-screen bg-secondary flex">
      <SidebarNav />
      <div className="flex-1 md:ml-64">
        {/* Top Header with User Info */}
        <div className="bg-card border-b border-border px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">Compensation Plan</h1>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-muted-foreground">
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
        
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Crown className="h-12 w-12 text-accent mr-3" />
            <h1 className="text-4xl font-bold text-primary">FR2P Compensation Plan</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Build your financial roadway to prosperity through our simple, transparent $5 flat commission model
          </p>
          
          <div className="mt-6 max-w-2xl mx-auto bg-gradient-to-r from-green-900/80 to-emerald-800/80 border-2 border-green-400 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Lock className="h-5 w-5 text-green-400" />
              <span className="text-green-300 font-bold text-lg uppercase tracking-wide">Recurring Commission Income</span>
              <Lock className="h-5 w-5 text-green-400" />
            </div>
            <p className="text-white/90 text-sm">
              Once you refer someone and they make their first payment, that $5 commission is <strong className="text-green-300">recorded on first payment</strong>. 
              Your commission activity is tied to your referral efforts — each active referral contributes $5 to your monthly volume.
              Actual results vary based on individual effort and referral activity.
            </p>
          </div>
          
          {isFoundingMember && (
            <div className="mt-6 inline-flex items-center px-6 py-3 bg-gradient-to-r from-accent to-yellow-400 text-primary rounded-full font-semibold">
              <Star className="h-5 w-5 mr-2" />
              FOUNDING MEMBER - 2x Enhanced Rewards
            </div>
          )}
        </div>

        {/* Commission Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card data-testid="card-direct-referrals">
            <CardHeader>
              <div className="flex items-center">
                <div className="p-2 bg-primary rounded-lg mr-3">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle>Direct Referrals</CardTitle>
                  <CardDescription>Earn from every person you personally refer</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <div className="text-lg font-bold text-primary mb-1">Simple $5 Flat Commission</div>
                  <div className="text-xs text-muted-foreground">Same rate for everyone - unlimited referrals</div>
                </div>
                <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 border-2 border-green-500 rounded-lg p-6 text-center">
                  <div className="text-5xl font-bold text-primary mb-2">$5</div>
                  <div className="text-lg text-muted-foreground font-medium">per referral / month</div>
                  <div className="mt-3 text-sm text-green-600 font-semibold">Recurring • Unlimited • FTC Compliant</div>
                  <div className="mt-2 text-xs text-green-700 font-medium flex items-center justify-center gap-1">
                    <Lock className="h-3 w-3" /> Recorded on first payment — results vary by effort
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center text-sm mt-4">
                  <div className="bg-accent/10 rounded-lg p-3">
                    <div className="font-bold text-accent">5 Refs</div>
                    <div className="text-lg font-bold text-primary">$25/mo</div>
                  </div>
                  <div className="bg-accent/10 rounded-lg p-3">
                    <div className="font-bold text-accent">10 Refs</div>
                    <div className="text-lg font-bold text-primary">$50/mo</div>
                  </div>
                  <div className="bg-accent/10 rounded-lg p-3">
                    <div className="font-bold text-accent">25 Refs</div>
                    <div className="text-lg font-bold text-primary">$125/mo</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-achievement-bonuses-summary">
            <CardHeader>
              <div className="flex items-center">
                <div className="p-2 bg-accent rounded-lg mr-3">
                  <Gift className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <CardTitle>Achievement Bonuses</CardTitle>
                  <CardDescription>Unlock one-time bonuses at each tier</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-amber-700/10 rounded">
                  <span className="text-sm font-medium text-amber-600">🥉 Bronze (5 refs)</span>
                  <span className="font-bold text-primary">${isFoundingMember ? '100' : '50'}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-400/10 rounded">
                  <span className="text-sm font-medium text-slate-600">🥈 Silver (10 refs)</span>
                  <span className="font-bold text-primary">${isFoundingMember ? '200' : '100'}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-yellow-400/10 rounded">
                  <span className="text-sm font-medium text-yellow-600">🥇 Gold (15 refs)</span>
                  <span className="font-bold text-primary">${isFoundingMember ? '400' : '200'}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-cyan-400/10 rounded">
                  <span className="text-sm font-medium text-cyan-600">💠 Platinum (20 refs)</span>
                  <span className="font-bold text-primary">${isFoundingMember ? '600' : '300'}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-blue-400/10 rounded">
                  <span className="text-sm font-medium text-blue-600">💎 Diamond (25 refs)</span>
                  <span className="font-bold text-primary">${isFoundingMember ? '1,000' : '500'}</span>
                </div>

                {isFoundingMember && (
                  <div className="bg-accent/10 p-3 rounded-lg mt-3">
                    <div className="text-xs text-accent-foreground font-semibold text-center">
                      <Zap className="h-4 w-4 inline mr-1" />
                      Founding Member 2x Bonuses Active!
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Residual Income Chart - Monthly Recurring Earnings */}
        <Card className="mb-12 bg-gradient-to-br from-navy-900 to-navy-800 border-2 border-gold-400" data-testid="card-residual-income">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              {isFoundingMember ? (
                <>
                  <Badge className="bg-green-600 text-white px-3 py-1">$16-$22 FOUNDING MEMBER RATE</Badge>
                  <Badge className="bg-amber-600 text-white px-3 py-1">3-4x MORE!</Badge>
                </>
              ) : (
                <Badge className="bg-green-600 text-white px-3 py-1">$5 FLAT RATE</Badge>
              )}
              <Badge className="bg-navy-700 text-gold-400 border border-gold-400 px-3 py-1">Direct Referrals Only</Badge>
            </div>
            <CardTitle className="text-2xl text-gold-400">💰 Simple Recurring Income Calculator</CardTitle>
            <CardDescription className="text-white/80 text-base">
              Each active referral contributes $5 to your monthly volume — locked in permanently once they join
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-navy-950">
                    <th className="p-3 text-left text-gold-400 font-bold border-b-2 border-gold-400">Referrals</th>
                    <th className="p-3 text-center text-gold-400 font-bold border-b-2 border-gold-400">Rate/Referral</th>
                    <th className="p-3 text-center text-gold-400 font-bold border-b-2 border-gold-400">Monthly Recurring</th>
                    <th className="p-3 text-center text-gold-400 font-bold border-b-2 border-gold-400">Yearly Total</th>
                    <th className="p-3 text-center text-gold-400 font-bold border-b-2 border-gold-400">Achievement Tier</th>
                    <th className="p-3 text-center text-gold-400 font-bold border-b-2 border-gold-400">One-Time Bonus</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { refs: 5, tier: 'Bronze', standardRate: 5, fmRate: 16, bonus: isFoundingMember ? 100 : 50, color: 'text-amber-400', bgRow: 'bg-amber-900/20' },
                    { refs: 10, tier: 'Silver', standardRate: 5, fmRate: 18, bonus: isFoundingMember ? 200 : 100, color: 'text-slate-300', bgRow: 'bg-slate-700/20' },
                    { refs: 15, tier: 'Gold', standardRate: 5, fmRate: 19, bonus: isFoundingMember ? 400 : 200, color: 'text-yellow-400', bgRow: 'bg-yellow-900/20' },
                    { refs: 20, tier: 'Platinum', standardRate: 5, fmRate: 20, bonus: isFoundingMember ? 600 : 300, color: 'text-cyan-300', bgRow: 'bg-cyan-900/20' },
                    { refs: 25, tier: 'Diamond', standardRate: 5, fmRate: 22, bonus: isFoundingMember ? 1000 : 500, color: 'text-blue-300', bgRow: 'bg-blue-900/20' },
                  ].map((row) => {
                    const rate = isFoundingMember ? row.fmRate : row.standardRate;
                    const monthly = row.refs * rate;
                    const yearly = monthly * 12;
                    return (
                      <tr key={row.tier} className={`${row.bgRow} border-b border-gold-400/30`}>
                        <td className={`p-3 font-bold ${row.color} text-sm`}>{row.refs} Referrals</td>
                        <td className="p-3 text-center text-green-400 font-bold">${rate}<span className="text-white/60 text-xs">/ea</span></td>
                        <td className="p-3 text-center text-white font-bold text-lg">${monthly}<span className="text-white/60 text-xs">/mo</span></td>
                        <td className="p-3 text-center text-green-400 font-semibold">${yearly.toLocaleString()}<span className="text-white/60 text-xs">/yr</span></td>
                        <td className={`p-3 text-center font-bold ${row.color}`}>{row.tier}</td>
                        <td className="p-3 text-center text-amber-400 font-bold">+${row.bonus}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-navy-950 p-4 rounded-lg border border-gold-400/50 text-center">
                <div className="text-green-400 font-bold text-lg mb-1">🔄 Recurring</div>
                <div className="text-white/80 text-sm">{isFoundingMember ? '$16-$22' : '$5'} per referral, every month</div>
              </div>
              <div className="bg-navy-950 p-4 rounded-lg border border-gold-400/50 text-center">
                <div className="text-gold-400 font-bold text-lg mb-1">👤 Direct Only</div>
                <div className="text-white/80 text-sm">Your personal referrals (FTC compliant)</div>
              </div>
              <div className="bg-navy-950 p-4 rounded-lg border border-gold-400/50 text-center">
                <div className="text-amber-400 font-bold text-lg mb-1">🎯 Bonuses</div>
                <div className="text-white/80 text-sm">Unlock perks at each tier milestone</div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-green-900/50 to-green-800/50 rounded-lg border border-green-500/50 text-center">
              <p className="text-green-300 font-semibold text-lg">
                ✨ One-Time Referral Work → Monthly Residual Paycheck ✨
              </p>
              <p className="text-white/70 text-sm mt-1">
                You refer them once, you get paid a recurring {isFoundingMember ? '$16-$22' : '$5'} commission each active month — based on your referral activity and effort.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 5-Tier Achievement System */}
        <Card className="mb-12 bg-gradient-to-br from-blue-900 to-blue-800 border-amber-400/30" data-testid="card-tier-system">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-amber-300">Achievement Tier System & Bonuses</CardTitle>
            <CardDescription className="text-white/80">
              Advance through tiers as you grow and unlock exclusive one-time bonuses and perks
              {isFoundingMember && <span className="text-green-400 ml-2">(Showing YOUR Founding Member rates!)</span>}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              {[
                { name: 'Bronze', refs: 5, standardRate: 5, fmRate: 16, bonus: isFoundingMember ? 100 : 50, bg: 'bg-amber-700/30', border: 'border-amber-600' },
                { name: 'Silver', refs: 10, standardRate: 5, fmRate: 18, bonus: isFoundingMember ? 200 : 100, bg: 'bg-slate-500/30', border: 'border-slate-400' },
                { name: 'Gold', refs: 15, standardRate: 5, fmRate: 19, bonus: isFoundingMember ? 400 : 200, bg: 'bg-yellow-500/30', border: 'border-yellow-400' },
                { name: 'Platinum', refs: 20, standardRate: 5, fmRate: 20, bonus: isFoundingMember ? 600 : 300, bg: 'bg-cyan-500/30', border: 'border-cyan-400' },
                { name: 'Diamond', refs: 25, standardRate: 5, fmRate: 22, bonus: isFoundingMember ? 1000 : 500, bg: 'bg-blue-500/30', border: 'border-blue-400' },
              ].map((tier) => {
                const rate = isFoundingMember ? tier.fmRate : tier.standardRate;
                const monthly = tier.refs * rate;
                return (
                  <div 
                    key={tier.name} 
                    className={`text-center p-4 rounded-lg border-2 ${tier.border} ${tier.bg}`}
                    data-testid={`tier-${tier.name.toLowerCase()}`}
                  >
                    <div className="text-lg font-bold text-amber-300 mb-1">{tier.name}</div>
                    <div className="text-2xl font-bold text-white mb-1">{tier.refs} refs</div>
                    <div className="text-xs text-green-300 mb-1">${rate}/ea</div>
                    <div className="text-sm text-green-400 font-bold">${monthly}/mo</div>
                    <div className="mt-2 bg-black/30 rounded p-1">
                      <div className="text-sm text-amber-400 font-bold">+${tier.bonus}</div>
                      <div className="text-xs text-white/60">one-time bonus</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-center text-white/70 text-sm">
              {isFoundingMember 
                ? 'Founding Members earn a $16-$22 commission per successfully referred member. Standard members earn a $5 commission per referral.'
                : 'Earn a $5 commission for every successfully referred member. Achievement bonuses are one-time rewards at each milestone!'
              }
            </div>
            
            {/* How It Works - Detailed Example */}
            <div className="mt-8 p-6 bg-gradient-to-br from-navy-800 to-navy-700 rounded-lg border-2 border-gold-400">
              <h3 className="font-semibold text-2xl mb-6 text-center text-amber-300">💡 How It Works - Real Example</h3>
              <div className="space-y-4 text-white/90">
                <div className="bg-navy-900 p-4 rounded-lg border border-gold-500">
                  <div className="flex items-start">
                    <ArrowRight className="h-5 w-5 mr-3 text-amber-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-amber-300 mb-1">Step 1: You Refer John</p>
                      <p className="text-sm">John joins with $35/month membership → <strong className="text-amber-400">John's active enrollment contributes $5 to your monthly volume</strong></p>
                      <p className="text-xs text-white/70 mt-1">💰 Once John's commission is recorded, each active referral contributes $5 to your monthly volume based on active status.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-navy-900 p-4 rounded-lg border border-gold-500">
                  <div className="flex items-start">
                    <ArrowRight className="h-5 w-5 mr-3 text-amber-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-amber-300 mb-1">Step 2: You Get 5 Referrals (Reach Bronze!)</p>
                      <p className="text-sm">5 active referrals × $5/month = <strong className="text-amber-400">$25/month recurring potential + ${isFoundingMember ? '100' : '50'} Bronze bonus!</strong></p>
                      <p className="text-xs text-white/70 mt-1">💰 Keep growing your referrals to unlock higher tiers and bonuses! Results vary by effort.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-navy-900 p-4 rounded-lg border border-gold-500">
                  <div className="flex items-start">
                    <ArrowRight className="h-5 w-5 mr-3 text-amber-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-amber-300 mb-1">Step 3: Scale to 25 Referrals (Diamond!)</p>
                      <p className="text-sm">25 locked-in referrals × $5/month = <strong className="text-amber-400">$125/month FOREVER + ${isFoundingMember ? '1,000' : '500'} Diamond bonus!</strong></p>
                      <p className="text-xs text-white/70 mt-1">💰 That's $1,500/year recurring income + all tier bonuses earned!</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-gold-600 to-gold-700 rounded-lg border-2 border-gold-400">
                  <p className="text-center font-bold text-xl text-amber-300 mb-2">🎯 Monthly Recurring at Each Tier</p>
                  <div className="grid grid-cols-5 gap-2 text-center text-xs">
                    <div className="bg-black/30 rounded p-2">
                      <div className="font-bold text-amber-300">Bronze</div>
                      <div className="text-white">$25/mo</div>
                      <div className="text-white/60">5 × $5</div>
                    </div>
                    <div className="bg-black/30 rounded p-2">
                      <div className="font-bold text-slate-300">Silver</div>
                      <div className="text-white">$50/mo</div>
                      <div className="text-white/60">10 × $5</div>
                    </div>
                    <div className="bg-black/30 rounded p-2">
                      <div className="font-bold text-yellow-300">Gold</div>
                      <div className="text-white">$75/mo</div>
                      <div className="text-white/60">15 × $5</div>
                    </div>
                    <div className="bg-black/30 rounded p-2">
                      <div className="font-bold text-cyan-300">Platinum</div>
                      <div className="text-white">$100/mo</div>
                      <div className="text-white/60">20 × $5</div>
                    </div>
                    <div className="bg-black/30 rounded p-2">
                      <div className="font-bold text-blue-300">Diamond</div>
                      <div className="text-white">$125/mo</div>
                      <div className="text-white/60">25 × $5</div>
                    </div>
                  </div>
                  <p className="text-xs text-center text-white/70 mt-3">Plus one-time achievement bonuses up to ${isFoundingMember ? '$2,300' : '$1,150'} total!</p>
                </div>
              </div>
            </div>

            {/* Automatic Savings & Commission Holding Explanation */}
            <div className="mt-8 p-6 bg-gradient-to-br from-navy-800 to-navy-900 rounded-lg border-2 border-gold-500">
              <h3 className="font-semibold text-2xl mb-4 text-amber-300">💰 Building Your Financial Future</h3>
              <div className="space-y-4 text-white/90">
                <p className="text-base leading-relaxed">
                  Once your monthly commissions reach <strong className="text-amber-400">$70 or more</strong> (14+ locked-in referrals), <strong className="text-amber-400">$35 is automatically set aside</strong> to build your financial future. You must earn at least double the deduction amount to qualify. Think of it as your personal success fund — growing steadily as your income builds momentum. Withdraw once per year, on the anniversary of your start date, and celebrate how far you've come. That adds up to <strong className="text-green-400">$420 saved annually</strong> — enough to cover your annual membership!
                </p>
                <div className="bg-black/80 p-5 rounded-lg border-2 border-amber-500">
                  <p className="font-bold text-amber-300 text-lg mb-3">🔑 60-Day Commission Eligibility</p>
                  <p className="leading-relaxed">
                    <strong>Separating the curious from the serious:</strong> You must be enrolled and paid for <strong className="text-amber-400">2 consecutive months (60 days)</strong> before you're eligible to earn commissions. Your first month is about building and learning. When you pay your second month, you've proven your commitment — and your commissions unlock. This ensures every earner is genuinely invested in building wealth, not just checking it out.
                  </p>
                </div>
                <div className="bg-black/80 p-5 rounded-lg border-2 border-red-400">
                  <p className="font-bold text-red-300 text-lg mb-3">🛡️ 90-Day Account Grace Period</p>
                  <p className="leading-relaxed">
                    Life happens. If you stop paying your membership, your account stays in the system for <strong className="text-red-300">90 days</strong>. During this time, you can log back in with your username and password and pick up right where you left off — same referrals, same network, same progress. After 90 days of inactivity, you'll need to rejoin as a new member.
                  </p>
                </div>
                <div className="bg-black/80 p-5 rounded-lg border-2 border-gold-400">
                  <p className="font-bold text-amber-300 text-lg mb-3">⏳ 30-Day Commission Holding Period</p>
                  <p className="leading-relaxed">
                    <strong>Note:</strong> All commissions are held for 30 days before release. This process helps differentiate between those simply exploring and those truly invested in building wealth. It also highlights that this is more than just an affiliate marketing platform — it's a movement dedicated to growth, accountability, and financial transformation.
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                  <div className="bg-black/60 p-4 rounded-lg border border-gold-400 text-center">
                    <p className="text-3xl font-bold text-amber-400 mb-1">60</p>
                    <p className="text-xs text-white/70">Days to earn commissions</p>
                  </div>
                  <div className="bg-black/60 p-4 rounded-lg border border-gold-400 text-center">
                    <p className="text-3xl font-bold text-amber-400 mb-1">90</p>
                    <p className="text-xs text-white/70">Day grace period to return</p>
                  </div>
                  <div className="bg-black/60 p-4 rounded-lg border border-gold-400 text-center">
                    <p className="text-3xl font-bold text-amber-400 mb-1">$420</p>
                    <p className="text-xs text-white/70">Annual Savings ($35/month)</p>
                  </div>
                  <div className="bg-black/60 p-4 rounded-lg border border-gold-400 text-center">
                    <p className="text-3xl font-bold text-amber-400 mb-1">$70+</p>
                    <p className="text-xs text-white/70">Monthly commission to qualify</p>
                  </div>
                  <div className="bg-black/60 p-4 rounded-lg border border-gold-400 text-center">
                    <p className="text-3xl font-bold text-amber-400 mb-1">12 Mo.</p>
                    <p className="text-xs text-white/70">Locked until anniversary date</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Automatic Savings System */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card data-testid="card-savings-system">
            <CardHeader>
              <div className="flex items-center">
                <div className="p-2 bg-green-600 rounded-lg mr-3">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle>Automatic Savings System</CardTitle>
                  <CardDescription>Building wealth with every commission</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Automatic Deduction</span>
                  <div className="text-2xl font-bold text-green-600">$35</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  When your monthly commission reaches $70+ (14+ referrals), $35 is automatically saved to your Financial Asset Savings
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Minimum Commission to Qualify</span>
                    <span className="font-semibold">$70/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Annual Savings</span>
                    <span className="font-semibold">$420</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Withdrawal Period</span>
                    <span className="font-semibold">12 months minimum</span>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg mt-4">
                  <div className="text-sm font-semibold text-green-800 mb-1">
                    💡 Wealth Building Strategy
                  </div>
                  <div className="text-xs text-green-700">
                    With 14 active referrals each contributing $5, your monthly volume reaches $70. $35 goes to savings, you keep $35 cash. You must reach at least double the deduction amount — that's $420/year in automatic savings, which can cover your annual membership!
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-commission-flow">
            <CardHeader>
              <div className="flex items-center">
                <div className="p-2 bg-blue-600 rounded-lg mr-3">
                  <Percent className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle>Commission Flow</CardTitle>
                  <CardDescription>How your earnings are processed</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                    <span className="text-sm font-medium">Commission Earned</span>
                    <span className="text-lg font-bold text-primary">$100</span>
                  </div>
                  <div className="flex justify-center">
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-green-50 rounded-lg text-center">
                      <div className="text-sm text-green-700">To Savings</div>
                      <div className="font-bold text-green-800">$35</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg text-center">
                      <div className="text-sm text-blue-700">Available</div>
                      <div className="font-bold text-blue-800">$65</div>
                    </div>
                  </div>
                  <div className="text-xs text-center text-muted-foreground">
                    Savings deduction applies only when commission is $70+/month
                  </div>
                </div>
                
                <Separator />
                
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-2">Payout Processing</div>
                  <Badge variant="outline">3-Month Hold Period</Badge>
                  <div className="text-xs text-muted-foreground mt-2">
                    Ensures cash flow stability and member commitment
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Founding Member Benefits */}
        {isFoundingMember && (
          <Card className="mb-12 border-accent bg-gradient-to-r from-accent/5 to-yellow-50" data-testid="card-founding-benefits">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Crown className="h-8 w-8 text-accent mr-2" />
                <CardTitle className="text-2xl text-accent-foreground">Founding Member Exclusive Perks</CardTitle>
              </div>
              <CardDescription>First 500 members receive enhanced rewards - YOU'RE ONE OF THEM!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-green-100 to-green-50 rounded-lg border-2 border-green-400">
                  <div className="text-3xl font-bold text-green-600 mb-2">$16-$22</div>
                  <div className="text-sm font-semibold text-green-800">Enhanced Commission</div>
                  <div className="text-xs text-green-600">Per referral (vs $5 standard)</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg border-2 border-amber-400">
                  <div className="text-3xl font-bold text-amber-600 mb-2">2x</div>
                  <div className="text-sm font-semibold text-amber-800">Achievement Bonuses</div>
                  <div className="text-xs text-amber-600">$100-$1,000 per tier</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg border-2 border-blue-400">
                  <div className="text-3xl font-bold text-blue-600 mb-2">6 mo</div>
                  <div className="text-sm font-semibold text-blue-800">Reduced Hold</div>
                  <div className="text-xs text-blue-600">Savings (vs 12 mo standard)</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg border-2 border-purple-400">
                  <div className="text-3xl font-bold text-purple-600 mb-2">VIP</div>
                  <div className="text-sm font-semibold text-purple-800">Priority Access</div>
                  <div className="text-xs text-purple-600">Training + Wall of Founders</div>
                </div>
              </div>
              
              {/* Founding Member Enhanced Commission Breakdown */}
              <div className="mt-6 p-4 bg-gradient-to-br from-navy-900 to-navy-800 rounded-lg border-2 border-gold-400">
                <h4 className="text-gold-400 font-bold text-lg text-center mb-4">💰 Founding Member Commission Rates</h4>
                <div className="grid grid-cols-5 gap-2 text-center text-sm">
                  <div className="bg-amber-700/30 border border-amber-600 rounded p-3">
                    <div className="font-bold text-amber-400 text-xs">Bronze</div>
                    <div className="text-white text-xl font-bold">$16</div>
                    <div className="text-white/70 text-xs">/month</div>
                  </div>
                  <div className="bg-slate-500/30 border border-slate-400 rounded p-3">
                    <div className="font-bold text-slate-300 text-xs">Silver</div>
                    <div className="text-white text-xl font-bold">$18</div>
                    <div className="text-white/70 text-xs">/month</div>
                  </div>
                  <div className="bg-yellow-500/30 border border-yellow-400 rounded p-3">
                    <div className="font-bold text-yellow-400 text-xs">Gold</div>
                    <div className="text-white text-xl font-bold">$19</div>
                    <div className="text-white/70 text-xs">/month</div>
                  </div>
                  <div className="bg-cyan-500/30 border border-cyan-400 rounded p-3">
                    <div className="font-bold text-cyan-300 text-xs">Platinum</div>
                    <div className="text-white text-xl font-bold">$20</div>
                    <div className="text-white/70 text-xs">/month</div>
                  </div>
                  <div className="bg-blue-500/30 border border-blue-400 rounded p-3">
                    <div className="font-bold text-blue-300 text-xs">Diamond</div>
                    <div className="text-white text-xl font-bold">$22</div>
                    <div className="text-white/70 text-xs">/month</div>
                  </div>
                </div>
                <div className="text-center mt-3 text-white/80 text-sm">
                  Each active referral contributes $5 to your monthly volume. <span className="text-gold-400 font-bold">Founding Members earn a 3-4x enhanced commission!</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-white rounded-lg border border-accent/20">
                <div className="text-center">
                  <Award className="h-6 w-6 text-accent mx-auto mb-2" />
                  <div className="text-sm font-semibold text-accent-foreground">
                    Your Status: Founding Member #{member?.memberNumber}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Lifetime founding member perks - never expires!
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Achievement Tier Bonuses */}
        <Card className="mb-12 bg-gradient-to-br from-blue-50 to-amber-50 border-2 border-amber-300" data-testid="card-achievement-bonuses">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="h-8 w-8 text-accent mr-2" />
              <CardTitle className="text-2xl text-primary">Achievement Tier Bonuses</CardTitle>
            </div>
            <CardDescription>
              Unlock exclusive bonuses as you grow your network and achieve each tier level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Gold Tier */}
              <div className="relative group">
                <div className="overflow-hidden rounded-lg shadow-xl transform transition-transform group-hover:scale-105">
                  <img 
                    src="/tier-gold-new.jpg" 
                    alt="Gold Tier Achievement"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-white text-xl font-bold mb-2 drop-shadow-lg">
                      Gold Level Bonus
                    </h3>
                    <div className="text-amber-300 text-3xl font-bold mb-1" data-testid="text-bonus-gold">
                      ${isFoundingMember ? '200' : '100'}
                    </div>
                    <p className="text-white/80 text-sm drop-shadow-md">
                      First tier achievement bonus
                    </p>
                  </div>
                </div>
              </div>

              {/* Platinum Tier */}
              <div className="relative group">
                <div className="overflow-hidden rounded-lg shadow-xl transform transition-transform group-hover:scale-105">
                  <img 
                    src="/tier-platinum-new.jpg" 
                    alt="Platinum Tier Achievement"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-white text-xl font-bold mb-2 drop-shadow-lg">
                      Platinum Level Bonus
                    </h3>
                    <div className="text-amber-300 text-3xl font-bold mb-1" data-testid="text-bonus-platinum">
                      ${isFoundingMember ? '400' : '200'}
                    </div>
                    <p className="text-white/80 text-sm drop-shadow-md">
                      50+ locked-in referrals achievement
                    </p>
                  </div>
                </div>
              </div>

              {/* Diamond Tier */}
              <div className="relative group">
                <div className="overflow-hidden rounded-lg shadow-xl transform transition-transform group-hover:scale-105">
                  <img 
                    src="/fr2p-diamond-logo.jpeg" 
                    alt="Diamond Tier Achievement"
                    className="w-full h-48 object-contain bg-navy-900"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-white text-xl font-bold mb-2 drop-shadow-lg">
                      Diamond Level Bonus
                    </h3>
                    <div className="text-amber-300 text-3xl font-bold mb-1" data-testid="text-bonus-diamond">
                      ${isFoundingMember ? '2,000' : '1,000'}
                    </div>
                    <p className="text-white/80 text-sm drop-shadow-md">
                      200+ locked-in referrals achievement
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-white rounded-lg border-2 border-accent/20">
              <div className="flex items-center gap-2 mb-3">
                <Award className="h-5 w-5 text-accent" />
                <h4 className="font-semibold text-foreground">How Achievement Bonuses Work</h4>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>One-time bonuses paid when you reach each tier milestone</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>Based on total locked-in referrals in your network</span>
                </li>
                {isFoundingMember && (
                  <li className="flex items-start">
                    <span className="text-amber-400 mr-2">⭐</span>
                    <span className="font-semibold text-accent-foreground">
                      Founding Members receive 2x achievement bonuses at every tier!
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Tax Deductions Article */}
        <Card data-testid="card-tax-deductions" className="bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white -mx-6 -mt-6 mb-6 px-6 pt-6 pb-8 rounded-t-lg">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-white/20 rounded-lg">
                <DollarSign className="h-8 w-8" />
              </div>
              <div>
                <CardTitle className="text-3xl mb-2">34 Big Tax Deductions (Write-Offs) for Businesses in 2025</CardTitle>
                <CardDescription className="text-white/90 text-base">
                  By Sherman Standberry, CPA - Tax Professional Approved ✓
                </CardDescription>
                <p className="text-white/80 text-sm mt-2">
                  Learn how to legally reduce your taxes and keep more of what you earn
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6">
            {/* Introduction */}
            <div className="bg-white p-6 rounded-lg border-2 border-green-200">
              <p className="text-gray-700 leading-relaxed mb-4">
                As a business owner, the easiest way to reduce your taxes is through small business tax deductions.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Yet, <strong>90% of business owners overpay their taxes</strong> because they fail to write-off expenses they already pay for.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Why? Because many small business owners (and sadly, accountants too) are not fully aware of the various tax deductions available.
              </p>
              <p className="text-gray-700 leading-relaxed">
                In fact, most do not even know what tax deductions are and the role it plays in reducing your taxes.
              </p>
            </div>

            {/* What is a Tax Deduction */}
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
              <h3 className="text-xl font-bold text-blue-900 mb-3">What is a small business tax deduction?</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Also known as a tax write-off, the tax law defines a tax deduction as <strong>"any ordinary and necessary expense"</strong> incurred to carry on any trade or business.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Eligible expenses are deducted from the business income reported on your tax return, resulting in lower tax liability.
              </p>
            </div>

            {/* Tax Deductions List */}
            <div className="space-y-8">
              {/* Deduction #1 */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-start gap-3 mb-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</span>
                  <h4 className="text-lg font-bold text-gray-900">Home Office Deduction</h4>
                </div>
                <p className="text-gray-700 leading-relaxed mb-3">
                  The home-office deduction allows you to deduct a portion of your home expenses as a business expense.
                </p>
                <p className="text-gray-700 leading-relaxed mb-3">
                  If you do any work from home for your business, you may qualify for this deduction. The amount of your deduction is based on the percentage of space in your home that is used exclusively for business.
                </p>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm font-semibold text-gray-800 mb-2">Example:</p>
                  <p className="text-sm text-gray-700">
                    If your annual home expenses are $100,000 and you use 20% of your home exclusively for business, you could write-off <strong>$20,000</strong> of your home expenses.
                  </p>
                </div>
              </div>

              {/* Deduction #2 */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-start gap-3 mb-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</span>
                  <h4 className="text-lg font-bold text-gray-900">Self-Employment Tax Deduction</h4>
                </div>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Self-employment tax is a 15.3% tax used to fund Social Security and Medicare programs. The amount you pay in self-employment tax is deductible at tax time.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  For high earners, this can equal thousands in tax savings every year.
                </p>
              </div>

              {/* Deduction #3 */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-start gap-3 mb-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</span>
                  <h4 className="text-lg font-bold text-gray-900">Depreciation Deduction (Section 179)</h4>
                </div>
                <p className="text-gray-700 leading-relaxed mb-3">
                  If you buy tangible assets for your business (equipment, machinery, furniture, vehicles), Section 179 allows you to deduct up to 100% of the cost in the year you made the purchase.
                </p>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm font-semibold text-gray-800 mb-2">Example:</p>
                  <p className="text-sm text-gray-700">
                    Buy $100,000 of new equipment? With Section 179, you could deduct the entire $100,000 upfront in Year 1 instead of spreading it over 5 years.
                  </p>
                </div>
              </div>

              {/* Deduction #4 */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-start gap-3 mb-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">4</span>
                  <h4 className="text-lg font-bold text-gray-900">20% Pass-Through Deduction (QBI)</h4>
                </div>
                <p className="text-gray-700 leading-relaxed mb-3">
                  The pass-through deduction allows eligible small business owners to deduct up to 20% of their net business income.
                </p>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm font-semibold text-gray-800 mb-2">Example:</p>
                  <p className="text-sm text-gray-700">
                    If your business nets $100,000, the 20% QBI deduction reduces your taxable income to $80,000. At a 25% tax rate, that's <strong>$5,000 in tax savings</strong>.
                  </p>
                </div>
              </div>

              {/* Deduction #5 */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-start gap-3 mb-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">5</span>
                  <h4 className="text-lg font-bold text-gray-900">Vehicle Tax Deduction</h4>
                </div>
                <p className="text-gray-700 leading-relaxed mb-3">
                  If you use a vehicle for your business, you can deduct business mileage using the IRS standard mileage rate OR deduct actual vehicle expenses (gas, repairs, insurance, maintenance).
                </p>
                <p className="text-gray-700 text-sm italic">
                  Important: Keep detailed logs of business trips including dates, destinations, miles driven, and business purpose.
                </p>
              </div>

              {/* Deduction #6 */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-start gap-3 mb-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">6</span>
                  <h4 className="text-lg font-bold text-gray-900">Travel Expense Deduction</h4>
                </div>
                <p className="text-gray-700 leading-relaxed mb-3">
                  When you travel for business purposes, direct business expenses are fully tax deductible. This includes flights, hotels, meals, and transportation.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Examples: Conferences, seminars, board meetings, or meetings with business contacts.
                </p>
              </div>

              {/* Deduction #7 */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-start gap-3 mb-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">7</span>
                  <h4 className="text-lg font-bold text-gray-900">Business Meals Deduction</h4>
                </div>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Having lunch or dinner with a business contact? You can deduct 50% of these meal costs (or 100% during business travel).
                </p>
                <p className="text-gray-700 text-sm italic">
                  Keep receipts and note the business contacts present and business purpose of the meal.
                </p>
              </div>

              {/* Deduction #8 */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-start gap-3 mb-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">8</span>
                  <h4 className="text-lg font-bold text-gray-900">Hiring Your Children</h4>
                </div>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Hire your kids to shift income from your higher tax bracket to their lower bracket. Pay them up to the standard deduction amount (~$14,000) and they pay no income tax.
                </p>
                <p className="text-gray-700 text-sm text-red-600 font-semibold">
                  Important: Your children must be doing legitimate work for proper compensation.
                </p>
              </div>

              {/* Additional Deductions Summary */}
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-lg border-2 border-amber-300">
                <h4 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
                  <Star className="h-6 w-6" />
                  Additional Key Deductions (#9-34)
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span className="text-sm text-gray-700"><strong>#9:</strong> Employee Salaries & Contract Labor</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span className="text-sm text-gray-700"><strong>#10:</strong> Employee Benefit Programs</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span className="text-sm text-gray-700"><strong>#11:</strong> 401K Contributions (up to $70,000)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span className="text-sm text-gray-700"><strong>#12:</strong> Retirement Pension Contributions</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span className="text-sm text-gray-700"><strong>#13:</strong> Health Savings Account (HSA)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span className="text-sm text-gray-700"><strong>#14:</strong> Health Insurance Premiums</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span className="text-sm text-gray-700"><strong>#15:</strong> Business Insurance</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span className="text-sm text-gray-700"><strong>#16:</strong> Advertising Expenses</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span className="text-sm text-gray-700"><strong>#17:</strong> Education Expenses</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span className="text-sm text-gray-700"><strong>#18:</strong> Cell Phone Deduction</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span className="text-sm text-gray-700"><strong>#19:</strong> Rent or Lease Expense</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span className="text-sm text-gray-700"><strong>#20:</strong> Augusta Rule (Rent Your Home)</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span className="text-sm text-gray-700"><strong>#21:</strong> Utilities Expense</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span className="text-sm text-gray-700"><strong>#22:</strong> Office & Technology Expenses</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span className="text-sm text-gray-700"><strong>#23:</strong> Repairs & Maintenance</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span className="text-sm text-gray-700"><strong>#24:</strong> Legal & Professional Service Fees</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span className="text-sm text-gray-700"><strong>#25:</strong> Bank Fees</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span className="text-sm text-gray-700"><strong>#26:</strong> Merchant Processing Fees</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span className="text-sm text-gray-700"><strong>#27:</strong> Business Loan Interest</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span className="text-sm text-gray-700"><strong>#28:</strong> Startup & Organization Costs</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span className="text-sm text-gray-700"><strong>#29:</strong> Cost of Goods Sold</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span className="text-sm text-gray-700"><strong>#30:</strong> Charitable Contributions</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span className="text-sm text-gray-700"><strong>#31:</strong> Tax Preparation Fees</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span className="text-sm text-gray-700"><strong>#32-34:</strong> And more...</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-lg">
                <h4 className="text-xl font-bold mb-3">💡 Take Action Today</h4>
                <p className="mb-4 leading-relaxed">
                  Don't leave money on the table! As an The FR2P Club member running your own affiliate marketing business, you qualify for many of these deductions.
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-300">✓</span>
                    <span>Home office deduction for your workspace</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-300">✓</span>
                    <span>Travel expenses for business meetings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-300">✓</span>
                    <span>Advertising and marketing costs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-300">✓</span>
                    <span>Cell phone and internet expenses</span>
                  </li>
                </ul>
                <p className="text-sm text-yellow-100">
                  <strong>Remember:</strong> Always consult with a qualified tax professional to ensure you're taking advantage of all available deductions legally and properly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Executive Investor Tier */}
        <Card className="border-4 border-[#FFD700] bg-gradient-to-r from-[#001f3f] via-[#002855] to-[#001f3f] shadow-xl shadow-[#FFD700]/20 mb-8" data-testid="card-executive-tier">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-full">
                <Gem className="h-10 w-10 text-[#001f3f]" />
              </div>
            </div>
            <Badge className="bg-[#FFD700] text-[#001f3f] font-bold mb-4 mx-auto">EXCLUSIVE INVESTOR PROGRAM</Badge>
            <CardTitle className="text-3xl text-[#FFD700]">Executive Investor Tier</CardTitle>
            <CardDescription className="text-white/80 max-w-2xl mx-auto text-lg">
              Beyond the affiliate commission structure - a separate investment track for serious stakeholders seeking elite privileges and wealth-building opportunities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-[#001f3f]/50 border border-[#FFD700]/30 rounded-xl p-5 text-center">
                <Building2 className="h-8 w-8 text-[#FFD700] mx-auto mb-3" />
                <h4 className="text-[#FFD700] font-semibold mb-2">FR2P Bank Cards</h4>
                <p className="text-white/70 text-sm">Co-branded premium cards through bank partnerships</p>
              </div>
              <div className="bg-[#001f3f]/50 border border-[#FFD700]/30 rounded-xl p-5 text-center">
                <UserCheck className="h-8 w-8 text-[#FFD700] mx-auto mb-3" />
                <h4 className="text-[#FFD700] font-semibold mb-2">Personal Concierge</h4>
                <p className="text-white/70 text-sm">24/7 personal assistant for all your needs</p>
              </div>
              <div className="bg-[#001f3f]/50 border border-[#FFD700]/30 rounded-xl p-5 text-center">
                <Car className="h-8 w-8 text-[#FFD700] mx-auto mb-3" />
                <h4 className="text-[#FFD700] font-semibold mb-2">Vehicle Program</h4>
                <p className="text-white/70 text-sm">Access to luxury vehicle programs</p>
              </div>
              <div className="bg-[#001f3f]/50 border border-[#FFD700]/30 rounded-xl p-5 text-center">
                <Briefcase className="h-8 w-8 text-[#FFD700] mx-auto mb-3" />
                <h4 className="text-[#FFD700] font-semibold mb-2">CPA & Tax Advisory</h4>
                <p className="text-white/70 text-sm">Dedicated financial professionals</p>
              </div>
            </div>
            
            <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-xl p-6 mb-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-[#FFD700] font-bold text-xl mb-2">Separate from Affiliate Structure</h4>
                  <p className="text-white/80">
                    The Executive Tier is an <strong>investment program</strong> - not part of the affiliate commission matrix. 
                    Investors become stakeholders in The FR2P Club's growth, with privileges reserved for serious partners.
                  </p>
                </div>
                <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-sm px-4 py-2 whitespace-nowrap">
                  Coming Q1 2026
                </Badge>
              </div>
            </div>
            
            <div className="text-center">
              <Button 
                className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#001f3f] hover:from-[#FFC700] hover:to-[#FF9500] font-bold px-8 py-6 text-lg"
                data-testid="button-executive-tier-learn"
                onClick={() => window.location.href = '/executive-tier'}
              >
                <Gem className="w-5 h-5 mr-2" />
                Explore Executive Benefits
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Getting Started */}
        <Card data-testid="card-getting-started">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Ready to Start Earning?</CardTitle>
            <CardDescription>
              Join The FR2P Club and start building your financial roadway to prosperity
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 border rounded-lg">
                <Gift className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Annual Membership</h3>
                <div className="text-2xl font-bold text-primary mb-2">$350/year</div>
                <div className="text-sm text-muted-foreground mb-4">
                  Save $70 vs monthly billing • Best value
                </div>
                <Button className="w-full" data-testid="button-join-annual">
                  Join Annual Plan
                </Button>
              </div>
              
              <div className="p-6 border rounded-lg">
                <DollarSign className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Monthly Option</h3>
                <div className="text-2xl font-bold text-muted-foreground mb-2">$35/month</div>
                <div className="text-sm text-muted-foreground mb-4">
                  Flexible billing • Cancel anytime
                </div>
                <Button variant="outline" className="w-full" data-testid="button-join-monthly">
                  Start Monthly
                </Button>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              💡 <strong>Pro Tip:</strong> Get 3 referrals and your monthly commissions cover your membership fee ($42/mo at Bronze)!
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}