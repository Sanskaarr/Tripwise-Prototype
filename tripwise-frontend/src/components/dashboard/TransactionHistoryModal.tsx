import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowDownLeft, ArrowUpRight, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { walletService, Transaction } from "@/services/walletService";
import { useProfileStore } from "@/store/profileStore";

interface TransactionHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function TransactionHistoryModal({ isOpen, onClose }: TransactionHistoryModalProps) {
    const { profileId } = useProfileStore();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        if (isOpen && profileId) {
            walletService.getHistory(profileId).then(setTransactions);
        }
    }, [isOpen, profileId]);

    const filtered = transactions.filter(t =>
        t.description?.toLowerCase().includes(filter.toLowerCase()) ||
        t.type.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col bg-background/95 backdrop-blur-xl border-white/10 rounded-[2rem]">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle>Transaction History</DialogTitle>
                </DialogHeader>

                <div className="flex items-center gap-2 py-4 flex-shrink-0">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search transactions..."
                            className="pl-9 bg-white/5 border-white/10"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                    </div>
                    <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <p>No transactions found</p>
                        </div>
                    ) : (
                        filtered.map((tx) => (
                            <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'TOPUP' || tx.type === 'REFUND'
                                            ? 'bg-emerald-500/10 text-emerald-400'
                                            : 'bg-red-500/10 text-red-400'
                                        }`}>
                                        {tx.type === 'TOPUP' || tx.type === 'REFUND' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="font-medium">{tx.description || tx.type}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(tx.timestamp).toLocaleString('en-IN', {
                                                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                            })} • {tx.method}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-medium ${tx.type === 'TOPUP' || tx.type === 'REFUND'
                                            ? 'text-emerald-400'
                                            : 'text-foreground'
                                        }`}>
                                        {tx.type === 'TOPUP' || tx.type === 'REFUND' ? '+' : '-'}
                                        ₹{tx.amount.toLocaleString('en-IN')}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground font-mono uppercase">
                                        {tx.status}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
