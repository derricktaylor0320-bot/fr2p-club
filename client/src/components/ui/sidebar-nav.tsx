import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Home,
  Users,
  Calculator,
  Store,
  BookOpen,
  User,
  Crown,
  Menu,
  X,
  MessageCircle,
  Heart,
  FileText,
  Trophy,
  Gem,
  Megaphone,
  Building2,
  GraduationCap,
  TrendingUp,
  Newspaper,
  Lightbulb,
  ShoppingBag,
  Target,
  LogIn,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { isLoggedIn, logout, getLoggedInName } from "@/lib/auth";

interface SidebarNavProps {
  className?: string;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Prospect Manager", href: "/prospects", icon: Target },
  { name: "Why Join FR2P", href: "/why-join", icon: Lightbulb, highlight: true },
  { name: "Member Marketplace", href: "/marketplace", icon: ShoppingBag, highlight: true },
  { name: "Advertise With Us", href: "/advertise", icon: Megaphone, highlight: true },
  { name: "Referrals", href: "/network", icon: Users },
  { name: "Calculator", href: "/calculator", icon: Calculator },
  { name: "Compensation Plan", href: "/compensation-plan", icon: Crown },
  { name: "Consolidatus Empire", href: "/empire", icon: Building2, highlight: true },
  { name: "Executive Tier", href: "/executive-tier", icon: Gem, highlight: true },
  { name: "Ambassador Program", href: "/ambassador", icon: Megaphone, highlight: true },
  { name: "Certifications", href: "/certifications", icon: GraduationCap, highlight: true },
  { name: "Wealth Building", href: "/investments", icon: TrendingUp, highlight: true },
  { name: "Wealth Monthly", href: "/magazine", icon: Newspaper, highlight: true },
  { name: "Achievements", href: "/achievements", icon: Trophy },
  { name: "Store", href: "/store", icon: Store },
  { name: "Chat", href: "/chat", icon: MessageCircle },
  { name: "Resources", href: "/resources", icon: BookOpen },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Donate", href: "/donate", icon: Heart },
  { name: "Terms", href: "/terms", icon: FileText },
];

export function SidebarNav({ className }: SidebarNavProps) {
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const loggedIn = isLoggedIn();
  const memberName = getLoggedInName();

  function handleLogout() {
    logout();
    setIsMobileOpen(false);
    window.location.href = "/login";
  }

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 600);
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50 bg-primary text-primary-foreground"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        data-testid="button-mobile-menu"
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-navy-900 via-navy-800 to-navy-900 border-r border-navy-700 shadow-2xl transform transition-transform duration-300 ease-in-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          className
        )}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-center h-20 px-6 border-b border-gold-400/30 bg-gradient-to-r from-navy-900 to-navy-800 shadow-lg">
          <Link href="/" className="flex items-center justify-center">
            <img
              src="/fr2p-logo-new.jpeg"
              alt="The FR2P Club"
              className={`h-14 w-14 rounded-full object-cover border-2 border-[#FFD700] shadow-lg cursor-pointer transition-transform duration-500 ${isSpinning ? 'animate-spin' : 'hover:scale-105'}`}
              onClick={handleLogoClick}
              data-testid="sidebar-logo"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all group",
                  isActive
                    ? "bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 shadow-lg shadow-gold-500/30"
                    : "text-cream-100 hover:text-white hover:bg-navy-700/50"
                )}
                data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setIsMobileOpen(false)}
              >
                <Icon 
                  className={cn(
                    "mr-3 h-5 w-5 transition-colors",
                    isActive 
                      ? "text-navy-900" 
                      : "text-cream-200 group-hover:text-gold-300"
                  )} 
                />
                {item.name}
                {item.name === "Compensation Plan" && (
                  <Crown className="ml-auto h-4 w-4 text-amber-400" />
                )}
                {(item as any).highlight && (
                  <span className="ml-auto px-2 py-0.5 text-xs bg-gradient-to-r from-amber-400 to-amber-500 text-navy-900 rounded-full font-bold">NEW</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-amber-400/20 space-y-3">
          {loggedIn ? (
            <div className="space-y-2">
              <div className="text-xs text-[#FFD700]/70 text-center truncate px-1">Signed in as {memberName}</div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-white/70 hover:text-white hover:bg-red-500/20 text-xs flex items-center gap-2"
                onClick={handleLogout}
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Link href="/login" onClick={() => setIsMobileOpen(false)}>
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-[#FFD700] hover:text-[#001f3f] hover:bg-[#FFD700] text-xs flex items-center gap-2 border border-[#FFD700]/30"
              >
                <LogIn className="h-3.5 w-3.5" />
                Sign In
              </Button>
            </Link>
          )}
          <div className="text-center">
            <div className="text-xs text-blue-200">
              The FR2P Club - Financial Roadway 2 Prosperity
            </div>
            <div className="text-xs text-amber-400 font-semibold mt-1">
              Building Wealth Through Community
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}