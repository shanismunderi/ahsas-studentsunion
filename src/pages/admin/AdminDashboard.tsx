import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Trophy, FileText, Bell, Newspaper, Image, TrendingUp, Calendar, Activity, ArrowUpRight, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface RecentActivity {
  id: string;
  type: 'member' | 'post' | 'announcement' | 'achievement';
  title: string;
  description: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    members: 0,
    achievements: 0,
    documents: 0,
    announcements: 0,
    posts: 0,
    gallery: 0,
  });
  const [recentMembers, setRecentMembers] = useState<any[]>([]);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
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

      // Fetch recent data
      const { data: recentMembersData } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      const { data: recentPostsData } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      const { data: recentAnnouncementsData } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);

      if (recentMembersData) setRecentMembers(recentMembersData);
      if (recentPostsData) setRecentPosts(recentPostsData);
      if (recentAnnouncementsData) setRecentAnnouncements(recentAnnouncementsData);
    };

    fetchData();
  }, []);

  const statCards = [
    { title: "Total Members", value: stats.members, icon: Users, href: "/admin/members", color: "text-primary", bgColor: "bg-primary/10" },
    { title: "Achievements", value: stats.achievements, icon: Trophy, href: "/admin/achievements", color: "text-accent", bgColor: "bg-accent/10" },
    { title: "Documents", value: stats.documents, icon: FileText, href: "/admin/documents", color: "text-teal", bgColor: "bg-teal/10" },
    { title: "Announcements", value: stats.announcements, icon: Bell, href: "/admin/announcements", color: "text-purple-500", bgColor: "bg-purple-500/10" },
    { title: "Posts", value: stats.posts, icon: Newspaper, href: "/admin/posts", color: "text-blue-500", bgColor: "bg-blue-500/10" },
    { title: "Gallery Items", value: stats.gallery, icon: Image, href: "/admin/gallery", color: "text-pink-500", bgColor: "bg-pink-500/10" },
  ];

  const quickActions = [
    { title: "Add Member", icon: Users, href: "/admin/members", color: "bg-primary" },
    { title: "New Post", icon: Newspaper, href: "/admin/posts", color: "bg-blue-500" },
    { title: "Announcement", icon: Bell, href: "/admin/announcements", color: "bg-purple-500" },
    { title: "Upload Photo", icon: Image, href: "/admin/gallery", color: "bg-pink-500" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-foreground"
            >
              Admin Dashboard
            </motion.h1>
            <p className="text-muted-foreground mt-2">
              Welcome back! Here's what's happening with your platform.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <Activity className="w-3 h-3 mr-1" />
              System Online
            </Badge>
          </div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {quickActions.map((action) => (
            <Link key={action.title} to={action.href}>
              <Button 
                variant="outline" 
                className="w-full h-auto py-4 flex flex-col items-center gap-2 hover:border-accent hover:bg-accent/5 transition-all"
              >
                <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium">{action.title}</span>
              </Button>
            </Link>
          ))}
        </motion.div>

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
                <Card className="hover:shadow-card-hover transition-all cursor-pointer group border-border/50 hover:border-accent/30">
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
                    <div className="flex items-center mt-4 text-sm text-muted-foreground group-hover:text-accent transition-colors">
                      <span>View all</span>
                      <ArrowUpRight className="w-4 h-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Members */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Recent Members
                </CardTitle>
                <Link to="/admin/members">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentMembers.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No members yet</p>
                ) : (
                  recentMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {member.full_name?.charAt(0) || 'M'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{member.full_name}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {member.member_id || 'New'}
                      </Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Announcements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Bell className="w-5 h-5 text-purple-500" />
                  Recent Announcements
                </CardTitle>
                <Link to="/admin/announcements">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentAnnouncements.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-sm text-muted-foreground mb-3">No announcements yet</p>
                    <Link to="/admin/announcements">
                      <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Create First Announcement
                      </Button>
                    </Link>
                  </div>
                ) : (
                  recentAnnouncements.map((announcement) => (
                    <div key={announcement.id} className="p-4 rounded-lg border border-border/50 hover:border-purple-500/30 transition-colors">
                      <h4 className="font-medium text-foreground">{announcement.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {announcement.body}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {format(new Date(announcement.created_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-blue-500" />
                Recent Posts
              </CardTitle>
              <Link to="/admin/posts">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentPosts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground mb-3">No posts yet</p>
                  <Link to="/admin/posts">
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Post
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentPosts.slice(0, 3).map((post) => (
                    <div key={post.id} className="p-4 rounded-lg border border-border/50 hover:border-blue-500/30 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={post.is_published ? "default" : "secondary"} className="text-xs">
                          {post.is_published ? "Published" : "Draft"}
                        </Badge>
                        <Badge variant="outline" className="text-xs capitalize">
                          {post.post_type}
                        </Badge>
                      </div>
                      <h4 className="font-medium text-foreground line-clamp-1">{post.title}</h4>
                      <p className="text-xs text-muted-foreground mt-2">
                        {format(new Date(post.created_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Platform Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-5 h-5 text-accent" />
                <h2 className="text-xl font-semibold text-foreground">Platform Overview</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 rounded-xl bg-background/50 border border-border/50">
                  <p className="text-2xl font-bold text-foreground">{stats.members}</p>
                  <p className="text-sm text-muted-foreground">Active Members</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-background/50 border border-border/50">
                  <p className="text-2xl font-bold text-foreground">{stats.posts}</p>
                  <p className="text-sm text-muted-foreground">Published Posts</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-background/50 border border-border/50">
                  <p className="text-2xl font-bold text-foreground">{stats.achievements}</p>
                  <p className="text-sm text-muted-foreground">Achievements Given</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-background/50 border border-border/50">
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
