import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getLoggedInMemberId } from "@/lib/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Prospect } from "@shared/schema";
import {
  Target, Users, Thermometer, Phone, Mail, Plus, X,
  Edit2, Trash2, CheckCircle2, Clock, UserCheck, UserX,
  ChevronDown, Search, Filter, Globe, MessageSquare
} from "lucide-react";

const MEMBER_ID = getLoggedInMemberId();

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  new:            { label: "New",           color: "bg-blue-500/20 text-blue-300 border-blue-400/30",     icon: Clock },
  contacted:      { label: "Contacted",     color: "bg-yellow-500/20 text-yellow-300 border-yellow-400/30", icon: MessageSquare },
  interested:     { label: "Interested",    color: "bg-orange-500/20 text-orange-300 border-orange-400/30", icon: Target },
  joined:         { label: "Joined FR2P",   color: "bg-green-500/20 text-green-300 border-green-400/30",   icon: UserCheck },
  not_interested: { label: "Not Interested",color: "bg-red-500/20 text-red-300 border-red-400/30",         icon: UserX },
};

const PLATFORM_OPTIONS = ["Facebook", "Instagram", "LinkedIn", "Threads", "TikTok", "Twitter/X", "In Person", "Other"];
const MARKET_OPTIONS = ["warm", "cold"];

const emptyForm = {
  name: "", phone: "", email: "",
  socialPlatform: "", socialHandle: "",
  marketType: "warm", status: "new", notes: "", followUpDate: "",
};

export default function Prospects() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMarket, setFilterMarket] = useState("all");
  const [search, setSearch] = useState("");

  const { data: prospectList = [], isLoading } = useQuery<Prospect[]>({
    queryKey: ["/api/prospects", MEMBER_ID],
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/prospects", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prospects", MEMBER_ID] });
      setForm({ ...emptyForm });
      setShowForm(false);
      toast({ title: "Prospect added!", description: "They've been added to your tracker." });
    },
    onError: () => toast({ title: "Error", description: "Could not add prospect.", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiRequest("PATCH", `/api/prospects/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prospects", MEMBER_ID] });
      setEditingId(null);
      setForm({ ...emptyForm });
      setShowForm(false);
      toast({ title: "Updated!", description: "Prospect record saved." });
    },
    onError: () => toast({ title: "Error", description: "Could not update.", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/prospects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prospects", MEMBER_ID] });
      toast({ title: "Removed", description: "Prospect deleted." });
    },
  });

  const quickStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiRequest("PATCH", `/api/prospects/${id}`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/prospects", MEMBER_ID] }),
  });

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast({ title: "Name required", variant: "destructive" });
      return;
    }
    const payload = {
      ...form,
      memberId: MEMBER_ID,
      followUpDate: form.followUpDate ? new Date(form.followUpDate).toISOString() : null,
    };
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const startEdit = (p: Prospect) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      phone: p.phone || "",
      email: p.email || "",
      socialPlatform: p.socialPlatform || "",
      socialHandle: p.socialHandle || "",
      marketType: p.marketType,
      status: p.status,
      notes: p.notes || "",
      followUpDate: p.followUpDate ? new Date(p.followUpDate).toISOString().split("T")[0] : "",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ ...emptyForm });
  };

  const filtered = prospectList.filter(p => {
    if (filterStatus !== "all" && p.status !== filterStatus) return false;
    if (filterMarket !== "all" && p.marketType !== filterMarket) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    total: prospectList.length,
    warm: prospectList.filter(p => p.marketType === "warm").length,
    cold: prospectList.filter(p => p.marketType === "cold").length,
    joined: prospectList.filter(p => p.status === "joined").length,
    interested: prospectList.filter(p => p.status === "interested").length,
    new: prospectList.filter(p => p.status === "new").length,
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#001f3f" }}>
      <SidebarNav />
      <main className="flex-1 md:ml-64 p-4 md:p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFD700]/20 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-[#FFD700]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Prospect Manager</h1>
              <p className="text-white/50 text-sm">Track every person in your pipeline — warm market, cold market, follow-ups</p>
            </div>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-[#FFD700] hover:bg-yellow-300 text-[#001f3f] font-bold px-4 py-2.5 rounded-xl transition-colors text-sm"
            >
              <Plus className="w-4 h-4" /> Add Prospect
            </button>
          )}
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {[
            { label: "Total", value: counts.total, color: "text-white" },
            { label: "Warm Market", value: counts.warm, color: "text-red-300" },
            { label: "Cold Market", value: counts.cold, color: "text-blue-300" },
            { label: "New", value: counts.new, color: "text-blue-300" },
            { label: "Interested", value: counts.interested, color: "text-orange-300" },
            { label: "Joined FR2P", value: counts.joined, color: "text-green-300" },
          ].map(s => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-white/50 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Add / Edit Form */}
        {showForm && (
          <div className="bg-[#002a55] border-2 border-[#FFD700]/40 rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[#FFD700] font-bold text-lg">
                {editingId ? "Edit Prospect" : "Add New Prospect"}
              </h2>
              <button onClick={cancelForm} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div>
                <Label className="text-white/70 text-xs mb-1.5 block">Full Name *</Label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. John Smith"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/30" />
              </div>
              <div>
                <Label className="text-white/70 text-xs mb-1.5 block">Phone</Label>
                <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="(555) 000-0000"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/30" />
              </div>
              <div>
                <Label className="text-white/70 text-xs mb-1.5 block">Email</Label>
                <Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="email@example.com"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/30" />
              </div>
              <div>
                <Label className="text-white/70 text-xs mb-1.5 block">Social Platform</Label>
                <select value={form.socialPlatform}
                  onChange={e => setForm(f => ({ ...f, socialPlatform: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2 text-sm">
                  <option value="">Select platform</option>
                  {PLATFORM_OPTIONS.map(p => <option key={p} value={p} className="bg-[#001f3f]">{p}</option>)}
                </select>
              </div>
              <div>
                <Label className="text-white/70 text-xs mb-1.5 block">Social Handle / Profile</Label>
                <Input value={form.socialHandle} onChange={e => setForm(f => ({ ...f, socialHandle: e.target.value }))}
                  placeholder="@username or profile URL"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/30" />
              </div>
              <div>
                <Label className="text-white/70 text-xs mb-1.5 block">Follow-Up Date</Label>
                <Input type="date" value={form.followUpDate}
                  onChange={e => setForm(f => ({ ...f, followUpDate: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white" />
              </div>
              <div>
                <Label className="text-white/70 text-xs mb-1.5 block">Market Type</Label>
                <div className="flex gap-2">
                  {MARKET_OPTIONS.map(m => (
                    <button key={m} onClick={() => setForm(f => ({ ...f, marketType: m }))}
                      className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                        form.marketType === m
                          ? m === "warm" ? "bg-red-500/30 text-red-200 border-red-400" : "bg-blue-500/30 text-blue-200 border-blue-400"
                          : "bg-white/5 text-white/50 border-white/20"
                      }`}>
                      {m === "warm" ? "🔥 Warm" : "❄️ Cold"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-white/70 text-xs mb-1.5 block">Status</Label>
                <select value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2 text-sm">
                  {Object.entries(STATUS_CONFIG).map(([val, cfg]) =>
                    <option key={val} value={val} className="bg-[#001f3f]">{cfg.label}</option>
                  )}
                </select>
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <Label className="text-white/70 text-xs mb-1.5 block">Notes</Label>
                <Input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Any notes about this prospect..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/30" />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex items-center gap-2 bg-[#FFD700] hover:bg-yellow-300 disabled:opacity-50 text-[#001f3f] font-bold px-5 py-2.5 rounded-xl transition-colors text-sm">
                <CheckCircle2 className="w-4 h-4" />
                {editingId ? "Save Changes" : "Add Prospect"}
              </button>
              <button onClick={cancelForm}
                className="px-5 py-2.5 rounded-xl text-white/60 hover:text-white border border-white/20 hover:border-white/40 text-sm transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-5 items-center">
          <div className="relative flex-1 min-w-40 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <Input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name..."
              className="pl-9 bg-white/5 border-white/20 text-white placeholder:text-white/30 text-sm" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", ...Object.keys(STATUS_CONFIG)].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  filterStatus === s
                    ? "bg-[#FFD700] text-[#001f3f] border-[#FFD700]"
                    : "bg-white/5 text-white/50 border-white/20 hover:border-white/40"
                }`}>
                {s === "all" ? "All" : STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {["all", "warm", "cold"].map(m => (
              <button key={m} onClick={() => setFilterMarket(m)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  filterMarket === m
                    ? "bg-[#FFD700] text-[#001f3f] border-[#FFD700]"
                    : "bg-white/5 text-white/50 border-white/20 hover:border-white/40"
                }`}>
                {m === "all" ? "All Markets" : m === "warm" ? "🔥 Warm" : "❄️ Cold"}
              </button>
            ))}
          </div>
        </div>

        {/* Prospect List */}
        {isLoading ? (
          <div className="text-center py-16 text-white/40">Loading your prospects...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/40 text-lg font-semibold">
              {prospectList.length === 0 ? "No prospects yet" : "No prospects match your filter"}
            </p>
            <p className="text-white/30 text-sm mt-1">
              {prospectList.length === 0
                ? "Add your first prospect to start building your pipeline"
                : "Try adjusting your search or filters"}
            </p>
            {prospectList.length === 0 && (
              <button onClick={() => setShowForm(true)}
                className="mt-4 flex items-center gap-2 bg-[#FFD700] text-[#001f3f] font-bold px-5 py-2.5 rounded-xl text-sm mx-auto">
                <Plus className="w-4 h-4" /> Add Your First Prospect
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(p => {
              const StatusIcon = STATUS_CONFIG[p.status]?.icon || Clock;
              return (
                <div key={p.id}
                  className="bg-white/5 border border-white/10 hover:border-[#FFD700]/30 rounded-xl p-4 transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Avatar */}
                      <div className="w-10 h-10 bg-[#FFD700]/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-[#FFD700] font-black text-sm">
                          {p.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="text-white font-semibold text-sm">{p.name}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_CONFIG[p.status]?.color}`}>
                            <StatusIcon className="w-2.5 h-2.5 inline mr-1" />
                            {STATUS_CONFIG[p.status]?.label}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            p.marketType === "warm"
                              ? "bg-red-500/10 text-red-300 border-red-400/30"
                              : "bg-blue-500/10 text-blue-300 border-blue-400/30"
                          }`}>
                            {p.marketType === "warm" ? "🔥 Warm" : "❄️ Cold"}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/50">
                          {p.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{p.phone}</span>}
                          {p.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{p.email}</span>}
                          {p.socialPlatform && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{p.socialPlatform}{p.socialHandle ? ` · ${p.socialHandle}` : ""}</span>}
                          {p.followUpDate && (
                            <span className="flex items-center gap-1 text-yellow-400/70">
                              <Clock className="w-3 h-3" />Follow up: {new Date(p.followUpDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        {p.notes && (
                          <p className="text-white/40 text-xs mt-1.5 italic">"{p.notes}"</p>
                        )}

                        {/* Quick Status Buttons */}
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                            p.status !== val && (
                              <button key={val} onClick={() => quickStatusMutation.mutate({ id: p.id, status: val })}
                                className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40 hover:text-white border border-white/10 hover:border-white/30 transition-colors">
                                → {cfg.label}
                              </button>
                            )
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button onClick={() => startEdit(p)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => deleteMutation.mutate(p.id)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tips Footer */}
        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-[#FFD700] font-semibold text-sm mb-2">🔥 Warm Market Tips</p>
            <p className="text-white/60 text-xs leading-relaxed">Start with people who already know, like, and trust you — family, friends, coworkers, church members, neighbors. These are your easiest first 5 referrals. Update their status as you talk to them so no one falls through the cracks.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-[#FFD700] font-semibold text-sm mb-2">❄️ Cold Market Tips</p>
            <p className="text-white/60 text-xs leading-relaxed">Cold prospects are new connections you haven't built a relationship with yet. Use social media, community events, and networking. Always lead with value — share the why before the what. Move them to "Interested" before sending your referral link.</p>
          </div>
        </div>

      </main>
    </div>
  );
}
