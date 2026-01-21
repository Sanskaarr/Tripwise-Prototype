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
                <h2 className="text-3xl font-bold">How will you get to your hotel?</h2>
                <p className="text-muted-foreground">Choose the best transfer option for you</p>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto px-1">
                {transportOptions.map((option, idx) => {
                    const isSelected = selectedTransport?.mode === option.mode;
                    return (
                        <motion.div
                            key={idx}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => selectTransport(option)}
                            className={`
                        cursor-pointer rounded-xl p-4 md:p-6 border-2 transition-all flex items-center gap-4 md:gap-6
                        ${isSelected ? 'border-blue-500 bg-blue-500/10' : 'border-white/5 glass-card-subtle hover:border-white/20'}
                    `}
                        >
                            <div className={`
                        w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center shrink-0
                        ${isSelected ? 'bg-blue-500/20' : 'bg-slate-800'}
                    `}>
                                <Car className={isSelected ? 'text-blue-400' : 'text-slate-400'} />
                            </div>

                            <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-1">
                                    <h3 className="text-lg font-bold">{option.mode}</h3>
                                    <div className="flex gap-4 text-sm mt-1 md:mt-0">
                                        <span className="flex items-center gap-1 text-green-400 bg-green-900/40 px-2 py-0.5 rounded"><Banknote className="w-3 h-3" /> {option.cost}</span>
                                        <span className="flex items-center gap-1 text-slate-400"><Clock className="w-3 h-3" /> {option.duration}</span>
                                    </div>
                                </div>
                                <p className="text-slate-300 text-sm">{option.details}</p>
                            </div>

                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-600'}`}>
                                {isSelected && <Check className="w-4 h-4 text-white" />}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="flex justify-end pt-4">
                <button
                    onClick={handleConfirm}
                    disabled={!selectedTransport}
                    className="glass-button-primary w-full md:w-auto px-8 py-4 rounded-xl flex items-center justify-center gap-2 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                >
                    <Sparkles className="w-5 h-5" /> Generate Master Plan
                </button>
            </div>
        </div>
    );
}
