import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileSpreadsheet, Upload, X, Check, AlertCircle, Users, Download, Loader2 } from "lucide-react";
import * as XLSX from "xlsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ImportedMember {
  full_name: string;
  email: string;
  password: string;
  phone?: string;
  department?: string;
  member_id?: string;
}

interface ExcelImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ExcelImportDialog({ open, onOpenChange, onSuccess }: ExcelImportDialogProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ImportedMember[]>([]);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState<"upload" | "preview" | "importing" | "complete">("upload");
  const [results, setResults] = useState<{ success: number; failed: number; errors: string[] }>({
    success: 0,
    failed: 0,
    errors: [],
  });

  const generatePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const parseExcelFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const members: ImportedMember[] = jsonData.map((row: any) => ({
          full_name: row["Full Name"] || row["full_name"] || row["Name"] || row["name"] || "",
          email: row["Email"] || row["email"] || row["E-mail"] || "",
          password: row["Password"] || row["password"] || generatePassword(),
          phone: row["Phone"] || row["phone"] || row["Mobile"] || row["mobile"] || "",
          department: row["Department"] || row["department"] || row["Dept"] || "",
          member_id: row["Member ID"] || row["member_id"] || row["ID"] || "",
        }));

        const validMembers = members.filter((m) => m.full_name && m.email);
        setParsedData(validMembers);
        setStep("preview");
      } catch (error) {
        toast({
          title: "Error parsing file",
          description: "Please ensure the file is a valid Excel file",
          variant: "destructive",
        });
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.match(/\.(xlsx|xls|csv)$/)) {
        setFile(droppedFile);
        parseExcelFile(droppedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an Excel file (.xlsx, .xls) or CSV",
          variant: "destructive",
        });
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      parseExcelFile(selectedFile);
    }
  };

  const handleImport = async () => {
    setImporting(true);
    setStep("importing");
    setProgress(0);

    const { data: { session } } = await supabase.auth.getSession();
    let successCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < parsedData.length; i++) {
      const member = parsedData[i];
      try {
        const response = await supabase.functions.invoke("create-member", {
          body: {
            email: member.email,
            password: member.password,
            full_name: member.full_name,
            phone: member.phone,
            department: member.department,
            member_id: member.member_id,
          },
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        });

        if (response.error || response.data?.error) {
          throw new Error(response.data?.error || response.error?.message);
        }
        successCount++;
      } catch (error: any) {
        failedCount++;
        errors.push(`${member.email}: ${error.message}`);
      }

      setProgress(Math.round(((i + 1) / parsedData.length) * 100));
    }

    setResults({ success: successCount, failed: failedCount, errors });
    setStep("complete");
    setImporting(false);

    if (successCount > 0) {
      onSuccess();
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        "Full Name": "John Doe",
        "Email": "john@example.com",
        "Password": "SecurePass123!",
        "Phone": "+1234567890",
        "Department": "Engineering",
        "Member ID": "MEM001",
      },
    ];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Members");
    XLSX.writeFile(wb, "member_import_template.xlsx");
  };

  const resetDialog = () => {
    setFile(null);
    setParsedData([]);
    setStep("upload");
    setProgress(0);
    setResults({ success: 0, failed: 0, errors: [] });
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) resetDialog();
      onOpenChange(open);
    }}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-lg sm:text-xl">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <span className="truncate">Import Members from Excel</span>
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4 sm:space-y-6 py-4"
            >
              {/* Download Template */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-muted/50 border border-border">
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-foreground text-sm sm:text-base">Download Template</p>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">Get the Excel template with correct columns</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={downloadTemplate} className="shrink-0 w-full sm:w-auto">
                  Download
                </Button>
              </div>

              {/* Upload Area */}
              <div
                className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-12 text-center transition-all ${
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                  Drop your Excel file here
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  or click to browse from your computer
                </p>
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                  Select File
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  Supports .xlsx, .xls, .csv files
                </p>
              </div>

              {/* Required Columns Info */}
              <div className="p-4 rounded-xl bg-muted/30 border border-border">
                <h4 className="font-medium text-foreground mb-2 text-sm sm:text-base">Required Columns:</h4>
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 text-xs sm:text-sm text-muted-foreground">
                  <span>• Full Name</span>
                  <span>• Email</span>
                  <span>• Password (optional)</span>
                  <span>• Phone (optional)</span>
                  <span>• Department (optional)</span>
                  <span>• Member ID (optional)</span>
                </div>
              </div>
            </motion.div>
          )}

          {step === "preview" && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4 sm:space-y-6 py-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground text-sm sm:text-base">{parsedData.length} members found</p>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">{file?.name}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={resetDialog} className="w-full sm:w-auto">
                  <X className="w-4 h-4 mr-2" />
                  Change File
                </Button>
              </div>

              {/* Preview Table */}
              <div className="rounded-xl border border-border overflow-hidden max-h-[200px] sm:max-h-[300px] overflow-y-auto">
                <table className="w-full text-xs sm:text-sm">
                  <thead className="bg-muted/50 sticky top-0">
                    <tr>
                      <th className="text-left p-2 sm:p-3 font-medium text-foreground">Name</th>
                      <th className="text-left p-2 sm:p-3 font-medium text-foreground hidden xs:table-cell">Email</th>
                      <th className="text-left p-2 sm:p-3 font-medium text-foreground hidden sm:table-cell">Department</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {parsedData.slice(0, 10).map((member, index) => (
                      <tr key={index} className="hover:bg-muted/30">
                        <td className="p-2 sm:p-3 text-foreground">
                          <div>{member.full_name}</div>
                          <div className="text-xs text-muted-foreground xs:hidden">{member.email}</div>
                        </td>
                        <td className="p-2 sm:p-3 text-muted-foreground hidden xs:table-cell">{member.email}</td>
                        <td className="p-2 sm:p-3 text-muted-foreground hidden sm:table-cell">{member.department || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {parsedData.length > 10 && (
                  <div className="p-2 sm:p-3 text-center text-xs sm:text-sm text-muted-foreground bg-muted/30">
                    And {parsedData.length - 10} more members...
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" className="flex-1" onClick={resetDialog}>
                  Cancel
                </Button>
                <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleImport}>
                  <Upload className="w-4 h-4 mr-2" />
                  Import {parsedData.length} Members
                </Button>
              </div>
            </motion.div>
          )}

          {step === "importing" && (
            <motion.div
              key="importing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 py-8 text-center"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-primary animate-spin" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Importing Members...</h3>
                <p className="text-sm text-muted-foreground">Please wait while we create member accounts</p>
              </div>
              <div className="max-w-xs mx-auto space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-muted-foreground">{progress}% complete</p>
              </div>
            </motion.div>
          )}

          {step === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4 sm:space-y-6 py-4"
            >
              <div className="text-center">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  results.failed === 0 ? "bg-primary/10" : "bg-destructive/10"
                }`}>
                  {results.failed === 0 ? (
                    <Check className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                  ) : (
                    <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-destructive" />
                  )}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Import Complete</h3>
                <p className="text-sm text-muted-foreground">
                  {results.success} members imported successfully
                  {results.failed > 0 && `, ${results.failed} failed`}
                </p>
              </div>

              {/* Results Summary */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 rounded-xl bg-primary/5 border border-primary/20 text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-primary">{results.success}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Successful</p>
                </div>
                <div className="p-3 sm:p-4 rounded-xl bg-destructive/5 border border-destructive/20 text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-destructive">{results.failed}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Failed</p>
                </div>
              </div>

              {/* Error List */}
              {results.errors.length > 0 && (
                <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 sm:p-4 max-h-[100px] sm:max-h-[150px] overflow-y-auto">
                  <h4 className="font-medium text-destructive mb-2 text-sm">Errors:</h4>
                  <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
                    {results.errors.map((error, index) => (
                      <li key={index} className="break-all">• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => {
                resetDialog();
                onOpenChange(false);
              }}>
                Done
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}