import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatDisplayName } from "@/lib/utils";
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
  { name: "Home", href: "/home" },
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
    if (href === "/home") return location.pathname === "/home" || location.pathname === "/";
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
      navigate("/home");
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
            ? "bg-background/95 backdrop-blur-xl border-b border-border"
            : "bg-transparent"
        )}
      >
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-foreground flex items-center justify-center">
                <GraduationCap className="w-5 h-5 lg:w-6 lg:h-6 text-background" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg lg:text-xl font-bold text-foreground tracking-tight">
                  AHSAs
                </span>
                <span className="text-[8px] lg:text-[9px] text-muted-foreground font-medium uppercase tracking-[0.15em] hidden sm:block">
                  Al Hasanath Students Association
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
                      ? "text-foreground bg-secondary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* CTA Buttons / User Menu */}
            <div className="hidden lg:flex items-center gap-3">
              <ThemeToggle />
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 px-3 hover:bg-secondary"
                    >
                      <Avatar className="w-8 h-8 border border-border">
                        <AvatarImage src={profile?.profile_photo_url || ""} />
                        <AvatarFallback className="bg-foreground text-background text-sm">
                          {getInitials(profile?.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm max-w-[120px] truncate">
                        {formatDisplayName(profile?.full_name) || user.email?.split("@")[0]}
                      </span>
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-popover border-border">
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
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="sm">
                      Join Ahsas
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <ThemeToggle />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                {isOpen ? (
                  <X className="w-6 h-6 text-foreground" />
                ) : (
                  <Menu className="w-6 h-6 text-foreground" />
                )}
              </button>
            </div>
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
                <div className="py-4 space-y-1 border-t border-border bg-background max-h-[calc(100vh-5rem)] overflow-y-auto">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={cn(
                        "block px-4 py-3 rounded-lg text-sm font-medium transition-all",
                        isActive(link.href)
                          ? "text-foreground bg-secondary"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      )}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="pt-3 space-y-2 border-t border-border mt-2 px-4">
                    {user ? (
                      <>
                        <div className="flex items-center gap-3 py-3">
                          <Avatar className="w-10 h-10 flex-shrink-0 border border-border">
                            <AvatarImage src={profile?.profile_photo_url || ""} />
                            <AvatarFallback className="bg-foreground text-background text-sm">
                              {getInitials(profile?.full_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm truncate">{formatDisplayName(profile?.full_name)}</p>
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
                            Sign In
                          </Button>
                        </Link>
                        <Link to="/login" className="block">
                          <Button className="w-full h-11">
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
