import { useQuery } from "@tanstack/react-query";
import { HeaderNav } from "@/components/ui/header-nav";
import { LevelDisplay } from "@/components/ui/tier-display";
import { Badge } from "@/components/ui/badge";
import type { Member, AffiliateStats } from "@shared/schema";

import { getLoggedInMemberId } from "@/lib/auth";
const DEMO_USER_ID = getLoggedInMemberId();

export default function Network() {
  const { data: networkData, isLoading } = useQuery<{
    stats: AffiliateStats;
    directReferrals: Member[];
    levels: Array<{ level: number; count: number; calculation: string }>;
  }>({
    queryKey: ["/api/network", DEMO_USER_ID],
  });

  const { data: memberData } = useQuery<{ member: Member }>({
    queryKey: ["/api/member", DEMO_USER_ID],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary">
        <HeaderNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-primary/20 rounded w-64 mb-8"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-card p-6 rounded-lg shadow-sm border border-border">
                  <div className="h-20 bg-primary/10 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!networkData || !memberData) {
    return (
      <div className="min-h-screen bg-secondary">
        <HeaderNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">No network data available</h2>
            <p className="text-white/70">Please contact support if this issue persists.</p>
          </div>
        </div>
      </div>
    );
  }

  const { stats, directReferrals, levels } = networkData;
  const { member } = memberData;

  const levelColors = [
    "bg-primary",
    "bg-primary/80", 
    "bg-primary/60",
    "bg-primary/40",
    "bg-primary/20"
  ];

  return (
    <div className="min-h-screen bg-secondary">
      <HeaderNav user={member} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">FR2P Network</h1>
          <p className="text-foreground/80 mt-2">
            Track your journey from Affiliate Ambassador to Diamond Affiliate Ambassador across 5 achievement tiers
          </p>
        </div>

        {/* Affiliate Marketing vs Network Marketing - Key Distinction */}
        <div className="bg-gradient-to-br from-[#001f3f] to-[#003366] rounded-lg shadow-xl border-2 border-[#FFD700] p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-2">How the FR2P Affiliate Program Works</h2>
            <p className="text-white/90">Affiliate marketing with a duplication model — not network marketing</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-lg p-5">
              <h3 className="font-bold text-[#FFD700] mb-3">✅ What Makes This Affiliate Marketing</h3>
              <ul className="space-y-2 text-white/90 text-sm">
                <li>• You earn commissions from <strong className="text-[#FFD700]">your direct sales only</strong></li>
                <li>• Daily volume and quarterly goals count <strong className="text-[#FFD700]">direct referrals only</strong></li>
                <li>• $5/month per locked-in direct referral — FTC-compliant single-tier</li>
                <li>• You personally find 5, teach them to find their 5</li>
                <li>• Complete all 5 circles (3,906 network), then <strong className="text-[#FFD700]">start a new circle</strong></li>
              </ul>
            </div>
            <div className="bg-white/5 border border-white/20 rounded-lg p-5">
              <h3 className="font-bold text-white mb-3">🌊 Spillover & Founding Members</h3>
              <ul className="space-y-2 text-white/90 text-sm">
                <li>• <strong className="text-[#FFD700]">Spillover</strong>: Refer 6+ in a month? Extras are placed under your team — not paid as upline commissions</li>
                <li>• <strong className="text-[#FFD700]">Founding Members</strong> (first 500): 2x circle completion bonuses + priority spillover placement</li>
                <li>• Your network grows through duplication, but your paycheck comes from direct sales</li>
                <li>• <a href="/network-diagram.html" target="_blank" className="text-[#FFD700] underline">View the printable network diagram →</a></li>
              </ul>
            </div>
          </div>

          <div className="bg-[#001f3f] border border-[#FFD700]/40 rounded-lg p-4 text-center">
            <p className="text-white/90 text-sm">
              <span className="font-bold text-[#FFD700]">The model:</span> You start → find your 5 → they find their 5 → 
              the pattern repeats through 5 circles until your network is full (3,906 people). Then you begin again. 
              Similar structure to network marketing, but you are paid as an <span className="font-bold text-[#FFD700]">affiliate</span> on direct sales — not on downline volume.
            </p>
          </div>
        </div>

        {/* Get 5, Teach 5 Philosophy - Duplication Model */}
        <div className="bg-gradient-to-br from-[#001f3f] to-[#003366] rounded-lg shadow-xl border-2 border-[#FFD700] p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-[#FFD700] mb-2">The Power of 5</h2>
            <p className="text-xl text-[#FFD700]/90 italic">Brotherhood • Harmony • Family • Peace • Equality • Entrepreneurship</p>
          </div>

          <div className="bg-[#001f3f]/50 border border-[#FFD700]/30 rounded-lg p-6 mb-6">
            <h3 className="text-2xl font-bold text-[#FFD700] mb-4 text-center">You Only Need to Find YOUR 5</h3>
            <div className="space-y-4 text-white/90 text-lg">
              <p className="text-center">
                This is <span className="font-bold text-[#FFD700]">not about mass recruitment</span>. 
                The FR2P Club is an <span className="font-bold text-[#FFD700]">invite-only exclusive community</span> built on duplication, not hustle.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-lg p-4 text-center">
                  <div className="text-4xl mb-2">👤</div>
                  <div className="font-bold text-[#FFD700] mb-2">Step 1: Find YOUR 5</div>
                  <p className="text-sm text-white/80">You personally recruit just 5 people who share your vision</p>
                </div>
                
                <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-lg p-4 text-center">
                  <div className="text-4xl mb-2">🎓</div>
                  <div className="font-bold text-[#FFD700] mb-2">Step 2: Teach Your 5</div>
                  <p className="text-sm text-white/80">Train them to duplicate the same process: find their 5</p>
                </div>
                
                <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-lg p-4 text-center">
                  <div className="text-4xl mb-2">🌟</div>
                  <div className="font-bold text-[#FFD700] mb-2">Step 3: Watch It Multiply</div>
                  <p className="text-sm text-white/80">Their 5 teach their 5, creating exponential growth through duplication</p>
                </div>
              </div>

              <div className="bg-[#001f3f] border-2 border-[#FFD700] rounded-lg p-6 mt-6">
                <div className="text-center text-[#FFD700] font-bold text-xl mb-4">The Duplication Formula</div>
                <div className="grid grid-cols-5 gap-2 text-center text-sm">
                  <div className="bg-[#FFD700]/20 rounded p-3">
                    <div className="font-bold text-[#FFD700]">Your 5</div>
                    <div className="text-white text-2xl">5</div>
                  </div>
                  <div className="bg-[#FFD700]/20 rounded p-3">
                    <div className="font-bold text-[#FFD700]">Level 2</div>
                    <div className="text-white text-2xl">25</div>
                  </div>
                  <div className="bg-[#FFD700]/20 rounded p-3">
                    <div className="font-bold text-[#FFD700]">Level 3</div>
                    <div className="text-white text-2xl">125</div>
                  </div>
                  <div className="bg-[#FFD700]/20 rounded p-3">
                    <div className="font-bold text-[#FFD700]">Level 4</div>
                    <div className="text-white text-2xl">625</div>
                  </div>
                  <div className="bg-[#FFD700]/20 rounded p-3">
                    <div className="font-bold text-[#FFD700]">Level 5</div>
                    <div className="text-white text-2xl">3,125</div>
                  </div>
                </div>
                <div className="text-center mt-4 text-white/90">
                  = <span className="text-[#FFD700] font-bold text-2xl">3,906 Total Network</span> (Diamond Affiliate Ambassador)
                </div>
              </div>

              <div className="text-center mt-6 p-4 bg-[#FFD700]/10 rounded-lg">
                <p className="text-lg font-semibold text-[#FFD700]">
                  You don't need to be a "super recruiter" - you just need to find 5 people and teach them to do the same.
                </p>
                <p className="text-white/80 mt-2">
                  This is about <span className="font-bold text-[#FFD700]">leadership, mentorship, and duplication</span> - not mass recruiting.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center text-white/70 text-sm italic">
            The number 5 represents brotherhood, harmony, family, peace, equality, and entrepreneurship - 
            the foundation of The FR2P Club movement.
          </div>
        </div>

        {/* Circle of Influence Visual Diagram */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-6">Circle of Influence Diagram</h2>
          <p className="text-white/80 mb-8">Visualize how your network expands through 5 circles of influence</p>
          
          {/* Visual Tree/Pyramid Diagram */}
          <div className="flex flex-col items-center space-y-12 py-8 overflow-x-auto">
            
            {/* Level 1 - ME (Center) - GOLD background with burgundy text */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center shadow-lg border-4 border-gold-600" data-testid="center-me">
                  <div className="text-center text-navy-900">
                    <div className="font-bold text-sm">ME</div>
                    <div className="text-xs opacity-90">Level 1</div>
                  </div>
                </div>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gold-400/30 text-gold-900 border border-gold-500/40 px-3 py-1 rounded-full text-sm font-semibold">
                  100%
                </div>
              </div>
            </div>

            {/* Connection Lines from ME to Level 2 */}
            <div className="relative w-full flex justify-center">
              <svg width="400" height="60" className="absolute">
                {/* Lines from center to 5 positions */}
                <line x1="200" y1="10" x2="80" y2="50" stroke="#94a3b8" strokeWidth="2"/>
                <line x1="200" y1="10" x2="140" y2="50" stroke="#94a3b8" strokeWidth="2"/>
                <line x1="200" y1="10" x2="200" y2="50" stroke="#94a3b8" strokeWidth="2"/>
                <line x1="200" y1="10" x2="260" y2="50" stroke="#94a3b8" strokeWidth="2"/>
                <line x1="200" y1="10" x2="320" y2="50" stroke="#94a3b8" strokeWidth="2"/>
              </svg>
            </div>

            {/* Level 2 - My 5 Direct Referrals - BURGUNDY background with gold text */}
            <div className="flex justify-center space-x-8">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-navy-600 to-navy-700 flex items-center justify-center shadow-lg border-2 border-navy-500" data-testid={`level2-person-${i}`}>
                    <div className="text-center text-gold-400">
                      <div className="font-bold text-xs">YOU</div>
                      <div className="text-xs opacity-90">L2</div>
                    </div>
                  </div>
                  {i === 2 && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-navy-700/40 text-gold-300 border border-navy-500/40 px-3 py-1 rounded-full text-sm font-semibold">
                      70%
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Connection Lines from Level 2 to Level 3 */}
            <div className="relative w-full flex justify-center">
              <svg width="600" height="60" className="absolute">
                {/* Lines from each Level 2 person to their 5 referrals */}
                {[...Array(5)].map((_, i) => {
                  const startX = 140 + (i * 80); // Position of Level 2 circles
                  return [...Array(5)].map((_, j) => {
                    const endX = 60 + (i * 100) + (j * 20); // Spread their referrals
                    return (
                      <line key={`${i}-${j}`} x1={startX} y1="10" x2={endX} y2="50" stroke="#94a3b8" strokeWidth="1" opacity="0.6"/>
                    );
                  });
                })}
              </svg>
            </div>

            {/* Level 3 - Their Network (25 people) - GOLD background with burgundy text (alternating) */}
            <div className="flex justify-center">
              <div className="flex flex-wrap justify-center gap-3 max-w-4xl">
                {[...Array(25)].map((_, i) => (
                  <div key={i} className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center shadow-md border border-gold-600" data-testid={`level3-person-${i}`}>
                      <div className="text-center text-navy-900">
                        <div className="font-bold text-xs">L3</div>
                      </div>
                    </div>
                    {i === 12 && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gold-400/40 text-gold-900 border border-gold-500/30 px-2 py-1 rounded-full text-xs font-semibold">
                        50%
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Network Growth Summary - 5 Tier Achievement System */}
            <div className="bg-gradient-to-r from-navy-900 to-navy-800 p-6 rounded-xl border border-gold-400/30 max-w-4xl">
              <h4 className="font-bold text-lg text-center mb-4 text-amber-300">🌟 Your 5-Tier Achievement Ladder</h4>
              <p className="text-center text-blue-200 text-sm mb-4">Bronze Affiliate Ambassador → Silver Affiliate Ambassador → Gold Affiliate Ambassador → Platinum Affiliate Ambassador → Diamond Affiliate Ambassador</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 text-center text-xs md:text-sm">
                <div className="bg-gradient-to-br from-amber-700 to-amber-800 rounded-lg p-3 border border-amber-600">
                  <div className="font-bold text-white text-xs">🥉 BRONZE AFFILIATE AMBASSADOR</div>
                  <div className="text-xl md:text-2xl">👥</div>
                  <div className="font-semibold text-white">5</div>
                  <div className="text-xs text-amber-200">Level 1</div>
                </div>
                <div className="bg-gradient-to-br from-slate-400 to-slate-500 rounded-lg p-3 border border-slate-300">
                  <div className="font-bold text-slate-900 text-xs">🥈 SILVER AFFILIATE AMBASSADOR</div>
                  <div className="text-xl md:text-2xl">🌐</div>
                  <div className="font-semibold text-slate-900">25</div>
                  <div className="text-xs text-slate-800">Level 2</div>
                </div>
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg p-3 border border-yellow-300">
                  <div className="font-bold text-yellow-900 text-xs">🥇 GOLD AFFILIATE AMBASSADOR</div>
                  <div className="text-xl md:text-2xl">💎</div>
                  <div className="font-semibold text-yellow-900">125</div>
                  <div className="text-xs text-yellow-800">Level 3</div>
                </div>
                <div className="bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-lg p-3 border border-cyan-300">
                  <div className="font-bold text-cyan-900 text-xs">💠 PLATINUM AFFILIATE AMBASSADOR</div>
                  <div className="text-xl md:text-2xl">⭐</div>
                  <div className="font-semibold text-cyan-900">625</div>
                  <div className="text-xs text-cyan-800">Level 4</div>
                </div>
                <div className="bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-lg p-3 border-2 border-white shadow-lg">
                  <div className="font-bold text-white text-xs text-shadow">💎 DIAMOND AFFILIATE AMBASSADOR</div>
                  <div className="text-xl md:text-2xl">🏆</div>
                  <div className="font-semibold text-white">3,125</div>
                  <div className="text-xs text-white">Level 5</div>
                </div>
              </div>
              <div className="mt-6 text-center border-t border-amber-400/30 pt-4">
                <div className="text-2xl font-bold text-amber-300 mb-2">💎 Diamond Affiliate Ambassador = 3,906 Total Network</div>
                <div className="text-sm text-blue-200 mb-1">Advance through all 5 tiers to achieve Diamond Affiliate Ambassador rank</div>
                <div className="text-sm font-semibold text-amber-200">Bronze Affiliate Ambassador (5) → Silver Affiliate Ambassador (25) → Gold Affiliate Ambassador (125) → Platinum Affiliate Ambassador (625) → Diamond Affiliate Ambassador (3,125)</div>
                <div className="text-sm text-blue-200 mt-2">Start as Affiliate Ambassador, then advance through each circle of influence!</div>
              </div>
            </div>
            {/* Tier Achievement Explanation */}
            <div className="max-w-4xl text-center space-y-4 pt-6 border-t border-amber-400/30">
              <h3 className="text-lg font-semibold text-white">🎯 Your Path Through the 5 Circles of Influence</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 text-sm">
                <div className="bg-gradient-to-br from-amber-600 to-amber-700 p-3 rounded-lg border-2 border-amber-500 shadow-lg">
                  <div className="font-bold text-white text-xs mb-1">🥉 BRONZE AFFILIATE AMBASSADOR</div>
                  <div className="text-2xl mb-1">5</div>
                  <p className="text-white text-xs">Recruit your first 5 direct members</p>
                </div>
                <div className="bg-gradient-to-br from-slate-400 to-slate-500 p-3 rounded-lg border-2 border-slate-300 shadow-lg">
                  <div className="font-bold text-slate-900 text-xs mb-1">🥈 SILVER AFFILIATE AMBASSADOR</div>
                  <div className="text-2xl mb-1">25</div>
                  <p className="text-slate-900 text-xs">Your 5 each recruit 5 members</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-3 rounded-lg border-2 border-yellow-300 shadow-lg">
                  <div className="font-bold text-yellow-900 text-xs mb-1">🥇 GOLD AFFILIATE AMBASSADOR</div>
                  <div className="text-2xl mb-1">125</div>
                  <p className="text-yellow-900 text-xs">Network expands to Level 3</p>
                </div>
                <div className="bg-gradient-to-br from-cyan-400 to-cyan-500 p-3 rounded-lg border-2 border-cyan-300 shadow-lg">
                  <div className="font-bold text-cyan-900 text-xs mb-1">💠 PLATINUM AFFILIATE AMBASSADOR</div>
                  <div className="text-2xl mb-1">625</div>
                  <p className="text-cyan-900 text-xs">Elite leader status achieved</p>
                </div>
                <div className="bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-3 rounded-lg border-2 border-white shadow-xl">
                  <div className="font-bold text-white text-xs mb-1">💎 DIAMOND AFFILIATE AMBASSADOR</div>
                  <div className="text-2xl mb-1">3,125</div>
                  <p className="text-white text-xs">Complete 5-tier network!</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-gold-600/20 to-blue-600/20 p-4 rounded-lg border border-gold-400/30 mt-4">
                <p className="text-amber-200 text-sm">
                  <span className="font-semibold">You start as an Affiliate Ambassador and advance through the 5 circles of influence as you build.</span><br/>
                  Affiliate Ambassador (new member) → Bronze Affiliate Ambassador (5 direct) → Silver Affiliate Ambassador (25 total) → Gold Affiliate Ambassador (125 total) → Platinum Affiliate Ambassador (625 total) → Diamond Affiliate Ambassador (3,125 total - Full Network!)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Network Statistics */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-6">Network Statistics</h2>
          
          <div className="space-y-4">
            {levels.map((level: { level: number; count: number; calculation: string }, index: number) => (
              <LevelDisplay
                key={level.level}
                level={level.level}
                count={level.count}
                calculation={level.calculation}
                color={levelColors[index]}
              />
            ))}
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-primary/20 to-amber-900/20 rounded-lg border border-amber-400/30">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-amber-300">Total Referral Network:</span>
              <span className="text-2xl font-bold text-amber-400">
                {stats.totalReferrals.toLocaleString()} affiliates
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-amber-200">Monthly Commission Potential:</span>
              <span className="text-lg font-semibold text-amber-300">
                ${(stats.monthlyCommissions / 100).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Direct Referrals */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Direct Referrals (Tier 1)</h2>
          
          {directReferrals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {directReferrals.map((referral: Member) => (
                <div key={referral.id} className="border border-border bg-card/50 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-medium">
                        {referral.firstName[0]}{referral.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-white">
                        {referral.firstName} {referral.lastName}
                      </h3>
                      <p className="text-sm text-white/70">{referral.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white/70">Status:</span>
                      <Badge variant={referral.isActive ? "default" : "secondary"}>
                        {referral.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white/70">Rank:</span>
                      <span className="text-sm font-medium text-white">{referral.rank}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white/70">Joined:</span>
                      <span className="text-sm text-white">
                        {new Date(referral.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-amber-400 text-2xl">🤝</span>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No Direct Referrals Yet</h3>
              <p className="text-white/70">
                Start building your network by referring your first affiliates to earn commissions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
