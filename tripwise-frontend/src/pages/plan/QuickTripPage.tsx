import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, Sparkles, ArrowRight, Minus, Plus } from 'lucide-react';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { LiquidBackground } from '@/components/ui/LiquidBackground';
import { useProfileStore } from '@/store/profileStore';
import { useWizardStore } from '@/store/wizardStore';
import { InteractiveApi } from '@/lib/api/interactiveApi';
import { ProfileApi } from '@/lib/api/profileApi';
import { useShallow } from 'zustand/react/shallow';

const QuickTripPage: React.FC = () => {
    const navigate = useNavigate();

    const { profileId, basicInfo, destination, dates, budget,
        updateDestinationPreference, updateTravelDates, updateTravelerInfo } =
        useProfileStore(useShallow(state => ({
            profileId: state.profileId,
            basicInfo: state.basicInfo,
            destination: state.destination,
            dates: state.dates,
            budget: state.budget,
            updateDestinationPreference: state.updateDestinationPreference,
            updateTravelDates: state.updateTravelDates,
            updateTravelerInfo: state.updateTravelerInfo,
        })));

    const { resetWizard, setSessionId, setOverviewData, setStep } = useWizardStore(
        useShallow(state => ({
            resetWizard: state.resetWizard,
            setSessionId: state.setSessionId,
            setOverviewData: state.setOverviewData,
            setStep: state.setStep,
        }))
    );

    const [dest, setDest] = useState(destination?.destination || '');
    const [startDate, setStartDate] = useState(dates?.startDate || '');
    const [returnDate, setReturnDate] = useState(dates?.returnDate || '');
    const [adults, setAdults] = useState(basicInfo?.adults || 1);
    const [children, setChildren] = useState(basicInfo?.children || 0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const today = new Date().toISOString().split('T')[0];

    const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

    const duration = startDate && returnDate
        ? Math.max(1, Math.round((new Date(returnDate).getTime() - new Date(startDate).getTime()) / 86400000))
        : 0;

    const handleSubmit = async () => {
        if (!dest.trim()) { setError('Please enter a destination.'); return; }
        if (!startDate) { setError('Please select a departure date.'); return; }
        if (!returnDate) { setError('Please select a return date.'); return; }
        if (new Date(returnDate) <= new Date(startDate)) { setError('Return date must be after departure date.'); return; }
        if (!profileId) { navigate('/plan'); return; }

        setError(null);
        setIsSubmitting(true);

        try {
            // 1. Update store
            updateDestinationPreference({ destination: dest.trim() });
            updateTravelDates({ startDate, returnDate, duration, isFlexible: false });
            updateTravelerInfo({ adults, children });

            // 2. Persist to DB — fire and continue (non-blocking for UX)
            await Promise.all([
                ProfileApi.updateDestination(profileId, {
                    ...destination,
                    destination: dest.trim(),
                }),
                ProfileApi.updateDates(profileId, {
                    startDate,
                    returnDate,
                    duration,
                    isFlexible: false,
                }),
                ProfileApi.updateBasicInfo(profileId, {
                    ...basicInfo,
                    adults,
                    children,
                }),
            ]);

            // 3. Reset wizard chat state so the new trip starts fresh
            resetWizard();

            // 4. Initialize AI session
            const sessionRes = await InteractiveApi.initSession(profileId);
            if (!sessionRes.success || !sessionRes.data) {
                throw new Error(sessionRes.error || 'Failed to start trip planning session.');
            }

            setSessionId(sessionRes.data.id);
            setOverviewData(sessionRes.data.destinationOverview);
            setStep('OVERVIEW');

            navigate('/chat');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative min-h-screen">
            <LiquidBackground />
            <SiteHeader />

            <main className="relative z-10 flex items-center justify-center min-h-screen px-4 pt-20 pb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-xl"
                >
                    {/* Header */}
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ scale: 0, rotate: -15 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', duration: 0.8, delay: 0.1 }}
                            className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 items-center justify-center mb-5 border border-white/10 backdrop-blur-md"
                        >
                            <Sparkles className="w-7 h-7 text-primary" />
                        </motion.div>
                        <h1 className="font-display text-4xl font-light tracking-tight text-foreground mb-2">
                            Where to next,{' '}
                            <span className="font-handwriting italic text-primary">
                                {basicInfo?.fullName?.split(' ')[0] || 'Traveler'}
                            </span>
                            ?
                        </h1>
                        <p className="text-sm text-muted-foreground/70">
                            Your profile is saved. Just tell us the trip details.
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="glass-card-material rounded-3xl p-7 border border-white/10 backdrop-blur-xl space-y-6">

                        {/* Destination */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                                <MapPin className="w-3.5 h-3.5" /> Destination
                            </label>
                            <input
                                type="text"
                                value={dest}
                                onChange={e => setDest(e.target.value)}
                                placeholder="e.g. Goa, Paris, Manali…"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/40 focus:bg-white/8 transition-colors"
                            />
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                                    <Calendar className="w-3.5 h-3.5" /> Departure
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    min={today}
                                    onChange={e => setStartDate(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-primary/40 transition-colors [color-scheme:dark]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                                    <Calendar className="w-3.5 h-3.5" /> Return
                                </label>
                                <input
                                    type="date"
                                    value={returnDate}
                                    min={startDate || today}
                                    onChange={e => setReturnDate(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-primary/40 transition-colors [color-scheme:dark]"
                                />
                            </div>
                        </div>

                        {duration > 0 && (
                            <p className="text-xs text-primary/70 text-center -mt-2">
                                {duration} night{duration !== 1 ? 's' : ''}
                            </p>
                        )}

                        {/* Travelers */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                                <Users className="w-3.5 h-3.5" /> Travelers
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                {/* Adults */}
                                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Adults</p>
                                        <p className="text-lg font-display font-medium text-foreground">{adults}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setAdults(clamp(adults - 1, 1, 10))}
                                            className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <button
                                            onClick={() => setAdults(clamp(adults + 1, 1, 10))}
                                            className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                                {/* Children */}
                                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Children</p>
                                        <p className="text-lg font-display font-medium text-foreground">{children}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setChildren(clamp(children - 1, 0, 10))}
                                            className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <button
                                            onClick={() => setChildren(clamp(children + 1, 0, 10))}
                                            className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm text-red-400 text-center"
                            >
                                {error}
                            </motion.p>
                        )}

                        {/* Submit */}
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full h-14 rounded-2xl bg-white text-black text-sm font-bold uppercase tracking-widest shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-all hover:bg-white/90 hover:scale-[1.02] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.4)] flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                    Planning your trip…
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 text-amber-500" />
                                    Start Planning
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>

                        <p className="text-center text-[10px] text-muted-foreground/40 font-bold uppercase tracking-widest">
                            Your travel preferences are pre-loaded from your profile
                        </p>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default QuickTripPage;
