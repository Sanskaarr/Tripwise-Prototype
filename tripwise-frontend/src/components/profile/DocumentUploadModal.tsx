import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { documentService, TravelDocument } from '@/services/documentService';
import { useProfileStore } from '@/store/profileStore';
import { toast } from 'sonner';
import { Upload, FileText, Trash2, Plus, X } from 'lucide-react';

interface DocumentUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DOC_TYPES = ['Passport', 'Visa', 'National ID', "Driver's License", 'Travel Insurance'];
const EMPTY_FORM = { type: 'Passport', documentNumber: '', expiryDate: '' };

export function DocumentUploadModal({ isOpen, onClose }: DocumentUploadModalProps) {
    const { profileId } = useProfileStore();
    const [docs, setDocs] = useState<TravelDocument[]>([]);
    const [isLoadingDocs, setIsLoadingDocs] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [file, setFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen && profileId) fetchDocs();
        if (!isOpen) {
            setIsAdding(false);
            setForm(EMPTY_FORM);
            setFile(null);
        }
    }, [isOpen, profileId]);

    const fetchDocs = async () => {
        if (!profileId) return;
        setIsLoadingDocs(true);
        try {
            const data = await documentService.getDocuments(profileId);
            setDocs(Array.isArray(data) ? data : []);
        } catch {
            setDocs([]);
        } finally {
            setIsLoadingDocs(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await documentService.deleteDocument(id);
            setDocs(docs.filter(d => d.id !== id));
            toast.success('Document removed');
        } catch {
            toast.error('Failed to remove document');
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(e.type === 'dragenter' || e.type === 'dragover');
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
    };

    const handleSave = async () => {
        if (!profileId) return;
        if (!form.documentNumber.trim()) {
            toast.error('Please enter a document number');
            return;
        }
        if (!form.expiryDate) {
            toast.error('Please enter an expiry date');
            return;
        }
        setIsSaving(true);
        try {
            const added = await documentService.addDocument({
                profileId,
                type: form.type,
                documentNumber: form.documentNumber.trim().toUpperCase(),
                expiryDate: form.expiryDate,
                fileUrl: file ? file.name : '',
            });
            setDocs([...docs, added]);
            setForm(EMPTY_FORM);
            setFile(null);
            setIsAdding(false);
            toast.success('Document saved');
        } catch {
            toast.error('Failed to save document');
        } finally {
            setIsSaving(false);
        }
    };

    const formatExpiry = (dateStr: string) => {
        if (!dateStr) return '—';
        try {
            return new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
        } catch {
            return dateStr;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[480px] bg-background/95 backdrop-blur-xl border-white/10">
                <DialogHeader>
                    <DialogTitle>Travel Documents</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Existing docs list */}
                    <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                        {isLoadingDocs ? (
                            <div className="py-6 text-center text-sm text-muted-foreground">Loading…</div>
                        ) : docs.length === 0 && !isAdding ? (
                            <p className="text-center text-muted-foreground py-6 text-sm">No documents saved yet.</p>
                        ) : (
                            docs.map(doc => (
                                <div key={doc.id} className="group flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <FileText className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{doc.type}</p>
                                            <p className="text-xs text-muted-foreground font-mono tracking-wide">
                                                {doc.documentNumber} · Exp {formatExpiry(doc.expiryDate)}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost" size="icon"
                                        className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => doc.id && handleDelete(doc.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Add form */}
                    {isAdding ? (
                        <div className="p-4 rounded-xl border border-dashed border-white/20 space-y-3">
                            <div className="grid gap-2">
                                <Label>Document Type</Label>
                                <select
                                    value={form.type}
                                    onChange={e => setForm({ ...form, type: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-foreground"
                                >
                                    {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="grid gap-2">
                                    <Label>Document Number</Label>
                                    <Input
                                        value={form.documentNumber}
                                        onChange={e => setForm({ ...form, documentNumber: e.target.value })}
                                        placeholder="e.g. A1234567"
                                        className="bg-white/5 font-mono"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Expiry Date</Label>
                                    <Input
                                        type="date"
                                        value={form.expiryDate}
                                        onChange={e => setForm({ ...form, expiryDate: e.target.value })}
                                        className="bg-white/5"
                                    />
                                </div>
                            </div>

                            {/* Optional file attach */}
                            <div
                                className={`relative flex items-center justify-center h-20 border border-dashed rounded-xl transition-colors ${
                                    dragActive ? 'border-primary bg-primary/5' : 'border-white/15 bg-white/5'
                                }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    onChange={e => e.target.files?.[0] && setFile(e.target.files[0])}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                />
                                {file ? (
                                    <div className="flex items-center gap-2 text-sm px-4">
                                        <FileText className="w-4 h-4 text-primary shrink-0" />
                                        <span className="truncate max-w-[200px]">{file.name}</span>
                                        <button
                                            type="button"
                                            className="text-muted-foreground hover:text-foreground shrink-0 z-10 relative"
                                            onClick={e => { e.stopPropagation(); setFile(null); }}
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-muted-foreground text-xs pointer-events-none">
                                        <Upload className="w-4 h-4" />
                                        <span>Attach scan (optional — PDF, JPG, PNG)</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Button size="sm" onClick={handleSave} disabled={isSaving} className="flex-1">
                                    {isSaving ? 'Saving…' : 'Save Document'}
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => { setIsAdding(false); setForm(EMPTY_FORM); setFile(null); }} className="flex-1">
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Button
                            variant="outline"
                            className="w-full border-dashed border-white/20 hover:border-primary/50 hover:bg-primary/5 h-12"
                            onClick={() => setIsAdding(true)}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Document
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
