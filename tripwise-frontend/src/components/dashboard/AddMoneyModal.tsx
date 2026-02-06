import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useProfileStore } from '@/store/profileStore';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader2, ShieldCheck, Sparkles, Wallet } from 'lucide-react';
import { paymentService } from '@/services/paymentService';
import { loadRazorpayScript } from '@/utils/razorpay';
import { walletService } from '@/services/walletService';

interface AddMoneyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function AddMoneyModal({ isOpen, onClose, onSuccess }: AddMoneyModalProps) {
    const { profileId, basicInfo, userIdentifier } = useProfileStore();
    const [amount, setAmount] = useState<string>('');
    const [loading, setLoading] = useState(false);

    // Reset when closed
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setAmount('');
                setLoading(false);
            }, 500);
        }
    }, [isOpen]);

    const handlePayment = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        setLoading(true);

        try {
            // 1. Load Razorpay Script
            const isLoaded = await loadRazorpayScript();
            if (!isLoaded) {
                toast.error("Failed to load payment gateway");
                setLoading(false);
                return;
            }

            // 2. Create Order on Backend
            const order = await paymentService.createOrder(parseFloat(amount));

            if (!order || !order.id) {
                throw new Error("Invalid order response from server");
            }

            // Sanitized Contact Logic
            let contactNumber = basicInfo?.whatsappNumber || "";
            // If no basic info number, check userIdentifier if it looks like a phone
            if (!contactNumber && userIdentifier && /^\d+$/.test(userIdentifier.replace(/[^0-9]/g, ""))) {
                contactNumber = userIdentifier;
            }
            // Strip non-digits
            contactNumber = contactNumber.replace(/[^0-9]/g, "");

            // KEY FIX: Pass undefined if invalid so Razorpay handles the prompt
            const prefillContact = contactNumber.length >= 10 ? contactNumber : undefined;
            const prefillEmail = basicInfo?.email || (userIdentifier && userIdentifier.includes('@') ? userIdentifier : undefined);

            // 3. Open Razorpay Options
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
                        // 4. Verify Payment on Backend
                        await paymentService.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        await walletService.addFunds({
                            profileId: profileId!,
                            amount: parseFloat(amount),
                            method: 'UPI'
                        });

                        toast.success("Payment Successful!");
                        onSuccess();
                        onClose();
                    } catch (verifyError) {
                        console.error("Verification Error", verifyError);
                        toast.error("Payment Verification Failed. Contact Support.");
                    }
                },
                prefill: {
                    name: basicInfo?.fullName || "Traveler",
                    email: prefillEmail,
                    contact: prefillContact
                },
                notes: {
                    address: "TripWise HQ"
                },
                theme: {
                    color: "#10B981"
                },
                retry: {
                    enabled: false
                },
                modal: {
                    confirm_close: true
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                toast.error(response.error.description || "Payment Failed");
            });
            rzp.open();
            setLoading(false);

        } catch (error) {
            console.error("Payment Error", error);
            toast.error("Something went wrong initializing payment");
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden bg-[#030303] border border-white/5 rounded-[3rem] shadow-2xl text-white">
                {/* 1. Cinematic Background Effects */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-emerald-900/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-900/10 rounded-full blur-[100px] mix-blend-screen" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
                </div>

                <div className="p-8 pb-10 flex flex-col items-center relative z-10">
                    {/* 2. Header Section */}
                    <DialogHeader className="w-full relative flex flex-col items-center mb-10">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.05] backdrop-blur-md mb-6 shadow-inner"
                        >
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-white/50">Secure Gateway</span>
                        </motion.div>
                        <DialogTitle className="text-4xl md:text-5xl font-serif text-center text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/70 tracking-tight leading-tight">
                            Add Funds
                        </DialogTitle>
                        <p className="text-center text-sm text-white/40 font-light tracking-wide mt-3 max-w-[200px] leading-relaxed">
                            Top up your wallet for a seamless booking experience.
                        </p>
                    </DialogHeader>

                    <div className="w-full space-y-8">
                        {/* 3. Floating Input Section */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative flex flex-col items-center justify-center py-2"
                        >
                            <div className="flex items-baseline justify-center relative">
                                <span className="text-4xl font-serif text-white/30 mr-2 self-start mt-2">₹</span>
                                <Input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0"
                                    className="text-[5.5rem] leading-none font-medium h-auto w-auto max-w-[300px] bg-transparent border-none text-center focus-visible:ring-0 text-white placeholder:text-white/5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none p-0 focus:placeholder:text-transparent transition-all tracking-tighter"
                                    autoFocus
                                    style={{ caretColor: '#10B981' }}
                                />
                            </div>
                            <div className="h-px w-32 bg-gradient-to-r from-transparent via-white/10 to-transparent mt-4" />
                        </motion.div>

                        {/* 4. Horizontal Presets Carousel */}
                        <div className="flex items-center justify-center gap-3 w-full overflow-x-auto pb-2 scrollbar-none">
                            {[500, 1000, 2000, 5000].map((val, idx) => (
                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={val}
                                    onClick={() => setAmount(val.toString())}
                                    className="relative px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300 group min-w-fit"
                                >
                                    <span className="text-xs font-medium text-white/60 group-hover:text-white transition-colors">
                                        + ₹{val.toLocaleString('en-IN')}
                                    </span>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* 5. Action Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="w-full mt-10"
                    >
                        <Button
                            className="w-full h-16 rounded-[2rem] text-sm font-bold uppercase tracking-[0.2em] bg-white text-black hover:bg-[#10B981] hover:text-white border-0 shadow-[0_0_40px_-10px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_-10px_rgba(16,185,129,0.4)] transition-all duration-500 flex items-center justify-between px-2 group overflow-hidden relative"
                            onClick={handlePayment}
                            disabled={!amount || loading}
                        >
                            <span className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                <Wallet className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                            </span>
                            <span className="relative z-10 ml-2">
                                {loading ? "Processing..." : "Pay Securely"}
                            </span>
                            <span className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center group-hover:bg-white group-hover:text-[#10B981] transition-all transform group-hover:rotate-[-45deg]">
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                            </span>
                        </Button>
                    </motion.div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
