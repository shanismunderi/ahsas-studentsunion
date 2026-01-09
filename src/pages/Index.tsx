import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { 
  GraduationCap, Hash, Lock, ArrowRight, Eye, EyeOff, Shield, 
  Trophy, Crown, Medal, Award, Users, Star, TrendingUp,
  Sparkles, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";

interface LeaderboardMember {
  member_id: string;
  full_name: string;
  profile_photo_url: string | null;
  department: string | null;
  total_points: number;
  achievement_count: number;
}

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAdmin, signIn, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ admissionNumber: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardMember[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);

  useEffect(() => {
    if (user && !isLoading) {
      navigate(isAdmin ? "/admin" : "/dashboard");
    }
  }, [user, isAdmin, isLoading, navigate]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data } = await supabase
        .from("member_leaderboard")
        .select("*")
        .order("total_points", { ascending: false })
        .limit(10);

      if (data) {
        setLeaderboard(data as LeaderboardMember[]);
      }
      setLeaderboardLoading(false);
    };

    fetchLeaderboard();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("email")
        .eq("member_id", formData.admissionNumber.trim())
        .maybeSingle();

      if (profileError) {
        toast({ title: "Login failed", description: "An error occurred. Please try again.", variant: "destructive" });
        setIsSubmitting(false);
        return;
      }

      if (!profile) {
        toast({ title: "Login failed", description: "Invalid admission number. Please check and try again.", variant: "destructive" });
        setIsSubmitting(false);
        return;
      }

      const { error } = await signIn(profile.email, formData.password);
      if (error) {
        toast({ title: "Login failed", description: "Invalid password. Please try again.", variant: "destructive" });
      } else {
        toast({ title: "Welcome back!", description: "You have been signed in successfully." });
      }
    } catch (err) {
      toast({ title: "Login failed", description: "An unexpected error occurred.", variant: "destructive" });
    }
    setIsSubmitting(false);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Award className="w-5 h-5 text-amber-600" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1: return "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30";
      case 2: return "bg-gradient-to-r from-gray-400/20 to-slate-400/20 border-gray-400/30";
      case 3: return "bg-gradient-to-r from-amber-600/20 to-orange-500/20 border-amber-600/30";
      default: return "bg-card border-border";
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-primary/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/25">
              <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Ahsas
              </span>
              <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-[0.2em]">
                Students Association
              </span>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
          {/* Login Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="order-2 lg:order-1"
          >
            <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-primary/5">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  <Shield className="w-4 h-4" />
                  Member Portal
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Welcome Back</h1>
                <p className="mt-2 text-muted-foreground">
                  Sign in with your admission number to access your dashboard
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Admission Number</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Enter your admission number"
                      value={formData.admissionNumber}
                      onChange={(e) => setFormData({ ...formData, admissionNumber: e.target.value })}
                      required
                      className="h-12 pl-12 bg-background/50 border-border/50 focus:border-primary/50 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      className="h-12 pl-12 pr-12 bg-background/50 border-border/50 focus:border-primary/50 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Signing in...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Sign In <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </form>

              <div className="mt-6 p-4 rounded-xl bg-muted/30 border border-border/30">
                <p className="text-sm text-muted-foreground text-center">
                  <span className="font-medium text-foreground">Don't have credentials?</span>
                  <br />
                  Contact your administrator to get your login details.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Leaderboard Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="order-1 lg:order-2"
          >
            <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-primary/5">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Leaderboard</h2>
                    <p className="text-sm text-muted-foreground">Top achievers this month</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span>Live</span>
                </div>
              </div>

              {leaderboardLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 rounded-xl bg-muted/30 animate-pulse" />
                  ))}
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">No achievements yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  <AnimatePresence>
                    {leaderboard.map((member, index) => (
                      <motion.div
                        key={member.member_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:scale-[1.02] hover:shadow-lg cursor-pointer ${getRankBg(index + 1)}`}
                        onClick={() => member.member_id && navigate(`/member/${member.member_id}`)}
                      >
                        <div className="flex-shrink-0">
                          {getRankIcon(index + 1)}
                        </div>
                        <Avatar className="w-10 h-10 border-2 border-background shadow-md">
                          <AvatarImage src={member.profile_photo_url || undefined} alt={member.full_name || ""} />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {member.full_name?.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground truncate">{member.full_name}</p>
                          <p className="text-xs text-muted-foreground truncate">{member.department || "No department"}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="flex items-center gap-1 text-primary font-bold">
                            <Star className="w-4 h-4" />
                            {member.total_points || 0}
                          </div>
                          <p className="text-xs text-muted-foreground">{member.achievement_count || 0} achievements</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Stats Summary */}
              <div className="mt-6 pt-6 border-t border-border/30">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{leaderboard.length}</p>
                    <p className="text-xs text-muted-foreground">Top Members</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {leaderboard.reduce((sum, m) => sum + (m.total_points || 0), 0)}
                    </p>
                    <p className="text-xs text-muted-foreground">Total Points</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {leaderboard.reduce((sum, m) => sum + (m.achievement_count || 0), 0)}
                    </p>
                    <p className="text-xs text-muted-foreground">Achievements</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 text-sm text-muted-foreground"
        >
          <p>© 2024 Ahsas Students Association. All rights reserved.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
