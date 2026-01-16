import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { LiquidBackground } from "@/components/ui/LiquidBackground";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { useProfileStore } from "@/store/profileStore";
import { useShallow } from 'zustand/react/shallow';

const ChattingPage = () => {
    const location = useLocation();
    const { basicInfo, isNewUser } = useProfileStore(useShallow(state => ({
        basicInfo: state.basicInfo,
        isNewUser: state.isNewUser
    })));
    const isReturning = location.state?.isReturning || !isNewUser;

    const userName = basicInfo.fullName || "Traveler";
    const welcomeMessage = isReturning
        ? `Welcome back, ${userName}!`
        : `Welcome to TripWise, ${userName}!`;

    return (
        <>
            <LiquidBackground />
            <SiteHeader />

            <div className="relative min-h-screen px-4 py-20">
                {/* Floating glass orbs */}
                <motion.div
                    className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full liquid-glass opacity-10 blur-3xl"
                    animate={{
                        y: [-30, 30, -30],
                        scale: [1, 1.15, 1],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                <div className="site-container relative z-10">
                    <motion.div
                        className="mx-auto max-w-5xl"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Welcome Header */}
                        <div className="ios-glass relative overflow-hidden rounded-[2rem] p-12 md:p-16 shadow-2xl mb-8">
                            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-transparent via-white/10 to-transparent shimmer opacity-40" />

                            <div className="relative text-center space-y-6">
                                <motion.h1
                                    className="font-display text-4xl md:text-5xl lg:text-6xl font-light tracking-tighter leading-tight"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2, duration: 0.8 }}
                                >
                                    {welcomeMessage}
                                </motion.h1>

                                <motion.p
                                    className="mx-auto max-w-2xl text-lg text-muted-foreground/80 leading-relaxed font-light"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4, duration: 0.6 }}
                                >
                                    {isReturning
                                        ? "Continue crafting your perfect journey"
                                        : "We're excited to help you plan your perfect trip"}
                                </motion.p>
                            </div>
                        </div>

                        {/* Chatbot Placeholder */}
                        <motion.div
                            className="ios-glass relative overflow-hidden rounded-[2rem] p-12 md:p-16 shadow-2xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                        >
                            <div className="relative text-center space-y-8">
                                <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 flex items-center justify-center">
                                    <svg
                                        className="w-12 h-12 text-primary"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                        />
                                    </svg>
                                </div>

                                <div className="space-y-4">
                                    <h2 className="font-display text-2xl md:text-3xl font-light tracking-tight">
                                        Your AI Travel Assistant
                                    </h2>
                                    <p className="text-muted-foreground/70 max-w-xl mx-auto leading-relaxed">
                                        This is your central hub where you can chat with your AI travel assistant,
                                        view your itinerary, manage bookings, and get personalized recommendations.
                                    </p>
                                    <p className="text-sm text-muted-foreground/50 italic">
                                        Chatbot integration coming soon...
                                    </p>
                                </div>

                                {/* Placeholder chat interface */}
                                <div className="mt-8 space-y-4 max-w-2xl mx-auto">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex-shrink-0" />
                                        <div className="ios-glass px-4 py-3 rounded-2xl rounded-tl-sm">
                                            <p className="text-sm text-muted-foreground/90">
                                                Hi! I'm your AI travel assistant. How can I help you plan your trip today?
                                            </p>
                                        </div>
                                    </div>

                                    <div className="ios-glass rounded-2xl p-4 flex items-center gap-3">
                                        <input
                                            type="text"
                                            placeholder="Type your message..."
                                            className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/40"
                                            disabled
                                        />
                                        <button
                                            className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center opacity-50 cursor-not-allowed"
                                            disabled
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default ChattingPage;
