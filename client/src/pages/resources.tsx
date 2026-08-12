import { useState } from "react";
import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "use-debounce";
import type { MemberResponse, CharitySearchResponse, CharitySearchResult, CharityPreferenceResponse, InsertMetalBusinessCardOrder } from "@shared/schema";
import { insertMetalBusinessCardOrderSchema } from "@shared/schema";
import { HeaderNav } from "@/components/ui/header-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  BookOpen, 
  Users, 
  Download, 
  Video, 
  MessageSquare, 
  TrendingUp,
  FileText,
  Link,
  Mail,
  Calendar,
  Award,
  Briefcase,
  CreditCard,
  Package,
  QrCode,
  Star,
  ShoppingCart,
  Upload
} from "lucide-react";

import { getLoggedInMemberId } from "@/lib/auth";
const DEMO_USER_ID = getLoggedInMemberId();

// Metal Business Card Order Form Component
function MetalBusinessCardOrderForm({ memberId }: { memberId: string }) {
  const { toast } = useToast();
  const [selectedQuantity, setSelectedQuantity] = useState<100 | 500 | 1000>(500);
  
  // Pricing structure based on quantity (FR2P price vs Amazon cost)
  const PRICING = {
    100: { fr2pPrice: 6000, amazonCost: 3000 }, // $60 vs $30
    500: { fr2pPrice: 12000, amazonCost: 6000 }, // $120 vs $60
    1000: { fr2pPrice: 20000, amazonCost: 10000 }, // $200 vs $100
  };

  const form = useForm<InsertMetalBusinessCardOrder>({
    resolver: zodResolver(insertMetalBusinessCardOrderSchema),
    defaultValues: {
      memberId,
      quantity: 500,
      totalAmount: PRICING[500].fr2pPrice,
      amazonCost: PRICING[500].amazonCost,
      status: "pending",
      paymentStatus: "pending",
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      qrCodeUrl: "",
      customText: "",
      shippingName: "",
      shippingAddress1: "",
      shippingAddress2: "",
      shippingCity: "",
      shippingState: "",
      shippingZip: "",
    },
  });

  const orderMutation = useMutation({
    mutationFn: async (orderData: InsertMetalBusinessCardOrder) => {
      const response = await apiRequest("POST", "/api/metal-business-cards/orders", orderData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Order Submitted Successfully!",
        description: "Your metal business card order has been received. We'll process it through Amazon and email you tracking details.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Order Failed",
        description: "There was an error submitting your order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleQuantityChange = (quantity: 100 | 500 | 1000) => {
    setSelectedQuantity(quantity);
    form.setValue("quantity", quantity);
    form.setValue("totalAmount", PRICING[quantity].fr2pPrice);
    form.setValue("amazonCost", PRICING[quantity].amazonCost);
  };

  const onSubmit = (data: InsertMetalBusinessCardOrder) => {
    orderMutation.mutate(data);
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Order Your Metal Business Cards
        </DialogTitle>
        <DialogDescription>
          Custom dual-sided metal cards with FR2P logo + your personal QR code. Fulfilled through Amazon Prime.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Quantity Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">1. Choose Your Quantity</h3>
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      value={selectedQuantity.toString()}
                      onValueChange={(value) => handleQuantityChange(parseInt(value) as 100 | 500 | 1000)}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                      {[
                        { quantity: 100, label: "Starter Pack", price: "$60", amazonPrice: "$30" },
                        { quantity: 500, label: "Most Popular", price: "$120", amazonPrice: "$60" },
                        { quantity: 1000, label: "Business Pack", price: "$200", amazonPrice: "$100" }
                      ].map(({ quantity, label, price, amazonPrice }) => (
                        <div key={quantity} className="flex items-center space-x-2">
                          <RadioGroupItem value={quantity.toString()} id={`qty-${quantity}`} />
                          <label htmlFor={`qty-${quantity}`} className="flex-1 cursor-pointer">
                            <Card className={`p-4 ${selectedQuantity === quantity ? 'border-gray-500 bg-gray-50' : 'hover:bg-gray-50'}`}>
                              <div className="text-center">
                                <div className="font-bold">{quantity} Cards</div>
                                <div className="text-xs text-gray-600">{label}</div>
                                <div className="font-bold text-lg mt-2">{price}</div>
                                <div className="text-xs text-gray-500">vs {amazonPrice} Amazon direct</div>
                              </div>
                            </Card>
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">2. Your Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Smith" {...field} data-testid="input-customer-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" type="email" {...field} data-testid="input-customer-email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="customerPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="(555) 123-4567" {...field} data-testid="input-customer-phone" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          {/* Card Customization */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">3. Card Customization</h3>
            <FormField
              control={form.control}
              name="qrCodeUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>QR Code File URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://your-qr-code-file-url.com/qr.png" 
                      {...field}
                      value={field.value || ""}
                      data-testid="input-qr-code-url" 
                    />
                  </FormControl>
                  <FormDescription>
                    Create your QR code using Canva or any QR generator, then provide the URL link to your QR code file
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Text for Back of Card (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="e.g., Your title, contact info, or tagline" 
                      {...field}
                      value={field.value || ""}
                      data-testid="textarea-custom-text"
                    />
                  </FormControl>
                  <FormDescription>
                    Any additional text you'd like on the back of your card alongside your QR code
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          {/* Shipping Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">4. Shipping Address</h3>
            <FormField
              control={form.control}
              name="shippingName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ship To Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Smith" {...field} data-testid="input-shipping-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shippingAddress1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 1</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main Street" {...field} data-testid="input-shipping-address1" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shippingAddress2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 2 (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Apt 4B" {...field} value={field.value || ""} data-testid="input-shipping-address2" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="shippingCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="New York" {...field} data-testid="input-shipping-city" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shippingState"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="NY" {...field} data-testid="input-shipping-state" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shippingZip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ZIP Code</FormLabel>
                    <FormControl>
                      <Input placeholder="10001" {...field} data-testid="input-shipping-zip" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{selectedQuantity} Metal Business Cards</span>
                <span className="font-semibold">${(PRICING[selectedQuantity].fr2pPrice / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Amazon Direct Cost</span>
                <span>${(PRICING[selectedQuantity].amazonCost / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-green-600 font-medium">
                <span>FR2P Markup & Processing</span>
                <span>${((PRICING[selectedQuantity].fr2pPrice - PRICING[selectedQuantity].amazonCost) / 100).toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${(PRICING[selectedQuantity].fr2pPrice / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button 
              type="submit" 
              className="bg-gray-600 hover:bg-gray-700 w-full sm:w-auto"
              disabled={orderMutation.isPending}
              data-testid="button-submit-order"
            >
              {orderMutation.isPending ? (
                "Processing Order..."
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Submit Order - ${(PRICING[selectedQuantity].fr2pPrice / 100).toFixed(2)}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}

export default function Resources() {
  const { data: memberData } = useQuery<MemberResponse>({
    queryKey: ["/api/member", DEMO_USER_ID],
  });

  const [activeTab, setActiveTab] = useState("training");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [charityDialogOpen, setCharityDialogOpen] = useState(false);
  const [pendingCharity, setPendingCharity] = useState<CharitySearchResult | null>(null);
  
  const [debouncedQuery] = useDebounce(searchQuery, 400);
  const { toast } = useToast();
  
  // Get current charity preference
  const { data: charityPreferenceData } = useQuery<CharityPreferenceResponse>({
    queryKey: ["/api/member", DEMO_USER_ID, "charity"],
  });
  
  // Search charities with infinite scroll
  const {
    data: searchData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isSearchLoading,
  } = useInfiniteQuery({
    queryKey: ["/api/charities/search", { q: debouncedQuery, letter: selectedLetter, state: selectedState }],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams({
        page: pageParam.toString(),
        pageSize: "20",
      });
      
      if (debouncedQuery) params.append("q", debouncedQuery);
      if (selectedLetter) params.append("letter", selectedLetter);
      if (selectedState) params.append("state", selectedState);
      
      const response = await fetch(`/api/charities/search?${params}`);
      if (!response.ok) throw new Error("Failed to search charities");
      return response.json() as Promise<CharitySearchResponse>;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    enabled: !!(debouncedQuery || selectedLetter || selectedState),
  });
  
  // Charity selection mutation
  const charitySelectionMutation = useMutation({
    mutationFn: async (charity: CharitySearchResult) => {
      const response = await apiRequest("POST", `/api/member/${DEMO_USER_ID}/charity`, {
        ein: charity.ein,
        name: charity.name,
        city: charity.city,
        state: charity.state,
        website: charity.website,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/member", DEMO_USER_ID, "charity"] });
      setCharityDialogOpen(false);
      setPendingCharity(null);
      toast({
        title: "Charity Selected!",
        description: `You've chosen ${pendingCharity?.name}. 5% of your monthly earnings will be donated to support their mission.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save charity selection. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const handleCharityClick = (charity: CharitySearchResult) => {
    setPendingCharity(charity);
    setCharityDialogOpen(true);
  };
  
  const confirmCharitySelection = () => {
    if (pendingCharity) {
      charitySelectionMutation.mutate(pendingCharity);
    }
  };
  
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const allCharities = searchData?.pages.flatMap(page => page.organizations) || [];
  
  // Featured charities for quick access
  const featuredCharities = [
    { name: "American Red Cross", search: "american red cross" },
    { name: "Feeding America", search: "feeding america" },
    { name: "United Way", search: "united way" },
    { name: "Habitat for Humanity", search: "habitat for humanity" },
    { name: "Operation HOPE", search: "operation hope" },
    { name: "Jump$tart Coalition", search: "jumpstart coalition" },
  ];
  
  const handleFeaturedCharityClick = (searchTerm: string) => {
    setSearchQuery(searchTerm);
    setSelectedLetter("");
    setSelectedState("");
  };

  return (
    <div className="min-h-screen bg-secondary">
      <HeaderNav user={memberData?.member || undefined} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">The FR2P Club Resources</h1>
          <p className="text-foreground/80 mt-2">
            <strong>Exclusive club members only:</strong> Access premium training materials, business tools, and marketing resources
          </p>
        </div>

        {/* The Power of 5 - Brotherhood Philosophy */}
        <Card className="mb-8 bg-gradient-to-br from-[#001f3f] to-[#003366] border-2 border-[#FFD700]">
          <CardHeader>
            <CardTitle className="text-3xl text-[#FFD700] text-center flex items-center justify-center gap-3">
              <Users className="h-8 w-8" />
              The Power of 5: Our Brotherhood Philosophy
              <Users className="h-8 w-8" />
            </CardTitle>
            <CardDescription className="text-white/90 text-center text-lg mt-2">
              The Foundation of The FR2P Club's Movement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Brotherhood Values */}
              <div className="bg-[#001f3f]/50 border border-[#FFD700]/30 rounded-lg p-6">
                <h3 className="text-2xl font-bold text-[#FFD700] mb-4 text-center">
                  What the Number 5 Represents
                </h3>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-[#FFD700]/10 border border-[#FFD700] rounded-lg p-4 text-center">
                    <div className="text-4xl mb-2">🤝</div>
                    <div className="font-bold text-[#FFD700]">Brotherhood & Harmony</div>
                    <p className="text-white/80 text-sm mt-2">
                      Five years ago, five bandmates decided to be brothers for life - in music and business
                    </p>
                  </div>
                  <div className="bg-[#FFD700]/10 border border-[#FFD700] rounded-lg p-4 text-center">
                    <div className="text-4xl mb-2">❤️</div>
                    <div className="font-bold text-[#FFD700]">Family & Peace</div>
                    <p className="text-white/80 text-sm mt-2">
                      We committed to supporting each other's dreams and building together
                    </p>
                  </div>
                  <div className="bg-[#FFD700]/10 border border-[#FFD700] rounded-lg p-4 text-center">
                    <div className="text-4xl mb-2">💼</div>
                    <div className="font-bold text-[#FFD700]">Equality & Entrepreneurship</div>
                    <p className="text-white/80 text-sm mt-2">
                      Every member has equal opportunity to build wealth through duplication
                    </p>
                  </div>
                </div>
                
                <div className="bg-[#001f3f] border-2 border-[#FFD700] rounded-lg p-6">
                  <p className="text-white/90 text-lg text-center leading-relaxed">
                    The number 5 is sacred to The FR2P Club. It represents the bond formed five years ago 
                    when five R&B singers committed to brotherhood, entrepreneurship, and mutual success. 
                    That same spirit of <span className="text-[#FFD700] font-bold">unity, equality, and shared prosperity</span> flows 
                    through every member who joins our exclusive invite-only community.
                  </p>
                </div>
              </div>

              {/* Get 5, Teach 5 Model */}
              <div className="bg-[#001f3f]/50 border border-[#FFD700]/30 rounded-lg p-6">
                <h3 className="text-2xl font-bold text-[#FFD700] mb-4 text-center">
                  The "Get 5, Teach 5" Duplication Model
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-[#FFD700]/20 border border-[#FFD700] rounded-lg p-4 text-center">
                    <div className="text-4xl mb-2">👥</div>
                    <div className="font-bold text-[#FFD700] mb-2">Step 1: Get YOUR 5</div>
                    <p className="text-white/80 text-sm">
                      Find 5 people who share your vision for financial freedom. That's it - just 5.
                    </p>
                  </div>
                  <div className="bg-[#FFD700]/20 border border-[#FFD700] rounded-lg p-4 text-center">
                    <div className="text-4xl mb-2">🎓</div>
                    <div className="font-bold text-[#FFD700] mb-2">Step 2: Teach Your 5</div>
                    <p className="text-white/80 text-sm">
                      Train them to duplicate: find their 5 people and teach the same process.
                    </p>
                  </div>
                  <div className="bg-[#FFD700]/20 border border-[#FFD700] rounded-lg p-4 text-center">
                    <div className="text-4xl mb-2">🌟</div>
                    <div className="font-bold text-[#FFD700] mb-2">Step 3: Watch It Grow</div>
                    <p className="text-white/80 text-sm">
                      Through duplication, 5 becomes 25, then 125, then 625, then 3,125 - your complete network.
                    </p>
                  </div>
                </div>

                <div className="mt-6 text-center p-4 bg-[#FFD700]/10 rounded-lg">
                  <p className="text-xl font-bold text-[#FFD700] mb-2">
                    This Is NOT Mass Recruiting
                  </p>
                  <p className="text-white/90 text-lg">
                    The FR2P Club is an <span className="font-bold text-[#FFD700]">exclusive, invite-only community</span>. 
                    Success comes through <span className="font-bold text-[#FFD700]">leadership, mentorship, and duplication</span> - 
                    not being a "super recruiter". You only need to find YOUR 5 and teach them to do the same.
                  </p>
                </div>
              </div>

              <div className="text-center text-white/70 italic text-sm border-t border-[#FFD700]/30 pt-4">
                "Five years ago, we formed a brotherhood. Today, we invite you to join a movement built on those same values of 
                brotherhood, harmony, family, peace, equality, and entrepreneurship."
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Founding Members Program - Bootstrap Special */}
        <div className="mb-8 bg-gradient-to-br from-gold-400 to-gold-600 border-4 border-navy-900 rounded-lg p-6 shadow-xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-navy-900 flex items-center justify-center gap-2">
              🏆 Founding Members Program - LIMITED TIME
            </h2>
            <p className="text-navy-800 font-semibold mt-2">
              First 500 Members Get 2x Rewards - Join the Inner Circle!
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-navy-900 p-4 rounded-lg border-2 border-navy-900">
              <h3 className="font-bold text-gold-400 mb-3 flex items-center gap-2">
                💰 Enhanced Commissions
              </h3>
              <div className="space-y-2 text-sm text-gold-200">
                <div className="flex justify-between">
                  <span>Regular Members:</span>
                  <span className="font-medium">$25 per referral</span>
                </div>
                <div className="flex justify-between text-navy-900 font-bold bg-gold-400 px-2 py-1 rounded">
                  <span>Founding Members:</span>
                  <span>$50 per referral (2x)</span>
                </div>
                <div className="flex justify-between">
                  <span>Regular Spillover:</span>
                  <span className="font-medium">5% commission</span>
                </div>
                <div className="flex justify-between text-navy-900 font-bold bg-gold-400 px-2 py-1 rounded">
                  <span>Founding Spillover:</span>
                  <span>10% commission (2x)</span>
                </div>
              </div>
            </div>
            
            <div className="bg-navy-900 p-4 rounded-lg border-2 border-navy-900">
              <h3 className="font-bold text-gold-400 mb-3 flex items-center gap-2">
                🎯 Double Tier Bonuses
              </h3>
              <div className="space-y-2 text-sm text-gold-200">
                <div className="flex justify-between">
                  <span>Gold Bonus:</span>
                  <span className="font-bold">$100 (vs $50)</span>
                </div>
                <div className="flex justify-between">
                  <span>Platinum Achievement Bonus:</span>
                  <span className="font-bold">$200 (vs $100)</span>
                </div>
                <div className="flex justify-between">
                  <span>Platinum Bonus:</span>
                  <span className="font-bold">$400 (vs $200)</span>
                </div>
                <div className="flex justify-between">
                  <span>Diamond Achievement Bonus:</span>
                  <span className="font-bold">$1,000 (vs $500)</span>
                </div>
                <div className="flex justify-between">
                  <span>Diamond Bonus:</span>
                  <span className="font-bold">$2,000 (vs $1,000)</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-navy-900 font-medium mb-3">
              ⚡ Why This Program? We're bootstrapping our club without outside capital - 
              your early support helps us grow together!
            </p>
            <div className="inline-flex items-center gap-2 bg-navy-900 px-4 py-2 rounded-full border-2 border-navy-900">
              <span className="text-sm font-bold text-gold-400">Members #1-100: Maximum Benefits</span>
              <span className="text-xs bg-gold-400 text-navy-900 px-2 py-1 rounded-full font-bold">ULTRA ELITE</span>
            </div>
            <br />
            <div className="inline-flex items-center gap-2 bg-navy-900 px-4 py-2 rounded-full border-2 border-navy-900 mt-2">
              <span className="text-sm font-bold text-gold-400">Members #101-500: Enhanced Benefits</span>
              <span className="text-xs bg-gold-400 text-navy-900 px-2 py-1 rounded-full font-bold">FOUNDING</span>
            </div>
            
            {/* Activity-Based Spillover Notice */}
            <div className="mt-6 p-4 bg-navy-900 border-2 border-navy-900 rounded-lg">
              <h4 className="font-bold text-gold-400 mb-2">💸 FR2P Spillover Structure: Where Effort Meets Reward</h4>
              <div className="text-sm">
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div className="bg-gold-400 p-3 rounded border-2 border-gold-400">
                    <div className="font-semibold text-navy-900">Inactive Members</div>
                    <div className="text-xs text-navy-800">No monthly engagement</div>
                    <div className="font-bold text-navy-900 mt-1">
                      {memberData?.member?.isFoundingMember ? '4%' : '2%'} Baseline Spillover
                    </div>
                  </div>
                  <div className="bg-navy-900 p-3 rounded border-2 border-gold-400">
                    <div className="font-semibold text-gold-400">Active Members</div>
                    <div className="text-xs text-gold-200">Monthly logins, referrals, or purchases</div>
                    <div className="font-bold text-gold-400 mt-1">
                      {memberData?.member?.isFoundingMember ? '10%' : '5%'} Enhanced Spillover
                    </div>
                  </div>
                </div>
                <div className="text-center mt-3 text-gold-300 font-medium">
                  "At FR2P, everyone benefits—but the active builders earn more. Your effort fuels your reward."
                </div>
              </div>
            </div>
          </div>
        </div>


        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="training" data-testid="tab-training">Training & Education</TabsTrigger>
            <TabsTrigger value="tools" data-testid="tab-tools">Business Tools</TabsTrigger>
            <TabsTrigger value="marketing" data-testid="tab-marketing">Marketing Resources</TabsTrigger>
            <TabsTrigger value="fr2p-store" data-testid="tab-fr2p-store">FR2P Store</TabsTrigger>
            <TabsTrigger value="community" data-testid="tab-community">Community & Support</TabsTrigger>
          </TabsList>

          <TabsContent value="training" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card data-testid="card-webinars">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Video className="h-5 w-5 text-blue-600" />
                    <CardTitle>Weekly Training Webinars</CardTitle>
                  </div>
                  <CardDescription>
                    Live interactive sessions covering affiliate marketing strategies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Advanced selling techniques</li>
                    <li>• Non-profit sector outreach</li>
                    <li>• Building long-term relationships</li>
                    <li>• Overcoming objections</li>
                  </ul>
                  <Button className="w-full mt-4" data-testid="button-join-webinar"
                    onClick={() => window.open('mailto:support@fr2pclub.com?subject=FR2P%20Webinar%20Registration&body=I%20would%20like%20to%20join%20the%20next%20FR2P%20training%20session.', '_blank')}>
                    Join Next Session
                  </Button>
                </CardContent>
              </Card>

              <Card data-testid="card-video-library">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-green-600" />
                    <CardTitle>Video Training Library</CardTitle>
                  </div>
                  <CardDescription>
                    On-demand access to comprehensive training modules
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Badge variant="secondary">25+ Hours of Content</Badge>
                    <Badge variant="secondary">HD Quality</Badge>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600 mt-4">
                    <li>• Getting started guide</li>
                    <li>• Prospecting strategies</li>
                    <li>• Closing techniques</li>
                    <li>• Team building methods</li>
                  </ul>
                  <Button className="w-full mt-4" data-testid="button-access-library"
                    onClick={() => window.open('/fr2p-presentation.html', '_blank')}>
                    Access Library
                  </Button>
                </CardContent>
              </Card>

              <Card data-testid="card-certification">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-purple-600" />
                    <CardTitle>Certification Program</CardTitle>
                  </div>
                  <CardDescription>
                    Earn recognized certifications in affiliate marketing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Digital marketing fundamentals</li>
                    <li>• Non-profit business development</li>
                    <li>• Leadership and team management</li>
                    <li>• Professional certification badge</li>
                  </ul>
                  <Button className="w-full mt-4" data-testid="button-start-certification"
                    onClick={() => window.location.href = '/certifications'}>
                    Start Certification
                  </Button>
                </CardContent>
              </Card>

              <Card data-testid="card-coursiv-ai" className="border-2 border-yellow-400 shadow-lg">
                <CardHeader className="p-0">
                  <img
                    src="/coursiv-ai-certificate.jpg"
                    alt="Coursiv AI Master Certificate"
                    className="w-full rounded-t-lg object-cover"
                    style={{ maxHeight: "280px" }}
                  />
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    <h3 className="font-bold text-lg text-navy-900" style={{ color: "#001f3f" }}>AI Master Certificate</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Kick-start your AI journey with Coursiv! A 28-day AI Certificate Program — just 15 minutes a day to level up your skills.
                  </p>
                  <ul className="space-y-1 text-sm text-gray-600 mb-4">
                    <li>• Week 1: You're unstoppable</li>
                    <li>• Week 2: Ahead of almost everyone you know</li>
                    <li>• Week 4: You have an AI certificate</li>
                  </ul>
                  <a
                    href="https://coursiv.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                    data-testid="button-coursiv-join"
                  >
                    <Button className="w-full" style={{ backgroundColor: "#FFD700", color: "#001f3f", fontWeight: "bold" }}>
                      Start Now at coursiv.io
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            {/* Mobile Sharing Tools */}
            <Card className="mb-8 border-blue-200" data-testid="card-mobile-sharing">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="text-2xl">📱</div>
                  <div>
                    <CardTitle className="text-blue-900">Mobile Sharing Made Easy</CardTitle>
                    <CardDescription>
                      Share your exclusive The FR2P Club invitation link instantly from any device
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-3">📲 Quick Share Options</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button variant="outline" className="text-blue-600 border-blue-300 text-sm" data-testid="button-share-text"
                      onClick={() => window.open(`sms:?body=I want to share this with you — join The FR2P Club and start building permanent reoccurring income: https://fr2pclub.com/join/${memberData?.member?.id || 'demo'}`, '_blank')}>
                      💬 Text Message
                    </Button>
                    <Button variant="outline" className="text-green-600 border-green-300 text-sm" data-testid="button-share-whatsapp"
                      onClick={() => window.open(`https://wa.me/?text=Join%20The%20FR2P%20Club%20and%20build%20your%20potential%20earnings%20with%20a%20%245%2Fmonth%20per%20referral%20reward%20structure!%20https%3A%2F%2Ffr2pclub.com%2Fjoin%2F${memberData?.member?.id || 'demo'}`, '_blank')}>
                      📱 WhatsApp
                    </Button>
                    <Button variant="outline" className="text-blue-600 border-blue-300 text-sm" data-testid="button-share-email"
                      onClick={() => window.open(`mailto:?subject=Join%20The%20FR2P%20Club%20-%20Financial%20Roadway%20to%20Prosperity&body=I%20want%20to%20share%20this%20opportunity%20with%20you.%20The%20FR2P%20Club%20offers%20%245%2Fmonth%20permanent%20reoccurring%20income%20per%20referral.%0A%0AJoin%20here%3A%20https%3A%2F%2Ffr2pclub.com%2Fjoin%2F${memberData?.member?.id || 'demo'}`, '_blank')}>
                      📧 Email
                    </Button>
                    <Button variant="outline" className="text-purple-600 border-purple-300 text-sm" data-testid="button-share-social"
                      onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Ffr2pclub.com%2Fjoin%2F${memberData?.member?.id || 'demo'}`, '_blank')}>
                      🌐 Social Media
                    </Button>
                  </div>
                  <div className="mt-4 p-3 bg-white rounded border border-blue-200">
                    <div className="text-xs text-gray-600 mb-1">Your Personal Club Link:</div>
                    <div className="font-mono text-sm text-blue-700 break-all">
                      https://fr2pclub.com/join/your-id-here
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comprehensive Charity Search */}
            <Card className="mb-8" data-testid="card-charity-selection">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="text-2xl">💝</div>
                  <div>
                    <CardTitle className="text-green-900">Community Impact Giving</CardTitle>
                    <CardDescription>
                      Search and choose from 1.8M+ US 501(c)(3) charities - 5% of your monthly earnings will be donated to support their mission
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Selection */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">
                        Current Selection: 
                        <span className={charityPreferenceData?.preference ? "text-green-600 font-semibold" : "text-gray-500"}>
                          {charityPreferenceData?.preference?.name || "Not Set"}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">5% of monthly earnings automatically donated</div>
                      {charityPreferenceData?.preference && (
                        <div className="text-xs text-green-700 mt-1">
                          EIN: {charityPreferenceData.preference.ein} • 
                          {charityPreferenceData.preference.city && charityPreferenceData.preference.state && 
                            `${charityPreferenceData.preference.city}, ${charityPreferenceData.preference.state}`
                          }
                        </div>
                      )}
                    </div>
                    <Button variant="outline" size="sm" data-testid="button-view-reports"
                      onClick={() => window.location.href = '/network'}>
                      📊 View Impact Reports
                    </Button>
                  </div>
                </div>

                {/* Featured Charities */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800 border-b border-gray-200 pb-1">🌟 Featured Organizations</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {featuredCharities.map((charity, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleFeaturedCharityClick(charity.search)}
                        className="text-left justify-start h-auto p-2 text-xs"
                        data-testid={`button-featured-${charity.name.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {charity.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Search Interface */}
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Input
                        placeholder="Search by charity name (e.g., 'American Red Cross', 'United Way')..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setSelectedLetter("");
                        }}
                        data-testid="input-charity-search"
                      />
                    </div>
                    <Select value={selectedState} onValueChange={(value) => setSelectedState(value)}>
                      <SelectTrigger className="w-32" data-testid="select-state">
                        <SelectValue placeholder="State" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All States</SelectItem>
                        <SelectItem value="CA">California</SelectItem>
                        <SelectItem value="NY">New York</SelectItem>
                        <SelectItem value="TX">Texas</SelectItem>
                        <SelectItem value="FL">Florida</SelectItem>
                        <SelectItem value="IL">Illinois</SelectItem>
                        <SelectItem value="PA">Pennsylvania</SelectItem>
                        <SelectItem value="OH">Ohio</SelectItem>
                        <SelectItem value="GA">Georgia</SelectItem>
                        <SelectItem value="NC">North Carolina</SelectItem>
                        <SelectItem value="MI">Michigan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Alphabetical Filter */}
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-gray-700">Browse A-Z</h5>
                    <div className="flex flex-wrap gap-1">
                      {alphabet.map(letter => (
                        <Button
                          key={letter}
                          variant={selectedLetter === letter ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setSelectedLetter(selectedLetter === letter ? "" : letter);
                            setSearchQuery("");
                          }}
                          className="w-8 h-8 p-0 text-xs"
                          data-testid={`button-letter-${letter.toLowerCase()}`}
                        >
                          {letter}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Search Results */}
                {(debouncedQuery || selectedLetter || selectedState) && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-800">
                        Search Results {searchData?.pages[0]?.total && `(${searchData.pages[0].total.toLocaleString()} organizations)`}
                      </h4>
                      {(debouncedQuery || selectedLetter || selectedState) && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            setSearchQuery("");
                            setSelectedLetter("");
                            setSelectedState("");
                          }}
                          data-testid="button-clear-search"
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                    
                    {isSearchLoading ? (
                      <div className="space-y-2">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="animate-pulse p-3 border rounded-lg">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        ))}
                      </div>
                    ) : allCharities.length > 0 ? (
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {allCharities.map((charity, index) => (
                          <div
                            key={`${charity.ein}-${index}`}
                            className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => handleCharityClick(charity)}
                            data-testid={`charity-result-${index}`}
                          >
                            <div className="font-medium text-gray-900">{charity.name}</div>
                            <div className="text-sm text-gray-600">
                              {charity.city && charity.state && `${charity.city}, ${charity.state}`}
                              {charity.ein && ` • EIN: ${charity.ein}`}
                            </div>
                            {charity.category && (
                              <div className="text-xs text-blue-600 mt-1">{charity.category}</div>
                            )}
                          </div>
                        ))}
                        {hasNextPage && (
                          <Button
                            variant="outline"
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            className="w-full"
                            data-testid="button-load-more"
                          >
                            {isFetchingNextPage ? "Loading..." : "Load More"}
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <div className="text-2xl mb-2">🔍</div>
                        <div>No charities found</div>
                        <div className="text-sm">Try a different search term or browse by letter</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Instructions */}
                {!debouncedQuery && !selectedLetter && !selectedState && (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-3xl mb-3">🔍</div>
                    <div className="font-medium mb-2">Find Your Favorite Charity</div>
                    <div className="text-sm space-y-1">
                      <div>• Search by name (e.g., "American Red Cross")</div>
                      <div>• Browse alphabetically A-Z</div>
                      <div>• Filter by state</div>
                      <div>• Choose from featured organizations</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card data-testid="card-link-generator">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Link className="h-5 w-5 text-blue-600" />
                    <CardTitle>Affiliate Link Generator</CardTitle>
                  </div>
                  <CardDescription>
                    Create and track custom affiliate links with analytics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Custom branded links</li>
                    <li>• Click tracking & analytics</li>
                    <li>• QR code generation</li>
                    <li>• Campaign management</li>
                  </ul>
                  <Button className="w-full mt-4" data-testid="button-generate-links"
                    onClick={() => window.location.href = '/network'}>
                    Generate Links
                  </Button>
                </CardContent>
              </Card>

              <Card data-testid="card-crm-tools">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-green-600" />
                    <CardTitle>CRM & Lead Management</CardTitle>
                  </div>
                  <CardDescription>
                    Manage prospects and track your sales pipeline
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Contact management system</li>
                    <li>• Follow-up reminders</li>
                    <li>• Sales pipeline tracking</li>
                    <li>• Activity logging</li>
                  </ul>
                  <Button className="w-full mt-4" data-testid="button-access-crm"
                    onClick={() => window.location.href = '/prospects'}>
                    Access CRM
                  </Button>
                </CardContent>
              </Card>

              <Card data-testid="card-email-automation">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-5 w-5 text-purple-600" />
                    <CardTitle>Email Marketing Suite</CardTitle>
                  </div>
                  <CardDescription>
                    Automated email sequences and templates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Pre-written email templates</li>
                    <li>• Automated follow-up sequences</li>
                    <li>• Non-profit specific content</li>
                    <li>• Open and click tracking</li>
                  </ul>
                  <Button className="w-full mt-4" data-testid="button-setup-emails"
                    onClick={() => window.open('mailto:support@fr2pclub.com?subject=Email%20Marketing%20Setup%20Request', '_blank')}>
                    Setup Emails
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="marketing" className="space-y-6">
            {/* Outreach Presentation Kits */}
            <div className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🎓 Outreach Presentation Kits</h3>
              <p className="text-gray-700 mb-4">
                Professional presentation decks designed for colleges, churches, nonprofits, and community organizations.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <div className="text-green-600 font-semibold mb-2 text-center">🏫 Schools & Colleges</div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>✓ Financial literacy outcomes</div>
                    <div>✓ Career readiness programs</div>
                    <div>✓ Optional fundraising component</div>
                    <div>✓ FERPA/COPPA compliant</div>
                    <div>✓ 50-100 student pilots</div>
                    <div>✓ Revenue-share model</div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <div className="text-blue-600 font-semibold mb-2 text-center">⛪ Churches & Communities</div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>✓ Prosperity & stewardship focus</div>
                    <div>✓ 10-20% giving to church programs</div>
                    <div>✓ Volunteer training included</div>
                    <div>✓ Men's/women's/youth groups</div>
                    <div>✓ Testimony & success pipeline</div>
                    <div>✓ Community impact tracking</div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-purple-200">
                  <div className="text-purple-600 font-semibold mb-2 text-center">🎓 Universities</div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>✓ Entrepreneurship/finance clubs</div>
                    <div>✓ Credit-bearing workshop option</div>
                    <div>✓ Research partnership potential</div>
                    <div>✓ Alumni fundraising tie-ins</div>
                    <div>✓ IRB compliance support</div>
                    <div>✓ Campus-wide implementation</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                <Button className="bg-green-600 hover:bg-green-700 text-white flex-1" data-testid="button-download-school-kit"
                  onClick={() => window.open('/fr2p-presentation.html', '_blank')}>
                  <Download className="w-4 h-4 mr-2" />
                  Download School Kit PDF
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white flex-1" data-testid="button-download-church-kit"
                  onClick={() => window.open('/fr2p-presentation.html', '_blank')}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Church Kit PDF
                </Button>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white flex-1" data-testid="button-download-university-kit"
                  onClick={() => window.open('/fr2p-presentation.html', '_blank')}>
                  <Download className="w-4 h-4 mr-2" />
                  Download University Kit PDF
                </Button>
              </div>
              <div className="flex gap-3 mt-3 justify-center">
                <Button variant="outline" data-testid="button-schedule-demo"
                  onClick={() => window.open('mailto:support@fr2pclub.com?subject=FR2P%20Live%20Demo%20Request&body=I%20would%20like%20to%20schedule%20a%20live%20demo%20of%20The%20FR2P%20Club%20for%20my%20organization.', '_blank')}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Live Demo
                </Button>
                <Button variant="outline" data-testid="button-view-presentation-guide"
                  onClick={() => window.open('/fr2p-presentation.html', '_blank')}>
                  📋 Master Presentation Guide
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card data-testid="card-social-templates">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <CardTitle>Social Media Templates</CardTitle>
                  </div>
                  <CardDescription>
                    Ready-to-use social media content and graphics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Facebook post templates</li>
                    <li>• LinkedIn business content</li>
                    <li>• Instagram story templates</li>
                    <li>• Professional graphics library</li>
                  </ul>
                  <Button className="w-full mt-4" data-testid="button-download-templates"
                    onClick={() => window.location.href = '/store'}>
                    Download Templates
                  </Button>
                </CardContent>
              </Card>

              <Card data-testid="card-business-cards">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-5 w-5 text-green-600" />
                    <CardTitle>Business Materials</CardTitle>
                  </div>
                  <CardDescription>
                    Professional business cards and brochure designs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Custom business card designs</li>
                    <li>• Tri-fold brochure templates</li>
                    <li>• Digital presentation slides</li>
                    <li>• Print-ready PDF files</li>
                  </ul>
                  <Button className="w-full mt-4" data-testid="button-customize-materials"
                    onClick={() => window.location.href = '/store'}>
                    Customize Materials
                  </Button>
                </CardContent>
              </Card>

              <Card data-testid="card-landing-pages">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <CardTitle>Landing Page Builder</CardTitle>
                  </div>
                  <CardDescription>
                    Create high-converting landing pages for lead capture
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Drag-and-drop page builder</li>
                    <li>• Mobile-responsive designs</li>
                    <li>• A/B testing capabilities</li>
                    <li>• Lead capture optimization</li>
                  </ul>
                  <Button className="w-full mt-4" data-testid="button-build-pages"
                    onClick={() => window.open('https://www.canva.com', '_blank')}>
                    Build Pages
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* FR2P Store Tab */}
          <TabsContent value="fr2p-store" className="space-y-6">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">The FR2P Club Store</h2>
              <p className="text-gray-600"><strong>Exclusive club members only:</strong> Zero-cost launch products + Premium networking tools</p>
            </div>

            {/* Zero-Cost Launch Banner */}
            <div className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">🚀 Revenue-First Launch Strategy</h3>
              <p className="text-sm text-green-700">
                <strong>Affordable for everyone!</strong> Payment plans available. Never break your budget - 
                we believe prosperity should be accessible to all. Google PDF printing keeps costs low.
              </p>
            </div>

            {/* FR2P Metal Business Cards - Featured Product */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🏆 Professional Metal Business Cards - Amazon Fulfilled</h3>
              <Card className="border-2 border-gray-300 bg-gradient-to-r from-yellow-50 to-orange-50 shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-gray-900 flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      FR2P Metal Business Cards - Premium Dual-Sided
                    </CardTitle>
                    <Badge className="bg-gray-100 text-gray-800">Amazon Fulfilled</Badge>
                  </div>
                  <CardDescription className="text-gray-800">
                    Professional dual-sided metal cards: FR2P logo + your personal QR code. Ordered through FR2P, fulfilled via Amazon Prime!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-gray-700 to-gray-900 h-32 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        <div className="text-center">
                          <div className="text-xl">FR2P</div>
                          <div className="text-xs opacity-75">FRONT: FR2P Logo</div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-600 to-purple-600 h-32 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        <div className="text-center">
                          <QrCode className="w-8 h-8 mx-auto mb-1" />
                          <div className="text-xs">BACK: Your QR Code</div>
                          <div className="text-xs opacity-75">+ Personal Info</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-bold text-gray-900">What's Included:</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Premium metal finish
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          FR2P logo on front side
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Your custom QR code on back
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Personalized with your info
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Amazon Prime fast shipping
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Perfect for networking events
                        </li>
                      </ul>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Quantity & Pricing Options */}
                      <div className="bg-white p-4 rounded-lg border border-gray-300">
                        <h5 className="font-semibold text-gray-900 text-sm mb-3">Choose Your Quantity:</h5>
                        
                        <div className="space-y-3">
                          <div className="border rounded-lg p-3 hover:bg-gray-50">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-semibold">100 Cards</div>
                                <div className="text-xs text-gray-600">Starter pack</div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-lg">$60</div>
                                <div className="text-xs text-gray-500">vs $30 Amazon direct</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border rounded-lg p-3 hover:bg-gray-50 border-gray-300 bg-gray-50">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-semibold text-gray-900">500 Cards</div>
                                <div className="text-xs text-gray-700">Most Popular</div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-lg text-gray-900">$120</div>
                                <div className="text-xs text-gray-500">vs $60 Amazon direct</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border rounded-lg p-3 hover:bg-gray-50">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-semibold">1,000 Cards</div>
                                <div className="text-xs text-gray-600">Business pack</div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-lg">$200</div>
                                <div className="text-xs text-gray-500">vs $100 Amazon direct</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="w-full bg-gray-600 hover:bg-gray-700 text-white mt-4" data-testid="button-order-metal-cards">
                              <CreditCard className="w-4 h-4 mr-2" />
                              Place Your Order
                            </Button>
                          </DialogTrigger>
                          <MetalBusinessCardOrderForm memberId={DEMO_USER_ID} />
                        </Dialog>
                        <p className="text-xs text-gray-600 text-center mt-2">
                          Premium pricing includes FR2P processing & support
                        </p>
                      </div>
                      
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <h5 className="font-semibold text-blue-900 text-sm mb-2">How It Works:</h5>
                        <ol className="text-xs text-blue-800 space-y-1">
                          <li>1. Select quantity & place order on FR2P</li>
                          <li>2. Create your QR code (Canva or any tool)</li>
                          <li>3. Submit your personalization details</li>
                          <li>4. We process your order through Amazon</li>
                          <li>5. Amazon ships directly to you with Prime</li>
                        </ol>
                        <div className="mt-2 text-xs text-blue-700 font-medium">
                          ✅ Trusted Amazon fulfillment + FR2P premium service
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* High-Margin Digital Products */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">💚 Affordable Financial Education</h3>
              <p className="text-sm text-gray-600 mb-4 text-center">
                <strong>"From paycheck to prosperity shouldn't cost a fortune."</strong> - Payment plans make prosperity accessible to everyone.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-green-200 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-green-900">FR2P Financial Literacy Course</CardTitle>
                      <Badge className="bg-green-100 text-green-800">Best Seller</Badge>
                    </div>
                    <CardDescription>Complete "From Paycheck to Prosperity" transformation course</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-2xl font-bold text-green-600">$97</div>
                      <div className="text-sm text-green-700 font-medium">Or 3 payments of $35</div>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>✓ 12-module video course</li>
                        <li>✓ Budgeting & investment templates</li>
                        <li>✓ Circle of Influence worksheets</li>
                        <li>✓ 90-day prosperity action plan</li>
                        <li>✓ Lifetime access + updates</li>
                      </ul>
                      <Button className="w-full bg-green-600 hover:bg-green-700" data-testid="button-buy-course"
                        onClick={() => window.location.href = '/join'}>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Start for $35/month
                      </Button>
                      <p className="text-xs text-green-600 text-center font-medium">💚 Budget-friendly payment plan available</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-blue-900">Institutional Facilitator Bundle</CardTitle>
                      <Badge className="bg-blue-100 text-blue-800">High ROI</Badge>
                    </div>
                    <CardDescription>Train others and earn presentation fees</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-2xl font-bold text-blue-600">$147</div>
                      <div className="text-sm text-blue-700 font-medium">Or 3 payments of $55</div>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>✓ All 3 presentation PDFs</li>
                        <li>✓ Facilitator training videos</li>
                        <li>✓ PowerPoint slide decks</li>
                        <li>✓ Legal compliance guides</li>
                        <li>✓ Revenue-share templates</li>
                      </ul>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700" data-testid="button-buy-facilitator"
                        onClick={() => window.open('mailto:support@fr2pclub.com?subject=FR2P%20Facilitator%20Bundle%20Inquiry', '_blank')}>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Start for $55/month
                      </Button>
                      <p className="text-xs text-blue-600 text-center font-medium">💙 Earn while you learn - ROI in first presentation</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Service Offerings */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🎯 Scalable Service Revenue</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-purple-200">
                  <CardHeader>
                    <CardTitle className="text-purple-900 text-lg">Live Workshops</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-xl font-bold text-purple-600">$147</div>
                      <div className="text-sm text-gray-600">Per institution (unlimited participants)</div>
                      <div className="text-xs text-purple-600 font-medium">Payment plans available</div>
                      <Button variant="outline" className="w-full text-purple-600 border-purple-300" data-testid="button-book-workshop"
                        onClick={() => window.open('mailto:support@fr2pclub.com?subject=FR2P%20Workshop%20Booking&body=I%20would%20like%20to%20book%20a%20Financial%20Literacy%20Workshop%20for%20my%20institution.', '_blank')}>
                        Book Workshop
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-gray-900 text-lg">Certification Program</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-xl font-bold text-gray-600">$97</div>
                      <div className="text-sm text-gray-600">12-week coaching cohort</div>
                      <div className="text-xs text-gray-600 font-medium">$25/week - less than coffee!</div>
                      <Button variant="outline" className="w-full text-gray-600 border-gray-300" data-testid="button-join-certification"
                        onClick={() => window.location.href = '/join'}>
                        Join Waitlist
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-teal-200">
                  <CardHeader>
                    <CardTitle className="text-teal-900 text-lg">Institutional Pilots</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-xl font-bold text-teal-600">$97</div>
                      <div className="text-sm text-gray-600">Complete pilot program setup</div>
                      <div className="text-xs text-teal-600 font-medium">Budget-friendly for all institutions</div>
                      <Button variant="outline" className="w-full text-teal-600 border-teal-300" data-testid="button-request-pilot"
                        onClick={() => window.open('mailto:support@fr2pclub.com?subject=FR2P%20Pilot%20Program%20Request&body=I%20would%20like%20to%20request%20a%20pilot%20program%20for%20my%20institution.', '_blank')}>
                        Request Pilot
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 max-w-4xl mx-auto">
              {/* FR2P Metal Business Cards */}
              <Card data-testid="card-metal-business-cards" className="relative overflow-hidden border-2 border-blue-200 shadow-lg">
                <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-600 to-purple-600 text-white px-3 py-1 text-xs font-medium rounded-bl-lg">
                  ⭐ FEATURED
                </div>
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg">
                      <CreditCard className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">FR2P Metal Business Cards</CardTitle>
                      <CardDescription className="text-gray-600">
                        Premium dual-sided metal cards for professional networking
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">$60</div>
                      <div className="text-xs text-gray-500">per bulk order</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Product Preview */}
                  <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-6 text-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="text-center">
                        <h4 className="font-semibold mb-3 text-blue-300">Front Side</h4>
                        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-4 shadow-lg">
                          <div className="flex items-center justify-center mb-2">
                            <img 
                              src="/attached_assets/20250915_001334_0000_1758852404230.png" 
                              alt="FR2P Logo" 
                              className="h-12 w-auto"
                            />
                          </div>
                          <div className="mt-3 text-sm font-medium text-white">[Your Name]</div>
                          <div className="text-xs opacity-90 text-white">[Your Title/Tagline]</div>
                        </div>
                      </div>
                      <div className="text-center">
                        <h4 className="font-semibold mb-3 text-blue-300">Back Side</h4>
                        <div className="bg-white text-gray-800 rounded-lg p-4 shadow-lg">
                          <div className="flex items-center justify-center mb-2">
                            <QrCode className="h-16 w-16 text-gray-700" />
                          </div>
                          <div className="text-xs">Scan for Digital Profile</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">✨ Premium Features</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• <strong>Dual-sided design:</strong> FR2P logo + your custom QR code</li>
                        <li>• <strong>Premium metal finish</strong> for lasting impression</li>
                        <li>• <strong>Custom personalization</strong> with your name & tagline</li>
                        <li>• <strong>Professional quality</strong> that speaks your mission</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">📦 Order Details</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• <strong>Bulk quantity:</strong> 500-1,000 cards per order</li>
                        <li>• <strong>Available to all tiers:</strong> Bronze through Diamond</li>
                        <li>• <strong>Cost-effective:</strong> Nearly half of Amazon's price</li>
                        <li>• <strong>Quality controlled:</strong> FR2P ensures consistency</li>
                      </ul>
                    </div>
                  </div>

                  {/* Member Tier Eligibility */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-3">🏆 Available to All FR2P Members</h4>
                    <div className="grid grid-cols-5 gap-2 text-xs text-center">
                      <div className="bg-amber-100 border border-amber-300 rounded p-2">
                        <div className="font-medium text-amber-800">🥉 Bronze</div>
                        <div className="text-amber-600">$5/month</div>
                      </div>
                      <div className="bg-gray-100 border border-gray-300 rounded p-2">
                        <div className="font-medium text-gray-800">🥈 Platinum</div>
                        <div className="text-gray-600">$10/month</div>
                      </div>
                      <div className="bg-gray-100 border border-gray-300 rounded p-2">
                        <div className="font-medium text-gray-800">🥈 Platinum</div>
                        <div className="text-gray-600">$20/month</div>
                      </div>
                      <div className="bg-purple-100 border border-purple-300 rounded p-2">
                        <div className="font-medium text-blue-800">💍 Diamond</div>
                        <div className="text-purple-600">$35/month</div>
                      </div>
                      <div className="bg-blue-100 border border-blue-300 rounded p-2">
                        <div className="font-medium text-blue-800">🔷 Diamond</div>
                        <div className="text-blue-600">$50/month</div>
                      </div>
                    </div>
                  </div>

                  {/* Ordering Process */}
                  <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-3">🔧 How to Order</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</div>
                        <div>
                          <div className="font-medium text-green-800">Click "Order Metal Cards" below</div>
                          <div className="text-green-700">Complete your $60 payment to start the process</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</div>
                        <div>
                          <div className="font-medium text-green-800">Create your QR code</div>
                          <div className="text-green-700">Use Canva or any tool to create QR code linking to your FR2P referral page</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</div>
                        <div>
                          <div className="font-medium text-green-800">Submit your information</div>
                          <div className="text-green-700">Send QR code file, name, tagline, and any special requests</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</div>
                        <div>
                          <div className="font-medium text-green-800">FR2P handles the rest</div>
                          <div className="text-green-700">Professional customization & delivery of 500-1,000 cards</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Call to Action */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white" 
                      data-testid="button-order-metal-cards"
                      onClick={() => window.location.href = '/store'}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Order Metal Cards - $60
                    </Button>
                    <Button variant="outline" className="flex-1" data-testid="button-more-info"
                      onClick={() => window.location.href = '/store'}>
                      <Package className="w-4 h-4 mr-2" />
                      More Information
                    </Button>
                  </div>

                  {/* Value Proposition */}
                  <div className="text-center text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                    <strong>Why choose FR2P Metal Cards?</strong> These aren't just tools—they're symbols of commitment, professionalism, and pride. 
                    Make your mark in outreach settings like colleges, churches, nonprofits, and community events.
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>


          <TabsContent value="community" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card data-testid="card-member-forum">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    <CardTitle>Private Member Forum</CardTitle>
                  </div>
                  <CardDescription>
                    Connect with other affiliates and share strategies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Discussion boards by topic</li>
                    <li>• Success story sharing</li>
                    <li>• Q&A with mentors</li>
                    <li>• Regional networking groups</li>
                  </ul>
                  <Button className="w-full mt-4" data-testid="button-join-forum"
                    onClick={() => window.location.href = '/chat'}>
                    Join Forum
                  </Button>
                </CardContent>
              </Card>

              <Card data-testid="card-coaching-calls">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <CardTitle>Monthly Coaching Calls</CardTitle>
                  </div>
                  <CardDescription>
                    Group coaching sessions with successful affiliates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Live Q&A sessions</li>
                    <li>• Goal setting workshops</li>
                    <li>• Strategy review sessions</li>
                    <li>• Guest expert presentations</li>
                  </ul>
                  <Button className="w-full mt-4" data-testid="button-book-coaching"
                    onClick={() => window.open('mailto:support@fr2pclub.com?subject=FR2P%20Coaching%20Session%20Request&body=I%20would%20like%20to%20book%20a%20monthly%20coaching%20call.', '_blank')}>
                    Book Session
                  </Button>
                </CardContent>
              </Card>

              <Card data-testid="card-success-stories">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-purple-600" />
                    <CardTitle>Success Case Studies</CardTitle>
                  </div>
                  <CardDescription>
                    Learn from top-performing affiliate success stories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Detailed case study analysis</li>
                    <li>• Step-by-step breakdowns</li>
                    <li>• Interview transcripts</li>
                    <li>• Replicable strategies</li>
                  </ul>
                  <Button className="w-full mt-4" data-testid="button-read-studies"
                    onClick={() => window.open('/fr2p-presentation.html', '_blank')}>
                    Read Case Studies
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Membership Value Summary */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Membership Plans Value</CardTitle>
            <CardDescription className="text-center text-lg">
              Choose the plan that fits your business goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-purple-100 rounded-lg p-6 border-2 border-blue-300 relative max-w-md">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  EXCLUSIVE CLUB
                </div>
                <h3 className="text-xl font-bold text-center mb-4">The FR2P Club - $35/Month Membership</h3>
                <ul className="space-y-2 text-sm">
                  <li>✓ Complete financial education system</li>
                  <li>✓ Personal club invitation link</li>
                  <li>✓ $5/month per referral (flat rate, unlimited)</li>
                  <li>✓ 5-tier achievement system: Bronze→Silver→Gold→Platinum→Diamond</li>
                  <li>✓ Achievement bonuses: $50→$100→$200→$500→$1,000</li>
                  <li>✓ FTC-compliant single-tier affiliate model</li>
                  <li>✓ Ongoing support & community access</li>
                  <li>✓ Mobile sharing tools</li>
                </ul>
                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => window.location.href = '/join'}>
                  Join The FR2P Club Now
                </Button>
                <div className="text-center mt-4 text-green-600 font-medium">
                  "Affordable membership - ROI covers costs with just 1 referral!"
                </div>
              </div>
            </div>
          </CardContent>
          <CardContent>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">High-Ticket Product Strategies</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">10% Commission Products</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• $500 product = $50 commission</li>
                    <li>• $750 product = $75 commission</li>
                    <li>• $1,000 product = $100 commission</li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Examples of High-Value Products</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Online courses ($497-$997)</li>
                    <li>• Software subscriptions ($500+/year)</li>
                    <li>• Coaching programs ($997-$2,997)</li>
                    <li>• Business tools & services</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Tier Progression System</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium text-amber-800">Gold Tier (0-24 sales)</div>
                    <div className="text-sm text-amber-700">$25 per sale • Basic training & tools</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">Platinum Tier (25-124 sales)</div>
                    <div className="text-sm text-gray-700">$35 per sale • +$100 bonus • Advanced resources</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium text-blue-800">Diamond Tier (125+ sales)</div>
                    <div className="text-sm text-blue-700">$50 per sale • +$500 bonus • Premium support & priority access</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-blue-600">25+</div>
                <div className="text-sm text-gray-600">Hours of Training</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-green-600">50+</div>
                <div className="text-sm text-gray-600">Marketing Templates</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-purple-600">24/7</div>
                <div className="text-sm text-gray-600">Community Access</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-gray-600">Weekly</div>
                <div className="text-sm text-gray-600">Live Training</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Charity Selection Dialog */}
        <Dialog open={charityDialogOpen} onOpenChange={(open) => { setCharityDialogOpen(open); if (!open) setPendingCharity(null); }}>
          <DialogContent data-testid="dialog-charity-selection">
            <DialogHeader>
              <DialogTitle>Confirm Charity Selection</DialogTitle>
              <DialogDescription>
                You're about to select {pendingCharity?.name} as your charity of choice.
              </DialogDescription>
            </DialogHeader>
            {pendingCharity && (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900">{pendingCharity.name}</h4>
                  <div className="text-sm text-gray-600 mt-1 space-y-1">
                    {pendingCharity.city && pendingCharity.state && (
                      <div>📍 {pendingCharity.city}, {pendingCharity.state}</div>
                    )}
                    <div>🆔 EIN: {pendingCharity.ein}</div>
                    {pendingCharity.category && (
                      <div>📂 Category: {pendingCharity.category}</div>
                    )}
                    {pendingCharity.website && (
                      <div>🌐 Website: {pendingCharity.website}</div>
                    )}
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm text-blue-800">
                    <strong>💝 Your Impact:</strong> 5% of your monthly The FR2P Club earnings will be automatically donated to {pendingCharity.name} to support their mission.
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setCharityDialogOpen(false)}
                data-testid="button-cancel-charity"
                disabled={charitySelectionMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                onClick={confirmCharitySelection}
                className="bg-green-600 hover:bg-green-700"
                data-testid="button-confirm-charity"
                disabled={charitySelectionMutation.isPending}
              >
                {charitySelectionMutation.isPending ? "Saving..." : "Confirm Selection"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}