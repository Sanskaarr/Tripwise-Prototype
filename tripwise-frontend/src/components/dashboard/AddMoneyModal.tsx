import { useState } from 'react';
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
import { walletService } from '@/services/walletService';
import { toast } from 'sonner';
import { DollarSign, CreditCard, Landmark, Smartphone } from 'lucide-react';

interface AddMoneyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function AddMoneyModal({ isOpen, onClose, onSuccess }: AddMoneyModalProps) {
    const { profileId } = useProfileStore();
    const [amount, setAmount] = useState<string>('');
    const [method, setMethod] = useState<string>('UPI');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!profileId) {
            toast.error("You must be logged in to add funds.");
            setIsLoading(false);
            return;
        }

        try {
            await walletService.addFunds({
                profileId,
                amount: parseFloat(amount),
                method
            });
            toast.success("Funds added successfully!");
            onSuccess();
            onClose();
            setAmount('');
        } catch (error) {
            console.error(error);
            toast.error("Failed to add funds. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur-xl border-white/10">
                <DialogHeader>
                    <DialogTitle>Add Funds to TripWise Pay</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount (₹)</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                            <Input
                                id="amount"
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="pl-8 bg-white/5 border-white/10"
                                required
                                min="1"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label>Payment Method</Label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => setMethod('UPI')}
                                className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${method === 'UPI'
                                        ? 'bg-primary/10 border-primary text-primary'
                                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                                    }`}
                            >
                                <Smartphone className="h-5 w-5" />
                                <span className="text-xs font-medium">UPI</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setMethod('DEBIT_CARD')}
                                className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${method === 'DEBIT_CARD'
                                        ? 'bg-primary/10 border-primary text-primary'
                                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                                    }`}
                            >
                                <CreditCard className="h-5 w-5" />
                                <span className="text-xs font-medium">Card</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setMethod('NET_BANKING')}
                                className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${method === 'NET_BANKING'
                                        ? 'bg-primary/10 border-primary text-primary'
                                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                                    }`}
                            >
                                <Landmark className="h-5 w-5" />
                                <span className="text-xs font-medium">Net Banking</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-2">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={isLoading || !amount || parseFloat(amount) <= 0}>
                            {isLoading ? 'Processing...' : 'Add Funds'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
