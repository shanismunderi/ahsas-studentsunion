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
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-background border-b border-border flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-background" />
          </div>
          <span className="text-lg font-bold text-foreground">Ahsas</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSignOutDialogOpen(true)}
            className="text-muted-foreground hover:text-foreground"
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
      <aside className="hidden lg:flex fixed top-0 left-0 z-50 w-64 h-screen bg-card border-r border-border flex-col">
        {/* Logo Section */}
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-foreground flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-background" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground">
                Ahsas
              </span>
              <span className="text-[9px] text-muted-foreground uppercase tracking-[0.15em]">
                {isAdmin ? "Admin Panel" : "Member Portal"}
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {isAdmin && (
            <div className="flex items-center gap-2 px-3 py-2.5 mb-4 rounded-lg bg-secondary border border-border">
              <Shield className="w-4 h-4 text-foreground/70" />
              <span className="text-xs font-medium text-foreground/70 uppercase tracking-wider">
                Admin Access
              </span>
            </div>
          )}
          
          {links.map((link, index) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Link
                to={link.href}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive(link.href)
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <link.icon className="w-5 h-5" />
                <span>{link.name}</span>
                {isActive(link.href) && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2.5 mb-3 rounded-lg bg-secondary">
            <div className="w-9 h-9 rounded-full bg-foreground/10 flex items-center justify-center border border-border">
              <User className="w-4 h-4 text-foreground/70" />
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
            <LogOut className="w-4 h-4 mr-3" />
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
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="lg:hidden fixed top-0 left-0 z-50 w-64 h-screen bg-card border-r border-border flex flex-col"
            >
              {/* Logo */}
              <div className="p-6 border-b border-border">
                <Link to="/" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
                  <div className="w-11 h-11 rounded-xl bg-foreground flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-background" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-foreground">Ahsas</span>
                    <span className="text-[9px] text-muted-foreground uppercase tracking-[0.15em]">
                      {isAdmin ? "Admin Panel" : "Member Portal"}
                    </span>
                  </div>
                </Link>
              </div>

              {/* Navigation */}
              <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
                {isAdmin && (
                  <div className="flex items-center gap-2 px-3 py-2.5 mb-4 rounded-lg bg-secondary border border-border">
                    <Shield className="w-4 h-4 text-foreground/70" />
                    <span className="text-xs font-medium text-foreground/70 uppercase tracking-wider">
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
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive(link.href)
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
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
              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-3 px-3 py-2.5 mb-3 rounded-lg bg-secondary">
                  <div className="w-9 h-9 rounded-full bg-foreground/10 flex items-center justify-center border border-border">
                    <User className="w-4 h-4 text-foreground/70" />
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
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0 relative">
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
