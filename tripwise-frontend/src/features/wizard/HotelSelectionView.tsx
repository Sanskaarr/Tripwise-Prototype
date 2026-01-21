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
                <h2 className="text-3xl font-bold">Where would you like to stay?</h2>
                <p className="text-muted-foreground">Curated options matching your style & budget</p>
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
                        cursor-pointer rounded-2xl p-6 relative border-2 transition-all flex flex-col
                        ${isSelected ? 'border-primary bg-primary/10' : 'border-white/10 glass-card-subtle hover:border-white/30'}
                    `}
                        >
                            {isSelected && (
                                <div className="absolute top-4 right-4 bg-primary rounded-full p-1">
                                    <Check className="w-4 h-4 text-primary-foreground" />
                                </div>
                            )}

                            <div className="mb-4 bg-primary/20 w-12 h-12 rounded-xl flex items-center justify-center">
                                <Building className="text-primary" />
                            </div>

                            <h3 className="text-xl font-bold mb-1 text-foreground">{hotel?.name || 'Unnamed Hotel'}</h3>
                            <p className="text-sm text-muted-foreground mb-3 h-10 line-clamp-2">{hotel?.address || 'Address not available'}</p>

                            <div className="mt-auto pt-4 border-t border-white/10">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Price/Night</span>
                                    <span className="font-bold text-lg text-primary">{hotel?.costPerNight || 'N/A'}</span>
                                </div>
                                <p className="text-xs text-muted-foreground/80 italic">"{hotel?.reason || 'Recommended'}"</p>
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

            <div className="flex justify-end pt-4">
                <button
                    onClick={handleConfirm}
                    disabled={!selectedHotel}
                    className="glass-button-primary px-8 py-4 rounded-xl flex items-center gap-2 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Confirm Stay <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
