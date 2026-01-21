import React, { useEffect } from 'react';
import { useWizardStore } from '@/store/wizardStore';
import { InteractiveApi } from '@/lib/api/interactiveApi';
import { motion } from 'framer-motion';
import { MapPin, Thermometer, Banknote, ArrowRight } from 'lucide-react';
import { useProfileStore } from '@/store/profileStore';

export default function OverviewView() {
    const { sessionId, overviewData, setHotelOptions, setStep, setLoading } = useWizardStore();
    const { destination } = useProfileStore();

    const handleNext = async () => {
        if (!sessionId) return;
        setLoading(true);
        try {
            const response = await InteractiveApi.getHotelSuggestions(sessionId);
            if (response.success && response.data) {
                setHotelOptions(response.data.options);
                setStep('HOTEL');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (!overviewData) return <div className="flex justify-center items-center h-full">Generating Overview...</div>;

    // Safe parsing incase it's a string
    const data = typeof overviewData === 'string' ? JSON.parse(overviewData) : overviewData;

    return (
        <div className="space-y-10 h-full flex flex-col justify-center">
            <div className="text-center space-y-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-block"
                >
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-light text-foreground tracking-tight">
                        Welcome to <span className="font-handwriting text-primary italic pr-2">{destination.destination}</span>
                    </h2>
                </motion.div>
                <p className="text-sm sm:text-lg text-muted-foreground font-light tracking-wide uppercase">Your personalized travel snapshot</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                <motion.div
                    whileHover={{ y: -5 }}
                    className="glass-card-subtle p-4 sm:p-6 rounded-2xl flex items-start gap-4 border border-white/10 bg-white/5 backdrop-blur-md"
                >
                    <div className="p-3 bg-blue-500/10 rounded-xl"><MapPin className="w-6 h-6 text-blue-400" /></div>
                    <div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Destination</p>
                        <p className="font-display text-lg sm:text-xl text-foreground">{destination.destination}</p>
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{ y: -5 }}
                    className="glass-card-subtle p-4 sm:p-6 rounded-2xl flex items-start gap-4 border border-white/10 bg-white/5 backdrop-blur-md"
                >
                    <div className="p-3 bg-orange-500/10 rounded-xl"><Thermometer className="w-6 h-6 text-orange-400" /></div>
                    <div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Weather</p>
                        <p className="font-sans text-xs sm:text-sm text-foreground/90 leading-relaxed">{data.weatherForecast}</p>
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{ y: -5 }}
                    className="glass-card-subtle p-4 sm:p-6 rounded-2xl flex items-start gap-4 border border-white/10 bg-white/5 backdrop-blur-md"
                >
                    <div className="p-3 bg-green-500/10 rounded-xl"><Banknote className="w-6 h-6 text-green-400" /></div>
                    <div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Est. Cost</p>
                        <p className="font-display text-lg sm:text-xl text-foreground">{data.estimatedCost}</p>
                    </div>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="glass-card-subtle p-5 sm:p-8 rounded-3xl bg-black/20 border border-white/10 backdrop-blur-md"
            >
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-xl sm:text-2xl">🌍</span>
                    <h3 className="text-lg sm:text-xl font-display font-medium text-foreground">Destination Overview</h3>
                </div>
                <p className="text-foreground/80 leading-relaxed sm:leading-loose text-base sm:text-lg font-light">
                    {data.overview}
                </p>
            </motion.div>

            <div className="flex justify-end pt-6">
                <button
                    onClick={handleNext}
                    className="group relative px-8 py-4 bg-foreground text-background rounded-full font-bold tracking-widest uppercase text-sm overflow-hidden hover:scale-105 transition-transform duration-300"
                >
                    <span className="relative z-10 flex items-center gap-3">
                        Find My Stay <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                </button>
            </div>
        </div>
    );

}
