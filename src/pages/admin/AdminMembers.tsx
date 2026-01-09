import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Plus, Trash2, Edit, Search, UserPlus, Mail, Lock, Phone, Building, IdCard, Eye, EyeOff, Copy, Check, FileSpreadsheet, Key, RefreshCw, Shield } from "lucide-react";
import { ExcelImportDialog } from "@/components/admin/ExcelImportDialog";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Member {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  department: string;
  member_id: string;
  created_at: string;
  password_plaintext: string | null;
  profile_photo_url: string | null;
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
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [createdCredentials, setCreatedCredentials] = useState<{ admissionNumber: string; password: string } | null>(null);
  const [isResettingPassword, setIsResettingPassword] = useState<string | null>(null);
  
  const [createFormData, setCreateFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    department: "",
    member_id: "",
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
    toast({ title: "Copied to clipboard!" });
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
    if (!createFormData.full_name || !createFormData.member_id || !createFormData.password) {
      toast({ title: "Please fill in all required fields (Name, Admission Number, Password)", variant: "destructive" });
      return;
    }

    // Auto-generate email from member_id
    const email = `${createFormData.member_id}@ahsas.union`;

    setIsSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke('create-member', {
        body: { ...createFormData, email },
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

      setCreatedCredentials({ admissionNumber: createFormData.member_id, password: createFormData.password });
      toast({ title: "Member created successfully!" });
      fetchMembers();
      
    } catch (error: any) {
      toast({ title: "Error creating member", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (member: Member) => {
    setIsResettingPassword(member.id);
    const newPassword = generatePassword();

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke('reset-password', {
        body: { user_id: member.user_id, new_password: newPassword },
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });

      if (response.error || response.data?.error) {
        throw new Error(response.data?.error || response.error?.message);
      }

      // Update password in profiles table
      await supabase
        .from("profiles")
        .update({ password_plaintext: newPassword })
        .eq("id", member.id);

      toast({ 
        title: "Password reset successfully!",
        description: `New password: ${newPassword}`,
      });
      
      fetchMembers();
    } catch (error: any) {
      toast({ title: "Error resetting password", description: error.message, variant: "destructive" });
    } finally {
      setIsResettingPassword(null);
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

  const togglePasswordVisibility = (memberId: string) => {
    setShowPasswords(prev => ({ ...prev, [memberId]: !prev[memberId] }));
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl font-bold text-foreground"
            >
              Manage Members
            </motion.h1>
            <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
              Create and manage member accounts with full access control
            </p>
          </div>
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            <Button variant="outline" size="sm" onClick={() => setIsImportDialogOpen(true)} className="flex-1 sm:flex-none">
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Import Excel</span>
              <span className="sm:hidden">Import</span>
            </Button>
            <Button size="sm" onClick={() => setIsCreateDialogOpen(true)} className="flex-1 sm:flex-none bg-primary text-primary-foreground hover:bg-primary/90">
              <UserPlus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Create Member</span>
              <span className="sm:hidden">Create</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-4 flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{members.length}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Total Members</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-500/10 to-amber-500/5 border-yellow-500/20">
            <CardContent className="p-4 flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  {Object.values(roles).filter(r => r === 'admin').length}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">Admins</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/20">
            <CardContent className="p-4 flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  {Object.values(roles).filter(r => r === 'member').length}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">Members</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500/10 to-violet-500/5 border-purple-500/20">
            <CardContent className="p-4 flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Key className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  {members.filter(m => m.password_plaintext).length}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">With Passwords</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or admission number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Members Table */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="min-w-[200px]">Member</TableHead>
                    <TableHead className="min-w-[100px]">Admission No.</TableHead>
                    <TableHead className="min-w-[150px]">Password</TableHead>
                    <TableHead className="min-w-[120px]">Department</TableHead>
                    <TableHead className="min-w-[100px]">Role</TableHead>
                    <TableHead className="text-right min-w-[150px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                          Loading members...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredMembers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No members found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMembers.map((member) => (
                      <TableRow key={member.id} className="hover:bg-muted/30">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10 border-2 border-background shadow">
                              <AvatarImage src={member.profile_photo_url || undefined} />
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {member.full_name?.charAt(0) || "?"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-foreground">{member.full_name}</p>
                              <p className="text-xs text-muted-foreground">{member.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono">{member.member_id || "N/A"}</Badge>
                        </TableCell>
                        <TableCell>
                          {member.password_plaintext ? (
                            <div className="flex items-center gap-2">
                              <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                                {showPasswords[member.id] ? member.password_plaintext : "••••••••"}
                              </code>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => togglePasswordVisibility(member.id)}
                                  >
                                    {showPasswords[member.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>{showPasswords[member.id] ? "Hide" : "Show"}</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => copyToClipboard(member.password_plaintext!, `pwd-${member.id}`)}
                                  >
                                    {copiedField === `pwd-${member.id}` ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Copy Password</TooltipContent>
                              </Tooltip>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">Not stored</span>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => handleResetPassword(member)}
                                    disabled={isResettingPassword === member.id}
                                  >
                                    {isResettingPassword === member.id ? (
                                      <div className="w-3 h-3 border border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
                                    ) : (
                                      <RefreshCw className="w-3 h-3" />
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Reset Password</TooltipContent>
                              </Tooltip>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">{member.department || "-"}</TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEditDialog(member)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleResetPassword(member)} disabled={isResettingPassword === member.id}>
                                  {isResettingPassword === member.id ? (
                                    <div className="w-4 h-4 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
                                  ) : (
                                    <Key className="w-4 h-4" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Reset Password</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => {
                                    setMemberToDelete(member);
                                    setDeleteConfirmOpen(true);
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Delete</TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Create Member Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={(open) => !open && resetCreateDialog()}>
          <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                {createdCredentials ? "Member Created!" : "Create New Member"}
              </DialogTitle>
            </DialogHeader>
            
            {createdCredentials ? (
              <div className="space-y-4 pt-4">
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium mb-2">
                    ✓ Member account created successfully! Share these credentials:
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                    <div>
                      <p className="text-xs text-muted-foreground">Admission Number</p>
                      <p className="font-bold font-mono text-lg">{createdCredentials.admissionNumber}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(createdCredentials.admissionNumber, 'admissionNumber')}
                    >
                      {copiedField === 'admissionNumber' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                    <div>
                      <p className="text-xs text-muted-foreground">Password</p>
                      <p className="font-bold font-mono text-lg">{createdCredentials.password}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(createdCredentials.password, 'password')}
                    >
                      {copiedField === 'password' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <Button className="w-full mt-4" onClick={resetCreateDialog}>
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
                      onChange={(e) => setCreateFormData({ ...createFormData, member_id: e.target.value })}
                      placeholder="540"
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">This will be used for login</p>
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

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={resetCreateDialog} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateMember} disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Member"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Member Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="w-[95vw] max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <Input
                  value={editFormData.full_name}
                  onChange={(e) => setEditFormData({ ...editFormData, full_name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                <Input
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Department</label>
                <Input
                  value={editFormData.department}
                  onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Admission Number</label>
                <Input
                  value={editFormData.member_id}
                  onChange={(e) => setEditFormData({ ...editFormData, member_id: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button onClick={handleSaveMember} disabled={isSubmitting}>
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
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteMember}
                disabled={isSubmitting}
                className="bg-destructive hover:bg-destructive/90"
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
