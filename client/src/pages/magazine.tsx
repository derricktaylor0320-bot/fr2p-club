import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import type { MemberResponse } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import derrickPhoto from "@assets/1770453065586_1770453991342.png";
import {
  Mail,
  BookOpen,
  Users,
  Star,
  CheckCircle,
  TrendingUp,
  Shield,
  MessageSquare,
  Gift,
  Sparkles,
  Crown,
  Newspaper
} from "lucide-react";

import { getLoggedInMemberId } from "@/lib/auth";
const DEMO_USER_ID = getLoggedInMemberId();

const magazineSections = [
  {
    icon: Star,
    title: "Member Success Stories",
    description: "Spotlight members hitting financial milestones, launching side hustles, and growing through FR2P tools. Real wins, real people.",
    color: "text-yellow-400",
  },
  {
    icon: TrendingUp,
    title: "Six-Figure Blueprint",
    description: "Monthly breakdown of an online business model: digital products, affiliate marketing, print-on-demand, online coaching, AI services & more.",
    color: "text-green-400",
  },
  {
    icon: Sparkles,
    title: "FR2P Program Updates",
    description: "New tools, new certificates, new partnerships, new earning opportunities, and upcoming events or webinars.",
    color: "text-blue-400",
  },
  {
    icon: Shield,
    title: "Protection & Progress Tips",
    description: "How to protect your ideas, avoid scams, build digital autonomy, secure your online business, and maintain financial discipline.",
    color: "text-purple-400",
  },
  {
    icon: MessageSquare,
    title: "Derrick's Corner",
    description: "A short monthly message from the founder - a lesson, a reflection, a challenge, a mindset shift. Leadership and connection.",
    color: "text-orange-400",
  },
  {
    icon: Gift,
    title: "Monthly Free Resource",
    description: "A downloadable checklist, mini-guide, template, motivational wallpaper, or financial tracker. Real value you can use immediately.",
    color: "text-pink-400",
  },
];

const sampleIssues = [
  {
    month: "Launch Issue",
    title: "The Wealth Blueprint Begins",
    highlight: "How one FR2P member turned $35/month into a $2,000/month side income",
    blueprint: "Digital Products: Build Once, Sell Forever",
  },
  {
    month: "Issue #2",
    title: "The Power of Duplication",
    highlight: "From zero referrals to Bronze Ambassador in 30 days",
    blueprint: "Affiliate Marketing: Your First $1,000 Online",
  },
  {
    month: "Issue #3",
    title: "Building Generational Wealth",
    highlight: "How the FR2P Certification Program changes careers",
    blueprint: "Print-on-Demand: Design, List, Earn While You Sleep",
  },
];

export default function Magazine() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const { data: memberData } = useQuery<MemberResponse>({
    queryKey: ["/api/members", DEMO_USER_ID],
  });

  const { data: countData } = useQuery<{ count: number }>({
    queryKey: ["/api/magazine/count"],
  });

  const subscribeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/magazine/subscribe", {
        email: email || memberData?.member?.email,
        firstName: firstName || memberData?.member?.firstName,
        lastName: lastName || memberData?.member?.lastName,
        memberId: memberData?.member?.id || null,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "You're In!",
        description: "Welcome to FR2P Wealth Monthly. Your first issue is on its way!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/magazine/count"] });
      setEmail("");
      setFirstName("");
      setLastName("");
    },
    onError: () => {
      toast({
        title: "Subscription Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const member = memberData?.member;
  const subscriberCount = countData?.count || 0;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const subEmail = email || member?.email;
    const subName = firstName || member?.firstName;
    if (!subEmail || !subName) {
      toast({
        title: "Missing Information",
        description: "Please provide your email and first name to subscribe.",
        variant: "destructive",
      });
      return;
    }
    subscribeMutation.mutate();
  };

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav />

      <div className="flex-1 lg:ml-72">
        <div className="bg-card border-b border-border px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">FR2P Wealth Monthly</h1>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 space-y-8">
          {/* MAGAZINE COVER - XXL / The Source Style */}
          <div className="relative overflow-hidden rounded-2xl border-4 border-[#FFD700] shadow-2xl shadow-[#FFD700]/20 max-w-2xl mx-auto">
            {/* Cover Background */}
            <div className="relative bg-gradient-to-b from-[#001f3f] via-[#00152b] to-black">
              
              {/* Top Bar - Magazine Header */}
              <div className="relative z-20 bg-[#FFD700] px-4 py-1.5 flex items-center justify-between">
                <span className="text-[#001f3f] text-[10px] sm:text-xs font-bold tracking-widest uppercase">Vol. 1 | Issue #1</span>
                <span className="text-[#001f3f] text-[10px] sm:text-xs font-bold tracking-widest uppercase">The Movement Starts Here</span>
              </div>

              {/* Magazine Title / Masthead */}
              <div className="relative z-20 text-center pt-4 sm:pt-6 px-4">
                <div className="relative inline-block">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-[#FFD700] leading-none" style={{ fontFamily: "'Impact', 'Haettenschweiler', 'Arial Narrow Bold', sans-serif", letterSpacing: '2px', textShadow: '0 0 40px rgba(255,215,0,0.4), 2px 2px 0 #001f3f' }}>
                    FR2P
                  </h1>
                  <div className="text-lg sm:text-xl md:text-2xl font-black tracking-[0.3em] sm:tracking-[0.4em] text-white uppercase mt-0" style={{ fontFamily: "'Impact', 'Haettenschweiler', 'Arial Narrow Bold', sans-serif", textShadow: '1px 1px 0 rgba(0,0,0,0.8)' }}>
                    WEALTH MONTHLY
                  </div>
                </div>
                <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent mt-2" />
              </div>

              {/* Cover Photo + Feature Headlines Layout */}
              <div className="relative z-10 px-4 sm:px-6 pb-0">
                <div className="flex flex-col items-center relative">
                  
                  {/* Left Side Headlines */}
                  <div className="w-full flex justify-between items-start mt-4 sm:mt-6 px-1 sm:px-2">
                    <div className="space-y-3 sm:space-y-4 max-w-[35%] sm:max-w-[30%]">
                      <div>
                        <span className="text-[#FFD700] text-[8px] sm:text-[10px] font-black uppercase tracking-wider block" style={{ textShadow: '0 0 10px rgba(255,215,0,0.5)' }}>EXCLUSIVE</span>
                        <p className="text-white text-[10px] sm:text-xs font-bold leading-tight mt-0.5">The Get 5, Teach 5 Model That's Changing Lives</p>
                      </div>
                      <div>
                        <span className="text-[#FFD700] text-[8px] sm:text-[10px] font-black uppercase tracking-wider block" style={{ textShadow: '0 0 10px rgba(255,215,0,0.5)' }}>BLUEPRINT</span>
                        <p className="text-white text-[10px] sm:text-xs font-bold leading-tight mt-0.5">6 Streams of Income Inside One Platform</p>
                      </div>
                      <div>
                        <span className="text-[#FFD700] text-[8px] sm:text-[10px] font-black uppercase tracking-wider block" style={{ textShadow: '0 0 10px rgba(255,215,0,0.5)' }}>FOUNDING</span>
                        <p className="text-white text-[10px] sm:text-xs font-bold leading-tight mt-0.5">First 500 Members Get Enhanced Commissions</p>
                      </div>
                    </div>

                    {/* Center - Cover Photo */}
                    <div className="flex-1 flex justify-center px-2 sm:px-4">
                      <div className="relative">
                        <div className="w-36 h-44 sm:w-48 sm:h-60 md:w-56 md:h-72 overflow-hidden rounded-lg border-2 border-[#FFD700]/60 shadow-xl shadow-[#FFD700]/20">
                          <img 
                            src={derrickPhoto} 
                            alt="Derrick Taylor - Founder, CEO & Visionary Behind The FR2P Club"
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                        <div className="absolute -bottom-1 -left-1 -right-1 h-16 sm:h-20 bg-gradient-to-t from-black/90 to-transparent" />
                      </div>
                    </div>

                    {/* Right Side Headlines */}
                    <div className="space-y-3 sm:space-y-4 max-w-[35%] sm:max-w-[30%] text-right">
                      <div>
                        <span className="text-[#FFD700] text-[8px] sm:text-[10px] font-black uppercase tracking-wider block" style={{ textShadow: '0 0 10px rgba(255,215,0,0.5)' }}>WEALTH</span>
                        <p className="text-white text-[10px] sm:text-xs font-bold leading-tight mt-0.5">From $35/Month to Generational Wealth</p>
                      </div>
                      <div>
                        <span className="text-[#FFD700] text-[8px] sm:text-[10px] font-black uppercase tracking-wider block" style={{ textShadow: '0 0 10px rgba(255,215,0,0.5)' }}>CERTIFY</span>
                        <p className="text-white text-[10px] sm:text-xs font-bold leading-tight mt-0.5">4 Professional Certifications to Level Up</p>
                      </div>
                      <div>
                        <span className="text-[#FFD700] text-[8px] sm:text-[10px] font-black uppercase tracking-wider block" style={{ textShadow: '0 0 10px rgba(255,215,0,0.5)' }}>EMPIRE</span>
                        <p className="text-white text-[10px] sm:text-xs font-bold leading-tight mt-0.5">Inside The Consolidatus Empire Vision</p>
                      </div>
                    </div>
                  </div>

                  {/* Founder Name + Title - Big Bold Feature */}
                  <div className="w-full text-center mt-3 sm:mt-4 relative z-20">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#FFD700] leading-none tracking-wide" style={{ fontFamily: "'Impact', 'Haettenschweiler', 'Arial Narrow Bold', sans-serif", textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 30px rgba(255,215,0,0.3)' }}>
                      DERRICK TAYLOR
                    </h2>
                    <div className="mt-1 sm:mt-2">
                      <span className="text-white text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.9)' }}>
                        Founder/CEO & Visionary Behind
                      </span>
                    </div>
                    <div className="mt-0.5 sm:mt-1">
                      <span className="text-[#FFD700] text-sm sm:text-base md:text-lg font-black tracking-[0.15em] sm:tracking-[0.25em] uppercase" style={{ fontFamily: "'Impact', 'Haettenschweiler', 'Arial Narrow Bold', sans-serif", textShadow: '0 0 20px rgba(255,215,0,0.5)' }}>
                        The FR2P Club
                      </span>
                    </div>
                  </div>

                  {/* Cover Story Teaser */}
                  <div className="w-full mt-3 sm:mt-4 mb-2">
                    <div className="bg-[#FFD700] px-3 sm:px-4 py-2 sm:py-2.5 text-center">
                      <span className="text-[#001f3f] text-xs sm:text-sm md:text-base font-black uppercase tracking-wider" style={{ fontFamily: "'Impact', 'Haettenschweiler', 'Arial Narrow Bold', sans-serif" }}>
                        "Everybody Can Win" — The Movement That's Building Millionaires
                      </span>
                    </div>
                  </div>

                  {/* Bottom Bar */}
                  <div className="w-full bg-[#001f3f] border-t-2 border-[#FFD700] px-3 sm:px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Crown className="h-3 w-3 sm:h-4 sm:w-4 text-[#FFD700]" />
                      <span className="text-[#FFD700] text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">Financial Roadway 2 Prosperity</span>
                    </div>
                    <span className="text-white/60 text-[9px] sm:text-[10px] font-bold">FREE SUBSCRIPTION</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subscribe CTA Below Cover */}
          <div className="max-w-2xl mx-auto text-center space-y-4">
            {subscriberCount > 0 && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4 text-[#FFD700]" />
                <span className="text-sm">{subscriberCount} members already subscribed</span>
              </div>
            )}
            {member && (
              <Button
                onClick={() => subscribeMutation.mutate()}
                disabled={subscribeMutation.isPending}
                className="bg-[#FFD700] hover:bg-[#e6c200] text-[#001f3f] font-bold text-lg px-8 py-6 rounded-xl shadow-lg shadow-[#FFD700]/30"
              >
                <Mail className="mr-2 h-5 w-5" />
                {subscribeMutation.isPending ? "Subscribing..." : "Subscribe Now — It's Free"}
              </Button>
            )}
          </div>

          {/* What's Inside */}
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">What's Inside Each Monthly Issue</h2>
              <p className="text-muted-foreground">Six powerful sections designed to educate, inspire, and empower</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {magazineSections.map((section) => {
                const Icon = section.icon;
                return (
                  <Card key={section.title} className="bg-card border-border hover:border-[#FFD700]/30 transition-all hover:shadow-lg hover:shadow-[#FFD700]/5">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#001f3f] p-2.5 rounded-lg">
                          <Icon className={`h-5 w-5 ${section.color}`} />
                        </div>
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm leading-relaxed">
                        {section.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Sample Issues Preview */}
          <Card className="bg-gradient-to-br from-[#001f3f] to-[#002a5c] border-[#FFD700]/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-[#FFD700]">Upcoming Issues Preview</CardTitle>
              <CardDescription className="text-white/60">Here's a taste of what's coming</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {sampleIssues.map((issue) => (
                  <div key={issue.month} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
                    <Badge className="bg-[#FFD700]/20 text-[#FFD700] border-[#FFD700]/30 mb-3">
                      {issue.month}
                    </Badge>
                    <h3 className="text-white font-bold text-lg mb-3">{issue.title}</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Star className="h-3.5 w-3.5 text-yellow-400" />
                          <span className="text-xs text-[#FFD700] font-semibold uppercase">Success Story</span>
                        </div>
                        <p className="text-white/70 text-sm">{issue.highlight}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="h-3.5 w-3.5 text-green-400" />
                          <span className="text-xs text-green-400 font-semibold uppercase">Blueprint</span>
                        </div>
                        <p className="text-white/70 text-sm">{issue.blueprint}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Subscribe Form */}
          <Card className="border-[#FFD700]/20 shadow-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-3">
                <div className="bg-[#FFD700]/10 p-3 rounded-full">
                  <Mail className="h-8 w-8 text-[#FFD700]" />
                </div>
              </div>
              <CardTitle className="text-2xl">Subscribe to FR2P Wealth Monthly</CardTitle>
              <CardDescription>
                Free for all FR2P members. Non-members can also subscribe to stay informed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubscribe} className="max-w-md mx-auto space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Input
                      placeholder="First Name *"
                      value={firstName || (member?.firstName || "")}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="bg-background"
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Last Name"
                      value={lastName || (member?.lastName || "")}
                      onChange={(e) => setLastName(e.target.value)}
                      className="bg-background"
                    />
                  </div>
                </div>
                <Input
                  type="email"
                  placeholder="Email Address *"
                  value={email || (member?.email || "")}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background"
                />
                <Button
                  type="submit"
                  disabled={subscribeMutation.isPending}
                  className="w-full bg-[#FFD700] hover:bg-[#e6c200] text-[#001f3f] font-bold py-6 text-lg rounded-xl"
                >
                  {subscribeMutation.isPending ? "Subscribing..." : "Get Your Free Subscription"}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  We respect your privacy. Unsubscribe anytime. No spam, ever.
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Why This Magazine */}
          <div className="bg-gradient-to-br from-[#001f3f] to-[#002a5c] rounded-2xl p-8 border border-[#FFD700]/20">
            <h2 className="text-2xl font-bold text-[#FFD700] text-center mb-8">Why FR2P Wealth Monthly?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Users, label: "Build Loyalty", desc: "Create deeper connections with every member" },
                { icon: TrendingUp, label: "Increase Retention", desc: "Give members a reason to stay and grow" },
                { icon: Star, label: "Celebrate Wins", desc: "Make members feel seen and valued" },
                { icon: BookOpen, label: "Educate & Empower", desc: "Position FR2P as a wealth education authority" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="text-center">
                    <div className="bg-[#FFD700]/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-3">
                      <Icon className="h-7 w-7 text-[#FFD700]" />
                    </div>
                    <h3 className="text-white font-bold mb-1">{item.label}</h3>
                    <p className="text-white/60 text-sm">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Derrick's Vision */}
          <Card className="border-[#FFD700]/20">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#FFD700] shadow-lg shadow-[#FFD700]/20">
                    <img 
                      src={derrickPhoto} 
                      alt="Derrick Taylor" 
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">A Message from Derrick Taylor</h3>
                  <p className="text-muted-foreground leading-relaxed italic">
                    "FR2P Wealth Monthly isn't just a newsletter — it's a movement. Every issue is designed to 
                    remind you that you are part of something bigger. This is how we turn a club into a culture. 
                    This is how we build generational wealth together. Welcome to the FR2 People."
                  </p>
                  <p className="text-[#FFD700] font-semibold mt-3">— Derrick Taylor, Founder/CEO & Visionary</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-muted-foreground text-sm pb-8">
            <p>FR2P Wealth Monthly — Where Knowledge Meets Opportunity</p>
            <p className="mt-1">Part of The FR2P Club | Financial Roadway 2 Prosperity</p>
          </div>
        </div>
      </div>
    </div>
  );
}
