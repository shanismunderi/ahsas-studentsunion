import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Plus, Trash2, Edit, Search } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

interface Achievement {
  id: string;
  member_id: string;
  title: string;
  description: string;
  category: string;
  achievement_date: string;
  file_url: string;
  created_at: string;
  profiles?: { full_name: string };
}

interface Member {
  id: string;
  full_name: string;
}

export default function AdminAchievements() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [formData, setFormData] = useState({
    member_id: "",
    title: "",
    description: "",
    category: "",
    achievement_date: "",
    file_url: "",
  });

  const fetchData = async () => {
    const [achievementsRes, membersRes] = await Promise.all([
      supabase
        .from("achievements")
        .select("*, profiles(full_name)")
        .order("created_at", { ascending: false }),
      supabase.from("profiles").select("id, full_name"),
    ]);

    if (achievementsRes.data) setAchievements(achievementsRes.data);
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
        .update(formData)
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
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      member_id: "",
      title: "",
      description: "",
      category: "",
      achievement_date: "",
      file_url: "",
    });
    setEditingAchievement(null);
  };

  const filtered = achievements.filter(
    (a) =>
      a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-foreground"
            >
              Manage Achievements
            </motion.h1>
            <p className="text-muted-foreground mt-2">Add achievements to member profiles</p>
          </div>
          <Button variant="gold" onClick={() => openDialog()}>
            <Plus className="w-4 h-4 mr-2" /> Add Achievement
          </Button>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search achievements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">Loading...</TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No achievements found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium">{a.title}</TableCell>
                      <TableCell>{a.profiles?.full_name || "-"}</TableCell>
                      <TableCell>{a.category || "-"}</TableCell>
                      <TableCell>
                        {a.achievement_date ? new Date(a.achievement_date).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
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
      </div>
    </DashboardLayout>
  );
}
