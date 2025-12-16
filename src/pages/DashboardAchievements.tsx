import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Calendar, Award, FileText, Plus, Pencil, Trash2, X } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  achievement_date: string;
  file_url: string;
  created_at: string;
  added_by: string | null;
}

interface FormData {
  title: string;
  description: string;
  category: string;
  achievement_date: string;
  file_url: string;
}

export default function DashboardAchievements() {
  const { profile } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    category: "",
    achievement_date: "",
    file_url: "",
  });

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

  useEffect(() => {
    fetchAchievements();
  }, [profile?.id]);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      achievement_date: "",
      file_url: "",
    });
    setEditingId(null);
  };

  const openDialog = (achievement?: Achievement) => {
    if (achievement) {
      setEditingId(achievement.id);
      setFormData({
        title: achievement.title,
        description: achievement.description || "",
        category: achievement.category || "",
        achievement_date: achievement.achievement_date || "",
        file_url: achievement.file_url || "",
      });
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!profile?.id || !formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    const achievementData = {
      member_id: profile.id,
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      category: formData.category.trim() || null,
      achievement_date: formData.achievement_date || null,
      file_url: formData.file_url.trim() || null,
    };

    if (editingId) {
      const { error } = await supabase
        .from("achievements")
        .update(achievementData)
        .eq("id", editingId);

      if (error) {
        toast.error("Failed to update achievement");
        return;
      }
      toast.success("Achievement updated successfully");
    } else {
      const { error } = await supabase
        .from("achievements")
        .insert(achievementData);

      if (error) {
        toast.error("Failed to add achievement");
        return;
      }
      toast.success("Achievement added successfully");
    }

    setDialogOpen(false);
    resetForm();
    fetchAchievements();
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
              My Achievements
            </motion.h1>
            <p className="text-muted-foreground mt-2">
              Manage and showcase your achievements
            </p>
          </div>
          <Button onClick={() => openDialog()} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Achievement
          </Button>
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
                <Card className="h-full hover:shadow-card-hover transition-shadow group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Trophy className="w-7 h-7 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-foreground text-lg">
                            {achievement.title}
                          </h3>
                          {!achievement.added_by && (
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
                        {achievement.added_by && (
                          <p className="text-xs text-muted-foreground mt-2 italic">
                            Added by admin
                          </p>
                        )}
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
                <p className="text-muted-foreground mb-4">
                  Start adding your achievements to showcase your accomplishments
                </p>
                <Button onClick={() => openDialog()} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Your First Achievement
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Achievement" : "Add Achievement"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Achievement title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Academic, Sports, Arts"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your achievement"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="achievement_date">Date</Label>
              <Input
                id="achievement_date"
                type="date"
                value={formData.achievement_date}
                onChange={(e) => setFormData({ ...formData, achievement_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file_url">Certificate URL</Label>
              <Input
                id="file_url"
                value={formData.file_url}
                onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                placeholder="Link to certificate or proof"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingId ? "Update" : "Add"} Achievement
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
