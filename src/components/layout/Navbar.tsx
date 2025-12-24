import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard, Search, Facebook, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { SignOutDialog } from "@/components/SignOutDialog";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import logo from "/lovable-uploads/c8289fc4-78f6-43b7-b2e5-947c434bbeda.png";

const navLinks = [
  { name: "Events", href: "/news" },
  { name: "Sub Wings", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Gallery", href: "/gallery" },
  { name: "About Us", href: "/contact" },
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: "X", href: "#", label: "X" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, isAdmin, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      setShowSignOutDialog(false);
      toast({
        title: "Signed out successfully",
        description: "See you next time!",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const dashboardLink = isAdmin ? "/admin" : "/dashboard";

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        {/* Curved Header Container */}
        <div className={cn(
          "mx-2 sm:mx-4 lg:mx-8 mt-2 sm:mt-3 transition-all duration-300",
          scrolled ? "bg-card/95 backdrop-blur-xl shadow-card" : "bg-card/90 backdrop-blur-sm",
          "rounded-[20px] sm:rounded-[30px] lg:rounded-[40px] border border-border/50"
        )}>
          {/* Top Bar - Social & Search */}
          <div className="hidden lg:flex items-center justify-end gap-4 px-6 py-2 border-b border-border/30">
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                >
                  {social.icon === "X" ? (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ) : (
                    <social.icon className="w-4 h-4" />
                  )}
                </a>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="What are you looking for"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-48 pl-9 text-xs bg-muted/50 border-border/50 rounded-full"
              />
            </div>
          </div>

          <nav className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
                <img 
                  src={logo} 
                  alt="AHSAS Logo" 
                  className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 object-contain"
                />
                <div className="flex flex-col">
                  <span className="text-base sm:text-lg lg:text-xl font-bold text-primary">
                    AHSAS
                  </span>
                  <span className="text-[7px] sm:text-[8px] lg:text-[9px] text-muted-foreground font-medium uppercase tracking-wide leading-tight hidden xs:block">
                    AL HASANATH<br />STUDENTS<br />ASSOCIATION
                  </span>
                </div>
              </Link>

              {/* Desktop - Welcome Message */}
              <div className="hidden lg:flex flex-col items-center">
                <span className="text-sm text-muted-foreground">Welcome to <span className="text-primary font-semibold">AHSAs</span>,</span>
                <span className="text-sm text-foreground">Check out what's new here</span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      "px-4 py-2 text-sm font-medium transition-all duration-200 relative",
                      isActive(link.href)
                        ? "text-primary"
                        : "text-foreground hover:text-primary"
                    )}
                  >
                    {link.name}
                    {isActive(link.href) && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-0.5 bg-primary rounded-full" />
                    )}
                  </Link>
                ))}
              </div>

              {/* CTA Buttons / User Menu */}
              <div className="hidden lg:flex items-center gap-3">
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-2 px-3 hover:bg-muted"
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={profile?.profile_photo_url || ""} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                            {getInitials(profile?.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm max-w-[120px] truncate">
                          {profile?.full_name || user.email?.split("@")[0]}
                        </span>
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-popover">
                      <div className="px-3 py-2">
                        <p className="font-medium text-sm">{profile?.full_name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to={dashboardLink} className="cursor-pointer">
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          {isAdmin ? "Admin Dashboard" : "My Dashboard"}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard/profile" className="cursor-pointer">
                          <User className="w-4 h-4 mr-2" />
                          My Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setShowSignOutDialog(true)}
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link to="/login">
                    <Button variant="default" size="sm" className="rounded-full px-6 bg-primary hover:bg-primary/90">
                      <LogOut className="w-4 h-4 mr-2 rotate-180" />
                      Student Login
                    </Button>
                  </Link>
                )}
                <ThemeToggle />
              </div>

              {/* Mobile Menu Button */}
              <div className="flex lg:hidden items-center gap-2">
                <ThemeToggle />
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  {isOpen ? (
                    <X className="w-6 h-6 text-foreground" />
                  ) : (
                    <Menu className="w-6 h-6 text-foreground" />
                  )}
                </button>
              </div>
            </div>
          </nav>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="lg:hidden overflow-hidden"
              >
                <div className="py-4 px-4 space-y-1 border-t border-border/30 max-h-[calc(100vh-6rem)] overflow-y-auto">
                  {/* Mobile Search */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-10 pl-10 bg-muted/50 border-border/50 rounded-full"
                    />
                  </div>

                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={cn(
                        "block px-4 py-3 rounded-xl text-sm font-medium transition-all",
                        isActive(link.href)
                          ? "text-primary bg-primary/10"
                          : "text-foreground hover:bg-muted"
                      )}
                    >
                      {link.name}
                    </Link>
                  ))}

                  {/* Mobile Social Links */}
                  <div className="flex items-center justify-center gap-3 py-4">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        aria-label={social.label}
                        className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                      >
                        {social.icon === "X" ? (
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        ) : (
                          <social.icon className="w-5 h-5" />
                        )}
                      </a>
                    ))}
                  </div>

                  <div className="pt-3 space-y-2 border-t border-border/30">
                    {user ? (
                      <>
                        <div className="flex items-center gap-3 py-3 px-4">
                          <Avatar className="w-10 h-10 flex-shrink-0">
                            <AvatarImage src={profile?.profile_photo_url || ""} />
                            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                              {getInitials(profile?.full_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm truncate">{profile?.full_name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          </div>
                        </div>
                        <Link to={dashboardLink} className="block">
                          <Button variant="outline" className="w-full justify-start h-11 rounded-xl">
                            <LayoutDashboard className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="truncate">{isAdmin ? "Admin Dashboard" : "My Dashboard"}</span>
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          className="w-full h-11 rounded-xl"
                          onClick={() => setShowSignOutDialog(true)}
                        >
                          <LogOut className="w-4 h-4 mr-2 flex-shrink-0" />
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <Link to="/login" className="block">
                        <Button className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90">
                          <LogOut className="w-4 h-4 mr-2 rotate-180" />
                          Student Login
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      <SignOutDialog
        open={showSignOutDialog}
        onOpenChange={setShowSignOutDialog}
        onConfirm={handleSignOut}
        isLoading={isSigningOut}
      />
    </>
  );
}
