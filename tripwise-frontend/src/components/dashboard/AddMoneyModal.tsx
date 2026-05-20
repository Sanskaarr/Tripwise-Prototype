import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useProfileStore } from '@/store/profileStore';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader2, Lock, Plus, Wallet } from 'lucide-react';
import { paymentService } from '@/services/paymentService';
import { loadRazorpayScript } from '@/utils/razorpay';
import { walletService } from '@/services/walletService';
import { PremiumButton } from '@/components/ui/PremiumButton';

interface AddMoneyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const PRESETS = [500, 1000, 2000, 5000];

export function AddMoneyModal({ isOpen, onClose, onSuccess }: AddMoneyModalProps) {
    const { profileId, basicInfo, userIdentifier } = useProfileStore();
    const [amount, setAmount] = useState<string>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            const t = setTimeout(() => {
                setAmount('');
                setLoading(false);
            }, 300);
            return () => clearTimeout(t);
        }
    }, [isOpen]);

    const numericAmount = parseFloat(amount) || 0;
    const isValidAmount = numericAmount >= 1;

    const handlePayment = async () => {
        if (!isValidAmount) {
            toast.error("Please enter a valid amount");
            return;
        }
        setLoading(true);
        try {
            const isLoaded = await loadRazorpayScript();
            if (!isLoaded) {
                toast.error("Failed to load payment gateway");
                setLoading(false);
                return;
            }

            const order = await paymentService.createOrder(numericAmount);
            if (!order || !order.id) throw new Error("Invalid order response from server");

            let contactNumber = basicInfo?.whatsappNumber || "";
            if (!contactNumber && userIdentifier && /^\d+$/.test(userIdentifier.replace(/[^0-9]/g, "")))
                contactNumber = userIdentifier;
            contactNumber = contactNumber.replace(/[^0-9]/g, "");

            const prefillContact = contactNumber.length >= 10 ? contactNumber : undefined;
            const prefillEmail = basicInfo?.email || (userIdentifier?.includes('@') ? userIdentifier : undefined);

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "TripWise",
                description: "Wallet Top-up",
                image: "/logo.png",
                order_id: order.id,
                handler: async function (response: any) {
                    try {
                        await paymentService.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        await walletService.addFunds({
                            profileId: profileId!,
                            amount: numericAmount,
                            method: 'UPI',
                        });
                        toast.success(`₹${numericAmount.toLocaleString('en-IN')} added to your wallet!`);
                        onSuccess();
                        onClose();
                    } catch {
                        toast.error("Payment verification failed. Please contact support.");
                    }
                },
                prefill: {
                    name: basicInfo?.fullName || "Traveler",
                    email: prefillEmail,
                    contact: prefillContact,
                },
                notes: { address: "TripWise HQ" },
                theme: { color: "#1d4ed8" },
                retry: { enabled: false },
                modal: { confirm_close: true },
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                toast.error(response.error.description || "Payment failed");
            });
            rzp.open();
            setLoading(false);
        } catch (error) {
            console.error("Payment Error", error);
            toast.error("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[460px] p-0 overflow-hidden bg-background/95 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl">

                {/* Decorative blobs — mirrors WalletSection */}
                <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl pointer-events-none" />
                <div className="absolute -left-16 -bottom-16 h-52 w-52 rounded-full bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 blur-3xl pointer-events-none" />

                <div className="relative px-8 pt-8 pb-7">

                    {/* ── Header ── */}
                    <DialogHeader className="mb-7 text-center space-y-0">
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35 }}
                            className="flex justify-center mb-4"
                        >
                            <div className="rounded-full border border-white/10 bg-white/5 p-3 backdrop-blur-xl">
                                <Wallet className="h-6 w-6 text-primary" />
                            </div>
                        </motion.div>

                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 mb-2">
                            TripWise Pay
                        </p>

                        <DialogTitle className="font-display text-3xl font-medium tracking-tight text-foreground">
                            Add Money
                        </DialogTitle>

                        <p className="text-sm text-muted-foreground/60 font-light mt-2 leading-relaxed">
                            Top up your wallet for seamless bookings
                        </p>
                    </DialogHeader>

                    {/* ── Amount Input ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.05 }}
                        className="mb-5"
                    >
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-3">
                            Enter Amount
                        </p>
                        <div className="relative flex items-center justify-center gap-1 py-5 rounded-2xl bg-white/5 border border-white/10 transition-all duration-300 focus-within:border-primary/40 focus-within:bg-primary/[0.03] focus-within:shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                            <span className="text-3xl font-light text-muted-foreground/40 self-start mt-1.5 select-none">
                                ₹
                            </span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0"
                                autoFocus
                                min={1}
                                className="text-5xl font-light text-foreground text-center bg-transparent border-none outline-none w-[180px] placeholder:text-muted-foreground/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none caret-primary"
                            />
                            {amount && (
                                <button
                                    onClick={() => setAmount('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 hover:text-muted-foreground/70 transition-colors text-xs"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </motion.div>

                    {/* ── Quick Add Presets ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.1 }}
                        className="mb-5"
                    >
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-3">
                            Quick Add
                        </p>
                        <div className="grid grid-cols-4 gap-2">
                            {PRESETS.map((val, idx) => {
                                const isSelected = amount === val.toString();
                                return (
                                    <motion.button
                                        key={val}
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.12 + idx * 0.04 }}
                                        onClick={() => setAmount(isSelected ? '' : val.toString())}
                                        className={`relative group p-3 rounded-xl border text-center transition-all duration-300 overflow-hidden ${
                                            isSelected
                                                ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                                                : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                                        }`}
                                    >
                                        <span className={`text-sm font-medium block ${isSelected ? 'text-primary' : 'text-foreground/80 group-hover:text-foreground'}`}>
                                            ₹{val >= 1000 ? `${val / 1000}k` : val}
                                        </span>
                                        <AnimatePresence>
                                            {isSelected && (
                                                <motion.span
                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.5 }}
                                                    className="absolute top-1 right-1"
                                                >
                                                    <CheckCircle className="w-3 h-3 text-primary" />
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* ── Summary pill ── */}
                    <AnimatePresence>
                        {isValidAmount && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-5 overflow-hidden"
                            >
                                <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                                    <span className="text-sm text-muted-foreground/60">You're adding</span>
                                    <span className="text-sm font-semibold text-foreground">
                                        ₹{numericAmount.toLocaleString('en-IN')}
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── CTA ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.18 }}
                    >
                        <PremiumButton
                            onClick={handlePayment}
                            disabled={!isValidAmount || loading}
                            isLoading={loading}
                            fullWidth
                            className="h-12 rounded-2xl py-3 text-sm font-medium"
                        >
                            {loading ? 'Processing…' : (
                                <>
                                    <Plus className="w-4 h-4" />
                                    {isValidAmount
                                        ? `Add ₹${numericAmount.toLocaleString('en-IN')}`
                                        : 'Add Money'}
                                </>
                            )}
                        </PremiumButton>
                    </motion.div>

                    {/* ── Security badge ── */}
                    <div className="flex items-center justify-center gap-1.5 mt-4">
                        <Lock className="w-3 h-3 text-muted-foreground/25" />
                        <span className="text-[11px] text-muted-foreground/35">Secured by Razorpay</span>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
}
