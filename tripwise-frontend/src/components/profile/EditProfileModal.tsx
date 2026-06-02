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
import { userService } from '@/services/userService';
import { toast } from 'sonner';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Tab = 'personal' | 'preferences';

const TRAVEL_STYLES = [
    { value: 'balanced' as const, label: 'Balanced' },
    { value: 'adventure' as const, label: 'Adventure' },
    { value: 'relaxed' as const, label: 'Relaxed' },
    { value: 'cultural' as const, label: 'Cultural' },
];

const ACCOM_TYPES = [
    { value: 'budget' as const, label: 'Budget' },
    { value: 'mid-range' as const, label: 'Mid-range' },
    { value: 'luxury' as const, label: 'Luxury' },
    { value: 'resort' as const, label: 'Resort' },
    { value: 'homestay' as const, label: 'Homestay' },
];

const DIETARY_TYPES = [
    { value: 'veg' as const, label: 'Vegetarian' },
    { value: 'non-veg' as const, label: 'Non-veg' },
    { value: 'both' as const, label: 'Both' },
];

function ChipSelector<T extends string>({
    options,
    value,
    onChange,
}: {
    options: { value: T; label: string }[];
    value: T | null;
    onChange: (v: T) => void;
}) {
    return (
        <div className="flex flex-wrap gap-2">
            {options.map(opt => (
                <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange(opt.value)}
                    className={`px-4 py-2 rounded-xl text-sm border transition-colors ${
                        value === opt.value
                            ? 'bg-primary/20 border-primary/40 text-primary font-medium'
                            : 'bg-white/5 border-white/10 text-muted-foreground hover:border-white/30 hover:text-foreground'
                    }`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
}

export function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
    const {
        basicInfo, profileId, destination, accommodation, food,
        updateTravelerInfo, updateDestinationPreference, updateAccommodationPreference, updateFoodPreference,
    } = useProfileStore();

    const [activeTab, setActiveTab] = useState<Tab>('personal');
    const [isLoading, setIsLoading] = useState(false);

    const [personalForm, setPersonalForm] = useState({
        fullName: basicInfo.fullName,
        email: basicInfo.email,
        whatsappNumber: basicInfo.whatsappNumber,
    });

    const [prefForm, setPrefForm] = useState({
        travelStyle: destination.travelStyle,
        accommodationCategory: accommodation.category,
        dietaryType: food.type,
    });

    // Re-sync from store each time the modal opens
    useEffect(() => {
        if (isOpen) {
            setActiveTab('personal');
            setPersonalForm({
                fullName: basicInfo.fullName,
                email: basicInfo.email,
                whatsappNumber: basicInfo.whatsappNumber,
            });
            setPrefForm({
                travelStyle: destination.travelStyle,
                accommodationCategory: accommodation.category,
                dietaryType: food.type,
            });
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (activeTab === 'personal') {
                if (profileId) await userService.updateProfile(profileId, personalForm);
                updateTravelerInfo(personalForm);
            } else {
                if (profileId) {
                    await Promise.all([
                        userService.updateDestination(profileId, { ...destination, travelStyle: prefForm.travelStyle }),
                        userService.updateAccommodation(profileId, { ...accommodation, category: prefForm.accommodationCategory }),
                        userService.updateFood(profileId, { ...food, type: prefForm.dietaryType }),
                    ]);
                }
                updateDestinationPreference({ travelStyle: prefForm.travelStyle });
                updateAccommodationPreference({ category: prefForm.accommodationCategory });
                updateFoodPreference({ type: prefForm.dietaryType });
            }
            toast.success('Profile updated successfully');
            onClose();
        } catch (error) {
            console.error(error);
            toast.error('Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[460px] bg-background/95 backdrop-blur-xl border-white/10">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>

                {/* Tab switcher */}
                <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                    {(['personal', 'preferences'] as Tab[]).map(tab => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                                activeTab === tab
                                    ? 'bg-white text-black shadow-sm'
                                    : 'text-muted-foreground hover:text-white'
                            }`}
                        >
                            {tab === 'personal' ? 'Personal Info' : 'Travel Preferences'}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    {activeTab === 'personal' ? (
                        <>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Name</Label>
                                <Input
                                    id="name"
                                    value={personalForm.fullName}
                                    onChange={e => setPersonalForm({ ...personalForm, fullName: e.target.value })}
                                    className="col-span-3 bg-white/5 border-white/10"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">Email</Label>
                                <Input
                                    id="email"
                                    value={personalForm.email}
                                    onChange={e => setPersonalForm({ ...personalForm, email: e.target.value })}
                                    className="col-span-3 bg-white/5 border-white/10"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="phone" className="text-right">Phone</Label>
                                <Input
                                    id="phone"
                                    value={personalForm.whatsappNumber}
                                    onChange={e => setPersonalForm({ ...personalForm, whatsappNumber: e.target.value })}
                                    className="col-span-3 bg-white/5 border-white/10"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <Label>Travel Style</Label>
                                <ChipSelector
                                    options={TRAVEL_STYLES}
                                    value={prefForm.travelStyle}
                                    onChange={v => setPrefForm({ ...prefForm, travelStyle: v })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Accommodation</Label>
                                <ChipSelector
                                    options={ACCOM_TYPES}
                                    value={prefForm.accommodationCategory}
                                    onChange={v => setPrefForm({ ...prefForm, accommodationCategory: v })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Dietary Preference</Label>
                                <ChipSelector
                                    options={DIETARY_TYPES}
                                    value={prefForm.dietaryType}
                                    onChange={v => setPrefForm({ ...prefForm, dietaryType: v })}
                                />
                            </div>
                        </>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Saving…' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
