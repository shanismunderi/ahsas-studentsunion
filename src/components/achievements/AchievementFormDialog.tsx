import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, Upload, X, Award, Sparkles, 
  Calendar, FileText, Star, Check, Loader2 
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AchievementFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberId: string;
  userId: string;
  editingAchievement?: {
    id: string;
    title: string;
    description: string;
    category: string;
    achievement_date: string;
    file_url: string;
  } | null;
  onSuccess: () => void;
}

const CATEGORIES = [
  { value: "academic", label: "Academic Excellence", icon: "📚", points: 100 },
  { value: "sports", label: "Sports & Athletics", icon: "🏆", points: 80 },
  { value: "leadership", label: "Leadership", icon: "👑", points: 90 },
  { value: "arts", label: "Arts & Culture", icon: "🎨", points: 70 },
  { value: "community", label: "Community Service", icon: "🤝", points: 85 },
  { value: "innovation", label: "Innovation & Research", icon: "💡", points: 95 },
  { value: "professional", label: "Professional Achievement", icon: "💼", points: 100 },
  { value: "other", label: "Other", icon: "⭐", points: 50 },
];

export function AchievementFormDialog({
  open,
  onOpenChange,
  memberId,
  userId,
  editingAchievement,
  onSuccess,
}: AchievementFormDialogProps) {
  const [formData, setFormData] = useState({
    title: editingAchievement?.title || "",
    description: editingAchievement?.description || "",
    category: editingAchievement?.category || "",
    achievement_date: editingAchievement?.achievement_date || "",
    file_url: editingAchievement?.file_url || "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedCategory = CATEGORIES.find(c => c.value === formData.category);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload an image or PDF file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('achievement-certificates')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('achievement-certificates')
        .getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, file_url: publicUrl }));
      setUploadedFileName(file.name);
      toast.success("Certificate uploaded successfully");
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error("Failed to upload certificate");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error("Please enter an achievement title");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    setIsSaving(true);
    try {
      const achievementData = {
        member_id: memberId,
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        category: formData.category,
        achievement_date: formData.achievement_date || null,
        file_url: formData.file_url || null,
        status: 'pending',
        points: 0, // Points will be assigned by admin on approval
      };

      if (editingAchievement) {
        const { error } = await supabase
          .from("achievements")
          .update(achievementData)
          .eq("id", editingAchievement.id);

        if (error) throw error;
        toast.success("Achievement updated! Awaiting admin approval.");
      } else {
        const { error } = await supabase
          .from("achievements")
          .insert(achievementData);

        if (error) throw error;
        toast.success("Achievement submitted! Awaiting admin approval.");
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error("Failed to save achievement");
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      achievement_date: "",
      file_url: "",
    });
    setUploadedFileName("");
  };

  return (
    <Dialog open={open} onOpenChange={(value) => {
      if (!value) resetForm();
      onOpenChange(value);
    }}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden bg-gradient-to-br from-background via-background to-accent/5 border-accent/20">
        {/* Premium Header */}
        <div className="relative px-6 pt-8 pb-6 bg-gradient-to-r from-primary via-primary to-navy-light text-primary-foreground">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 right-8 w-24 h-24 rounded-full bg-accent/30 blur-2xl" />
            <div className="absolute bottom-0 left-12 w-32 h-16 rounded-full bg-accent/20 blur-xl" />
          </div>
          <div className="relative flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-accent/20 backdrop-blur-sm flex items-center justify-center border border-accent/30">
              <Trophy className="w-8 h-8 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                {editingAchievement ? "Edit Achievement" : "Submit Achievement"}
                <Sparkles className="w-5 h-5 text-accent" />
              </h2>
              <p className="text-primary-foreground/70 text-sm mt-1">
                Showcase your accomplishments and earn recognition
              </p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Award className="w-4 h-4 text-accent" />
              Achievement Title *
            </Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., First Place in National Science Olympiad"
              className="h-12 bg-muted/50 border-border/50 focus:border-accent focus:ring-accent/20"
            />
          </div>

          {/* Category Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Star className="w-4 h-4 text-accent" />
              Category *
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => (
                <motion.button
                  key={cat.value}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFormData({ ...formData, category: cat.value })}
                  className={`relative p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                    formData.category === cat.value
                      ? "border-accent bg-accent/10 shadow-gold"
                      : "border-border/50 bg-muted/30 hover:border-accent/50 hover:bg-muted/50"
                  }`}
                >
                  <span className="text-2xl block mb-1">{cat.icon}</span>
                  <span className="text-xs font-medium text-foreground/80 line-clamp-1">
                    {cat.label}
                  </span>
                  {formData.category === cat.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent flex items-center justify-center"
                    >
                      <Check className="w-3 h-3 text-accent-foreground" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4 text-accent" />
              Description
            </Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your achievement, the competition, and your contribution..."
              rows={4}
              className="bg-muted/50 border-border/50 focus:border-accent focus:ring-accent/20 resize-none"
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent" />
              Achievement Date
            </Label>
            <Input
              type="date"
              value={formData.achievement_date}
              onChange={(e) => setFormData({ ...formData, achievement_date: e.target.value })}
              className="h-12 bg-muted/50 border-border/50 focus:border-accent focus:ring-accent/20"
            />
          </div>

          {/* Certificate Upload */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Upload className="w-4 h-4 text-accent" />
              Certificate / Proof (Optional)
            </Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <AnimatePresence mode="wait">
              {formData.file_url ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="relative p-4 rounded-xl bg-accent/10 border border-accent/30 flex items-center gap-3"
                >
                  <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {uploadedFileName || "Certificate uploaded"}
                    </p>
                    <a 
                      href={formData.file_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-accent hover:underline"
                    >
                      View certificate
                    </a>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      setFormData({ ...formData, file_url: "" });
                      setUploadedFileName("");
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>
              ) : (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full p-8 rounded-xl border-2 border-dashed border-border/50 bg-muted/30 hover:border-accent/50 hover:bg-muted/50 transition-all duration-200 flex flex-col items-center gap-3"
                >
                  {isUploading ? (
                    <Loader2 className="w-8 h-8 text-accent animate-spin" />
                  ) : (
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  )}
                  <div className="text-center">
                    <p className="font-medium text-foreground/80">
                      {isUploading ? "Uploading..." : "Click to upload certificate"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, WebP or PDF (max 5MB)
                    </p>
                  </div>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Info Box */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">Approval Process</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Your achievement will be reviewed by an admin. Once approved, you'll earn points 
                  that contribute to your overall ranking on the leaderboard.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 bg-gradient-to-r from-accent to-gold-dark hover:opacity-90 text-accent-foreground font-semibold"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Trophy className="w-4 h-4 mr-2" />
              )}
              {editingAchievement ? "Update Achievement" : "Submit for Review"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}