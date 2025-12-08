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

export default function DashboardProfile() {
  const { profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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
        <div className="flex items-center justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-foreground"
            >
              My Profile
            </motion.h1>
            <p className="text-muted-foreground mt-2">
              Manage your personal information
            </p>
          </div>
          {!isEditing ? (
            <Button variant="gold" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button variant="gold" onClick={handleSave} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save Changes"}
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
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-2xl bg-accent/10 flex items-center justify-center">
                  <User className="w-12 h-12 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg">
                    {profile?.full_name}
                  </h3>
                  <p className="text-muted-foreground">{profile?.email}</p>
                </div>
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border">
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
                      <p className="text-foreground py-2">
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
