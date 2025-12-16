import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, GraduationCap, ChevronDown, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { SignOutDialog } from "@/components/SignOutDialog";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "News & Events", href: "/news" },
  { name: "Blog", href: "/blog" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
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
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-card"
            : "bg-transparent"
        )}
      >
        <nav className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary flex items-center justify-center shadow-card group-hover:shadow-gold transition-shadow duration-300">
                  <GraduationCap className="w-5 h-5 sm:w-7 sm:h-7 text-accent" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-accent shadow-gold" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                  Ahsas
                </span>
                <span className="text-[8px] sm:text-[10px] text-muted-foreground font-medium uppercase tracking-widest hidden xs:block">
                  AL HASANATH STUDENTS ASSOCIATION
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive(link.href)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* CTA Buttons / User Menu */}
            <div className="hidden lg:flex items-center gap-2">
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
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm">
                      Member Login
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="gold" size="sm">
                      Join Ahsas
                    </Button>
                  </Link>
                </>
              )}
              <ThemeToggle />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>

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
                <div className="py-4 space-y-1 border-t border-border bg-background/95 backdrop-blur-xl max-h-[calc(100vh-5rem)] overflow-y-auto">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={cn(
                        "block px-4 py-3 rounded-lg text-sm font-medium transition-all",
                        isActive(link.href)
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-muted-foreground">Theme</span>
                    <ThemeToggle />
                  </div>
                  <div className="pt-3 space-y-2 border-t border-border mt-2 px-4">
                    {user ? (
                      <>
                        <div className="flex items-center gap-3 py-3">
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
                          <Button variant="outline" className="w-full justify-start h-11">
                            <LayoutDashboard className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="truncate">{isAdmin ? "Admin Dashboard" : "My Dashboard"}</span>
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          className="w-full h-11"
                          onClick={() => setShowSignOutDialog(true)}
                        >
                          <LogOut className="w-4 h-4 mr-2 flex-shrink-0" />
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" className="block">
                          <Button variant="outline" className="w-full h-11">
                            Member Login
                          </Button>
                        </Link>
                        <Link to="/login" className="block">
                          <Button variant="gold" className="w-full h-11">
                            Join Ahsas
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
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
