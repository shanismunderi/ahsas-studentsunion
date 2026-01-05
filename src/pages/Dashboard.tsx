import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, FileText, Bell, Calendar, ArrowRight, TrendingUp, Star, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";

interface Announcement {
  id: string;
  title: string;
  body: string;
  created_at: string;
}

export default function Dashboard() {
  const { profile } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [stats, setStats] = useState({ achievements: 0, documents: 0 });

  useEffect(() => {
    const fetchData = async () => {
      if (!profile?.id) return;

      const { data: announcementsData } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);

      if (announcementsData) {
        setAnnouncements(announcementsData);
      }

      const { count: achievementsCount } = await supabase
        .from("achievements")
        .select("*", { count: "exact", head: true })
        .eq("member_id", profile.id);

      const { count: documentsCount } = await supabase
        .from("documents")
        .select("*", { count: "exact", head: true })
        .eq("member_id", profile.id);

      setStats({
        achievements: achievementsCount || 0,
        documents: documentsCount || 0,
      });
    };

    fetchData();
  }, [profile?.id]);

  const statCards = [
    {
      title: "Achievements",
      value: stats.achievements,
      icon: Trophy,
      href: "/dashboard/achievements",
    },
    {
      title: "Documents",
      value: stats.documents,
      icon: FileText,
      href: "/dashboard/documents",
    },
    {
      title: "Announcements",
      value: announcements.length,
      icon: Bell,
      href: "#announcements",
    },
  ];

  const quickActions = [
    {
      title: "Update Profile",
      description: "Keep your information current",
      icon: Star,
      href: "/dashboard/profile",
    },
    {
      title: "View Achievements",
      description: "See your accomplishments",
      icon: Trophy,
      href: "/dashboard/achievements",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
        >
          <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-[0.2em]">
              Dashboard
            </span>
            <h1 className="mt-2 text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              Welcome back,{" "}
              <span className="text-muted-foreground">
                {profile?.full_name?.split(" ")[0] || "Member"}
              </span>
            </h1>
            <div className="mt-4 h-px w-24 bg-foreground/20" />
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={stat.href}>
                <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 hover:border-foreground/20 transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        {stat.title}
                      </p>
                      <p className="text-5xl font-bold text-foreground tracking-tight">
                        {stat.value}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>View details</span>
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    
                    <div className="w-14 h-14 rounded-2xl bg-foreground/5 border border-border flex items-center justify-center group-hover:bg-foreground group-hover:border-foreground transition-all duration-300">
                      <stat.icon className="w-6 h-6 text-foreground/60 group-hover:text-background transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Announcements Section */}
        <motion.div
          id="announcements"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-foreground/5 border border-border flex items-center justify-center">
                  <Bell className="w-5 h-5 text-foreground/60" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Announcements</h2>
                  <p className="text-sm text-muted-foreground">Latest updates</p>
                </div>
              </div>
              {announcements.length > 0 && (
                <span className="text-xs font-medium text-muted-foreground px-3 py-1.5 rounded-full bg-secondary">
                  {announcements.length} new
                </span>
              )}
            </div>
            
            {/* Content */}
            <div className="p-6">
              {announcements.length > 0 ? (
                <div className="space-y-3">
                  {announcements.map((announcement, index) => (
                    <motion.div
                      key={announcement.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="group relative p-5 rounded-xl border border-border hover:border-foreground/20 bg-secondary/30 hover:bg-secondary/50 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground">
                            {announcement.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                            {announcement.body}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background border border-border text-xs text-muted-foreground whitespace-nowrap">
                          <Calendar className="w-3 h-3" />
                          {new Date(announcement.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-secondary flex items-center justify-center mb-4">
                    <Bell className="w-8 h-8 text-muted-foreground/30" />
                  </div>
                  <p className="text-muted-foreground">No announcements yet</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">Check back later</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Quick Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <Link key={action.title} to={action.href}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="group rounded-2xl border border-border bg-card p-6 hover:border-foreground/20 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-foreground/5 border border-border flex items-center justify-center group-hover:bg-foreground group-hover:border-foreground transition-all duration-300">
                        <action.icon className="w-5 h-5 text-foreground/60 group-hover:text-background transition-colors" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {action.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
