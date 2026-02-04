import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Calendar, Building, Save } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileUpload } from "@/components/ui/FileUpload";

export default function DashboardProfile() {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    phone: profile?.phone || "",
    address: profile?.address || "",
    department: profile?.department || "",
    profile_photo_url: profile?.profile_photo_url || "",
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
                {isEditing ? (
                  <div className="w-full sm:w-auto">
                    <FileUpload
                      value={formData.profile_photo_url}
                      onChange={(url) => setFormData({ ...formData, profile_photo_url: url })}
                      bucket="profile-photos"
                      pathPrefix={profile?.user_id}
                      placeholder="Upload profile photo"
                      type="image"
                      className="w-full sm:w-64"
                    />
                  </div>
                ) : (
                  <>
                    <div className="relative group">
                      <Avatar className="w-24 h-24 sm:w-28 sm:h-28">
                        <AvatarImage src={profile?.profile_photo_url || ""} />
                        <AvatarFallback className="bg-accent/10 text-accent text-2xl sm:text-3xl font-semibold">
                          {getInitials(profile?.full_name)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="font-semibold text-foreground text-lg">
                        {profile?.full_name}
                      </h3>
                      <p className="text-muted-foreground text-sm">{profile?.email}</p>
                    </div>
                  </>
                )}
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
                          setFormData({ ...formData, [field.key]: e.target.value } as any)
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
