import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Search, 
  Users, 
  Trophy, 
  Star, 
  Filter, 
  Grid3X3, 
  List, 
  Building2,
  GraduationCap,
  Award,
  ChevronDown,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Member {
  member_id: string;
  full_name: string;
  profile_photo_url: string | null;
  department: string | null;
  total_points: number;
  achievement_count: number;
}

export default function Members() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("points");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const fetchMembers = async () => {
      const { data, error } = await supabase
        .from("member_leaderboard")
        .select("*");

      if (!error && data) {
        setMembers(data as Member[]);
      }
      setIsLoading(false);
    };

    fetchMembers();
  }, []);

  const departments = useMemo(() => {
    const depts = new Set(members.map(m => m.department).filter(Boolean));
    return Array.from(depts) as string[];
  }, [members]);

  const filteredMembers = useMemo(() => {
    return members
      .filter(member => {
        const matchesSearch = member.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             member.department?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDepartment = departmentFilter === "all" || member.department === departmentFilter;
        return matchesSearch && matchesDepartment;
      })
      .sort((a, b) => {
        if (sortBy === "points") return (b.total_points || 0) - (a.total_points || 0);
        if (sortBy === "achievements") return (b.achievement_count || 0) - (a.achievement_count || 0);
        if (sortBy === "name") return (a.full_name || "").localeCompare(b.full_name || "");
        return 0;
      });
  }, [members, searchQuery, departmentFilter, sortBy]);

  const totalPoints = members.reduce((sum, m) => sum + (m.total_points || 0), 0);
  const totalAchievements = members.reduce((sum, m) => sum + (m.achievement_count || 0), 0);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return <Badge className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white border-0">🥇 #1</Badge>;
    if (index === 1) return <Badge className="bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0">🥈 #2</Badge>;
    if (index === 2) return <Badge className="bg-gradient-to-r from-amber-600 to-amber-700 text-white border-0">🥉 #3</Badge>;
    return null;
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="absolute inset-0 pattern-dots opacity-30" />
          
          {/* Floating Elements */}
          <motion.div
            animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-20 left-[10%] w-20 h-20 rounded-full bg-primary/10 blur-2xl"
          />
          <motion.div
            animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-20 right-[15%] w-32 h-32 rounded-full bg-accent/10 blur-2xl"
          />

          <div className="container relative mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
              >
                <Users className="w-4 h-4" />
                <span>Member Directory</span>
                <Sparkles className="w-4 h-4" />
              </motion.div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Discover Our <span className="text-gradient-primary">Achievers</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-10">
                Search and explore member profiles, view their achievements, and celebrate success together
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
                {[
                  { label: "Members", value: members.length, icon: Users },
                  { label: "Total Points", value: totalPoints.toLocaleString(), icon: Star },
                  { label: "Achievements", value: totalAchievements, icon: Trophy },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="text-center p-4 rounded-xl bg-card/80 backdrop-blur border border-border/50 shadow-sm"
                  >
                    <stat.icon className="w-5 h-5 mx-auto mb-2 text-primary" />
                    <p className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Search & Filters */}
        <section className="container mx-auto px-4 sm:px-6 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-2xl border border-border/50 shadow-lg p-4 sm:p-6"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search members by name or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-base bg-background border-border/50 focus:border-primary/50"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-[180px] h-12 bg-background">
                    <Building2 className="w-4 h-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px] h-12 bg-background">
                    <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="points">Most Points</SelectItem>
                    <SelectItem value="achievements">Most Achievements</SelectItem>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Toggle */}
                <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-10 px-3"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="h-10 px-3"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <span>Showing {filteredMembers.length} of {members.length} members</span>
              {searchQuery && (
                <Button variant="ghost" size="sm" onClick={() => setSearchQuery("")}>
                  Clear search
                </Button>
              )}
            </div>
          </motion.div>
        </section>

        {/* Members Grid/List */}
        <section className="container mx-auto px-4 sm:px-6 pb-20">
          {isLoading ? (
            <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="p-6">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-16 h-16 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredMembers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Users className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No members found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
              <Button variant="outline" onClick={() => { setSearchQuery(""); setDepartmentFilter("all"); }}>
                Reset filters
              </Button>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={viewMode}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`grid gap-4 sm:gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}
              >
                {filteredMembers.map((member, index) => (
                  <motion.div
                    key={member.member_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Link to={`/member/${member.member_id}`}>
                      {viewMode === "grid" ? (
                        <Card className="group card-achievement cursor-pointer h-full">
                          <CardContent className="p-6">
                            <div className="flex flex-col items-center text-center">
                              {/* Rank Badge */}
                              <div className="mb-4">
                                {getRankBadge(index)}
                              </div>

                              {/* Avatar */}
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="relative mb-4"
                              >
                                <Avatar className="w-20 h-20 border-4 border-primary/20 shadow-lg group-hover:border-primary/40 transition-colors">
                                  <AvatarImage src={member.profile_photo_url || undefined} />
                                  <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                                    {getInitials(member.full_name || "?")}
                                  </AvatarFallback>
                                </Avatar>
                                {member.total_points > 0 && (
                                  <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow-lg">
                                    {index < 10 ? index + 1 : ""}
                                  </div>
                                )}
                              </motion.div>

                              {/* Info */}
                              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1 line-clamp-1">
                                {member.full_name}
                              </h3>
                              {member.department && (
                                <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1">
                                  <GraduationCap className="w-3.5 h-3.5" />
                                  {member.department}
                                </p>
                              )}

                              {/* Stats */}
                              <div className="flex items-center justify-center gap-4 w-full pt-4 border-t border-border/50">
                                <div className="text-center">
                                  <div className="flex items-center gap-1 justify-center text-primary">
                                    <Star className="w-4 h-4" />
                                    <span className="font-bold">{member.total_points || 0}</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground">Points</p>
                                </div>
                                <div className="w-px h-8 bg-border" />
                                <div className="text-center">
                                  <div className="flex items-center gap-1 justify-center text-foreground">
                                    <Trophy className="w-4 h-4" />
                                    <span className="font-bold">{member.achievement_count || 0}</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground">Achievements</p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <Card className="group card-achievement cursor-pointer">
                          <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center gap-4">
                              {/* Rank */}
                              <div className="w-10 text-center shrink-0">
                                <span className={`text-lg font-bold ${index < 3 ? "text-primary" : "text-muted-foreground"}`}>
                                  #{index + 1}
                                </span>
                              </div>

                              {/* Avatar */}
                              <Avatar className="w-14 h-14 border-2 border-border group-hover:border-primary/40 transition-colors shrink-0">
                                <AvatarImage src={member.profile_photo_url || undefined} />
                                <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
                                  {getInitials(member.full_name || "?")}
                                </AvatarFallback>
                              </Avatar>

                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                    {member.full_name}
                                  </h3>
                                  {getRankBadge(index)}
                                </div>
                                {member.department && (
                                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                                    <GraduationCap className="w-3.5 h-3.5" />
                                    {member.department}
                                  </p>
                                )}
                              </div>

                              {/* Stats */}
                              <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                                <div className="text-center hidden sm:block">
                                  <div className="flex items-center gap-1 justify-center text-primary">
                                    <Star className="w-4 h-4" />
                                    <span className="font-bold text-lg">{member.total_points || 0}</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground">Points</p>
                                </div>
                                <div className="text-center hidden sm:block">
                                  <div className="flex items-center gap-1 justify-center text-foreground">
                                    <Trophy className="w-4 h-4" />
                                    <span className="font-bold text-lg">{member.achievement_count || 0}</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground">Achievements</p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </section>
      </div>
    </PublicLayout>
  );
}