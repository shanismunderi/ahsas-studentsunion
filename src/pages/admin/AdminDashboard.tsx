import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Trophy, FileText, Bell, Newspaper, Image, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    members: 0,
    achievements: 0,
    documents: 0,
    announcements: 0,
    posts: 0,
    gallery: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [members, achievements, documents, announcements, posts, gallery] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("achievements").select("*", { count: "exact", head: true }),
        supabase.from("documents").select("*", { count: "exact", head: true }),
        supabase.from("announcements").select("*", { count: "exact", head: true }),
        supabase.from("posts").select("*", { count: "exact", head: true }),
        supabase.from("gallery").select("*", { count: "exact", head: true }),
      ]);

      setStats({
        members: members.count || 0,
        achievements: achievements.count || 0,
        documents: documents.count || 0,
        announcements: announcements.count || 0,
        posts: posts.count || 0,
        gallery: gallery.count || 0,
      });
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: "Total Members", value: stats.members, icon: Users, href: "/admin/members", color: "text-primary", bgColor: "bg-primary/10" },
    { title: "Achievements", value: stats.achievements, icon: Trophy, href: "/admin/achievements", color: "text-accent", bgColor: "bg-accent/10" },
    { title: "Documents", value: stats.documents, icon: FileText, href: "/admin/documents", color: "text-teal", bgColor: "bg-teal/10" },
    { title: "Announcements", value: stats.announcements, icon: Bell, href: "/admin/announcements", color: "text-purple-500", bgColor: "bg-purple-500/10" },
    { title: "Posts", value: stats.posts, icon: Newspaper, href: "/admin/posts", color: "text-blue-500", bgColor: "bg-blue-500/10" },
    { title: "Gallery Items", value: stats.gallery, icon: Image, href: "/admin/gallery", color: "text-pink-500", bgColor: "bg-pink-500/10" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-foreground"
          >
            Admin Dashboard
          </motion.h1>
          <p className="text-muted-foreground mt-2">
            Manage your platform content and members
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={stat.href}>
                <Card className="hover:shadow-card-hover transition-all cursor-pointer group">
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
                      <div className={`w-14 h-14 rounded-2xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <stat.icon className={`w-7 h-7 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-5 h-5 text-accent" />
                <h2 className="text-xl font-semibold text-foreground">Platform Overview</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 rounded-xl bg-muted/50">
                  <p className="text-2xl font-bold text-foreground">{stats.members}</p>
                  <p className="text-sm text-muted-foreground">Active Members</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-muted/50">
                  <p className="text-2xl font-bold text-foreground">{stats.posts}</p>
                  <p className="text-sm text-muted-foreground">Published Posts</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-muted/50">
                  <p className="text-2xl font-bold text-foreground">{stats.achievements}</p>
                  <p className="text-sm text-muted-foreground">Achievements Given</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-muted/50">
                  <p className="text-2xl font-bold text-foreground">{stats.gallery}</p>
                  <p className="text-sm text-muted-foreground">Gallery Photos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
