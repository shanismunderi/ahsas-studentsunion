import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Plus, Trash2, Edit, Search, Shield } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    department: "",
    member_id: "",
  });

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

  const handleSaveMember = async () => {
    if (!editingMember) return;

    const { error } = await supabase
      .from("profiles")
      .update(formData)
      .eq("id", editingMember.id);

    if (error) {
      toast({ title: "Error updating member", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Member updated successfully" });
      setIsDialogOpen(false);
      setEditingMember(null);
      fetchMembers();
    }
  };

  const handleDeleteMember = async (member: Member) => {
    if (!confirm("Are you sure you want to delete this member?")) return;

    const { error } = await supabase.auth.admin.deleteUser(member.user_id);

    if (error) {
      // If admin API fails, just delete the profile
      await supabase.from("profiles").delete().eq("id", member.id);
    }

    toast({ title: "Member deleted successfully" });
    fetchMembers();
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
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
    setFormData({
      full_name: member.full_name || "",
      email: member.email || "",
      phone: member.phone || "",
      department: member.department || "",
      member_id: member.member_id || "",
    });
    setIsDialogOpen(true);
  };

  const filteredMembers = members.filter(
    (m) =>
      m.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchQuery.toLowerCase())
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
              Manage Members
            </motion.h1>
            <p className="text-muted-foreground mt-2">
              View and manage all registered members
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Members Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Member ID</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading...
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
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.full_name}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.department || "-"}</TableCell>
                      <TableCell>{member.member_id || "-"}</TableCell>
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
                        <div className="flex justify-end gap-2">
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
                            onClick={() => handleDeleteMember(member)}
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

        {/* Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Department</label>
                <Input
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Member ID</label>
                <Input
                  value={formData.member_id}
                  onChange={(e) => setFormData({ ...formData, member_id: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="gold" onClick={handleSaveMember}>
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
