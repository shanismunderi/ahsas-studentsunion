import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Trophy, 
  Award, 
  ArrowLeft, 
  Star, 
  Calendar, 
  Building2, 
  Medal,
  TrendingUp,
  Sparkles,
  ExternalLink,
  FileText,
  CheckCircle2,
  Clock,
  Target
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

interface Profile {
  id: string;
  full_name: string;
  profile_photo_url: string | null;
  department: string | null;
  year_of_admission: number | null;
  year_of_pass_out: number | null;
}

interface Achievement {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  points: number | null;
  achievement_date: string | null;
  status: string | null;
  file_url: string | null;
}

interface LeaderboardStats {
  total_points: number;
  achievement_count: number;
  rank: number;
}

const categoryConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  academic: { icon: FileText, color: "text-blue-600", bg: "bg-blue-500/10 border-blue-500/20" },
  sports: { icon: Trophy, color: "text-emerald-600", bg: "bg-emerald-500/10 border-emerald-500/20" },
  cultural: { icon: Sparkles, color: "text-purple-600", bg: "bg-purple-500/10 border-purple-500/20" },
  technical: { icon: Target, color: "text-orange-600", bg: "bg-orange-500/10 border-orange-500/20" },
  leadership: { icon: Award, color: "text-rose-600", bg: "bg-rose-500/10 border-rose-500/20" },
};

export default function MemberProfile() {
  const { memberId } = useParams<{ memberId: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<LeaderboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemberData = async () => {
      if (!memberId) return;

      try {
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id, full_name, profile_photo_url, department, year_of_admission, year_of_pass_out")
          .eq("id", memberId)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        // Fetch approved achievements
        const { data: achievementsData, error: achievementsError } = await supabase
          .from("achievements")
          .select("id, title, description, category, points, achievement_date, status, file_url")
          .eq("member_id", memberId)
          .eq("status", "approved")
          .order("achievement_date", { ascending: false });

        if (achievementsError) throw achievementsError;
        setAchievements(achievementsData || []);

        // Fetch leaderboard stats
        const { data: leaderboardData, error: leaderboardError } = await supabase
          .from("member_leaderboard")
          .select("*");

        if (!leaderboardError && leaderboardData) {
          const sorted = leaderboardData.sort((a, b) => (b.total_points || 0) - (a.total_points || 0));
          const memberStats = sorted.find(m => m.member_id === memberId);
          const rank = sorted.findIndex(m => m.member_id === memberId) + 1;
          
          if (memberStats) {
            setStats({
              total_points: memberStats.total_points || 0,
              achievement_count: memberStats.achievement_count || 0,
              rank: rank,
            });
          }
        }
      } catch (err: any) {
        setError(err.message || "Failed to load member profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemberData();
  }, [memberId]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getCategoryConfig = (category: string | null) => {
    return categoryConfig[category?.toLowerCase() || ""] || { 
      icon: Award, 
      color: "text-muted-foreground", 
      bg: "bg-muted border-muted" 
    };
  };

  const getRankBadgeStyle = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-500 to-amber-600 text-white";
    if (rank === 2) return "bg-gradient-to-r from-gray-400 to-gray-500 text-white";
    if (rank === 3) return "bg-gradient-to-r from-amber-600 to-amber-700 text-white";
    return "bg-primary/10 text-primary";
  };

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto space-y-8">
            <Skeleton className="h-8 w-32" />
            <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
              <Skeleton className="w-36 h-36 rounded-full" />
              <div className="space-y-3 flex-1">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-5 w-40" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-28 rounded-2xl" />
              <Skeleton className="h-28 rounded-2xl" />
              <Skeleton className="h-28 rounded-2xl" />
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (error || !profile) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto text-center py-24">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Award className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-4">Member Not Found</h1>
            <p className="text-muted-foreground mb-8">{error || "The member profile you're looking for doesn't exist."}</p>
            <Link to="/members">
              <Button size="lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Members
              </Button>
            </Link>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
        {/* Hero Pattern */}
        <div className="absolute inset-x-0 top-0 h-96 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="absolute inset-0 pattern-dots opacity-30" />
        </div>

        <div className="container relative mx-auto px-4 py-8 sm:py-12">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Link to="/members">
                <Button variant="ghost" size="sm" className="group">
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Back to Members
                </Button>
              </Link>
            </motion.div>

            {/* Profile Header Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="overflow-hidden border-border/50 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
                <CardContent className="relative p-8 sm:p-10">
                  <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
                    {/* Avatar */}
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className="relative"
                    >
                      <div className="relative">
                        <Avatar className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-primary/20 shadow-2xl">
                          <AvatarImage src={profile.profile_photo_url || undefined} />
                          <AvatarFallback className="text-3xl sm:text-4xl font-bold bg-primary/10 text-primary">
                            {getInitials(profile.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        {stats && stats.rank <= 3 && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.3, type: "spring" }}
                            className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg"
                          >
                            <Medal className="w-6 h-6 text-white" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>

                    {/* Info */}
                    <div className="flex-1 text-center lg:text-left space-y-4">
                      <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                          {profile.full_name}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                          {profile.department && (
                            <Badge variant="secondary" className="px-3 py-1.5 text-sm">
                              <Building2 className="w-3.5 h-3.5 mr-1.5" />
                              {profile.department}
                            </Badge>
                          )}
                          {(profile.year_of_admission || profile.year_of_pass_out) && (
                            <Badge variant="outline" className="px-3 py-1.5 text-sm">
                              <Calendar className="w-3.5 h-3.5 mr-1.5" />
                              {profile.year_of_admission && `Batch ${profile.year_of_admission}`}
                              {profile.year_of_admission && profile.year_of_pass_out && " - "}
                              {profile.year_of_pass_out && profile.year_of_pass_out}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Rank Badge */}
                      {stats && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Badge className={`${getRankBadgeStyle(stats.rank)} px-4 py-2 text-sm font-semibold border-0`}>
                            <Trophy className="w-4 h-4 mr-2" />
                            Rank #{stats.rank} {stats.rank <= 3 ? "Top Achiever" : "Achiever"}
                          </Badge>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Stats Grid */}
            {stats && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-3 gap-4 sm:gap-6"
              >
                {[
                  { 
                    label: "Total Points", 
                    value: stats.total_points, 
                    icon: Star, 
                    gradient: "from-primary/10 to-primary/5",
                    iconColor: "text-primary",
                    valueColor: "text-primary"
                  },
                  { 
                    label: "Achievements", 
                    value: stats.achievement_count, 
                    icon: Trophy,
                    gradient: "from-accent/10 to-accent/5",
                    iconColor: "text-accent",
                    valueColor: "text-foreground"
                  },
                  { 
                    label: "Leaderboard", 
                    value: `#${stats.rank}`, 
                    icon: TrendingUp,
                    gradient: "from-emerald-500/10 to-emerald-500/5",
                    iconColor: "text-emerald-600",
                    valueColor: "text-foreground"
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + index * 0.05 }}
                  >
                    <Card className={`relative overflow-hidden border-border/50 bg-gradient-to-br ${stat.gradient}`}>
                      <CardContent className="p-5 sm:p-6 text-center">
                        <stat.icon className={`w-7 h-7 sm:w-8 sm:h-8 ${stat.iconColor} mx-auto mb-3`} />
                        <p className={`text-3xl sm:text-4xl font-bold ${stat.valueColor}`}>
                          {stat.value}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Achievements Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-border/50 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <span className="text-foreground">Achievements</span>
                      <p className="text-sm font-normal text-muted-foreground mt-0.5">
                        {achievements.length} verified achievement{achievements.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="p-6">
                  {achievements.length > 0 ? (
                    <div className="grid gap-4 sm:gap-5">
                      {achievements.map((achievement, index) => {
                        const config = getCategoryConfig(achievement.category);
                        const Icon = config.icon;
                        
                        return (
                          <motion.div
                            key={achievement.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.35 + index * 0.05 }}
                          >
                            <Card className="card-achievement group">
                              <CardContent className="p-5 sm:p-6">
                                <div className="flex gap-4 sm:gap-5">
                                  {/* Category Icon */}
                                  <div className={`shrink-0 w-12 h-12 rounded-xl border ${config.bg} flex items-center justify-center`}>
                                    <Icon className={`w-5 h-5 ${config.color}`} />
                                  </div>

                                  {/* Content */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                                      <div>
                                        <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                                          {achievement.title}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                          {achievement.category && (
                                            <Badge variant="outline" className={`text-xs ${config.bg} ${config.color} border`}>
                                              {achievement.category}
                                            </Badge>
                                          )}
                                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                            Verified
                                          </div>
                                        </div>
                                      </div>

                                      {/* Points Badge */}
                                      {achievement.points && achievement.points > 0 && (
                                        <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                                          <Star className="w-4 h-4 text-primary" />
                                          <span className="font-bold text-primary">{achievement.points}</span>
                                          <span className="text-xs text-primary/70">pts</span>
                                        </div>
                                      )}
                                    </div>

                                    {/* Description */}
                                    {achievement.description && (
                                      <p className="text-muted-foreground text-sm leading-relaxed mt-3">
                                        {achievement.description}
                                      </p>
                                    )}

                                    {/* Footer */}
                                    <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-border/50">
                                      {achievement.achievement_date && (
                                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                          <Calendar className="w-4 h-4" />
                                          {new Date(achievement.achievement_date).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric"
                                          })}
                                        </div>
                                      )}
                                      {achievement.file_url && (
                                        <a 
                                          href={achievement.file_url} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <ExternalLink className="w-4 h-4" />
                                          View Certificate
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                        <Trophy className="w-10 h-10 text-muted-foreground/50" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">No achievements yet</h3>
                      <p className="text-muted-foreground">This member hasn't added any achievements yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}