import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Calendar, Award, FileText } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  achievement_date: string;
  file_url: string;
  created_at: string;
}

export default function DashboardAchievements() {
  const { profile } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      if (!profile?.id) return;

      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .eq("member_id", profile.id)
        .order("achievement_date", { ascending: false });

      if (!error && data) {
        setAchievements(data);
      }
      setIsLoading(false);
    };

    fetchAchievements();
  }, [profile?.id]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-foreground"
          >
            My Achievements
          </motion.h1>
          <p className="text-muted-foreground mt-2">
            View achievements assigned to your profile by admin
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-20 bg-muted rounded-lg"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-card-hover transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Trophy className="w-7 h-7 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-lg">
                          {achievement.title}
                        </h3>
                        {achievement.category && (
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mt-2">
                            {achievement.category}
                          </span>
                        )}
                        {achievement.description && (
                          <p className="text-muted-foreground text-sm mt-3">
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
                              View Certificate
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardContent className="py-16 text-center">
                <Award className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Achievements Yet
                </h3>
                <p className="text-muted-foreground">
                  Achievements will appear here once they are added by admin
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
