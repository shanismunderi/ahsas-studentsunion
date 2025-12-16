import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Calendar, Building, Save, Camera, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardProfile() {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    phone: profile?.phone || "",
    address: profile?.address || "",
    department: profile?.department || "",
  });

  const handleSave = async () => {
    if (!profile?.id) return;

    setIsSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update(formData)
      .eq("id", profile.id);

    if (error) {
      toast({
        title: "Error saving profile",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Profile updated successfully" });
      await refreshProfile();
      setIsEditing(false);
    }
    setIsSaving(false);
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id || !profile?.id) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("profile-photos")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("profile-photos")
        .getPublicUrl(fileName);

      // Update profile with new photo URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ profile_photo_url: `${publicUrl}?t=${Date.now()}` })
        .eq("id", profile.id);

      if (updateError) throw updateError;

      await refreshProfile();
      toast({ title: "Profile photo updated successfully" });
    } catch (error: any) {
      toast({
        title: "Error uploading photo",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const profileFields = [
    { label: "Full Name", key: "full_name", icon: User, editable: true },
    { label: "Email", key: "email", icon: Mail, editable: false, value: profile?.email },
    { label: "Phone", key: "phone", icon: Phone, editable: true },
    { label: "Address", key: "address", icon: MapPin, editable: true },
    { label: "Department", key: "department", icon: Building, editable: true },
    { label: "Member ID", key: "member_id", icon: Calendar, editable: false, value: profile?.member_id || "Not assigned" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-3xl space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl font-bold text-foreground"
            >
              My Profile
            </motion.h1>
            <p className="text-muted-foreground mt-2">
              Manage your personal information
            </p>
          </div>
          {!isEditing ? (
            <Button variant="gold" onClick={() => setIsEditing(true)} className="w-full sm:w-auto">
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1 sm:flex-none">
                Cancel
              </Button>
              <Button variant="gold" onClick={handleSave} disabled={isSaving} className="flex-1 sm:flex-none">
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-accent" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative group">
                  <Avatar className="w-24 h-24 sm:w-28 sm:h-28">
                    <AvatarImage src={profile?.profile_photo_url || ""} />
                    <AvatarFallback className="bg-accent/10 text-accent text-2xl sm:text-3xl font-semibold">
                      {getInitials(profile?.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    {isUploading ? (
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    ) : (
                      <Camera className="w-6 h-6 text-white" />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="font-semibold text-foreground text-lg">
                    {profile?.full_name}
                  </h3>
                  <p className="text-muted-foreground text-sm">{profile?.email}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-accent hover:text-accent"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    {isUploading ? "Uploading..." : "Change Photo"}
                  </Button>
                </div>
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-6 border-t border-border">
                {profileFields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      <field.icon className="w-4 h-4 inline mr-2" />
                      {field.label}
                    </label>
                    {isEditing && field.editable ? (
                      <Input
                        value={formData[field.key as keyof typeof formData] || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, [field.key]: e.target.value })
                        }
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    ) : (
                      <p className="text-foreground py-2 break-words">
                        {field.value || (profile as any)?.[field.key] || "Not set"}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
