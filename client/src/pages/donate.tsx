import { useState, useEffect } from "react";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, Heart, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Donate() {
  const [amount, setAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get("success");
    const canceled = params.get("canceled");

    if (success) {
      toast({
        title: "Thank You!",
        description: "Your donation has been received. We appreciate your support!",
      });
      window.history.replaceState({}, "", "/donate");
    } else if (canceled) {
      toast({
        title: "Donation Canceled",
        description: "Your donation was canceled. No charge was made.",
        variant: "destructive",
      });
      window.history.replaceState({}, "", "/donate");
    }
  }, [toast]);

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const donationAmount = parseFloat(amount);
    
    if (!donationAmount || donationAmount < 1) {
      toast({
        title: "Invalid Amount",
        description: "Please enter an amount of at least $1.00",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const response = await apiRequest("POST", "/api/create-donation-session", {
        amount: donationAmount,
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process donation",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const quickAmounts = [25, 50, 100, 250, 500, 1000];

  return (
    <div className="min-h-screen bg-secondary flex">
      <SidebarNav />
      <div className="flex-1 md:ml-64">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Support The FR2P Club
            </h1>
            <p className="text-muted-foreground">
              Invest in our mission to help others achieve financial prosperity
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-6 w-6 text-primary" />
                  <CardTitle>Make a Donation</CardTitle>
                </div>
                <CardDescription>
                  Your donation helps us build and grow the FR2P community. Any amount is appreciated!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDonate} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Donation Amount</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="amount"
                        type="number"
                        min="1"
                        step="0.01"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pl-9"
                        disabled={isProcessing}
                        data-testid="input-donation-amount"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">
                      Quick Select
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      {quickAmounts.map((quickAmount) => (
                        <Button
                          key={quickAmount}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setAmount(quickAmount.toString())}
                          disabled={isProcessing}
                          data-testid={`button-quick-amount-${quickAmount}`}
                        >
                          ${quickAmount}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={isProcessing}
                    data-testid="button-donate-submit"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Heart className="mr-2 h-4 w-4" />
                        Donate ${amount || "0.00"}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Why Donate?</CardTitle>
                <CardDescription>Your support makes a difference</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="bg-primary/10 rounded-full p-2 h-fit">
                    <Heart className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Build the Platform</h3>
                    <p className="text-sm text-muted-foreground">
                      Help us develop new features and improve the FR2P experience for all members.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="bg-primary/10 rounded-full p-2 h-fit">
                    <Heart className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Grow the Community</h3>
                    <p className="text-sm text-muted-foreground">
                      Support marketing and outreach efforts to help more people discover FR2P.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="bg-primary/10 rounded-full p-2 h-fit">
                    <Heart className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Strengthen Resources</h3>
                    <p className="text-sm text-muted-foreground">
                      Fund educational content and tools that help members succeed financially.
                    </p>
                  </div>
                </div>

                <div className="bg-muted rounded-lg p-4 mt-6">
                  <p className="text-sm text-center text-muted-foreground italic">
                    "Together we build the roadway to financial prosperity for everyone."
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6 bg-muted/50">
            <CardContent className="pt-6">
              <p className="text-sm text-center text-muted-foreground">
                All donations are processed securely through Stripe. Your financial information is never stored on our servers.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
