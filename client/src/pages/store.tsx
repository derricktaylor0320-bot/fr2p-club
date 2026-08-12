import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { MemberResponse } from "@shared/schema";
import { HeaderNav } from "@/components/ui/header-nav";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  ShoppingCart, 
  Download, 
  FileText, 
  Target,
  Package,
  Star,
  Gift,
  CreditCard,
  BookOpen,
  Crown,
  Gem,
  Building2,
  ExternalLink,
  Shield
} from "lucide-react";

import { getLoggedInMemberId } from "@/lib/auth";
const DEMO_USER_ID = getLoggedInMemberId();

export default function Store() {
  const { toast } = useToast();
  
  const { data: memberData } = useQuery<MemberResponse>({
    queryKey: ["/api/member", DEMO_USER_ID],
  });

  const handleDownload = (fileName: string) => {
    // Create a download link for the presentation kit
    const link = document.createElement('a');
    link.href = `/presentation-kits/${fileName}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePurchase = async (productName: string, price: string, type: 'membership' | 'affiliate' | 'product') => {
    toast({
      title: `${productName} - Purchase Started!`,
      description: `Redirecting to Stripe checkout for ${price}...`,
    });
    try {
      const amount = parseFloat(price.replace(/[^0-9.-]+/g, ""));
      const response = await apiRequest("POST", "/api/create-payment-intent", {
        amount: amount,
        productName: productName,
        type: type
      });
      const data = await response.json();
      if (data.url) {
        setTimeout(() => { window.location.href = data.url; }, 800);
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAffiliateLink = (productName: string) => {
    const affiliateLink = `https://fr2pclub.com/affiliate/${memberData?.member?.id || 'demo'}/${productName.toLowerCase().replace(/\s+/g, '-')}`;
    
    navigator.clipboard.writeText(affiliateLink).then(() => {
      toast({
        title: "Affiliate Link Copied!",
        description: `Your personalized affiliate link for ${productName} has been copied to clipboard.`,
      });
    }).catch(() => {
      toast({
        title: "Link Ready",
        description: `Your affiliate link: ${affiliateLink}`,
        variant: "default",
      });
    });
  };

  return (
    <div className="min-h-screen bg-secondary">
      <HeaderNav user={memberData?.member || undefined} />
      
      <div className="flex">
        {/* Left Navigation */}
        <div className="w-64 bg-card border-r border-border min-h-screen shadow-sm">
          <div className="p-6">
            <div className="text-center mb-8">
              <img 
                src="/fr2p-logo.jpeg" 
                alt="The FR2P Club" 
                className="w-24 h-24 mx-auto rounded-full border-4 border-navy-700 shadow-lg mb-4"
              />
              <h2 className="text-xl font-bold text-card-foreground">FR2P Store</h2>
              <p className="text-muted-foreground text-sm">Financial Prosperity</p>
            </div>
            
            <nav className="space-y-3">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-muted-foreground hover:bg-accent/10 hover:text-accent font-medium"
                onClick={() => (document.querySelector('[data-testid="tab-store"]') as HTMLElement)?.click()}
              >
                <ShoppingCart className="w-4 h-4 mr-3" />
                Store Products
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-muted-foreground hover:bg-accent/10 hover:text-accent font-medium"
                onClick={() => (document.querySelector('[data-testid="tab-mission"]') as HTMLElement)?.click()}
              >
                <Target className="w-4 h-4 mr-3" />
                Mission Statement
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-muted-foreground hover:bg-accent/10 hover:text-accent font-medium"
                onClick={() => (document.querySelector('[data-testid="tab-presentation-kits"]') as HTMLElement)?.click()}
              >
                <FileText className="w-4 h-4 mr-3" />
                Presentation Kits
              </Button>
              <div className="border-t border-border pt-3 mt-3">
                <p className="text-xs text-muted-foreground mb-2 px-3 font-semibold uppercase">More</p>
                <a href="/certifications">
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:bg-accent/10 hover:text-accent font-medium">
                    <BookOpen className="w-4 h-4 mr-3" />
                    Certifications
                  </Button>
                </a>
                <a href="/investments">
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:bg-accent/10 hover:text-accent font-medium">
                    <Crown className="w-4 h-4 mr-3" />
                    Wealth Building
                  </Button>
                </a>
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground">The FR2P Club Store & Resources</h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Everything you need to build your financial prosperity through affiliate marketing
            </p>
          </div>

        <Tabs defaultValue="store" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="store" className="flex items-center gap-2" data-testid="tab-store">
              <ShoppingCart className="w-4 h-4" />
              Store
            </TabsTrigger>
            <TabsTrigger value="marketing-materials" className="flex items-center gap-2" data-testid="tab-marketing-materials">
              <Package className="w-4 h-4" />
              Marketing Materials
            </TabsTrigger>
            <TabsTrigger value="mission" className="flex items-center gap-2" data-testid="tab-mission">
              <Target className="w-4 h-4" />
              Mission Statement
            </TabsTrigger>
            <TabsTrigger value="presentation-kits" className="flex items-center gap-2" data-testid="tab-presentation-kits">
              <FileText className="w-4 h-4" />
              Presentation Kits
            </TabsTrigger>
          </TabsList>

          {/* Store Tab */}
          <TabsContent value="store" className="space-y-6">
            
            {/* Learning & Certifications - Professional Development */}
            <Card className="border-2 border-gold-400 bg-gradient-to-br from-navy-900 to-navy-800">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-gold-600 text-navy-900 text-sm font-bold">🎓 Learning & Certifications</Badge>
                  <Badge className="bg-green-600 text-white text-sm">Earn Real Credentials!</Badge>
                </div>
                <CardTitle className="flex items-center gap-2 text-2xl text-gold-400">
                  <BookOpen className="w-6 h-6 text-gold-400" />
                  Professional Development & Certifications
                </CardTitle>
                <CardDescription className="text-base text-white/90">
                  Invest in yourself with professional courses and certifications that give you 
                  real credentials, structured learning paths, and career advancement opportunities.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-[#FFD700] rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-lg mb-2 text-[#001f3f]">Why Professional Certifications Matter:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-start gap-2">
                      <Badge className="bg-[#001f3f] text-[#FFD700] shrink-0 text-lg font-bold">✓</Badge>
                      <span className="text-[#001f3f] font-medium"><strong className="text-[#001f3f]">Structured Learning:</strong> Clear path from beginner to expert with proven curriculum</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge className="bg-[#001f3f] text-[#FFD700] shrink-0 text-lg font-bold">✓</Badge>
                      <span className="text-[#001f3f] font-medium"><strong className="text-[#001f3f]">Real Certifications:</strong> Resume-worthy credentials recognized by employers</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge className="bg-[#001f3f] text-[#FFD700] shrink-0 text-lg font-bold">✓</Badge>
                      <span className="text-[#001f3f] font-medium"><strong className="text-[#001f3f]">Career Advancement:</strong> Stand out with professional credentials and skills</span>
                    </div>
                  </div>
                </div>

                <h3 className="font-semibold text-lg mb-4 text-gold-400">Recommended Learning Platforms:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  {/* Coursera */}
                  <Card className="border-blue-200 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-blue-600 text-white">🎓 University Partners</Badge>
                      </div>
                      <CardTitle className="text-base">Coursera</CardTitle>
                      <CardDescription className="text-xs">Courses from top universities & companies</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-center bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg p-3">
                        <div className="text-lg font-bold text-blue-700">University Certificates</div>
                        <div className="text-xs text-gray-600">Yale, Stanford, Google, IBM & more</div>
                      </div>
                      <div className="space-y-1 text-xs text-gray-700">
                        <div>• Financial Markets (Yale)</div>
                        <div>• Business Foundations</div>
                        <div>• Google Project Management</div>
                        <div>• IBM Data Science</div>
                        <div>• Professional Certificates</div>
                      </div>
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700" 
                        data-testid="button-coursera"
                        onClick={() => window.open('https://www.coursera.org/', '_blank')}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Explore Coursera
                      </Button>
                    </CardContent>
                  </Card>

                  {/* LinkedIn Learning */}
                  <Card className="border-blue-200 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-sky-600 text-white">💼 Career Focused</Badge>
                      </div>
                      <CardTitle className="text-base">LinkedIn Learning</CardTitle>
                      <CardDescription className="text-xs">Professional skills & career development</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-center bg-gradient-to-r from-sky-100 to-sky-200 rounded-lg p-3">
                        <div className="text-lg font-bold text-sky-700">Career Certificates</div>
                        <div className="text-xs text-gray-600">Add to LinkedIn profile</div>
                      </div>
                      <div className="space-y-1 text-xs text-gray-700">
                        <div>• Business Analysis</div>
                        <div>• Project Management</div>
                        <div>• Financial Modeling</div>
                        <div>• Leadership & Management</div>
                        <div>• Excel & Data Analytics</div>
                      </div>
                      <Button 
                        className="w-full bg-sky-600 hover:bg-sky-700" 
                        data-testid="button-linkedin-learning"
                        onClick={() => window.open('https://www.linkedin.com/learning/', '_blank')}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Explore LinkedIn Learning
                      </Button>
                    </CardContent>
                  </Card>

                  {/* edX */}
                  <Card className="border-blue-200 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-red-600 text-white">🏛️ Harvard & MIT</Badge>
                      </div>
                      <CardTitle className="text-base">edX</CardTitle>
                      <CardDescription className="text-xs">Courses from Harvard, MIT & more</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-center bg-gradient-to-r from-red-100 to-red-200 rounded-lg p-3">
                        <div className="text-lg font-bold text-red-700">MicroMasters Programs</div>
                        <div className="text-xs text-gray-600">Graduate-level credentials</div>
                      </div>
                      <div className="space-y-1 text-xs text-gray-700">
                        <div>• Finance & Accounting</div>
                        <div>• Business Management</div>
                        <div>• Data Science</div>
                        <div>• Computer Science</div>
                        <div>• Verified Certificates</div>
                      </div>
                      <Button 
                        className="w-full bg-red-600 hover:bg-red-700" 
                        data-testid="button-edx"
                        onClick={() => window.open('https://www.edx.org/', '_blank')}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Explore edX
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Skillshare */}
                  <Card className="border-blue-200 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-green-600 text-white">🎨 Creative & Business</Badge>
                      </div>
                      <CardTitle className="text-base">Skillshare</CardTitle>
                      <CardDescription className="text-xs">Creative & entrepreneurial skills</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-center bg-gradient-to-r from-green-100 to-green-200 rounded-lg p-3">
                        <div className="text-lg font-bold text-green-700">Unlimited Classes</div>
                        <div className="text-xs text-gray-600">One subscription, all access</div>
                      </div>
                      <div className="space-y-1 text-xs text-gray-700">
                        <div>• Entrepreneurship</div>
                        <div>• Marketing & Branding</div>
                        <div>• Productivity & Freelancing</div>
                        <div>• Design & Creativity</div>
                        <div>• Business Strategy</div>
                      </div>
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700" 
                        data-testid="button-skillshare"
                        onClick={() => window.open('https://www.skillshare.com/', '_blank')}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Explore Skillshare
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Khan Academy */}
                  <Card className="border-blue-200 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-teal-600 text-white">🆓 100% Free</Badge>
                      </div>
                      <CardTitle className="text-base">Khan Academy</CardTitle>
                      <CardDescription className="text-xs">Free world-class education for everyone</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-center bg-gradient-to-r from-teal-100 to-teal-200 rounded-lg p-3">
                        <div className="text-lg font-bold text-teal-700">Completely Free</div>
                        <div className="text-xs text-gray-600">No cost, no catch</div>
                      </div>
                      <div className="space-y-1 text-xs text-gray-700">
                        <div>• Personal Finance</div>
                        <div>• Economics & Markets</div>
                        <div>• Entrepreneurship</div>
                        <div>• Math & Statistics</div>
                        <div>• SAT & Test Prep</div>
                      </div>
                      <Button 
                        className="w-full bg-teal-600 hover:bg-teal-700" 
                        data-testid="button-khan-academy"
                        onClick={() => window.open('https://www.khanacademy.org/', '_blank')}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Explore Khan Academy
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Google Career Certificates */}
                  <Card className="border-blue-200 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-amber-600 text-white">🔥 High Demand</Badge>
                      </div>
                      <CardTitle className="text-base">Google Career Certificates</CardTitle>
                      <CardDescription className="text-xs">Job-ready skills in high-growth fields</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-center bg-gradient-to-r from-amber-100 to-amber-200 rounded-lg p-3">
                        <div className="text-lg font-bold text-amber-700">Google Certified</div>
                        <div className="text-xs text-gray-600">Employer recognized</div>
                      </div>
                      <div className="space-y-1 text-xs text-gray-700">
                        <div>• Project Management</div>
                        <div>• Data Analytics</div>
                        <div>• Digital Marketing</div>
                        <div>• UX Design</div>
                        <div>• IT Support</div>
                      </div>
                      <Button 
                        className="w-full bg-amber-600 hover:bg-amber-700" 
                        data-testid="button-google-certs"
                        onClick={() => window.open('https://grow.google/certificates/', '_blank')}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Explore Google Certs
                      </Button>
                    </CardContent>
                  </Card>

                </div>

                <div className="mt-6 bg-gradient-to-r from-gold-400 to-gold-600 text-navy-900 rounded-lg p-6 text-center border-2 border-gold-300 shadow-lg">
                  <h3 className="font-bold text-xl mb-2">🎓 Invest in Your Education</h3>
                  <p className="text-sm mb-4">
                    Professional certifications set you apart. Whether you're building your FR2P business 
                    or advancing your career, these platforms offer recognized credentials that open doors.
                  </p>
                  <div className="text-xs text-navy-900/80">
                    💡 Tip: Many platforms offer free trials or financial aid. Start with free resources like Khan Academy, 
                    then invest in certifications that align with your goals.
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Consolidators Empire Banner */}
            <Card className="border-4 border-purple-400 bg-gradient-to-r from-purple-900/80 via-[#001f3f] to-purple-900/80 shadow-xl shadow-purple-500/20" data-testid="card-empire-banner">
              <CardContent className="pt-6 pb-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full">
                      <Building2 className="h-10 w-10 text-white" />
                    </div>
                    <div>
                      <Badge className="bg-purple-400 text-[#001f3f] font-bold mb-2">SHOP THE EMPIRE</Badge>
                      <h3 className="text-2xl font-bold text-purple-300">The Consolidatus Empire</h3>
                      <p className="text-white/80 max-w-lg">
                        FR2P is part of something bigger. Access Khomplete Khemistri Apparel & Accessories, Empire Invest, Expense Advantage, Premium Choice Dogs, and more partner businesses through TCE Holdings.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <a href="https://tceholdings.org" target="_blank" rel="noopener noreferrer">
                      <Button 
                        className="bg-gradient-to-r from-purple-400 to-purple-600 text-white hover:from-purple-500 hover:to-purple-700 font-bold px-8"
                        data-testid="button-shop-apparel"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Shop Apparel
                      </Button>
                    </a>
                    <Button 
                      variant="outline"
                      className="border-purple-400 text-purple-300 hover:bg-purple-400/10"
                      data-testid="button-explore-empire-store"
                      onClick={() => window.location.href = '/empire'}
                    >
                      <Building2 className="w-4 h-4 mr-2" />
                      Explore Full Empire
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Executive Investor Tier Banner */}
            <Card className="border-4 border-[#FFD700] bg-gradient-to-r from-[#001f3f] via-[#002855] to-[#001f3f] shadow-xl shadow-[#FFD700]/20" data-testid="card-executive-tier-banner">
              <CardContent className="pt-6 pb-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-full">
                      <Crown className="h-10 w-10 text-[#001f3f]" />
                    </div>
                    <div>
                      <Badge className="bg-[#FFD700] text-[#001f3f] font-bold mb-2">EXCLUSIVE INVESTOR PROGRAM</Badge>
                      <h3 className="text-2xl font-bold text-[#FFD700]">Executive Investor Tier</h3>
                      <p className="text-white/80 max-w-lg">
                        Unlock elite privileges: personal concierge, FR2P-branded bank cards, CPA access, vehicle programs, and more. 
                        Become a stakeholder, not just a member.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-sm px-4 py-1">
                      Coming Q1 2026
                    </Badge>
                    <Button 
                      className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#001f3f] hover:from-[#FFC700] hover:to-[#FF9500] font-bold px-8"
                      data-testid="button-executive-tier-store"
                      onClick={() => window.location.href = '/executive-tier'}
                    >
                      <Gem className="w-4 h-4 mr-2" />
                      Learn More
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  The FR2P Club Store - Affiliate Marketing Products
                </CardTitle>
                <CardDescription>
                  High-quality products and services perfect for your affiliate marketing business
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  {/* The FR2P Club Standard Membership - GOLD Background */}
                  <Card className="border-4 border-gold-500 bg-gradient-to-br from-gold-400 to-gold-600 shadow-xl">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-navy-900 text-gold-400 font-bold">⭐ Standard</Badge>
                        <Star className="w-5 h-5 text-white" />
                      </div>
                      <CardTitle className="text-lg text-white">The FR2P Club Standard</CardTitle>
                      <CardDescription className="text-white/90">Complete affiliate marketing system</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center space-y-2">
                        <div className="border-2 border-white bg-white/20 rounded-lg p-3">
                          <Badge className="bg-navy-900 text-gold-400 mb-2 font-bold">Preferred - Save 17%!</Badge>
                          <div className="text-2xl font-bold text-white">$350/year</div>
                          <div className="text-xs text-white/80">vs $420 if paid monthly</div>
                        </div>
                        <div className="text-sm text-white font-semibold">OR</div>
                        <div className="bg-white/20 rounded-lg p-3 border border-white">
                          <div className="text-xl font-bold text-white">$35/month</div>
                          <div className="text-xs text-white/80">Monthly billing</div>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-white">
                        <div>✓ 5-Tier Achievement System</div>
                        <div>✓ $5/month per referral (flat rate, unlimited)</div>
                        <div>✓ Tier achievement bonuses ($50-$500)</div>
                        <div>✓ Financial Asset Savings</div>
                        <div>✓ Professional training materials</div>
                        <div>✓ Marketing tools & templates</div>
                        <div>✓ Community chat & support</div>
                      </div>
                      <div className="space-y-2">
                        <Button 
                          className="w-full bg-white hover:bg-white/90 text-navy-900 font-bold" 
                          data-testid="button-join-annual"
                          onClick={() => handlePurchase('The FR2P Club Annual Membership', '$350/year', 'membership')}
                        >
                          <Gift className="w-4 h-4 mr-2" />
                          Join Annual (Save $70!)
                        </Button>
                        <Button 
                          className="w-full bg-navy-900 hover:bg-navy-800 text-gold-400 font-bold border-2 border-white" 
                          data-testid="button-join-monthly"
                          onClick={() => handlePurchase('The FR2P Club Monthly Membership', '$35', 'membership')}
                        >
                          <Gift className="w-4 h-4 mr-2" />
                          Join Monthly ($35)
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* The FR2P Club PREMIUM Membership with KonnectMD - NAVY Background */}
                  <Card className="border-2 border-gold-400 bg-gradient-to-br from-navy-900 to-navy-800">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-gold-600 text-navy-900 font-bold text-sm">💎 PREMIUM TIER</Badge>
                        <Star className="w-6 h-6 text-gold-400" />
                      </div>
                      <CardTitle className="text-xl text-gold-400">The FR2P Club PREMIUM</CardTitle>
                      <CardDescription className="text-gold-100 font-semibold">Everything in Standard + KonnectMD Health & Travel Benefits</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center space-y-2">
                        <div className="border-2 border-white bg-white/20 rounded-lg p-3">
                          <Badge className="bg-navy-900 text-gold-400 mb-2 font-bold">⚡ Best Value!</Badge>
                          <div className="text-3xl font-bold text-white">$500/year</div>
                          <div className="text-xs text-white/80">vs $600 if paid monthly</div>
                        </div>
                        <div className="text-sm text-white font-semibold">OR</div>
                        <div className="bg-white/20 rounded-lg p-3 border border-white">
                          <div className="text-2xl font-bold text-white">$50/month</div>
                          <div className="text-xs text-white/80">Monthly billing</div>
                        </div>
                      </div>
                      
                      <div className="bg-navy-900 rounded-lg p-3 space-y-2">
                        <div className="text-white font-bold text-sm mb-2">🎁 Standard Features:</div>
                        <div className="space-y-1 text-xs text-gold-200">
                          <div>✓ All Standard tier benefits</div>
                          <div>✓ 5-Tier Achievement System</div>
                          <div>✓ Recurring monthly commissions</div>
                          <div>✓ Community chat & resources</div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-3 space-y-2">
                        <div className="text-navy-900 font-bold text-sm mb-1">🔑 PLUS KonnectMD Marketplace Access:</div>
                        <p className="text-xs text-navy-700">Unlocks the KonnectMD portal — choose your own plan at official prices, paid directly to KonnectMD. No markup.</p>
                        <div className="space-y-1 text-xs text-navy-800 mt-2">
                          <div>✓ Travel portal ($49.99–$99.99/mo)</div>
                          <div>✓ Healthcare plans ($59.99–$99.99/mo)</div>
                          <div>✓ Titanium all-in-one ($149.99/mo)</div>
                          <div>✓ Medical bill advocacy & add-ons</div>
                        </div>
                      </div>

                      <div className="bg-white/20 border border-white rounded-lg p-2">
                        <div className="text-xs text-white font-semibold text-center">
                          🔑 Premium = Your key to the KonnectMD marketplace
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Button 
                          className="w-full bg-white hover:bg-white/90 text-navy-900 font-bold text-base" 
                          data-testid="button-join-premium-annual"
                          onClick={() => handlePurchase('The FR2P Club Premium Annual Membership', '$500/year', 'membership')}
                        >
                          <Gift className="w-5 h-5 mr-2" />
                          Join Premium Annual (Save $100!)
                        </Button>
                        <Button 
                          className="w-full bg-navy-900 hover:bg-navy-800 text-gold-400 font-bold border-2 border-white" 
                          data-testid="button-join-premium-monthly"
                          onClick={() => handlePurchase('The FR2P Club Premium Monthly Membership', '$50', 'membership')}
                        >
                          <Gift className="w-5 h-5 mr-2" />
                          Join Premium Monthly ($50)
                        </Button>
                      </div>
                      <p className="text-xs text-center text-gold-300 italic">
                        🎯 Healthcare value alone exceeds membership cost!
                      </p>
                    </CardContent>
                  </Card>

                  {/* Online Course - GOLD Background */}
                  <Card className="border-4 border-gold-500 bg-gradient-to-br from-gold-400 to-gold-600 shadow-xl">
                    <CardHeader>
                      <Badge className="bg-navy-900 text-gold-400 w-fit font-bold">High Commission</Badge>
                      <CardTitle className="text-lg text-white">Digital Marketing Mastery</CardTitle>
                      <CardDescription className="text-white/90">Complete online course for entrepreneurs</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">$97</div>
                        <div className="text-sm text-white/80">25% commission = $24.25</div>
                      </div>
                      <div className="space-y-1 text-sm text-white">
                        <div>• 40+ video lessons</div>
                        <div>• Marketing templates</div>
                        <div>• Live Q&A sessions</div>
                        <div>• Certificate of completion</div>
                      </div>
                      <Button 
                        className="w-full bg-navy-900 hover:bg-navy-800 text-gold-400 font-bold border-2 border-white" 
                        data-testid="button-promote-course"
                        onClick={() => handleAffiliateLink('Digital Marketing Mastery')}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Get Affiliate Link
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Software Tool - Navy/Gold Theme */}
                  <Card className="border-2 border-gold-400 bg-gradient-to-br from-navy-900 to-navy-800">
                    <CardHeader>
                      <Badge className="bg-gold-600 text-navy-900 w-fit font-bold">💰 Recurring</Badge>
                      <CardTitle className="text-lg text-gold-400">Social Media Scheduler Pro</CardTitle>
                      <CardDescription className="text-gold-100">Professional social media management</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gold-400">$49/mo</div>
                        <div className="text-sm text-gold-200">30% commission = $14.70/mo</div>
                      </div>
                      <div className="space-y-1 text-sm text-gold-100">
                        <div>• Multi-platform posting</div>
                        <div>• Content calendar</div>
                        <div>• Analytics dashboard</div>
                        <div>• Team collaboration</div>
                      </div>
                      <Button 
                        className="w-full bg-gold-600 hover:bg-gold-700 text-navy-900 font-semibold" 
                        data-testid="button-promote-software"
                        onClick={() => handleAffiliateLink('Social Media Scheduler Pro')}
                      >
                        <Package className="w-4 h-4 mr-2" />
                        Get Affiliate Link
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Premium Growth Coaching - All Gold Background */}
                  <Card className="border-2 border-gold-500 bg-gradient-to-br from-gold-400 to-gold-600">
                    <CardHeader>
                      <Badge className="bg-navy-900 text-gold-400 w-fit font-bold">✨ Premium</Badge>
                      <CardTitle className="text-lg text-white">Premium Growth Coaching</CardTitle>
                      <CardDescription className="text-white/90">Monthly group coaching for entrepreneurs</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">$97</div>
                        <div className="text-sm text-white/80">40% commission = $38.80</div>
                      </div>
                      <div className="space-y-1 text-sm text-white">
                        <div>• 4 weekly group sessions</div>
                        <div>• Business plan template</div>
                        <div>• Marketing strategy guide</div>
                        <div>• Community support access</div>
                      </div>
                      <Button 
                        className="w-full bg-navy-900 hover:bg-navy-800 text-gold-400 font-semibold" 
                        data-testid="button-promote-coaching"
                        onClick={() => handleAffiliateLink('Premium Growth Coaching')}
                      >
                        <Target className="w-4 h-4 mr-2" />
                        Get Affiliate Link
                      </Button>
                    </CardContent>
                  </Card>

                  {/* NFC Metal Business Card */}
                  <Card className="border-2 border-gold-400 bg-gradient-to-br from-navy-900 to-navy-800">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-gold-600 text-navy-900">New!</Badge>
                        <Star className="w-5 h-5 text-gold-400" />
                      </div>
                      <CardTitle className="text-lg text-gold-400">FR2P NFC Metal Business Card</CardTitle>
                      <CardDescription className="text-gold-100">Premium black metal card with custom logo engraving</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gold-400">$25</div>
                        <div className="text-sm text-gold-200">One card • No subscription required</div>
                        <div className="text-xs text-gold-300 mt-1">Your profit: $13 per card</div>
                      </div>
                      <div className="space-y-1 text-sm text-gold-100">
                        <div>💎 Premium black metal finish</div>
                        <div>✨ Custom FR2P logo engraved</div>
                        <div>📱 NFC tap-to-share technology</div>
                        <div>🎯 Your brand identity on display</div>
                        <div>🚀 Order just 1 card (no minimums)</div>
                        <div>♾️ One-time purchase • Own forever</div>
                      </div>
                      <Button 
                        className="w-full bg-gold-600 hover:bg-gold-700 text-navy-900 font-semibold" 
                        data-testid="button-order-nfc-card"
                        onClick={() => handlePurchase('FR2P NFC Metal Business Card', '$25', 'product')}
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Order Your Card ($25)
                      </Button>
                      <p className="text-xs text-center text-gold-300 italic">
                        Professional networking • Custom branding • No subscriptions
                      </p>
                    </CardContent>
                  </Card>

                  {/* FR2P Marketing Merchandise */}
                  <Card className="border-2 border-[#FFD700] bg-gradient-to-br from-[#001f3f] to-[#002855] md:col-span-2 lg:col-span-3">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-1">
                        <Badge className="bg-[#FFD700] text-[#001f3f] font-bold text-sm">👕 FR2P Marketing Merch</Badge>
                        <Badge className="bg-green-600 text-white text-sm">Wear the Brand. Spread the Movement.</Badge>
                      </div>
                      <CardTitle className="text-xl text-[#FFD700]">The FR2P Club Official Merchandise</CardTitle>
                      <CardDescription className="text-white/80">
                        Represent The FR2P Club everywhere you go. Every piece is a conversation starter — and a walking advertisement for your business.{" "}
                        <a href="/collection" className="text-[#FFD700] underline hover:text-yellow-300">
                          Explore the emblem collection →
                        </a>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* T-shirt image banner */}
                      <div className="rounded-xl overflow-hidden border-2 border-[#FFD700]/40 shadow-lg mb-5">
                        <img
                          src="/fr2p-tshirts.png"
                          alt="The The FR2P Club T-Shirts — Navy, Black, Gray, Maroon with gold FR2P logo"
                          className="w-full object-cover max-h-64 object-top"
                        />
                      </div>

                      {/* T-Shirt | Ring | Watch side by side */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

                        {/* T-Shirt */}
                        <div className="bg-white/5 border border-[#FFD700]/30 rounded-xl p-5 flex flex-col justify-between gap-3">
                          <div>
                            <p className="text-[#FFD700] font-bold text-base mb-1">The FR2P Club T-Shirt</p>
                            <p className="text-white/70 text-xs mb-3">Gold FR2P logo on premium heavyweight cotton. Navy, Black, Gray & Maroon.</p>
                            <div className="space-y-1 text-sm text-white/80">
                              <div>👕 Sizes: S – 5XL</div>
                              <div>🎨 4 colorways available</div>
                              <div>✨ "Financial Roadway 2 Prosperity"</div>
                              <div>📦 Ships 5–7 business days</div>
                            </div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-[#FFD700] mb-2">$35</div>
                            <Button
                              className="w-full bg-[#FFD700] text-[#001f3f] hover:bg-[#FFC700] font-bold"
                              data-testid="button-order-tshirt"
                              onClick={() => handlePurchase('The FR2P Club T-Shirt', '$35', 'product')}
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Order T-Shirt ($35)
                            </Button>
                          </div>
                        </div>

                        {/* Ring */}
                        <div className="bg-white/5 border border-[#FFD700]/30 rounded-xl p-5 flex flex-col justify-between gap-3">
                          <div>
                            <p className="text-[#FFD700] font-bold text-base mb-1">The FR2P Club Ring</p>
                            <p className="text-white/70 text-xs mb-3">Bold FR2P branded rings. 4 unique designs — wear your prosperity on your hand.</p>
                            <div className="space-y-1 text-sm text-white/80">
                              <div>💍 4 exclusive designs</div>
                              <div>🏆 FR2P logo prominently featured</div>
                              <div>✨ Gold-accented finishes</div>
                              <div>📐 Multiple sizes available</div>
                            </div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-[#FFD700] mb-2">$60</div>
                            <Button
                              className="w-full bg-[#FFD700] text-[#001f3f] hover:bg-[#FFC700] font-bold"
                              data-testid="button-order-ring"
                              onClick={() => handlePurchase('The FR2P Club Ring', '$60', 'product')}
                            >
                              <Gem className="w-4 h-4 mr-2" />
                              Order Ring ($60)
                            </Button>
                          </div>
                        </div>

                        {/* Watch */}
                        <div className="bg-white/5 border border-[#FFD700]/30 rounded-xl p-5 flex flex-col justify-between gap-3">
                          <div>
                            <p className="text-[#FFD700] font-bold text-base mb-1">FR2P Luxury Watch</p>
                            <p className="text-white/70 text-xs mb-3">Navy dial, gold case. The watch that says you're serious about prosperity.</p>
                            <div className="space-y-1 text-sm text-white/80">
                              <div>⌚ Navy & gold colorway</div>
                              <div>🔖 FR2P logo engraved on face</div>
                              <div>🏆 Stainless steel bracelet</div>
                              <div>🎁 Gift box included</div>
                            </div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-[#FFD700] mb-2">$89</div>
                            <Button
                              className="w-full bg-[#FFD700] text-[#001f3f] hover:bg-[#FFC700] font-bold"
                              data-testid="button-order-watch"
                              onClick={() => handlePurchase('FR2P Luxury Watch', '$89', 'product')}
                            >
                              <Star className="w-4 h-4 mr-2" />
                              Order Watch ($89)
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Bundle — full width below */}
                      <div className="bg-gradient-to-br from-[#FFD700]/10 to-[#FFD700]/5 border-2 border-[#FFD700]/60 rounded-xl p-5">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <Badge className="bg-[#FFD700] text-[#001f3f] font-bold mb-2 text-xs">🔥 BEST VALUE — FULL BUNDLE</Badge>
                            <p className="text-[#FFD700] font-bold text-lg">T-Shirt + Ring + Watch — The Complete FR2P Look</p>
                            <p className="text-white/70 text-sm mt-1">Walk in the room as a brand. Everything in one order.</p>
                            <div className="flex gap-4 mt-2 text-sm text-white/80">
                              <span>✅ T-Shirt (your color)</span>
                              <span>✅ Ring (your design)</span>
                              <span>✅ Luxury Watch</span>
                            </div>
                            <p className="text-[#FFD700]/50 line-through text-xs mt-1">Retail: $184</p>
                          </div>
                          <div className="text-center md:text-right shrink-0">
                            <div className="text-3xl font-bold text-[#FFD700]">$130</div>
                            <div className="text-green-400 text-sm font-semibold mb-3">Save $54</div>
                            <Button
                              className="bg-[#FFD700] text-[#001f3f] hover:bg-[#FFC700] font-bold px-8"
                              data-testid="button-order-bundle"
                              onClick={() => handlePurchase('FR2P Full Merch Bundle', '$130', 'product')}
                            >
                              <Gift className="w-4 h-4 mr-2" />
                              Get the Bundle ($130)
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-lg p-3 text-center">
                        <p className="text-[#FFD700] font-semibold text-sm">
                          💡 Wear your FR2P gear to networking events, church, the barbershop — anywhere people ask "what's that?" is your next referral opportunity.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* KonnectMD Marketplace Access — full width */}
                  <Card className="border-2 border-[#FFD700] bg-gradient-to-br from-[#001f3f] to-[#002855] md:col-span-2 lg:col-span-3">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-1">
                        <Badge className="bg-[#FFD700] text-[#001f3f] font-bold">💎 PREMIUM MEMBERS ONLY</Badge>
                        <Badge className="bg-blue-600 text-white text-sm">FR2P = Gateway Access · KonnectMD = Provider</Badge>
                      </div>
                      <CardTitle className="text-xl text-[#FFD700]">KonnectMD Marketplace — Your Access Portal</CardTitle>
                      <CardDescription className="text-white/80">
                        Your $50/month Premium membership unlocks the door to the KonnectMD marketplace. You choose your plan and pay KonnectMD directly at their official prices — no markup, no bundling. FR2P is your access key. KonnectMD is your provider.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-blue-900/30 border border-blue-400/30 rounded-lg p-3 mb-5 flex items-start gap-3">
                        <Shield className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                        <p className="text-blue-200 text-sm"><span className="font-bold text-white">No Double Payment.</span> Your $50 FR2P Premium fee covers your membership and marketplace access. What you pay KonnectMD goes directly to KonnectMD — two separate transactions, two separate providers. Transparent pricing, always.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

                        {/* Lifestyle & Travel */}
                        <div className="bg-white/5 border border-[#FFD700]/20 rounded-xl p-4">
                          <p className="text-[#FFD700] font-bold text-sm mb-3">✈️ Lifestyle & Travel Plans</p>
                          <div className="space-y-2">
                            <div className="bg-white/5 rounded-lg p-3">
                              <p className="text-white font-semibold text-xs">VIP Booking Engine</p>
                              <p className="text-white/60 text-xs">Hotel, flight & cruise discounts</p>
                              <p className="text-[#FFD700] font-bold text-sm mt-1">$49.99/mo</p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3">
                              <p className="text-white font-semibold text-xs">Lifestyle Plan</p>
                              <p className="text-white/60 text-xs">Full travel perks + dining rewards</p>
                              <p className="text-[#FFD700] font-bold text-sm mt-1">$99.99/mo</p>
                            </div>
                          </div>
                        </div>

                        {/* Healthcare Plans */}
                        <div className="bg-white/5 border border-[#FFD700]/20 rounded-xl p-4">
                          <p className="text-[#FFD700] font-bold text-sm mb-3">🏥 Healthcare Plans</p>
                          <div className="space-y-2">
                            <div className="bg-white/5 rounded-lg p-2 flex justify-between items-center">
                              <div>
                                <p className="text-white text-xs font-semibold">Silver</p>
                                <p className="text-white/50 text-xs">Virtual care access</p>
                              </div>
                              <p className="text-[#FFD700] font-bold text-sm">$59.99/mo</p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-2 flex justify-between items-center">
                              <div>
                                <p className="text-white text-xs font-semibold">Gold</p>
                                <p className="text-white/50 text-xs">+ Mental health</p>
                              </div>
                              <p className="text-[#FFD700] font-bold text-sm">$79.99/mo</p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-2 flex justify-between items-center">
                              <div>
                                <p className="text-white text-xs font-semibold">Platinum</p>
                                <p className="text-white/50 text-xs">+ Dermatology</p>
                              </div>
                              <p className="text-[#FFD700] font-bold text-sm">$99.99/mo</p>
                            </div>
                          </div>
                        </div>

                        {/* Titanium + Add-Ons */}
                        <div className="bg-white/5 border border-[#FFD700]/40 rounded-xl p-4">
                          <p className="text-[#FFD700] font-bold text-sm mb-3">👑 Titanium Bundle + Add-Ons</p>
                          <div className="bg-gradient-to-br from-[#FFD700]/15 to-[#FFD700]/5 border border-[#FFD700]/50 rounded-lg p-3 mb-3">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-white font-bold text-xs">Titanium Membership</p>
                              <Badge className="bg-[#FFD700] text-[#001f3f] text-xs font-bold">ALL-IN-ONE</Badge>
                            </div>
                            <p className="text-white/70 text-xs mb-2">Everything included: Travel portal + healthcare access + medical bill advocacy & debt counseling. One price, zero gaps.</p>
                            <div className="text-xs text-white/80 space-y-0.5 mb-2">
                              <div>✅ Full travel & lifestyle portal</div>
                              <div>✅ Complete healthcare access</div>
                              <div>✅ Medical Bill Advocate</div>
                              <div>✅ Debt counseling & erase support</div>
                            </div>
                            <p className="text-[#FFD700] font-bold text-lg">$149.99/mo</p>
                          </div>
                          <div className="space-y-1.5 text-xs text-white/70">
                            <p className="text-white/50 font-semibold uppercase tracking-wide text-xs">Add-Ons (à la carte):</p>
                            <div className="flex justify-between"><span>🐾 Pet Care</span><span className="text-[#FFD700]">$19.99/mo</span></div>
                            <div className="flex justify-between"><span>📋 Medical Bill Advocate</span><span className="text-[#FFD700]">$29.99/mo</span></div>
                            <div className="flex justify-between"><span>💊 GLP-1 Weight Loss</span><span className="text-[#FFD700]">$375/mo</span></div>
                          </div>
                        </div>
                      </div>

                      <Button
                        className="w-full bg-[#FFD700] text-[#001f3f] hover:bg-[#FFC700] font-bold text-base py-5"
                        data-testid="button-explore-konnectmd"
                        onClick={() => window.open('https://konnectmdagency.com/index.aspx?ReferringDealerID=816491', '_blank')}
                      >
                        <ExternalLink className="w-5 h-5 mr-2" />
                        Access KonnectMD Marketplace (Premium Members)
                      </Button>
                      <p className="text-white/40 text-xs text-center mt-2">Must be an active FR2P Premium member to access · Plans paid directly to KonnectMD</p>
                    </CardContent>
                  </Card>

                  {/* eBook - NAVY Background */}
                  <Card className="border-2 border-gold-400 bg-gradient-to-br from-navy-900 to-navy-800">
                    <CardHeader>
                      <Badge className="bg-gold-600 text-navy-900 w-fit font-bold">📚 Digital</Badge>
                      <CardTitle className="text-lg text-gold-400">"From Paycheck to Prosperity"</CardTitle>
                      <CardDescription className="text-gold-100">Comprehensive financial freedom guide</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gold-400">$29</div>
                        <div className="text-sm text-gold-200">30% commission = $8.70</div>
                      </div>
                      <div className="space-y-1 text-sm text-gold-100">
                        <div>• 150+ page guide</div>
                        <div>• Step-by-step strategies</div>
                        <div>• Bonus worksheets</div>
                        <div>• Instant digital delivery</div>
                      </div>
                      <Button 
                        className="w-full bg-gold-600 hover:bg-gold-700 text-navy-900 font-semibold" 
                        data-testid="button-promote-ebook"
                        onClick={() => handleAffiliateLink('From Paycheck to Prosperity eBook')}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Get Affiliate Link
                      </Button>
                    </CardContent>
                  </Card>

                  {/* FR2P Rings - GOLD Background */}
                  <Card className="border-4 border-gold-500 bg-gradient-to-br from-gold-400 to-gold-600 shadow-xl">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-navy-900 text-gold-400 font-bold">🏆 BEST SELLER!</Badge>
                        <Star className="w-5 h-5 text-white" />
                      </div>
                      <CardTitle className="text-lg text-white">FR2P Rings</CardTitle>
                      <CardDescription className="text-white/90">Stunning FR2P branded rings with crystal accents</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Ring Images Gallery */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <img src="/ring-image-1.jpg" alt="FR2P Ring Square" className="w-full h-24 object-cover rounded-lg border-2 border-white" />
                        <img src="/ring-image-2.jpg" alt="FR2P Ring Oval" className="w-full h-24 object-cover rounded-lg border-2 border-white" />
                        <img src="/ring-image-3.jpg" alt="FR2P Ring Heart Gold" className="w-full h-24 object-cover rounded-lg border-2 border-white" />
                        <img src="/ring-heart-gold.jpg" alt="FR2P Ring Heart with Crystals" className="w-full h-24 object-cover rounded-lg border-2 border-white" />
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">$60</div>
                        <div className="text-sm text-white/80">Your profit: $37-39 per ring</div>
                      </div>
                      <div className="space-y-1 text-sm text-white">
                        <div>💍 3 Colors: Silver, Black, Gold</div>
                        <div>✨ 3 Shapes: Square, Oval, Heart</div>
                        <div>💎 Beautiful crystal accents</div>
                        <div>🏆 FR2P logo and branding</div>
                        <div>👫 For Men & Women - Sizes 7-14</div>
                        <div>📦 Amazon fulfillment + Gift box</div>
                      </div>
                      <Button 
                        className="w-full bg-white hover:bg-white/90 text-navy-900 font-bold" 
                        data-testid="button-order-fr2p-ring"
                        onClick={() => handlePurchase('FR2P Ring', '$60', 'product')}
                      >
                        <Gift className="w-4 h-4 mr-2" />
                        Order FR2P Ring
                      </Button>
                      <p className="text-xs text-center text-white/90 italic">
                        Fast Amazon delivery • Premium quality • Beautiful gift packaging
                      </p>
                    </CardContent>
                  </Card>

                  {/* FR2P Unisex Watches - GOLD Background */}
                  <Card className="border-4 border-gold-500 bg-gradient-to-br from-gold-400 to-gold-600 shadow-xl">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-navy-900 text-gold-400 font-bold">⌚ NEW ARRIVAL!</Badge>
                        <Star className="w-5 h-5 text-white" />
                      </div>
                      <CardTitle className="text-lg text-white">FR2P Unisex Watches</CardTitle>
                      <CardDescription className="text-white/90">Premium branded timepieces - 4 stunning colors</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Watch Images Gallery */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <img src="/watch-silver.jpg" alt="FR2P Watch Silver" className="w-full h-24 object-cover rounded-lg border-2 border-white" />
                        <img src="/watch-black.jpg" alt="FR2P Watch Black" className="w-full h-24 object-cover rounded-lg border-2 border-white" />
                        <img src="/watch-gold-blue.jpg" alt="FR2P Watch Gold Blue" className="w-full h-24 object-cover rounded-lg border-2 border-white" />
                        <img src="/watch-gold-burgundy.jpg" alt="FR2P Watch Gold Burgundy" className="w-full h-24 object-cover rounded-lg border-2 border-white" />
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">$50</div>
                        <div className="text-sm text-white/80">His & Hers sizes available</div>
                      </div>
                      <div className="space-y-1 text-sm text-white">
                        <div>⌚ 4 Colors: Silver, Black, Gold/Blue, Gold/Burgundy</div>
                        <div>✨ FR2P "Financial Roadway 2 Prosperity" branding</div>
                        <div>💎 Premium stainless steel construction</div>
                        <div>👫 Unisex - Large & Small sizes</div>
                        <div>🎁 Perfect gift for entrepreneurs</div>
                        <div>📦 Elegant packaging included</div>
                      </div>
                      <Button 
                        className="w-full bg-white hover:bg-white/90 text-navy-900 font-bold" 
                        data-testid="button-order-fr2p-watch"
                        onClick={() => handlePurchase('FR2P Unisex Watch', '$50', 'product')}
                      >
                        <Gift className="w-4 h-4 mr-2" />
                        Order FR2P Watch ($50)
                      </Button>
                      <p className="text-xs text-center text-white/90 italic">
                        Represent your journey to financial prosperity • Premium quality timepiece
                      </p>
                    </CardContent>
                  </Card>

                  {/* TexterGram - Navy/Gold Theme */}
                  <Card className="border-2 border-gold-400 bg-gradient-to-br from-navy-900 to-navy-800">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-gold-600 text-navy-900 font-bold">🤖 AI-Powered</Badge>
                        <Star className="w-5 h-5 text-gold-400" />
                      </div>
                      <CardTitle className="text-lg text-gold-400">TexterGram - AI Text Messaging App</CardTitle>
                      <CardDescription className="text-gold-100">The world's most advanced AI text messaging platform</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-1 text-sm text-gold-100">
                        <div>🤖 AI-powered rephrasing & typo correction</div>
                        <div>🌍 Translation in 40+ languages</div>
                        <div>👥 Private group texting capabilities</div>
                        <div>📝 Save & reuse message templates</div>
                        <div>✅ Auto-corrects grammar & punctuation</div>
                        <div>🚫 20-second intervals avoid spam filters</div>
                        <div>💼 Perfect for businesses & influencers</div>
                      </div>
                      
                      {/* Pricing Options */}
                      <div className="bg-gold-400/20 rounded-lg p-3 border border-gold-400/40">
                        <p className="text-xs text-gold-400 font-bold mb-2">💰 Pricing Plans:</p>
                        <div className="space-y-1 text-xs text-gold-100">
                          <div>• 2,500 Credits: $45.99 (1 Download Code)</div>
                          <div>• 7,500 Credits: $65.99 (3 Download Codes)</div>
                          <div>• Economy: $219.95 (11 Download Codes)</div>
                          <div>• Premium: $499.95 (51 Download Codes)</div>
                        </div>
                      </div>
                      
                      <div className="bg-gold-400/20 rounded-lg p-3 border border-gold-400/40">
                        <p className="text-xs text-gold-100">
                          <strong className="text-gold-400">Perfect for FR2P Ambassadors:</strong><br/>
                          Communicate with your downline in any language, use AI to perfect your messages, 
                          and send group updates without hitting spam filters. Available on Android (August 2025) 
                          and iPhone (early 2026).
                        </p>
                      </div>
                      <Button 
                        className="w-full bg-gold-600 hover:bg-gold-700 text-navy-900 font-semibold" 
                        data-testid="button-textergram"
                        onClick={() => window.open('https://textergram.com/kxzpt', '_blank')}
                      >
                        <Package className="w-4 h-4 mr-2" />
                        View Plans & Sign Up
                      </Button>
                      <p className="text-xs text-center text-gold-300 italic">
                        AI messaging • 40+ languages • Group texting • Spam-free delivery
                      </p>
                    </CardContent>
                  </Card>

                </div>

                {/* Digital Products Section */}
                <div className="mt-8">
                  <h3 className="text-2xl font-bold text-gold-400 mb-2">Digital Products</h3>
                  <p className="text-white/70 text-sm mb-6">One-time purchases that earn you income forever - no membership required</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  {/* Financial Reset Starter Kit */}
                  <Card className="border-2 border-green-400 bg-gradient-to-br from-green-800 to-green-900">
                    <CardHeader>
                      <Badge className="bg-green-400 text-green-900 w-fit font-bold">💰 STARTER</Badge>
                      <CardTitle className="text-lg text-green-100">Financial Reset Starter Kit</CardTitle>
                      <CardDescription className="text-green-200">Your first step to financial freedom</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-300">$7</div>
                        <div className="text-sm text-green-200">One-time purchase • Instant delivery</div>
                      </div>
                      <div className="space-y-1 text-sm text-green-100">
                        <div>• 30-day financial reset plan</div>
                        <div>• Budget tracking spreadsheet</div>
                        <div>• Expense elimination checklist</div>
                        <div>• Emergency fund calculator</div>
                        <div>• Money mindset journal prompts</div>
                      </div>
                      <Button 
                        className="w-full bg-green-400 hover:bg-green-500 text-green-900 font-semibold" 
                        data-testid="button-buy-starter-kit"
                        onClick={() => handlePurchase('Financial Reset Starter Kit', '$7', 'product')}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Buy Now ($7)
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Side Hustle Blueprint */}
                  <Card className="border-2 border-gold-400 bg-gradient-to-br from-navy-900 to-navy-800">
                    <CardHeader>
                      <Badge className="bg-gold-600 text-navy-900 w-fit font-bold">🚀 POPULAR</Badge>
                      <CardTitle className="text-lg text-gold-400">Side Hustle Blueprint</CardTitle>
                      <CardDescription className="text-gold-100">Build income streams outside your 9-to-5</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gold-400">$17</div>
                        <div className="text-sm text-gold-200">One-time purchase • Instant delivery</div>
                      </div>
                      <div className="space-y-1 text-sm text-gold-100">
                        <div>• 15 proven side hustle ideas</div>
                        <div>• Step-by-step launch guides</div>
                        <div>• Income tracking templates</div>
                        <div>• Social media marketing playbook</div>
                        <div>• Tax deduction cheat sheet</div>
                      </div>
                      <Button 
                        className="w-full bg-gold-600 hover:bg-gold-700 text-navy-900 font-semibold" 
                        data-testid="button-buy-side-hustle"
                        onClick={() => handlePurchase('Side Hustle Blueprint', '$17', 'product')}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Buy Now ($17)
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Credit Boost Accelerator */}
                  <Card className="border-2 border-blue-400 bg-gradient-to-br from-blue-800 to-blue-900">
                    <CardHeader>
                      <Badge className="bg-blue-400 text-blue-900 w-fit font-bold">📈 BEST VALUE</Badge>
                      <CardTitle className="text-lg text-blue-100">Credit Boost Accelerator</CardTitle>
                      <CardDescription className="text-blue-200">Repair and build your credit score fast</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-300">$27</div>
                        <div className="text-sm text-blue-200">One-time purchase • Instant delivery</div>
                      </div>
                      <div className="space-y-1 text-sm text-blue-100">
                        <div>• Credit repair step-by-step guide</div>
                        <div>• Dispute letter templates</div>
                        <div>• Credit score simulator</div>
                        <div>• Debt payoff calculator</div>
                        <div>• Credit building strategy plan</div>
                      </div>
                      <Button 
                        className="w-full bg-blue-400 hover:bg-blue-500 text-blue-900 font-semibold" 
                        data-testid="button-buy-credit-boost"
                        onClick={() => handlePurchase('Credit Boost Accelerator', '$27', 'product')}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Buy Now ($27)
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Budgeting Mastery Toolkit */}
                  <Card className="border-2 border-purple-400 bg-gradient-to-br from-purple-800 to-purple-900">
                    <CardHeader>
                      <Badge className="bg-purple-400 text-purple-900 w-fit font-bold">🎯 ESSENTIAL</Badge>
                      <CardTitle className="text-lg text-purple-100">Budgeting Mastery Toolkit</CardTitle>
                      <CardDescription className="text-purple-200">Take complete control of your money</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-300">$12</div>
                        <div className="text-sm text-purple-200">One-time purchase • Instant delivery</div>
                      </div>
                      <div className="space-y-1 text-sm text-purple-100">
                        <div>• Monthly budget spreadsheet</div>
                        <div>• Savings goal tracker</div>
                        <div>• Bill payment organizer</div>
                        <div>• Financial goal planner</div>
                        <div>• Net worth calculator</div>
                      </div>
                      <Button 
                        className="w-full bg-purple-400 hover:bg-purple-500 text-purple-900 font-semibold" 
                        data-testid="button-buy-budgeting"
                        onClick={() => handlePurchase('Budgeting Mastery Toolkit', '$12', 'product')}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Buy Now ($12)
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Money Mindset Audio Series */}
                  <Card className="border-2 border-amber-400 bg-gradient-to-br from-amber-800 to-amber-900">
                    <CardHeader>
                      <Badge className="bg-amber-400 text-amber-900 w-fit font-bold">🎧 AUDIO</Badge>
                      <CardTitle className="text-lg text-amber-100">Money Mindset Audio Series</CardTitle>
                      <CardDescription className="text-amber-200">Transform your relationship with money</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-amber-300">$19</div>
                        <div className="text-sm text-amber-200">One-time purchase • Instant delivery</div>
                      </div>
                      <div className="space-y-1 text-sm text-amber-100">
                        <div>• 10 audio lessons (5+ hours)</div>
                        <div>• Wealth affirmation recordings</div>
                        <div>• Daily motivation tracks</div>
                        <div>• Financial vision board guide</div>
                        <div>• Bonus: Goal-setting workbook</div>
                      </div>
                      <Button 
                        className="w-full bg-amber-400 hover:bg-amber-500 text-amber-900 font-semibold" 
                        data-testid="button-buy-audio"
                        onClick={() => handlePurchase('Money Mindset Audio Series', '$19', 'product')}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Buy Now ($19)
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Lifetime Access */}
                  <Card className="border-4 border-gold-500 bg-gradient-to-br from-gold-400 to-gold-600 shadow-xl">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-navy-900 text-gold-400 font-bold">♾️ LIFETIME ACCESS</Badge>
                        <Gem className="w-5 h-5 text-white" />
                      </div>
                      <CardTitle className="text-lg text-white">FR2P Lifetime Access Bundle</CardTitle>
                      <CardDescription className="text-white/90">All digital products + permanent access - one payment</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">$297</div>
                        <div className="text-sm text-white/80">One-time payment • No monthly fees ever</div>
                        <div className="text-xs text-white/70 mt-1">Save over $500 vs buying everything separately</div>
                      </div>
                      <div className="space-y-1 text-sm text-white">
                        <div>♾️ ALL digital products included</div>
                        <div>📚 FR2P Resource Library (forever)</div>
                        <div>💬 Community Chat access (forever)</div>
                        <div>🎓 All future courses & updates</div>
                        <div>📊 Financial tools & calculators</div>
                        <div>🏆 Lifetime Member badge</div>
                      </div>
                      <Button 
                        className="w-full bg-white hover:bg-white/90 text-navy-900 font-bold" 
                        data-testid="button-buy-lifetime"
                        onClick={() => handlePurchase('FR2P Lifetime Access Bundle', '$297', 'product')}
                      >
                        <Gem className="w-4 h-4 mr-2" />
                        Get Lifetime Access ($297)
                      </Button>
                      <p className="text-xs text-center text-white/90 italic">
                        Pay once, own forever • No retention required • True generational value
                      </p>
                    </CardContent>
                  </Card>

                </div>

              </CardContent>
            </Card>
          </TabsContent>

          {/* Marketing Materials Tab */}
          <TabsContent value="marketing-materials" className="space-y-6">

            {/* Header */}
            <div className="relative overflow-hidden rounded-xl border-2 border-[#FFD700] bg-gradient-to-r from-[#001f3f] via-[#002855] to-[#001f3f] p-6 shadow-xl shadow-[#FFD700]/10">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />
              <div className="text-center">
                <Badge className="bg-[#FFD700] text-[#001f3f] font-bold text-sm mb-3">📣 Member Marketing Toolkit</Badge>
                <h2 className="text-2xl font-bold text-[#FFD700] mb-2">Your Personal FR2P Marketing Materials</h2>
                <p className="text-white/80 max-w-2xl mx-auto text-sm leading-relaxed">
                  Every piece below is designed in The FR2P Club's navy and gold colors. Customize them with your name, number, email, and personal referral link — then print and distribute. Your business card is your handshake before you speak.
                </p>
              </div>
            </div>

            {/* Business Card */}
            <Card className="border-2 border-[#FFD700]/60 bg-gradient-to-br from-[#001f3f] to-[#002855]">
              <CardHeader>
                <div className="flex items-center justify-between mb-1">
                  <Badge className="bg-[#FFD700] text-[#001f3f] font-bold">💼 Business Cards</Badge>
                  <Badge className="bg-green-600 text-white text-xs">Standard 3.5" × 2"</Badge>
                </div>
                <CardTitle className="text-xl text-[#FFD700]">The FR2P Club Business Card</CardTitle>
                <CardDescription className="text-white/70">
                  Front: The FR2P Club branding, membership tiers, and pricing. Back: Your name, title, phone, email, referral link, and QR code.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  {/* Preview */}
                  <div>
                    <p className="text-[#FFD700]/70 text-xs font-semibold uppercase tracking-widest mb-3">Design Preview</p>
                    <div className="rounded-xl overflow-hidden border-2 border-[#FFD700]/30 shadow-lg">
                      <img
                        src="/fr2p-business-card.jpeg"
                        alt="The FR2P Club Business Card — front shows branding and pricing, back shows member contact info and QR code"
                        className="w-full object-cover"
                      />
                    </div>
                  </div>
                  {/* Details + CTA */}
                  <div className="space-y-4">
                    <div className="bg-white/5 border border-[#FFD700]/20 rounded-xl p-4 space-y-2">
                      <p className="text-[#FFD700] font-semibold text-sm mb-2">What's on the card:</p>
                      <div className="space-y-1.5 text-sm text-white/80">
                        <div>🎨 <span className="font-medium text-white">Front:</span> The FR2P Club logo, "Financial Roadway to Prosperity," Standard $35/mo & Premium $50/mo</div>
                        <div>👤 <span className="font-medium text-white">Back:</span> Your name, title, phone, email, personal referral website & QR code</div>
                        <div>🖨️ <span className="font-medium text-white">Size:</span> Standard 3.5" × 2" — prints at any print shop or online</div>
                        <div>📐 <span className="font-medium text-white">Format:</span> Customize in Canva, then download as PDF to print</div>
                      </div>
                    </div>
                    <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-lg p-3 text-sm text-white/80">
                      <p className="text-[#FFD700] font-semibold mb-1">How to use:</p>
                      <ol className="list-decimal ml-4 space-y-1">
                        <li>Click "Customize in Canva" below</li>
                        <li>Replace the sample name, phone, email & link with your own</li>
                        <li>Download as PDF (print quality)</li>
                        <li>Order prints from Vistaprint, FedEx, or any local printer</li>
                      </ol>
                    </div>
                    <Button
                      className="w-full bg-[#FFD700] text-[#001f3f] hover:bg-[#FFC700] font-bold text-base py-6"
                      data-testid="button-customize-business-card"
                      onClick={() => window.open('https://www.canva.com/design/template', '_blank')}
                    >
                      <ExternalLink className="w-5 h-5 mr-2" />
                      Customize Business Card in Canva
                    </Button>
                    <Button
                      className="w-full bg-white/10 text-white hover:bg-white/20 border border-[#FFD700]/40 font-semibold"
                      data-testid="button-download-business-card-pdf"
                      onClick={() => window.open('/fr2p-business-card-print.html', '_blank')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Business Card PDF
                    </Button>
                    <p className="text-white/40 text-xs text-center">Free Canva account required • Template opens ready to edit</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Postcard */}
            <Card className="border-2 border-[#FFD700]/60 bg-gradient-to-br from-[#001f3f] to-[#002855]">
              <CardHeader>
                <div className="flex items-center justify-between mb-1">
                  <Badge className="bg-[#FFD700] text-[#001f3f] font-bold">📮 Postcards</Badge>
                  <Badge className="bg-blue-600 text-white text-xs">4" × 6" Standard Postcard</Badge>
                </div>
                <CardTitle className="text-xl text-[#FFD700]">The FR2P Club Postcard — 4×6</CardTitle>
                <CardDescription className="text-white/70">
                  Front: Bold "Multiple Streams. One Road to Success!" with membership options. Back: Your personal message, contact info, referral link & QR code.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  {/* Preview */}
                  <div>
                    <p className="text-[#FFD700]/70 text-xs font-semibold uppercase tracking-widest mb-3">Design Preview (Front & Back)</p>
                    <div className="rounded-xl overflow-hidden border-2 border-[#FFD700]/30 shadow-lg">
                      <img
                        src="/fr2p-postcard.jpeg"
                        alt="The FR2P Club 4x6 Postcard — front shows bold branding and membership pricing, back has message area, contact fields, and QR code"
                        className="w-full object-cover"
                      />
                    </div>
                  </div>
                  {/* Details + CTA */}
                  <div className="space-y-4">
                    <div className="bg-white/5 border border-[#FFD700]/20 rounded-xl p-4 space-y-2">
                      <p className="text-[#FFD700] font-semibold text-sm mb-2">What's on the postcard:</p>
                      <div className="space-y-1.5 text-sm text-white/80">
                        <div>🌟 <span className="font-medium text-white">Front:</span> "Multiple Streams. One Road to Success!" — bold navy & gold design with pricing and benefits</div>
                        <div>✉️ <span className="font-medium text-white">Back:</span> Personal message area, your name/phone/email/website, personal FR2P referral link & QR code</div>
                        <div>📬 <span className="font-medium text-white">Size:</span> Standard 4×6 — qualifies for USPS postcard postage rate</div>
                        <div>📐 <span className="font-medium text-white">Use:</span> Direct mail campaigns, hand-outs, leave-behinds at events</div>
                      </div>
                    </div>
                    <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-lg p-3 text-sm text-white/80">
                      <p className="text-[#FFD700] font-semibold mb-1">How to use:</p>
                      <ol className="list-decimal ml-4 space-y-1">
                        <li>Click "Customize in Canva" below</li>
                        <li>Add your personal message & contact details on the back</li>
                        <li>Download as PDF (print quality)</li>
                        <li>Print at Vistaprint, Canva Print, or your local FedEx/UPS</li>
                        <li>Mail or hand out at events, churches, barbershops, etc.</li>
                      </ol>
                    </div>
                    <Button
                      className="w-full bg-[#FFD700] text-[#001f3f] hover:bg-[#FFC700] font-bold text-base py-6"
                      data-testid="button-customize-postcard"
                      onClick={() => window.open('https://www.canva.com/design/template', '_blank')}
                    >
                      <ExternalLink className="w-5 h-5 mr-2" />
                      Customize Postcard in Canva
                    </Button>
                    <Button
                      className="w-full bg-white/10 text-white hover:bg-white/20 border border-[#FFD700]/40 font-semibold"
                      data-testid="button-download-postcard-pdf"
                      onClick={() => window.open('/fr2p-postcard-print.html', '_blank')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Postcard PDF
                    </Button>
                    <p className="text-white/40 text-xs text-center">Free Canva account required • Template opens ready to edit</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trifold Brochure */}
            <Card className="border-2 border-[#FFD700]/60 bg-gradient-to-br from-[#001f3f] to-[#002855]">
              <CardHeader>
                <div className="flex items-center justify-between mb-1">
                  <Badge className="bg-[#FFD700] text-[#001f3f] font-bold">📄 Trifold Brochure</Badge>
                  <Badge className="bg-purple-600 text-white text-xs">8.5" × 11" Folded to 3 Panels</Badge>
                </div>
                <CardTitle className="text-xl text-[#FFD700]">The FR2P Club Trifold Brochure</CardTitle>
                <CardDescription className="text-white/70">
                  A full-color trifold covering everything: what you get, membership options, healthcare & travel benefits, and reoccurring income. Leave one anywhere — it tells the whole story without you saying a word.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  {/* Preview */}
                  <div>
                    <p className="text-[#FFD700]/70 text-xs font-semibold uppercase tracking-widest mb-3">Design Preview (All 4 Panels)</p>
                    <div className="rounded-xl overflow-hidden border-2 border-[#FFD700]/30 shadow-lg">
                      <img
                        src="/fr2p-brochure.jpeg"
                        alt="The FR2P Club trifold brochure showing all four panels: welcome, what you get, membership options, healthcare and travel benefits, and reoccurring income"
                        className="w-full object-cover"
                      />
                    </div>
                  </div>
                  {/* Details + CTA */}
                  <div className="space-y-4">
                    <div className="bg-white/5 border border-[#FFD700]/20 rounded-xl p-4 space-y-2">
                      <p className="text-[#FFD700] font-semibold text-sm mb-2">What's inside the brochure:</p>
                      <div className="space-y-1.5 text-sm text-white/80">
                        <div>🌟 <span className="font-medium text-white">Panel 1:</span> "Multiple Streams. One Road to Success!" — welcome & your personal referral link</div>
                        <div>📋 <span className="font-medium text-white">Panel 2:</span> What You Get With The FR2P Club — full feature breakdown for both tiers</div>
                        <div>💳 <span className="font-medium text-white">Panel 3:</span> Membership Options — Standard $35/mo vs Premium $50/mo side by side</div>
                        <div>🏥 <span className="font-medium text-white">Panel 4:</span> Healthcare & Travel Benefits — affordable plans, virtual doctors, travel perks</div>
                        <div>💰 <span className="font-medium text-white">Panel 5:</span> Reoccurring Income That Follows You for Life — verified earning, lifetime passive income</div>
                        <div>🔗 <span className="font-medium text-white">Back:</span> Your name, referral link, and "Join Us Today!" call to action</div>
                      </div>
                    </div>
                    <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-lg p-3 text-sm text-white/80">
                      <p className="text-[#FFD700] font-semibold mb-1">How to use:</p>
                      <ol className="list-decimal ml-4 space-y-1">
                        <li>Click "Customize in Canva" below</li>
                        <li>Add your name, phone, email, and personal referral link</li>
                        <li>Download as PDF (print quality)</li>
                        <li>Print double-sided on 8.5×11, fold into thirds</li>
                        <li>Distribute at events, mail directly, or hand out in your community</li>
                      </ol>
                    </div>
                    <Button
                      className="w-full bg-[#FFD700] text-[#001f3f] hover:bg-[#FFC700] font-bold text-base py-6"
                      data-testid="button-customize-brochure"
                      onClick={() => window.open('https://www.canva.com/design/template', '_blank')}
                    >
                      <ExternalLink className="w-5 h-5 mr-2" />
                      Customize Brochure in Canva
                    </Button>
                    <Button
                      className="w-full bg-white/10 text-white hover:bg-white/20 border border-[#FFD700]/40 font-semibold"
                      data-testid="button-download-brochure-pdf"
                      onClick={() => window.open('/fr2p-brochure-print.html', '_blank')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Brochure PDF
                    </Button>
                    <p className="text-white/40 text-xs text-center">Free Canva account required • Template opens ready to edit</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Flyer */}
            <Card className="border-2 border-[#FFD700]/60 bg-gradient-to-br from-[#001f3f] to-[#002855]">
              <CardHeader>
                <div className="flex items-center justify-between mb-1">
                  <Badge className="bg-[#FFD700] text-[#001f3f] font-bold">📋 Flyer</Badge>
                  <Badge className="bg-orange-600 text-white text-xs">8.5" × 11" Single Page</Badge>
                </div>
                <CardTitle className="text-xl text-[#FFD700]">The FR2P Club Promotional Flyer</CardTitle>
                <CardDescription className="text-white/70">
                  A bold single-page flyer highlighting The FR2P Club opportunity. Perfect for bulletin boards, windshields, hand-outs, and anywhere you want to make an impression fast.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  {/* Preview placeholder */}
                  <div>
                    <p className="text-[#FFD700]/70 text-xs font-semibold uppercase tracking-widest mb-3">Design Preview</p>
                    <div className="rounded-xl overflow-hidden border-2 border-[#FFD700]/30 shadow-lg">
                      <img
                        src="/fr2p-flyer.jpeg"
                        alt="The FR2P Club promotional flyer — Multiple Streams, One Road to Success with membership pricing, benefits, and personal referral link"
                        className="w-full object-cover"
                      />
                    </div>
                  </div>
                  {/* Details + CTA */}
                  <div className="space-y-4">
                    <div className="bg-white/5 border border-[#FFD700]/20 rounded-xl p-4 space-y-2">
                      <p className="text-[#FFD700] font-semibold text-sm mb-2">What's on the flyer:</p>
                      <div className="space-y-1.5 text-sm text-white/80">
                        <div>🌟 <span className="font-medium text-white">Headline:</span> Bold attention-grabbing The FR2P Club message</div>
                        <div>💳 <span className="font-medium text-white">Membership:</span> Standard $35/mo and Premium $50/mo options</div>
                        <div>💰 <span className="font-medium text-white">Income:</span> $5/month per referral — recurring commission potential</div>
                        <div>🔗 <span className="font-medium text-white">Your link:</span> Personal referral link and QR code at the bottom</div>
                        <div>📞 <span className="font-medium text-white">Contact:</span> Your name, phone, and email</div>
                      </div>
                    </div>
                    <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-lg p-3 text-sm text-white/80">
                      <p className="text-[#FFD700] font-semibold mb-1">How to use:</p>
                      <ol className="list-decimal ml-4 space-y-1">
                        <li>Click "Customize in Canva" below</li>
                        <li>Add your name, phone, email, and personal referral link</li>
                        <li>Download as PDF (print quality)</li>
                        <li>Print at home, FedEx, or Staples on 8.5×11</li>
                        <li>Post on bulletin boards, hand out at events, leave under windshields</li>
                      </ol>
                    </div>
                    <Button
                      className="w-full bg-[#FFD700] text-[#001f3f] hover:bg-[#FFC700] font-bold text-base py-6"
                      data-testid="button-customize-flyer"
                      onClick={() => window.open('https://www.canva.com/design/template', '_blank')}
                    >
                      <ExternalLink className="w-5 h-5 mr-2" />
                      Customize Flyer in Canva
                    </Button>
                    <p className="text-white/40 text-xs text-center">Free Canva account required • Template opens ready to edit</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pro tips footer */}
            <Card className="border-2 border-[#FFD700]/40 bg-[#001f3f]">
              <CardContent className="pt-5 pb-5">
                <p className="text-[#FFD700] font-bold mb-3 text-center">💡 Marketing Pro Tips from The FR2P Club</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-white">
                  <div className="flex items-start gap-2">
                    <span className="text-[#FFD700] font-bold shrink-0">01.</span>
                    <span>Always put your personal referral link and QR code on every piece — that's how sign-ups get tracked back to you.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#FFD700] font-bold shrink-0">02.</span>
                    <span>Leave postcards at barbershops, nail salons, churches, gyms, and community centers — anywhere people gather and wait.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#FFD700] font-bold shrink-0">03.</span>
                    <span>Hand your business card out every time someone asks "what do you do?" — let the card do the talking before you even explain.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#FFD700] font-bold shrink-0">04.</span>
                    <span>The brochure tells the whole story. Leave stacks at libraries, laundromats, waiting rooms, and anywhere people sit and read.</span>
                  </div>
                </div>
              </CardContent>
            </Card>

          </TabsContent>

          {/* Mission Statement Tab */}
          <TabsContent value="mission" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  The FR2P Club Mission Statement
                </CardTitle>
                <CardDescription>
                  Our purpose, vision, and commitment to your financial prosperity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                
                {/* Main Mission */}
                <div className="text-center space-y-6">
                  <div className="bg-gradient-to-r from-navy-600 to-navy-800 text-white p-8 rounded-xl">
                    <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                    <p className="text-lg leading-relaxed">
                      To empower individuals—especially those in underserved communities—with the tools, knowledge, 
                      and opportunities to achieve financial independence through ethical entrepreneurship and affiliate marketing.
                    </p>
                  </div>
                </div>

                {/* Core Values */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardHeader>
                      <CardTitle className="text-green-800">💡 Empowerment</CardTitle>
                    </CardHeader>
                    <CardContent className="text-green-700">
                      <p>We believe everyone deserves the opportunity to build wealth and achieve financial freedom, 
                      regardless of their starting point or background.</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-cream-50 to-cream-100 border-navy-200">
                    <CardHeader>
                      <CardTitle className="text-navy-800">🤝 Community</CardTitle>
                    </CardHeader>
                    <CardContent className="text-navy-700">
                      <p>Success is achieved together. We foster a supportive community where members help each other 
                      grow and prosper through sharing knowledge and opportunities.</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <CardHeader>
                      <CardTitle className="text-purple-800">⚖️ Ethics</CardTitle>
                    </CardHeader>
                    <CardContent className="text-purple-700">
                      <p>We operate with complete transparency and integrity, promoting only products and services 
                      that genuinely add value to people's lives and businesses.</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-gray-800">📈 Growth</CardTitle>
                    </CardHeader>
                    <CardContent className="text-gray-700">
                      <p>We provide comprehensive education and tools for personal and financial growth, helping 
                      members develop skills that last a lifetime.</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Vision Statement */}
                <Card className="bg-gray-50 border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-center text-gray-800">🌟 Our Vision</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-gray-700">
                    <p className="text-lg leading-relaxed">
                      To create a world where financial opportunity is accessible to all, where ordinary people can achieve 
                      extraordinary income through ethical affiliate marketing, and where prosperity is shared within communities 
                      that lift each other up.
                    </p>
                  </CardContent>
                </Card>

                {/* Promise */}
                <Card className="bg-gradient-to-r from-navy-900 to-navy-800 text-white border-2 border-gold-400 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-center text-gold-400">💎 Our Promise to You</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-semibold mb-2 text-gold-400">✓ Complete Transparency</h4>
                        <p className="text-cream-100">All commissions, fees, and earning potential clearly disclosed</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-gold-400">✓ Quality Education</h4>
                        <p className="text-cream-100">Professional training materials and ongoing support</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-gold-400">✓ Fair Compensation</h4>
                        <p className="text-cream-100">Competitive commissions and tier progression system</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-gold-400">✓ Community Support</h4>
                        <p className="text-cream-100">Access to mentorship and peer networking</p>
                      </div>
                    </div>
                    <div className="text-center mt-6 pt-6 border-t border-gold-400/30">
                      <p className="font-semibold text-gold-400 text-lg">
                        "From Paycheck to Paycheck to Paycheck to Prosperity"
                      </p>
                      <p className="text-sm text-cream-200 mt-2">
                        Your financial roadway to prosperity starts here.
                      </p>
                    </div>
                  </CardContent>
                </Card>

              </CardContent>
            </Card>
          </TabsContent>

          {/* Presentation Kits Tab */}
          <TabsContent value="presentation-kits" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Presentation Kits & Downloads
                </CardTitle>
                <CardDescription>
                  Professional presentation materials and resources you can download to your device
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">

                {/* Business Presentation Kits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* INVESTOR PROPOSAL - Featured */}
                  <Card className="border-4 border-gold-400 bg-gradient-to-br from-navy-900 to-navy-800 md:col-span-2 shadow-xl">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-gold-500 text-navy-900 text-sm font-bold">💼 INVESTOR DOCUMENT</Badge>
                        <Star className="w-6 h-6 text-gold-400" />
                      </div>
                      <CardTitle className="text-xl text-gold-400">The FR2P Club - Investment Proposal</CardTitle>
                      <CardDescription className="text-base text-cream-100">Professional business proposal for raising capital ($10K-$25K)</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-cream-100">
                        <div>📊 7-page comprehensive business plan</div>
                        <div>💰 Financial projections (3-year forecast)</div>
                        <div>📈 ROI calculations & investor returns</div>
                        <div>🎯 Use of funds breakdown</div>
                        <div>📋 Investment terms & structures</div>
                        <div>✅ Risk assessment & mitigation</div>
                        <div>🏢 Management & operations overview</div>
                        <div>💼 Ready to present to investors</div>
                      </div>
                      <div className="bg-navy-950 p-4 rounded border-2 border-gold-400">
                        <p className="text-sm font-semibold text-gold-400 mb-2">🎯 Investment Ask: $10,000 - $25,000</p>
                        <p className="text-sm text-cream-100">Purpose: Eliminate 3-month commission hold to accelerate growth</p>
                        <p className="text-sm text-cream-100">Projected 12-Month ROI: 100-200%</p>
                      </div>
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 text-white text-base py-6" 
                        onClick={() => window.open('/fr2p-investor-proposal.html', '_blank')}
                        data-testid="button-view-investor-proposal"
                      >
                        <FileText className="w-5 h-5 mr-2" />
                        View Investor Proposal (Print/Save as PDF)
                      </Button>
                    </CardContent>
                  </Card>
                  
                  {/* Network Growth Diagram */}
                  <Card className="border-2 border-accent bg-gradient-to-br from-yellow-50 to-amber-100">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-accent text-accent-foreground">🏆 NEW!</Badge>
                        <Star className="w-5 h-5 text-accent" />
                      </div>
                      <CardTitle className="text-lg">5-Level Network Growth Diagram</CardTitle>
                      <CardDescription>Visual presentation showing 5-tier achievement system</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div>📊 5-Tier Achievement: Bronze → Silver → Gold → Platinum → Diamond</div>
                        <div>💰 $5/month per direct referral (unlimited)</div>
                        <div>🎯 Achievement bonuses: $50 → $100 → $200 → $500 → $1,000</div>
                        <div>✨ Example: 100 referrals = $500/month + bonuses</div>
                      </div>
                      <Button 
                        className="w-full bg-accent hover:bg-accent/90" 
                        onClick={() => window.open('/network-diagram.html', '_blank')}
                        data-testid="button-view-network-diagram"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        View/Print Diagram
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Complete FR2P Presentation */}
                  <Card className="border-2 border-accent bg-gradient-to-br from-cream-50 to-cream-100">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-primary text-primary-foreground">📄 COMPLETE</Badge>
                        <Star className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">FR2P Complete Business Presentation</CardTitle>
                      <CardDescription>8-page professional presentation with network diagram cover</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div>📑 8 pages - Complete business guide</div>
                        <div>📊 Network diagram cover page</div>
                        <div>💰 Full compensation breakdown</div>
                        <div>📚 Getting started & success tips</div>
                        <div>❓ FAQ section included</div>
                      </div>
                      <Button 
                        className="w-full bg-primary hover:bg-primary/90" 
                        onClick={() => window.open('/fr2p-presentation.html', '_blank')}
                        data-testid="button-view-full-presentation"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        View/Print Presentation
                      </Button>
                    </CardContent>
                  </Card>

                  {/* PowerPoint Script with AI Narration */}
                  <Card className="border-2 border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-purple-600 text-white">🎙️ AI NARRATION</Badge>
                        <Star className="w-5 h-5 text-purple-600" />
                      </div>
                      <CardTitle className="text-lg">PowerPoint Script with AI Narration</CardTitle>
                      <CardDescription>Complete slide-by-slide script for PowerPoint with AI voice</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div>🎤 10 slides with detailed AI narration scripts</div>
                        <div>📝 Word-for-word presentation text (30-60 sec each)</div>
                        <div>🎨 Visual design guidelines for each slide</div>
                        <div>🔧 Instructions for AI voice tools (ElevenLabs, Play.ht)</div>
                        <div>💡 Tips for PowerPoint creation & export</div>
                      </div>
                      <Button 
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white" 
                        onClick={() => window.open('/fr2p-presentation-with-narration.html', '_blank')}
                        data-testid="button-view-narration-script"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        View Script & Instructions
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-2 border-navy-200">
                    <CardHeader>
                      <Badge className="bg-navy-600 text-white w-fit">Essential</Badge>
                      <CardTitle className="text-lg">The FR2P Club Business Overview</CardTitle>
                      <CardDescription>Complete business presentation for prospects</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div>📊 15 slides - Business model overview</div>
                        <div>💰 Commission structure breakdown</div>
                        <div>📈 Income potential examples</div>
                        <div>🎯 Getting started guide</div>
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={() => window.open('/fr2p-presentation.html', '_blank')}
                        data-testid="button-download-overview"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        View/Print Overview
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-green-200">
                    <CardHeader>
                      <Badge className="bg-green-600 text-white w-fit">Advanced</Badge>
                      <CardTitle className="text-lg">Income Opportunity Presentation</CardTitle>
                      <CardDescription>Detailed earning potential and success stories</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div>📊 25 slides - Income breakdown</div>
                        <div>✨ Success stories and testimonials</div>
                        <div>🎯 Tier progression examples</div>
                        <div>📅 90-day action plan</div>
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={() => window.open('/calculator', '_blank')}
                        data-testid="button-download-income"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        View Income Calculator
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-purple-200">
                    <CardHeader>
                      <Badge className="bg-purple-600 text-white w-fit">Social Media</Badge>
                      <CardTitle className="text-lg">Social Media Content Pack</CardTitle>
                      <CardDescription>Ready-to-share posts and graphics</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div>📱 20+ social media templates</div>
                        <div>🎨 Branded graphics and images</div>
                        <div>📝 Pre-written post captions</div>
                        <div>🔗 Call-to-action examples</div>
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={() => window.open('/resources', '_blank')}
                        data-testid="button-download-social"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        View Resources & Templates
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-gray-200">
                    <CardHeader>
                      <Badge className="bg-gray-600 text-white w-fit">Training</Badge>
                      <CardTitle className="text-lg">New Member Training Kit</CardTitle>
                      <CardDescription>Complete onboarding and training materials</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div>📚 Getting started checklist</div>
                        <div>🎯 Goal setting worksheets</div>
                        <div>📞 Conversation scripts</div>
                        <div>📖 FAQ document</div>
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={() => window.open('/compensation-plan', '_blank')}
                        data-testid="button-download-training"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        View Compensation Plan
                      </Button>
                    </CardContent>
                  </Card>

                </div>

                {/* Download Instructions */}
                <Card className="bg-gray-50 border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-gray-800">📱 Download Instructions</CardTitle>
                  </CardHeader>
                  <CardContent className="text-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                      <div>
                        <h4 className="font-semibold mb-2">💻 Desktop/Laptop</h4>
                        <p>Click download button → File saves to Downloads folder → Open with PDF reader or PowerPoint</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">📱 Mobile Device</h4>
                        <p>Tap download button → Choose "Save to Files" → Access from your device's file manager</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">☁️ Cloud Storage</h4>
                        <p>After downloading, save to Google Drive, iCloud, or Dropbox for easy access anywhere</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
        </div>
      </div>
    </div>
  );
}