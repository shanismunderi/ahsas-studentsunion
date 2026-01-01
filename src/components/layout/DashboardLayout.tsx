import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  LayoutDashboard,
  User,
  Trophy,
  FileText,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Shield,
  Sparkles,
  Image,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { SignOutDialog } from "@/components/SignOutDialog";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const memberLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Profile", href: "/dashboard/profile", icon: User },
  { name: "Achievements", href: "/dashboard/achievements", icon: Trophy },
  { name: "Documents", href: "/dashboard/documents", icon: FileText },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

const adminLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Members", href: "/admin/members", icon: User },
  { name: "Achievements", href: "/admin/achievements", icon: Trophy },
  { name: "Documents", href: "/admin/documents", icon: FileText },
  { name: "Announcements", href: "/admin/announcements", icon: Bell },
  { name: "Posts", href: "/admin/posts", icon: FileText },
  { name: "Gallery", href: "/admin/gallery", icon: Image },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, isAdmin, signOut } = useAuth();
  const { toast } = useToast();

  const links = isAdmin ? adminLinks : memberLinks;
  const basePath = isAdmin ? "/admin" : "/dashboard";

  const handleSignOut = async () => {
    await signOut();
    toast({ title: "Signed out successfully" });
    navigate("/");
  };

  const isActive = (href: string) => {
    if (href === basePath) return location.pathname === basePath;
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background noise">
      {/* Ambient Glow Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-80 h-80 bg-purple/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-teal/5 rounded-full blur-3xl" />
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-card/95 backdrop-blur-xl border-b border-border/50 flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-amber-600 flex items-center justify-center shadow-lg shadow-accent/20">
            <GraduationCap className="w-5 h-5 text-accent-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">Ahsas</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSignOutDialogOpen(true)}
            className="text-muted-foreground hover:text-foreground hover:bg-secondary"
          >
            <LogOut className="w-5 h-5" />
          </Button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl hover:bg-secondary transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 z-50 w-72 h-screen bg-card/50 backdrop-blur-xl border-r border-border/50 flex-col">
        {/* Logo Section */}
        <div className="p-6 border-b border-border/50">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-accent/30 rounded-xl blur-xl group-hover:bg-accent/40 transition-colors" />
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-amber-600 flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-accent-foreground" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground group-hover:text-accent transition-colors">
                Ahsas
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-[0.15em]">
                {isAdmin ? "Admin Panel" : "Member Portal"}
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {isAdmin && (
            <div className="flex items-center gap-2 px-4 py-3 mb-4 rounded-xl bg-gradient-to-r from-accent/10 to-transparent border border-accent/20">
              <Shield className="w-4 h-4 text-accent" />
              <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                Admin Access
              </span>
              <Sparkles className="w-3 h-3 text-accent ml-auto animate-pulse" />
            </div>
          )}
          
          {links.map((link, index) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={link.href}
                className={cn(
                  "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                  isActive(link.href)
                    ? "bg-gradient-to-r from-accent to-amber-600 text-accent-foreground shadow-lg shadow-accent/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                )}
              >
                <link.icon className={cn(
                  "w-5 h-5 transition-transform duration-300",
                  isActive(link.href) ? "" : "group-hover:scale-110"
                )} />
                <span>{link.name}</span>
                {isActive(link.href) && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3 px-4 py-3 mb-3 rounded-xl bg-secondary/50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center ring-2 ring-accent/20">
              <User className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {profile?.full_name || "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {profile?.email}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={() => setSignOutDialogOpen(true)}
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
            />

            <motion.aside
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="lg:hidden fixed top-0 left-0 z-50 w-72 h-screen bg-card/95 backdrop-blur-xl border-r border-border/50 flex flex-col"
            >
              {/* Logo */}
              <div className="p-6 border-b border-border/50">
                <Link to="/" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-amber-600 flex items-center justify-center shadow-lg">
                    <GraduationCap className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-foreground">Ahsas</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-[0.15em]">
                      {isAdmin ? "Admin Panel" : "Member Portal"}
                    </span>
                  </div>
                </Link>
              </div>

              {/* Navigation */}
              <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
                {isAdmin && (
                  <div className="flex items-center gap-2 px-4 py-3 mb-4 rounded-xl bg-gradient-to-r from-accent/10 to-transparent border border-accent/20">
                    <Shield className="w-4 h-4 text-accent" />
                    <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                      Admin Access
                    </span>
                  </div>
                )}
                
                {links.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                      isActive(link.href)
                        ? "bg-gradient-to-r from-accent to-amber-600 text-accent-foreground shadow-lg shadow-accent/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                    )}
                  >
                    <link.icon className="w-5 h-5" />
                    <span>{link.name}</span>
                    {isActive(link.href) && (
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </Link>
                ))}
              </nav>

              {/* User Info & Logout */}
              <div className="p-4 border-t border-border/50">
                <div className="flex items-center gap-3 px-4 py-3 mb-3 rounded-xl bg-secondary/50">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center ring-2 ring-accent/20">
                    <User className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {profile?.full_name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {profile?.email}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSidebarOpen(false);
                    setSignOutDialogOpen(true);
                  }}
                  className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Sign Out
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen pt-16 lg:pt-0 relative">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>

      {/* Sign Out Dialog */}
      <SignOutDialog
        open={signOutDialogOpen}
        onOpenChange={setSignOutDialogOpen}
        onConfirm={handleSignOut}
      />
    </div>
  );
}
