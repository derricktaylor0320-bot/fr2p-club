import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { HeaderNav } from "@/components/ui/header-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Crown, 
  Star, 
  Users, 
  Megaphone, 
  TrendingUp, 
  Gift, 
  Gem, 
  Award,
  CheckCircle,
  Instagram,
  Youtube,
  Twitter,
  Sparkles,
  Rocket,
  Target,
  Heart,
  DollarSign,
  Wallet
} from "lucide-react";
import { SiTiktok } from "react-icons/si";
import ambassadorBanner from "@assets/1766745950285_1766746105135.jpg";

const ambassadorFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
  youtube: z.string().optional(),
  twitter: z.string().optional(),
  followerCount: z.string().min(1, "Please select your follower range"),
  niche: z.string().min(2, "Please describe your content niche"),
  whyJoin: z.string().min(10, "Please tell us why you want to partner with FR2P"),
});

type AmbassadorFormData = z.infer<typeof ambassadorFormSchema>;

const ambassadorTiers = [
  {
    name: "FR2P Ambassador",
    requirement: "100+ followers",
    icon: Megaphone,
    color: "from-blue-500 to-blue-600",
    borderColor: "border-blue-500",
    benefits: [
      "Personal branded referral link",
      "Spotlight on FR2P social media",
      "Ambassador badge for your bio",
      "Access to marketing materials",
      "Community support group"
    ]
  },
  {
    name: "Brand Architect",
    requirement: "1,000+ followers",
    icon: Award,
    color: "from-purple-500 to-purple-600",
    borderColor: "border-purple-500",
    benefits: [
      "Everything in Ambassador tier",
      "Custom FR2P landing page",
      "Early Executive Tier access",
      "Priority feature opportunities",
      "Dedicated partnership manager",
      "Co-branded content creation"
    ]
  },
  {
    name: "Founding Partner",
    requirement: "10,000+ followers",
    icon: Crown,
    color: "from-[#FFD700] to-[#FFA500]",
    borderColor: "border-[#FFD700]",
    textColor: "text-[#001f3f]",
    benefits: [
      "Everything in Brand Architect tier",
      "Revenue share when funding secured",
      "Seat on Influencer Council",
      "Executive Tier membership included",
      "Founding Partner title permanently",
      "Input on platform direction",
      "Exclusive networking events",
      "Featured as platform leader"
    ]
  }
];

const whyPartner = [
  {
    icon: Rocket,
    title: "Ground Floor Opportunity",
    description: "Be the face of a movement before it scales. Your audience will see you as a visionary who discovered this early."
  },
  {
    icon: Target,
    title: "Simple Model, Easy Pitch",
    description: "$35 membership, $5/month per referral. No products, no inventory, no MLM stigma. Clean and straightforward."
  },
  {
    icon: Gem,
    title: "Luxury Brand Alignment",
    description: "FR2P's premium navy & gold aesthetic elevates your brand. Associate with wealth-building and success."
  },
  {
    icon: Heart,
    title: "Serve Your Audience",
    description: "Give your followers a real opportunity to build residual income without selling products or pressuring friends."
  },
  {
    icon: Star,
    title: "Exclusive Status",
    description: "Titles like 'Founding Partner' and 'Brand Architect' give you ownership energy - you're not just promoting, you're leading."
  },
  {
    icon: TrendingUp,
    title: "Future Upside",
    description: "When FR2P secures funding, early partners get priority access to revenue shares, Executive Tier benefits, and more."
  }
];

export default function Ambassador() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<AmbassadorFormData>({
    resolver: zodResolver(ambassadorFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      instagram: "",
      tiktok: "",
      youtube: "",
      twitter: "",
      followerCount: "",
      niche: "",
      whyJoin: "",
    }
  });

  const submitMutation = useMutation({
    mutationFn: async (data: AmbassadorFormData) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Ambassador application submitted:", data);
      return data;
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "Application Submitted!",
        description: "We'll review your application and get back to you within 48 hours.",
      });
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: AmbassadorFormData) => {
    submitMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001f3f] via-[#002855] to-[#001f3f]">
      <HeaderNav />
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Ambassador Banner Image */}
        <div className="flex justify-center mb-10">
          <img 
            src={ambassadorBanner} 
            alt="The FR2P Club - Ambassador/Social Media Influencer" 
            className="max-w-full md:max-w-2xl rounded-lg shadow-2xl shadow-[#FFD700]/20 border-2 border-[#FFD700]/30"
            data-testid="img-ambassador-banner"
          />
        </div>

        <div className="text-center mb-12">
          <Badge className="bg-[#FFD700] text-[#001f3f] font-bold mb-4 text-sm px-4 py-1">
            INFLUENCER PARTNERSHIP PROGRAM
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-[#FFD700] mb-4">
            Become an FR2P Partner
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Join a select group of founding influencers shaping the future of wealth-building. 
            Be a leader, not just a promoter.
          </p>
        </div>

        <div className="bg-gradient-to-r from-[#FFD700]/10 to-[#FFA500]/10 border-2 border-[#FFD700]/30 rounded-xl p-8 mb-12 text-center">
          <Sparkles className="h-12 w-12 text-[#FFD700] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#FFD700] mb-3">Why Partner Now?</h2>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            FR2P is building something special. We're inviting influencers to become <strong>founding voices</strong> - 
            not just promoters. You'll shape the culture, get exclusive perks, and position yourself as a leader 
            when this movement scales.
          </p>
        </div>

        {/* YOU EARN COMMISSIONS TOO Section */}
        <div className="bg-gradient-to-r from-green-600/20 to-emerald-500/20 border-2 border-green-500/50 rounded-xl p-8 mb-12">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-4 bg-green-500/20 rounded-full mb-4">
              <DollarSign className="h-10 w-10 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-green-400 mb-3">You Earn Real Money Too!</h2>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              As an Ambassador, you're not just promoting - <strong className="text-green-400">you're a paying member earning commissions</strong> just like everyone else.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-[#001f3f]/60 rounded-lg p-5 text-center border border-green-500/30">
              <div className="text-4xl font-bold text-green-400 mb-2">Step 1</div>
              <p className="text-white/80 text-sm">
                <strong className="text-white">You join FR2P</strong> as a Standard ($35/mo) or Premium ($50/mo) member and get your unique referral link.
              </p>
            </div>
            <div className="bg-[#001f3f]/60 rounded-lg p-5 text-center border border-green-500/30">
              <div className="text-4xl font-bold text-green-400 mb-2">Step 2</div>
              <p className="text-white/80 text-sm">
                <strong className="text-white">Your followers join</strong> using your referral link. They become your direct referrals.
              </p>
            </div>
            <div className="bg-[#001f3f]/60 rounded-lg p-5 text-center border border-green-500/30">
              <div className="text-4xl font-bold text-green-400 mb-2">Step 3</div>
              <p className="text-white/80 text-sm">
                <strong className="text-white">You earn $5/month</strong> for every direct referral - every month they stay a member!
              </p>
            </div>
          </div>

          <div className="mt-8 bg-[#001f3f]/80 rounded-lg p-6 max-w-3xl mx-auto border border-[#FFD700]/30">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Wallet className="h-6 w-6 text-[#FFD700]" />
              <h3 className="text-xl font-bold text-[#FFD700]">Real Income Example</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-center">
              <div className="bg-[#002855] rounded-lg p-4">
                <p className="text-white/70 text-sm mb-1">If you get 100 followers to join:</p>
                <p className="text-3xl font-bold text-green-400">$500<span className="text-lg text-white/70">/month</span></p>
              </div>
              <div className="bg-[#002855] rounded-lg p-4">
                <p className="text-white/70 text-sm mb-1">If you get 500 followers to join:</p>
                <p className="text-3xl font-bold text-green-400">$2,500<span className="text-lg text-white/70">/month</span></p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gradient-to-r from-[#FFD700]/10 to-[#FFA500]/10 rounded-lg border border-[#FFD700]/30">
              <p className="text-center text-sm">
                <span className="text-[#FFD700] font-bold">FOUNDING MEMBER BONUS:</span>
                <span className="text-white/80"> If you're in the first 500 members, you earn </span>
                <span className="text-[#FFD700] font-bold">$16-$22/month</span>
                <span className="text-white/80"> per referral instead of $5!</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#FFD700] text-center mb-8">Partnership Tiers</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {ambassadorTiers.map((tier, index) => {
              const Icon = tier.icon;
              return (
                <Card 
                  key={tier.name} 
                  className={`bg-[#001f3f]/80 border-2 ${tier.borderColor} relative overflow-hidden`}
                  data-testid={`card-tier-${index}`}
                >
                  {tier.name === "Founding Partner" && (
                    <div className="absolute top-0 right-0 bg-[#FFD700] text-[#001f3f] text-xs font-bold px-3 py-1 rounded-bl-lg">
                      MOST EXCLUSIVE
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <div className={`p-4 bg-gradient-to-br ${tier.color} rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-3`}>
                      <Icon className={`h-8 w-8 ${tier.textColor || 'text-white'}`} />
                    </div>
                    <CardTitle className="text-xl text-[#FFD700]">{tier.name}</CardTitle>
                    <CardDescription className="text-white/70">{tier.requirement}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {tier.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                          <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#FFD700] text-center mb-8">Why Influencers Love FR2P</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyPartner.map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={item.title} 
                  className="bg-[#001f3f]/50 border border-[#FFD700]/20 rounded-xl p-6"
                  data-testid={`card-why-${index}`}
                >
                  <Icon className="h-8 w-8 text-[#FFD700] mb-3" />
                  <h3 className="text-lg font-bold text-[#FFD700] mb-2">{item.title}</h3>
                  <p className="text-white/70 text-sm">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-[#001f3f]/80 border-2 border-[#FFD700]/30 rounded-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-[#FFD700] text-center mb-3">The Simple Pitch for Your Audience</h2>
          <p className="text-white/70 text-center mb-6">Here's exactly what you tell your followers:</p>
          
          <div className="bg-[#002855] border border-[#FFD700]/20 rounded-lg p-6 max-w-3xl mx-auto">
            <p className="text-white/90 text-lg italic leading-relaxed">
              "I found this exclusive membership community called The FR2P Club. It's about building wealth together 
              through a simple system - no selling products, no inventory, just $35/month membership and you earn 
              $5/month for every person you refer. It's clean, simple, and actually helps people build real residual income. 
              I'm partnering with them because I believe in what they're building. Check it out through my link."
            </p>
          </div>
        </div>

        {submitted ? (
          <Card className="bg-gradient-to-r from-green-600/20 to-green-500/20 border-2 border-green-500 max-w-2xl mx-auto">
            <CardContent className="pt-8 pb-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-400 mb-3">Application Received!</h3>
              <p className="text-white/80 mb-4">
                Thank you for your interest in partnering with The FR2P Club. 
                We'll review your application and reach out within 48 hours.
              </p>
              <p className="text-white/60 text-sm">
                In the meantime, follow us on social media to stay updated on partnership opportunities.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-[#001f3f]/80 border-2 border-[#FFD700] max-w-2xl mx-auto" data-testid="card-application-form">
            <CardHeader className="text-center">
              <div className="p-4 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-3">
                <Users className="h-8 w-8 text-[#001f3f]" />
              </div>
              <CardTitle className="text-2xl text-[#FFD700]">Apply to Partner</CardTitle>
              <CardDescription className="text-white/70">
                Tell us about yourself and your audience. We review every application personally.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-white/90">Full Name *</Label>
                    <Input 
                      id="fullName"
                      {...form.register("fullName")}
                      placeholder="Your name"
                      className="bg-[#002855] border-[#FFD700]/30 text-white placeholder:text-white/50"
                      data-testid="input-fullName"
                    />
                    {form.formState.errors.fullName && (
                      <p className="text-red-400 text-xs">{form.formState.errors.fullName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white/90">Email *</Label>
                    <Input 
                      id="email"
                      type="email"
                      {...form.register("email")}
                      placeholder="you@email.com"
                      className="bg-[#002855] border-[#FFD700]/30 text-white placeholder:text-white/50"
                      data-testid="input-email"
                    />
                    {form.formState.errors.email && (
                      <p className="text-red-400 text-xs">{form.formState.errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white/90">Phone (Optional)</Label>
                  <Input 
                    id="phone"
                    {...form.register("phone")}
                    placeholder="(555) 123-4567"
                    className="bg-[#002855] border-[#FFD700]/30 text-white placeholder:text-white/50"
                    data-testid="input-phone"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-white/90">Social Media Handles</Label>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <Instagram className="h-5 w-5 text-pink-400" />
                      <Input 
                        {...form.register("instagram")}
                        placeholder="@username"
                        className="bg-[#002855] border-[#FFD700]/30 text-white placeholder:text-white/50"
                        data-testid="input-instagram"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <SiTiktok className="h-5 w-5 text-white" />
                      <Input 
                        {...form.register("tiktok")}
                        placeholder="@username"
                        className="bg-[#002855] border-[#FFD700]/30 text-white placeholder:text-white/50"
                        data-testid="input-tiktok"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Youtube className="h-5 w-5 text-red-500" />
                      <Input 
                        {...form.register("youtube")}
                        placeholder="Channel name"
                        className="bg-[#002855] border-[#FFD700]/30 text-white placeholder:text-white/50"
                        data-testid="input-youtube"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Twitter className="h-5 w-5 text-blue-400" />
                      <Input 
                        {...form.register("twitter")}
                        placeholder="@username"
                        className="bg-[#002855] border-[#FFD700]/30 text-white placeholder:text-white/50"
                        data-testid="input-twitter"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="followerCount" className="text-white/90">Total Follower Count (across all platforms) *</Label>
                  <select 
                    id="followerCount"
                    {...form.register("followerCount")}
                    className="w-full bg-[#002855] border border-[#FFD700]/30 text-white rounded-md px-3 py-2"
                    data-testid="select-followerCount"
                  >
                    <option value="">Select range...</option>
                    <option value="100-500">100 - 500</option>
                    <option value="500-1000">500 - 1,000</option>
                    <option value="1000-5000">1,000 - 5,000</option>
                    <option value="5000-10000">5,000 - 10,000</option>
                    <option value="10000-50000">10,000 - 50,000</option>
                    <option value="50000-100000">50,000 - 100,000</option>
                    <option value="100000+">100,000+</option>
                  </select>
                  {form.formState.errors.followerCount && (
                    <p className="text-red-400 text-xs">{form.formState.errors.followerCount.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="niche" className="text-white/90">What's your content niche? *</Label>
                  <Input 
                    id="niche"
                    {...form.register("niche")}
                    placeholder="e.g., Finance, Lifestyle, Entrepreneurship, Motivation..."
                    className="bg-[#002855] border-[#FFD700]/30 text-white placeholder:text-white/50"
                    data-testid="input-niche"
                  />
                  {form.formState.errors.niche && (
                    <p className="text-red-400 text-xs">{form.formState.errors.niche.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whyJoin" className="text-white/90">Why do you want to partner with FR2P? *</Label>
                  <Textarea 
                    id="whyJoin"
                    {...form.register("whyJoin")}
                    placeholder="Tell us what drew you to FR2P and how you'd share it with your audience..."
                    className="bg-[#002855] border-[#FFD700]/30 text-white placeholder:text-white/50 min-h-[100px]"
                    data-testid="textarea-whyJoin"
                  />
                  {form.formState.errors.whyJoin && (
                    <p className="text-red-400 text-xs">{form.formState.errors.whyJoin.message}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#001f3f] hover:from-[#FFC700] hover:to-[#FF9500] font-bold py-6 text-lg"
                  disabled={submitMutation.isPending}
                  data-testid="button-submit-application"
                >
                  {submitMutation.isPending ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Rocket className="w-5 h-5 mr-2" />
                      Submit Partnership Application
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="text-center mt-12 text-white/60 text-sm">
          <p>Questions? Contact us at <span className="text-[#FFD700]">partnerships@fr2pclub.com</span></p>
        </div>
      </div>
    </div>
  );
}
