import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { documentService } from '@/services/documentService';
import { useProfileStore } from '@/store/profileStore';
import { toast } from 'sonner';
import { Upload, FileText, CheckCircle2 } from 'lucide-react';

interface DocumentUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function DocumentUploadModal({ isOpen, onClose }: DocumentUploadModalProps) {
    const { profileId } = useProfileStore();
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file || !profileId) return;

        setIsUploading(true);
        try {
            // In a real app, upload file to S3/Cloudinary here first
            // For now, we store metadata
            const fileUrl = URL.createObjectURL(file); // Mock URL or use local

            await documentService.addDocument({
                profileId,
                type: 'Passport', // Defaulting for simplified UI, could be dropdown
                documentNumber: 'PENDING-SCAN',
                expiryDate: '2030-01-01',
                fileUrl: file.name
            });

            await new Promise(resolve => setTimeout(resolve, 1000)); // UI feeling

            setUploadSuccess(true);
            toast.success("Document saved successfully");

            setTimeout(() => {
                onClose();
                setFile(null);
                setUploadSuccess(false);
            }, 1000);
        } catch (error) {
            console.error(error);
            toast.error("Upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur-xl border-white/10">
                <DialogHeader>
                    <DialogTitle>Upload Travel Documents</DialogTitle>
                </DialogHeader>

                <div className="py-6">
                    {!uploadSuccess ? (
                        <div
                            className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl transition-colors ${dragActive ? "border-primary bg-primary/5" : "border-white/20 bg-white/5"
                                }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleChange}
                                accept=".pdf,.jpg,.jpeg,.png"
                            />

                            {file ? (
                                <div className="flex flex-col items-center text-center p-4">
                                    <FileText className="w-10 h-10 text-primary mb-2" />
                                    <p className="font-medium text-sm truncate max-w-[200px]">{file.name}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    <Button size="sm" onClick={handleUpload} disabled={isUploading} className="mt-4">
                                        {isUploading ? 'Uploading...' : 'Confirm Upload'}
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-center p-4 pointer-events-none">
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                                        <Upload className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                    <p className="font-medium text-sm">Click or drag file to this area to upload</p>
                                    <p className="text-xs text-muted-foreground mt-1">PDG, JPG, PNG up to 5MB</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-48">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-500">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <p className="font-medium">Upload Complete!</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
