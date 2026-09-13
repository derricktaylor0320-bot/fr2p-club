import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { X, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { captureVisitorEmail, hasCapturedEmail } from "@/hooks/use-visitor-tracking";
import { isLoggedIn } from "@/lib/auth";

const LEAD_CAPTURE_PAGES = ["/join", "/why-join", "/empire", "/investments", "/pocket-booster", "/magazine"];
const DISMISSED_KEY = "fr2p_lead_popup_dismissed";

export function VisitorLeadCapture() {
  const [location] = useLocation();
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isLoggedIn() || hasCapturedEmail()) return;
    if (localStorage.getItem(DISMISSED_KEY)) return;
    if (!LEAD_CAPTURE_PAGES.some(p => location.startsWith(p))) return;

    const timer = setTimeout(() => setVisible(true), 8000);
    return () => clearTimeout(timer);
  }, [location]);

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem(DISMISSED_KEY, "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    try {
      await captureVisitorEmail(email.trim(), firstName.trim() || undefined);
      setSubmitted(true);
      setTimeout(() => setVisible(false), 2000);
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm mx-4 sm:mx-0 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-br from-[#001f3f] to-[#002855] border border-[#FFD700]/40 rounded-xl shadow-2xl shadow-black/50 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#FFD700]" />
              <span className="text-white font-bold text-sm">Stay Connected</span>
            </div>
            <button onClick={handleDismiss} className="text-white/40 hover:text-white/70 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          {submitted ? (
            <p className="text-green-400 text-sm font-medium">Thanks! We'll keep you updated.</p>
          ) : (
            <>
              <p className="text-white/70 text-sm mb-4">
                Get updates from The Consolidatus Empire — no purchase required.
              </p>
              <form onSubmit={handleSubmit} className="space-y-2">
                <Input
                  placeholder="First name (optional)"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/30 text-sm"
                />
                <Input
                  type="email"
                  required
                  placeholder="Your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/30 text-sm"
                />
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#001f3f] font-bold text-sm"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  {submitting ? "Saving..." : "Keep Me Updated"}
                </Button>
              </form>
              <p className="text-white/30 text-xs mt-2 text-center">We respect your privacy. Unsubscribe anytime.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
