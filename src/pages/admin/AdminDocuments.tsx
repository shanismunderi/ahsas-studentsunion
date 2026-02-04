import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Plus, Trash2, Edit, Search } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { FileUpload } from "@/components/ui/FileUpload";
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

interface Document {
  id: string;
  member_id: string;
  document_title: string;
  description: string;
  file_url: string;
  document_type: string;
  issued_date: string;
  created_at: string;
  profiles?: { full_name: string };
}

interface Member {
  id: string;
  full_name: string;
}

export default function AdminDocuments() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [formData, setFormData] = useState({
    member_id: "",
    document_title: "",
    description: "",
    file_url: "",
    document_type: "",
    issued_date: "",
  });

  const fetchData = async () => {
    const [docsRes, membersRes] = await Promise.all([
      supabase
        .from("documents")
        .select("*, profiles(full_name)")
        .order("created_at", { ascending: false }),
      supabase.from("profiles").select("id, full_name"),
    ]);

    if (docsRes.data) setDocuments(docsRes.data);
    if (membersRes.data) setMembers(membersRes.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!formData.member_id || !formData.document_title || !formData.file_url) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }

    if (editingDocument) {
      const { error } = await supabase
        .from("documents")
        .update(formData)
        .eq("id", editingDocument.id);

      if (error) {
        toast({ title: "Error updating", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Document updated" });
      }
    } else {
      const { error } = await supabase.from("documents").insert({
        ...formData,
        uploaded_by: user?.id,
      });

      if (error) {
        toast({ title: "Error creating", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Document created" });
      }
    }

    setIsDialogOpen(false);
    setEditingDocument(null);
    resetForm();
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this document?")) return;
    await supabase.from("documents").delete().eq("id", id);
    toast({ title: "Document deleted" });
    fetchData();
  };

  const openDialog = (doc?: Document) => {
    if (doc) {
      setEditingDocument(doc);
      setFormData({
        member_id: doc.member_id,
        document_title: doc.document_title,
        description: doc.description || "",
        file_url: doc.file_url,
        document_type: doc.document_type || "",
        issued_date: doc.issued_date || "",
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      member_id: "",
      document_title: "",
      description: "",
      file_url: "",
      document_type: "",
      issued_date: "",
    });
    setEditingDocument(null);
  };

  const filtered = documents.filter(
    (d) =>
      d.document_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
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
              Manage Documents
            </motion.h1>
            <p className="text-muted-foreground mt-2">Upload documents for members</p>
          </div>
          <Button variant="gold" onClick={() => openDialog()}>
            <Plus className="w-4 h-4 mr-2" /> Add Document
          </Button>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
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
                  <TableHead>Type</TableHead>
                  <TableHead>Issued Date</TableHead>
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
                      No documents found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">{d.document_title}</TableCell>
                      <TableCell>{d.profiles?.full_name || "-"}</TableCell>
                      <TableCell>{d.document_type || "-"}</TableCell>
                      <TableCell>
                        {d.issued_date ? new Date(d.issued_date).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openDialog(d)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(d.id)}
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
              <DialogTitle>{editingDocument ? "Edit" : "Add"} Document</DialogTitle>
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
                  value={formData.document_title}
                  onChange={(e) => setFormData({ ...formData, document_title: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Document Type</label>
                <Input
                  value={formData.document_type}
                  onChange={(e) => setFormData({ ...formData, document_type: e.target.value })}
                  placeholder="e.g., Certificate, ID Card, Letter"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Document File *</label>
                <FileUpload
                  value={formData.file_url}
                  onChange={(url) => setFormData({ ...formData, file_url: url })}
                  bucket="site-assets"
                  pathPrefix={`documents/${formData.member_id}`}
                  placeholder="Upload document"
                  type="document"
                  accept="image/*,application/pdf,.doc,.docx"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Issued Date</label>
                <Input
                  type="date"
                  value={formData.issued_date}
                  onChange={(e) => setFormData({ ...formData, issued_date: e.target.value })}
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
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button variant="gold" onClick={handleSave}>
                  {editingDocument ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
