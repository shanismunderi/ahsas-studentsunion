import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Trash2, Edit, Search, UserPlus, Lock, Phone, Building, IdCard, Eye, EyeOff, Copy, Check, FileSpreadsheet, KeyRound } from "lucide-react";
import { ExcelImportDialog } from "@/components/admin/ExcelImportDialog";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Member {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  department: string;
  member_id: string;
  created_at: string;
}

interface UserRole {
  user_id: string;
  role: string;
}

export default function AdminMembers() {
  const { toast } = useToast();
  const [members, setMembers] = useState<Member[]>([]);
  const [roles, setRoles] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [memberToResetPassword, setMemberToResetPassword] = useState<Member | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [createdCredentials, setCreatedCredentials] = useState<{ admissionNumber: string; password: string } | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [resetPasswordResult, setResetPasswordResult] = useState<{ admissionNumber: string; password: string } | null>(null);
  
  const [createFormData, setCreateFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    department: "",
    member_id: "", // This is the admission number
  });

  const [editFormData, setEditFormData] = useState({
    full_name: "",
    phone: "",
    department: "",
    member_id: "",
  });

  const generatePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const fetchMembers = async () => {
    const { data: membersData } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: rolesData } = await supabase
      .from("user_roles")
      .select("user_id, role");

    if (membersData) {
      setMembers(membersData as Member[]);
    }

    if (rolesData) {
      const rolesMap: Record<string, string> = {};
      rolesData.forEach((r: UserRole) => {
        rolesMap[r.user_id] = r.role;
      });
      setRoles(rolesMap);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleCreateMember = async () => {
    if (!createFormData.full_name || !createFormData.email || !createFormData.password || !createFormData.member_id) {
      toast({ title: "Please fill in all required fields (Name, Email, Password, Admission Number)", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke('create-member', {
        body: createFormData,
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      setCreatedCredentials({ 
        admissionNumber: createFormData.member_id.toUpperCase(), 
        password: createFormData.password 
      });
      toast({ title: "Member created successfully!" });
      fetchMembers();
      
    } catch (error: any) {
      toast({ title: "Error creating member", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveMember = async () => {
    if (!editingMember) return;

    setIsSubmitting(true);
    const { error } = await supabase
      .from("profiles")
      .update(editFormData)
      .eq("id", editingMember.id);

    if (error) {
      toast({ title: "Error updating member", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Member updated successfully" });
      setIsEditDialogOpen(false);
      setEditingMember(null);
      fetchMembers();
    }
    setIsSubmitting(false);
  };

  const handleResetPassword = async () => {
    if (!memberToResetPassword || !newPassword) return;

    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke('reset-password', {
        body: { 
          email: memberToResetPassword.email, 
          new_password: newPassword 
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });

      if (response.error || response.data?.error) {
        throw new Error(response.data?.error || response.error?.message);
      }

      setResetPasswordResult({
        admissionNumber: memberToResetPassword.member_id || "N/A",
        password: newPassword
      });
      toast({ title: "Password reset successfully!" });
      
    } catch (error: any) {
      toast({ title: "Error resetting password", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMember = async () => {
    if (!memberToDelete) return;

    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke('delete-member', {
        body: { user_id: memberToDelete.user_id },
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });

      if (response.error || response.data?.error) {
        throw new Error(response.data?.error || response.error?.message);
      }

      toast({ title: "Member deleted successfully" });
      fetchMembers();
    } catch (error: any) {
      toast({ title: "Error deleting member", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
      setDeleteConfirmOpen(false);
      setMemberToDelete(null);
    }
  };

  const handleRoleChange = async (userId: string, newRole: "admin" | "member") => {
    const { error } = await supabase
      .from("user_roles")
      .update({ role: newRole })
      .eq("user_id", userId);

    if (error) {
      toast({ title: "Error updating role", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Role updated successfully" });
      setRoles({ ...roles, [userId]: newRole });
    }
  };

  const openEditDialog = (member: Member) => {
    setEditingMember(member);
    setEditFormData({
      full_name: member.full_name || "",
      phone: member.phone || "",
      department: member.department || "",
      member_id: member.member_id || "",
    });
    setIsEditDialogOpen(true);
  };

  const openResetPasswordDialog = (member: Member) => {
    setMemberToResetPassword(member);
    setNewPassword(generatePassword());
    setResetPasswordResult(null);
    setIsResetPasswordDialogOpen(true);
  };

  const resetCreateDialog = () => {
    setCreateFormData({
      full_name: "",
      email: "",
      password: "",
      phone: "",
      department: "",
      member_id: "",
    });
    setCreatedCredentials(null);
    setIsCreateDialogOpen(false);
  };

  const resetPasswordDialog = () => {
    setMemberToResetPassword(null);
    setNewPassword("");
    setResetPasswordResult(null);
    setIsResetPasswordDialogOpen(false);
  };

  const filteredMembers = members.filter(
    (m) =>
      m.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.member_id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl font-bold text-foreground"
            >
              Manage Members
            </motion.h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
              Create and manage member accounts
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button variant="outline" onClick={() => setIsImportDialogOpen(true)} className="w-full sm:w-auto">
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Import Excel
            </Button>
            <Button onClick={() => {
              setCreateFormData(prev => ({ ...prev, password: generatePassword() }));
              setIsCreateDialogOpen(true);
            }} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
              <UserPlus className="w-4 h-4 mr-2" />
              Create Member
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{members.length}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Total Members</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  {Object.values(roles).filter(r => r === 'admin').length}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">Admins</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  {Object.values(roles).filter(r => r === 'member').length}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">Members</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or admission number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Members Table - Responsive */}
        <Card className="border-border/50 overflow-hidden">
          <CardContent className="p-0">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Admission No.</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : filteredMembers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No members found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{member.full_name}</p>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono">
                            {member.member_id || "Not assigned"}
                          </Badge>
                        </TableCell>
                        <TableCell>{member.department || "-"}</TableCell>
                        <TableCell>
                          <Select
                            value={roles[member.user_id] || "member"}
                            onValueChange={(value: "admin" | "member") => handleRoleChange(member.user_id, value)}
                          >
                            <SelectTrigger className="w-28">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="member">Member</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openResetPasswordDialog(member)}
                              title="Reset Password"
                            >
                              <KeyRound className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(member)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setMemberToDelete(member);
                                setDeleteConfirmOpen(true);
                              }}
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
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-border">
              {isLoading ? (
                <div className="p-6 text-center text-muted-foreground">Loading...</div>
              ) : filteredMembers.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">No members found</div>
              ) : (
                filteredMembers.map((member) => (
                  <div key={member.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-foreground">{member.full_name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                      <Badge variant="outline" className="font-mono text-xs">
                        {member.member_id || "N/A"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Dept: </span>
                        <span>{member.department || "-"}</span>
                      </div>
                      <Select
                        value={roles[member.user_id] || "member"}
                        onValueChange={(value: "admin" | "member") => handleRoleChange(member.user_id, value)}
                      >
                        <SelectTrigger className="w-24 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openResetPasswordDialog(member)}
                        className="flex-1"
                      >
                        <KeyRound className="w-4 h-4 mr-1" />
                        Reset Password
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(member)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setMemberToDelete(member);
                          setDeleteConfirmOpen(true);
                        }}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Create Member Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={(open) => !open && resetCreateDialog()}>
          <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                {createdCredentials ? "Member Created!" : "Create New Member"}
              </DialogTitle>
            </DialogHeader>
            
            {createdCredentials ? (
              <div className="space-y-4 pt-4">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-2">
                    Share these credentials with the new member:
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                    <div>
                      <p className="text-xs text-muted-foreground">Admission Number</p>
                      <p className="font-medium font-mono">{createdCredentials.admissionNumber}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(createdCredentials.admissionNumber, 'admission')}
                    >
                      {copiedField === 'admission' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                    <div>
                      <p className="text-xs text-muted-foreground">Password</p>
                      <p className="font-medium font-mono">{createdCredentials.password}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(createdCredentials.password, 'password')}
                    >
                      {copiedField === 'password' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <Button className="w-full mt-4 bg-primary hover:bg-primary/90" onClick={resetCreateDialog}>
                  Done
                </Button>
              </div>
            ) : (
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Users className="w-4 h-4" /> Full Name *
                    </label>
                    <Input
                      value={createFormData.full_name}
                      onChange={(e) => setCreateFormData({ ...createFormData, full_name: e.target.value })}
                      placeholder="John Doe"
                      className="mt-1"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <IdCard className="w-4 h-4" /> Admission Number *
                    </label>
                    <Input
                      value={createFormData.member_id}
                      onChange={(e) => setCreateFormData({ ...createFormData, member_id: e.target.value.toUpperCase() })}
                      placeholder="AHS-2024-001"
                      className="mt-1 uppercase font-mono"
                    />
                    <p className="text-xs text-muted-foreground mt-1">This will be used for login</p>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      Email (for system use) *
                    </label>
                    <Input
                      type="email"
                      value={createFormData.email}
                      onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                      placeholder="member@example.com"
                      className="mt-1"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Lock className="w-4 h-4" /> Password *
                    </label>
                    <div className="flex gap-2 mt-1">
                      <div className="relative flex-1">
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={createFormData.password}
                          onChange={(e) => setCreateFormData({ ...createFormData, password: e.target.value })}
                          placeholder="Enter password"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <Button type="button" variant="outline" onClick={() => setCreateFormData({ ...createFormData, password: generatePassword() })}>
                        Generate
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Phone className="w-4 h-4" /> Phone
                    </label>
                    <Input
                      value={createFormData.phone}
                      onChange={(e) => setCreateFormData({ ...createFormData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Building className="w-4 h-4" /> Department
                    </label>
                    <Input
                      value={createFormData.department}
                      onChange={(e) => setCreateFormData({ ...createFormData, department: e.target.value })}
                      placeholder="Computer Science"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={resetCreateDialog} disabled={isSubmitting} className="w-full sm:w-auto">
                    Cancel
                  </Button>
                  <Button onClick={handleCreateMember} disabled={isSubmitting} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                    {isSubmitting ? "Creating..." : "Create Member"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Reset Password Dialog */}
        <Dialog open={isResetPasswordDialogOpen} onOpenChange={(open) => !open && resetPasswordDialog()}>
          <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-primary" />
                {resetPasswordResult ? "Password Reset!" : "Reset Password"}
              </DialogTitle>
            </DialogHeader>

            {resetPasswordResult ? (
              <div className="space-y-4 pt-4">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                    Password has been reset. Share these credentials with the member:
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                    <div>
                      <p className="text-xs text-muted-foreground">Admission Number</p>
                      <p className="font-medium font-mono">{resetPasswordResult.admissionNumber}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(resetPasswordResult.admissionNumber, 'reset-admission')}
                    >
                      {copiedField === 'reset-admission' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                    <div>
                      <p className="text-xs text-muted-foreground">New Password</p>
                      <p className="font-medium font-mono">{resetPasswordResult.password}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(resetPasswordResult.password, 'reset-password')}
                    >
                      {copiedField === 'reset-password' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <Button className="w-full mt-4 bg-primary hover:bg-primary/90" onClick={resetPasswordDialog}>
                  Done
                </Button>
              </div>
            ) : (
              <div className="space-y-4 pt-4">
                <div className="p-4 rounded-xl bg-muted/50 border">
                  <p className="text-sm">
                    Resetting password for: <strong>{memberToResetPassword?.full_name}</strong>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Admission: {memberToResetPassword?.member_id || "N/A"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Lock className="w-4 h-4" /> New Password
                  </label>
                  <div className="flex gap-2 mt-1">
                    <div className="relative flex-1">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <Button type="button" variant="outline" onClick={() => setNewPassword(generatePassword())}>
                      Generate
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={resetPasswordDialog} disabled={isSubmitting} className="w-full sm:w-auto">
                    Cancel
                  </Button>
                  <Button onClick={handleResetPassword} disabled={isSubmitting || !newPassword} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                    {isSubmitting ? "Resetting..." : "Reset Password"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Member Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <Input
                  value={editFormData.full_name}
                  onChange={(e) => setEditFormData({ ...editFormData, full_name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Admission Number</label>
                <Input
                  value={editFormData.member_id}
                  onChange={(e) => setEditFormData({ ...editFormData, member_id: e.target.value.toUpperCase() })}
                  className="mt-1 uppercase font-mono"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                <Input
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Department</label>
                <Input
                  value={editFormData.department}
                  onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSubmitting} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button onClick={handleSaveMember} disabled={isSubmitting} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <AlertDialogContent className="w-[95vw] max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Member</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete <strong>{memberToDelete?.full_name}</strong>? 
                This action cannot be undone and will permanently remove their account and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <AlertDialogCancel disabled={isSubmitting} className="w-full sm:w-auto">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteMember}
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-destructive hover:bg-destructive/90"
              >
                {isSubmitting ? "Deleting..." : "Delete Member"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Excel Import Dialog */}
        <ExcelImportDialog
          open={isImportDialogOpen}
          onOpenChange={setIsImportDialogOpen}
          onSuccess={fetchMembers}
        />
      </div>
    </DashboardLayout>
  );
}
