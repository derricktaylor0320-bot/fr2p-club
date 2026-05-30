import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import type { Member } from "@shared/schema";

export default function JoinSuccess() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [member, setMember] = useState<Member | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const completeRegistration = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const sessionId = params.get("session_id");

        if (!sessionId) {
          setStatus("error");
          setError("No session ID found. Please try again.");
          return;
        }

        const response = await apiRequest("POST", "/api/complete-membership-registration", {
          sessionId,
        });

        const data = await response.json();

        if (data.success) {
          setMember(data.member);
          setStatus("success");
          
          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            setLocation(`/?memberId=${data.member.id}`);
          }, 3000);
        } else {
          setStatus("error");
          setError(data.message || "Failed to complete registration");
        }
      } catch (err: any) {
        setStatus("error");
        setError(err.message || "An error occurred during registration");
      }
    };

    completeRegistration();
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full">
        {status === "processing" && (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
              </div>
              <CardTitle className="text-2xl">Processing Your Registration</CardTitle>
              <CardDescription>
                Please wait while we set up your The FR2P Club account...
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              <p>This should only take a moment.</p>
            </CardContent>
          </>
        )}

        {status === "success" && member && (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <CheckCircle2 className="w-16 h-16 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Welcome to The FR2P Club!</CardTitle>
              <CardDescription>
                Your account has been successfully created
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <p className="text-lg font-semibold text-green-900 mb-2">
                  🎉 Payment Successful!
                </p>
                <p className="text-green-800">
                  Welcome, {member.firstName} {member.lastName}!
                </p>
              </div>

              <div className="space-y-3 text-center">
                <p className="text-muted-foreground">
                  Your account is now active. You'll be redirected to your dashboard in a few seconds...
                </p>
                <div className="space-y-2">
                  <p className="font-semibold">Your Account Details:</p>
                  <p className="text-sm">Username: <span className="font-mono text-blue-600">{member.username}</span></p>
                  <p className="text-sm">Member #{member.memberNumber}</p>
                  {member.isFoundingMember && (
                    <div className="inline-block bg-yellow-100 border-2 border-yellow-400 text-yellow-900 px-4 py-2 rounded-lg font-bold">
                      ⭐ FOUNDING MEMBER ⭐
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => setLocation(`/?memberId=${member.id}`)}
                  data-testid="button-goto-dashboard"
                >
                  Go to Dashboard Now
                </Button>
              </div>
            </CardContent>
          </>
        )}

        {status === "error" && (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <XCircle className="w-16 h-16 text-destructive" />
              </div>
              <CardTitle className="text-2xl">Registration Error</CardTitle>
              <CardDescription>
                There was a problem completing your registration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6">
                <p className="text-destructive text-center">{error}</p>
              </div>

              <div className="space-y-3 text-center text-muted-foreground">
                <p>Your payment was processed, but we encountered an error creating your account.</p>
                <p className="font-semibold">Please contact support with your payment confirmation.</p>
              </div>

              <div className="pt-4">
                <Button 
                  className="w-full"
                  variant="outline"
                  onClick={() => setLocation("/")}
                  data-testid="button-goto-home"
                >
                  Return to Home
                </Button>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
