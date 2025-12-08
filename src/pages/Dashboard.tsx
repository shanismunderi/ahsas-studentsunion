import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, FileText, Bell, Calendar, ArrowRight } from "lucide-react";
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

      // Fetch announcements
      const { data: announcementsData } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);

      if (announcementsData) {
        setAnnouncements(announcementsData);
      }

      // Fetch stats
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
      color: "text-accent",
      bgColor: "bg-accent/10",
      href: "/dashboard/achievements",
    },
    {
      title: "Documents",
      value: stats.documents,
      icon: FileText,
      color: "text-teal",
      bgColor: "bg-teal/10",
      href: "/dashboard/documents",
    },
    {
      title: "Announcements",
      value: announcements.length,
      icon: Bell,
      color: "text-primary",
      bgColor: "bg-primary/10",
      href: "#announcements",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-foreground"
          >
            Welcome back, {profile?.full_name?.split(" ")[0] || "Member"}!
          </motion.h1>
          <p className="text-muted-foreground mt-2">
            Here's what's happening with your account today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={stat.href}>
                <Card className="hover:shadow-card-hover transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-bold text-foreground mt-2">
                          {stat.value}
                        </p>
                      </div>
                      <div className={`w-14 h-14 rounded-2xl ${stat.bgColor} flex items-center justify-center`}>
                        <stat.icon className={`w-7 h-7 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Announcements */}
        <motion.div
          id="announcements"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-accent" />
                Recent Announcements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {announcements.length > 0 ? (
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="p-4 rounded-xl bg-muted/50 border border-border"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {announcement.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {announcement.body}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                          <Calendar className="w-3 h-3" />
                          {new Date(announcement.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">No announcements yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/dashboard/profile">
              <Card className="hover:shadow-card-hover transition-shadow cursor-pointer group">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">Update Profile</h3>
                    <p className="text-sm text-muted-foreground">
                      Keep your information up to date
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                </CardContent>
              </Card>
            </Link>
            <Link to="/dashboard/achievements">
              <Card className="hover:shadow-card-hover transition-shadow cursor-pointer group">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">View Achievements</h3>
                    <p className="text-sm text-muted-foreground">
                      See your accomplishments
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                </CardContent>
              </Card>
            </Link>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
