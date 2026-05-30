import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, DollarSign, Users, Shield, Star, TrendingUp, Award, ChevronDown, ChevronUp, Calculator, Clock, Zap } from "lucide-react";

export default function WhyJoin() {
  const [referralCount, setReferralCount] = useState(7);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [memberCount, setMemberCount] = useState(0);

  const { data: statsData } = useQuery<{ totalMembers: number }>({
    queryKey: ["/api/stats/public"],
  });

  useEffect(() => {
    if (statsData?.totalMembers) {
      setMemberCount(statsData.totalMembers);
    }
  }, [statsData]);

  const monthlyEarnings = referralCount * 5;
  const yearlyEarnings = monthlyEarnings * 12;
  const netMonthlyCost = Math.max(0, 35 - monthlyEarnings);
  const isEssentiallyFree = monthlyEarnings >= 35;
  const foundingMemberSpotsLeft = Math.max(0, 500 - memberCount);
  const foundingMemberPercent = Math.min(100, (memberCount / 500) * 100);

  const faqs = [
    {
      q: "Is there a time limit to get my 7 referrals?",
      a: "No time limit at all. You can take 3 weeks or 3 years — there's no deadline. The moment you hit 7 active referrals, your commissions cover your membership cost every month going forward, permanently."
    },
    {
      q: "Do I stop paying once my commissions cover my membership?",
      a: "You continue paying $35/month, but you also receive $35/month back in commissions. Your net cost becomes $0. Both sides keep running — that's what funds the permanent residual income promise for your referrer too."
    },
    {
      q: "What if one of my referrals cancels their membership?",
      a: "Here's the powerful part — your $5/month commission on that person is LOCKED IN on their first payment. Even if they cancel, you continue earning your residual income from them. It's truly permanent."
    },
    {
      q: "When do I start earning commissions?",
      a: "Commission eligibility begins after you've been an active paid member for 60 consecutive days (2 months). This separates the curious from the serious and ensures you're committed before you start building your income."
    },
    {
      q: "What if I need to stop paying for a while?",
      a: "Your account stays active in the system for 90 days after your last payment. You can log back in and pick up right where you left off — your referrals, your rank, your history all intact. After 90 days, you'd rejoin as a new member."
    },
    {
      q: "Is this a pyramid scheme?",
      a: "No. FR2P is a fully FTC-compliant single-tier affiliate model. You only earn commissions from your direct referrals — nobody else's. There are no levels of commission, no pay-to-play bonuses, and no recruiting quotas. It's straightforward affiliate marketing."
    },
    {
      q: "What do I actually get for my $35/month?",
      a: "Full affiliate platform access, your personal referral link, community chat and support, access to professional training resources, digital education materials, FR2P Wealth Monthly magazine, and a reward structure offering potential earnings of $5/month per direct referral — permanently locked in once the referral joins."
    },
  ];

  const comparisons = [
    { option: "The FR2P Club", cost: "$35/mo", potential: "$5/mo per referral potential earnings", passive: true, training: true, community: true },
    { option: "Uber/Lyft Driver", cost: "Your car + gas", potential: "$15–25/hr (active only)", passive: false, training: false, community: false },
    { option: "Dropshipping", cost: "$500–2,000 setup", potential: "Varies, not guaranteed", passive: false, training: false, community: false },
    { option: "Amazon FBA", cost: "$3,000–10,000 setup", potential: "Varies, highly competitive", passive: false, training: true, community: false },
    { option: "MLM / Network Mktg", cost: "$100–500/mo in product", potential: "Multiple levels, complex", passive: false, training: true, community: true },
  ];

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #001f3f 0%, #002952 50%, #001f3f 100%)" }}>
      {/* Header */}
      <div className="text-white py-8 px-6 text-center">
        <div className="max-w-5xl mx-auto">
          <img src="/fr2p-logo.jpeg" alt="The FR2P Club" className="w-20 h-20 rounded-full border-4 border-yellow-400 shadow-lg mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold" style={{ color: "#FFD700" }}>Why Join The FR2P Club?</h1>
          <p className="text-xl text-white/80 mt-3 max-w-2xl mx-auto">
            The honest breakdown every leader, church presenter, and school educator needs — before sharing this opportunity.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-6">
            <Link href="/join">
              <Button className="text-lg px-8 py-6 font-bold" style={{ backgroundColor: "#FFD700", color: "#001f3f" }}>
                Join Now — $35/month
              </Button>
            </Link>
            <a href="tel:6672681022">
              <Button variant="outline" className="text-lg px-8 py-6 border-yellow-400 text-yellow-400 hover:bg-yellow-400/10">
                Sizzle Call: (667) 268-1022
              </Button>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-16 space-y-10">

        {/* FEATURE 1 + 3: Founding Member Countdown + Live Member Counter */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-yellow-400 bg-yellow-400/10 text-white">
            <CardContent className="pt-6 text-center">
              <Star className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-yellow-400 mb-1">Founding Member Spots</h3>
              <div className="text-5xl font-bold text-white my-3">{foundingMemberSpotsLeft}</div>
              <p className="text-white/80 text-sm mb-4">of 500 Founding Member spots remaining</p>
              <div className="w-full bg-white/20 rounded-full h-4 mb-2">
                <div
                  className="h-4 rounded-full transition-all duration-500"
                  style={{ width: `${foundingMemberPercent}%`, backgroundColor: "#FFD700" }}
                />
              </div>
              <p className="text-yellow-300 text-xs font-semibold mt-2">
                Founding Members earn enhanced commission rates — don't miss this window
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-400 bg-blue-400/10 text-white">
            <CardContent className="pt-6 text-center">
              <Users className="w-10 h-10 text-blue-300 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-blue-300 mb-1">Active Members</h3>
              <div className="text-5xl font-bold text-white my-3">{memberCount > 0 ? memberCount.toLocaleString() : "—"}</div>
              <p className="text-white/80 text-sm mb-4">people already said yes to financial freedom</p>
              <div className="bg-blue-900/50 rounded-lg p-3">
                <p className="text-blue-200 text-sm">
                  Every member here started exactly where you are — with a decision.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FEATURE 9: 7-Referral Badge + Breakdown */}
        <Card className="border-2 border-yellow-400 text-white" style={{ backgroundColor: "#001f3f" }}>
          <CardHeader>
            <CardTitle className="text-yellow-400 text-2xl text-center flex items-center justify-center gap-2">
              <DollarSign className="w-7 h-7" />
              The "Essentially Free" Breakdown — Exactly How It Works
            </CardTitle>
            <p className="text-white/70 text-center text-sm">
              This is the breakdown every certified presenter should know by heart
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-white/10 rounded-xl p-5 border border-white/20">
                <div className="text-4xl font-bold text-yellow-400">$35</div>
                <div className="text-white/80 mt-1">Monthly Membership Cost</div>
                <div className="text-xs text-white/50 mt-2">Standard Plan</div>
              </div>
              <div className="bg-white/10 rounded-xl p-5 border border-white/20">
                <div className="text-4xl font-bold text-yellow-400">$5</div>
                <div className="text-white/80 mt-1">Commission Per Referral/Month</div>
                <div className="text-xs text-white/50 mt-2">Paid to you, permanently</div>
              </div>
              <div className="bg-yellow-400/20 rounded-xl p-5 border-2 border-yellow-400">
                <div className="text-4xl font-bold text-yellow-400">7</div>
                <div className="text-white mt-1 font-semibold">Referrals = Net $0 Cost</div>
                <div className="text-xs text-yellow-300 mt-2">$35 ÷ $5 = 7</div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/20 rounded-xl p-6 space-y-4">
              <h4 className="text-yellow-400 font-bold text-lg">Important: What "Essentially Free" Actually Means</h4>
              <div className="space-y-3 text-white/90 text-sm leading-relaxed">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p>You continue paying your $35/month membership — this keeps the platform running and funds everyone's commissions.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p>With 7 direct referrals, you also receive $35/month in commissions (7 × $5 = $35). Money in equals money back.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p><strong className="text-yellow-400">Net cost = $0.</strong> You're in the program for free, and every referral beyond 7 is pure profit in your pocket.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p>There is <strong className="text-yellow-400">no time limit</strong> to reach 7 referrals. Take your time — this is a journey, not a race.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p>Your commission is <strong className="text-yellow-400">LOCKED IN</strong> on each referral's first payment — it's permanent even if they later cancel.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              {[
                { ref: 5, label: "5 referrals", earn: "$25/mo", note: "71% covered" },
                { ref: 7, label: "7 referrals", earn: "$35/mo", note: "Essentially FREE ✓" },
                { ref: 10, label: "10 referrals", earn: "$50/mo", note: "+$15/mo profit" },
              ].map((item) => (
                <div key={item.ref} className={`rounded-lg p-4 border ${item.ref === 7 ? "border-yellow-400 bg-yellow-400/20" : "border-white/20 bg-white/5"}`}>
                  <div className="font-bold text-yellow-400 text-lg">{item.label}</div>
                  <div className="text-white font-semibold">{item.earn}</div>
                  <div className={`text-xs mt-1 ${item.ref === 7 ? "text-yellow-300" : "text-white/60"}`}>{item.note}</div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <p className="text-white/70 text-sm italic">
                The "Get 5, Teach 5" model is your <strong className="text-yellow-400">growth and duplication strategy</strong> —
                separate from the break-even point. 5 is how you build your network. 7 is where your cost disappears.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* FEATURE 1: Income Calculator */}
        <Card className="border-2 border-green-400 text-white" style={{ backgroundColor: "#001f3f" }}>
          <CardHeader>
            <CardTitle className="text-green-400 text-2xl flex items-center gap-2">
              <Calculator className="w-7 h-7" />
              Your Personal Income Calculator
            </CardTitle>
            <p className="text-white/70 text-sm">Drag the slider to see your projected income at any referral count</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-white/80 text-sm mb-2">
                <span>Number of direct referrals: <strong className="text-white text-lg">{referralCount}</strong></span>
                <span className="text-white/50">Max shown: 50</span>
              </div>
              <input
                type="range"
                min={1}
                max={50}
                value={referralCount}
                onChange={(e) => setReferralCount(Number(e.target.value))}
                className="w-full h-3 rounded-full cursor-pointer accent-yellow-400"
              />
              <div className="flex justify-between text-white/40 text-xs mt-1">
                <span>1</span><span>10</span><span>20</span><span>30</span><span>40</span><span>50</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className={`rounded-xl p-4 border ${isEssentiallyFree ? "border-green-400 bg-green-400/10" : "border-white/20 bg-white/5"}`}>
                <div className={`text-3xl font-bold ${isEssentiallyFree ? "text-green-400" : "text-yellow-400"}`}>
                  ${monthlyEarnings}
                </div>
                <div className="text-white/70 text-sm mt-1">Monthly Commissions</div>
              </div>
              <div className="rounded-xl p-4 border border-white/20 bg-white/5">
                <div className="text-3xl font-bold text-yellow-400">${yearlyEarnings.toLocaleString()}</div>
                <div className="text-white/70 text-sm mt-1">Annual Commissions</div>
              </div>
              <div className={`rounded-xl p-4 border ${isEssentiallyFree ? "border-green-400 bg-green-400/10" : "border-red-400/50 bg-red-400/5"}`}>
                <div className={`text-3xl font-bold ${isEssentiallyFree ? "text-green-400" : "text-red-400"}`}>
                  {isEssentiallyFree ? "FREE" : `$${netMonthlyCost}`}
                </div>
                <div className="text-white/70 text-sm mt-1">Your Net Monthly Cost</div>
              </div>
              <div className="rounded-xl p-4 border border-white/20 bg-white/5">
                <div className="text-3xl font-bold text-blue-300">${(monthlyEarnings - 35 > 0 ? monthlyEarnings - 35 : 0)}</div>
                <div className="text-white/70 text-sm mt-1">Monthly Profit</div>
              </div>
            </div>

            {isEssentiallyFree && (
              <div className="bg-green-400/20 border-2 border-green-400 rounded-xl p-4 text-center">
                <div className="text-green-400 font-bold text-xl">
                  At {referralCount} referrals, your membership is essentially FREE!
                </div>
                <div className="text-white/80 text-sm mt-1">
                  Your ${monthlyEarnings}/month in commissions covers your $35/month membership — net cost $0.
                </div>
              </div>
            )}

            {!isEssentiallyFree && (
              <div className="bg-white/5 border border-white/20 rounded-xl p-4 text-center">
                <div className="text-yellow-400 font-semibold">
                  {7 - referralCount} more referral{7 - referralCount !== 1 ? "s" : ""} to reach essentially free!
                </div>
                <div className="text-white/60 text-sm mt-1">
                  At 7 referrals, your commissions match your membership cost — net $0.
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* FEATURE 5: What It Costs vs What It Pays */}
        <Card className="text-white border border-white/20" style={{ backgroundColor: "#001f3f" }}>
          <CardHeader>
            <CardTitle className="text-yellow-400 text-2xl flex items-center gap-2">
              <TrendingUp className="w-7 h-7" />
              What It Costs vs. What It Pays
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-red-400 font-semibold text-lg mb-3">Your Investment (Standard)</h4>
                {[
                  ["Monthly membership", "$35/month"],
                  ["Annual membership (save $71.40)", "$348.60/year"],
                  ["One-time setup cost", "$0"],
                  ["Required product purchases", "$0"],
                  ["Inventory or stock", "$0"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-white/80 text-sm">{label}</span>
                    <span className="text-white font-semibold">{value}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <h4 className="text-green-400 font-semibold text-lg mb-3">What Comes Back to You</h4>
                {[
                  ["7 referrals (break-even)", "$35/month forever"],
                  ["10 referrals", "$50/month forever"],
                  ["20 referrals", "$100/month forever"],
                  ["50 referrals", "$250/month forever"],
                  ["100 referrals", "$500/month forever"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-white/80 text-sm">{label}</span>
                    <span className="text-green-400 font-semibold">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 bg-yellow-400/10 border border-yellow-400 rounded-xl p-4 text-center">
              <p className="text-yellow-400 font-bold">The income is permanent — even after referrals stop paying.</p>
              <p className="text-white/70 text-sm mt-1">Commission is locked in on each referral's first payment and continues forever.</p>
            </div>
          </CardContent>
        </Card>

        {/* FEATURE 6: Side Hustle Comparison */}
        <Card className="text-white border border-white/20" style={{ backgroundColor: "#001f3f" }}>
          <CardHeader>
            <CardTitle className="text-yellow-400 text-2xl flex items-center gap-2">
              <Zap className="w-7 h-7" />
              FR2P vs. Other Income Opportunities
            </CardTitle>
            <p className="text-white/70 text-sm">See how FR2P stacks up against other ways people try to earn extra income</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 text-white/60">Opportunity</th>
                    <th className="text-left py-3 text-white/60">Monthly Cost</th>
                    <th className="text-left py-3 text-white/60">Income Potential</th>
                    <th className="text-center py-3 text-white/60">Passive</th>
                    <th className="text-center py-3 text-white/60">Training</th>
                    <th className="text-center py-3 text-white/60">Community</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((row, i) => (
                    <tr key={i} className={`border-b border-white/10 ${i === 0 ? "bg-yellow-400/10" : ""}`}>
                      <td className={`py-3 font-semibold ${i === 0 ? "text-yellow-400" : "text-white"}`}>{row.option}</td>
                      <td className="py-3 text-white/80">{row.cost}</td>
                      <td className={`py-3 ${i === 0 ? "text-green-400 font-semibold" : "text-white/80"}`}>{row.potential}</td>
                      <td className="py-3 text-center">{row.passive ? "✅" : "❌"}</td>
                      <td className="py-3 text-center">{row.training ? "✅" : "❌"}</td>
                      <td className="py-3 text-center">{row.community ? "✅" : "❌"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* FEATURE 4: Testimonials */}
        <Card className="text-white border border-white/20" style={{ backgroundColor: "#001f3f" }}>
          <CardHeader>
            <CardTitle className="text-yellow-400 text-2xl flex items-center gap-2">
              <Star className="w-7 h-7" />
              Member Success Stories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: "Marcus T.",
                  location: "Baltimore, MD",
                  story: "I was skeptical at first. But when I really looked at the math — $35 a month, and I only need 7 people to make it free — it clicked. I joined, got my first 5 referrals within a month, and I'm almost at break-even already.",
                  achievement: "Bronze Affiliate",
                  initials: "MT",
                },
                {
                  name: "Denise R.",
                  location: "Atlanta, GA",
                  story: "What sold me was the 90-day grace period. Life happens. Knowing my account doesn't just vanish if I miss a payment gave me the confidence to commit. I've since referred 12 people and have reached $60/month in potential earnings.",
                  achievement: "Silver Affiliate",
                  initials: "DR",
                },
                {
                  name: "Pastor James W.",
                  location: "Houston, TX",
                  story: "I presented this to my congregation after getting certified. The fact that it's FTC-compliant, single-tier only, and actually teaches financial literacy made it easy for me to endorse it. Six families in our church have already joined.",
                  achievement: "Gold Affiliate",
                  initials: "JW",
                },
              ].map((t) => (
                <div key={t.name} className="bg-white/5 border border-white/20 rounded-xl p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 border-yellow-400" style={{ backgroundColor: "#002952", color: "#FFD700" }}>
                      {t.initials}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{t.name}</div>
                      <div className="text-white/60 text-xs">{t.location}</div>
                    </div>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed italic">"{t.story}"</p>
                  <Badge className="bg-yellow-400/20 text-yellow-400 border border-yellow-400">
                    <Award className="w-3 h-3 mr-1" />
                    {t.achievement}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FEATURE 8: Risk Reducer */}
        <Card className="text-white border-2 border-blue-400" style={{ backgroundColor: "#001f3f" }}>
          <CardHeader>
            <CardTitle className="text-blue-300 text-2xl flex items-center gap-2">
              <Shield className="w-7 h-7" />
              Built-In Protections — Your Safety Net
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-5">
              <div className="bg-blue-900/40 border border-blue-400/40 rounded-xl p-5 text-center">
                <Clock className="w-10 h-10 text-blue-300 mx-auto mb-3" />
                <h4 className="text-blue-300 font-bold text-lg mb-2">90-Day Grace Period</h4>
                <p className="text-white/80 text-sm">If life happens and you stop paying, your account stays active for 90 days. Log back in and pick up right where you left off — all your referrals, rank, and history preserved.</p>
              </div>
              <div className="bg-blue-900/40 border border-blue-400/40 rounded-xl p-5 text-center">
                <DollarSign className="w-10 h-10 text-blue-300 mx-auto mb-3" />
                <h4 className="text-blue-300 font-bold text-lg mb-2">30-Day Commission Hold</h4>
                <p className="text-white/80 text-sm">Commissions are held for 30 days before payout — a built-in quality check that protects the business and ensures payouts are always covered.</p>
              </div>
              <div className="bg-blue-900/40 border border-blue-400/40 rounded-xl p-5 text-center">
                <Shield className="w-10 h-10 text-blue-300 mx-auto mb-3" />
                <h4 className="text-blue-300 font-bold text-lg mb-2">FTC Compliant</h4>
                <p className="text-white/80 text-sm">Strictly single-tier. You earn only from your direct referrals — no complex levels, no pyramid structure. Built to be something you can stand behind proudly.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FEATURE 7: Mentor / Accountability Matching */}
        <Card className="text-white border border-white/20" style={{ backgroundColor: "#001f3f" }}>
          <CardHeader>
            <CardTitle className="text-yellow-400 text-2xl flex items-center gap-2">
              <Users className="w-7 h-7" />
              Mentor & Accountability Partner Program
            </CardTitle>
            <p className="text-white/70 text-sm">You don't have to figure this out alone</p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-white/5 border border-white/20 rounded-xl p-5">
                <h4 className="text-yellow-400 font-bold mb-3">New Member Support</h4>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />Paired with a certified mentor from day one</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />Weekly check-ins for your first 60 days</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />Guided onboarding through community chat</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />Access to a private support group for questions</li>
                </ul>
              </div>
              <div className="bg-white/5 border border-white/20 rounded-xl p-5">
                <h4 className="text-yellow-400 font-bold mb-3">Accountability Features</h4>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />Set your personal referral goals in the dashboard</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />Track your progress toward each achievement tier</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />Celebrate milestones with your sponsor community</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />Earn your FR2P Certification to present to schools and churches</li>
                </ul>
              </div>
            </div>
            <div className="bg-yellow-400/10 border border-yellow-400 rounded-xl p-4 text-center">
              <p className="text-yellow-400 font-semibold">Ready to become a certified FR2P presenter?</p>
              <p className="text-white/70 text-sm mt-1">Diamond members who complete their FR2P Certification can present this program to schools, churches, and community organizations.</p>
              <Link href="/certifications">
                <Button className="mt-3" style={{ backgroundColor: "#FFD700", color: "#001f3f" }}>
                  View Certification Program
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* CERTIFICATE PROGRESSION SHOWCASE */}
        <Card className="text-white border border-white/20 overflow-hidden" style={{ backgroundColor: "#001f3f" }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-yellow-400 text-2xl flex items-center gap-2">
              <Award className="w-7 h-7" />
              Your Achievement Certificate Progression
            </CardTitle>
            <p className="text-white/70 text-sm">
              Every milestone you hit earns a real, personalized digital certificate. Here's what the journey looks like — Bronze to Diamond.
            </p>
          </CardHeader>
          <CardContent>
            {/* Desktop: 5 columns | Mobile: horizontal scroll */}
            <div className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-5 md:gap-5 md:overflow-visible">
              {[
                {
                  tier: "bronze",
                  name: "Bronze",
                  refs: "5 referrals",
                  circle: "1st Circle of Influence",
                  color: "#CD7F32",
                  glow: "rgba(205,127,50,0.35)",
                  bonus: "$50 bonus",
                  icon: "🥉",
                },
                {
                  tier: "silver",
                  name: "Silver",
                  refs: "10 referrals",
                  circle: "2nd Circle of Influence",
                  color: "#C0C0C0",
                  glow: "rgba(192,192,192,0.35)",
                  bonus: "$100 bonus",
                  icon: "🥈",
                },
                {
                  tier: "gold",
                  name: "Gold",
                  refs: "15 referrals",
                  circle: "3rd Circle of Influence",
                  color: "#FFD700",
                  glow: "rgba(255,215,0,0.35)",
                  bonus: "$200 bonus",
                  icon: "🥇",
                },
                {
                  tier: "platinum",
                  name: "Platinum",
                  refs: "20 referrals",
                  circle: "4th Circle of Influence",
                  color: "#E5E4E2",
                  glow: "rgba(229,228,226,0.35)",
                  bonus: "$300 bonus",
                  icon: "💎",
                },
                {
                  tier: "diamond",
                  name: "Diamond",
                  refs: "25 referrals",
                  circle: "5th Circle — Complete Network",
                  color: "#B9F2FF",
                  glow: "rgba(185,242,255,0.45)",
                  bonus: "$500 bonus",
                  icon: "👑",
                  special: true,
                },
              ].map((t, i) => (
                <div key={t.tier} className="flex flex-col items-center shrink-0 w-52 md:w-auto">
                  {/* Arrow between tiers */}
                  {i > 0 && (
                    <div className="hidden md:flex absolute items-center justify-center pointer-events-none" style={{ marginLeft: "-2rem" }}>
                    </div>
                  )}

                  {/* Certificate image */}
                  <div
                    className="w-full rounded-xl overflow-hidden border-2 transition-transform hover:scale-105 cursor-pointer relative"
                    style={{ borderColor: t.color, boxShadow: `0 0 18px ${t.glow}` }}
                    onClick={() => window.open(`/uploads/certificates/${t.tier}_certificate.png`, "_blank")}
                  >
                    <img
                      src={`/uploads/certificates/${t.tier}_certificate.png`}
                      alt={`${t.name} Affiliate Ambassador Certificate`}
                      className="w-full object-cover"
                      style={{ aspectRatio: "4/3" }}
                    />
                    {t.special && (
                      <div className="absolute top-2 right-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#FFD700", color: "#001f3f" }}>TOP TIER</span>
                      </div>
                    )}
                  </div>

                  {/* Tier info */}
                  <div className="mt-3 text-center w-full">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-lg">{t.icon}</span>
                      <span className="font-bold text-base" style={{ color: t.color }}>{t.name} Affiliate</span>
                    </div>
                    <div className="text-white/60 text-xs mt-1">{t.refs}</div>
                    <div className="text-white/50 text-xs">{t.circle}</div>
                    <div className="mt-2 text-xs font-semibold rounded-full px-2 py-0.5 inline-block" style={{ backgroundColor: `${t.color}22`, color: t.color, border: `1px solid ${t.color}55` }}>
                      {t.bonus} recognition
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress arrow row */}
            <div className="hidden md:flex items-center justify-between px-8 my-2 mt-4">
              {["Bronze", "Silver", "Gold", "Platinum", "Diamond"].map((name, i) => (
                <div key={name} className="flex items-center flex-1">
                  {i < 4 && (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="h-0.5 w-full" style={{ background: "linear-gradient(to right, #CD7F32, #C0C0C0, #FFD700, #E5E4E2, #B9F2FF)" }} />
                      <div className="text-yellow-400 text-lg ml-1">→</div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Diamond Business Partner callout */}
            <div className="mt-6 rounded-xl p-5 border-2" style={{ backgroundColor: "rgba(185,242,255,0.05)", borderColor: "#B9F2FF" }}>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="text-4xl shrink-0">👑</div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg" style={{ color: "#B9F2FF" }}>Diamond Members: The Inner Circle</h4>
                  <p className="text-white/75 text-sm mt-1 leading-relaxed">
                    Reaching Diamond isn't just a milestone — it's an invitation. Diamond-level achievers are the individuals Derrick Taylor personally considers for direct business partnerships. 
                    These are the people who will work directly alongside him to scale The FR2P Club and The Consolidatus Empire. Diamond members don't just succeed — they <em>lead</em>.
                  </p>
                </div>
                <div className="shrink-0 text-center">
                  <div className="text-2xl font-bold" style={{ color: "#B9F2FF" }}>25</div>
                  <div className="text-white/50 text-xs">referrals to Diamond</div>
                  <div className="text-yellow-400 font-bold text-sm mt-1">$500 bonus</div>
                </div>
              </div>
            </div>

            <p className="text-white/40 text-xs text-center mt-4">Click any certificate above to view full size. Each certificate is personalized with your name when you earn it.</p>
          </CardContent>
        </Card>

        {/* FEATURE 10: FAQ */}
        <Card className="text-white border border-white/20" style={{ backgroundColor: "#001f3f" }}>
          <CardHeader>
            <CardTitle className="text-yellow-400 text-2xl">Frequently Asked Questions</CardTitle>
            <p className="text-white/70 text-sm">The top questions answered — perfect for sharing with prospects before they join</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-white/20 rounded-xl overflow-hidden">
                <button
                  className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-white font-semibold pr-4">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-5 h-5 text-yellow-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-yellow-400 shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-white/80 text-sm leading-relaxed border-t border-white/10 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Final CTA */}
        <div className="text-center space-y-4 py-6">
          <h2 className="text-3xl font-bold text-yellow-400">Ready to Begin Your Journey?</h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Join The FR2P Club today. Get your 7 referrals. Watch your membership become essentially free — forever.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-6">
            <Link href="/join">
              <Button className="text-xl px-10 py-7 font-bold shadow-2xl" style={{ backgroundColor: "#FFD700", color: "#001f3f" }}>
                Join Now — Start at $35/month
              </Button>
            </Link>
            <Link href="/compensation-plan">
              <Button variant="outline" className="text-xl px-10 py-7 border-yellow-400 text-yellow-400 hover:bg-yellow-400/10">
                See Full Compensation Plan
              </Button>
            </Link>
          </div>
          <p className="text-white/50 text-sm">No time limit. No inventory. No pressure. Just results.</p>
        </div>

      </div>
    </div>
  );
}
