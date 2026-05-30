import { SidebarNav } from "@/components/ui/sidebar-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { 
  Crown, 
  CreditCard, 
  Phone, 
  Car, 
  Building2, 
  HeartPulse, 
  Briefcase, 
  Star, 
  Shield, 
  Gem,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Users,
  Calculator
} from "lucide-react";
import { Link } from "wouter";

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

export default function ExecutiveTier() {
  const { data: dashboardData } = useQuery({
    queryKey: ["/api/dashboard", DEMO_USER_ID],
  });

  const member = (dashboardData as any)?.member as Member | undefined;

  const executiveBenefits = [
    {
      icon: CreditCard,
      title: "FR2P Co-Branded Bank Card",
      description: "Exclusive debit/credit card featuring The FR2P Club logo, issued through our banking partnership",
      status: "coming_soon"
    },
    {
      icon: Phone,
      title: "Personal Concierge Service",
      description: "24/7 dedicated personal assistant to help with any request - from travel bookings to finding services",
      status: "coming_soon"
    },
    {
      icon: Car,
      title: "Vehicle Access Program",
      description: "Streamlined car acquisition - walk in, sign, and drive away with priority financing assistance",
      status: "coming_soon"
    },
    {
      icon: Calculator,
      title: "CPA & Tax Advisory",
      description: "Direct access to certified public accountants for tax planning, business structure, and financial advice",
      status: "coming_soon"
    },
    {
      icon: HeartPulse,
      title: "Executive Wellness & Counseling",
      description: "Premium mental health and wellness counseling services for you and your family",
      status: "coming_soon"
    },
    {
      icon: Building2,
      title: "Real Estate Advisory",
      description: "Expert guidance on property investments, mortgage optimization, and wealth-building through real estate",
      status: "coming_soon"
    },
    {
      icon: Briefcase,
      title: "Business Development Support",
      description: "Priority business coaching, legal resources, and strategic planning for your ventures",
      status: "coming_soon"
    },
    {
      icon: Users,
      title: "Executive Network Events",
      description: "Invitation-only networking events with fellow executive investors and industry leaders",
      status: "coming_soon"
    }
  ];

  return (
    <div className="min-h-screen bg-secondary flex">
      <SidebarNav />
      <div className="flex-1 md:ml-64">
        <div className="bg-card border-b border-border px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">Executive Investor Tier</h1>
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
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <Badge className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#001f3f] text-lg px-6 py-2 mb-6 font-bold">
              <Sparkles className="w-5 h-5 mr-2 inline" />
              EXCLUSIVE INVESTOR PROGRAM
            </Badge>
            
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-[#001f3f] to-[#003366] rounded-full mr-4">
                <Crown className="h-12 w-12 text-[#FFD700]" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] bg-clip-text text-transparent">
                Executive Tier
              </h1>
            </div>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Invest in the FR2P ecosystem and unlock a lifestyle of access, assistance, and advantage. 
              This is not just a membership — it's a <span className="text-[#FFD700] font-semibold">power position</span>.
            </p>

            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#001f3f] to-[#003366] text-[#FFD700] rounded-full font-semibold border-2 border-[#FFD700]">
              <Shield className="h-5 w-5 mr-2" />
              INVITATION-ONLY • INVESTORS ONLY • ELITE ACCESS
            </div>
          </div>

          <Card className="mb-12 border-2 border-[#FFD700] bg-gradient-to-br from-[#001f3f] to-[#002855]" data-testid="card-executive-overview">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-3xl text-[#FFD700] flex items-center justify-center gap-3">
                <Gem className="h-8 w-8" />
                What Makes This Different
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-6 bg-[#001f3f]/50 rounded-xl border border-[#FFD700]/30">
                  <div className="text-4xl font-bold text-[#FFD700] mb-2">Investor</div>
                  <div className="text-white/90">Not just a member — a stakeholder in FR2P's success</div>
                </div>
                <div className="p-6 bg-[#001f3f]/50 rounded-xl border border-[#FFD700]/30">
                  <div className="text-4xl font-bold text-[#FFD700] mb-2">Concierge</div>
                  <div className="text-white/90">Personal assistant for any lifestyle need</div>
                </div>
                <div className="p-6 bg-[#001f3f]/50 rounded-xl border border-[#FFD700]/30">
                  <div className="text-4xl font-bold text-[#FFD700] mb-2">Prestige</div>
                  <div className="text-white/90">FR2P-branded banking and elite privileges</div>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-white/80 text-lg max-w-2xl mx-auto">
                  The Executive Tier transforms FR2P from a membership into a <span className="text-[#FFD700] font-semibold">private wealth ecosystem</span>. 
                  Investors aren't just members — they're partners in building something extraordinary.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8 text-primary">
              <Star className="inline h-8 w-8 text-[#FFD700] mr-2" />
              Executive Investor Benefits
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {executiveBenefits.map((benefit, index) => (
                <Card 
                  key={index} 
                  className="border-2 border-[#FFD700]/30 hover:border-[#FFD700] transition-all hover:shadow-lg hover:shadow-[#FFD700]/10"
                  data-testid={`card-benefit-${index}`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gradient-to-br from-[#001f3f] to-[#003366] rounded-xl">
                        <benefit.icon className="h-8 w-8 text-[#FFD700]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-bold text-primary">{benefit.title}</h3>
                          <Badge className="bg-amber-500/20 text-amber-600 border border-amber-500/30">
                            Coming Soon
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{benefit.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card className="mb-12 bg-gradient-to-r from-[#001f3f] via-[#002855] to-[#001f3f] border-2 border-[#FFD700]" data-testid="card-why-invest">
            <CardHeader>
              <CardTitle className="text-2xl text-[#FFD700] text-center">
                Why Become an Executive Investor?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-[#FFD700] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">Elevate Your Status</div>
                      <div className="text-white/70 text-sm">Move from member to stakeholder in the FR2P ecosystem</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-[#FFD700] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">Lifestyle Concierge</div>
                      <div className="text-white/70 text-sm">Personal assistant for any request, anytime</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-[#FFD700] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">Financial Tools</div>
                      <div className="text-white/70 text-sm">CPA access, tax planning, and wealth management</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-[#FFD700] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">Priority Services</div>
                      <div className="text-white/70 text-sm">First access to new features, events, and opportunities</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-[#FFD700] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">Exclusive Network</div>
                      <div className="text-white/70 text-sm">Connect with fellow investors and business leaders</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-[#FFD700] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">Legacy Building</div>
                      <div className="text-white/70 text-sm">Be part of building something that creates generational wealth</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-12 border-4 border-[#FFD700] bg-gradient-to-br from-[#001f3f] to-[#002855] shadow-xl shadow-[#FFD700]/20" data-testid="card-early-interest">
            <CardContent className="pt-8 pb-8 text-center">
              <Badge className="bg-[#FFD700] text-[#001f3f] text-lg px-6 py-2 mb-6 font-bold">
                EARLY INTEREST REGISTRATION
              </Badge>
              
              <h2 className="text-3xl font-bold text-[#FFD700] mb-4">
                Be First in Line for Executive Status
              </h2>
              
              <p className="text-white/90 text-lg max-w-2xl mx-auto mb-6">
                The Executive Investor Tier is currently in development as we finalize banking partnerships 
                and concierge service agreements. Register your early interest to be notified first when 
                applications open.
              </p>
              
              <div className="bg-[#001f3f]/50 rounded-xl p-6 max-w-xl mx-auto mb-8 border border-[#FFD700]/30">
                <div className="text-[#FFD700] font-semibold mb-2">Investment Details Coming Q1 2026</div>
                <div className="text-white/70 text-sm">
                  Investment levels, specific benefits, and application process will be announced 
                  once grant funding is secured and banking partnerships are established.
                </div>
              </div>
              
              <Link href="/donate">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#001f3f] hover:from-[#FFC700] hover:to-[#FF9500] font-bold text-lg px-8 py-6"
                  data-testid="button-register-interest"
                >
                  <Crown className="h-5 w-5 mr-2" />
                  Support FR2P's Growth
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              
              <p className="text-white/60 text-sm mt-4">
                Current donations help fund the infrastructure needed to launch the Executive Tier
              </p>
            </CardContent>
          </Card>

          <div className="text-center">
            <p className="text-muted-foreground text-lg mb-4">
              Questions about the Executive Investor Tier?
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/compensation-plan">
                <Button variant="outline" className="border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700]/10" data-testid="link-compensation">
                  View Compensation Plan
                </Button>
              </Link>
              <Link href="/store">
                <Button variant="outline" className="border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700]/10" data-testid="link-store">
                  Visit Store
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
