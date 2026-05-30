import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { MemberResponse, TierResponse } from "@shared/schema";
import { HeaderNav } from "@/components/ui/header-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import { Trophy, Star, Award } from "lucide-react";

import { getLoggedInMemberId } from "@/lib/auth";
const DEMO_USER_ID = getLoggedInMemberId();

// Type for circle multiplier rows
interface CircleRow {
  tier: string;
  tierLabel: string;
  baseNumber: number;
  multiplier: number;
  color: string;
  bgColor: string;
}

export default function Calculator() {
  const [circle1, setCircle1] = useState(5);
  const [circle2, setCircle2] = useState(5);
  const circle3 = circle1 * circle2;
  
  // Interactive 5-row Circle of Influence Multiplier - 15 boxes total (5 rows × 3 columns)
  const [circleRows, setCircleRows] = useState<CircleRow[]>([
    { tier: 'bronze', tierLabel: 'Bronze (Circle 1)', baseNumber: 5, multiplier: 5, color: 'text-amber-600', bgColor: 'from-amber-500 to-amber-700' },
    { tier: 'silver', tierLabel: 'Silver (Circle 2)', baseNumber: 5, multiplier: 5, color: 'text-slate-500', bgColor: 'from-slate-400 to-slate-600' },
    { tier: 'gold', tierLabel: 'Gold (Circle 3)', baseNumber: 25, multiplier: 5, color: 'text-yellow-500', bgColor: 'from-yellow-400 to-yellow-600' },
    { tier: 'platinum', tierLabel: 'Platinum (Circle 4)', baseNumber: 125, multiplier: 5, color: 'text-cyan-500', bgColor: 'from-cyan-400 to-cyan-600' },
    { tier: 'diamond', tierLabel: 'Diamond (Circle 5)', baseNumber: 625, multiplier: 5, color: 'text-blue-500', bgColor: 'from-blue-500 to-blue-700' },
  ]);
  
  // Handle updating a row's base number
  const handleBaseChange = (index: number, value: string) => {
    const numValue = Math.max(1, Math.floor(Number(value) || 1));
    setCircleRows(prev => {
      const newRows = [...prev];
      newRows[index] = { ...newRows[index], baseNumber: numValue };
      // Cascade to next rows - each row's base becomes previous row's result
      for (let i = index + 1; i < newRows.length; i++) {
        const prevResult = newRows[i - 1].baseNumber * newRows[i - 1].multiplier;
        newRows[i] = { ...newRows[i], baseNumber: prevResult };
      }
      return newRows;
    });
  };
  
  // Handle updating a row's multiplier
  const handleMultiplierChange = (index: number, value: string) => {
    const numValue = Math.max(1, Math.floor(Number(value) || 1));
    setCircleRows(prev => {
      const newRows = [...prev];
      newRows[index] = { ...newRows[index], multiplier: numValue };
      // Cascade to next rows
      for (let i = index + 1; i < newRows.length; i++) {
        const prevResult = newRows[i - 1].baseNumber * newRows[i - 1].multiplier;
        newRows[i] = { ...newRows[i], baseNumber: prevResult };
      }
      return newRows;
    });
  };
  
  // Calculate total network from all 5 circles
  const totalNetwork = circleRows.reduce((sum, row) => sum + (row.baseNumber * row.multiplier), 0);
  
  // Interactive worksheet state - 5 rows (one per tier)
  const [worksheetInputs, setWorksheetInputs] = useState({
    bronze: 5,
    silver: 5,
    gold: 5,
    platinum: 5,
    diamond: 5
  });
  
  // Tier rates for both Standard and Founding Member
  const tierRates = {
    bronze: { standard: 5, fm: 16 },
    silver: { standard: 5, fm: 18 },
    gold: { standard: 5, fm: 19 },
    platinum: { standard: 5, fm: 20 },
    diamond: { standard: 5, fm: 22 }
  };
  
  const handleWorksheetChange = (tier: keyof typeof worksheetInputs, value: string) => {
    const numValue = parseInt(value) || 0;
    setWorksheetInputs(prev => ({ ...prev, [tier]: Math.max(0, Math.min(999, numValue)) }));
  };

  const { data: memberData } = useQuery<MemberResponse>({
    queryKey: ["/api/member", DEMO_USER_ID],
  });

  const { data: tierData } = useQuery<TierResponse>({
    queryKey: ["/api/tier", DEMO_USER_ID],
  });

  const { data: tiersInfo } = useQuery<any>({
    queryKey: ["/api/tiers"],
  });

  const calculatorMutation = useMutation({
    mutationFn: async (referrals: number) => {
      const currentTier = memberData?.member?.affiliateTier || "gold";
      const response = await apiRequest("POST", "/api/calculator/potential", {
        directReferrals: referrals,
        currentTier: currentTier
      });
      return response.json();
    },
  });

  const handleCalculate = () => {
    calculatorMutation.mutate(circle3);
  };

  // Calculate on mount with initial value
  useEffect(() => {
    if (memberData?.member) {
      handleCalculate();
    }
  }, [memberData?.member, circle3]);

  const result = calculatorMutation.data;
  const member = memberData?.member;
  const currentTier = tierData;

  return (
    <div className="min-h-screen bg-secondary">
      <HeaderNav user={memberData?.member || undefined} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">The FR2P Club - 5-Tier Achievement System Calculator</h1>
          <p className="text-foreground/80 mt-2">
            Calculate earnings potential through 5 circles of influence: Bronze → Silver → Gold → Platinum → Diamond
          </p>
        </div>

        {/* Get 5, Teach 5 Duplication Formula */}
        <Card className="mb-8 bg-gradient-to-br from-[#001f3f] to-[#003366] border-2 border-[#FFD700]">
          <CardHeader>
            <CardTitle className="text-2xl text-[#FFD700] text-center">The Duplication Formula: Get 5, Teach 5</CardTitle>
            <CardDescription className="text-white/80 text-center text-base">
              You only need to find YOUR 5 - then teach them to duplicate the same process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-[#001f3f]/50 border border-[#FFD700]/30 rounded-lg p-6">
              <div className="grid md:grid-cols-5 gap-4 mb-6">
                <div className="bg-[#FFD700]/20 border border-[#FFD700] rounded-lg p-4 text-center">
                  <div className="text-[#FFD700] font-bold mb-1">YOUR 5</div>
                  <div className="text-white text-3xl font-bold">5</div>
                  <div className="text-white/70 text-xs mt-1">You recruit 5</div>
                </div>
                <div className="bg-[#FFD700]/20 border border-[#FFD700] rounded-lg p-4 text-center">
                  <div className="text-[#FFD700] font-bold mb-1">LEVEL 2</div>
                  <div className="text-white text-3xl font-bold">25</div>
                  <div className="text-white/70 text-xs mt-1">5 × 5 = 25</div>
                </div>
                <div className="bg-[#FFD700]/20 border border-[#FFD700] rounded-lg p-4 text-center">
                  <div className="text-[#FFD700] font-bold mb-1">LEVEL 3</div>
                  <div className="text-white text-3xl font-bold">125</div>
                  <div className="text-white/70 text-xs mt-1">25 × 5 = 125</div>
                </div>
                <div className="bg-[#FFD700]/20 border border-[#FFD700] rounded-lg p-4 text-center">
                  <div className="text-[#FFD700] font-bold mb-1">LEVEL 4</div>
                  <div className="text-white text-3xl font-bold">625</div>
                  <div className="text-white/70 text-xs mt-1">125 × 5 = 625</div>
                </div>
                <div className="bg-[#FFD700]/20 border border-[#FFD700] rounded-lg p-4 text-center">
                  <div className="text-[#FFD700] font-bold mb-1">LEVEL 5</div>
                  <div className="text-white text-3xl font-bold">3,125</div>
                  <div className="text-white/70 text-xs mt-1">625 × 5 = 3,125</div>
                </div>
              </div>
              <div className="text-center mb-6">
                <div className="text-[#FFD700] text-lg font-semibold mb-2">
                  Total Network: <span className="text-2xl">3,905 Members</span> (Diamond Affiliate Ambassador)
                </div>
                <p className="text-white/90 text-base">
                  You don't recruit 3,905 people - you find YOUR 5 and teach them to duplicate. 
                  The network grows exponentially through <span className="text-[#FFD700] font-bold">leadership and duplication</span>, not mass recruiting.
                </p>
              </div>
              
              {/* Network Influence & Actual Earnings */}
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="bg-blue-600/30 border-2 border-blue-400 rounded-lg p-6 text-center">
                  <div className="text-blue-300 text-sm font-bold mb-1">YOUR ORGANIZATION</div>
                  <div className="text-white text-4xl font-bold">3,905</div>
                  <div className="text-blue-200 text-sm">Total network influence</div>
                </div>
                <div className="bg-green-600/30 border-2 border-green-400 rounded-lg p-6 text-center">
                  <div className="text-green-300 text-sm font-bold mb-1">STANDARD DIAMOND (25 refs)</div>
                  <div className="text-white text-4xl font-bold">$125</div>
                  <div className="text-green-200 text-sm">Monthly from direct refs</div>
                </div>
                <div className="bg-[#FFD700]/30 border-2 border-[#FFD700] rounded-lg p-6 text-center">
                  <div className="text-[#FFD700] text-sm font-bold mb-1">FM DIAMOND (25 refs)</div>
                  <div className="text-white text-4xl font-bold">$550</div>
                  <div className="text-[#FFD700]/80 text-sm">Monthly from direct refs</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Get 5, Teach 5 Worksheet - Matching Screenshot Layout */}
        <Card className="mb-8 bg-white border-2 border-gray-300">
          <CardHeader className="text-center bg-gradient-to-r from-[#001f3f] to-[#003366]">
            <CardTitle className="text-2xl text-[#FFD700]">📊 Get 5, Teach 5 - Network Growth Worksheet</CardTitle>
            <CardDescription className="text-white/80 text-base">
              See how the duplication model grows your network exponentially
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-300">
              {/* Bronze Row */}
              <div className="grid grid-cols-6 items-center">
                <div className="p-6 text-left border-r border-gray-300">
                  <span className="text-gray-800 font-bold text-xl">Bronze</span>
                </div>
                <div className="p-6 bg-gray-100 border-r border-gray-300 text-center">
                  <span className="text-gray-800 text-3xl font-bold">5</span>
                </div>
                <div className="p-6 text-center text-gray-600 text-2xl">×</div>
                <div className="p-6 bg-cyan-200 border-x border-gray-300 text-center">
                  <span className="text-gray-800 text-xl font-semibold">Get 5</span>
                </div>
                <div className="p-6 text-center text-gray-600 text-2xl">=</div>
                <div className="p-6 bg-green-300 text-center">
                  <span className="text-gray-800 text-3xl font-bold">5</span>
                </div>
              </div>
              
              {/* Silver Row */}
              <div className="grid grid-cols-6 items-center">
                <div className="p-6 text-left border-r border-gray-300">
                  <span className="text-gray-800 font-bold text-xl">Silver</span>
                </div>
                <div className="p-6 bg-gray-100 border-r border-gray-300 text-center">
                  <span className="text-gray-800 text-3xl font-bold">5</span>
                </div>
                <div className="p-6 text-center text-gray-600 text-2xl">×</div>
                <div className="p-6 bg-cyan-200 border-x border-gray-300 text-center">
                  <span className="text-gray-800 text-xl font-semibold">Get 5</span>
                </div>
                <div className="p-6 text-center text-gray-600 text-2xl">=</div>
                <div className="p-6 bg-green-300 text-center">
                  <span className="text-gray-800 text-3xl font-bold">25</span>
                </div>
              </div>
              
              {/* Gold Row */}
              <div className="grid grid-cols-6 items-center">
                <div className="p-6 text-left border-r border-gray-300">
                  <span className="text-gray-800 font-bold text-xl">Gold</span>
                </div>
                <div className="p-6 bg-gray-100 border-r border-gray-300 text-center">
                  <span className="text-gray-800 text-3xl font-bold">5</span>
                </div>
                <div className="p-6 text-center text-gray-600 text-2xl">×</div>
                <div className="p-6 bg-cyan-200 border-x border-gray-300 text-center">
                  <span className="text-gray-800 text-xl font-semibold">Get 5</span>
                </div>
                <div className="p-6 text-center text-gray-600 text-2xl">=</div>
                <div className="p-6 bg-green-300 text-center">
                  <span className="text-gray-800 text-3xl font-bold">125</span>
                </div>
              </div>
              
              {/* Platinum Row */}
              <div className="grid grid-cols-6 items-center">
                <div className="p-6 text-left border-r border-gray-300">
                  <span className="text-gray-800 font-bold text-xl">Platinum</span>
                </div>
                <div className="p-6 bg-gray-100 border-r border-gray-300 text-center">
                  <span className="text-gray-800 text-3xl font-bold">5</span>
                </div>
                <div className="p-6 text-center text-gray-600 text-2xl">×</div>
                <div className="p-6 bg-cyan-200 border-x border-gray-300 text-center">
                  <span className="text-gray-800 text-xl font-semibold">Get 5</span>
                </div>
                <div className="p-6 text-center text-gray-600 text-2xl">=</div>
                <div className="p-6 bg-green-300 text-center">
                  <span className="text-gray-800 text-3xl font-bold">625</span>
                </div>
              </div>
              
              {/* Diamond Row */}
              <div className="grid grid-cols-6 items-center">
                <div className="p-6 text-left border-r border-gray-300">
                  <span className="text-gray-800 font-bold text-xl">Diamond</span>
                </div>
                <div className="p-6 bg-gray-100 border-r border-gray-300 text-center">
                  <span className="text-gray-800 text-3xl font-bold">5</span>
                </div>
                <div className="p-6 text-center text-gray-600 text-2xl">×</div>
                <div className="p-6 bg-cyan-200 border-x border-gray-300 text-center">
                  <span className="text-gray-800 text-xl font-semibold">Get 5</span>
                </div>
                <div className="p-6 text-center text-gray-600 text-2xl">=</div>
                <div className="p-6 bg-green-300 text-center">
                  <span className="text-gray-800 text-3xl font-bold">3125</span>
                </div>
              </div>
              
              {/* Total Row */}
              <div className="grid grid-cols-6 items-center bg-[#001f3f]">
                <div className="p-6 text-left border-r border-[#FFD700]/30 col-span-5">
                  <span className="text-[#FFD700] font-bold text-xl">TOTAL NETWORK (Complete 5×5 Circle)</span>
                </div>
                <div className="p-6 bg-[#FFD700] text-center">
                  <span className="text-[#001f3f] text-3xl font-bold">3,905</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* MONTHLY & ANNUAL POTENTIAL - Highly Visible Below Worksheet */}
        <div className="mb-8 bg-gradient-to-br from-[#001f3f] to-[#003366] rounded-2xl border-4 border-[#FFD700] p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-[#FFD700] mb-2">💰 YOUR POTENTIAL FOLLOWING THE GET 5 CONCEPT 💰</h2>
            <p className="text-white/90 text-lg">Seeing is Believing - Here's What You Can Achieve!</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Monthly Potential */}
            <div className="bg-green-600 rounded-xl p-8 text-center shadow-lg transform hover:scale-105 transition-transform">
              <div className="text-white text-xl font-bold mb-3">MONTHLY POTENTIAL</div>
              <div className="bg-white rounded-lg p-6 mb-4">
                <div className="text-green-700 text-5xl font-bold">$125</div>
                <div className="text-gray-600 text-sm mt-2">Standard Member (25 direct refs × $5)</div>
              </div>
              <div className="text-[#FFD700] text-2xl font-bold">
                Founding Member: $550/mo
              </div>
              <div className="text-white/80 text-sm mt-1">25 direct referrals × $22</div>
            </div>
            
            {/* Annual Potential */}
            <div className="bg-[#FFD700] rounded-xl p-8 text-center shadow-lg transform hover:scale-105 transition-transform">
              <div className="text-[#001f3f] text-xl font-bold mb-3">ANNUAL POTENTIAL</div>
              <div className="bg-white rounded-lg p-6 mb-4">
                <div className="text-[#001f3f] text-5xl font-bold">$1,500</div>
                <div className="text-gray-600 text-sm mt-2">Standard Member ($125 × 12 months)</div>
              </div>
              <div className="text-[#001f3f] text-2xl font-bold">
                Founding Member: $6,600/yr
              </div>
              <div className="text-[#001f3f]/70 text-sm mt-1">$550 × 12 months (4.4x more!)</div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <div className="inline-block bg-white/10 border-2 border-[#FFD700] rounded-xl p-6">
              <p className="text-[#FFD700] text-xl font-bold mb-2">
                🔥 Get YOUR 5 → Teach Them to Get THEIR 5 → Watch It Grow! 🔥
              </p>
              <p className="text-white/80 text-base">
                FTC Compliant: You earn from YOUR direct referrals only. The network growth shows your leadership influence!
              </p>
            </div>
          </div>
        </div>
        
        {/* COMPLETED NETWORK POTENTIAL - Full 3,905 Member Organization */}
        <div className="mb-8 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 rounded-2xl border-4 border-[#FFD700] p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-[#FFD700] mb-2">🏆 COMPLETED NETWORK - DIAMOND LEVEL POTENTIAL 🏆</h2>
            <p className="text-white/90 text-lg">What Your Organization Looks Like at Full 5×5 Completion (3,905 Members)</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Monthly Residual - Complete Network */}
            <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-xl p-8 text-center shadow-lg transform hover:scale-105 transition-transform">
              <div className="text-white text-xl font-bold mb-3">MONTHLY RESIDUAL</div>
              <div className="bg-white rounded-lg p-6 mb-4">
                <div className="text-green-700 text-6xl font-bold">$19,525</div>
                <div className="text-gray-600 text-sm mt-2">Complete 5×5 Network Value</div>
              </div>
              <div className="text-white text-lg">
                3,905 members × $5 = <span className="font-bold text-2xl">$19,525/month</span>
              </div>
            </div>
            
            {/* Annual Residual - Complete Network */}
            <div className="bg-gradient-to-br from-[#FFD700] to-amber-600 rounded-xl p-8 text-center shadow-lg transform hover:scale-105 transition-transform">
              <div className="text-[#001f3f] text-xl font-bold mb-3">ANNUAL RESIDUAL</div>
              <div className="bg-white rounded-lg p-6 mb-4">
                <div className="text-[#001f3f] text-6xl font-bold">$234,300</div>
                <div className="text-gray-600 text-sm mt-2">Complete 5×5 Network Value Per Year</div>
              </div>
              <div className="text-[#001f3f] text-lg">
                $19,525 × 12 months = <span className="font-bold text-2xl">$234,300/year</span>
              </div>
            </div>
          </div>
          
          {/* Network Breakdown Visual */}
          <div className="bg-white/10 rounded-xl p-6 mb-6">
            <h3 className="text-[#FFD700] text-xl font-bold text-center mb-4">Complete Network Breakdown:</h3>
            <div className="grid grid-cols-5 gap-2 text-center">
              <div className="bg-amber-600 rounded-lg p-3">
                <div className="text-white font-bold text-lg">Level 1</div>
                <div className="text-white text-2xl font-bold">5</div>
                <div className="text-white/80 text-xs">Your 5</div>
              </div>
              <div className="bg-slate-500 rounded-lg p-3">
                <div className="text-white font-bold text-lg">Level 2</div>
                <div className="text-white text-2xl font-bold">25</div>
                <div className="text-white/80 text-xs">5×5</div>
              </div>
              <div className="bg-yellow-500 rounded-lg p-3">
                <div className="text-white font-bold text-lg">Level 3</div>
                <div className="text-white text-2xl font-bold">125</div>
                <div className="text-white/80 text-xs">25×5</div>
              </div>
              <div className="bg-cyan-600 rounded-lg p-3">
                <div className="text-white font-bold text-lg">Level 4</div>
                <div className="text-white text-2xl font-bold">625</div>
                <div className="text-white/80 text-xs">125×5</div>
              </div>
              <div className="bg-blue-600 rounded-lg p-3">
                <div className="text-white font-bold text-lg">Level 5</div>
                <div className="text-white text-2xl font-bold">3,125</div>
                <div className="text-white/80 text-xs">625×5</div>
              </div>
            </div>
            <div className="text-center mt-4">
              <span className="text-[#FFD700] text-2xl font-bold">= 3,905 Total Members in Your Organization</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="inline-block bg-[#001f3f] border-2 border-[#FFD700] rounded-xl p-6">
              <p className="text-[#FFD700] text-xl font-bold mb-2">
                ⭐ This is the Power of Duplication! ⭐
              </p>
              <p className="text-white/80 text-sm">
                Note: These figures show organizational value. FTC-compliant earnings are from YOUR direct referrals only.
              </p>
            </div>
          </div>
        </div>
        
        {/* SPILLOVER PROGRAM EXPLANATION */}
        <div className="mb-8 bg-gradient-to-br from-cyan-900 via-teal-800 to-blue-900 rounded-2xl border-4 border-cyan-400 p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-cyan-300 mb-2">🌊 THE SPILLOVER PROGRAM 🌊</h2>
            <p className="text-white/90 text-lg">What Happens When You Refer MORE Than 5 People in a Month</p>
          </div>
          
          {/* How Spillover Works */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/10 rounded-xl p-6 border-2 border-cyan-400/50">
              <h3 className="text-cyan-300 text-xl font-bold mb-4 text-center">📋 Your Requirement</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold">5</div>
                  <span className="text-white">Refer <strong>5 people</strong> - that's it!</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white text-lg">✓</div>
                  <span className="text-white">Teach them to duplicate the process</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FFD700] flex items-center justify-center text-[#001f3f] text-lg">👀</div>
                  <span className="text-white">Watch your network grow!</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 rounded-xl p-6 border-2 border-cyan-400/50">
              <h3 className="text-cyan-300 text-xl font-bold mb-4 text-center">🌊 Spillover Benefit</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold">6+</div>
                  <span className="text-white">Refer more than 5 in a month?</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg">↓</div>
                  <span className="text-white">Extra members go to <strong>SPILLOVER</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white text-lg">👥</div>
                  <span className="text-white">Placed under your downline team!</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Visual Spillover Flow */}
          <div className="bg-[#001f3f] rounded-xl p-6 border-2 border-[#FFD700] mb-6">
            <h3 className="text-[#FFD700] text-xl font-bold mb-4 text-center">How Spillover Flows Down</h3>
            <div className="flex flex-col items-center gap-4">
              {/* You */}
              <div className="bg-gradient-to-r from-[#FFD700] to-amber-500 rounded-full px-8 py-4 text-[#001f3f] font-bold text-lg shadow-lg">
                YOU - Refer 8 People This Month
              </div>
              
              {/* Arrow */}
              <div className="text-[#FFD700] text-3xl">↓</div>
              
              {/* Split */}
              <div className="grid grid-cols-2 gap-8 w-full max-w-2xl">
                <div className="text-center">
                  <div className="bg-green-500 rounded-lg p-4 mb-2">
                    <div className="text-white font-bold text-2xl">5</div>
                    <div className="text-white/90 text-sm">Your Direct Referrals</div>
                  </div>
                  <div className="text-green-300 text-sm">✅ You earn commission on these</div>
                </div>
                <div className="text-center">
                  <div className="bg-cyan-500 rounded-lg p-4 mb-2">
                    <div className="text-white font-bold text-2xl">3</div>
                    <div className="text-white/90 text-sm">Spillover Members</div>
                  </div>
                  <div className="text-cyan-300 text-sm">🌊 Placed under your team</div>
                </div>
              </div>
              
              {/* Arrow */}
              <div className="text-cyan-400 text-3xl">↓</div>
              
              {/* Team Benefits */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg px-8 py-4 text-white font-bold shadow-lg text-center">
                <div className="text-xl mb-1">Your Team Members Get Spillover!</div>
                <div className="text-white/80 text-sm">Helping their networks grow through YOUR extra effort</div>
              </div>
            </div>
          </div>
          
          {/* Why Spillover Matters */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-4 text-center">
              <div className="text-white text-3xl mb-2">💪</div>
              <div className="text-white font-bold mb-1">Rewards Overachievers</div>
              <div className="text-white/80 text-sm">Your extra effort benefits the whole team</div>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4 text-center">
              <div className="text-white text-3xl mb-2">🤝</div>
              <div className="text-white font-bold mb-1">Builds Team Unity</div>
              <div className="text-white/80 text-sm">Everyone wins when leaders go the extra mile</div>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-4 text-center">
              <div className="text-white text-3xl mb-2">🚀</div>
              <div className="text-white font-bold mb-1">Accelerates Growth</div>
              <div className="text-white/80 text-sm">Faster network expansion for everyone</div>
            </div>
          </div>
          
          {/* Financial Reality Check */}
          <div className="bg-gradient-to-r from-[#FFD700]/20 to-amber-600/20 border-2 border-[#FFD700] rounded-xl p-6">
            <h3 className="text-[#FFD700] text-xl font-bold mb-4 text-center">💰 The FR2P Club Financial Advantage</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-2">🏦</div>
                <div className="text-white font-bold mb-2">Traditional Banks</div>
                <div className="text-white/70 text-sm">Your money gets traded on to make THEM money</div>
                <div className="text-red-400 text-sm mt-2">Most people don't even have $200 in savings</div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🏆</div>
                <div className="text-[#FFD700] font-bold mb-2">The FR2P Club</div>
                <div className="text-white/70 text-sm">Your $35/month commitment builds YOUR wealth</div>
                <div className="text-green-400 text-sm mt-2">Get your investment back at year end + potential 6-figure income!</div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <div className="inline-block bg-white/10 rounded-lg px-6 py-3">
                <span className="text-[#FFD700] font-bold text-lg">$234,300/year = SIX-FIGURE INCOME BRACKET! 🎯</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Earnings Potential Based on Network */}
        <Card className="mb-8 bg-gradient-to-br from-green-900 to-green-800 border-2 border-green-400">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-green-300">💵 Your Earnings - Direct Referrals Only (FTC Compliant)</CardTitle>
            <CardDescription className="text-white/80 text-base">
              You earn $5/month per direct referral (Founding Members: $16-$22)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800 border border-slate-600 rounded-lg p-6 text-center">
                <div className="text-slate-400 text-sm font-bold mb-2">STANDARD MEMBER</div>
                <div className="text-white text-4xl font-bold mb-2">$125<span className="text-lg">/mo</span></div>
                <div className="text-slate-400 text-sm">25 direct referrals × $5</div>
                <div className="text-slate-500 text-xs mt-2">$1,500/year</div>
              </div>
              <div className="bg-[#FFD700]/20 border-2 border-[#FFD700] rounded-lg p-6 text-center">
                <div className="text-[#FFD700] text-sm font-bold mb-2">FOUNDING MEMBER (First 500)</div>
                <div className="text-white text-4xl font-bold mb-2">$550<span className="text-lg">/mo</span></div>
                <div className="text-[#FFD700]/80 text-sm">25 direct referrals × $22</div>
                <div className="text-[#FFD700]/60 text-xs mt-2">$6,600/year (4.4x more!)</div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-[#001f3f] to-[#003366] rounded-lg border border-green-400/50 text-center">
              <p className="text-green-300 font-bold text-lg mb-2">
                ✅ FTC Compliant: You Earn From YOUR Direct Referrals Only
              </p>
              <p className="text-white/80 text-sm">
                The network growth above shows your organization's influence through duplication - not multi-level earnings
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* What You Actually Earn - Direct Referrals Reference Table */}
        <Card className="mb-8 bg-gradient-to-br from-green-900 to-green-800 border-2 border-green-400">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-green-300">💵 Tier Reference Chart - Standard Earnings</CardTitle>
            <CardDescription className="text-white/80 text-base">
              Quick reference for earnings at each tier milestone (FTC Compliant Single-Tier)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-green-950">
                    <th className="p-3 text-left text-green-300 font-bold border-b-2 border-green-400">Your Tier</th>
                    <th className="p-3 text-center text-green-300 font-bold border-b-2 border-green-400">Direct Referrals</th>
                    <th className="p-3 text-center text-green-300 font-bold border-b-2 border-green-400">Standard ($5/ea)</th>
                    <th className="p-3 text-center text-green-300 font-bold border-b-2 border-green-400">FM Rate ($16-$22/ea)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-amber-900/20 border-b border-green-400/30">
                    <td className="p-3 font-bold text-amber-400">Bronze</td>
                    <td className="p-3 text-center text-white font-bold text-lg">5</td>
                    <td className="p-3 text-center text-white font-bold">$25/mo</td>
                    <td className="p-3 text-center text-green-400 font-bold">$80/mo</td>
                  </tr>
                  <tr className="bg-slate-700/20 border-b border-green-400/30">
                    <td className="p-3 font-bold text-slate-300">Silver</td>
                    <td className="p-3 text-center text-white font-bold text-lg">10</td>
                    <td className="p-3 text-center text-white font-bold">$50/mo</td>
                    <td className="p-3 text-center text-green-400 font-bold">$180/mo</td>
                  </tr>
                  <tr className="bg-yellow-900/20 border-b border-green-400/30">
                    <td className="p-3 font-bold text-yellow-400">Gold</td>
                    <td className="p-3 text-center text-white font-bold text-lg">15</td>
                    <td className="p-3 text-center text-white font-bold">$75/mo</td>
                    <td className="p-3 text-center text-green-400 font-bold">$285/mo</td>
                  </tr>
                  <tr className="bg-cyan-900/20 border-b border-green-400/30">
                    <td className="p-3 font-bold text-cyan-300">Platinum</td>
                    <td className="p-3 text-center text-white font-bold text-lg">20</td>
                    <td className="p-3 text-center text-white font-bold">$100/mo</td>
                    <td className="p-3 text-center text-green-400 font-bold">$400/mo</td>
                  </tr>
                  <tr className="bg-blue-900/20 border-b border-green-400/30">
                    <td className="p-3 font-bold text-blue-300">Diamond</td>
                    <td className="p-3 text-center text-white font-bold text-lg">25</td>
                    <td className="p-3 text-center text-white font-bold">$125/mo</td>
                    <td className="p-3 text-center text-green-400 font-bold">$550/mo</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-[#001f3f] to-[#003366] rounded-lg border border-green-400/50 text-center">
              <p className="text-green-300 font-bold text-lg mb-2">
                ✅ FTC Compliant: You Earn From YOUR Direct Referrals Only
              </p>
              <p className="text-white/80 text-sm">
                Standard members: $5/referral flat rate | Founding Members: $16-$22/referral based on tier
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Network Growth Snapshot - Organization Influence */}
        <Card className="mb-8 bg-gradient-to-br from-blue-900 to-blue-800 border-2 border-blue-400">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-blue-300">🌐 Network Growth Snapshot - Organization Influence</CardTitle>
            <CardDescription className="text-white/80 text-base">
              The power of duplication: See how the "Get 5, Teach 5" model grows your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-950">
                    <th className="p-3 text-left text-blue-300 font-bold border-b-2 border-blue-400">Network Level</th>
                    <th className="p-3 text-center text-blue-300 font-bold border-b-2 border-blue-400">People at Level</th>
                    <th className="p-3 text-center text-blue-300 font-bold border-b-2 border-blue-400">Organization Total</th>
                    <th className="p-3 text-center text-blue-300 font-bold border-b-2 border-blue-400">Monthly Value*</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-amber-900/20 border-b border-blue-400/30">
                    <td className="p-3 font-bold text-amber-400">Level 1 - Your Direct 5</td>
                    <td className="p-3 text-center text-white font-bold text-lg">5</td>
                    <td className="p-3 text-center text-white">5</td>
                    <td className="p-3 text-center text-blue-300">$25</td>
                  </tr>
                  <tr className="bg-slate-700/20 border-b border-blue-400/30">
                    <td className="p-3 font-bold text-slate-300">Level 2 - Their 5 each</td>
                    <td className="p-3 text-center text-white font-bold text-lg">25</td>
                    <td className="p-3 text-center text-white">30</td>
                    <td className="p-3 text-center text-blue-300">$150</td>
                  </tr>
                  <tr className="bg-yellow-900/20 border-b border-blue-400/30">
                    <td className="p-3 font-bold text-yellow-400">Level 3</td>
                    <td className="p-3 text-center text-white font-bold text-lg">125</td>
                    <td className="p-3 text-center text-white">155</td>
                    <td className="p-3 text-center text-blue-300">$775</td>
                  </tr>
                  <tr className="bg-cyan-900/20 border-b border-blue-400/30">
                    <td className="p-3 font-bold text-cyan-300">Level 4</td>
                    <td className="p-3 text-center text-white font-bold text-lg">625</td>
                    <td className="p-3 text-center text-white">780</td>
                    <td className="p-3 text-center text-blue-300">$3,900</td>
                  </tr>
                  <tr className="bg-blue-900/20 border-b border-blue-400/30">
                    <td className="p-3 font-bold text-blue-300">Level 5 - Diamond Complete</td>
                    <td className="p-3 text-center text-white font-bold text-lg">3,125</td>
                    <td className="p-3 text-center text-white">3,905</td>
                    <td className="p-3 text-center text-blue-300">$19,525</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 p-3 bg-amber-900/30 border border-amber-500 rounded-lg">
              <p className="text-amber-300 text-xs text-center">
                <strong>*Important:</strong> Monthly Value shows the total payment volume IF all 3,905 people were paying you $5 directly.
                In our FTC-compliant single-tier model, you earn only from YOUR direct referrals (max 25 at Diamond). 
                This chart shows your organization's growth and influence, not your personal commission.
              </p>
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-[#001f3f] to-[#003366] rounded-lg border-2 border-[#FFD700] text-center">
              <p className="text-[#FFD700] font-bold text-xl mb-2">
                🔄 Complete Your Circle → Start Over Again!
              </p>
              <p className="text-white/90">
                Build your first team of 5, help them duplicate, then start building another circle - growing your direct referrals!
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Founding Member Enhanced Rates Comparison */}
        <Card className="mb-8 bg-gradient-to-br from-amber-900 to-amber-800 border-2 border-[#FFD700]">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-[#FFD700]">👑 Founding Member Enhanced Rates (First 500)</CardTitle>
            <CardDescription className="text-white/80 text-base">
              Founding Members earn <span className="text-green-400 font-bold">3-4x MORE</span> per direct referral based on their tier!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-amber-950">
                    <th className="p-3 text-left text-[#FFD700] font-bold border-b-2 border-[#FFD700]">Your Tier</th>
                    <th className="p-3 text-center text-[#FFD700] font-bold border-b-2 border-[#FFD700]">Direct Refs</th>
                    <th className="p-3 text-center text-slate-300 font-bold border-b-2 border-[#FFD700]">Standard Rate</th>
                    <th className="p-3 text-center text-green-400 font-bold border-b-2 border-[#FFD700]">FM Rate</th>
                    <th className="p-3 text-center text-slate-300 font-bold border-b-2 border-[#FFD700]">Standard Earns</th>
                    <th className="p-3 text-center text-green-400 font-bold border-b-2 border-[#FFD700]">FM Earns</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-amber-900/20 border-b border-[#FFD700]/30">
                    <td className="p-3 font-bold text-amber-400">Bronze (5 refs)</td>
                    <td className="p-3 text-center text-white font-bold">5</td>
                    <td className="p-3 text-center text-slate-300">$5/ea</td>
                    <td className="p-3 text-center text-green-400 font-bold">$16/ea</td>
                    <td className="p-3 text-center text-slate-300">$25/mo</td>
                    <td className="p-3 text-center text-green-400 font-bold">$80/mo</td>
                  </tr>
                  <tr className="bg-slate-700/20 border-b border-[#FFD700]/30">
                    <td className="p-3 font-bold text-slate-300">Silver (10 refs)</td>
                    <td className="p-3 text-center text-white font-bold">10</td>
                    <td className="p-3 text-center text-slate-300">$5/ea</td>
                    <td className="p-3 text-center text-green-400 font-bold">$18/ea</td>
                    <td className="p-3 text-center text-slate-300">$50/mo</td>
                    <td className="p-3 text-center text-green-400 font-bold">$180/mo</td>
                  </tr>
                  <tr className="bg-yellow-900/20 border-b border-[#FFD700]/30">
                    <td className="p-3 font-bold text-yellow-400">Gold (15 refs)</td>
                    <td className="p-3 text-center text-white font-bold">15</td>
                    <td className="p-3 text-center text-slate-300">$5/ea</td>
                    <td className="p-3 text-center text-green-400 font-bold">$19/ea</td>
                    <td className="p-3 text-center text-slate-300">$75/mo</td>
                    <td className="p-3 text-center text-green-400 font-bold">$285/mo</td>
                  </tr>
                  <tr className="bg-cyan-900/20 border-b border-[#FFD700]/30">
                    <td className="p-3 font-bold text-cyan-300">Platinum (20 refs)</td>
                    <td className="p-3 text-center text-white font-bold">20</td>
                    <td className="p-3 text-center text-slate-300">$5/ea</td>
                    <td className="p-3 text-center text-green-400 font-bold">$20/ea</td>
                    <td className="p-3 text-center text-slate-300">$100/mo</td>
                    <td className="p-3 text-center text-green-400 font-bold">$400/mo</td>
                  </tr>
                  <tr className="bg-blue-900/20 border-b border-[#FFD700]/30">
                    <td className="p-3 font-bold text-blue-300">Diamond (25 refs)</td>
                    <td className="p-3 text-center text-white font-bold">25</td>
                    <td className="p-3 text-center text-slate-300">$5/ea</td>
                    <td className="p-3 text-center text-green-400 font-bold">$22/ea</td>
                    <td className="p-3 text-center text-slate-300">$125/mo</td>
                    <td className="p-3 text-center text-green-400 font-bold">$550/mo</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <div className="bg-slate-800 p-4 rounded-lg border border-slate-600 text-center">
                <div className="text-slate-400 text-sm font-bold mb-1">STANDARD AT DIAMOND (25 refs)</div>
                <div className="text-white text-3xl font-bold">$125<span className="text-lg">/mo</span></div>
                <div className="text-slate-400 text-sm">$1,500/year</div>
              </div>
              <div className="bg-green-800 p-4 rounded-lg border-2 border-green-400 text-center">
                <div className="text-green-300 text-sm font-bold mb-1">FOUNDING MEMBER AT DIAMOND</div>
                <div className="text-white text-3xl font-bold">$550<span className="text-lg">/mo</span></div>
                <div className="text-green-300 text-sm">$6,600/year 🚀</div>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-[#FFD700] font-bold text-lg">
                Founding Members earn <span className="text-green-400">4.4x MORE</span> at Diamond level!
              </p>
              <p className="text-white/70 text-sm mt-1">
                Plus 2x Achievement Bonuses ($2,300 total vs $1,150 standard)
              </p>
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-[#001f3f] to-[#003366] rounded-lg border border-[#FFD700]/50">
              <p className="text-white/90 text-sm text-center">
                <span className="text-[#FFD700] font-bold">FTC Compliant:</span> You earn commissions only from YOUR direct referrals. 
                As your tier increases, your rate per referral increases. No multi-level earnings.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Current Tier Status */}
        {member && currentTier && (currentTier as any) && Object.keys(currentTier as any).length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {member.affiliateTier === 'gold' && <Star className="h-5 w-5 text-amber-600" />}
                {member.affiliateTier === 'platinum' && <Trophy className="h-5 w-5 text-gray-500" />}
                {member.affiliateTier === 'diamond' && <Award className="h-5 w-5 text-blue-500" />}
                Current Status: {member.affiliateTier.charAt(0).toUpperCase() + member.affiliateTier.slice(1)} Tier
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label>Total Sales</Label>
                  <div className="text-2xl font-bold text-blue-600">{(currentTier as any)?.totalSales || 0}</div>
                  <div className="text-sm text-gray-600">Lifetime sales completed</div>
                </div>
                <div>
                  <Label>Commission Rate</Label>
                  <div className="text-2xl font-bold text-green-600">${(currentTier as any)?.commissionRate || 50}</div>
                  <div className="text-sm text-gray-600">Per sale commission</div>
                </div>
                <div>
                  <Label>Bonuses Earned</Label>
                  <div className="text-2xl font-bold text-purple-600">${(((currentTier as any)?.bonusesEarned || 0) / 100).toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Total milestone bonuses</div>
                </div>
              </div>
              {(currentTier as any)?.nextTier && (
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress to {(currentTier as any)?.nextTier?.nextTier} Tier</span>
                    <span>{(currentTier as any)?.totalSales || 0} / {((currentTier as any)?.totalSales || 0) + ((currentTier as any)?.nextTier?.salesNeeded || 0)} sales</span>
                  </div>
                  <Progress 
                    value={(((currentTier as any)?.totalSales || 0) / (((currentTier as any)?.totalSales || 0) + ((currentTier as any)?.nextTier?.salesNeeded || 1))) * 100} 
                    className="h-2" 
                  />
                  <div className="text-sm text-gray-600 mt-1">
                    {(currentTier as any)?.nextTier?.salesNeeded || 0} more sales needed for next tier
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Input */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">🔢 Circle of Influence Multiplier - INTERACTIVE WORKSHEET</CardTitle>
              <CardDescription className="text-base">
                Play with the numbers! 15 boxes (5 rows × 3 columns) - Change any input and watch the results cascade
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {/* Header Row */}
                <div className="grid grid-cols-4 gap-4 text-center mb-2">
                  <div className="font-bold text-lg text-gray-700">Tier</div>
                  <div className="font-bold text-lg text-blue-600">Your Number</div>
                  <div className="font-bold text-lg text-amber-600">× Multiplier</div>
                  <div className="font-bold text-lg text-green-600">= Result</div>
                </div>
                
                {/* 5 Interactive Rows - 15 Total Boxes */}
                {circleRows.map((row, index) => {
                  const result = row.baseNumber * row.multiplier;
                  return (
                    <div key={row.tier} className="grid grid-cols-4 gap-4 items-center bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border-2 border-gray-200 hover:border-blue-400 transition-colors">
                      {/* Tier Label with Circle */}
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${row.bgColor} flex items-center justify-center shadow-lg`}>
                          <span className="text-white font-bold text-lg">{index + 1}</span>
                        </div>
                        <div className={`font-bold ${row.color}`}>{row.tierLabel}</div>
                      </div>
                      
                      {/* Your Number - Editable Input with Circle Display */}
                      <div className="text-center">
                        <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-xl mb-2`}>
                          <span className="text-white text-2xl font-bold">{row.baseNumber}</span>
                        </div>
                        <Input
                          type="number"
                          value={row.baseNumber}
                          onChange={(e) => handleBaseChange(index, e.target.value)}
                          min="1"
                          className="w-20 text-center text-lg font-bold border-2 border-blue-400 focus:border-blue-600 rounded-lg"
                          data-testid={`input-base-${row.tier}`}
                        />
                        <div className="text-xs text-gray-500 mt-1">Your Number</div>
                      </div>
                      
                      {/* Multiplier - Editable Input with Circle Display */}
                      <div className="text-center">
                        <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-xl mb-2`}>
                          <span className="text-white text-2xl font-bold">{row.multiplier}</span>
                        </div>
                        <Input
                          type="number"
                          value={row.multiplier}
                          onChange={(e) => handleMultiplierChange(index, e.target.value)}
                          min="1"
                          className="w-20 text-center text-lg font-bold border-2 border-amber-400 focus:border-amber-600 rounded-lg"
                          data-testid={`input-multiplier-${row.tier}`}
                        />
                        <div className="text-xs text-gray-500 mt-1">Multiplier</div>
                      </div>
                      
                      {/* Result - Auto-Calculated Circle */}
                      <div className="text-center">
                        <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-xl mb-2`}>
                          <div className="text-white text-2xl font-bold">{result.toLocaleString()}</div>
                        </div>
                        <div className="text-xs text-gray-500">Result</div>
                      </div>
                    </div>
                  );
                })}
                
                {/* Total Network Summary */}
                <div className="bg-gradient-to-r from-[#001f3f] to-[#003366] rounded-xl p-6 border-4 border-[#FFD700]">
                  <div className="text-center">
                    <div className="text-[#FFD700] text-xl font-bold mb-2">📊 TOTAL NETWORK POTENTIAL</div>
                    <div className="text-white text-5xl font-bold mb-2">{totalNetwork.toLocaleString()}</div>
                    <div className="text-white/80">Members in Your Complete Organization</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-green-500/20 border border-green-400 rounded-lg p-3 text-center">
                      <div className="text-green-300 text-sm">Monthly Value @ $5</div>
                      <div className="text-white text-2xl font-bold">${(totalNetwork * 5).toLocaleString()}</div>
                    </div>
                    <div className="bg-[#FFD700]/20 border border-[#FFD700] rounded-lg p-3 text-center">
                      <div className="text-[#FFD700] text-sm">Annual Value @ $5</div>
                      <div className="text-white text-2xl font-bold">${(totalNetwork * 5 * 12).toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mt-4 text-center bg-blue-50 p-4 rounded-lg border border-blue-200">
                  💡 <strong>Play with the numbers!</strong> Change any "Your Number" or "Multiplier" value above and watch all the results automatically recalculate. See the power of duplication!
                </p>

                {/* Flat Commission + Achievement Bonuses */}
                <div className="bg-gradient-to-br from-[#001f3f] to-[#003366] border-2 border-[#FFD700] rounded-lg p-4">
                  <h4 className="font-semibold text-[#FFD700] mb-3 text-center">💰 Simple Commission + Achievement Bonuses</h4>
                  <p className="text-white/80 text-xs text-center mb-3">Flat $5/month per referral + One-Time Tier Bonuses</p>
                  <div className="grid grid-cols-5 gap-2 text-center text-xs">
                    <div className="bg-amber-700/30 border border-amber-600 rounded p-2">
                      <div className="font-bold text-amber-400">Bronze</div>
                      <div className="text-white text-lg font-bold">$50</div>
                      <div className="text-white/70">bonus</div>
                    </div>
                    <div className="bg-slate-500/30 border border-slate-400 rounded p-2">
                      <div className="font-bold text-slate-300">Silver</div>
                      <div className="text-white text-lg font-bold">$100</div>
                      <div className="text-white/70">bonus</div>
                    </div>
                    <div className="bg-yellow-500/30 border border-yellow-400 rounded p-2">
                      <div className="font-bold text-yellow-400">Gold</div>
                      <div className="text-white text-lg font-bold">$200</div>
                      <div className="text-white/70">bonus</div>
                    </div>
                    <div className="bg-cyan-500/30 border border-cyan-400 rounded p-2">
                      <div className="font-bold text-cyan-300">Platinum</div>
                      <div className="text-white text-lg font-bold">$500</div>
                      <div className="text-white/70">bonus</div>
                    </div>
                    <div className="bg-blue-500/30 border border-blue-400 rounded p-2">
                      <div className="font-bold text-blue-300">Diamond</div>
                      <div className="text-white text-lg font-bold">$1,000</div>
                      <div className="text-white/70">bonus</div>
                    </div>
                  </div>
                  <div className="text-center mt-3 text-[#FFD700] text-sm font-semibold">
                    With 5 Direct Referrals: $25/month recurring + $50 Bronze bonus!
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-3">The FR2P Club Membership</h4>
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded border border-blue-300">
                      <div className="font-medium text-blue-800 mb-2">🏆 Exclusive Club Access</div>
                      <div className="text-blue-600 font-bold text-xl mb-2">$35/Month Membership</div>
                      <div className="text-xs text-blue-700 space-y-1">
                        <div>✓ Complete financial education system</div>
                        <div>✓ Personal club invitation link</div>
                        <div>✓ $5/month per referral (flat rate, unlimited)</div>
                        <div>✓ 5-tier system: Bronze → Silver → Gold → Platinum → Diamond</div>
                        <div>✓ Circle completion bonuses up to $500</div>
                        <div>✓ Ongoing support & community access</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center text-xs text-blue-700 mt-3 font-medium">
                    "Build your tier, grow your income - the more you achieve, the more you earn!"
                  </div>
                </div>

                <Button 
                  onClick={handleCalculate} 
                  className="w-full"
                  disabled={calculatorMutation.isPending}
                  data-testid="button-calculate"
                >
                  {calculatorMutation.isPending ? "Calculating..." : "Calculate Potential"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Achievement Tier System */}
          <Card className="bg-gradient-to-br from-blue-50 to-amber-50 border-2 border-amber-300">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-primary">Achievement Tier System</CardTitle>
              <CardDescription>
                Build your network and unlock exclusive tier bonuses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                {/* Bronze Tier */}
                <div className="relative group">
                  <div className="overflow-hidden rounded-lg shadow-xl transform transition-transform group-hover:scale-105 bg-gradient-to-br from-orange-700 to-orange-900">
                    <div className="h-40 flex flex-col justify-center items-center p-3">
                      <h3 className="text-white text-sm font-bold mb-1 drop-shadow-lg">
                        Bronze Affiliate Ambassador
                      </h3>
                      <div className="text-amber-300 text-lg font-bold mb-1">
                        1st Circle
                      </div>
                      <p className="text-white/80 text-xs drop-shadow-md text-center">
                        5 direct referrals
                      </p>
                      <div className="mt-2 bg-white/20 rounded px-2 py-1">
                        <span className="text-amber-300 font-bold text-sm">$50 bonus</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Silver Tier */}
                <div className="relative group">
                  <div className="overflow-hidden rounded-lg shadow-xl transform transition-transform group-hover:scale-105 bg-gradient-to-br from-gray-400 to-gray-600">
                    <div className="h-40 flex flex-col justify-center items-center p-3">
                      <h3 className="text-white text-sm font-bold mb-1 drop-shadow-lg">
                        Silver Affiliate Ambassador
                      </h3>
                      <div className="text-amber-300 text-lg font-bold mb-1">
                        2nd Circle
                      </div>
                      <p className="text-white/80 text-xs drop-shadow-md text-center">
                        25 direct referrals
                      </p>
                      <div className="mt-2 bg-white/20 rounded px-2 py-1">
                        <span className="text-amber-300 font-bold text-sm">$100 bonus</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gold Tier */}
                <div className="relative group">
                  <div className="overflow-hidden rounded-lg shadow-xl transform transition-transform group-hover:scale-105 bg-gradient-to-br from-yellow-400 to-yellow-600">
                    <div className="h-40 flex flex-col justify-center items-center p-3">
                      <h3 className="text-navy-900 text-sm font-bold mb-1 drop-shadow-lg">
                        Gold Affiliate Ambassador
                      </h3>
                      <div className="text-navy-900 text-lg font-bold mb-1">
                        3rd Circle
                      </div>
                      <p className="text-navy-800 text-xs drop-shadow-md text-center">
                        125 direct referrals
                      </p>
                      <div className="mt-2 bg-navy-900/20 rounded px-2 py-1">
                        <span className="text-navy-900 font-bold text-sm">$200 bonus</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Platinum Tier */}
                <div className="relative group">
                  <div className="overflow-hidden rounded-lg shadow-xl transform transition-transform group-hover:scale-105 bg-gradient-to-br from-gray-300 to-gray-500">
                    <div className="h-40 flex flex-col justify-center items-center p-3">
                      <h3 className="text-navy-900 text-sm font-bold mb-1 drop-shadow-lg">
                        Platinum Affiliate Ambassador
                      </h3>
                      <div className="text-navy-900 text-lg font-bold mb-1">
                        4th Circle
                      </div>
                      <p className="text-navy-800 text-xs drop-shadow-md text-center">
                        625 direct referrals
                      </p>
                      <div className="mt-2 bg-navy-900/20 rounded px-2 py-1">
                        <span className="text-navy-900 font-bold text-sm">$500 bonus</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Diamond Tier */}
                <div className="relative group">
                  <div className="overflow-hidden rounded-lg shadow-xl transform transition-transform group-hover:scale-105 bg-gradient-to-br from-blue-400 to-blue-600">
                    <div className="h-40 flex flex-col justify-center items-center p-3">
                      <h3 className="text-white text-sm font-bold mb-1 drop-shadow-lg">
                        Diamond Affiliate Ambassador
                      </h3>
                      <div className="text-amber-300 text-lg font-bold mb-1">
                        5th Circle
                      </div>
                      <p className="text-white/80 text-xs drop-shadow-md text-center">
                        3,125 direct referrals
                      </p>
                      <div className="mt-2 bg-white/20 rounded px-2 py-1">
                        <span className="text-amber-300 font-bold text-sm">$1,000 bonus</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {result && (
                <div className="bg-white rounded-lg border-2 border-accent/20 p-4">
                  <h3 className="font-semibold text-primary mb-3">Your Network Visualization</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tier 1 (Your Direct Circle):</span>
                      <span className="font-medium text-foreground">{result.levels.level1.toLocaleString()} people</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tier 2 (Their Circle):</span>
                      <span className="font-medium text-foreground">{result.levels.level2.toLocaleString()} people</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tier 3 (Extended Network):</span>
                      <span className="font-medium text-foreground">{result.levels.level3.toLocaleString()} people</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-accent font-medium">Total Network Size:</span>
                        <span className="text-xl font-bold text-accent">
                          {result.totalReferrals.toLocaleString()} affiliates
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!result && (
                <div className="text-center py-6 bg-white rounded-lg border-2 border-accent/20">
                  <p className="text-muted-foreground">Click "Calculate Potential" to visualize your network growth</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Financial Projections at Different Success Rates */}
        {result && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>🎯 Annual Financial Projections by Success Rate</CardTitle>
              <CardDescription>
                Potential annual earnings if everyone in your Circle of Influence follows the concept
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { rate: 100, color: "from-emerald-600 to-emerald-700", border: "border-emerald-500", text: "text-white" },
                  { rate: 75, color: "from-blue-600 to-blue-700", border: "border-blue-500", text: "text-white" },
                  { rate: 50, color: "from-amber-500 to-amber-600", border: "border-amber-400", text: "text-navy-900" },
                  { rate: 40, color: "from-orange-600 to-orange-700", border: "border-orange-500", text: "text-white" }
                ].map((scenario) => {
                  const directReferrals = Math.round(result.levels.level1 * (scenario.rate / 100));
                  const monthlyCommissions = directReferrals * 5; // $5/month flat rate per direct referral
                  const annualCommissions = monthlyCommissions * 12;
                  
                  return (
                    <div key={scenario.rate} className={`bg-gradient-to-br ${scenario.color} ${scenario.border} border rounded-lg p-4`}>
                      <div className={`text-center ${scenario.text}`}>
                        <div className="text-2xl font-bold mb-2">{scenario.rate}%</div>
                        <div className="text-sm font-medium mb-3">Retention Rate</div>
                        
                        <div className="space-y-2 text-xs">
                          <div className="border-t border-current opacity-30 pt-2">
                            <div className="font-medium">Active Referrals:</div>
                            <div>{directReferrals.toLocaleString()}</div>
                          </div>
                          
                          <div>
                            <div className="font-medium">Monthly ($5 each):</div>
                            <div>${monthlyCommissions.toLocaleString()}/month</div>
                          </div>
                          
                          <div className="border-t border-current opacity-30 pt-2 mt-2">
                            <div className="font-bold text-lg">${annualCommissions.toLocaleString()}</div>
                            <div className="font-medium">Annual Total</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-green-700 to-emerald-700 border border-green-500 rounded-lg">
                <h4 className="font-semibold text-white mb-2">✅ FTC-Compliant Single-Tier Affiliate Program</h4>
                <p className="text-sm text-green-100 mb-2">
                  Earn $5/month per direct referral - simple, transparent, and unlimited potential!
                </p>
                <p className="text-xs text-green-50">
                  Plus earn achievement bonuses as you reach tier milestones: $50 (Bronze) → $100 (Silver) → $200 (Gold) → $500 (Platinum) → $1,000 (Diamond)
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* How it Works */}
        <Card className="mt-8 bg-gradient-to-br from-gray-900 to-blue-950 border-blue-800">
          <CardHeader>
            <CardTitle className="text-white">How Your Circle of Influence Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-white mb-3">5-Circle Network Structure</h3>
                <ul className="space-y-2 text-sm text-white/90">
                  <li>• <strong className="text-amber-400">Circle 1:</strong> Bronze Affiliate Ambassador (5 referrals)</li>
                  <li>• <strong className="text-amber-400">Circle 2:</strong> Silver Affiliate Ambassador (25 referrals)</li>
                  <li>• <strong className="text-amber-400">Circle 3:</strong> Gold Affiliate Ambassador (125 referrals)</li>
                  <li>• <strong className="text-amber-400">Circle 4:</strong> Platinum Affiliate Ambassador (625 referrals)</li>
                  <li>• <strong className="text-amber-400">Circle 5:</strong> Diamond Affiliate Ambassador (3,125 referrals)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-3">Simple Commission + Achievement Bonuses</h3>
                <ul className="space-y-2 text-sm text-white/90">
                  <li>• $5/month recurring commission per direct referral</li>
                  <li>• Unlimited referrals - no cap on earnings</li>
                  <li>• FTC-compliant single-tier affiliate model</li>
                  <li>• 5-tier achievement system: Bronze → Silver → Gold → Platinum → Diamond</li>
                  <li>• One-time bonuses: $50 → $100 → $200 → $500 → $1,000</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
