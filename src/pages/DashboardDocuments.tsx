import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Calendar, File } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Document {
  id: string;
  document_title: string;
  description: string;
  file_url: string;
  document_type: string;
  issued_date: string;
  created_at: string;
}

export default function DashboardDocuments() {
  const { profile } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

    fetchDocuments();
  }, [profile?.id]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-foreground"
          >
            My Documents
          </motion.h1>
          <p className="text-muted-foreground mt-2">
            Download documents assigned to your profile
          </p>
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
                <Card className="hover:shadow-card-hover transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-teal/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-7 h-7 text-teal" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-lg">
                          {doc.document_title}
                        </h3>
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
                <p className="text-muted-foreground">
                  Documents will appear here once they are uploaded by admin
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
