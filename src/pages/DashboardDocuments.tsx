import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Calendar, File, Plus, Pencil, Trash2 } from "lucide-react";
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

interface Document {
  id: string;
  document_title: string;
  description: string;
  file_url: string;
  document_type: string;
  issued_date: string;
  created_at: string;
  uploaded_by: string | null;
}

interface FormData {
  document_title: string;
  description: string;
  file_url: string;
  document_type: string;
  issued_date: string;
}

export default function DashboardDocuments() {
  const { profile } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    document_title: "",
    description: "",
    file_url: "",
    document_type: "",
    issued_date: "",
  });

  const fetchDocuments = async () => {
    if (!profile?.id) return;

    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("member_id", profile.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setDocuments(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDocuments();
  }, [profile?.id]);

  const resetForm = () => {
    setFormData({
      document_title: "",
      description: "",
      file_url: "",
      document_type: "",
      issued_date: "",
    });
    setEditingId(null);
  };

  const openDialog = (doc?: Document) => {
    if (doc) {
      setEditingId(doc.id);
      setFormData({
        document_title: doc.document_title,
        description: doc.description || "",
        file_url: doc.file_url,
        document_type: doc.document_type || "",
        issued_date: doc.issued_date || "",
      });
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!profile?.id || !formData.document_title.trim() || !formData.file_url.trim()) {
      toast.error("Title and File URL are required");
      return;
    }

    const documentData = {
      member_id: profile.id,
      document_title: formData.document_title.trim(),
      description: formData.description.trim() || null,
      file_url: formData.file_url.trim(),
      document_type: formData.document_type.trim() || null,
      issued_date: formData.issued_date || null,
    };

    if (editingId) {
      const { error } = await supabase
        .from("documents")
        .update(documentData)
        .eq("id", editingId);

      if (error) {
        toast.error("Failed to update document");
        return;
      }
      toast.success("Document updated successfully");
    } else {
      const { error } = await supabase
        .from("documents")
        .insert(documentData);

      if (error) {
        toast.error("Failed to add document");
        return;
      }
      toast.success("Document added successfully");
    }

    setDialogOpen(false);
    resetForm();
    fetchDocuments();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    const { error } = await supabase.from("documents").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete document");
      return;
    }

    toast.success("Document deleted successfully");
    fetchDocuments();
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
              My Documents
            </motion.h1>
            <p className="text-muted-foreground mt-2">
              Manage and download your documents
            </p>
          </div>
          <Button onClick={() => openDialog()} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Document
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-16 bg-muted rounded-lg"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : documents.length > 0 ? (
          <div className="space-y-4">
            {documents.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-card-hover transition-shadow group">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-teal/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-7 h-7 text-teal" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-foreground text-lg">
                            {doc.document_title}
                          </h3>
                          {!doc.uploaded_by && (
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => openDialog(doc)}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => handleDelete(doc.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          {doc.document_type && (
                            <span className="inline-block px-2 py-0.5 text-xs font-medium bg-muted rounded">
                              {doc.document_type}
                            </span>
                          )}
                          {doc.issued_date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(doc.issued_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {doc.description && (
                          <p className="text-muted-foreground text-sm mt-2">
                            {doc.description}
                          </p>
                        )}
                        {doc.uploaded_by && (
                          <p className="text-xs text-muted-foreground mt-2 italic">
                            Uploaded by admin
                          </p>
                        )}
                      </div>
                      <Button
                        variant="gold"
                        size="sm"
                        onClick={() => window.open(doc.file_url, "_blank")}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
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
                <File className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Documents Yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Start adding your documents to keep them organized
                </p>
                <Button onClick={() => openDialog()} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Your First Document
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
              {editingId ? "Edit Document" : "Add Document"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="document_title">Title *</Label>
              <Input
                id="document_title"
                value={formData.document_title}
                onChange={(e) => setFormData({ ...formData, document_title: e.target.value })}
                placeholder="Document title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="document_type">Type</Label>
              <Input
                id="document_type"
                value={formData.document_type}
                onChange={(e) => setFormData({ ...formData, document_type: e.target.value })}
                placeholder="e.g., Certificate, ID Card, Letter"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the document"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file_url">File URL *</Label>
              <Input
                id="file_url"
                value={formData.file_url}
                onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                placeholder="Link to the document file"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issued_date">Issue Date</Label>
              <Input
                id="issued_date"
                type="date"
                value={formData.issued_date}
                onChange={(e) => setFormData({ ...formData, issued_date: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingId ? "Update" : "Add"} Document
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
