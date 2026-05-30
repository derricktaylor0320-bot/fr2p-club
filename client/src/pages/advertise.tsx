import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Users, Eye, Star, Crown, CheckCircle2, ArrowRight, Store, Megaphone } from "lucide-react";

const CATEGORIES = [
  "Retail & Shopping", "Food & Beverage", "Health & Wellness", "Technology",
  "Professional Services", "Beauty & Fashion", "Real Estate", "Finance & Insurance",
  "Education & Training", "Entertainment", "Transportation", "Non-Profit", "Other",
];

const guestFormSchema = z.object({
  advertiserName: z.string().min(2, "Your name is required"),
  advertiserEmail: z.string().email("Valid email required"),
  businessName: z.string().min(2, "Business name is required"),
  tagline: z.string().optional(),
  description: z.string().min(20, "Please describe your business (at least 20 characters)"),
  category: z.string().min(1, "Category is required"),
  website: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  phone: z.string().optional(),
  email: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  weeklyPromo: z.string().optional(),
  packageType: z.enum(["guest_basic", "guest_featured_weekly", "guest_featured_monthly"]),
});

type GuestForm = z.infer<typeof guestFormSchema>;

const PACKAGES = [
  {
    id: "guest_basic" as const,
    icon: "📋",
    name: "Basic Listing",
    price: "$75",
    period: "/month",
    tagline: "Get found in our directory",
    color: "#6b7280",
    border: "border-gray-300",
    bg: "bg-gray-50",
    features: [
      "Business profile in member directory",
      "Your name, description & contact info",
      "Website, phone & email listed",
      "City & category searchable",
      "30-day active listing",
      "View count tracking",
    ],
  },
  {
    id: "guest_featured_weekly" as const,
    icon: "⭐",
    name: "Featured Weekly",
    price: "$75",
    period: "/week",
    tagline: "Stand out at the top",
    color: "#2563eb",
    border: "border-blue-400",
    bg: "bg-blue-50",
    features: [
      "Everything in Basic",
      "Featured placement at top of directory",
      "Gold 'FEATURED' badge on listing",
      "Post a weekly promo or special offer",
      "Priority visibility over free listings",
      "Click & view analytics",
    ],
  },
  {
    id: "guest_featured_monthly" as const,
    icon: "👑",
    name: "Featured Monthly",
    price: "$250",
    period: "/month",
    tagline: "Maximum exposure all month",
    color: "#b45309",
    border: "border-yellow-400",
    bg: "bg-yellow-50",
    popular: true,
    features: [
      "Everything in Featured Weekly",
      "Top-of-directory placement all month long",
      "4 weekly promo post slots",
      "Highlighted gold listing card",
      "Promoted to all active members",
      "Full analytics dashboard",
    ],
  },
];

export default function Advertise() {
  const { toast } = useToast();
  const [selectedPkg, setSelectedPkg] = useState<"guest_basic" | "guest_featured_weekly" | "guest_featured_monthly">("guest_featured_monthly");
  const [formVisible, setFormVisible] = useState(false);

  const form = useForm<GuestForm>({
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
      packageType: "guest_featured_monthly",
    },
  });

  const adMutation = useMutation({
    mutationFn: async (data: GuestForm) => {
      const res = await apiRequest("POST", "/api/marketplace/guest-ad-session", data);
      return res.json();
    },
    onSuccess: (data) => {
      if (data.url) window.location.href = data.url;
    },
    onError: () => toast({ title: "Error", description: "Could not start checkout. Please try again.", variant: "destructive" }),
  });

  const onSubmit = (data: GuestForm) => adMutation.mutate({ ...data, packageType: selectedPkg });

  const scrollToForm = (pkg: typeof selectedPkg) => {
    setSelectedPkg(pkg);
    form.setValue("packageType", pkg);
    setFormVisible(true);
    setTimeout(() => document.getElementById("ad-form")?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const selectedPackage = PACKAGES.find(p => p.id === selectedPkg)!;

  return (
    <div className="min-h-screen bg-white">

      {/* TOP NAV */}
      <nav className="border-b border-gray-100 py-4 px-6 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-50 shadow-sm">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" style={{ backgroundColor: "#001f3f", color: "#FFD700" }}>FR</div>
            <span className="font-bold text-gray-900">The FR2P Club</span>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/marketplace">
            <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-1">
              <Store className="w-4 h-4" /> View Directory
            </Button>
          </Link>
          <Link href="/join">
            <Button size="sm" style={{ backgroundColor: "#001f3f", color: "white" }}>
              Join as Member
            </Button>
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <div className="text-white py-16 px-6 text-center" style={{ background: "linear-gradient(135deg, #001f3f 0%, #003366 100%)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Megaphone className="w-8 h-8 text-yellow-400" />
            <Badge className="text-sm px-3 py-1 bg-yellow-400 text-yellow-900 font-bold">Advertise With Us</Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Put Your Business in Front of <span style={{ color: "#FFD700" }}>The FR2P Club</span>
          </h1>
          <p className="text-blue-200 text-xl mb-3">
            Our members are entrepreneurs, hustlers, and financially motivated individuals — exactly who you want seeing your business.
          </p>
          <p className="text-blue-300 text-base mb-8 flex items-center justify-center gap-2">
            <Users className="w-5 h-5" />
            No membership required. Pick a package, submit your info, and you're live.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="font-bold text-lg px-8 py-6" style={{ backgroundColor: "#FFD700", color: "#001f3f" }}
              onClick={() => scrollToForm("guest_featured_monthly")}>
              Advertise Now <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Link href="/marketplace">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white/40 text-white hover:bg-white/10">
                <Eye className="w-5 h-5 mr-2" /> See the Directory
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* WHY ADVERTISE HERE */}
      <div className="py-14 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2" style={{ color: "#001f3f" }}>Why Advertise on The FR2P Club?</h2>
          <p className="text-gray-500 text-center mb-10">Our community is built on financial growth and entrepreneurship — your ideal audience.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Users className="w-7 h-7" style={{ color: "#FFD700" }} />,
                title: "Entrepreneurial Audience",
                body: "The FR2P Club members are actively building income streams and businesses. They're motivated to spend, invest, and grow.",
              },
              {
                icon: <TrendingUp className="w-7 h-7" style={{ color: "#FFD700" }} />,
                title: "Growing Community",
                body: "The platform is growing month over month. Every new member who joins is another set of eyes on your listing.",
              },
              {
                icon: <Eye className="w-7 h-7" style={{ color: "#FFD700" }} />,
                title: "Direct Visibility",
                body: "Your business is listed in the member marketplace — visible to every logged-in member. No algorithms, no guessing.",
              },
            ].map(item => (
              <Card key={item.title} className="border border-gray-200">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: "#001f3f" }}>
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* PACKAGES */}
      <div className="py-14 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2" style={{ color: "#001f3f" }}>Advertising Packages</h2>
          <p className="text-gray-500 text-center mb-10">No membership required. Pick the exposure level that works for you.</p>

          <div className="grid md:grid-cols-3 gap-6">
            {PACKAGES.map(pkg => (
              <div key={pkg.id}
                className={`relative rounded-2xl border-2 ${pkg.border} ${pkg.bg} p-6 cursor-pointer transition-all hover:shadow-lg ${selectedPkg === pkg.id ? "ring-4 ring-offset-2" : ""}`}
                style={selectedPkg === pkg.id ? { ringColor: pkg.color } : {}}
                onClick={() => scrollToForm(pkg.id)}>
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="px-4 py-1 font-bold" style={{ backgroundColor: "#FFD700", color: "#001f3f" }}>
                      <Star className="w-3.5 h-3.5 mr-1" />MOST POPULAR
                    </Badge>
                  </div>
                )}
                <div className="text-center mb-5">
                  <div className="text-4xl mb-2">{pkg.icon}</div>
                  <h3 className="font-bold text-xl text-gray-900">{pkg.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{pkg.tagline}</p>
                  <div className="mt-3">
                    <span className="text-3xl font-bold" style={{ color: pkg.color }}>{pkg.price}</span>
                    <span className="text-gray-500 text-sm">{pkg.period}</span>
                  </div>
                </div>
                <ul className="space-y-2 mb-6">
                  {pkg.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: pkg.color }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button className="w-full font-bold" style={{ backgroundColor: pkg.color === "#b45309" ? "#FFD700" : pkg.color, color: pkg.color === "#b45309" ? "#001f3f" : "white" }}>
                  Select {pkg.name}
                </Button>
              </div>
            ))}
          </div>

          {/* Member comparison nudge */}
          <div className="mt-8 rounded-xl border-2 p-5 flex flex-col md:flex-row items-center gap-4 text-center md:text-left" style={{ borderColor: "#001f3f", backgroundColor: "#f0f4ff" }}>
            <div className="text-3xl">💡</div>
            <div className="flex-1">
              <p className="font-bold text-gray-900">Did you know? Members advertise for free.</p>
              <p className="text-gray-600 text-sm mt-1">
                The FR2P Club membership is $35/month and includes a free business listing — plus a reward structure offering potential earnings of $5/month for every person you refer. 
                Most members cover their membership cost with just 7 referrals.
              </p>
            </div>
            <Link href="/join">
              <Button style={{ backgroundColor: "#001f3f", color: "white" }} className="shrink-0">
                Join Instead — $35/mo <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* AD FORM */}
      <div id="ad-form" className="py-14 px-6 scroll-mt-20" style={{ background: "linear-gradient(135deg, #001f3f 0%, #003366 100%)" }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Crown className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-white mb-2">Submit Your Business & Choose a Package</h2>
            <p className="text-blue-200">Fill out your business info below, then proceed to secure Stripe checkout.</p>
          </div>

          {/* Package selector */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            {PACKAGES.map(p => (
              <button key={p.id} type="button"
                className={`flex-1 rounded-xl p-3 text-sm font-semibold border-2 transition-all text-center ${selectedPkg === p.id ? "border-yellow-400 bg-yellow-400 text-yellow-900" : "border-white/30 text-white hover:border-white/60"}`}
                onClick={() => { setSelectedPkg(p.id); form.setValue("packageType", p.id); }}>
                {p.icon} {p.name}<br />
                <span className="font-bold text-base">{p.price}</span><span className="font-normal text-xs">{p.period}</span>
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="advertiserName" render={({ field }) => (
                    <FormItem><FormLabel>Your Name *</FormLabel>
                      <FormControl><Input placeholder="Full name" {...field} /></FormControl>
                      <FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="advertiserEmail" render={({ field }) => (
                    <FormItem><FormLabel>Your Email *</FormLabel>
                      <FormControl><Input placeholder="you@email.com" type="email" {...field} /></FormControl>
                      <FormMessage /></FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="businessName" render={({ field }) => (
                    <FormItem><FormLabel>Business Name *</FormLabel>
                      <FormControl><Input placeholder="Your Business Name" {...field} /></FormControl>
                      <FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem><FormLabel>Category *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger></FormControl>
                        <SelectContent>
                          {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="tagline" render={({ field }) => (
                  <FormItem><FormLabel>Tagline <span className="text-gray-400 font-normal">(optional)</span></FormLabel>
                    <FormControl><Input placeholder="Short catchy phrase about your business" {...field} /></FormControl>
                    <FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>Business Description *</FormLabel>
                    <FormControl><Textarea placeholder="Describe what your business offers, who you serve, and why people should reach out..." rows={3} {...field} /></FormControl>
                    <FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-3 gap-4">
                  <FormField control={form.control} name="website" render={({ field }) => (
                    <FormItem><FormLabel>Website</FormLabel>
                      <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                      <FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem><FormLabel>Phone</FormLabel>
                      <FormControl><Input placeholder="(555) 000-0000" {...field} /></FormControl>
                      <FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Contact Email</FormLabel>
                      <FormControl><Input placeholder="contact@biz.com" {...field} /></FormControl>
                      <FormMessage /></FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem><FormLabel>City</FormLabel>
                      <FormControl><Input placeholder="City" {...field} /></FormControl>
                      <FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="state" render={({ field }) => (
                    <FormItem><FormLabel>State</FormLabel>
                      <FormControl><Input placeholder="State" {...field} /></FormControl>
                      <FormMessage /></FormItem>
                  )} />
                </div>
                {(selectedPkg === "guest_featured_weekly" || selectedPkg === "guest_featured_monthly") && (
                  <FormField control={form.control} name="weeklyPromo" render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Promo / Special Offer
                        <Badge className="ml-2 bg-yellow-400 text-yellow-900 text-xs">Featured tier</Badge>
                      </FormLabel>
                      <FormControl><Textarea placeholder="e.g. '15% off for The FR2P Club members this week' or 'Free first consultation — mention FR2P'" rows={2} {...field} /></FormControl>
                      <FormMessage /></FormItem>
                  )} />
                )}

                {/* Order Summary */}
                <div className="rounded-xl p-4 border-2 mt-2" style={{ borderColor: "#001f3f", backgroundColor: "#f8faff" }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-gray-900">{selectedPackage.icon} {selectedPackage.name}</div>
                      <div className="text-sm text-gray-500">{selectedPackage.tagline}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold" style={{ color: "#001f3f" }}>{selectedPackage.price}</div>
                      <div className="text-xs text-gray-500">{selectedPackage.period}</div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 border-t border-gray-100 pt-2">
                    You'll be redirected to our secure Stripe checkout after submitting. Your listing goes live once payment is confirmed.
                  </p>
                </div>

                <Button type="submit" size="lg" className="w-full font-bold text-lg py-6"
                  style={{ backgroundColor: "#FFD700", color: "#001f3f" }}
                  disabled={adMutation.isPending}>
                  {adMutation.isPending ? "Redirecting to Checkout..." : `Continue to Payment → ${selectedPackage.price}${selectedPackage.period}`}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="py-8 px-6 bg-gray-900 text-center">
        <p className="text-gray-400 text-sm">
          The FR2P Club Member Marketplace ·{" "}
          <Link href="/marketplace" className="text-yellow-400 hover:underline">View Directory</Link> ·{" "}
          <Link href="/join" className="text-yellow-400 hover:underline">Join as Member</Link> ·{" "}
          <Link href="/why-join" className="text-yellow-400 hover:underline">Why Join?</Link>
        </p>
        <p className="text-gray-600 text-xs mt-2">Part of The Consolidatus Empire · Founded by Derrick Taylor</p>
      </div>
    </div>
  );
}
