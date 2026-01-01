import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Award, Crown, Star, TrendingUp, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface LeaderboardMember {
  member_id: string;
  full_name: string;
  profile_photo_url: string | null;
  department: string | null;
  total_points: number;
  achievement_count: number;
}

const RANK_COLORS = ["hsl(42 95% 55%)", "hsl(0 0% 70%)", "hsl(30 60% 50%)"];
const RANK_ICONS = [Crown, Medal, Award];

export function LeaderboardSection() {
  const [leaders, setLeaders] = useState<LeaderboardMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from("member_leaderboard")
        .select("*")
        .limit(10);

      if (!error && data) {
        setLeaders(data as LeaderboardMember[]);
      }
      setIsLoading(false);
    };

    fetchLeaderboard();
  }, []);

  if (isLoading || leaders.length === 0) {
    return null;
  }

  const chartData = leaders.slice(0, 6).map((leader, index) => ({
    name: leader.full_name.split(" ")[0],
    points: leader.total_points,
    fill: index < 3 ? RANK_COLORS[index] : "hsl(220 60% 20%)",
  }));

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-background via-muted/30 to-background overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
            <Trophy className="w-4 h-4" />
            Achievement Leaderboard
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Our Top Achievers
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Celebrating excellence and recognizing our most accomplished members
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Top 3 Podium */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card className="relative overflow-hidden border-accent/20 bg-gradient-to-br from-card via-card to-accent/5">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-accent blur-3xl" />
              </div>
              <CardContent className="relative p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Crown className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Top Performers</h3>
                    <p className="text-sm text-muted-foreground">Based on achievement points</p>
                  </div>
                </div>

                {/* Podium Display */}
                <div className="flex items-end justify-center gap-4 sm:gap-6 mb-8 h-56">
                  {leaders.slice(0, 3).length >= 2 && (
                    <PodiumItem
                      member={leaders[1]}
                      rank={2}
                      height="h-32"
                      delay={0.4}
                    />
                  )}
                  {leaders.length >= 1 && (
                    <PodiumItem
                      member={leaders[0]}
                      rank={1}
                      height="h-44"
                      delay={0.3}
                    />
                  )}
                  {leaders.slice(0, 3).length >= 3 && (
                    <PodiumItem
                      member={leaders[2]}
                      rank={3}
                      height="h-24"
                      delay={0.5}
                    />
                  )}
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/50">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{leaders.length}</p>
                    <p className="text-xs text-muted-foreground">Ranked Members</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-accent">
                      {leaders.reduce((sum, l) => sum + l.total_points, 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Total Points</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {leaders.reduce((sum, l) => sum + l.achievement_count, 0)}
                    </p>
                    <p className="text-xs text-muted-foreground">Achievements</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Points Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full border-border/50">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Points Distribution</h3>
                    <p className="text-sm text-muted-foreground">Top 6 members comparison</p>
                  </div>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        width={60}
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          background: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          boxShadow: 'var(--shadow-md)',
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                        cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
                        formatter={(value: number) => [`${value} points`, 'Score']}
                      />
                      <Bar 
                        dataKey="points" 
                        radius={[0, 6, 6, 0]}
                        barSize={24}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Full Leaderboard List */}
                <div className="mt-8 pt-6 border-t border-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-foreground">Full Rankings</p>
                    <Users className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {leaders.slice(3).map((leader, index) => (
                      <motion.div
                        key={leader.member_id}
                        initial={{ opacity: 0, x: 10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <span className="w-6 text-sm font-medium text-muted-foreground">
                          #{index + 4}
                        </span>
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={leader.profile_photo_url || undefined} />
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {getInitials(leader.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {leader.full_name}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-accent">
                          <Star className="w-3 h-3" />
                          <span className="text-sm font-semibold">{leader.total_points}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function PodiumItem({
  member,
  rank,
  height,
  delay,
}: {
  member: LeaderboardMember;
  rank: number;
  height: string;
  delay: number;
}) {
  const RankIcon = RANK_ICONS[rank - 1];
  const color = RANK_COLORS[rank - 1];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="flex flex-col items-center"
    >
      <div className="relative mb-3">
        <Avatar className={`${rank === 1 ? 'w-20 h-20' : 'w-16 h-16'} border-4`} style={{ borderColor: color }}>
          <AvatarImage src={member.profile_photo_url || undefined} />
          <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
            {getInitials(member.full_name)}
          </AvatarFallback>
        </Avatar>
        <div 
          className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
          style={{ background: color }}
        >
          <RankIcon className="w-4 h-4 text-white" />
        </div>
      </div>
      
      <p className="text-sm font-semibold text-foreground text-center max-w-20 truncate">
        {member.full_name.split(" ")[0]}
      </p>
      
      <div 
        className={`${height} w-20 sm:w-24 mt-3 rounded-t-xl flex flex-col items-center justify-start pt-3`}
        style={{ 
          background: `linear-gradient(180deg, ${color} 0%, ${color}88 100%)`,
        }}
      >
        <span className="text-xl sm:text-2xl font-bold text-white">{rank}</span>
        <div className="flex items-center gap-1 text-white/90 mt-1">
          <Star className="w-3 h-3" />
          <span className="text-xs font-medium">{member.total_points}</span>
        </div>
      </div>
    </motion.div>
  );
}