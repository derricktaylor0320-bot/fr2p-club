import { useState } from "react";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users, ExternalLink, Target, Thermometer, MapPin, Phone,
  Mail, Maximize2, RefreshCw, BookOpen, Lightbulb, ChevronRight
} from "lucide-react";

const TOOL_URL = "https://prospect-identifier.replit.app";

export default function Prospects() {
  const [iframeError, setIframeError] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const tips = [
    {
      icon: <Thermometer className="w-5 h-5 text-red-400" />,
      title: "Warm Market First",
      body: "Start with people who already know, like, and trust you — family, friends, coworkers, church members, neighbors. These are your easiest first 7 referrals.",
    },
    {
      icon: <Target className="w-5 h-5 text-blue-400" />,
      title: "Cold Market Strategy",
      body: "Cold prospects are people you haven't connected with yet. Use social media, community events, and local networking. Always lead with value, not the pitch.",
    },
    {
      icon: <Users className="w-5 h-5 text-green-400" />,
      title: "The 'Get 5, Teach 5' Model",
      body: "You only need 5 direct referrals to reach Bronze. Then teach each of those 5 to get their own 5. That's the duplication engine behind The FR2P Club.",
    },
    {
      icon: <BookOpen className="w-5 h-5 text-yellow-400" />,
      title: "Track Every Prospect",
      body: "The biggest mistake in affiliate marketing is letting prospects fall through the cracks. Use the tool to log names, contact info, follow-up status, and market type for everyone you talk to.",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarNav />
      <main className={`flex-1 md:ml-64 ${fullscreen ? "p-0" : "p-6"}`}>

        {!fullscreen && (
          <>
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#001f3f" }}>
                  <Target className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold" style={{ color: "#001f3f" }}>Prospect Manager</h1>
                  <p className="text-gray-500 text-sm">Your built-in tool for tracking warm market, cold market, and follow-ups</p>
                </div>
                <Badge className="ml-auto bg-green-100 text-green-700 border border-green-200">Included with Membership</Badge>
              </div>
            </div>

            {/* Quick tip cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {tips.map(tip => (
                <Card key={tip.title} className="border border-gray-200 bg-white">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      {tip.icon}
                      <span className="font-semibold text-sm text-gray-900">{tip.title}</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{tip.body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Tool header bar */}
            <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-sm font-medium text-gray-700">Prospect Identifier Tool</span>
                <span className="text-xs text-gray-400">powered by The FR2P Club</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                  <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
                </Button>
                <Button variant="outline" size="sm" onClick={() => setFullscreen(true)}>
                  <Maximize2 className="w-3.5 h-3.5 mr-1" /> Full Screen
                </Button>
                <Button size="sm" style={{ backgroundColor: "#001f3f", color: "white" }}
                  onClick={() => window.open(TOOL_URL, "_blank")}>
                  <ExternalLink className="w-3.5 h-3.5 mr-1" /> Open in New Tab
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Fullscreen controls */}
        {fullscreen && (
          <div className="absolute top-4 right-4 z-50 flex gap-2">
            <Button size="sm" onClick={() => setFullscreen(false)} style={{ backgroundColor: "#001f3f", color: "white" }}>
              Exit Full Screen
            </Button>
            <Button size="sm" variant="outline" onClick={() => window.open(TOOL_URL, "_blank")}>
              <ExternalLink className="w-3.5 h-3.5 mr-1" /> New Tab
            </Button>
          </div>
        )}

        {/* Iframe embed */}
        {!iframeError ? (
          <div
            className={`rounded-xl overflow-hidden border-2 shadow-lg ${fullscreen ? "fixed inset-0 z-40 rounded-none border-0" : ""}`}
            style={{ borderColor: "#001f3f", height: fullscreen ? "100vh" : "70vh" }}
          >
            <iframe
              src={TOOL_URL}
              title="FR2P Prospect Identifier"
              className="w-full h-full"
              style={{ border: "none" }}
              onError={() => setIframeError(true)}
              allow="clipboard-write"
            />
          </div>
        ) : (
          /* Fallback if iframe is blocked */
          <Card className="border-2" style={{ borderColor: "#001f3f" }}>
            <CardHeader>
              <CardTitle style={{ color: "#001f3f" }}>Open the Prospect Manager</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                The Prospect Manager tool opens in a separate window for the best experience. Click below to launch it — your data saves automatically.
              </p>
              <Button size="lg" className="w-full font-bold text-base py-6"
                style={{ backgroundColor: "#FFD700", color: "#001f3f" }}
                onClick={() => window.open(TOOL_URL, "_blank")}>
                <Target className="w-5 h-5 mr-2" />
                Launch Prospect Manager
                <ExternalLink className="w-5 h-5 ml-2" />
              </Button>
              <div className="grid md:grid-cols-3 gap-4 pt-2">
                {[
                  { icon: <Thermometer className="w-5 h-5" />, label: "Warm Market", desc: "Friends, family, coworkers" },
                  { icon: <Target className="w-5 h-5" />, label: "Cold Market", desc: "New connections & leads" },
                  { icon: <MapPin className="w-5 h-5" />, label: "Track & Follow Up", desc: "Name, address, status" },
                ].map(item => (
                  <div key={item.label} className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex justify-center mb-2 text-yellow-500">{item.icon}</div>
                    <div className="font-semibold text-gray-900 text-sm">{item.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{item.desc}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bottom tips — only when not fullscreen */}
        {!fullscreen && (
          <div className="mt-6 grid md:grid-cols-2 gap-5">
            <Card className="border border-gray-200">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">How to use this with "Get 5, Teach 5"</h4>
                    <ol className="space-y-1.5 text-sm text-gray-600">
                      <li className="flex gap-2"><ChevronRight className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />Add every person you plan to talk to as a prospect</li>
                      <li className="flex gap-2"><ChevronRight className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />Label them Warm or Cold market</li>
                      <li className="flex gap-2"><ChevronRight className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />Log their contact info so no one falls through the cracks</li>
                      <li className="flex gap-2"><ChevronRight className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />Follow up consistently until you get your 5 — then teach them to do the same</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Market Type Definitions</h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="inline-flex items-center gap-1 font-medium text-red-600">
                          <Thermometer className="w-3.5 h-3.5" /> Warm Market
                        </span>
                        <p className="text-gray-600 text-xs mt-0.5">People who already know and trust you — family, close friends, church, colleagues, neighbors, social media followers.</p>
                      </div>
                      <div>
                        <span className="inline-flex items-center gap-1 font-medium text-blue-600">
                          <Target className="w-3.5 h-3.5" /> Cold Market
                        </span>
                        <p className="text-gray-600 text-xs mt-0.5">People you haven't built a relationship with yet — new connections, events, social media outreach, referrals from your warm market.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
