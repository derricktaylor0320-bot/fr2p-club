import { HeaderNav } from "@/components/ui/header-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Crown, 
  Building2, 
  ShoppingBag, 
  Shield, 
  Mic2, 
  ExternalLink,
  Star,
  Users,
  Sparkles,
  Globe,
  Rocket
} from "lucide-react";

const empireBusinesses = [
  {
    name: "The FR2P Club",
    tagline: "Financial Roadway 2 Prosperity",
    description: "Affiliate marketing and wealth-building membership community. Earn a $5 commission for every successfully referred member with our FTC-compliant single-tier commission structure.",
    icon: Crown,
    color: "from-[#FFD700] to-[#FFA500]",
    borderColor: "border-[#FFD700]",
    url: "/dashboard",
    isInternal: true,
    highlight: "FLAGSHIP",
    features: ["$35-$50/month membership", "Founding Member bonuses", "Executive Investor Tier"]
  },
  {
    name: "Khomplete Khemistri Apparel & Accessories",
    tagline: "Premium Streetwear & Lifestyle",
    description: "Premium streetwear and accessories for the modern entrepreneur. Shop exclusive designs that represent success and ambition.",
    icon: ShoppingBag,
    color: "from-purple-500 to-purple-600",
    borderColor: "border-purple-500",
    url: "https://khomplete-khemistri-apparel.up.railway.app/",
    isInternal: false,
    highlight: "SHOP",
    features: ["Exclusive apparel", "Premium accessories", "Member discounts"]
  },
  {
    name: "GuardConnect DMV",
    tagline: "Security Solutions",
    description: "Professional security company management and networking platform. Connect with security professionals across the DMV area.",
    icon: Shield,
    color: "from-blue-500 to-blue-600",
    borderColor: "border-blue-500",
    url: "",
    isInternal: false,
    isComingSoon: true,
    highlight: "SECURITY",
    features: ["Security networking", "Professional connections", "DMV coverage"]
  },
  {
    name: "Studio Business",
    tagline: "Creative Production",
    description: "Full-service creative studio for content creation, podcasting, and media production. Bring your vision to life.",
    icon: Mic2,
    color: "from-pink-500 to-pink-600",
    borderColor: "border-pink-500",
    url: "",
    isInternal: false,
    isComingSoon: true,
    highlight: "CREATIVE",
    features: ["Content creation", "Podcast production", "Media services"]
  },
  {
    name: "Pocket Booster",
    tagline: "Micro-Loans for Entrepreneurs",
    description: "Community-backed micro-loans from $100 to $1,000 for Consolidatus Empire members. No hard credit pull, fast decisions. Get the capital boost you need to launch, restock, or grow.",
    icon: Rocket,
    color: "from-emerald-500 to-emerald-600",
    borderColor: "border-emerald-500",
    url: "https://khomplete-khemistri-apparel.up.railway.app/pocket-booster",
    isInternal: false,
    isComingSoon: true,
    highlight: "FINTECH",
    features: ["$100–$1,000 micro-loans", "FR2P members get priority", "Build credit history"]
  }
];

const memberPerks = [
  {
    icon: Star,
    title: "Cross-Platform Discounts",
    description: "FR2P members receive exclusive discounts across all Consolidators Empire businesses."
  },
  {
    icon: Users,
    title: "One Community",
    description: "Access to the entire Consolidators Empire network - one login, multiple opportunities."
  },
  {
    icon: Globe,
    title: "Unified Vision",
    description: "Each business feeds into our collective mission of wealth-building and community empowerment."
  }
];

export default function Empire() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001f3f] via-[#002855] to-[#001f3f]">
      <HeaderNav />
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Badge className="bg-[#FFD700] text-[#001f3f] font-bold mb-4 text-sm px-4 py-1">
            THE CONSOLIDATUS EMPIRE
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-[#FFD700] mb-4">
            One Vision. Multiple Ventures.
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            The FR2P Club is part of the larger Consolidatus Empire - a collection of businesses 
            united by a mission to empower, elevate, and create opportunities for our community.
          </p>
        </div>

        <div className="bg-gradient-to-r from-[#FFD700]/10 to-[#FFA500]/10 border-2 border-[#FFD700]/30 rounded-xl p-8 mb-12 text-center">
          <Building2 className="h-12 w-12 text-[#FFD700] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#FFD700] mb-3">Founded by Derrick Taylor</h2>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            The Consolidatus Empire brings together apparel, security, creative production, and 
            wealth-building under one umbrella. As an FR2P member, you're not just joining a club — 
            you're becoming part of a movement with access to an entire ecosystem.
          </p>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#FFD700] text-center mb-8">Our Businesses</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {empireBusinesses.map((business, index) => {
              const Icon = business.icon;
              return (
                <Card 
                  key={business.name} 
                  className={`bg-[#001f3f]/80 border-2 ${business.borderColor} relative overflow-hidden hover:shadow-lg hover:shadow-${business.borderColor}/20 transition-all`}
                  data-testid={`card-business-${index}`}
                >
                  <div className={`absolute top-0 right-0 bg-gradient-to-r ${business.color} text-white text-xs font-bold px-3 py-1 rounded-bl-lg`}>
                    {business.highlight}
                  </div>
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 bg-gradient-to-br ${business.color} rounded-xl flex items-center justify-center`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl text-[#FFD700]">{business.name}</CardTitle>
                        <CardDescription className="text-white/70">{business.tagline}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/80 text-sm mb-4">{business.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {business.features.map((feature, i) => (
                        <Badge key={i} variant="outline" className="border-white/30 text-white/70 text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    {business.isInternal ? (
                      <a href={business.url}>
                        <Button className={`w-full bg-gradient-to-r ${business.color} text-white hover:opacity-90`} data-testid={`button-visit-${index}`}>
                          Go to Dashboard
                        </Button>
                      </a>
                    ) : (business as any).isComingSoon ? (
                      <Button className={`w-full bg-gradient-to-r ${business.color} text-white opacity-70 cursor-not-allowed`} disabled data-testid={`button-visit-${index}`}>
                        Coming Soon
                      </Button>
                    ) : (
                      <a href={business.url} target="_blank" rel="noopener noreferrer">
                        <Button className={`w-full bg-gradient-to-r ${business.color} text-white hover:opacity-90`} data-testid={`button-visit-${index}`}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit Site
                        </Button>
                      </a>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#FFD700] text-center mb-8">Member Perks Across the Empire</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {memberPerks.map((perk, index) => {
              const Icon = perk.icon;
              return (
                <div 
                  key={perk.title} 
                  className="bg-[#001f3f]/50 border border-[#FFD700]/20 rounded-xl p-6 text-center"
                  data-testid={`card-perk-${index}`}
                >
                  <div className="inline-flex items-center justify-center p-4 bg-[#FFD700]/10 rounded-full mb-4">
                    <Icon className="h-8 w-8 text-[#FFD700]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#FFD700] mb-2">{perk.title}</h3>
                  <p className="text-white/70 text-sm">{perk.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#001f3f] to-[#002855] border-2 border-[#FFD700] rounded-xl p-8 text-center">
          <Sparkles className="h-12 w-12 text-[#FFD700] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#FFD700] mb-3">Join the Empire</h2>
          <p className="text-white/80 mb-6 max-w-2xl mx-auto">
            Start with The FR2P Club and unlock access to the entire Consolidatus Empire ecosystem. 
            One membership opens doors to multiple opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register">
              <Button className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#001f3f] hover:from-[#FFC700] hover:to-[#FF9500] font-bold px-8" data-testid="button-join-now">
                <Crown className="h-5 w-5 mr-2" />
                Join FR2P Now
              </Button>
            </a>
            <a href="https://khomplete-khemistri-apparel.up.railway.app/" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700]/10 px-8" data-testid="button-shop-apparel">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Shop Apparel
              </Button>
            </a>
          </div>
        </div>

        <div className="text-center mt-12 text-white/60 text-sm">
          <p>The Consolidatus Empire - Building wealth, one business at a time.</p>
        </div>
      </div>
    </div>
  );
}
