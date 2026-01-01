import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, FileText, Bell, Calendar, ArrowRight, Sparkles, TrendingUp, Star, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
      gradient: "from-amber-500/20 via-yellow-500/10 to-orange-500/20",
      iconBg: "bg-gradient-to-br from-amber-500 to-yellow-600",
      href: "/dashboard/achievements",
    },
    {
      title: "Documents",
      value: stats.documents,
      icon: FileText,
      gradient: "from-emerald-500/20 via-teal-500/10 to-cyan-500/20",
      iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600",
      href: "/dashboard/documents",
    },
    {
      title: "Announcements",
      value: announcements.length,
      icon: Bell,
      gradient: "from-violet-500/20 via-purple-500/10 to-fuchsia-500/20",
      iconBg: "bg-gradient-to-br from-violet-500 to-purple-600",
      href: "#announcements",
    },
  ];

  const quickActions = [
    {
      title: "Update Profile",
      description: "Keep your information up to date",
      icon: Star,
      href: "/dashboard/profile",
      color: "from-amber-500 to-yellow-600",
    },
    {
      title: "View Achievements",
      description: "See your accomplishments",
      icon: Trophy,
      href: "/dashboard/achievements",
      color: "from-emerald-500 to-teal-600",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Premium Header */}
        <div className="relative">
          {/* Background Glow */}
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-50" />
          <div className="absolute -top-10 right-0 w-64 h-64 bg-purple/10 rounded-full blur-3xl opacity-30" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="h-1.5 w-12 bg-gradient-to-r from-accent to-amber-400 rounded-full" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                Member Dashboard
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Welcome back,{" "}
              <span className="text-gradient-gold">
                {profile?.full_name?.split(" ")[0] || "Member"}
              </span>
            </h1>
            <p className="text-muted-foreground mt-3 text-lg">
              Here's what's happening with your account today
            </p>
          </motion.div>
        </div>

        {/* Premium Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Link to={stat.href}>
                <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 hover-lift">
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {/* Glow Effect */}
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors duration-500" />
                  
                  {/* Content */}
                  <div className="relative flex items-start justify-between">
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        {stat.title}
                      </p>
                      <p className="text-5xl font-bold text-foreground tracking-tight">
                        {stat.value}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                        <span>View details</span>
                      </div>
                    </div>
                    
                    <div className={`w-14 h-14 rounded-2xl ${stat.iconBg} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  
                  {/* Bottom Border Accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Premium Announcements Section */}
        <motion.div
          id="announcements"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Recent Announcements</h2>
                  <p className="text-sm text-muted-foreground">Stay updated with the latest news</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent animate-pulse-slow" />
                <span className="text-xs font-medium text-accent">{announcements.length} new</span>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6">
              {announcements.length > 0 ? (
                <div className="space-y-4">
                  {announcements.map((announcement, index) => (
                    <motion.div
                      key={announcement.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="group relative p-5 rounded-xl bg-secondary/50 border border-border/50 hover:border-accent/30 hover:bg-secondary transition-all duration-300"
                    >
                      {/* Accent Line */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-accent to-amber-600 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="flex items-start justify-between gap-4 pl-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors duration-300">
                            {announcement.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                            {announcement.body}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 text-xs text-muted-foreground whitespace-nowrap">
                          <Calendar className="w-3 h-3" />
                          {new Date(announcement.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-secondary/50 flex items-center justify-center mb-4">
                    <Bell className="w-10 h-10 text-muted-foreground/30" />
                  </div>
                  <p className="text-muted-foreground">No announcements yet</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">Check back later for updates</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Premium Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-5">
            <Zap className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {quickActions.map((action, index) => (
              <Link key={action.title} to={action.href}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 hover-lift"
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors duration-300">
                          {action.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {action.description}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all duration-300" />
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
