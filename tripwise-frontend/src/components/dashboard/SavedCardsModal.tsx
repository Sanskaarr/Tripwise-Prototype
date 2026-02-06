import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SavedCardsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SavedCardsModal({ isOpen, onClose }: SavedCardsModalProps) {
    const [cards, setCards] = useState([
        { id: '1', last4: '4242', brand: 'Visa', color: 'bg-blue-900', expiry: '12/28' },
        { id: '2', last4: '8899', brand: 'Mastercard', color: 'bg-gray-900', expiry: '09/26' }
    ]);

    const handleRemove = (id: string) => {
        setCards(cards.filter(c => c.id !== id));
        toast.success("Card removed successfully");
    };

    const handleAddCard = () => {
        toast.success("Card added successfully (Simulation)");
        setCards([...cards, {
            id: Math.random().toString(),
            last4: Math.floor(1000 + Math.random() * 9000).toString(),
            brand: Math.random() > 0.5 ? 'Visa' : 'Rupay',
            color: 'bg-indigo-900',
            expiry: '01/30'
        }]);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px] bg-background/95 backdrop-blur-xl border-white/10 rounded-[2rem]">
                <DialogHeader>
                    <DialogTitle>Saved Cards</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {cards.map(card => (
                        <div key={card.id} className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10">
                            <div className={`absolute inset-0 opacity-20 ${card.color}`} />
                            <div className="relative flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-14 items-center justify-center rounded bg-white/10">
                                        <CreditCard className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-lg tracking-widest">•••• {card.last4}</p>
                                        <p className="text-xs text-muted-foreground">{card.brand} • Expires {card.expiry}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemove(card.id)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}

                    <Button onClick={handleAddCard} variant="outline" className="w-full h-12 border-dashed border-white/20 hover:border-primary/50 hover:bg-primary/5 hover:text-primary">
                        <Plus className="w-4 h-4 mr-2" /> Add New Card
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
