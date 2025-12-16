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
  { name: "Gallery", href: "/admin/gallery", icon: FileText },
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
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-primary border-b border-border flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-accent" />
          </div>
          <span className="text-lg font-bold text-primary-foreground">Ahsas</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSignOutDialogOpen(true)}
            className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
          >
            <LogOut className="w-5 h-5" />
          </Button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-primary-foreground/10 transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6 text-primary-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-primary-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Desktop Sidebar - Always visible on lg+ */}
      <aside className="hidden lg:flex fixed top-0 left-0 z-50 w-72 h-screen bg-primary flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-primary-foreground/10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-accent" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-primary-foreground">Ahsas</span>
              <span className="text-[10px] text-primary-foreground/60 uppercase tracking-widest">
                {isAdmin ? "Admin Panel" : "Member Portal"}
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {isAdmin && (
            <div className="flex items-center gap-2 px-4 py-2 mb-4">
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
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive(link.href)
                  ? "bg-accent text-accent-foreground shadow-gold"
                  : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
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
        <div className="p-4 border-t border-primary-foreground/10 mt-auto">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-primary-foreground truncate">
                {profile?.full_name || "User"}
              </p>
              <p className="text-xs text-primary-foreground/60 truncate">
                {profile?.email}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={() => setSignOutDialogOpen(true)}
            className="w-full justify-start text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
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
            {/* Mobile Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/50"
            />

            <motion.aside
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="lg:hidden fixed top-0 left-0 z-50 w-72 h-screen bg-primary flex flex-col"
            >
              {/* Logo */}
              <div className="p-6 border-b border-primary-foreground/10">
                <Link to="/" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                    <GraduationCap className="w-7 h-7 text-accent" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-primary-foreground">Ahsas</span>
                    <span className="text-[10px] text-primary-foreground/60 uppercase tracking-widest">
                      {isAdmin ? "Admin Panel" : "Member Portal"}
                    </span>
                  </div>
                </Link>
              </div>

              {/* Navigation */}
              <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
                {isAdmin && (
                  <div className="flex items-center gap-2 px-4 py-2 mb-4">
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
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive(link.href)
                        ? "bg-accent text-accent-foreground shadow-gold"
                        : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
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
              <div className="p-4 border-t border-primary-foreground/10 mt-auto">
                <div className="flex items-center gap-3 px-4 py-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary-foreground truncate">
                      {profile?.full_name || "User"}
                    </p>
                    <p className="text-xs text-primary-foreground/60 truncate">
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
                  className="w-full justify-start text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
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
      <main className="lg:ml-72 min-h-screen pt-16 lg:pt-0">
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
