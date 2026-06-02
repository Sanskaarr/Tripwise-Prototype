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
import { Plus, User, Trash2, Pencil, X, Check } from 'lucide-react';

interface CoTravelersModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AGE_GROUPS = ['Adult', 'Child', 'Senior'] as const;
const PREFERENCE_CHIPS = ['Sightseeing', 'Relaxation', 'Adventure', 'Shopping', 'Nature', 'Food & Dining'];
const EMPTY_FORM = { name: '', relation: '', ageGroup: 'Adult', preferences: [] as string[] };

function ToggleChip({ label, selected, onToggle }: { label: string; selected: boolean; onToggle: () => void }) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                selected
                    ? 'bg-primary/20 border-primary/40 text-primary'
                    : 'bg-white/5 border-white/10 text-muted-foreground hover:border-white/30'
            }`}
        >
            {label}
        </button>
    );
}

function AgeGroupSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    return (
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-md px-3 h-8 text-sm text-foreground"
        >
            {AGE_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
    );
}

export function CoTravelersModal({ isOpen, onClose }: CoTravelersModalProps) {
    const { profileId } = useProfileStore();
    const [travelers, setTravelers] = useState<CoTraveler[]>([]);

    const [isAdding, setIsAdding] = useState(false);
    const [newTraveler, setNewTraveler] = useState(EMPTY_FORM);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState(EMPTY_FORM);

    useEffect(() => {
        if (isOpen && profileId) fetchCoTravelers();
    }, [isOpen, profileId]);

    const fetchCoTravelers = async () => {
        if (!profileId) return;
        try {
            const data = await coTravelerService.getCoTravelers(profileId);
            setTravelers(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load co-travelers');
        }
    };

    const togglePref = (list: string[], pref: string) =>
        list.includes(pref) ? list.filter(p => p !== pref) : [...list, pref];

    const handleAdd = async () => {
        if (!newTraveler.name || !profileId) return;
        try {
            const added = await coTravelerService.addCoTraveler({
                profileId,
                name: newTraveler.name,
                relation: newTraveler.relation,
                ageGroup: newTraveler.ageGroup,
                preferences: newTraveler.preferences,
            });
            setTravelers([...travelers, added]);
            setNewTraveler(EMPTY_FORM);
            setIsAdding(false);
            toast.success('Co-traveler added');
        } catch (error) {
            console.error(error);
            toast.error('Failed to add');
        }
    };

    const handleEditStart = (traveler: CoTraveler) => {
        setEditingId(traveler.id!);
        setEditForm({
            name: traveler.name,
            relation: traveler.relation,
            ageGroup: traveler.ageGroup || 'Adult',
            preferences: traveler.preferences || [],
        });
        setIsAdding(false);
    };

    const handleEditCancel = () => {
        setEditingId(null);
        setEditForm(EMPTY_FORM);
    };

    const handleEditSave = async (traveler: CoTraveler) => {
        if (!editForm.name || !traveler.id || !profileId) return;
        try {
            const updated = await coTravelerService.updateCoTraveler(traveler.id, {
                profileId,
                name: editForm.name,
                relation: editForm.relation,
                ageGroup: editForm.ageGroup,
                preferences: editForm.preferences,
            });
            setTravelers(travelers.map(t => t.id === traveler.id ? updated : t));
            setEditingId(null);
            setEditForm(EMPTY_FORM);
            toast.success('Co-traveler updated');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update');
        }
    };

    const handleDelete = async (id: string) => {
        if (!id) return;
        try {
            await coTravelerService.deleteCoTraveler(id);
            setTravelers(travelers.filter(t => t.id !== id));
            if (editingId === id) handleEditCancel();
            toast.success('Removed co-traveler');
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete');
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
                    <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                        {travelers.map(t => (
                            <div key={t.id} className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                                {editingId !== t.id ? (
                                    /* View row */
                                    <div className="flex items-start justify-between p-3">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                                <User className="w-4 h-4 text-primary" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-medium text-sm">{t.name}</p>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-xs text-muted-foreground">{t.relation || '—'}</span>
                                                    <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{t.ageGroup || 'Adult'}</span>
                                                </div>
                                                {t.preferences && t.preferences.length > 0 && (
                                                    <div className="flex gap-1 flex-wrap">
                                                        {t.preferences.map(p => (
                                                            <span key={p} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{p}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <Button
                                                variant="ghost" size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                                onClick={() => handleEditStart(t)}
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost" size="icon"
                                                className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                onClick={() => t.id && handleDelete(t.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    /* Inline edit form */
                                    <div className="p-3 space-y-3">
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="grid gap-1">
                                                <Label className="text-xs">Name</Label>
                                                <Input
                                                    value={editForm.name}
                                                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                                    className="bg-white/5 h-8 text-sm"
                                                    placeholder="Name"
                                                />
                                            </div>
                                            <div className="grid gap-1">
                                                <Label className="text-xs">Relation</Label>
                                                <Input
                                                    value={editForm.relation}
                                                    onChange={e => setEditForm({ ...editForm, relation: e.target.value })}
                                                    className="bg-white/5 h-8 text-sm"
                                                    placeholder="e.g. Friend"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid gap-1">
                                            <Label className="text-xs">Age Group</Label>
                                            <AgeGroupSelect
                                                value={editForm.ageGroup}
                                                onChange={v => setEditForm({ ...editForm, ageGroup: v })}
                                            />
                                        </div>
                                        <div className="grid gap-1">
                                            <Label className="text-xs">Preferences</Label>
                                            <div className="flex flex-wrap gap-1.5">
                                                {PREFERENCE_CHIPS.map(chip => (
                                                    <ToggleChip
                                                        key={chip}
                                                        label={chip}
                                                        selected={editForm.preferences.includes(chip)}
                                                        onToggle={() => setEditForm({ ...editForm, preferences: togglePref(editForm.preferences, chip) })}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" onClick={() => handleEditSave(t)} className="h-8 flex-1 gap-1.5">
                                                <Check className="w-3.5 h-3.5" /> Save
                                            </Button>
                                            <Button size="sm" variant="ghost" onClick={handleEditCancel} className="h-8 flex-1 gap-1.5">
                                                <X className="w-3.5 h-3.5" /> Cancel
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {travelers.length === 0 && (
                            <p className="text-center text-muted-foreground py-4">No co-travelers saved yet.</p>
                        )}
                    </div>

                    {/* Add New Section */}
                    {isAdding ? (
                        <div className="p-4 rounded-xl border border-dashed border-white/20 space-y-3">
                            <div className="grid grid-cols-2 gap-2">
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
                                        placeholder="Friend, Family…"
                                        className="bg-white/5"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Age Group</Label>
                                <AgeGroupSelect
                                    value={newTraveler.ageGroup}
                                    onChange={v => setNewTraveler({ ...newTraveler, ageGroup: v })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Preferences</Label>
                                <div className="flex flex-wrap gap-1.5">
                                    {PREFERENCE_CHIPS.map(chip => (
                                        <ToggleChip
                                            key={chip}
                                            label={chip}
                                            selected={newTraveler.preferences.includes(chip)}
                                            onToggle={() => setNewTraveler({ ...newTraveler, preferences: togglePref(newTraveler.preferences, chip) })}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" onClick={handleAdd} className="w-full">Save</Button>
                                <Button size="sm" variant="ghost" onClick={() => { setIsAdding(false); setNewTraveler(EMPTY_FORM); }} className="w-full">Cancel</Button>
                            </div>
                        </div>
                    ) : (
                        <Button
                            variant="outline"
                            className="w-full border-dashed border-white/20 hover:border-primary/50 hover:bg-primary/5 h-12"
                            onClick={() => { setIsAdding(true); setEditingId(null); }}
                            disabled={!!editingId}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Co-Traveler
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
