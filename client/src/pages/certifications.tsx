import { HeaderNav } from "@/components/ui/header-nav";
import { useQuery } from "@tanstack/react-query";
import type { MemberResponse } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  GraduationCap,
  Award,
  BookOpen,
  Star,
  CheckCircle,
  Users,
  DollarSign
} from "lucide-react";

import { getLoggedInMemberId } from "@/lib/auth";
const DEMO_USER_ID = getLoggedInMemberId();

export default function Certifications() {
  const { toast } = useToast();

  const { data: memberData } = useQuery<MemberResponse>({
    queryKey: ["/api/member", DEMO_USER_ID],
  });

  const handlePurchase = async (productName: string, price: string) => {
    toast({
      title: `${productName} - Enrollment Started!`,
      description: `Redirecting to checkout for ${price}...`,
    });

    try {
      const amount = parseFloat(price.replace(/[^0-9.-]+/g, ""));
      const response = await apiRequest("POST", "/api/create-payment-intent", {
        amount: amount,
        productName: productName,
        type: "product"
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

  const certifications = [
    {
      title: "Financial Literacy Fundamentals",
      level: "Foundation",
      price: "$49",
      color: "from-green-700 to-green-900",
      borderColor: "border-green-400",
      badgeColor: "bg-green-400 text-green-900",
      textColor: "text-white/90",
      accentColor: "text-[#FFD700]",
      btnColor: "bg-green-400 hover:bg-green-500 text-green-900",
      topics: [
        "Budgeting & saving strategies",
        "Understanding credit scores",
        "Debt management basics",
        "Introduction to investing",
        "Building emergency funds"
      ],
      duration: "4 weeks • Self-paced",
      outcome: "FR2P Certified Financial Literacy Graduate"
    },
    {
      title: "Affiliate Marketing Mastery",
      level: "Professional",
      price: "$99",
      color: "from-navy-900 to-navy-800",
      borderColor: "border-gold-400",
      badgeColor: "bg-gold-600 text-navy-900",
      textColor: "text-white/90",
      accentColor: "text-[#FFD700]",
      btnColor: "bg-gold-600 hover:bg-gold-700 text-navy-900",
      topics: [
        "Building your personal brand",
        "Social media marketing strategies",
        "Content creation for conversions",
        "Email marketing fundamentals",
        "Scaling your affiliate business"
      ],
      duration: "6 weeks • Self-paced",
      outcome: "FR2P Certified Affiliate Marketing Professional"
    },
    {
      title: "Digital Entrepreneurship",
      level: "Advanced",
      price: "$149",
      color: "from-purple-800 to-purple-900",
      borderColor: "border-purple-400",
      badgeColor: "bg-purple-400 text-purple-900",
      textColor: "text-white/90",
      accentColor: "text-[#FFD700]",
      btnColor: "bg-purple-400 hover:bg-purple-500 text-purple-900",
      topics: [
        "Business plan development",
        "Legal structures (LLC, Corp)",
        "Tax strategies for entrepreneurs",
        "Funding & grants for startups",
        "Building multiple income streams"
      ],
      duration: "8 weeks • Self-paced",
      outcome: "FR2P Certified Digital Entrepreneur"
    },
    {
      title: "Wealth Building & Legacy",
      level: "Expert",
      price: "$199",
      color: "from-gold-500 to-gold-700",
      borderColor: "border-gold-500",
      badgeColor: "bg-navy-900 text-gold-400",
      textColor: "text-white",
      accentColor: "text-white",
      btnColor: "bg-white hover:bg-white/90 text-navy-900",
      topics: [
        "Real estate investment fundamentals",
        "Stock market & index fund investing",
        "Building generational wealth",
        "Estate planning essentials",
        "Creating passive income portfolios"
      ],
      duration: "10 weeks • Self-paced",
      outcome: "FR2P Certified Wealth Builder"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001f3f] to-[#002855]">
      <HeaderNav user={memberData?.member || undefined} />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Badge className="bg-[#FFD700] text-[#001f3f] font-bold mb-4 text-sm px-4 py-1">
            FR2P CERTIFICATION PROGRAM
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-[#FFD700] mb-4">
            Earn Real Credentials
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Get certified in financial literacy, affiliate marketing, and entrepreneurship. 
            These credentials are yours forever - no membership required to purchase.
          </p>
        </div>

        <div className="bg-gradient-to-r from-[#FFD700]/10 to-[#FFA500]/10 border-2 border-[#FFD700]/30 rounded-xl p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <GraduationCap className="h-10 w-10 text-[#FFD700] mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#FFD700]">4</div>
              <div className="text-sm text-white">Certification Programs</div>
            </div>
            <div>
              <BookOpen className="h-10 w-10 text-[#FFD700] mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#FFD700]">Self-Paced</div>
              <div className="text-sm text-white">Learn on your schedule</div>
            </div>
            <div>
              <Award className="h-10 w-10 text-[#FFD700] mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#FFD700]">Certificate</div>
              <div className="text-sm text-white">Digital credential included</div>
            </div>
            <div>
              <DollarSign className="h-10 w-10 text-[#FFD700] mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#FFD700]">One-Time</div>
              <div className="text-sm text-white">No recurring fees</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {certifications.map((cert, index) => (
            <Card key={index} className={`${cert.borderColor} border-2 bg-gradient-to-br ${cert.color}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge className={cert.badgeColor + " font-bold"}>{cert.level}</Badge>
                  <GraduationCap className={`w-6 h-6 ${cert.accentColor}`} />
                </div>
                <CardTitle className={`text-xl ${cert.accentColor}`}>{cert.title}</CardTitle>
                <CardDescription className={cert.textColor}>{cert.duration}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${cert.accentColor}`}>{cert.price}</div>
                  <div className={`text-sm ${cert.textColor}`}>One-time payment</div>
                </div>

                <div className="space-y-2">
                  <div className={`font-semibold text-sm ${cert.accentColor}`}>What You'll Learn:</div>
                  {cert.topics.map((topic, i) => (
                    <div key={i} className={`flex items-start gap-2 text-sm ${cert.textColor}`}>
                      <CheckCircle className={`w-4 h-4 ${cert.accentColor} shrink-0 mt-0.5`} />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>

                <div className={`bg-white/10 rounded-lg p-3 border border-white/20`}>
                  <div className={`text-xs font-semibold ${cert.accentColor} mb-1`}>Upon Completion:</div>
                  <div className={`text-xs ${cert.textColor}`}>
                    <Award className="w-3 h-3 inline mr-1" />
                    {cert.outcome}
                  </div>
                </div>

                <Button
                  className={`w-full font-bold ${cert.btnColor}`}
                  onClick={() => handlePurchase(cert.title + ' Certification', cert.price)}
                >
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Enroll Now ({cert.price})
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* All 4 Bundle */}
        <Card className="border-4 border-[#FFD700] bg-gradient-to-r from-[#001f3f] to-[#002855] shadow-xl shadow-[#FFD700]/20 mb-12">
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-full">
                  <Star className="h-10 w-10 text-[#001f3f]" />
                </div>
                <div>
                  <Badge className="bg-[#FFD700] text-[#001f3f] font-bold mb-1">BEST VALUE - SAVE $97</Badge>
                  <h3 className="text-2xl font-bold text-[#FFD700]">Complete Certification Bundle</h3>
                  <p className="text-white/80 max-w-lg">
                    Get all 4 certifications for one price. Master financial literacy, affiliate marketing, 
                    digital entrepreneurship, and wealth building.
                  </p>
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-white/60 line-through">$496</div>
                <div className="text-4xl font-bold text-[#FFD700]">$399</div>
                <Button
                  className="mt-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#001f3f] hover:from-[#FFC700] hover:to-[#FF9500] font-bold px-8"
                  onClick={() => handlePurchase('Complete Certification Bundle', '$399')}
                >
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Get All 4 Certifications
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Why Certifications */}
        <div className="bg-[#001f3f] border-2 border-[#FFD700]/40 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Why FR2P Certifications?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <CheckCircle className="h-8 w-8 text-[#FFD700] mx-auto mb-2" />
              <h3 className="font-bold text-white mb-1">No Membership Required</h3>
              <p className="text-white text-sm">Anyone can purchase a certification - you don't need to be an FR2P member</p>
            </div>
            <div>
              <DollarSign className="h-8 w-8 text-[#FFD700] mx-auto mb-2" />
              <h3 className="font-bold text-white mb-1">Real Skills, Real Results</h3>
              <p className="text-white text-sm">Practical knowledge you can apply immediately to build wealth</p>
            </div>
            <div>
              <Users className="h-8 w-8 text-[#FFD700] mx-auto mb-2" />
              <h3 className="font-bold text-white mb-1">Earn as an Affiliate</h3>
              <p className="text-white text-sm">Share certifications with your network and earn commissions on every sale</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12 text-white text-sm">
          <p>FR2P Certification Program - Invest in Knowledge, Build Generational Wealth</p>
        </div>
      </div>
    </div>
  );
}