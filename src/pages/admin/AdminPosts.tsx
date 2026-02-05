import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Newspaper, Plus, Trash2, Edit, Search, Eye, EyeOff } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
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
import { Switch } from "@/components/ui/switch";

interface Post {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  post_type: string;
  cover_image_url: string;
  tags: string[];
  event_date: string;
  is_published: boolean;
  created_at: string;
}

export default function AdminPosts() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    content: "",
    post_type: "news",
    cover_image_url: "",
    tags: "",
    event_date: "",
    is_published: false,
  });

  const fetchData = async () => {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setPosts(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!formData.title || !formData.content) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }

    const postData = {
      ...formData,
      tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()) : [],
      event_date: formData.event_date || null,
    };

    if (editingPost) {
      const { error } = await supabase
        .from("posts")
        .update(postData)
        .eq("id", editingPost.id);

      if (error) {
        toast({ title: "Error updating", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Post updated" });
      }
    } else {
      const { error } = await supabase.from("posts").insert({
        ...postData,
        created_by: user?.id,
      });

      if (error) {
        toast({ title: "Error creating", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Post created" });
      }
    }

    setIsDialogOpen(false);
    setEditingPost(null);
    resetForm();
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await supabase.from("posts").delete().eq("id", id);
    toast({ title: "Post deleted" });
    fetchData();
  };

  const togglePublish = async (post: Post) => {
    await supabase
      .from("posts")
      .update({ is_published: !post.is_published })
      .eq("id", post.id);
    toast({ title: post.is_published ? "Post unpublished" : "Post published" });
    fetchData();
  };

  const openDialog = (post?: Post) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title,
        subtitle: post.subtitle || "",
        content: post.content,
        post_type: post.post_type,
        cover_image_url: post.cover_image_url || "",
        tags: post.tags?.join(", ") || "",
        event_date: post.event_date || "",
        is_published: post.is_published,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      content: "",
      post_type: "news",
      cover_image_url: "",
      tags: "",
      event_date: "",
      is_published: false,
    });
    setEditingPost(null);
  };

  const filtered = posts.filter((p) => {
    const matchesSearch = p.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || p.post_type === filterType;
    return matchesSearch && matchesType;
  });

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
              Manage Posts
            </motion.h1>
            <p className="text-muted-foreground mt-2">Create and manage news, events, and blog posts</p>
          </div>
          <Button variant="gold" onClick={() => openDialog()}>
            <Plus className="w-4 h-4 mr-2" /> New Post
          </Button>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="news">News</SelectItem>
              <SelectItem value="event">Events</SelectItem>
              <SelectItem value="blog">Blog</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
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
                      No posts found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.title}</TableCell>
                      <TableCell>
                        <span className="capitalize px-2 py-1 rounded-full text-xs bg-muted">
                          {p.post_type}
                        </span>
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => togglePublish(p)}
                          className={`flex items-center gap-1 text-xs ${
                            p.is_published ? "text-green-600" : "text-muted-foreground"
                          }`}
                        >
                          {p.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {p.is_published ? "Published" : "Draft"}
                        </button>
                      </TableCell>
                      <TableCell>{new Date(p.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openDialog(p)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(p.id)}
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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPost ? "Edit" : "New"} Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Post Type *</label>
                  <Select
                    value={formData.post_type}
                    onValueChange={(v) => setFormData({ ...formData, post_type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="news">News</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="blog">Blog</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.post_type === "event" && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Event Date</label>
                    <Input
                      type="date"
                      value={formData.event_date}
                      onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Subtitle</label>
                <Input
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Content *</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={8}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Cover Image URL</label>
                <Input
                  value={formData.cover_image_url}
                  onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tags (comma separated)</label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="community, event, sports"
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                />
                <label className="text-sm font-medium text-foreground">Publish immediately</label>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button variant="gold" onClick={handleSave}>
                  {editingPost ? "Update" : "Create"} Post
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
