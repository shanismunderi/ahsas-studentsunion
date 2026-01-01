import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, Plus, Trash2, Edit, Search, CheckCircle2, XCircle, 
  Clock, Star, FileText, MessageSquare, Filter, Eye 
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface Achievement {
  id: string;
  member_id: string;
  title: string;
  description: string;
  category: string;
  achievement_date: string;
  file_url: string;
  created_at: string;
  status: string;
  points: number;
  admin_feedback: string | null;
  reviewed_by: string | null;
  profiles?: { full_name: string };
}

interface Member {
  id: string;
  full_name: string;
}

const POINT_OPTIONS = [
  { value: 25, label: "25 - Basic" },
  { value: 50, label: "50 - Notable" },
  { value: 75, label: "75 - Outstanding" },
  { value: 100, label: "100 - Exceptional" },
  { value: 150, label: "150 - Excellence" },
  { value: 200, label: "200 - Extraordinary" },
];

export default function AdminAchievements() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewingAchievement, setReviewingAchievement] = useState<Achievement | null>(null);
  const [reviewData, setReviewData] = useState({ points: 100, feedback: "" });
  const [formData, setFormData] = useState({
    member_id: "",
    title: "",
    description: "",
    category: "",
    achievement_date: "",
    file_url: "",
    points: 100,
  });

  const fetchData = async () => {
    const [achievementsRes, membersRes] = await Promise.all([
      supabase
        .from("achievements")
        .select("*, profiles(full_name)")
        .order("created_at", { ascending: false }),
      supabase.from("profiles").select("id, full_name"),
    ]);

    if (achievementsRes.data) setAchievements(achievementsRes.data as Achievement[]);
    if (membersRes.data) setMembers(membersRes.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!formData.member_id || !formData.title) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }

    if (editingAchievement) {
      const { error } = await supabase
        .from("achievements")
        .update({
          ...formData,
          status: 'approved',
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", editingAchievement.id);

      if (error) {
        toast({ title: "Error updating", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Achievement updated" });
      }
    } else {
      const { error } = await supabase.from("achievements").insert({
        ...formData,
        added_by: user?.id,
        status: 'approved',
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString(),
      });

      if (error) {
        toast({ title: "Error creating", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Achievement created" });
      }
    }

    setIsDialogOpen(false);
    setEditingAchievement(null);
    resetForm();
    fetchData();
  };

  const handleApprove = async () => {
    if (!reviewingAchievement) return;

    const { error } = await supabase
      .from("achievements")
      .update({
        status: 'approved',
        points: reviewData.points,
        admin_feedback: reviewData.feedback || null,
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", reviewingAchievement.id);

    if (error) {
      toast({ title: "Error approving", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Achievement approved!", description: `Awarded ${reviewData.points} points` });
    }

    setReviewDialogOpen(false);
    setReviewingAchievement(null);
    setReviewData({ points: 100, feedback: "" });
    fetchData();
  };

  const handleReject = async () => {
    if (!reviewingAchievement || !reviewData.feedback.trim()) {
      toast({ title: "Please provide feedback for rejection", variant: "destructive" });
      return;
    }

    const { error } = await supabase
      .from("achievements")
      .update({
        status: 'rejected',
        points: 0,
        admin_feedback: reviewData.feedback,
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", reviewingAchievement.id);

    if (error) {
      toast({ title: "Error rejecting", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Achievement rejected" });
    }

    setReviewDialogOpen(false);
    setReviewingAchievement(null);
    setReviewData({ points: 100, feedback: "" });
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this achievement?")) return;
    await supabase.from("achievements").delete().eq("id", id);
    toast({ title: "Achievement deleted" });
    fetchData();
  };

  const openDialog = (achievement?: Achievement) => {
    if (achievement) {
      setEditingAchievement(achievement);
      setFormData({
        member_id: achievement.member_id,
        title: achievement.title,
        description: achievement.description || "",
        category: achievement.category || "",
        achievement_date: achievement.achievement_date || "",
        file_url: achievement.file_url || "",
        points: achievement.points || 100,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const openReviewDialog = (achievement: Achievement) => {
    setReviewingAchievement(achievement);
    setReviewData({ points: 100, feedback: "" });
    setReviewDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      member_id: "",
      title: "",
      description: "",
      category: "",
      achievement_date: "",
      file_url: "",
      points: 100,
    });
    setEditingAchievement(null);
  };

  const filtered = achievements.filter((a) => {
    const matchesSearch = 
      a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = achievements.filter(a => a.status === 'pending').length;
  const approvedCount = achievements.filter(a => a.status === 'approved').length;
  const rejectedCount = achievements.filter(a => a.status === 'rejected').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20"><CheckCircle2 className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-foreground"
            >
              Manage Achievements
            </motion.h1>
            <p className="text-muted-foreground mt-2">Review and manage member achievements</p>
          </div>
          <Button variant="gold" onClick={() => openDialog()}>
            <Plus className="w-4 h-4 mr-2" /> Add Achievement
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-yellow-500/20 bg-yellow-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
                  <p className="text-xs text-muted-foreground">Pending Review</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-green-500/20 bg-green-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{approvedCount}</p>
                  <p className="text-xs text-muted-foreground">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-red-500/20 bg-red-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <XCircle className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{rejectedCount}</p>
                  <p className="text-xs text-muted-foreground">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search achievements or members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Achievements Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">Loading...</TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No achievements found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((a) => (
                    <TableRow key={a.id} className={a.status === 'pending' ? 'bg-yellow-500/5' : ''}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{a.title}</span>
                          {a.file_url && (
                            <a href={a.file_url} target="_blank" rel="noopener noreferrer">
                              <FileText className="w-4 h-4 text-accent hover:text-accent/80" />
                            </a>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{a.profiles?.full_name || "-"}</TableCell>
                      <TableCell>{a.category || "-"}</TableCell>
                      <TableCell>{getStatusBadge(a.status)}</TableCell>
                      <TableCell>
                        {a.status === 'approved' && a.points > 0 && (
                          <div className="flex items-center gap-1 text-accent">
                            <Star className="w-4 h-4" />
                            <span className="font-semibold">{a.points}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {a.achievement_date ? new Date(a.achievement_date).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {a.status === 'pending' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => openReviewDialog(a)}
                              className="text-accent hover:text-accent"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Review
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => openDialog(a)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(a.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingAchievement ? "Edit" : "Add"} Achievement</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Member *</label>
                <Select
                  value={formData.member_id}
                  onValueChange={(v) => setFormData({ ...formData, member_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select member" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((m) => (
                      <SelectItem key={m.id} value={m.id}>{m.full_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Category</label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Academic, Sports, Leadership"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Points</label>
                <Select
                  value={formData.points.toString()}
                  onValueChange={(v) => setFormData({ ...formData, points: parseInt(v) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {POINT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value.toString()}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Date</label>
                <Input
                  type="date"
                  value={formData.achievement_date}
                  onChange={(e) => setFormData({ ...formData, achievement_date: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Certificate URL</label>
                <Input
                  value={formData.file_url}
                  onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button variant="gold" onClick={handleSave}>
                  {editingAchievement ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Review Dialog */}
        <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-accent" />
                Review Achievement
              </DialogTitle>
            </DialogHeader>
            
            {reviewingAchievement && (
              <div className="space-y-6 pt-4">
                {/* Achievement Details */}
                <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    {reviewingAchievement.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Submitted by: <span className="text-foreground">{reviewingAchievement.profiles?.full_name}</span>
                  </p>
                  {reviewingAchievement.category && (
                    <Badge variant="outline" className="mt-2">{reviewingAchievement.category}</Badge>
                  )}
                  {reviewingAchievement.description && (
                    <p className="text-sm text-muted-foreground mt-3">{reviewingAchievement.description}</p>
                  )}
                  {reviewingAchievement.file_url && (
                    <a 
                      href={reviewingAchievement.file_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-accent hover:underline mt-3"
                    >
                      <FileText className="w-4 h-4" />
                      View Certificate
                    </a>
                  )}
                </div>

                {/* Points Selection */}
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-accent" />
                    Award Points
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {POINT_OPTIONS.map((opt) => (
                      <Button
                        key={opt.value}
                        type="button"
                        variant={reviewData.points === opt.value ? "default" : "outline"}
                        className={reviewData.points === opt.value ? "bg-accent text-accent-foreground" : ""}
                        onClick={() => setReviewData({ ...reviewData, points: opt.value })}
                      >
                        {opt.value} pts
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Feedback */}
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-accent" />
                    Feedback (required for rejection)
                  </label>
                  <Textarea
                    value={reviewData.feedback}
                    onChange={(e) => setReviewData({ ...reviewData, feedback: e.target.value })}
                    placeholder="Provide feedback to the member..."
                    rows={3}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-red-500/30 text-red-600 hover:bg-red-500/10"
                    onClick={handleReject}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleApprove}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Approve ({reviewData.points} pts)
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}