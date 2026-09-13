import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminAuth, getAdminHeaders } from "@/hooks/use-admin-auth";
import type { SiteVisit, CustomerFeedback } from "@shared/schema";
import {
  Building2, Users, Eye, Mail, MessageSquare, TrendingUp,
  Lock, RefreshCw, Crown, ShoppingBag, Rocket, Globe,
  UserCheck, UserX, Target, Clock, ExternalLink, CheckCircle2,
  AlertCircle, Sparkles
} from "lucide-react";

interface Venture {
  id: string;
  name: string;
  status: "live" | "coming_soon" | "external";
  metric: string;
  secondaryMetric?: string;
  url: string;
  isInternal: boolean;
}

interface EmpireDashboard {
  greeting: string;
  overview: {
    totalMembers: number;
    activeMembers: number;
    inactiveMembers: number;
    newMembersThisWeek: number;
    totalPageViews: number;
    uniqueVisitors: number;
    emailCaptures: number;
    newFeedback: number;
    loanApplications: number;
    days: number;
  };
  ventures: Venture[];
  prospectStats: {
    total: number;
    interested: number;
    joined: number;
    new: number;
    notInterested: number;
  };
  recentMembers: Array<{
    id: string;
    name: string;
    email: string;
    isActive: boolean;
    subscriptionStatus: string;
    joinDate: string;
    membershipPlan: string;
  }>;
  recentVisits: SiteVisit[];
  recentFeedback: CustomerFeedback[];
}

const STATUS_COLORS: Record<string, string> = {
  live: "bg-green-500/20 text-green-400 border-green-500/30",
  coming_soon: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  external: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

const FEEDBACK_STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500/20 text-blue-300",
  reviewed: "bg-amber-500/20 text-amber-300",
  responded: "bg-green-500/20 text-green-300",
  closed: "bg-white/10 text-white/50",
};

function formatTime(date: string | Date) {
  return new Date(date).toLocaleString("en-US", {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  });
}

export default function EmpireBackOffice() {
  const { adminKey, authenticated, login, logout } = useAdminAuth();
  const [keyInput, setKeyInput] = useState("");
  const [days, setDays] = useState(30);
  const [feedbackNotes, setFeedbackNotes] = useState<Record<string, string>>({});

  const { data, isLoading, error, refetch, isFetching } = useQuery<EmpireDashboard>({
    queryKey: ["/api/admin/empire-dashboard", adminKey, days],
    queryFn: async () => {
      const res = await fetch(`/api/admin/empire-dashboard?days=${days}`, {
        headers: getAdminHeaders(),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to load dashboard");
      }
      return res.json();
    },
    enabled: authenticated && !!adminKey,
    refetchInterval: 60000,
  });

  const updateFeedbackMutation = useMutation({
    mutationFn: async ({ id, status, adminNotes }: { id: string; status: string; adminNotes?: string }) => {
      const res = await fetch(`/api/admin/feedback/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getAdminHeaders() },
        body: JSON.stringify({ status, adminNotes }),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => refetch(),
  });

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020D3C] via-[#001f3f] to-[#020D3C]">
        <SidebarNav />
        <main className="lg:pl-64 p-6 flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md bg-white/5 border-[#FFD700]/20">
            <CardHeader className="text-center">
              <Building2 className="h-12 w-12 text-[#FFD700] mx-auto mb-2" />
              <CardTitle className="text-white text-xl">Consolidatus Empire Back Office</CardTitle>
              <p className="text-white/50 text-sm mt-2">
                Your centralized command center. Track visitors, members, sales interest, and customer feedback — all in one place.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="password"
                placeholder="Admin secret key"
                value={keyInput}
                onChange={e => setKeyInput(e.target.value)}
                className="bg-white/5 border-white/20 text-white"
                onKeyDown={e => e.key === "Enter" && keyInput.trim() && login(keyInput.trim())}
              />
              <Button onClick={() => login(keyInput.trim())} className="w-full bg-[#FFD700] text-[#001f3f] font-bold">
                <Lock className="h-4 w-4 mr-2" /> Enter Back Office
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const overview = data?.overview;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020D3C] via-[#001f3f] to-[#020D3C]">
      <SidebarNav />
      <main className="lg:pl-64 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="h-7 w-7 text-[#FFD700]" />
                <Badge className="bg-[#FFD700]/20 text-[#FFD700] border-[#FFD700]/30 text-xs">BACK OFFICE</Badge>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {data?.greeting || "Consolidatus Empire Back Office"}
              </h1>
              <p className="text-white/50 text-sm mt-1">
                Control everything from one hub — see what's working, who's visiting, who's buying, and what people want more of.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <select value={days} onChange={e => setDays(Number(e.target.value))}
                className="bg-white/5 border border-white/20 text-white text-sm rounded-md px-3 py-2">
                <option value={1}>Last 24 hours</option>
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
              <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}
                className="border-white/20 text-white hover:bg-white/10">
                <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              </Button>
              <Button variant="ghost" size="sm" onClick={logout} className="text-white/50">Logout</Button>
            </div>
          </div>

          {isLoading && <div className="text-center py-20 text-white/40">Loading your empire dashboard...</div>}
          {error && (
            <Card className="bg-red-500/10 border-red-500/30 mb-6">
              <CardContent className="p-4 text-red-300 text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {(error as Error).message}
                <Button variant="ghost" size="sm" onClick={logout} className="ml-auto text-red-300">Re-enter key</Button>
              </CardContent>
            </Card>
          )}

          {overview && (
            <>
              {/* Overview Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
                {[
                  { label: "Active Members", value: overview.activeMembers, icon: UserCheck, color: "text-green-400" },
                  { label: "Total Members", value: overview.totalMembers, icon: Users, color: "text-blue-400" },
                  { label: "New This Week", value: overview.newMembersThisWeek, icon: Sparkles, color: "text-[#FFD700]" },
                  { label: "Page Views", value: overview.totalPageViews, icon: Eye, color: "text-purple-400" },
                  { label: "Unique Visitors", value: overview.uniqueVisitors, icon: Globe, color: "text-cyan-400" },
                  { label: "New Feedback", value: overview.newFeedback, icon: MessageSquare, color: "text-orange-400" },
                ].map(stat => (
                  <Card key={stat.label} className="bg-white/5 border-white/10">
                    <CardContent className="p-3">
                      <stat.icon className={`h-4 w-4 ${stat.color} mb-1`} />
                      <p className="text-white/40 text-[10px] uppercase tracking-wide">{stat.label}</p>
                      <p className="text-xl font-bold text-white">{stat.value.toLocaleString()}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Tabs defaultValue="ventures" className="space-y-4">
                <TabsList className="bg-white/5 border border-white/10 flex-wrap h-auto gap-1 p-1">
                  <TabsTrigger value="ventures" className="data-[state=active]:bg-[#FFD700] data-[state=active]:text-[#001f3f]">Empire Ventures</TabsTrigger>
                  <TabsTrigger value="visitors" className="data-[state=active]:bg-[#FFD700] data-[state=active]:text-[#001f3f]">Visitors</TabsTrigger>
                  <TabsTrigger value="members" className="data-[state=active]:bg-[#FFD700] data-[state=active]:text-[#001f3f]">Members & Buyers</TabsTrigger>
                  <TabsTrigger value="leads" className="data-[state=active]:bg-[#FFD700] data-[state=active]:text-[#001f3f]">Leads & Interest</TabsTrigger>
                  <TabsTrigger value="feedback" className="data-[state=active]:bg-[#FFD700] data-[state=active]:text-[#001f3f]">
                    Customer Service
                    {overview.newFeedback > 0 && (
                      <Badge className="ml-1.5 bg-red-500 text-white text-[10px] px-1.5">{overview.newFeedback}</Badge>
                    )}
                  </TabsTrigger>
                </TabsList>

                {/* Ventures Tab */}
                <TabsContent value="ventures">
                  <div className="grid md:grid-cols-2 gap-4">
                    {data?.ventures.map(venture => (
                      <Card key={venture.id} className="bg-white/5 border-white/10 hover:border-[#FFD700]/30 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-white font-bold">{venture.name}</h3>
                              <p className="text-white/60 text-sm">{venture.metric}</p>
                              {venture.secondaryMetric && (
                                <p className="text-white/40 text-xs">{venture.secondaryMetric}</p>
                              )}
                            </div>
                            <Badge className={STATUS_COLORS[venture.status]}>
                              {venture.status === "live" ? "Live" : venture.status === "coming_soon" ? "Coming Soon" : "External"}
                            </Badge>
                          </div>
                          {venture.isInternal ? (
                            <Link href={venture.url}>
                              <Button size="sm" variant="outline" className="border-white/20 text-white/70 hover:bg-white/10 w-full mt-2">
                                Manage <ExternalLink className="h-3 w-3 ml-1" />
                              </Button>
                            </Link>
                          ) : (
                            <a href={venture.url} target="_blank" rel="noopener noreferrer">
                              <Button size="sm" variant="outline" className="border-white/20 text-white/70 hover:bg-white/10 w-full mt-2">
                                Visit Site <ExternalLink className="h-3 w-3 ml-1" />
                              </Button>
                            </a>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Visitors Tab */}
                <TabsContent value="visitors">
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-white text-base flex items-center gap-2">
                        <Eye className="h-4 w-4 text-[#FFD700]" /> Recent Site Activity
                        <span className="text-white/40 text-xs font-normal ml-2">
                          {overview.emailCaptures} emails captured in last {overview.days} days
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {!data?.recentVisits?.length ? (
                        <p className="text-white/40 text-sm text-center py-8">No visits recorded yet. Traffic will appear here as people browse your site.</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-white/40 text-xs uppercase border-b border-white/10">
                                <th className="text-left py-2 pr-3">Time</th>
                                <th className="text-left py-2 pr-3">Page</th>
                                <th className="text-left py-2 pr-3">Visitor</th>
                                <th className="text-left py-2">Device</th>
                              </tr>
                            </thead>
                            <tbody>
                              {data.recentVisits.map(v => (
                                <tr key={v.id} className="border-b border-white/5">
                                  <td className="py-2 pr-3 text-white/50 whitespace-nowrap">{formatTime(v.visitedAt)}</td>
                                  <td className="py-2 pr-3 text-white font-mono text-xs">{v.pagePath}</td>
                                  <td className="py-2 pr-3">
                                    {v.email ? (
                                      <span className="text-[#FFD700]">{v.email}</span>
                                    ) : v.memberId ? (
                                      <span className="text-green-400">Member</span>
                                    ) : (
                                      <span className="text-white/30 font-mono text-xs">{v.sessionId.slice(0, 10)}…</span>
                                    )}
                                  </td>
                                  <td className="py-2 text-white/40 text-xs">{v.browser || v.deviceType}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Members Tab */}
                <TabsContent value="members">
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <Card className="bg-green-500/10 border-green-500/20">
                      <CardContent className="p-4 flex items-center gap-3">
                        <UserCheck className="h-8 w-8 text-green-400" />
                        <div>
                          <p className="text-white/50 text-xs">Active / Paying</p>
                          <p className="text-2xl font-bold text-white">{overview.activeMembers}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-red-500/10 border-red-500/20">
                      <CardContent className="p-4 flex items-center gap-3">
                        <UserX className="h-8 w-8 text-red-400" />
                        <div>
                          <p className="text-white/50 text-xs">Inactive / Not Paying</p>
                          <p className="text-2xl font-bold text-white">{overview.inactiveMembers}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-[#FFD700]/10 border-[#FFD700]/20">
                      <CardContent className="p-4 flex items-center gap-3">
                        <TrendingUp className="h-8 w-8 text-[#FFD700]" />
                        <div>
                          <p className="text-white/50 text-xs">Joined This Week</p>
                          <p className="text-2xl font-bold text-white">{overview.newMembersThisWeek}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-white text-base">Recent Sign-Ups</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {data?.recentMembers.map(m => (
                          <div key={m.id} className="flex items-center justify-between py-2 border-b border-white/5 text-sm">
                            <div>
                              <span className="text-white font-medium">{m.name}</span>
                              <span className="text-white/40 ml-2">{m.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={m.isActive && m.subscriptionStatus === "active"
                                ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}>
                                {m.isActive && m.subscriptionStatus === "active" ? "Active" : "Inactive"}
                              </Badge>
                              <span className="text-white/30 text-xs">{formatTime(m.joinDate)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Leads Tab */}
                <TabsContent value="leads">
                  <div className="grid md:grid-cols-4 gap-3 mb-4">
                    {[
                      { label: "Total Prospects", value: data?.prospectStats.total, color: "text-blue-400" },
                      { label: "Interested", value: data?.prospectStats.interested, color: "text-orange-400" },
                      { label: "Joined", value: data?.prospectStats.joined, color: "text-green-400" },
                      { label: "Not Interested", value: data?.prospectStats.notInterested, color: "text-red-400" },
                    ].map(s => (
                      <Card key={s.label} className="bg-white/5 border-white/10">
                        <CardContent className="p-4 text-center">
                          <Target className={`h-5 w-5 ${s.color} mx-auto mb-1`} />
                          <p className="text-white/40 text-xs">{s.label}</p>
                          <p className="text-xl font-bold text-white">{s.value}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <p className="text-white/60 text-sm mb-3">
                        Prospect pipeline tracks warm and cold market contacts across all members.
                        Email captures from the site popup also appear in the Visitors tab.
                      </p>
                      <Link href="/prospects">
                        <Button className="bg-[#FFD700] text-[#001f3f] font-bold">
                          <Target className="h-4 w-4 mr-2" /> Open Prospect Manager
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Customer Service / Feedback Tab */}
                <TabsContent value="feedback">
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-white text-base flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-[#FFD700]" />
                        Customer Feedback — What People Want More Of
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {!data?.recentFeedback?.length ? (
                        <p className="text-white/40 text-sm text-center py-8">
                          No feedback yet. Add the feedback form to your public pages so visitors can tell you what they'd like to see.
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {data.recentFeedback.map(fb => (
                            <div key={fb.id} className="border border-white/10 rounded-lg p-4 bg-white/[0.02]">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div>
                                  <span className="text-white font-medium">{fb.name || fb.email}</span>
                                  {fb.name && <span className="text-white/40 text-sm ml-2">{fb.email}</span>}
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge className="bg-white/10 text-white/60 text-[10px]">{fb.venture || "General"}</Badge>
                                    <Badge className="bg-white/10 text-white/60 text-[10px]">{fb.category}</Badge>
                                    <Badge className={FEEDBACK_STATUS_COLORS[fb.status]}>{fb.status}</Badge>
                                  </div>
                                </div>
                                <span className="text-white/30 text-xs whitespace-nowrap">{formatTime(fb.createdAt)}</span>
                              </div>
                              <p className="text-white/80 text-sm mb-3">{fb.message}</p>
                              <div className="flex flex-col sm:flex-row gap-2">
                                <Textarea
                                  placeholder="Your notes (internal)"
                                  value={feedbackNotes[fb.id] ?? fb.adminNotes ?? ""}
                                  onChange={e => setFeedbackNotes(prev => ({ ...prev, [fb.id]: e.target.value }))}
                                  className="bg-white/5 border-white/20 text-white text-xs min-h-[60px] flex-1"
                                />
                                <div className="flex flex-col gap-1">
                                  <Button size="sm" onClick={() => updateFeedbackMutation.mutate({
                                    id: fb.id, status: "reviewed", adminNotes: feedbackNotes[fb.id] ?? fb.adminNotes,
                                  })} className="bg-amber-600 hover:bg-amber-700 text-white text-xs">
                                    <CheckCircle2 className="h-3 w-3 mr-1" /> Mark Reviewed
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => updateFeedbackMutation.mutate({
                                    id: fb.id, status: "closed", adminNotes: feedbackNotes[fb.id] ?? fb.adminNotes,
                                  })} className="border-white/20 text-white/60 text-xs">
                                    Close
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Quick Links */}
              <div className="mt-6 flex flex-wrap gap-2">
                <Link href="/empire"><Button variant="outline" size="sm" className="border-[#FFD700]/30 text-[#FFD700]"><Crown className="h-3.5 w-3.5 mr-1" /> Empire Hub</Button></Link>
                <Link href="/admin/visitors"><Button variant="outline" size="sm" className="border-white/20 text-white/60"><Eye className="h-3.5 w-3.5 mr-1" /> Detailed Visitor Log</Button></Link>
                <Link href="/admin/certificates"><Button variant="outline" size="sm" className="border-white/20 text-white/60"><ShoppingBag className="h-3.5 w-3.5 mr-1" /> Certificates</Button></Link>
                <a href="https://tceholdings.org" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="border-white/20 text-white/60"><Globe className="h-3.5 w-3.5 mr-1" /> TCE Holdings</Button>
                </a>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
