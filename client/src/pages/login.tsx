import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { setLoggedInMember } from "@/lib/auth";
import { LogIn, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast({ title: "Please enter your username and password.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast({ title: data.message || "Invalid username or password.", variant: "destructive" });
        return;
      }

      const member = data.member;
      const fullName = [member.firstName, member.lastName].filter(Boolean).join(" ") || member.username;
      setLoggedInMember(member.id, member.username, fullName);

      toast({ title: `Welcome back, ${member.firstName || member.username}!` });
      window.location.href = "/";
    } catch {
      toast({ title: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001f3f] to-[#003366] flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <img src="/fr2p-logo.jpeg" alt="The FR2P Club" className="w-20 h-20 rounded-full border-4 border-[#FFD700] mx-auto shadow-lg" />
          <h1 className="text-3xl font-bold text-[#FFD700]">Member Sign In</h1>
          <p className="text-white/70">Welcome back to The FR2P Club</p>
        </div>

        <Card className="bg-white/5 border border-[#FFD700]/20 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white text-center text-lg">Sign In to Your Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-white/80">Username</Label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#FFD700]"
                  autoComplete="username"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#FFD700] pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FFD700] text-[#001f3f] font-bold hover:bg-yellow-300 transition-colors py-3 text-base"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#001f3f]" />
                    Signing In...
                  </span>
                ) : (
                  <span className="flex items-center gap-2 justify-center">
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center space-y-3">
          <p className="text-white/60 text-sm">Don't have an account yet?</p>
          <a href="/join">
            <Button variant="outline" className="border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700]/10">
              Join The FR2P Club
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
