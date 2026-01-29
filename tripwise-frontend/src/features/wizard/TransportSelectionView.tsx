import React from 'react';
import { useWizardStore } from '@/store/wizardStore';
import { InteractiveApi } from '@/lib/api/interactiveApi';
import { motion } from 'framer-motion';
import { Car, Clock, Banknote, Check, Sparkles } from 'lucide-react';

export default function TransportSelectionView() {
    const { sessionId, transportOptions, selectedTransport, selectTransport, setMasterPlan, setStep, setLoading } = useWizardStore();

    const handleConfirm = async () => {
        if (!sessionId || !selectedTransport) return;
        setLoading(true);
        try {
            // 1. Send selection
            await InteractiveApi.selectTransport(sessionId, selectedTransport);

            // 2. Generate Master Plan (This is the big AI call)
            const response = await InteractiveApi.finalizeTrip(sessionId);
            if (response.success && response.data) {
                setMasterPlan(response.data);
                setStep('PLAN');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="text-center">
                <h2 className="text-4xl lg:text-5xl font-display font-medium tracking-tight mb-2">How will you get to your hotel?</h2>
                <p className="text-muted-foreground font-handwriting text-xl italic">Choose the best transfer option for you</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 flex-1 overflow-y-auto p-2">
                {transportOptions.map((option, idx) => {
                    const isSelected = selectedTransport?.mode === option.mode;
                    return (
                        <motion.div
                            key={idx}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => selectTransport(option)}
                            className={`
                        cursor-pointer rounded-[2rem] p-6 border transition-all duration-300 flex items-center gap-6 relative overflow-hidden group
                        ${isSelected
                                    ? 'border-primary/50 bg-primary/10 shadow-[0_0_30px_-10px_rgba(var(--primary),0.3)]'
                                    : 'border-white/10 glass-card-subtle hover:border-white/30 hover:bg-white/5'}
                    `}
                        >
                            {isSelected && (
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none" />
                            )}

                            <div className={`
                        w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-colors relative z-10
                        ${isSelected ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-white/5 text-muted-foreground group-hover:bg-white/10 group-hover:text-foreground'}
                    `}>
                                <Car className="w-7 h-7" />
                            </div>

                            <div className="flex-1 relative z-10">
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                    <h3 className="text-xl font-display font-medium tracking-tight">{option.mode}</h3>
                                    <div className="flex gap-4 text-xs mt-1 md:mt-0 font-bold uppercase tracking-wider text-muted-foreground">
                                        <span className="flex items-center gap-1"><Banknote className="w-3 h-3 text-green-400" /> {option.cost}</span>
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-blue-400" /> {option.duration}</span>
                                    </div>
                                </div>
                                <p className="text-sm text-foreground/80 leading-relaxed font-light">{option.details}</p>
                            </div>

                            <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors relative z-10 ${isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-white/10 text-transparent'}`}>
                                <Check className="w-4 h-4" />
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="flex justify-center pt-8">
                <button
                    onClick={handleConfirm}
                    disabled={!selectedTransport}
                    className="h-14 rounded-2xl bg-white text-black px-8 text-sm font-bold uppercase tracking-widest shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-all hover:bg-white/90 hover:scale-[1.02] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.4)] flex items-center gap-3 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                    <Sparkles className="w-4 h-4" /> Generate Master Plan
                </button>
            </div>
        </div>
    );
}
