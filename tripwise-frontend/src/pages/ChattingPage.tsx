import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { useProfileStore } from "@/store/profileStore";
import { useWizardStore } from "@/store/wizardStore";
import { InteractiveApi } from "@/lib/api/interactiveApi";
import { useShallow } from 'zustand/react/shallow';
import { ArrowRight, Save, Play, Sparkles } from "lucide-react";

// Typing Effect Component
const TypewriterText = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        let i = 0;
        const speed = 10;
        const interval = setInterval(() => {
            if (i < text.length) {
                setDisplayedText((prev) => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(interval);
                onComplete?.();
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, onComplete]);

    return <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{displayedText}</p>;
};

const ChattingPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Store access
    const { basicInfo } = useProfileStore(useShallow(state => ({ basicInfo: state.basicInfo })));
    const { sessionId, overviewData, setHotelOptions, setStep, setLoading, isLoading: loading } = useWizardStore();

    const [showActions, setShowActions] = useState(false);

    // Initial parsing of overview data
    const parsedOverview = React.useMemo(() => {
        if (!overviewData) return null;
        return typeof overviewData === 'string' ? JSON.parse(overviewData) : overviewData;
    }, [overviewData]);

    const handleContinuePlanning = async () => {
        if (!sessionId) return;
        setLoading(true);
        try {
            // Fetch next step (Hotels)
            const response = await InteractiveApi.getHotelSuggestions(sessionId);

            if (response.success) {
                let options = response.data?.options;

                // Fallback: If data is a string (backend sent raw JSON string not parsed by client)
                if (!options && typeof response.data === 'string') {
                    try {
                        const parsed = JSON.parse(response.data as string);
                        options = parsed.options;
                    } catch (e) {
                        console.error("Failed to parse hotel options JSON", e);
                    }
                }

                if (options && options.length > 0) {
                    setHotelOptions(options);
                    setStep('HOTEL');
                    navigate('/wizard');
                } else {
                    console.error("No hotel options received", response);
                }
            }
        } catch (e) {
            console.error("Failed to fetch hotels", e);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveForLater = () => {
        // Just navigate home for now or show a toast
        navigate('/');
    };

    // If no session/overview, fallback to default view (or redirect)
    // For now, let's assume if there's no data, we show the "Welcome" state
    const hasActiveSession = !!parsedOverview;
    const userName = basicInfo.fullName?.split(' ')[0] || "Traveler";

    return (
        <>
            <SiteHeader />
            <main className="relative z-10 container mx-auto px-4 pt-24 pb-12 max-w-4xl min-h-screen flex flex-col">

                {/* Chat Interface */}
                <div className="flex-1 flex flex-col gap-6 pb-24">

                    {/* Bot Greeting */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-4"
                    >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex flex-col gap-2 max-w-[85%]">
                            <div className="glass-card-subtle px-6 py-4 rounded-2xl rounded-tl-none border-white/10 bg-black/20 backdrop-blur-md">
                                <p className="text-sm font-semibold mb-1 text-primary">TripWise AI</p>
                                <p className="text-foreground/90 leading-relaxed">
                                    Welcome back, {userName}! I've analyzed your preferences for
                                    <span className="font-bold text-primary mx-1">{parsedOverview?.destination || (basicInfo.fullName?.split(' ')[0]) || 'your trip'}</span>.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Overview Message (The "Typing" Part) */}
                    {hasActiveSession && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            className="flex items-start gap-4"
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center shrink-0 shadow-lg opacity-0">
                                {/* Invisible placeholder for alignment */}
                            </div>
                            <div className="flex flex-col gap-2 max-w-[85%]">
                                <div className="glass-card-subtle px-6 py-4 rounded-2xl rounded-tl-none border-white/10 bg-black/20 backdrop-blur-md">
                                    <div className="mb-4">
                                        <TypewriterText
                                            text={parsedOverview.overview}
                                            onComplete={() => setShowActions(true)}
                                        />
                                    </div>

                                    {/* Mini Stats Grid inside Chat */}
                                    <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/10">
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Weather</p>
                                            <p className="text-sm font-medium">{parsedOverview.weatherForecast}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Est. Cost</p>
                                            <p className="text-sm font-medium">{parsedOverview.estimatedCost}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* User Actions */}
                    <AnimatePresence>
                        {showActions && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex justify-end gap-3 mt-4"
                            >
                                <button
                                    onClick={handleSaveForLater}
                                    className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium flex items-center gap-2 text-muted-foreground"
                                >
                                    <Save className="w-4 h-4" />
                                    Save for Later
                                </button>

                                <button
                                    onClick={handleContinuePlanning}
                                    disabled={loading}
                                    className="glass-button-primary px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-medium hover:scale-105 transition-transform"
                                >
                                    {loading ? (
                                        <>Finding Hotels...</>
                                    ) : (
                                        <>Continue Planning <ArrowRight className="w-4 h-4" /></>
                                    )}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>

                {/* Input Area (Visual Only) */}
                <div className="fixed bottom-4 md:bottom-8 left-0 right-0 px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="glass-card px-4 py-3 rounded-full flex items-center gap-3 border border-white/10 bg-black/40 backdrop-blur-xl">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-muted-foreground">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                placeholder="Reply to TripWise AI..."
                                className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/50"
                                disabled
                            />
                            <button className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center hover:bg-primary/30 transition-colors">
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

            </main>
        </>
    );
};

export default ChattingPage;
