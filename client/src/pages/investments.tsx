import { HeaderNav } from "@/components/ui/header-nav";
import { useQuery } from "@tanstack/react-query";
import type { MemberResponse } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Building,
  DollarSign,
  BarChart3,
  Clock,
  Users,
  CheckCircle,
  Landmark,
  Wallet,
  Target,
  Handshake,
  CreditCard,
  Home,
  Car,
  PieChart,
  Shield,
  Eye,
  ArrowRight,
  Star,
  TrendingDown,
} from "lucide-react";

import { getLoggedInMemberId } from "@/lib/auth";
const DEMO_USER_ID = getLoggedInMemberId();

export default function Investments() {
  const { data: memberData } = useQuery<MemberResponse>({
    queryKey: ["/api/member", DEMO_USER_ID],
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001f3f] to-[#002855]">
      <HeaderNav user={memberData?.member || undefined} />

      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* ── HERO ── */}
        <div className="text-center mb-14">
          <Badge className="bg-[#FFD700] text-[#001f3f] font-bold mb-4 text-sm px-4 py-1">
            FR2P FINANCIAL ECOSYSTEM
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-[#FFD700] mb-4">
            Investment & Wealth Building
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            The FR2P Club isn't just a membership — it's your <strong className="text-[#FFD700]">gateway to your complete financial life</strong>.
            Real estate. A broker. A banker who knows your name. ETFs. This is where wealth gets built for real.
          </p>
        </div>

        {/* ── VISION STATEMENT ── */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-[#FFD700] mb-14 shadow-2xl shadow-[#FFD700]/10">
          <div className="absolute inset-0 opacity-5"
               style={{ background: "radial-gradient(ellipse at center, #FFD700 0%, transparent 70%)" }} />
          <div className="relative z-10 p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="text-7xl md:text-8xl">🏛️</div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#FFD700] mb-3">
                  Derrick's Vision for FR2P Members
                </h2>
                <p className="text-white/85 text-base md:text-lg leading-relaxed mb-4">
                  "I want every FR2P member to be able to walk into a bank, sit down with a banker, 
                  and walk out having signed the paper — whether it's a car loan, a real estate deal, 
                  an ETF account, or a business loan. The connection is already there. All they have to 
                  do is show up and sign."
                </p>
                <p className="text-white/85 text-base md:text-lg leading-relaxed">
                  "In the future, members will be able to invest directly into the FR2P platform — and 
                  they'll be able to see exactly where every dollar goes. This is a financial movement, 
                  not just a club."
                </p>
                <p className="text-[#FFD700]/80 text-sm mt-4 font-semibold italic">
                  — Derrick Taylor, Founder · The Consolidatus Empire
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── MULTI-STREAM ECOSYSTEM ── */}
        <div className="bg-gradient-to-r from-[#FFD700]/10 to-[#FFA500]/10 border-2 border-[#FFD700]/30 rounded-xl p-8 mb-14">
          <h2 className="text-2xl font-bold text-[#FFD700] mb-2 text-center">The FR2P Wealth Ecosystem</h2>
          <p className="text-white/70 text-center text-sm mb-8 max-w-2xl mx-auto">
            True financial freedom requires multiple streams. Losing any one stream doesn't stop you — because you've built a system.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            {[
              { icon: Users, label: "Membership Reoccurring Income", sub: "$5/mo per referral", status: "ACTIVE", color: "green" },
              { icon: DollarSign, label: "Digital Products", sub: "One-time sales", status: "ACTIVE", color: "green" },
              { icon: Building, label: "Real Estate", sub: "Quarterly dividends", status: "COMING SOON", color: "amber" },
              { icon: BarChart3, label: "Broker & ETFs", sub: "Portfolio growth", status: "COMING SOON", color: "amber" },
              { icon: Handshake, label: "Banking Access", sub: "Loans & mortgages", status: "COMING SOON", color: "amber" },
              { icon: Wallet, label: "Certifications", sub: "Course income", status: "ACTIVE", color: "green" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-white/10 rounded-lg p-4 border border-white/20">
                  <Icon className="h-7 w-7 text-[#FFD700] mx-auto mb-2" />
                  <div className="text-xs font-bold text-white leading-tight mb-1">{item.label}</div>
                  <div className="text-xs text-white/60 mb-2">{item.sub}</div>
                  <Badge className={`text-xs ${item.color === "green" ? "bg-green-500 text-white" : "bg-amber-500 text-white"}`}>
                    {item.status}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── REAL ESTATE ── */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <Building className="h-8 w-8 text-[#FFD700]" />
            <h2 className="text-3xl font-bold text-[#FFD700]">Real Estate Investing</h2>
            <Badge className="bg-amber-500 text-white">Coming Soon</Badge>
          </div>
          <p className="text-white/75 mb-8 text-base max-w-3xl">
            FR2P members will have curated access to vetted real estate investment platforms — starting as low as $10/month.
            No landlord headaches. No property management. Just quarterly dividends hitting your account.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: "Fundrise",
                tag: "Start with $10/month",
                description: "Invest in a diversified portfolio of private real estate projects — commercial and residential. Earn quarterly dividends without owning a single property.",
                icon: "🏗️",
                color: "from-emerald-800 to-emerald-950",
                border: "border-emerald-400",
                features: ["Start with just $10/month", "Diversified real estate portfolio", "Quarterly dividend payouts", "No landlord responsibilities", "SEC-regulated & fully transparent"],
              },
              {
                name: "Roots REIT",
                tag: "$100 minimum investment",
                description: "Invest in residential real estate through a Real Estate Investment Trust. Professional managers handle everything — members collect quarterly distributions.",
                icon: "🏡",
                color: "from-amber-800 to-amber-950",
                border: "border-amber-400",
                features: ["$100 minimum to start", "Residential property portfolio", "Quarterly payout distributions", "Professional property management", "Long-term wealth building"],
              },
            ].map((p, i) => (
              <Card key={i} className={`${p.border} border-2 bg-gradient-to-br ${p.color}`}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{p.icon}</span>
                    <div>
                      <CardTitle className="text-white text-xl">{p.name}</CardTitle>
                      <Badge className="bg-white/20 text-white text-xs mt-1">{p.tag}</Badge>
                    </div>
                  </div>
                  <p className="text-white/80 text-sm">{p.description}</p>
                </CardHeader>
                <CardContent className="space-y-2">
                  {p.features.map((f, j) => (
                    <div key={j} className="flex items-start gap-2 text-sm text-white/85">
                      <CheckCircle className="w-4 h-4 text-[#FFD700] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                  <div className="pt-3">
                    <Button className="w-full bg-white/15 text-white border border-white/30 cursor-default" disabled>
                      <Clock className="w-4 h-4 mr-2" />
                      Partnership Being Finalized
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ── BROKER & ETF ACCESS ── */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="h-8 w-8 text-[#FFD700]" />
            <h2 className="text-3xl font-bold text-[#FFD700]">FR2P Broker Access</h2>
            <Badge className="bg-amber-500 text-white">Coming Soon</Badge>
          </div>
          <p className="text-white/75 mb-8 text-base max-w-3xl">
            Every FR2P member will have access to a vetted, licensed financial broker — someone who understands
            the community and speaks your language. No gatekeeping, no minimums that price you out.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-2 border-blue-400 bg-gradient-to-br from-blue-800 to-blue-950">
              <CardHeader>
                <div className="text-3xl mb-2">📈</div>
                <CardTitle className="text-white text-xl">ETF & Index Fund Portfolio</CardTitle>
                <p className="text-white/75 text-sm">
                  Work with an FR2P-connected broker to build a simple, diversified ETF or index fund portfolio.
                  S&P 500, dividend funds, sector ETFs — your broker walks you through every choice.
                </p>
              </CardHeader>
              <CardContent className="space-y-2">
                {["Personalized portfolio recommendations", "S&P 500, dividend ETFs, bond funds", "Low-cost index fund strategies", "Quarterly portfolio reviews", "Tax-advantaged account setup (IRA, Roth IRA)"].map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-white/85">
                    <CheckCircle className="w-4 h-4 text-[#FFD700] shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-400 bg-gradient-to-br from-purple-800 to-purple-950">
              <CardHeader>
                <div className="text-3xl mb-2">🎯</div>
                <CardTitle className="text-white text-xl">Retirement & Long-Term Planning</CardTitle>
                <p className="text-white/75 text-sm">
                  Your FR2P broker doesn't just help you invest — they help you plan. Retirement accounts,
                  college savings, estate planning basics. Building something that lasts beyond you.
                </p>
              </CardHeader>
              <CardContent className="space-y-2">
                {["Traditional & Roth IRA setup", "401(k) rollover guidance", "Compound interest strategy", "Long-term wealth preservation", "Generational wealth planning basics"].map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-white/85">
                    <CheckCircle className="w-4 h-4 text-[#FFD700] shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 bg-blue-900/40 border border-blue-400/40 rounded-xl p-6 text-center">
            <PieChart className="h-8 w-8 text-blue-300 mx-auto mb-3" />
            <h3 className="text-white font-bold text-lg mb-2">Broker Access — The FR2P Difference</h3>
            <p className="text-white/70 text-sm max-w-2xl mx-auto">
              Most people never talk to a broker because they don't know how to find one they can trust, or they don't think they have enough money to be taken seriously.
              FR2P changes that. Your membership gives you a warm introduction — no cold calls, no gatekeeping.
              The broker already knows what the FR2P community is building. You just show up and have the conversation.
            </p>
          </div>
        </div>

        {/* ── BANKING ACCESS ── */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <Landmark className="h-8 w-8 text-[#FFD700]" />
            <h2 className="text-3xl font-bold text-[#FFD700]">Banking & Lending Access</h2>
            <Badge className="bg-amber-500 text-white">Coming Soon</Badge>
          </div>
          <p className="text-white/75 mb-8 text-base max-w-3xl">
            Derrick's vision: <strong className="text-white">you walk in, you sign the paper, you leave with the deal done.</strong> 
            FR2P is building relationships with banks and credit unions so members already have the connection
            before they even walk through the door.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {[
              { icon: Home, label: "Real Estate Deals", desc: "Mortgage-ready introductions. FR2P members walk in pre-connected, not cold.", color: "text-emerald-400" },
              { icon: Car, label: "Auto Financing", desc: "Financed vehicle with a banker who knows your name and your community's track record.", color: "text-blue-400" },
              { icon: CreditCard, label: "Business Loans", desc: "SBA loans, business lines of credit — your banker understands what you're building.", color: "text-amber-400" },
              { icon: TrendingUp, label: "Personal Credit Building", desc: "Guidance on credit repair, building scores, and accessing better rates over time.", color: "text-purple-400" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-white/8 border border-white/20 rounded-xl p-5 text-center hover:border-[#FFD700]/50 transition-colors">
                  <Icon className={`h-8 w-8 ${item.color} mx-auto mb-3`} />
                  <h3 className="text-white font-bold text-sm mb-2">{item.label}</h3>
                  <p className="text-white/65 text-xs">{item.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-gradient-to-r from-[#001f3f] to-[#002855] border-2 border-[#FFD700]/40 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <Handshake className="h-10 w-10 text-[#FFD700] shrink-0 mt-1" />
              <div>
                <h3 className="text-[#FFD700] font-bold text-lg mb-2">How the Banking Relationship Works</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  {[
                    { step: "1", title: "You join FR2P", desc: "Your membership is your credential. You're part of a vetted, financially-minded community." },
                    { step: "2", title: "FR2P makes the intro", desc: "We connect you to our banking partner with a warm handoff — not a cold application on a website." },
                    { step: "3", title: "You go sign the paper", desc: "Walk in, meet your banker, review the terms, sign. The relationship is already established." },
                  ].map((s, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-7 h-7 bg-[#FFD700] text-[#001f3f] rounded-full flex items-center justify-center font-black text-sm shrink-0">{s.step}</div>
                      <div>
                        <div className="text-white font-semibold mb-1">{s.title}</div>
                        <div className="text-white/65">{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── INVEST INTO FR2P ── */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <Eye className="h-8 w-8 text-[#FFD700]" />
            <h2 className="text-3xl font-bold text-[#FFD700]">Invest Into FR2P Itself</h2>
            <Badge className="bg-amber-500 text-white">Future Feature</Badge>
          </div>
          <p className="text-white/75 mb-8 text-base max-w-3xl">
            In the future, members will be able to invest directly into The FR2P Club as a platform —
            and see exactly where every dollar is deployed. Full transparency. No guesswork.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-[#001f3f] to-[#002855] border-2 border-[#FFD700]/40 rounded-xl p-6">
              <Shield className="h-8 w-8 text-[#FFD700] mb-4" />
              <h3 className="text-[#FFD700] font-bold text-lg mb-3">What Your Investment Funds</h3>
              <div className="space-y-3">
                {[
                  { label: "Platform Technology & Development", pct: "30%", desc: "Better tools, faster speeds, new features for members" },
                  { label: "Commission Reserve Fund", pct: "25%", desc: "Ensures commissions are always paid on time, every time" },
                  { label: "Member Acquisition Marketing", pct: "20%", desc: "Growing the club — more members means more value for everyone" },
                  { label: "Real Estate Fund (Member Pool)", pct: "15%", desc: "Collective real estate purchases that pay dividends back to members" },
                  { label: "Legal, Compliance & Operations", pct: "10%", desc: "Keeping FR2P FTC-compliant, protected, and professionally run" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="text-[#FFD700] font-black text-sm w-12 shrink-0 pt-0.5">{item.pct}</div>
                    <div>
                      <div className="text-white text-sm font-semibold">{item.label}</div>
                      <div className="text-white/55 text-xs">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#001f3f] to-[#002855] border-2 border-[#FFD700]/40 rounded-xl p-6">
              <Eye className="h-8 w-8 text-[#FFD700] mb-4" />
              <h3 className="text-[#FFD700] font-bold text-lg mb-3">Full Transparency — Always</h3>
              <p className="text-white/75 text-sm mb-5">
                When member investment is opened, a live dashboard will show every dollar raised, every dollar spent, and every return distributed back.
                You'll never have to wonder where your money went.
              </p>
              <div className="space-y-3">
                {[
                  "Real-time fund allocation dashboard",
                  "Monthly financial transparency reports",
                  "Investor-tier voting rights on major decisions",
                  "Quarterly dividend distributions from platform profits",
                  "Direct line to Derrick Taylor as the fund grows",
                ].map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-white/80">
                    <CheckCircle className="w-4 h-4 text-[#FFD700] shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-lg p-3 text-xs text-[#FFD700]/80 italic">
                Investment offering will be structured and registered in compliance with applicable securities laws. Details TBD as the platform grows.
              </div>
            </div>
          </div>
        </div>

        {/* ── WHY IT COSTS MORE TO LEAVE ── */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <TrendingDown className="h-8 w-8 text-red-400" />
            <h2 className="text-3xl font-bold text-white">Why It Costs More to <span className="text-red-400">Leave</span> Than to Stay</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-red-900/30 border-2 border-red-400/50 rounded-xl p-6">
              <h3 className="text-red-300 font-bold text-lg mb-4">❌ If You Cancel Your Membership</h3>
              <div className="space-y-3 text-sm">
                {[
                  { loss: "You lose your recurring $5/month commission per referral", detail: "Every active referral contributes to your monthly commission volume. Cancel and that recurring activity stops." },
                  { loss: "You lose your place in the achievement tier system", detail: "Your Bronze → Diamond progress, your certificates, your status — gone." },
                  { loss: "You lose broker & banking access", detail: "No more warm introductions. You're back to cold applications." },
                  { loss: "You lose real estate investment access", detail: "The pooled fund opportunity requires an active membership." },
                  { loss: "You lose your Founding Member locked-in rate", detail: "If you rejoined as a new member after 90 days, any founding benefits don't carry over." },
                ].map((item, i) => (
                  <div key={i} className="border-l-2 border-red-400/40 pl-3">
                    <div className="text-red-200 font-semibold">{item.loss}</div>
                    <div className="text-white/55">{item.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-green-900/30 border-2 border-green-400/50 rounded-xl p-6">
              <h3 className="text-green-300 font-bold text-lg mb-4">✅ If You Stay in The FR2P Club</h3>
              <div className="space-y-3 text-sm">
                {[
                  { gain: "Recurring commission potential grows over time", detail: "Every month you stay is another month your 5+ referrals can generate $5 each in recurring commissions." },
                  { gain: "Access unlocks grow over time", detail: "Broker access, banking relationships, real estate fund — all coming for active members." },
                  { gain: "7 referrals = $0 net cost", detail: "At 7 referrals, your $35/month membership is covered by commission. You're in for free." },
                  { gain: "Tier bonuses keep stacking", detail: "Bronze → Silver → Gold → Platinum → Diamond bonuses only come to active, paying members." },
                  { gain: "You get to invest INTO FR2P", detail: "Future investor tier opens only to members who've stayed and built trust in the platform." },
                ].map((item, i) => (
                  <div key={i} className="border-l-2 border-green-400/40 pl-3">
                    <div className="text-green-200 font-semibold">{item.gain}</div>
                    <div className="text-white/55">{item.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#001f3f] to-[#002855] border-2 border-[#FFD700] rounded-xl p-6 text-center">
            <Star className="h-8 w-8 text-[#FFD700] mx-auto mb-3" />
            <h3 className="text-[#FFD700] font-bold text-xl mb-2">The Math Is Simple</h3>
            <p className="text-white/80 text-base max-w-2xl mx-auto">
              With just <strong className="text-[#FFD700]">7 referrals</strong>, your $35/month membership pays for itself. Every referral after that is pure profit — 
              building recurring commission potential. The longer you stay, the more referrals you build, the more the platform opens up to you.
              <strong className="text-[#FFD700]"> Getting out costs you money. Staying makes you money.</strong>
            </p>
          </div>
        </div>

        {/* ── INCOME PROJECTION ── */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-14">
          <h2 className="text-2xl font-bold text-[#FFD700] mb-6 text-center">Multi-Stream Income Projection</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-white/90">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3 px-4 text-[#FFD700]">Income Stream</th>
                  <th className="text-center py-3 px-4 text-[#FFD700]">Year 1</th>
                  <th className="text-center py-3 px-4 text-[#FFD700]">Year 3</th>
                  <th className="text-center py-3 px-4 text-[#FFD700]">Year 5</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Membership Reoccurring Income (growing referrals)", "$250/mo", "$600/mo", "$1,200/mo"],
                  ["Digital Product Sales", "$100/mo", "$300/mo", "$500/mo"],
                  ["Certification Commissions", "$75/mo", "$200/mo", "$400/mo"],
                  ["Real Estate Dividends", "$25/qtr", "$150/qtr", "$400/qtr"],
                  ["ETF / Portfolio Growth", "—", "$50/mo", "$200/mo"],
                  ["Apparel & Merchandise", "$50/mo", "$150/mo", "$300/mo"],
                ].map(([stream, y1, y3, y5], i) => (
                  <tr key={i} className="border-b border-white/10">
                    <td className="py-3 px-4">{stream}</td>
                    <td className="text-center py-3 px-4">{y1}</td>
                    <td className="text-center py-3 px-4">{y3}</td>
                    <td className="text-center py-3 px-4">{y5}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-[#FFD700] font-bold text-[#FFD700]">
                  <td className="py-3 px-4">APPROXIMATE TOTAL</td>
                  <td className="text-center py-3 px-4">~$480/mo</td>
                  <td className="text-center py-3 px-4">~$1,300/mo</td>
                  <td className="text-center py-3 px-4">~$2,600/mo</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-white/40 mt-4 text-center italic">
            *Illustrative projections only. Income is not guaranteed. Actual results vary based on individual effort, market conditions, and investment performance. 
            Real estate and ETF income requires separate investment action. FTC-compliant — single-tier referrals only.
          </p>
        </div>

        {/* ── CTA ── */}
        <div className="bg-gradient-to-r from-[#001f3f] to-[#002855] border-2 border-[#FFD700] rounded-xl p-8 text-center">
          <Target className="h-12 w-12 text-[#FFD700] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#FFD700] mb-3">Start Building Your Wealth Ecosystem</h2>
          <p className="text-white/80 mb-6 max-w-2xl mx-auto">
            Everything you've read on this page comes with membership to The FR2P Club.
            The broker. The banker. The real estate access. The transparency. The community.
            All of it starts with joining.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/join">
              <Button className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#001f3f] font-bold px-8 text-base">
                <ArrowRight className="h-5 w-5 mr-2" />
                Join The FR2P Club
              </Button>
            </a>
            <a href="/compensation-plan">
              <Button variant="outline" className="border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700]/10 font-bold px-8">
                <DollarSign className="h-5 w-5 mr-2" />
                See the Compensation Plan
              </Button>
            </a>
          </div>
        </div>

        <div className="text-center mt-12 text-white/40 text-sm">
          FR2P Wealth Building · Multiple Streams, One Vision, Generational Legacy · The Consolidatus Empire
        </div>
      </div>
    </div>
  );
}
