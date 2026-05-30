import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { setLoggedInMember } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, DollarSign, Shield, Gift, CheckCircle2, Star, Search, X, Phone } from "lucide-react";
import type { Member } from "@shared/schema";

const registrationSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "ZIP code is required"),
  membershipPlan: z.enum(["monthly", "annual"]),
  membershipLevel: z.enum(["standard", "premium"]),
});

type RegistrationForm = z.infer<typeof registrationSchema>;

type ReferrerSearchResult = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  profilePicture: string | null;
  rank: string;
  isFoundingMember: boolean;
  memberNumber: number | null;
};

export default function Join() {
  const { toast } = useToast();
  const [, params] = useRoute("/join/:referrerId");
  const urlReferrerId = params?.referrerId;
  const [isProcessing, setIsProcessing] = useState(false);
  const [joinMode, setJoinMode] = useState<"free" | "paid">("free");
  const [freeSuccess, setFreeSuccess] = useState<{ name: string; memberId: string } | null>(null);

  // Founding 50 status
  const { data: f50Status } = useQuery<{ claimed: number; spotsLeft: number; total: number; isFull: boolean }>({
    queryKey: ["/api/founding-fifty-status"],
    refetchInterval: 30000,
  });

  // Manual referrer search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ReferrerSearchResult[]>([]);
  const [selectedReferrer, setSelectedReferrer] = useState<ReferrerSearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Final referrer ID (from URL or manually selected)
  const referrerId = urlReferrerId || selectedReferrer?.id;

  // Fetch referrer info from URL
  const { data: referrerData } = useQuery<{ member: Member }>({
    queryKey: ["/api/member", urlReferrerId],
    enabled: !!urlReferrerId,
  });

  // Set selected referrer from URL data
  useEffect(() => {
    if (referrerData?.member && !selectedReferrer) {
      setSelectedReferrer({
        id: referrerData.member.id,
        username: referrerData.member.username,
        firstName: referrerData.member.firstName,
        lastName: referrerData.member.lastName,
        email: referrerData.member.email,
        phoneNumber: referrerData.member.phoneNumber,
        profilePicture: referrerData.member.profilePicture,
        rank: referrerData.member.rank,
        isFoundingMember: referrerData.member.isFoundingMember,
        memberNumber: referrerData.member.memberNumber,
      });
    }
  }, [referrerData, selectedReferrer]);

  // Search for referrers
  useEffect(() => {
    const searchReferrers = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(`/api/search-referrers?query=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        setSearchResults(data.members || []);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchReferrers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const form = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      membershipPlan: "monthly",
      membershipLevel: "standard",
    },
  });

  const selectedPlan = form.watch("membershipPlan");
  const selectedLevel = form.watch("membershipLevel");

  const onSubmit = async (data: RegistrationForm) => {
    setIsProcessing(true);
    
    try {
      // Calculate amount based on membership level AND billing plan
      // Standard: $35/month or $350/year
      // Premium: $50/month or $500/year
      let amount: number;
      let productName: string;
      
      if (data.membershipLevel === "premium") {
        amount = data.membershipPlan === "annual" ? 500 : 50;
        productName = data.membershipPlan === "annual" 
          ? "The FR2P Club Premium Annual Membership" 
          : "The FR2P Club Premium Monthly Membership";
      } else {
        amount = data.membershipPlan === "annual" ? 350 : 35;
        productName = data.membershipPlan === "annual" 
          ? "The FR2P Club Standard Annual Membership" 
          : "The FR2P Club Standard Monthly Membership";
      }
      
      const paymentResponse = await apiRequest("POST", "/api/create-membership-session", {
        amount,
        productName,
        membershipPlan: data.membershipPlan,
        membershipLevel: data.membershipLevel,
        registrationData: {
          ...data,
          referrerId: referrerId || null,
        }
      });
      
      const paymentData = await paymentResponse.json();
      
      if (paymentData.url) {
        toast({
          title: "Redirecting to Payment",
          description: "You'll be redirected to complete your payment securely...",
        });
        
        // Redirect to Stripe checkout
        setTimeout(() => {
          window.location.href = paymentData.url;
        }, 1000);
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error: any) {
      toast({
        title: "Registration Error",
        description: error.message || "Failed to process registration. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const onSubmitFree = async (data: RegistrationForm) => {
    setIsProcessing(true);
    try {
      const response = await apiRequest("POST", "/api/auth/register-founding50", {
        ...data,
        referrerId: referrerId || null,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Registration failed.");
      setFreeSuccess({ name: result.member.firstName, memberId: result.member.id });
      setLoggedInMember(result.member.id, result.member.username, result.member.firstName || result.member.username);
      toast({
        title: "🎉 Welcome to The FR2P Club!",
        description: `Your free Founding Member spot is claimed, ${result.member.firstName}! Check your email.`,
      });
    } catch (error: any) {
      toast({
        title: "Registration Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (freeSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#001f3f] to-[#003366] flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center space-y-6">
          <div className="text-8xl">🎉</div>
          <h1 className="text-4xl font-bold text-[#FFD700]">You're In, {freeSuccess.name}!</h1>
          <p className="text-white/90 text-lg">
            Your <span className="text-[#FFD700] font-bold">Founding Member</span> spot is secured.
            You have full access to The FR2P Club for the next <strong className="text-[#FFD700]">30 days — completely free</strong>.
          </p>
          <div className="bg-[#FFD700]/10 border border-[#FFD700] rounded-xl p-6 space-y-3 text-left">
            <p className="text-white font-semibold text-center mb-2">What happens next:</p>
            <div className="flex items-start gap-3 text-white/80">
              <span className="text-[#FFD700] font-bold mt-0.5">1.</span>
              <span>Check your email — your welcome message includes your referral link and member number.</span>
            </div>
            <div className="flex items-start gap-3 text-white/80">
              <span className="text-[#FFD700] font-bold mt-0.5">2.</span>
              <span>Log in and explore your dashboard — the Prospect Manager, Marketplace, and all tools are ready.</span>
            </div>
            <div className="flex items-start gap-3 text-white/80">
              <span className="text-[#FFD700] font-bold mt-0.5">3.</span>
              <span>Start building your 5. Every referral you bring in is locked in permanently — they earn you $5/month forever.</span>
            </div>
            <div className="flex items-start gap-3 text-white/80">
              <span className="text-[#FFD700] font-bold mt-0.5">4.</span>
              <span>Before day 30, choose your paid plan ($35/month Standard or $50/month Premium) to keep your account and referral earnings active.</span>
            </div>
          </div>
          <a href="/">
            <button className="w-full bg-[#FFD700] text-[#001f3f] font-bold py-4 rounded-xl text-lg hover:bg-yellow-300 transition-colors">
              Go to My Dashboard →
            </button>
          </a>
          <p className="text-white/50 text-sm">Member ID: {freeSuccess.memberId}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-blue-900 text-white py-6 shadow-lg">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src="/fr2p-logo.jpeg" 
              alt="The FR2P Club" 
              className="w-16 h-16 rounded-full border-4 border-yellow-400 shadow-lg"
            />
            <div>
              <h1 className="text-3xl font-bold">The FR2P Club</h1>
              <p className="text-blue-200">Financial Roadway 2 Prosperity</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* ── FOUNDING 50 BANNER ── */}
        {f50Status && !f50Status.isFull && (
          <div className="mb-8 relative overflow-hidden rounded-2xl border-2 border-[#FFD700] shadow-2xl"
               style={{ background: "linear-gradient(135deg, #001f3f 0%, #002855 50%, #001f3f 100%)" }}>
            {/* Decorative gold shimmer */}
            <div className="absolute inset-0 opacity-10"
                 style={{ background: "radial-gradient(ellipse at 50% 0%, #FFD700 0%, transparent 70%)" }} />
            <div className="relative z-10 p-6 sm:p-8">
              <div className="flex flex-col lg:flex-row items-center gap-6">
                {/* Left: Badge + text */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 bg-[#FFD700]/20 border border-[#FFD700]/60 rounded-full px-4 py-1.5 mb-4">
                    <span className="text-lg">👑</span>
                    <span className="text-[#FFD700] font-bold text-sm tracking-wider uppercase">Founding Member Offer</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                    First <span className="text-[#FFD700]">50</span> Members Join
                    <span className="text-[#FFD700]"> FREE</span>
                  </h2>
                  <p className="text-white/80 text-base mb-1">
                    30 days of full access — no credit card required. Experience everything before you pay a dime.
                  </p>
                  <p className="text-white/60 text-sm">After 30 days: $35/month Standard or $50/month Premium. Cancel or convert anytime.</p>
                </div>

                {/* Center: Live counter */}
                <div className="flex flex-col items-center gap-2 px-6 py-4 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-xl min-w-[160px]">
                  <span className="text-white/70 text-xs uppercase tracking-widest font-semibold">Spots Remaining</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-[#FFD700]">{f50Status.spotsLeft}</span>
                    <span className="text-white/50 text-lg">/ 50</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#FFD700] to-yellow-300 rounded-full transition-all duration-500"
                      style={{ width: `${(f50Status.claimed / 50) * 100}%` }}
                    />
                  </div>
                  <span className="text-white/50 text-xs">{f50Status.claimed} claimed</span>
                  {f50Status.spotsLeft <= 10 && (
                    <span className="text-red-400 text-xs font-bold animate-pulse">⚡ Almost gone!</span>
                  )}
                </div>

                {/* Right: CTA */}
                <div className="flex flex-col gap-3 min-w-[180px] text-center">
                  <button
                    onClick={() => { setJoinMode("free"); document.getElementById("join-form")?.scrollIntoView({ behavior: "smooth" }); }}
                    className="bg-[#FFD700] hover:bg-yellow-300 text-[#001f3f] font-black py-4 px-8 rounded-xl text-lg shadow-lg transition-all hover:scale-105"
                  >
                    Claim My Free Spot
                  </button>
                  <button
                    onClick={() => { setJoinMode("paid"); document.getElementById("join-form")?.scrollIntoView({ behavior: "smooth" }); }}
                    className="text-white/50 text-sm underline hover:text-white/80 transition-colors"
                  >
                    Skip — Join with paid membership
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All spots claimed message */}
        {f50Status?.isFull && (
          <div className="mb-8 bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 rounded-xl p-6 text-center">
            <div className="text-4xl mb-2">🏆</div>
            <h3 className="text-[#FFD700] font-bold text-xl mb-1">All 50 Founding Member Spots Have Been Claimed!</h3>
            <p className="text-white/70">The free trial period is closed. Join now with a paid membership to start building your income.</p>
          </div>
        )}

        {/* Exclusive Invite-Only Club Message */}
        <Card className="mb-8 bg-gradient-to-br from-[#001f3f] to-[#003366] border-2 border-[#FFD700]">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-[#FFD700]">Welcome to an Exclusive Opportunity</h2>
              <p className="text-white/90 text-lg">
                The FR2P Club is an <span className="font-bold text-[#FFD700]">invite-only community</span> built on the power of duplication, not mass recruiting.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="bg-[#FFD700]/10 border border-[#FFD700] rounded-lg p-4">
                  <div className="text-3xl mb-2">👥</div>
                  <div className="font-bold text-[#FFD700] mb-1">You Get YOUR 5</div>
                  <p className="text-white/80 text-sm">Just 5 people who share your vision</p>
                </div>
                <div className="bg-[#FFD700]/10 border border-[#FFD700] rounded-lg p-4">
                  <div className="text-3xl mb-2">🎓</div>
                  <div className="font-bold text-[#FFD700] mb-1">Teach Them</div>
                  <p className="text-white/80 text-sm">Show them how to find their 5</p>
                </div>
                <div className="bg-[#FFD700]/10 border border-[#FFD700] rounded-lg p-4">
                  <div className="text-3xl mb-2">🌟</div>
                  <div className="font-bold text-[#FFD700] mb-1">Watch It Grow</div>
                  <p className="text-white/80 text-sm">5 → 25 → 125 → 625 → 3,125</p>
                </div>
              </div>
              <p className="text-white/90 mt-4">
                This is about <span className="font-bold text-[#FFD700]">leadership, mentorship, and duplication</span> - not being a super recruiter.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Why Join Link + 7-Referral Badge */}
        <div className="mb-8 grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-green-800 to-green-900 border-2 border-green-400 rounded-xl p-5 text-white text-center">
            <div className="text-4xl font-bold text-green-400 mb-1">7 Referrals</div>
            <div className="text-xl font-semibold mb-2">= Your Membership is Essentially FREE</div>
            <p className="text-white/80 text-sm mb-3">
              7 referrals × $5/month = $35/month back to you. Your commission matches your membership cost — net $0, forever.
            </p>
            <div className="bg-white/10 rounded-lg p-3 text-xs text-white/70">
              No time limit to reach 7. Commission is locked in permanently on each referral's first payment.
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#001f3f] to-[#002952] border-2 border-[#FFD700] rounded-xl p-5 text-white text-center flex flex-col items-center justify-center gap-4">
            <div>
              <div className="text-[#FFD700] font-bold text-xl mb-2">Want the Full Breakdown?</div>
              <p className="text-white/80 text-sm">See income projections, side-by-side comparisons, FAQ, and more — everything a leader needs to share this opportunity.</p>
            </div>
            <a href="/why-join" target="_blank" className="block">
              <button className="bg-[#FFD700] text-[#001f3f] font-bold px-6 py-3 rounded-lg hover:bg-yellow-300 transition-colors">
                See Why Join FR2P →
              </button>
            </a>
            <div className="bg-white/5 border border-white/20 rounded-lg p-3 w-full">
              <div className="text-xs text-white/60">90-Day Grace Period: If life happens, your account is safe for 90 days. Log back in and pick up where you left off.</div>
            </div>
          </div>
        </div>

        {/* Sizzle Call CTA */}
        <Card className="mb-8 bg-gradient-to-r from-yellow-400 to-yellow-500 border-0 shadow-xl">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white rounded-full p-4">
                  <Phone className="w-8 h-8 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Learn About FR2P in 3 Minutes
                  </h3>
                  <p className="text-gray-700">
                    Listen to our sizzle call before you join
                  </p>
                </div>
              </div>
              <a
                href="tel:6672681022"
                className="inline-flex items-center gap-2 bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors shadow-lg"
                data-testid="button-sizzle-call"
              >
                <Phone className="w-5 h-5" />
                Call (667) 268-1022
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Selected Referrer Display */}
        {selectedReferrer && (
          <Card className="mb-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <UserPlus className="w-6 h-6" />
                    You've Been Invited!
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    {selectedReferrer.firstName} {selectedReferrer.lastName} has invited you to join The FR2P Club
                  </CardDescription>
                </div>
                {!urlReferrerId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedReferrer(null);
                      setSearchQuery("");
                    }}
                    className="text-white hover:bg-blue-800"
                    data-testid="button-change-referrer"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Change
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                {selectedReferrer.profilePicture ? (
                  <img 
                    src={selectedReferrer.profilePicture} 
                    alt={`${selectedReferrer.firstName} ${selectedReferrer.lastName}`}
                    className="w-16 h-16 rounded-full border-4 border-yellow-400"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-blue-800 flex items-center justify-center text-2xl font-bold border-4 border-yellow-400">
                    {selectedReferrer.firstName[0]}{selectedReferrer.lastName[0]}
                  </div>
                )}
                <div>
                  <div className="text-lg font-semibold">
                    {selectedReferrer.firstName} {selectedReferrer.lastName}
                  </div>
                  <div className="text-blue-100 text-sm">
                    {selectedReferrer.rank || "Member"}
                  </div>
                  {selectedReferrer.isFoundingMember && (
                    <Badge className="mt-1 bg-yellow-400 text-yellow-900">
                      <Star className="w-3 h-3 mr-1" />
                      FOUNDING MEMBER
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Manual Referrer Search */}
        {!selectedReferrer && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-6 h-6" />
                Who Referred You?
              </CardTitle>
              <CardDescription>
                Search for the person who invited you by their name, email, or phone number
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-referrer"
                />
              </div>

              {/* Search Results */}
              {searchQuery.length >= 2 && (
                <div className="space-y-2">
                  {isSearching && (
                    <div className="text-center py-4 text-muted-foreground">
                      Searching...
                    </div>
                  )}
                  
                  {!isSearching && searchResults.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      No members found. Try a different search term.
                    </div>
                  )}
                  
                  {!isSearching && searchResults.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Select your referrer:</p>
                      {searchResults.map((result) => (
                        <Card
                          key={result.id}
                          className="cursor-pointer hover:border-blue-500 transition-colors"
                          onClick={() => {
                            setSelectedReferrer(result);
                            setSearchQuery("");
                            setSearchResults([]);
                            toast({
                              title: "Referrer Selected",
                              description: `${result.firstName} ${result.lastName} will receive credit for your registration.`,
                            });
                          }}
                          data-testid={`referrer-result-${result.id}`}
                        >
                          <CardContent className="pt-4">
                            <div className="flex items-center gap-3">
                              {result.profilePicture ? (
                                <img 
                                  src={result.profilePicture} 
                                  alt={`${result.firstName} ${result.lastName}`}
                                  className="w-12 h-12 rounded-full"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-lg font-bold text-blue-600">
                                  {result.firstName[0]}{result.lastName[0]}
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="font-semibold">
                                  {result.firstName} {result.lastName}
                                  {result.isFoundingMember && (
                                    <Badge className="ml-2 bg-yellow-400 text-yellow-900 text-xs">
                                      <Star className="w-3 h-3 mr-1" />
                                      FOUNDING
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {result.email}
                                </div>
                                {result.phoneNumber && (
                                  <div className="text-sm text-muted-foreground">
                                    {result.phoneNumber}
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {searchQuery.length < 2 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    💡 <strong>Tip:</strong> Enter at least 2 characters to search for your referrer. 
                    You can search by their first name, last name, email address, or phone number.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Benefits */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0">
              <CardHeader>
                <CardTitle className="text-white">What You Get</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>5-tier system: Bronze → Silver → Gold → Platinum → Diamond</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>$5/month per referral (flat rate) + tier achievement bonuses</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>5-level affiliate network system</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>Financial Asset Savings (unlocks after 1 year)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>Professional marketing materials</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>Real-time community chat & support</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>Store with affiliate products</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>Mobile app for easy recruiting</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>Unified backoffice</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>Earnings tracking</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>Commission multiplier</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>Optional charity donation</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>MP3 player</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>Community chat with other members</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-yellow-50 border-yellow-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-900">
                  <Gift className="w-5 h-5" />
                  Membership Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="pb-2 border-b border-yellow-200">
                  <div className="font-semibold text-blue-800">STANDARD</div>
                  <div className="text-yellow-800">$35/mo or $350/year (save $70)</div>
                </div>
                <div>
                  <div className="font-semibold text-amber-700">PREMIUM</div>
                  <div className="text-yellow-800">$50/mo or $500/year (save $100)</div>
                  <div className="text-xs text-amber-600 mt-1">+ KonnectMD Healthcare Access</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle & Right Columns - Registration Form */}
          <div className="md:col-span-2" id="join-form">

            {/* Mode Toggle */}
            {f50Status && !f50Status.isFull && (
              <div className="mb-4 flex rounded-xl overflow-hidden border-2 border-[#FFD700] shadow-lg">
                <button
                  type="button"
                  onClick={() => setJoinMode("free")}
                  className={`flex-1 py-4 px-4 font-bold text-sm transition-all ${
                    joinMode === "free"
                      ? "bg-[#FFD700] text-[#001f3f]"
                      : "bg-[#001f3f] text-white/70 hover:text-white"
                  }`}
                >
                  👑 Claim Free Founding Spot ({f50Status.spotsLeft} left)
                </button>
                <button
                  type="button"
                  onClick={() => setJoinMode("paid")}
                  className={`flex-1 py-4 px-4 font-bold text-sm transition-all ${
                    joinMode === "paid"
                      ? "bg-[#FFD700] text-[#001f3f]"
                      : "bg-[#001f3f] text-white/70 hover:text-white"
                  }`}
                >
                  💳 Join with Paid Membership
                </button>
              </div>
            )}

            {/* Free mode notice */}
            {joinMode === "free" && f50Status && !f50Status.isFull && (
              <div className="mb-4 bg-green-50 border border-green-300 rounded-xl p-4 text-center">
                <p className="text-green-800 font-semibold text-sm">
                  ✅ You're claiming a <strong>FREE Founding Member spot</strong> — no credit card needed.
                  30 days full access, then $35/month to continue.
                </p>
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-6 h-6" />
                  {joinMode === "free" && f50Status && !f50Status.isFull ? "Claim Your Free Founding Spot" : "Join The FR2P Club Today"}
                </CardTitle>
                <CardDescription>
                  Complete your registration to start building your financial prosperity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(
                      joinMode === "free" && f50Status && !f50Status.isFull ? onSubmitFree : onSubmit
                    )}
                    className="space-y-6"
                  >
                    {/* Step 1: Choose Membership Level */}
                    <div className="space-y-3">
                      <FormLabel className="text-lg font-semibold">Step 1: Choose Your Membership Level</FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Standard Membership */}
                        <Card 
                          className={`cursor-pointer transition-all ${
                            selectedLevel === "standard" 
                              ? "border-2 border-blue-600 bg-blue-50 ring-2 ring-blue-200" 
                              : "border hover:border-blue-300"
                          }`}
                          onClick={() => form.setValue("membershipLevel", "standard")}
                          data-testid="card-standard-membership"
                        >
                          <CardContent className="pt-6">
                            <div className="text-center mb-4">
                              <Badge className="bg-blue-600 mb-2">STANDARD</Badge>
                              <div className="text-3xl font-bold text-blue-600">
                                {selectedPlan === "annual" ? "$350" : "$35"}
                                <span className="text-lg font-normal text-muted-foreground">
                                  /{selectedPlan === "annual" ? "year" : "month"}
                                </span>
                              </div>
                              {selectedPlan === "annual" && (
                                <div className="text-sm text-green-600 font-semibold">Save $70/year!</div>
                              )}
                            </div>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                <span>$5/month per referral (flat rate, unlimited)</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                <span>Financial education resources</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                <span>Community chat & support</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                <span>Digital resources & tools</span>
                              </li>
                              <li className="flex items-center gap-2 text-muted-foreground">
                                <X className="w-4 h-4" />
                                <span>Healthcare access not included</span>
                              </li>
                            </ul>
                          </CardContent>
                        </Card>

                        {/* Premium Membership */}
                        <Card 
                          className={`cursor-pointer transition-all relative ${
                            selectedLevel === "premium" 
                              ? "border-2 border-amber-500 bg-amber-50 ring-2 ring-amber-200" 
                              : "border hover:border-amber-300"
                          }`}
                          onClick={() => form.setValue("membershipLevel", "premium")}
                          data-testid="card-premium-membership"
                        >
                          <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-4">
                            BEST VALUE
                          </Badge>
                          <CardContent className="pt-6">
                            <div className="text-center mb-4">
                              <Badge className="bg-amber-500 mb-2">PREMIUM</Badge>
                              <div className="text-3xl font-bold text-amber-600">
                                {selectedPlan === "annual" ? "$500" : "$50"}
                                <span className="text-lg font-normal text-muted-foreground">
                                  /{selectedPlan === "annual" ? "year" : "month"}
                                </span>
                              </div>
                              {selectedPlan === "annual" && (
                                <div className="text-sm text-green-600 font-semibold">Save $100/year!</div>
                              )}
                            </div>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                                <span>Everything in Standard</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                                <span className="font-semibold text-amber-700">+ Access to KonnectMD Marketplace</span>
                              </li>
                              <li className="flex items-center gap-2 pl-6 text-xs text-muted-foreground">
                                <span>• Healthcare plans ($59.99–$149.99/mo)</span>
                              </li>
                              <li className="flex items-center gap-2 pl-6 text-xs text-muted-foreground">
                                <span>• Lifestyle & travel portal</span>
                              </li>
                              <li className="flex items-center gap-2 pl-6 text-xs text-muted-foreground">
                                <span>• Pet care & medical bill advocate</span>
                              </li>
                              <li className="flex items-center gap-2 pl-6 text-xs text-muted-foreground">
                                <span>• GLP-1 weight loss program</span>
                              </li>
                            </ul>
                            <div className="mt-3 p-2 bg-amber-100 rounded text-xs text-amber-800 text-center">
                              Choose your KonnectMD plan — pay them directly at official prices
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    {/* Step 2: Choose Billing Cycle */}
                    <div className="space-y-3">
                      <FormLabel className="text-lg font-semibold">Step 2: Choose Your Billing Cycle</FormLabel>
                      <div className="grid grid-cols-2 gap-4">
                        <Card 
                          className={`cursor-pointer transition-all ${
                            selectedPlan === "monthly" 
                              ? "border-2 border-blue-600 bg-blue-50" 
                              : "border hover:border-blue-300"
                          }`}
                          onClick={() => form.setValue("membershipPlan", "monthly")}
                          data-testid="card-monthly-billing"
                        >
                          <CardContent className="pt-6 text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {selectedLevel === "premium" ? "$50" : "$35"}/month
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">Monthly Billing</div>
                            <div className="text-xs text-muted-foreground mt-2">
                              {selectedLevel === "premium" ? "$600" : "$420"}/year total
                            </div>
                          </CardContent>
                        </Card>
                        <Card 
                          className={`cursor-pointer transition-all ${
                            selectedPlan === "annual" 
                              ? "border-2 border-green-600 bg-green-50" 
                              : "border hover:border-green-300"
                          }`}
                          onClick={() => form.setValue("membershipPlan", "annual")}
                          data-testid="card-annual-billing"
                        >
                          <CardContent className="pt-6 text-center relative">
                            <Badge className="absolute -top-2 right-4 bg-green-600">
                              Save {selectedLevel === "premium" ? "$100" : "$70"}!
                            </Badge>
                            <div className="text-2xl font-bold text-green-600">
                              {selectedLevel === "premium" ? "$500" : "$350"}/year
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">Annual Billing</div>
                            <div className="text-xs text-green-600 font-semibold mt-2">17% savings</div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    {/* Account Information */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Account Information</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input placeholder="johndoe123" {...field} data-testid="input-username" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="john@example.com" {...field} data-testid="input-email" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Min. 8 characters" {...field} data-testid="input-password" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Personal Information</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John" {...field} data-testid="input-firstname" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Doe" {...field} data-testid="input-lastname" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="(555) 123-4567" {...field} data-testid="input-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Address Information */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Address</h3>
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Main St" {...field} data-testid="input-address" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="New York" {...field} data-testid="input-city" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <FormControl>
                                <Input placeholder="NY" {...field} data-testid="input-state" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ZIP Code</FormLabel>
                              <FormControl>
                                <Input placeholder="10001" {...field} data-testid="input-zipcode" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="space-y-4 pt-4">
                      {joinMode === "free" && f50Status && !f50Status.isFull ? (
                        <Button
                          type="submit"
                          className="w-full text-lg py-6 font-black"
                          style={{ background: "#FFD700", color: "#001f3f" }}
                          disabled={isProcessing}
                          data-testid="button-complete-registration"
                        >
                          {isProcessing ? "Claiming Your Spot..." : "👑 Claim My Free Founding Spot — No Card Needed"}
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                          disabled={isProcessing}
                          data-testid="button-complete-registration"
                        >
                          <DollarSign className="w-5 h-5 mr-2" />
                          {isProcessing ? "Processing..." : (() => {
                            if (selectedLevel === "premium") {
                              return `Complete Registration — Pay ${selectedPlan === "annual" ? "$500/year" : "$50/month"}`;
                            }
                            return `Complete Registration — Pay ${selectedPlan === "annual" ? "$350/year" : "$35/month"}`;
                          })()}
                        </Button>
                      )}
                      {!referrerId && (
                        <p className="text-sm text-muted-foreground text-center">
                          No referral link? No problem — you'll be sponsored directly by The FR2P Club.
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground text-center">
                        {joinMode === "free" && f50Status && !f50Status.isFull
                          ? "No credit card required. By claiming this spot you agree to The FR2P Club's Terms & Conditions. You'll be prompted to subscribe after your free 30 days."
                          : "By clicking Complete Registration, you agree to The FR2P Club's terms and will be redirected to secure Stripe payment processing."
                        }
                      </p>
                      <p className="text-xs text-center text-muted-foreground pt-2 border-t border-gray-100">
                        Not ready to join yet?{" "}
                        <a href="/advertise" className="text-blue-600 hover:underline font-medium">Advertise your business without a membership →</a>
                      </p>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
