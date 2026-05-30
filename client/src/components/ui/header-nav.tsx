import { Link, useLocation } from "wouter";
import { User, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderNavProps {
  user?: {
    firstName: string;
    lastName: string;
    profilePicture?: string | null;
  };
}

export function HeaderNav({ user }: HeaderNavProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 600);
  };

  const navigation = [
    { name: "Dashboard", href: "/", current: location === "/" },
    { name: "Referrals", href: "/network", current: location === "/network" },
    { name: "Calculator", href: "/calculator", current: location === "/calculator" },
    { name: "Store", href: "/store", current: location === "/store" },
    { name: "Resources", href: "/resources", current: location === "/resources" },
    { name: "Healthcare", href: "/konnectmd", current: location === "/konnectmd" },
    { name: "Profile", href: "/profile", current: location === "/profile" },
  ];

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}` : "JD";

  return (
    <header className="bg-primary shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-2">
                <img 
                  src="/fr2p-logo.jpeg" 
                  alt="FR2P - Financial Roadway 2 Prosperity Club" 
                  className={`h-12 w-auto cursor-pointer transition-transform duration-500 ${isSpinning ? 'animate-spin' : ''}`}
                  onClick={handleLogoClick}
                  data-testid="header-logo"
                />
              </Link>
            </div>
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    item.current
                      ? "text-primary-foreground border-b-2 border-accent"
                      : "text-primary-foreground/80 hover:text-accent"
                  } px-1 pt-1 pb-4 text-sm font-medium transition-colors`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="hidden sm:block text-sm font-semibold text-gold-500">
              {user ? `${user.firstName} ${user.lastName}` : "John Doe"}
            </span>
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src={user?.profilePicture || undefined} 
                alt={user ? `${user.firstName} ${user.lastName}` : "User"}
              />
              <AvatarFallback className="bg-accent text-accent-foreground text-sm font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-primary-foreground hover:text-accent hover:bg-accent/10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-border">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    item.current
                      ? "text-primary-foreground bg-accent/20"
                      : "text-primary-foreground/80 hover:text-accent hover:bg-accent/10"
                  } block px-3 py-2 rounded-md text-base font-medium transition-colors`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
