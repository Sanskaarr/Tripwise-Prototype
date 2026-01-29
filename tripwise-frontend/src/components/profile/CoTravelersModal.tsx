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
import { useProfileStore } from '@/store/profileStore';
import { coTravelerService, CoTraveler } from '@/services/coTravelerService';
import { toast } from 'sonner';
import { Plus, User, Trash2 } from 'lucide-react';

interface CoTravelersModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CoTravelersModal({ isOpen, onClose }: CoTravelersModalProps) {
    const { profileId } = useProfileStore();
    const [travelers, setTravelers] = useState<CoTraveler[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newTraveler, setNewTraveler] = useState({ name: '', relation: '', ageGroup: 'Adult', preferences: [] as string[] });

    useEffect(() => {
        if (isOpen && profileId) {
            fetchCoTravelers();
        }
    }, [isOpen, profileId]);

    const fetchCoTravelers = async () => {
        if (!profileId) return;
        try {
            const data = await coTravelerService.getCoTravelers(profileId);
            setTravelers(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load co-travelers");
        }
    };

    const handleAdd = async () => {
        if (!newTraveler.name || !profileId) return;

        try {
            const added = await coTravelerService.addCoTraveler({
                profileId,
                name: newTraveler.name,
                relation: newTraveler.relation,
                ageGroup: 'Adult', // Default for now
                preferences: []
            });

            setTravelers([...travelers, added]);
            setNewTraveler({ name: '', relation: '', ageGroup: 'Adult', preferences: [] });
            setIsAdding(false);
            toast.success("Co-traveler added");
        } catch (error) {
            console.error(error);
            toast.error("Failed to add");
        }
    };

    const handleDelete = async (id: string) => {
        if (!id) return;
        try {
            await coTravelerService.deleteCoTraveler(id);
            setTravelers(travelers.filter(t => t.id !== id));
            toast.success("Removed co-traveler");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-background/95 backdrop-blur-xl border-white/10">
                <DialogHeader>
                    <DialogTitle>Manage Co-Travelers</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* List */}
                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                        {travelers.map(t => (
                            <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{t.name}</p>
                                        <p className="text-xs text-muted-foreground">{t.relation}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                    onClick={() => t.id && handleDelete(t.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}

                        {travelers.length === 0 && (
                            <p className="text-center text-muted-foreground py-4">No co-travelers saved yet.</p>
                        )}
                    </div>

                    {/* Add New Section */}
                    {isAdding ? (
                        <div className="p-4 rounded-xl border border-dashed border-white/20 space-y-3">
                            <div className="grid gap-2">
                                <Label>Name</Label>
                                <Input
                                    value={newTraveler.name}
                                    onChange={e => setNewTraveler({ ...newTraveler, name: e.target.value })}
                                    placeholder="John Doe"
                                    className="bg-white/5"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Relation</Label>
                                <Input
                                    value={newTraveler.relation}
                                    onChange={e => setNewTraveler({ ...newTraveler, relation: e.target.value })}
                                    placeholder="Friend, Family, etc."
                                    className="bg-white/5"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" onClick={handleAdd} className="w-full">Save</Button>
                                <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)} className="w-full">Cancel</Button>
                            </div>
                        </div>
                    ) : (
                        <Button
                            variant="outline"
                            className="w-full border-dashed border-white/20 hover:border-primary/50 hover:bg-primary/5 h-12"
                            onClick={() => setIsAdding(true)}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Details
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
