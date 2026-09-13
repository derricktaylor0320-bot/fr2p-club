import { useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getLoggedInMemberId, isLoggedIn } from "@/lib/auth";

const VENTURES = [
  "The FR2P Club",
  "TCE Holdings",
  "Pocket Booster",
  "Khomplete Khemistri",
  "Empire Invest",
  "General / Other",
];

const CATEGORIES = [
  { value: "feature_request", label: "Feature Request — What I'd like to see more of" },
  { value: "general", label: "General Feedback" },
  { value: "support", label: "Need Help / Support" },
  { value: "praise", label: "Something I Love" },
  { value: "complaint", label: "Something to Improve" },
];

interface CustomerFeedbackFormProps {
  compact?: boolean;
}

export function CustomerFeedbackForm({ compact = false }: CustomerFeedbackFormProps) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [venture, setVenture] = useState("General / Other");
  const [category, setCategory] = useState("feature_request");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) {
      toast({ title: "Email and message are required", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || null,
          venture,
          category,
          message: message.trim(),
          pagePath: window.location.pathname,
          memberId: isLoggedIn() ? getLoggedInMemberId() : null,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      toast({ title: "Thank you!", description: "Your feedback helps us build a better empire." });
      setMessage("");
    } catch {
      toast({ title: "Could not send feedback", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input placeholder="Your email" type="email" required value={email} onChange={e => setEmail(e.target.value)}
          className="bg-white/5 border-white/20 text-white placeholder:text-white/30 text-sm" />
        <Textarea placeholder="What would you like to see more of?" required value={message} onChange={e => setMessage(e.target.value)}
          className="bg-white/5 border-white/20 text-white placeholder:text-white/30 text-sm min-h-[80px]" />
        <Button type="submit" disabled={submitting} size="sm" className="bg-[#FFD700] text-[#001f3f] font-bold w-full">
          <Send className="h-3.5 w-3.5 mr-1" /> {submitting ? "Sending..." : "Send Feedback"}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <Input placeholder="Your name (optional)" value={name} onChange={e => setName(e.target.value)}
          className="bg-white/5 border-white/20 text-white placeholder:text-white/30" />
        <Input placeholder="Your email" type="email" required value={email} onChange={e => setEmail(e.target.value)}
          className="bg-white/5 border-white/20 text-white placeholder:text-white/30" />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <select value={venture} onChange={e => setVenture(e.target.value)}
          className="bg-white/5 border border-white/20 text-white text-sm rounded-md px-3 py-2">
          {VENTURES.map(v => <option key={v} value={v} className="bg-[#001f3f]">{v}</option>)}
        </select>
        <select value={category} onChange={e => setCategory(e.target.value)}
          className="bg-white/5 border border-white/20 text-white text-sm rounded-md px-3 py-2">
          {CATEGORIES.map(c => <option key={c.value} value={c.value} className="bg-[#001f3f]">{c.label}</option>)}
        </select>
      </div>
      <Textarea placeholder="Tell us what you'd like to see more of, what's working, or how we can improve..."
        required value={message} onChange={e => setMessage(e.target.value)}
        className="bg-white/5 border-white/20 text-white placeholder:text-white/30 min-h-[120px]" />
      <Button type="submit" disabled={submitting} className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#001f3f] font-bold">
        <MessageSquare className="h-4 w-4 mr-2" />
        {submitting ? "Sending..." : "Submit Feedback"}
      </Button>
    </form>
  );
}
