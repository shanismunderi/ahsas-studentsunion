import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Award, Crown, Star, TrendingUp, Users, Sparkles, Gem } from "lucide-react";
import { Link } from "react-router-dom";
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

const RANK_COLORS = ["hsl(217 91% 50%)", "hsl(215 15% 55%)", "hsl(25 70% 45%)"];
const RANK_ICONS = [Crown, Medal, Award];
const RANK_LABELS = ["Champion", "Runner-up", "3rd Place"];

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
    fill: index < 3 ? RANK_COLORS[index] : "hsl(215 15% 35%)",
  }));

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const totalPoints = leaders.reduce((sum, l) => sum + l.total_points, 0);
  const totalAchievements = leaders.reduce((sum, l) => sum + l.achievement_count, 0);

  return (
    <section className="relative py-20 sm:py-32 overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,215,0,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,215,0,0.05),transparent_50%)]" />
      </div>
      
      {/* Decorative Elements */}
      <motion.div
        animate={{ y: [-20, 20, -20], rotate: [0, 5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 w-32 h-32 rounded-full bg-accent/10 blur-3xl"
      />
      <motion.div
        animate={{ y: [20, -20, 20], rotate: [0, -5, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="container relative mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 sm:mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-accent/20 to-gold-light/20 border border-accent/30 text-accent text-sm font-semibold mb-8"
          >
            <Trophy className="w-4 h-4" />
            <span>Achievement Leaderboard</span>
            <Sparkles className="w-4 h-4" />
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Our <span className="text-gradient-gold">Top Achievers</span>
          </h2>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto">
            Celebrating excellence and recognizing our most accomplished members
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          {[
            { label: "Ranked Members", value: leaders.length, icon: Users },
            { label: "Total Points", value: totalPoints.toLocaleString(), icon: Star, accent: true },
            { label: "Achievements", value: totalAchievements, icon: Trophy },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`text-center p-4 sm:p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg ${
                stat.accent 
                  ? "bg-gradient-to-br from-accent/10 to-gold-light/5 border-accent/30" 
                  : "bg-card/50 border-border/50"
              }`}
            >
              <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.accent ? "text-accent" : "text-muted-foreground"}`} />
              <p className={`text-2xl sm:text-3xl font-bold ${stat.accent ? "text-accent" : "text-foreground"}`}>
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Top 3 Podium - Takes 3 columns */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            <Card className="relative overflow-hidden border-0 shadow-luxury bg-gradient-to-br from-card via-card to-accent/5">
              {/* Premium border effect */}
              <div className="absolute inset-0 rounded-lg p-[1px] bg-gradient-to-br from-accent/50 via-transparent to-accent/30 -z-10" />
              
              <CardContent className="relative p-6 sm:p-10">
                {/* Header */}
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-gold-dark p-[2px]">
                    <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center">
                      <Crown className="w-7 h-7 text-accent" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">Hall of Fame</h3>
                    <p className="text-sm text-muted-foreground">Top performers this season</p>
                  </div>
                </div>

                {/* Premium Podium Display */}
                <div className="flex items-end justify-center gap-3 sm:gap-6 h-72 sm:h-80">
                  {/* 2nd Place */}
                  {leaders.length >= 2 && (
                    <PodiumItem
                      member={leaders[1]}
                      rank={2}
                      delay={0.5}
                    />
                  )}
                  
                  {/* 1st Place */}
                  {leaders.length >= 1 && (
                    <PodiumItem
                      member={leaders[0]}
                      rank={1}
                      delay={0.4}
                    />
                  )}
                  
                  {/* 3rd Place */}
                  {leaders.length >= 3 && (
                    <PodiumItem
                      member={leaders[2]}
                      rank={3}
                      delay={0.6}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Rankings List - Takes 2 columns */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="h-full border-border/50 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Rankings</h3>
                    <p className="text-sm text-muted-foreground">All ranked members</p>
                  </div>
                </div>

                {/* Chart */}
                <div className="h-48 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        width={50}
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          background: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '12px',
                          boxShadow: 'var(--shadow-lg)',
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                        cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
                        formatter={(value: number) => [`${value} pts`, 'Score']}
                      />
                      <Bar 
                        dataKey="points" 
                        radius={[0, 8, 8, 0]}
                        barSize={20}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Full List */}
                <div className="space-y-2 max-h-52 overflow-y-auto pr-2">
                  {leaders.map((leader, index) => (
                    <Link key={leader.member_id} to={`/member/${leader.member_id}`}>
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * index }}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 hover:bg-primary/10 cursor-pointer ${
                          index < 3 ? 'bg-primary/5' : ''
                        }`}
                      >
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground' :
                          index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500 text-white' :
                          index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {index + 1}
                        </span>
                        <Avatar className="w-9 h-9 border-2 border-border">
                          <AvatarImage src={leader.profile_photo_url || undefined} />
                          <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                            {getInitials(leader.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {leader.full_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {leader.achievement_count} achievement{leader.achievement_count !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10">
                          <Gem className="w-3.5 h-3.5 text-primary" />
                          <span className="text-sm font-bold text-primary">{leader.total_points}</span>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
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
  delay,
}: {
  member: LeaderboardMember;
  rank: number;
  delay: number;
}) {
  const RankIcon = RANK_ICONS[rank - 1];
  const color = RANK_COLORS[rank - 1];
  const label = RANK_LABELS[rank - 1];
  
  const heights = {
    1: "h-44 sm:h-52",
    2: "h-32 sm:h-40",
    3: "h-24 sm:h-32",
  };
  
  const avatarSizes = {
    1: "w-24 h-24 sm:w-28 sm:h-28",
    2: "w-18 h-18 sm:w-20 sm:h-20",
    3: "w-16 h-16 sm:w-18 sm:h-18",
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Link to={`/member/${member.member_id}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, type: "spring", stiffness: 100 }}
        className="flex flex-col items-center cursor-pointer group"
      >
        {/* Avatar with Crown/Medal */}
        <div className="relative mb-4">
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Avatar 
              className={`${avatarSizes[rank as keyof typeof avatarSizes]} border-4 shadow-xl transition-shadow group-hover:shadow-2xl`} 
              style={{ borderColor: color }}
            >
              <AvatarImage src={member.profile_photo_url || undefined} />
              <AvatarFallback 
                className="text-xl sm:text-2xl font-bold bg-gradient-to-br from-primary/20 to-primary/10 text-primary"
              >
                {getInitials(member.full_name)}
              </AvatarFallback>
            </Avatar>
          </motion.div>
          
          {/* Rank Badge */}
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: delay + 0.2, type: "spring", stiffness: 200 }}
            className="absolute -bottom-2 -right-2 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg"
            style={{ 
              background: `linear-gradient(135deg, ${color}, ${color}dd)`,
            }}
          >
            <RankIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </motion.div>
        </div>
        
        {/* Name */}
        <p className="text-sm sm:text-base font-bold text-foreground text-center max-w-24 sm:max-w-28 truncate mb-1 group-hover:text-primary transition-colors">
          {member.full_name.split(" ")[0]}
        </p>
        
        {/* Podium */}
        <motion.div 
          initial={{ height: 0 }}
          whileInView={{ height: "auto" }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.1, duration: 0.5, ease: "easeOut" }}
          className={`${heights[rank as keyof typeof heights]} w-24 sm:w-32 mt-3 rounded-t-2xl flex flex-col items-center justify-start pt-4 relative overflow-hidden`}
          style={{ 
            background: `linear-gradient(180deg, ${color} 0%, ${color}88 100%)`,
          }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
          
          <span className="text-3xl sm:text-4xl font-black text-white drop-shadow-lg">{rank}</span>
          <div className="flex items-center gap-1 text-white/90 mt-2 px-3 py-1 rounded-full bg-white/20">
            <Star className="w-3.5 h-3.5" />
            <span className="text-xs sm:text-sm font-bold">{member.total_points}</span>
          </div>
          <p className="text-[10px] sm:text-xs text-white/70 mt-2 font-medium">{label}</p>
        </motion.div>
      </motion.div>
    </Link>
  );
}