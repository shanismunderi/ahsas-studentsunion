import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, Upload, X, Award, Sparkles, 
  Calendar, FileText, Star, Check, Loader2,
  Zap, Crown, Target, Gem, Medal
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  { value: "academic", label: "Academic Excellence", icon: "📚", gradient: "from-blue-500 to-indigo-600" },
  { value: "sports", label: "Sports & Athletics", icon: "🏆", gradient: "from-orange-500 to-red-600" },
  { value: "leadership", label: "Leadership", icon: "👑", gradient: "from-amber-500 to-yellow-600" },
  { value: "arts", label: "Arts & Culture", icon: "🎨", gradient: "from-pink-500 to-purple-600" },
  { value: "community", label: "Community Service", icon: "🤝", gradient: "from-green-500 to-emerald-600" },
  { value: "innovation", label: "Innovation & Research", icon: "💡", gradient: "from-cyan-500 to-blue-600" },
  { value: "professional", label: "Professional", icon: "💼", gradient: "from-slate-500 to-zinc-600" },
  { value: "other", label: "Other", icon: "⭐", gradient: "from-violet-500 to-purple-600" },
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
    title: "",
    description: "",
    category: "",
    achievement_date: "",
    file_url: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when dialog opens/closes or editing changes
  useEffect(() => {
    if (open) {
      if (editingAchievement) {
        setFormData({
          title: editingAchievement.title || "",
          description: editingAchievement.description || "",
          category: editingAchievement.category || "",
          achievement_date: editingAchievement.achievement_date || "",
          file_url: editingAchievement.file_url || "",
        });
        setCurrentStep(1);
      } else {
        resetForm();
      }
    }
  }, [open, editingAchievement]);

  const selectedCategory = CATEGORIES.find(c => c.value === formData.category);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload an image or PDF file");
      return;
    }

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
        points: 0,
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
    setCurrentStep(1);
  };

  const canProceedToStep2 = formData.category !== "";
  const canProceedToStep3 = formData.title.trim() !== "";

  return (
    <Dialog open={open} onOpenChange={(value) => {
      if (!value) resetForm();
      onOpenChange(value);
    }}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background border-0 shadow-2xl max-h-[95vh] overflow-y-auto">
        {/* Luxurious Header with Animated Gradient */}
        <div className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-navy-light to-primary">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,215,0,0.3),transparent_50%)]" />
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(255,215,0,0.2),transparent_50%)]" />
            </div>
            {/* Animated particles */}
            <motion.div
              animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-8 right-12 w-3 h-3 rounded-full bg-accent/60"
            />
            <motion.div
              animate={{ y: [10, -10, 10], x: [5, -5, 5] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-8 left-16 w-2 h-2 rounded-full bg-accent/40"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 right-1/4 w-4 h-4 rounded-full bg-accent/30"
            />
          </div>

          <div className="relative px-6 sm:px-10 py-8 sm:py-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Premium Badge */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="relative"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-accent via-gold-light to-accent p-[2px] shadow-gold">
                  <div className="w-full h-full rounded-3xl bg-gradient-to-br from-primary/90 to-navy-dark flex items-center justify-center backdrop-blur-sm">
                    <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-accent" />
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-lg"
                >
                  <Sparkles className="w-4 h-4 text-accent-foreground" />
                </motion.div>
              </motion.div>

              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-semibold uppercase tracking-wider">
                      {editingAchievement ? "Edit Mode" : "New Submission"}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    {editingAchievement ? "Edit Your Achievement" : "Submit Your Achievement"}
                  </h2>
                  <p className="text-white/70 text-sm sm:text-base">
                    Showcase your excellence and earn recognition on the leaderboard
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Step Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-2 mt-8"
            >
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <motion.button
                    onClick={() => {
                      if (step === 1) setCurrentStep(1);
                      else if (step === 2 && canProceedToStep2) setCurrentStep(2);
                      else if (step === 3 && canProceedToStep2 && canProceedToStep3) setCurrentStep(3);
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      currentStep === step
                        ? "bg-accent text-accent-foreground scale-110 shadow-gold"
                        : currentStep > step
                        ? "bg-accent/30 text-accent"
                        : "bg-white/10 text-white/50"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {currentStep > step ? <Check className="w-5 h-5" /> : step}
                  </motion.button>
                  {step < 3 && (
                    <div className={`w-12 sm:w-20 h-1 mx-2 rounded-full transition-colors duration-300 ${
                      currentStep > step ? "bg-accent/50" : "bg-white/10"
                    }`} />
                  )}
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Form Content with Step Animation */}
        <div className="p-6 sm:p-10">
          <AnimatePresence mode="wait">
            {/* Step 1: Category Selection */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 mb-4">
                    <Target className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                    Select Achievement Category
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    Choose the category that best describes your accomplishment
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {CATEGORIES.map((cat, index) => (
                    <motion.button
                      key={cat.value}
                      type="button"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.03, y: -4 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        setFormData({ ...formData, category: cat.value });
                        setTimeout(() => setCurrentStep(2), 300);
                      }}
                      className={`relative p-4 sm:p-5 rounded-2xl border-2 transition-all duration-300 text-center group overflow-hidden ${
                        formData.category === cat.value
                          ? "border-accent bg-accent/10 shadow-gold"
                          : "border-border/50 bg-card hover:border-accent/50 hover:shadow-lg"
                      }`}
                    >
                      {/* Gradient overlay on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                      
                      <motion.span 
                        className="text-4xl sm:text-5xl block mb-3"
                        whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.4 }}
                      >
                        {cat.icon}
                      </motion.span>
                      <span className="text-xs sm:text-sm font-semibold text-foreground block">
                        {cat.label}
                      </span>
                      
                      {formData.category === cat.value && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-accent to-gold-dark flex items-center justify-center shadow-lg"
                        >
                          <Check className="w-4 h-4 text-accent-foreground" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={() => setCurrentStep(2)}
                    disabled={!canProceedToStep2}
                    className="gap-2 bg-gradient-to-r from-accent to-gold-dark hover:opacity-90 text-accent-foreground px-8"
                  >
                    Continue
                    <Zap className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Details */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 mb-4">
                    <Award className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                    Achievement Details
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    Tell us about your accomplishment
                  </p>
                </div>

                {/* Selected Category Badge */}
                {selectedCategory && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex justify-center mb-6"
                  >
                    <div className={`inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r ${selectedCategory.gradient} bg-opacity-10 border border-accent/20`}>
                      <span className="text-2xl">{selectedCategory.icon}</span>
                      <span className="font-semibold text-foreground">{selectedCategory.label}</span>
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors"
                      >
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </motion.div>
                )}

                <div className="space-y-5">
                  {/* Title Input */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-2"
                  >
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-accent" />
                      Achievement Title *
                    </Label>
                    <div className="relative">
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., First Place in National Science Olympiad"
                        className="h-14 pl-5 pr-12 bg-muted/30 border-2 border-border/50 focus:border-accent focus:ring-2 focus:ring-accent/20 rounded-xl text-base"
                      />
                      {formData.title && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-4 top-1/2 -translate-y-1/2"
                        >
                          <Check className="w-5 h-5 text-green-500" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>

                  {/* Description */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-2"
                  >
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <FileText className="w-4 h-4 text-accent" />
                      Description
                      <span className="text-muted-foreground font-normal">(Optional)</span>
                    </Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe your achievement, the competition, and your contribution..."
                      rows={4}
                      className="bg-muted/30 border-2 border-border/50 focus:border-accent focus:ring-2 focus:ring-accent/20 rounded-xl resize-none text-base p-4"
                    />
                  </motion.div>

                  {/* Date */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                  >
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-accent" />
                      Achievement Date
                      <span className="text-muted-foreground font-normal">(Optional)</span>
                    </Label>
                    <Input
                      type="date"
                      value={formData.achievement_date}
                      onChange={(e) => setFormData({ ...formData, achievement_date: e.target.value })}
                      className="h-14 bg-muted/30 border-2 border-border/50 focus:border-accent focus:ring-2 focus:ring-accent/20 rounded-xl"
                    />
                  </motion.div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(3)}
                    disabled={!canProceedToStep3}
                    className="flex-1 gap-2 bg-gradient-to-r from-accent to-gold-dark hover:opacity-90 text-accent-foreground"
                  >
                    Continue
                    <Zap className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Certificate & Submit */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 mb-4">
                    <Medal className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                    Upload Certificate
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    Add proof of your achievement (optional but recommended)
                  </p>
                </div>

                {/* Summary Card */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-2xl bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 border border-accent/20"
                >
                  <div className="flex items-start gap-4">
                    {selectedCategory && (
                      <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center text-3xl flex-shrink-0">
                        {selectedCategory.icon}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-accent font-semibold uppercase tracking-wider mb-1">
                        {selectedCategory?.label}
                      </p>
                      <h4 className="font-bold text-foreground text-lg truncate">
                        {formData.title}
                      </h4>
                      {formData.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {formData.description}
                        </p>
                      )}
                      {formData.achievement_date && (
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(formData.achievement_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="p-2 rounded-lg hover:bg-accent/10 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </motion.div>

                {/* Certificate Upload */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-3"
                >
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
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative p-5 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-2 border-green-500/30 flex items-center gap-4"
                      >
                        <div className="w-16 h-16 rounded-xl bg-green-500/20 flex items-center justify-center">
                          <Check className="w-8 h-8 text-green-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground truncate">
                            {uploadedFileName || "Certificate uploaded"}
                          </p>
                          <a 
                            href={formData.file_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-green-600 hover:underline inline-flex items-center gap-1 mt-1"
                          >
                            <FileText className="w-4 h-4" />
                            View certificate
                          </a>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 hover:bg-red-500/10 hover:text-red-500"
                          onClick={() => {
                            setFormData({ ...formData, file_url: "" });
                            setUploadedFileName("");
                          }}
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="w-full p-8 sm:p-10 rounded-2xl border-2 border-dashed border-accent/30 bg-gradient-to-br from-accent/5 to-transparent hover:border-accent/50 hover:bg-accent/5 transition-all duration-300 flex flex-col items-center gap-4 group"
                      >
                        <motion.div
                          animate={isUploading ? { rotate: 360 } : {}}
                          transition={{ duration: 1, repeat: isUploading ? Infinity : 0, ease: "linear" }}
                          className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform"
                        >
                          {isUploading ? (
                            <Loader2 className="w-8 h-8 text-accent" />
                          ) : (
                            <Upload className="w-8 h-8 text-accent" />
                          )}
                        </motion.div>
                        <div className="text-center">
                          <p className="font-semibold text-foreground text-lg">
                            {isUploading ? "Uploading..." : "Click to upload certificate"}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            PNG, JPG, WebP or PDF (max 5MB)
                          </p>
                        </div>
                      </motion.button>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Info Box */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-5 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/20"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Crown className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">What happens next?</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your achievement will be reviewed by an admin. Once approved, you'll earn points 
                        that contribute to your ranking on the leaderboard. You'll be notified of the decision.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(2)}
                    className="flex-1 h-12"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 h-12 gap-2 bg-gradient-to-r from-accent via-gold-light to-accent hover:opacity-90 text-accent-foreground font-bold text-base shadow-gold"
                  >
                    {isSaving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Trophy className="w-5 h-5" />
                    )}
                    {editingAchievement ? "Update Achievement" : "Submit for Review"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}