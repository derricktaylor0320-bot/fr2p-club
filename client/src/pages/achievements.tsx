import { useQuery, useMutation } from "@tanstack/react-query";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Download, Trophy, Award, Star, Crown, Gem, Lock } from "lucide-react";
import { format } from "date-fns";

import { getLoggedInMemberId } from "@/lib/auth";
const DEMO_USER_ID = getLoggedInMemberId();

interface Achievement {
  id: string;
  memberId: string;
  tier: string;
  earnedAt: string;
  certificateUrl: string | null;
  memberName: string;
  tierName: string;
}

const TIER_INFO = {
  bronze: {
    icon: Trophy,
    color: "from-amber-700 to-amber-900",
    requirement: "5 direct referrals",
    circle: "1st Circle of Influence",
    badge: "bg-amber-700 text-white",
  },
  silver: {
    icon: Award,
    color: "from-slate-400 to-slate-600",
    requirement: "25 direct referrals",
    circle: "2nd Circle of Influence",
    badge: "bg-slate-500 text-white",
  },
  gold: {
    icon: Star,
    color: "from-gold-400 to-gold-600",
    requirement: "125 direct referrals",
    circle: "3rd Circle of Influence",
    badge: "bg-gold-500 text-navy-900",
  },
  platinum: {
    icon: Crown,
    color: "from-platinum-400 to-platinum-600",
    requirement: "625 direct referrals",
    circle: "4th Circle of Influence",
    badge: "bg-platinum-500 text-navy-900",
  },
  diamond: {
    icon: Gem,
    color: "from-cyan-400 to-blue-600",
    requirement: "3,125 direct referrals",
    circle: "5th Circle of Influence - Complete Network",
    badge: "bg-gradient-to-r from-cyan-400 to-blue-600 text-white",
  },
};

export default function Achievements() {
  const { toast } = useToast();

  const { data: memberData } = useQuery<{ member: { firstName: string; lastName: string; totalSales: number } }>({
    queryKey: [`/api/member/${DEMO_USER_ID}`],
  });

  const { data: achievementsData, isLoading } = useQuery<{ success: boolean; achievements: Achievement[] }>({
    queryKey: [`/api/achievements/${DEMO_USER_ID}`],
  });

  const checkAchievementsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/achievements/${DEMO_USER_ID}/check`);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`/api/achievements/${DEMO_USER_ID}`] });
      if (data.newAchievements && data.newAchievements.length > 0) {
        toast({
          title: "New Achievement Unlocked!",
          description: data.message,
        });
      } else {
        toast({
          title: "All Caught Up",
          description: data.message,
        });
      }
    },
  });

  const handleDownloadCertificate = async (achievement: Achievement) => {
    try {
      // Fetch the PDF as a blob
      const pdfUrl = `/api/achievements/${achievement.memberId}/certificate/${achievement.tier}`;
      const response = await fetch(pdfUrl);
      
      if (!response.ok) {
        throw new Error("Failed to generate certificate");
      }
      
      // Get the PDF blob
      const blob = await response.blob();
      
      // Create object URL and download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `FR2P_${achievement.tierName}_Certificate_${achievement.memberName.replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Certificate Downloaded",
        description: `Your ${achievement.tierName} Affiliate Ambassador PDF certificate has been downloaded.`,
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description: "Failed to download certificate. Please try again.",
        variant: "destructive",
      });
    }
  };

  const earnedTiers = new Set(achievementsData?.achievements.map(a => a.tier) || []);
  const allTiers = ["bronze", "silver", "gold", "platinum", "diamond"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 flex">
      <SidebarNav />
      <main className="flex-1 p-6 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gold-400 mb-2">
                  Achievement Certificates
                </h1>
                <p className="text-gold-200 text-lg">
                  Your journey through the 5 circles of influence
                </p>
              </div>
              <Button
                onClick={() => checkAchievementsMutation.mutate()}
                disabled={checkAchievementsMutation.isPending}
                className="bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold"
                data-testid="button-check-achievements"
              >
                {checkAchievementsMutation.isPending ? "Checking..." : "Check for New Achievements"}
              </Button>
            </div>
            <div className="h-1 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full w-full"></div>
          </div>

          {/* Statistics Card */}
          <Card className="mb-8 bg-gradient-to-br from-navy-800 to-navy-900 border-2 border-gold-500">
            <CardHeader>
              <CardTitle className="text-gold-400 flex items-center gap-2">
                <Trophy className="w-6 h-6" />
                Your Progress
              </CardTitle>
              <CardDescription className="text-gold-200">
                Track your achievements across the 5-tier affiliate ambassador system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gold-500/10 border border-gold-500 rounded-lg">
                  <div className="text-3xl font-bold text-gold-400">
                    {achievementsData?.achievements.length || 0} / 5
                  </div>
                  <div className="text-gold-200 text-sm mt-1">Tiers Unlocked</div>
                </div>
                <div className="text-center p-4 bg-gold-500/10 border border-gold-500 rounded-lg">
                  <div className="text-3xl font-bold text-gold-400">
                    {memberData?.member.totalSales || 0}
                  </div>
                  <div className="text-gold-200 text-sm mt-1">Direct Referrals</div>
                </div>
                <div className="text-center p-4 bg-gold-500/10 border border-gold-500 rounded-lg">
                  <div className="text-3xl font-bold text-gold-400">
                    {achievementsData?.achievements.length === 5 ? "100%" : `${Math.round(((achievementsData?.achievements.length || 0) / 5) * 100)}%`}
                  </div>
                  <div className="text-gold-200 text-sm mt-1">Progress</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {allTiers.map((tier) => {
              const achievement = achievementsData?.achievements.find(a => a.tier === tier);
              const isEarned = earnedTiers.has(tier);
              const info = TIER_INFO[tier as keyof typeof TIER_INFO];
              const Icon = info.icon;

              return (
                <Card
                  key={tier}
                  className={`${
                    isEarned
                      ? `bg-gradient-to-br ${info.color} border-2 border-gold-400`
                      : "bg-navy-800/50 border-2 border-navy-700"
                  } transition-all hover:scale-105`}
                  data-testid={`card-achievement-${tier}`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-full ${isEarned ? "bg-white/20" : "bg-navy-700"}`}>
                          {isEarned ? (
                            <Icon className="w-6 h-6 text-white" />
                          ) : (
                            <Lock className="w-6 h-6 text-navy-500" />
                          )}
                        </div>
                        <div>
                          <CardTitle className={`${isEarned ? "text-white" : "text-navy-400"}`}>
                            {tier.charAt(0).toUpperCase() + tier.slice(1)} Affiliate Ambassador
                          </CardTitle>
                          <CardDescription className={`${isEarned ? "text-white/80" : "text-navy-500"}`}>
                            {info.circle}
                          </CardDescription>
                        </div>
                      </div>
                      {isEarned && (
                        <Badge className={info.badge}>
                          Earned
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className={`text-sm ${isEarned ? "text-white/80" : "text-navy-400"} mb-1`}>
                          Requirement:
                        </div>
                        <div className={`font-semibold ${isEarned ? "text-white" : "text-navy-500"}`}>
                          {info.requirement}
                        </div>
                      </div>

                      {isEarned && achievement && (
                        <div>
                          <div className="text-sm text-white/80 mb-1">
                            Earned on:
                          </div>
                          <div className="font-semibold text-white">
                            {format(new Date(achievement.earnedAt), "MMMM d, yyyy")}
                          </div>
                        </div>
                      )}

                      {isEarned && achievement ? (
                        <div className="space-y-3">
                          {/* Certificate Preview Card */}
                          <div className="bg-gradient-to-br from-navy-900 to-navy-800 border-2 border-gold-400 rounded-lg p-6 text-center">
                            <div className="flex justify-center mb-3">
                              <Award className="w-16 h-16 text-gold-400" />
                            </div>
                            <div className="text-gold-400 font-bold text-sm mb-1">
                              PDF Certificate Ready
                            </div>
                            <div className="text-white text-xs">
                              Navy & Gold • Personalized • Professional
                            </div>
                          </div>
                          
                          <Button
                            onClick={() => handleDownloadCertificate(achievement)}
                            className="w-full bg-gold-400 hover:bg-gold-500 text-navy-900 font-bold"
                            data-testid={`button-download-${tier}`}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF Certificate
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center py-6 border-2 border-dashed border-navy-600 rounded-lg">
                          <Lock className="w-12 h-12 text-navy-500 mx-auto mb-2" />
                          <div className="text-navy-400 text-sm">
                            Complete {info.requirement} to unlock
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Motivational Section */}
          {achievementsData && achievementsData.achievements.length < 5 && (
            <Card className="mt-8 bg-gradient-to-br from-gold-400 to-gold-600 border-2 border-gold-500">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Trophy className="w-8 h-8 text-navy-900 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-navy-900 mb-2">
                      Keep Building Your Network!
                    </h3>
                    <p className="text-navy-800">
                      You're {achievementsData.achievements.length} tier{achievementsData.achievements.length !== 1 ? "s" : ""} into your FR2P journey. 
                      Each achievement represents your dedication to building a successful affiliate network. 
                      Share your referral link and watch your network grow!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {achievementsData && achievementsData.achievements.length === 5 && (
            <Card className="mt-8 bg-gradient-to-br from-cyan-400 to-blue-600 border-2 border-cyan-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Gem className="w-8 h-8 text-white flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      🎉 Congratulations, Diamond Achiever!
                    </h3>
                    <p className="text-white/90">
                      You've completed all 5 circles of influence and unlocked every achievement in The FR2P Club! 
                      Your dedication and network-building skills have earned you the highest honor. 
                      Continue to lead and inspire others in the FR2P movement!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
