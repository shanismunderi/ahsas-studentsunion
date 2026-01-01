import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, Calendar, Award, FileText, Plus, Pencil, Trash2, 
  Clock, CheckCircle2, XCircle, Sparkles, Star 
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { AchievementFormDialog } from "@/components/achievements/AchievementFormDialog";

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  achievement_date: string;
  file_url: string;
  created_at: string;
  added_by: string | null;
  status: string;
  points: number;
  admin_feedback: string | null;
}

const STATUS_CONFIG = {
  pending: {
    icon: Clock,
    label: "Pending Review",
    className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  },
  approved: {
    icon: CheckCircle2,
    label: "Approved",
    className: "bg-green-500/10 text-green-600 border-green-500/20",
  },
  rejected: {
    icon: XCircle,
    label: "Rejected",
    className: "bg-red-500/10 text-red-600 border-red-500/20",
  },
};

export default function DashboardAchievements() {
  const { profile, user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [totalPoints, setTotalPoints] = useState(0);

  const fetchAchievements = async () => {
    if (!profile?.id) return;

    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .eq("member_id", profile.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setAchievements(data as Achievement[]);
      const points = data
        .filter((a: any) => a.status === "approved")
        .reduce((sum: number, a: any) => sum + (a.points || 0), 0);
      setTotalPoints(points);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAchievements();
  }, [profile?.id]);

  const openDialog = (achievement?: Achievement) => {
    if (achievement) {
      setEditingAchievement(achievement);
    } else {
      setEditingAchievement(null);
    }
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this achievement?")) return;

    const { error } = await supabase.from("achievements").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete achievement");
      return;
    }

    toast.success("Achievement deleted successfully");
    fetchAchievements();
  };

  const stats = {
    total: achievements.length,
    approved: achievements.filter((a) => a.status === "approved").length,
    pending: achievements.filter((a) => a.status === "pending").length,
    rejected: achievements.filter((a) => a.status === "rejected").length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-foreground"
            >
              My Achievements
            </motion.h1>
            <p className="text-muted-foreground mt-2">
              Submit and track your accomplishments
            </p>
          </div>
          <Button 
            onClick={() => openDialog()} 
            className="gap-2 bg-gradient-to-r from-accent to-gold-dark hover:opacity-90 text-accent-foreground"
          >
            <Plus className="w-4 h-4" />
            Submit Achievement
          </Button>
        </div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-5 gap-4"
        >
          <Card className="bg-gradient-to-br from-accent/10 via-accent/5 to-transparent border-accent/20 col-span-2 lg:col-span-1">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Star className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-accent">{totalPoints}</p>
                  <p className="text-xs text-muted-foreground">Total Points</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">{stats.approved}</p>
                  <p className="text-xs text-muted-foreground">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">{stats.pending}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">{stats.rejected}</p>
                  <p className="text-xs text-muted-foreground">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-32 bg-muted rounded-lg"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {achievements.map((achievement, index) => {
                const statusConfig = STATUS_CONFIG[achievement.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
                const StatusIcon = statusConfig.icon;

                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="h-full hover:shadow-card-hover transition-all duration-300 group overflow-hidden">
                      <CardContent className="p-0">
                        {/* Status Bar */}
                        <div className={`px-4 py-2 flex items-center justify-between ${
                          achievement.status === 'approved' ? 'bg-green-500/10' :
                          achievement.status === 'rejected' ? 'bg-red-500/10' :
                          'bg-yellow-500/10'
                        }`}>
                          <div className="flex items-center gap-2">
                            <StatusIcon className={`w-4 h-4 ${
                              achievement.status === 'approved' ? 'text-green-600' :
                              achievement.status === 'rejected' ? 'text-red-600' :
                              'text-yellow-600'
                            }`} />
                            <span className={`text-xs font-medium ${
                              achievement.status === 'approved' ? 'text-green-600' :
                              achievement.status === 'rejected' ? 'text-red-600' :
                              'text-yellow-600'
                            }`}>
                              {statusConfig.label}
                            </span>
                          </div>
                          {achievement.status === 'approved' && achievement.points > 0 && (
                            <div className="flex items-center gap-1 text-accent">
                              <Star className="w-3 h-3" />
                              <span className="text-xs font-bold">+{achievement.points} pts</span>
                            </div>
                          )}
                        </div>

                        <div className="p-5">
                          <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center flex-shrink-0 border border-accent/20">
                              <Trophy className="w-7 h-7 text-accent" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="font-semibold text-foreground text-lg leading-tight">
                                  {achievement.title}
                                </h3>
                                {achievement.status === 'pending' && !achievement.added_by && (
                                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => openDialog(achievement)}
                                    >
                                      <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-destructive hover:text-destructive"
                                      onClick={() => handleDelete(achievement.id)}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                              
                              {achievement.category && (
                                <Badge variant="outline" className="mt-2 text-xs">
                                  {achievement.category}
                                </Badge>
                              )}
                              
                              {achievement.description && (
                                <p className="text-muted-foreground text-sm mt-3 line-clamp-2">
                                  {achievement.description}
                                </p>
                              )}

                              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                                {achievement.achievement_date && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(achievement.achievement_date).toLocaleDateString()}
                                  </span>
                                )}
                                {achievement.file_url && (
                                  <a
                                    href={achievement.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-accent hover:underline"
                                  >
                                    <FileText className="w-4 h-4" />
                                    Certificate
                                  </a>
                                )}
                              </div>

                              {achievement.admin_feedback && (
                                <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border/50">
                                  <p className="text-xs font-medium text-muted-foreground mb-1">Admin Feedback:</p>
                                  <p className="text-sm text-foreground">{achievement.admin_feedback}</p>
                                </div>
                              )}

                              {achievement.added_by && (
                                <p className="text-xs text-muted-foreground mt-3 italic flex items-center gap-1">
                                  <Sparkles className="w-3 h-3" />
                                  Added by admin
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-dashed border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
              <CardContent className="py-16 text-center">
                <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
                  <Award className="w-10 h-10 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  No Achievements Yet
                </h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  Start showcasing your accomplishments by submitting your first achievement. 
                  Earn points and climb the leaderboard!
                </p>
                <Button 
                  onClick={() => openDialog()} 
                  className="gap-2 bg-gradient-to-r from-accent to-gold-dark hover:opacity-90 text-accent-foreground"
                >
                  <Trophy className="w-4 h-4" />
                  Submit Your First Achievement
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {profile?.id && user?.id && (
        <AchievementFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          memberId={profile.id}
          userId={user.id}
          editingAchievement={editingAchievement}
          onSuccess={fetchAchievements}
        />
      )}
    </DashboardLayout>
  );
}