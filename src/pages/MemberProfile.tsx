import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Award, ArrowLeft, Star, Calendar, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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
}

interface LeaderboardStats {
  total_points: number;
  achievement_count: number;
  rank: number;
}

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
          .select("id, title, description, category, points, achievement_date, status")
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

  const getCategoryColor = (category: string | null) => {
    const colors: Record<string, string> = {
      academic: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      sports: "bg-green-500/10 text-green-600 border-green-500/20",
      cultural: "bg-purple-500/10 text-purple-600 border-purple-500/20",
      technical: "bg-orange-500/10 text-orange-600 border-orange-500/20",
      leadership: "bg-red-500/10 text-red-600 border-red-500/20",
    };
    return colors[category?.toLowerCase() || ""] || "bg-muted text-muted-foreground border-muted";
  };

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            <Skeleton className="h-8 w-32" />
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <Skeleton className="w-32 h-32 rounded-full" />
              <div className="space-y-3 flex-1">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-24 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
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
          <div className="max-w-4xl mx-auto text-center py-20">
            <h1 className="text-2xl font-bold text-foreground mb-4">Member Not Found</h1>
            <p className="text-muted-foreground mb-6">{error || "The member profile you're looking for doesn't exist."}</p>
            <Link to="/">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
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
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Link to="/">
                <Button variant="ghost" size="sm" className="group">
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Back to Leaderboard
                </Button>
              </Link>
            </motion.div>

            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <Card className="overflow-hidden border-border/50 bg-card">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
                <CardContent className="relative p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                    {/* Avatar */}
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Avatar className="w-28 h-28 sm:w-36 sm:h-36 border-4 border-primary/20 shadow-lg">
                        <AvatarImage src={profile.profile_photo_url || undefined} />
                        <AvatarFallback className="text-2xl sm:text-3xl font-bold bg-primary/10 text-primary">
                          {getInitials(profile.full_name)}
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>

                    {/* Info */}
                    <div className="flex-1 text-center sm:text-left space-y-3">
                      <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                          {profile.full_name}
                        </h1>
                        {profile.department && (
                          <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 text-muted-foreground">
                            <Building2 className="w-4 h-4" />
                            <span>{profile.department}</span>
                          </div>
                        )}
                        {(profile.year_of_admission || profile.year_of_pass_out) && (
                          <div className="flex items-center justify-center sm:justify-start gap-2 mt-1 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {profile.year_of_admission && `Batch ${profile.year_of_admission}`}
                              {profile.year_of_admission && profile.year_of_pass_out && " - "}
                              {profile.year_of_pass_out && profile.year_of_pass_out}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Rank Badge */}
                      {stats && stats.rank <= 10 && (
                        <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                          <Trophy className="w-3.5 h-3.5 mr-1.5" />
                          Rank #{stats.rank} Achiever
                        </Badge>
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
                className="grid grid-cols-3 gap-3 sm:gap-4"
              >
                <Card className="text-center p-4 sm:p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                  <Star className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl sm:text-3xl font-bold text-primary">{stats.total_points}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Total Points</p>
                </Card>
                <Card className="text-center p-4 sm:p-6 border-border/50">
                  <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">{stats.achievement_count}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Achievements</p>
                </Card>
                <Card className="text-center p-4 sm:p-6 border-border/50">
                  <Award className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">#{stats.rank}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Rank</p>
                </Card>
              </motion.div>
            )}

            {/* Achievements List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                Achievements
              </h2>

              {achievements.length > 0 ? (
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                    >
                      <Card className="p-4 sm:p-5 border-border/50 hover:border-primary/30 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h3 className="font-semibold text-foreground">{achievement.title}</h3>
                              {achievement.category && (
                                <Badge variant="outline" className={`text-xs ${getCategoryColor(achievement.category)}`}>
                                  {achievement.category}
                                </Badge>
                              )}
                            </div>
                            {achievement.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {achievement.description}
                              </p>
                            )}
                            {achievement.achievement_date && (
                              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(achievement.achievement_date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          {achievement.points && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 shrink-0">
                              <Star className="w-4 h-4 text-primary" />
                              <span className="font-bold text-primary">{achievement.points}</span>
                            </div>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center border-border/50">
                  <Trophy className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No achievements to display yet</p>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}