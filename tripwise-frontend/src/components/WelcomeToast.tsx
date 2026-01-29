'use client';

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, X, Sparkles, Plane } from 'lucide-react';
import { useProfileStore } from '@/store/profileStore';

export default function WelcomeToast() {
    const location = useLocation();
    const navigate = useNavigate();

    // Don't show on chat page
    // Moved check to before return to satisfy Rules of Hooks (must not return before hooks)

    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [icon, setIcon] = useState<React.ReactNode>(null);

    const { basicInfo, userIdentifier } = useProfileStore();
    const firstName = basicInfo.fullName?.split(' ')[0] || 'Traveler';

    useEffect(() => {
        // Check for navigation state flags
        const state = location.state as { isNew?: boolean; isReturning?: boolean } | null;

        if (state?.isNew) {
            // For new users, show the identifier (phone/email) as requested
            const displayId = userIdentifier || 'Traveler';
            setMessage(`Welcome to TripWise, ${displayId}! 🌟 Let's plan something amazing`);
            setIcon(<Sparkles className="w-5 h-5 text-amber-400" />);
            setIsVisible(true);

            // Clear the state via navigation to prevent loop/re-show
            navigate(location.pathname, { replace: true, state: {} });
        } else if (state?.isReturning) {
            setMessage(`Welcome back, ${firstName}! ✈️ Ready for your next adventure?`);
            setIcon(<Plane className="w-5 h-5 text-blue-400" />);
            setIsVisible(true);

            // Clear the state
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, location.pathname, navigate, userIdentifier, firstName]);

    // Handle auto-dismiss
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    const handleDismiss = () => {
        setIsVisible(false);
    };

    if (location.pathname === '/chat') return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, x: 100, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, x: 20, transition: { duration: 0.3 } }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="fixed top-24 right-4 z-[100] max-w-sm w-full md:w-auto"
                >
                    <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-4 shadow-xl backdrop-blur-xl transition-all hover:bg-white/15">
                        {/* Glass sheen effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />

                        <div className="relative flex items-start gap-4">
                            {/* Icon Bubble */}
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/10 shadow-inner">
                                {icon || <User className="w-5 h-5 text-white" />}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pt-0.5">
                                <p className="text-sm font-medium leading-relaxed text-white/90">
                                    {message}
                                </p>
                            </div>

                            {/* Dismiss Button */}
                            <button
                                onClick={handleDismiss}
                                className="ml-2 -mr-2 -mt-2 rounded-full p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
