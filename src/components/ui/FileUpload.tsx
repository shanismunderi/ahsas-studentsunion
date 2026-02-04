import { useState, useRef } from "react";
import { Upload, X, Loader2, FileText, Image as ImageIcon } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface FileUploadProps {
    value: string;
    onChange: (url: string) => void;
    bucket: string;
    pathPrefix?: string;
    accept?: string;
    placeholder?: string;
    className?: string;
    type?: "image" | "document" | "any";
}

export function FileUpload({
    value,
    onChange,
    bucket,
    pathPrefix = "",
    accept = "image/*",
    placeholder = "Upload file",
    className,
    type = "image",
}: FileUploadProps) {
    const { toast } = useToast();
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate size (max 10MB for documents, 5MB for images)
        const maxSize = type === "image" ? 5 * 1024 * 1024 : 10 * 1024 * 1024;
        if (file.size > maxSize) {
            toast({
                title: "File too large",
                description: `Please upload a file smaller than ${maxSize / (1024 * 1024)}MB`,
                variant: "destructive",
            });
            return;
        }

        setIsUploading(true);
        try {
            const fileExt = file.name.split(".").pop();
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
            const filePath = pathPrefix ? `${pathPrefix}/${fileName}` : fileName;

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);

            onChange(publicUrl);
            toast({ title: "File uploaded successfully" });
        } catch (error: any) {
            toast({
                title: "Error uploading file",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const removeFile = () => {
        onChange("");
    };

    return (
        <div className={cn("space-y-4", className)}>
            <div className="flex items-center gap-4">
                {value ? (
                    <div className="relative group w-full">
                        {type === "image" ? (
                            <div className="relative aspect-video rounded-lg overflow-hidden border border-border bg-muted">
                                <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={removeFile}
                                    >
                                        <X className="w-4 h-4 mr-2" /> Remove
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Upload className="w-4 h-4 mr-2" /> Change
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded bg-background flex items-center justify-center border border-border">
                                        <FileText className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate max-w-[200px]">{value.split('/').pop()}</p>
                                        <a href={value} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline">View File</a>
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={removeFile}
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                            "w-full cursor-pointer rounded-xl border-2 border-dashed border-border p-8 transition-colors hover:border-accent/50 hover:bg-accent/5",
                            isUploading && "pointer-events-none opacity-50"
                        )}
                    >
                        <div className="flex flex-col items-center justify-center gap-2 text-center text-muted-foreground">
                            {isUploading ? (
                                <Loader2 className="h-10 w-10 animate-spin text-accent" />
                            ) : type === "image" ? (
                                <ImageIcon className="h-10 w-10 transition-colors group-hover:text-accent" />
                            ) : (
                                <Upload className="h-10 w-10 transition-colors group-hover:text-accent" />
                            )}
                            <div className="space-y-1">
                                <p className="font-semibold text-foreground">
                                    {isUploading ? "Uploading..." : placeholder}
                                </p>
                                <p className="text-xs">
                                    {type === "image" ? "PNG, JPG or GIF (max. 5MB)" : "PDF, DOC or images (max. 10MB)"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleUpload}
                className="hidden"
            />
        </div>
    );
}
