import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Eye, Users, Mail, Globe, Monitor, Smartphone, Tablet,
  Lock, RefreshCw, TrendingUp, Clock
} from "lucide-react";
import type { SiteVisit } from "@shared/schema";

const ADMIN_KEY_STORAGE = "fr2p_admin_key";

interface VisitorStats {
  totalViews: number;
  uniqueSessions: number;
  emailCaptures: number;
  days: number;
}

interface VisitorDashboard {
  stats: VisitorStats;
  topPages: Array<{ pagePath: string; views: number }>;
  recentVisits: SiteVisit[];
}

async function fetchVisitors(adminKey: string, days: number): Promise<VisitorDashboard> {
  const res = await fetch(`/api/admin/visitors?days=${days}`, {
    headers: { "x-admin-key": adminKey },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to load visitor data");
  }
  return res.json();
}

function DeviceIcon({ type }: { type: string | null }) {
  if (type === "mobile") return <Smartphone className="h-3.5 w-3.5" />;
  if (type === "tablet") return <Tablet className="h-3.5 w-3.5" />;
  return <Monitor className="h-3.5 w-3.5" />;
}

function formatTime(date: string | Date) {
  return new Date(date).toLocaleString("en-US", {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  });
}

export default function AdminVisitors() {
  const [adminKey, setAdminKey] = useState(() => localStorage.getItem(ADMIN_KEY_STORAGE) || "");
  const [keyInput, setKeyInput] = useState("");
  const [days, setDays] = useState(30);
  const [authenticated, setAuthenticated] = useState(!!localStorage.getItem(ADMIN_KEY_STORAGE));

  const { data, isLoading, error, refetch, isFetching } = useQuery<VisitorDashboard>({
    queryKey: ["/api/admin/visitors", adminKey, days],
    queryFn: () => fetchVisitors(adminKey, days),
    enabled: authenticated && !!adminKey,
    refetchInterval: 60000,
  });

  const handleLogin = () => {
    if (!keyInput.trim()) return;
    localStorage.setItem(ADMIN_KEY_STORAGE, keyInput.trim());
    setAdminKey(keyInput.trim());
    setAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_KEY_STORAGE);
    setAdminKey("");
    setAuthenticated(false);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020D3C] via-[#001f3f] to-[#020D3C]">
        <SidebarNav />
        <main className="lg:pl-64 p-6 flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Lock className="h-5 w-5 text-[#FFD700]" /> Visitor Tracker — Admin Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/60 text-sm">
                Enter your admin secret key to view site visitor analytics.
              </p>
              <Input
                type="password"
                placeholder="Admin secret key"
                value={keyInput}
                onChange={e => setKeyInput(e.target.value)}
                className="bg-white/5 border-white/20 text-white"
                onKeyDown={e => e.key === "Enter" && handleLogin()}
              />
              <Button onClick={handleLogin} className="w-full bg-[#FFD700] text-[#001f3f] font-bold">
                Access Dashboard
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const stats = data?.stats;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020D3C] via-[#001f3f] to-[#020D3C]">
      <SidebarNav />
      <main className="lg:pl-64 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Eye className="h-7 w-7 text-[#FFD700]" /> Site Visitor Tracker
              </h1>
              <p className="text-white/50 text-sm mt-1">
                See who visits your site — pages viewed, devices, emails captured, and more.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={days}
                onChange={e => setDays(Number(e.target.value))}
                className="bg-white/5 border border-white/20 text-white text-sm rounded-md px-3 py-2"
              >
                <option value={1}>Last 24 hours</option>
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isFetching}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white/50">
                Logout
              </Button>
            </div>
          </div>

          {isLoading && (
            <div className="text-center py-20 text-white/40">Loading visitor data...</div>
          )}

          {error && (
            <Card className="bg-red-500/10 border-red-500/30">
              <CardContent className="p-4 text-red-300 text-sm">
                {(error as Error).message}
                <Button variant="ghost" size="sm" onClick={handleLogout} className="ml-2 text-red-300">
                  Re-enter key
                </Button>
              </CardContent>
            </Card>
          )}

          {stats && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-blue-500/20">
                      <Eye className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white/50 text-xs uppercase tracking-wide">Total Page Views</p>
                      <p className="text-2xl font-bold text-white">{stats.totalViews.toLocaleString()}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-green-500/20">
                      <Users className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white/50 text-xs uppercase tracking-wide">Unique Visitors</p>
                      <p className="text-2xl font-bold text-white">{stats.uniqueSessions.toLocaleString()}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-[#FFD700]/20">
                      <Mail className="h-6 w-6 text-[#FFD700]" />
                    </div>
                    <div>
                      <p className="text-white/50 text-xs uppercase tracking-wide">Emails Captured</p>
                      <p className="text-2xl font-bold text-white">{stats.emailCaptures.toLocaleString()}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {data?.topPages && data.topPages.length > 0 && (
                <Card className="bg-white/5 border-white/10 mb-6">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-base flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-[#FFD700]" /> Top Pages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {data.topPages.map((page, i) => (
                        <div key={page.pagePath} className="flex items-center justify-between text-sm">
                          <span className="text-white/80 font-mono">{page.pagePath}</span>
                          <Badge variant="secondary" className="bg-white/10 text-white/70">
                            {page.views} views
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-base flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#FFD700]" /> Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!data?.recentVisits?.length ? (
                    <p className="text-white/40 text-sm text-center py-8">No visits recorded yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-white/40 text-xs uppercase tracking-wide border-b border-white/10">
                            <th className="text-left py-2 pr-4">Time</th>
                            <th className="text-left py-2 pr-4">Page</th>
                            <th className="text-left py-2 pr-4">Visitor</th>
                            <th className="text-left py-2 pr-4">Device</th>
                            <th className="text-left py-2">Referrer</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.recentVisits.map(visit => (
                            <tr key={visit.id} className="border-b border-white/5 hover:bg-white/5">
                              <td className="py-2.5 pr-4 text-white/50 whitespace-nowrap">
                                {formatTime(visit.visitedAt)}
                              </td>
                              <td className="py-2.5 pr-4">
                                <span className="text-white font-mono text-xs">{visit.pagePath}</span>
                                {visit.eventType === "email_capture" && (
                                  <Badge className="ml-2 bg-[#FFD700]/20 text-[#FFD700] text-[10px]">Email</Badge>
                                )}
                              </td>
                              <td className="py-2.5 pr-4">
                                {visit.email ? (
                                  <span className="text-[#FFD700] font-medium">{visit.email}</span>
                                ) : visit.memberId ? (
                                  <span className="text-green-400">Member</span>
                                ) : (
                                  <span className="text-white/30 font-mono text-xs">
                                    {visit.sessionId.slice(0, 12)}…
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 pr-4">
                                <span className="flex items-center gap-1 text-white/50">
                                  <DeviceIcon type={visit.deviceType} />
                                  {visit.browser || visit.deviceType}
                                </span>
                              </td>
                              <td className="py-2.5 text-white/30 text-xs truncate max-w-[150px]">
                                {visit.referrer ? (
                                  <span className="flex items-center gap-1">
                                    <Globe className="h-3 w-3 flex-shrink-0" />
                                    {(() => { try { return new URL(visit.referrer!).hostname; } catch { return visit.referrer; } })()}
                                  </span>
                                ) : "Direct"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>

              <p className="text-white/30 text-xs mt-4 text-center">
                Anonymous visitors are tracked by session ID. You'll see their email once they sign up or use the lead capture popup.
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
