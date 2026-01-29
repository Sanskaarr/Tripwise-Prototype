import React from 'react';
import { useWizardStore } from '@/store/wizardStore';
import { InteractiveApi, HotelOption } from '@/lib/api/interactiveApi';
import { motion } from 'framer-motion';
import { Building, Star, Check, ArrowRight } from 'lucide-react';

export default function HotelSelectionView() {
    const { sessionId, hotelOptions, selectedHotel, selectHotel, setTransportOptions, setStep, setLoading } = useWizardStore();

    const handleConfirm = async () => {
        if (!sessionId || !selectedHotel) return;
        setLoading(true);
        try {
            // 1. Send selection to backend
            await InteractiveApi.selectHotel(sessionId, selectedHotel);

            // 2. Fetch next step options (Transport)
            const response = await InteractiveApi.getTransportOptions(sessionId);
            if (response.success && response.data) {
                setTransportOptions(response.data.options);
                setStep('TRANSPORT');
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
                <h2 className="text-4xl lg:text-5xl font-display font-medium tracking-tight mb-2">Where would you like to stay?</h2>
                <p className="text-muted-foreground font-handwriting text-xl italic">Curated options matching your style & budget</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 flex-1 overflow-y-auto p-2">
                {(hotelOptions || []).map((hotel, idx) => {
                    const isSelected = selectedHotel?.name === hotel.name;
                    return (
                        <motion.div
                            key={idx}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => selectHotel(hotel)}
                            className={`
                        cursor-pointer rounded-[2rem] p-6 relative border transition-all duration-300 flex flex-col group overflow-hidden
                        ${isSelected
                                    ? 'border-primary/50 bg-primary/10 shadow-[0_0_30px_-10px_rgba(var(--primary),0.3)]'
                                    : 'border-white/10 glass-card-subtle hover:border-white/30 hover:bg-white/5'}
                    `}
                        >
                            {/* Gradient Glow for Selected State */}
                            {isSelected && (
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-50 blur-xl pointer-events-none" />
                            )}

                            {isSelected && (
                                <div className="absolute top-5 right-5 bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg z-10">
                                    <Check className="w-3 h-3" />
                                </div>
                            )}

                            <div className={`mb-5 w-14 h-14 rounded-2xl flex items-center justify-center transition-colors relative z-10 
                                ${isSelected ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-white/5 text-muted-foreground group-hover:bg-white/10 group-hover:text-foreground'}`}>
                                <Building className="w-6 h-6" />
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-xl font-display font-medium mb-2 text-foreground tracking-tight leading-tight">{hotel?.name || 'Unnamed Hotel'}</h3>
                                <p className="text-sm text-muted-foreground/80 mb-4 h-10 line-clamp-2 font-light">{hotel?.address || 'Address not available'}</p>

                                <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">Per Night</span>
                                        <span className={`font-display text-xl ${isSelected ? 'text-primary' : 'text-foreground'}`}>{hotel?.costPerNight || 'N/A'}</span>
                                    </div>
                                    <div className="mt-2 text-right">
                                        <p className="text-xs text-foreground/90 font-medium leading-relaxed bg-black/5 p-3 rounded-lg border border-black/5 block shadow-sm">
                                            "{hotel?.reason || 'Recommended'}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {(!hotelOptions || hotelOptions.length === 0) && (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mb-4"></div>
                    <p>Fetching best hotel options...</p>
                </div>
            )}

            <div className="flex justify-center pt-8">
                <button
                    onClick={handleConfirm}
                    disabled={!selectedHotel}
                    className="h-14 rounded-2xl bg-white text-black px-8 text-sm font-bold uppercase tracking-widest shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-all hover:bg-white/90 hover:scale-[1.02] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.4)] flex items-center gap-3 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                    Confirm Stay <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
