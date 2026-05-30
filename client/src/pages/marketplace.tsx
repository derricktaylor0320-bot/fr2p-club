import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import {
  Store, Globe, Phone, Mail, MapPin, Search, Plus, Edit, Trash2,
  TrendingUp, Eye, MousePointer, Crown, Zap, Users, ExternalLink, Star, ChevronDown
} from "lucide-react";
import type { BusinessListing } from "@shared/schema";

const CATEGORIES = [
  "All",
  "Retail & Shopping",
  "Food & Beverage",
  "Health & Wellness",
  "Technology",
  "Professional Services",
  "Beauty & Fashion",
  "Real Estate",
  "Finance & Insurance",
  "Education & Training",
  "Entertainment",
  "Transportation",
  "Non-Profit",
  "Other",
];

const listingFormSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  tagline: z.string().optional(),
  description: z.string().min(20, "Please describe your business (at least 20 characters)"),
  category: z.string().min(1, "Category is required"),
  website: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  phone: z.string().optional(),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  city: z.string().optional(),
  state: z.string().optional(),
  weeklyPromo: z.string().optional(),
});

const guestFormSchema = z.object({
  advertiserName: z.string().min(2, "Your name is required"),
  advertiserEmail: z.string().email("Valid email required"),
  businessName: z.string().min(2, "Business name is required"),
  tagline: z.string().optional(),
  description: z.string().min(20, "Please describe your business (at least 20 characters)"),
  category: z.string().min(1, "Category is required"),
  website: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  phone: z.string().optional(),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  city: z.string().optional(),
  state: z.string().optional(),
  weeklyPromo: z.string().optional(),
  packageType: z.enum(["guest_basic", "guest_featured_weekly", "guest_featured_monthly"]),
});

type ListingForm = z.infer<typeof listingFormSchema>;
type GuestForm = z.infer<typeof guestFormSchema>;
type ListingWithMember = BusinessListing & { memberFirstName?: string; memberLastName?: string };

export default function Marketplace() {
  const { toast } = useToast();
  const [location] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [selectedGuestPkg, setSelectedGuestPkg] = useState<"guest_basic" | "guest_featured_weekly" | "guest_featured_monthly">("guest_basic");
  const [memberId] = useState(() => localStorage.getItem("memberId") || "");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("guest_success") === "true") {
      toast({ title: "Payment successful!", description: "Your business listing is being activated and will appear in the directory shortly." });
    }
    if (params.get("upgraded") === "true") {
      toast({ title: "Listing upgraded!", description: "Your featured placement is now live." });
    }
    if (params.get("advertise") === "true" || window.location.hash === "#advertise") {
      setTimeout(() => {
        document.getElementById("advertise")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, []);

  const { data: listingsData, isLoading } = useQuery<{ listings: ListingWithMember[] }>({
    queryKey: ["/api/marketplace/listings"],
  });

  const { data: myListingData } = useQuery<{ listing: BusinessListing | null }>({
    queryKey: ["/api/marketplace/my-listing", memberId],
    enabled: !!memberId,
  });

  const memberForm = useForm<ListingForm>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      businessName: "",
      tagline: "",
      description: "",
      category: "",
      website: "",
      phone: "",
      email: "",
      city: "",
      state: "",
      weeklyPromo: "",
    },
  });

  const guestForm = useForm<GuestForm>({
    resolver: zodResolver(guestFormSchema),
    defaultValues: {
      advertiserName: "",
      advertiserEmail: "",
      businessName: "",
      tagline: "",
      description: "",
      category: "",
      website: "",
      phone: "",
      email: "",
      city: "",
      state: "",
      weeklyPromo: "",
      packageType: "guest_basic",
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: ListingForm) => {
      const res = await apiRequest("POST", "/api/marketplace/listings", { memberId, ...data });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/marketplace/listings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/marketplace/my-listing", memberId] });
      toast({ title: "Listing saved!", description: "Your business listing is now live in the marketplace." });
      setShowMemberForm(false);
    },
    onError: () => toast({ title: "Error", description: "Failed to save listing.", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/marketplace/listings/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/marketplace/listings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/marketplace/my-listing", memberId] });
      toast({ title: "Listing removed", description: "Your business listing has been removed." });
    },
  });

  const upgradeMutation = useMutation({
    mutationFn: async (packageType: string) => {
      const res = await apiRequest("POST", "/api/marketplace/upgrade-session", { memberId, packageType });
      return res.json();
    },
    onSuccess: (data) => { if (data.url) window.location.href = data.url; },
    onError: () => toast({ title: "Error", description: "Could not start upgrade process.", variant: "destructive" }),
  });

  const guestAdMutation = useMutation({
    mutationFn: async (data: GuestForm) => {
      const res = await apiRequest("POST", "/api/marketplace/guest-ad-session", data);
      return res.json();
    },
    onSuccess: (data) => { if (data.url) window.location.href = data.url; },
    onError: () => toast({ title: "Error", description: "Could not start checkout. Please try again.", variant: "destructive" }),
  });

  const trackClick = async (id: string) => {
    await fetch(`/api/marketplace/track-click/${id}`, { method: "POST" });
  };

  const allListings = listingsData?.listings || [];
  const featuredListings = allListings.filter(l =>
    l.packageType !== "free" && l.packageType !== "guest_basic" &&
    l.featuredUntil && new Date(l.featuredUntil) > new Date()
  );
  const regularListings = allListings.filter(l =>
    !(l.packageType !== "free" && l.packageType !== "guest_basic" &&
    l.featuredUntil && new Date(l.featuredUntil) > new Date())
  );

  const filterListings = (listings: ListingWithMember[]) =>
    listings.filter(l => {
      const matchCat = selectedCategory === "All" || l.category === selectedCategory;
      const matchSearch = !searchQuery ||
        l.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (l.city || "").toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

  const myListing = myListingData?.listing;
  const isMemberFeatured = myListing && myListing.packageType !== "free" &&
    myListing.featuredUntil && new Date(myListing.featuredUntil) > new Date();

  const onMemberSubmit = (data: ListingForm) => saveMutation.mutate(data);
  const onGuestSubmit = (data: GuestForm) => guestAdMutation.mutate({ ...data, packageType: selectedGuestPkg });

  const guestPackages = [
    {
      id: "guest_basic" as const,
      icon: "📋",
      name: "Basic Directory Listing",
      price: "$75",
      period: "/month",
      color: "border-gray-200",
      textColor: "text-gray-700",
      features: ["Business name & description", "Contact info & location", "Listed in directory", "Views tracking", "30-day listing"],
      cta: "Get Listed",
      ctaStyle: { backgroundColor: "#4b5563", color: "white" },
    },
    {
      id: "guest_featured_weekly" as const,
      icon: "⭐",
      name: "Featured Weekly",
      price: "$75",
      period: "/week",
      color: "border-blue-400",
      textColor: "text-blue-700",
      features: ["Everything in Basic", "Featured placement (top)", "Gold featured badge", "Weekly promo post", "Priority support"],
      cta: "Get Featured",
      ctaStyle: { backgroundColor: "#2563eb", color: "white" },
    },
    {
      id: "guest_featured_monthly" as const,
      icon: "👑",
      name: "Featured Monthly",
      price: "$250",
      period: "/month",
      color: "border-yellow-400",
      textColor: "text-yellow-700",
      popular: true,
      features: ["Everything in Weekly", "Top of directory all month", "4 weekly promo posts", "Highlighted listing", "Analytics dashboard", "Email to all members"],
      cta: "Get Top Placement",
      ctaStyle: { backgroundColor: "#FFD700", color: "#001f3f" },
    },
  ];

  const ListingCard = ({ listing, featured = false }: { listing: ListingWithMember; featured?: boolean }) => (
    <Card className={`relative overflow-hidden transition-all hover:shadow-lg ${featured ? "border-2 border-yellow-400 shadow-yellow-400/20 shadow-md" : "border border-gray-200"}`}>
      {featured && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-yellow-400 text-yellow-900 font-bold text-xs">
            <Crown className="w-3 h-3 mr-1" />FEATURED
          </Badge>
        </div>
      )}
      {listing.listingType === "guest" && (
        <div className="absolute top-3 left-3 z-10">
          <Badge variant="outline" className="text-xs border-purple-300 text-purple-700 bg-purple-50">Advertiser</Badge>
        </div>
      )}
      <CardContent className="pt-5 pb-4 space-y-3">
        <div className="flex items-start gap-3">
          {listing.logoUrl ? (
            <img src={listing.logoUrl} alt={listing.businessName} className="w-14 h-14 rounded-lg object-cover border border-gray-200 shrink-0" />
          ) : (
            <div className="w-14 h-14 rounded-lg flex items-center justify-center text-xl font-bold shrink-0"
              style={{ backgroundColor: "#001f3f", color: "#FFD700" }}>
              {listing.businessName.charAt(0)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-gray-900 text-base leading-tight">{listing.businessName}</h3>
            {listing.tagline && <p className="text-sm text-gray-500 italic mt-0.5">{listing.tagline}</p>}
            <Badge variant="secondary" className="text-xs mt-1">{listing.category}</Badge>
          </div>
        </div>

        <p className="text-sm text-gray-600 line-clamp-3">{listing.description}</p>

        {listing.weeklyPromo && featured && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2.5">
            <div className="flex items-center gap-1.5 text-yellow-700">
              <Zap className="w-4 h-4 shrink-0" />
              <span className="text-xs font-semibold">Current Promo:</span>
            </div>
            <p className="text-xs text-yellow-800 mt-1">{listing.weeklyPromo}</p>
          </div>
        )}

        <div className="space-y-1.5 text-xs text-gray-500">
          {(listing.city || listing.state) && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>{[listing.city, listing.state].filter(Boolean).join(", ")}</span>
            </div>
          )}
          {listing.website && (
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 shrink-0" />
              <a href={listing.website} target="_blank" rel="noopener noreferrer"
                className="text-blue-600 hover:underline truncate flex items-center gap-1"
                onClick={() => trackClick(listing.id)}>
                {listing.website.replace(/^https?:\/\//, "")}
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>
          )}
          {listing.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <a href={`tel:${listing.phone}`} className="hover:text-blue-600">{listing.phone}</a>
            </div>
          )}
          {listing.email && (
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 shrink-0" />
              <a href={`mailto:${listing.email}`} className="text-blue-600 hover:underline truncate">{listing.email}</a>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 pt-1 text-xs text-gray-400 border-t border-gray-100">
          <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{listing.viewCount}</span>
          <span className="flex items-center gap-1"><MousePointer className="w-3.5 h-3.5" />{listing.clickCount}</span>
          {listing.listingType === "member" && listing.memberFirstName && (
            <span className="ml-auto">Member: {listing.memberFirstName} {listing.memberLastName}</span>
          )}
          {listing.listingType === "guest" && listing.advertiserName && (
            <span className="ml-auto">{listing.advertiserName}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarNav />
      <main className="flex-1 md:ml-64 p-6">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Store className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold" style={{ color: "#001f3f" }}>Member Business Marketplace</h1>
          </div>
          <p className="text-gray-600 mb-4">
            A living directory of businesses run by The FR2P Club members. Every member gets a free listing — or advertise your business here without joining.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" onClick={() => document.getElementById("advertise")?.scrollIntoView({ behavior: "smooth" })}>
              Advertise Without Joining <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
            {memberId && !myListing && (
              <Button size="sm" style={{ backgroundColor: "#001f3f", color: "white" }} onClick={() => setShowMemberForm(true)}>
                <Plus className="w-4 h-4 mr-1" /> Create Your Free Listing
              </Button>
            )}
          </div>
        </div>

        {/* Member Listing Panel */}
        {memberId && (
          <Card className="mb-8 border-2" style={{ borderColor: "#001f3f" }}>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <CardTitle style={{ color: "#001f3f" }}>Your Business Listing</CardTitle>
                  <CardDescription>
                    {myListing ? "Your listing is live in the marketplace." : "Create your free listing — included with your membership."}
                  </CardDescription>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {myListing && (
                    <Button variant="outline" size="sm" onClick={() => deleteMutation.mutate(myListing.id)}
                      disabled={deleteMutation.isPending} className="text-red-600 border-red-300 hover:bg-red-50">
                      <Trash2 className="w-4 h-4 mr-1" /> Remove
                    </Button>
                  )}
                  <Button size="sm" style={{ backgroundColor: "#001f3f", color: "white" }}
                    onClick={() => setShowMemberForm(!showMemberForm)}>
                    {showMemberForm ? "Cancel" : myListing ? <><Edit className="w-4 h-4 mr-1" />Edit</> : <><Plus className="w-4 h-4 mr-1" />Create Free Listing</>}
                  </Button>
                </div>
              </div>
            </CardHeader>

            {myListing && !showMemberForm && (
              <CardContent>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg flex-wrap">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl shrink-0"
                    style={{ backgroundColor: "#001f3f", color: "#FFD700" }}>
                    {myListing.businessName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900">{myListing.businessName}</div>
                    <div className="text-sm text-gray-500">{myListing.category}</div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-400 flex-wrap">
                      <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{myListing.viewCount} views</span>
                      <span className="flex items-center gap-1"><MousePointer className="w-3.5 h-3.5" />{myListing.clickCount} clicks</span>
                      <Badge variant={isMemberFeatured ? "default" : "secondary"} className={isMemberFeatured ? "bg-yellow-400 text-yellow-900" : ""}>
                        {isMemberFeatured ? "Featured" : "Free Listing"}
                      </Badge>
                    </div>
                  </div>
                  {!isMemberFeatured && (
                    <div className="flex gap-2 flex-wrap shrink-0">
                      <Button size="sm" variant="outline" onClick={() => upgradeMutation.mutate("featured_weekly")} disabled={upgradeMutation.isPending}>
                        $25/wk Featured
                      </Button>
                      <Button size="sm" style={{ backgroundColor: "#FFD700", color: "#001f3f" }} onClick={() => upgradeMutation.mutate("featured_monthly")} disabled={upgradeMutation.isPending}>
                        $100/mo Featured
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            )}

            {showMemberForm && (
              <CardContent>
                <Form {...memberForm}>
                  <form onSubmit={memberForm.handleSubmit(onMemberSubmit)} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField control={memberForm.control} name="businessName" render={({ field }) => (
                        <FormItem><FormLabel>Business Name *</FormLabel>
                          <FormControl><Input placeholder="Your Business Name" {...field} /></FormControl>
                          <FormMessage /></FormItem>
                      )} />
                      <FormField control={memberForm.control} name="category" render={({ field }) => (
                        <FormItem><FormLabel>Category *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                            <SelectContent>
                              {CATEGORIES.filter(c => c !== "All").map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage /></FormItem>
                      )} />
                    </div>
                    <FormField control={memberForm.control} name="tagline" render={({ field }) => (
                      <FormItem><FormLabel>Tagline (optional)</FormLabel>
                        <FormControl><Input placeholder="A short, catchy phrase about your business" {...field} /></FormControl>
                        <FormMessage /></FormItem>
                    )} />
                    <FormField control={memberForm.control} name="description" render={({ field }) => (
                      <FormItem><FormLabel>Description *</FormLabel>
                        <FormControl><Textarea placeholder="Describe your business, products/services, and what makes you unique..." rows={3} {...field} /></FormControl>
                        <FormMessage /></FormItem>
                    )} />
                    <div className="grid md:grid-cols-3 gap-4">
                      <FormField control={memberForm.control} name="website" render={({ field }) => (
                        <FormItem><FormLabel>Website</FormLabel>
                          <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                          <FormMessage /></FormItem>
                      )} />
                      <FormField control={memberForm.control} name="phone" render={({ field }) => (
                        <FormItem><FormLabel>Phone</FormLabel>
                          <FormControl><Input placeholder="(555) 000-0000" {...field} /></FormControl>
                          <FormMessage /></FormItem>
                      )} />
                      <FormField control={memberForm.control} name="email" render={({ field }) => (
                        <FormItem><FormLabel>Contact Email</FormLabel>
                          <FormControl><Input placeholder="contact@business.com" {...field} /></FormControl>
                          <FormMessage /></FormItem>
                      )} />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField control={memberForm.control} name="city" render={({ field }) => (
                        <FormItem><FormLabel>City</FormLabel>
                          <FormControl><Input placeholder="City" {...field} /></FormControl>
                          <FormMessage /></FormItem>
                      )} />
                      <FormField control={memberForm.control} name="state" render={({ field }) => (
                        <FormItem><FormLabel>State</FormLabel>
                          <FormControl><Input placeholder="State" {...field} /></FormControl>
                          <FormMessage /></FormItem>
                      )} />
                    </div>
                    {isMemberFeatured && (
                      <FormField control={memberForm.control} name="weeklyPromo" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weekly Promo <Badge className="ml-1 bg-yellow-400 text-yellow-900 text-xs">Featured</Badge></FormLabel>
                          <FormControl><Textarea placeholder="Share your current deal, promotion, or announcement..." rows={2} {...field} /></FormControl>
                          <FormMessage /></FormItem>
                      )} />
                    )}
                    <Button type="submit" disabled={saveMutation.isPending} className="w-full" style={{ backgroundColor: "#001f3f", color: "white" }}>
                      {saveMutation.isPending ? "Saving..." : myListing ? "Update Listing" : "Create Free Listing"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            )}
          </Card>
        )}

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input className="pl-10" placeholder="Search businesses by name, description, or city..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-56"><SelectValue /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Featured Listings */}
        {filterListings(featuredListings).length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-5 h-5 text-yellow-500" />
              <h2 className="text-xl font-bold" style={{ color: "#001f3f" }}>Featured Businesses</h2>
              <Badge className="bg-yellow-400 text-yellow-900">Top Placement</Badge>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filterListings(featuredListings).map(l => <ListingCard key={l.id} listing={l} featured />)}
            </div>
          </div>
        )}

        {/* All Listings */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Store className="w-5 h-5 text-gray-500" />
            <h2 className="text-xl font-bold text-gray-700">
              {selectedCategory === "All" ? "All Businesses" : selectedCategory}
            </h2>
            <span className="text-sm text-gray-400">({filterListings(regularListings).length})</span>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="pt-5 space-y-3">
                    <div className="flex gap-3">
                      <div className="w-14 h-14 rounded-lg bg-gray-200" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded" />
                    <div className="h-3 bg-gray-200 rounded w-5/6" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filterListings(regularListings).length === 0 ? (
            <Card className="text-center py-16 border-dashed border-2">
              <CardContent>
                <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-500 mb-2">
                  {allListings.length === 0 ? "No listings yet — be the first!" : "No results found"}
                </h3>
                <p className="text-gray-400 mb-6">
                  {allListings.length === 0
                    ? "The FR2P Club marketplace is open. Create your free member listing or advertise your business below."
                    : "Try a different category or clear your search."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filterListings(regularListings).map(l => <ListingCard key={l.id} listing={l} />)}
            </div>
          )}
        </div>

        {/* ====== GUEST ADVERTISING SECTION ====== */}
        <div id="advertise" className="scroll-mt-8">
          <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #001f3f 0%, #003366 100%)" }}>
            <div className="p-8 md:p-10 text-white">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-8 h-8 text-yellow-400" />
                <h2 className="text-2xl md:text-3xl font-bold">Advertise Your Business Here</h2>
              </div>
              <p className="text-blue-200 text-lg mb-2">
                No membership required. Get your business in front of The FR2P Club community.
              </p>
              <p className="text-blue-300 text-sm mb-8 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Our members are entrepreneurs, business owners, and financially motivated individuals — your ideal customers.
              </p>

              {/* Comparison table — member vs guest */}
              <div className="bg-white/10 rounded-xl p-4 mb-8 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left">
                      <th className="pb-3 text-blue-200 font-medium">Feature</th>
                      <th className="pb-3 text-center text-blue-200 font-medium">Member</th>
                      <th className="pb-3 text-center text-yellow-300 font-medium">Guest Advertiser</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    {[
                      ["Basic directory listing", "Free ✓", "$75/mo"],
                      ["Featured placement", "$25/wk", "$75/wk"],
                      ["Top-of-page monthly", "$100/mo", "$250/mo"],
                      ["Weekly promo post", "Paid tier", "Paid tier"],
                      ["Commission income", "$5/referral ✓", "—"],
                      ["Membership benefits", "✓", "—"],
                    ].map(([feat, member, guest]) => (
                      <tr key={feat} className="border-t border-white/10">
                        <td className="py-2 text-blue-100">{feat}</td>
                        <td className="py-2 text-center text-white font-medium">{member}</td>
                        <td className="py-2 text-center text-yellow-300 font-medium">{guest}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-blue-300 text-xs mt-3 text-center">
                  Members save significantly. <a href="/register" className="text-yellow-300 underline hover:text-yellow-200">Join The FR2P Club for $35/month →</a>
                </p>
              </div>

              {/* Guest Packages */}
              <h3 className="text-xl font-bold text-white mb-5">Guest Advertising Packages</h3>
              <div className="grid md:grid-cols-3 gap-5 mb-8">
                {guestPackages.map(pkg => (
                  <div key={pkg.id}
                    className={`bg-white rounded-xl p-5 cursor-pointer transition-all ${selectedGuestPkg === pkg.id ? "ring-4 ring-yellow-400 scale-105" : "hover:scale-102 opacity-90 hover:opacity-100"} ${pkg.popular ? "relative" : ""}`}
                    onClick={() => { setSelectedGuestPkg(pkg.id); setShowGuestForm(true); document.getElementById("guest-form")?.scrollIntoView({ behavior: "smooth" }); }}>
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-yellow-400 text-yellow-900 font-bold text-xs px-3">MOST POPULAR</Badge>
                      </div>
                    )}
                    <div className="text-center space-y-2">
                      <div className="text-3xl">{pkg.icon}</div>
                      <h4 className={`font-bold text-gray-900`}>{pkg.name}</h4>
                      <div className={`text-2xl font-bold ${pkg.textColor}`}>
                        {pkg.price}<span className="text-sm font-normal text-gray-500">{pkg.period}</span>
                      </div>
                      <ul className="text-sm text-gray-600 space-y-1 text-left mt-3">
                        {pkg.features.map(f => <li key={f}>✓ {f}</li>)}
                      </ul>
                      <Button size="sm" className="w-full mt-3" style={pkg.ctaStyle}>
                        {pkg.cta}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Guest Ad Form */}
              <div id="guest-form">
                {!showGuestForm ? (
                  <div className="text-center">
                    <Button size="lg" onClick={() => setShowGuestForm(true)}
                      className="font-bold text-base px-8" style={{ backgroundColor: "#FFD700", color: "#001f3f" }}>
                      <Plus className="w-5 h-5 mr-2" /> Submit Your Business Info & Pay
                    </Button>
                    <p className="text-blue-300 text-sm mt-2">Select a package above, then fill out your business details</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-lg font-bold text-gray-900">
                        Your Business Details
                        <Badge className="ml-2 text-xs" style={{ backgroundColor: "#FFD700", color: "#001f3f" }}>
                          {guestPackages.find(p => p.id === selectedGuestPkg)?.name} — {guestPackages.find(p => p.id === selectedGuestPkg)?.price}{guestPackages.find(p => p.id === selectedGuestPkg)?.period}
                        </Badge>
                      </h3>
                      <Button variant="ghost" size="sm" onClick={() => setShowGuestForm(false)}>Cancel</Button>
                    </div>

                    {/* Package selector inside form */}
                    <div className="flex gap-2 mb-5 flex-wrap">
                      {guestPackages.map(p => (
                        <button key={p.id} type="button"
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${selectedGuestPkg === p.id ? "border-yellow-400 bg-yellow-50 text-yellow-900" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}
                          onClick={() => setSelectedGuestPkg(p.id)}>
                          {p.icon} {p.name} — {p.price}{p.period}
                        </button>
                      ))}
                    </div>

                    <Form {...guestForm}>
                      <form onSubmit={guestForm.handleSubmit(onGuestSubmit)} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField control={guestForm.control} name="advertiserName" render={({ field }) => (
                            <FormItem><FormLabel>Your Name *</FormLabel>
                              <FormControl><Input placeholder="Full name" {...field} /></FormControl>
                              <FormMessage /></FormItem>
                          )} />
                          <FormField control={guestForm.control} name="advertiserEmail" render={({ field }) => (
                            <FormItem><FormLabel>Your Email *</FormLabel>
                              <FormControl><Input placeholder="your@email.com" type="email" {...field} /></FormControl>
                              <FormMessage /></FormItem>
                          )} />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField control={guestForm.control} name="businessName" render={({ field }) => (
                            <FormItem><FormLabel>Business Name *</FormLabel>
                              <FormControl><Input placeholder="Your Business Name" {...field} /></FormControl>
                              <FormMessage /></FormItem>
                          )} />
                          <FormField control={guestForm.control} name="category" render={({ field }) => (
                            <FormItem><FormLabel>Category *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                                <SelectContent>
                                  {CATEGORIES.filter(c => c !== "All").map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                              </Select>
                              <FormMessage /></FormItem>
                          )} />
                        </div>
                        <FormField control={guestForm.control} name="tagline" render={({ field }) => (
                          <FormItem><FormLabel>Tagline (optional)</FormLabel>
                            <FormControl><Input placeholder="A short, catchy phrase about your business" {...field} /></FormControl>
                            <FormMessage /></FormItem>
                        )} />
                        <FormField control={guestForm.control} name="description" render={({ field }) => (
                          <FormItem><FormLabel>Business Description *</FormLabel>
                            <FormControl><Textarea placeholder="Describe your business, what you offer, and why people should contact you..." rows={3} {...field} /></FormControl>
                            <FormMessage /></FormItem>
                        )} />
                        <div className="grid md:grid-cols-3 gap-4">
                          <FormField control={guestForm.control} name="website" render={({ field }) => (
                            <FormItem><FormLabel>Website</FormLabel>
                              <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                              <FormMessage /></FormItem>
                          )} />
                          <FormField control={guestForm.control} name="phone" render={({ field }) => (
                            <FormItem><FormLabel>Phone</FormLabel>
                              <FormControl><Input placeholder="(555) 000-0000" {...field} /></FormControl>
                              <FormMessage /></FormItem>
                          )} />
                          <FormField control={guestForm.control} name="email" render={({ field }) => (
                            <FormItem><FormLabel>Contact Email</FormLabel>
                              <FormControl><Input placeholder="contact@business.com" type="email" {...field} /></FormControl>
                              <FormMessage /></FormItem>
                          )} />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField control={guestForm.control} name="city" render={({ field }) => (
                            <FormItem><FormLabel>City</FormLabel>
                              <FormControl><Input placeholder="City" {...field} /></FormControl>
                              <FormMessage /></FormItem>
                          )} />
                          <FormField control={guestForm.control} name="state" render={({ field }) => (
                            <FormItem><FormLabel>State</FormLabel>
                              <FormControl><Input placeholder="State" {...field} /></FormControl>
                              <FormMessage /></FormItem>
                          )} />
                        </div>
                        {(selectedGuestPkg === "guest_featured_weekly" || selectedGuestPkg === "guest_featured_monthly") && (
                          <FormField control={guestForm.control} name="weeklyPromo" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Weekly Promo / Special Offer <Badge className="ml-1 bg-yellow-400 text-yellow-900 text-xs">Featured tier</Badge></FormLabel>
                              <FormControl><Textarea placeholder="e.g. '20% off first order for The FR2P Club members' or 'Free consultation this week'" rows={2} {...field} /></FormControl>
                              <FormMessage /></FormItem>
                          )} />
                        )}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-900">Order Summary</span>
                            <span className="font-bold text-lg" style={{ color: "#001f3f" }}>
                              {guestPackages.find(p => p.id === selectedGuestPkg)?.price}{guestPackages.find(p => p.id === selectedGuestPkg)?.period}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{guestPackages.find(p => p.id === selectedGuestPkg)?.name} — {guestPackages.find(p => p.id === selectedGuestPkg)?.features[0]}</p>
                          <p className="text-xs text-gray-400 mt-1">You'll be redirected to our secure Stripe checkout after submitting.</p>
                        </div>
                        <Button type="submit" disabled={guestAdMutation.isPending} size="lg" className="w-full font-bold text-base"
                          style={{ backgroundColor: "#FFD700", color: "#001f3f" }}>
                          {guestAdMutation.isPending ? "Redirecting to checkout..." : `Continue to Payment →`}
                        </Button>
                        <p className="text-center text-xs text-gray-500">
                          Want a free listing? <a href="/register" className="text-blue-600 underline hover:text-blue-800">Join The FR2P Club for $35/month</a> — members advertise for free.
                        </p>
                      </form>
                    </Form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Revenue potential footer */}
        <Card className="mt-10 border-2" style={{ borderColor: "#001f3f", backgroundColor: "#f8f9ff" }}>
          <CardContent className="pt-5">
            <div className="flex flex-col md:flex-row items-center gap-5">
              <TrendingUp className="w-12 h-12 shrink-0" style={{ color: "#001f3f" }} />
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-bold text-lg" style={{ color: "#001f3f" }}>Marketplace Revenue Potential</h3>
                <p className="text-gray-600 text-sm mt-1">
                  20 members on the $100/month Featured plan = $2,000/month. Add guest advertisers and it scales even further — all separate from membership commissions.
                </p>
              </div>
              <div className="text-center shrink-0">
                <div className="text-3xl font-bold" style={{ color: "#001f3f" }}>$2,000+</div>
                <div className="text-sm text-gray-500">potential/month</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
