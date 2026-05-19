import React, { useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Plane, Train, Bus, Car, Utensils, Camera, ShoppingBag,
    Mountain, MapPin, BedDouble, Sparkles, IndianRupee, Calendar,
    ChevronRight, Star
} from 'lucide-react';
import { parseMasterPlan, extractTotalCostNumber, ParsedPlan, Day, Activity, BudgetItem } from '@/types/masterPlan';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const BUDGET_COLORS = [
    'bg-blue-500', 'bg-amber-500', 'bg-violet-500',
    'bg-emerald-500', 'bg-pink-500', 'bg-orange-500', 'bg-cyan-500',
];

const TIME_OF_DAY_STYLES: Record<string, { label: string; color: string; dot: string }> = {
    Morning:   { label: 'Morning',   color: 'text-sky-400',    dot: 'bg-sky-400' },
    Afternoon: { label: 'Afternoon', color: 'text-amber-400',  dot: 'bg-amber-400' },
    Evening:   { label: 'Evening',   color: 'text-violet-400', dot: 'bg-violet-400' },
};

function activityIcon(type: string) {
    const cls = 'w-4 h-4';
    switch (type) {
        case 'flight':     return <Plane      className={cls} />;
        case 'train':      return <Train      className={cls} />;
        case 'bus':        return <Bus        className={cls} />;
        case 'transport':  return <Car        className={cls} />;
        case 'food':       return <Utensils   className={cls} />;
        case 'sightseeing':return <Camera     className={cls} />;
        case 'shopping':   return <ShoppingBag className={cls} />;
        case 'nature':     return <Mountain   className={cls} />;
        default:           return <MapPin     className={cls} />;
    }
}

function transitIcon(type: string) {
    const cls = 'w-5 h-5';
    switch (type) {
        case 'flight': return <Plane  className={cls} />;
        case 'train':  return <Train  className={cls} />;
        case 'bus':    return <Bus    className={cls} />;
        default:       return <Car    className={cls} />;
    }
}

function parseCostNum(cost: string): number {
    if (!cost) return 0;
    const n = parseFloat(cost.replace(/[₹,\s]/g, '').replace(/[^0-9.]/g, ''));
    return isNaN(n) ? 0 : n;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const TripStatsStrip = ({ plan }: { plan: ParsedPlan }) => {
    const totalActivities = plan.itinerary.reduce(
        (acc, d) => acc + d.activities.filter(a => !a.isTransit).length, 0
    );
    const cities = [...new Set(plan.itinerary.map(d => d.city).filter(Boolean))];

    return (
        <div className="px-5 py-4 border-b border-white/10">
            <h3 className="font-display text-xl font-medium text-foreground mb-2">
                {plan.tripOverview.title}
            </h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground/70 font-medium">
                <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {plan.itinerary.length} Days
                </span>
                <span className="text-white/20">·</span>
                <span>{cities.length} {cities.length === 1 ? 'City' : 'Cities'}</span>
                <span className="text-white/20">·</span>
                <span>{totalActivities} Activities</span>
                <span className="text-white/20">·</span>
                <span className="flex items-center gap-0.5 text-primary font-bold">
                    <IndianRupee className="w-3 h-3" />
                    {plan.totalCost?.replace('₹', '') || plan.tripOverview?.totalBudget?.replace('₹', '')}
                </span>
            </div>
        </div>
    );
};

const DayPillNav = ({
    days, activeDay, onSelect,
}: { days: Day[]; activeDay: number; onSelect: (d: number) => void }) => (
    <div className="sticky top-0 z-20 flex gap-2 px-5 py-3 border-b border-white/10 bg-black/60 backdrop-blur-xl overflow-x-auto scrollbar-none">
        {days.map(d => (
            <button
                key={d.day}
                onClick={() => onSelect(d.day)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200
                    ${activeDay === d.day
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                        : 'bg-white/5 text-muted-foreground hover:bg-white/10'}`}
            >
                Day {d.day}
            </button>
        ))}
    </div>
);

const DayHeroBanner = ({ day }: { day: Day }) => (
    <div className="relative px-5 py-5 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-white/5">
        <div className="flex items-start justify-between">
            <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/60">
                    Day {day.day} {day.date ? `· ${day.date}` : ''}
                </span>
                <h4 className="font-display text-lg font-medium text-foreground mt-0.5 leading-tight">
                    {day.theme}
                </h4>
                {day.city && (
                    <p className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <MapPin className="w-3 h-3" /> {day.city}
                    </p>
                )}
            </div>
            {day.dayBudget && (
                <span className="shrink-0 text-xs font-bold text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
                    {day.dayBudget}
                </span>
            )}
        </div>
    </div>
);

const TransitCard = ({ activity }: { activity: Activity }) => (
    <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-5 my-3 rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4"
    >
        <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                {transitIcon(activity.type)}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary/70">
                {activity.type === 'flight' ? 'Flight' : activity.type === 'train' ? 'Train' : 'Transit'}
            </span>
            <span className="ml-auto text-xs text-muted-foreground">{activity.travelTime || activity.duration}</span>
        </div>

        <div className="flex items-center gap-3 mb-3">
            <div className="text-center min-w-[60px]">
                <p className="font-display text-base font-bold text-foreground">{activity.from}</p>
                <p className="text-xs text-muted-foreground/60 mt-0.5">{activity.time}</p>
            </div>
            <div className="flex-1 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full border border-primary/50" />
                <div className="flex-1 border-t border-dashed border-primary/30" />
                <div className="text-primary opacity-70">{transitIcon(activity.type)}</div>
                <div className="flex-1 border-t border-dashed border-primary/30" />
                <div className="w-2 h-2 rounded-full border border-primary/50" />
            </div>
            <div className="text-center min-w-[60px]">
                <p className="font-display text-base font-bold text-foreground">{activity.to}</p>
                <p className="text-xs text-muted-foreground/60 mt-0.5">~{activity.travelTime || activity.duration}</p>
            </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <p className="text-xs text-muted-foreground/70 truncate max-w-[70%]">{activity.title}</p>
            <span className="text-xs font-bold text-foreground">{activity.cost}</span>
        </div>
    </motion.div>
);

const ActivityCard = ({ activity, index }: { activity: Activity; index: number }) => {
    const tod = TIME_OF_DAY_STYLES[activity.timeOfDay] || TIME_OF_DAY_STYLES.Morning;

    return (
        <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.04 }}
            className="mx-5 my-2 flex gap-3"
        >
            {/* Time spine */}
            <div className="flex flex-col items-center pt-1 shrink-0">
                <div className={`w-2 h-2 rounded-full ${tod.dot} ring-2 ring-black/30`} />
                <div className="w-px flex-1 bg-white/10 mt-1" />
            </div>

            {/* Card */}
            <div className="flex-1 rounded-xl border border-white/8 bg-white/[0.02] p-3 mb-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${tod.color}`}>
                            {activity.time || tod.label}
                        </span>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-foreground/80">{activity.cost}</span>
                </div>

                <div className="flex items-start gap-2">
                    <div className={`shrink-0 w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground mt-0.5`}>
                        {activityIcon(activity.type)}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground leading-tight">{activity.title}</p>
                        <p className="text-xs text-muted-foreground/60 mt-0.5">{activity.placeName}</p>
                        {activity.description && (
                            <p className="text-xs text-muted-foreground/70 mt-1.5 leading-relaxed">
                                {activity.description}
                            </p>
                        )}
                        {activity.duration && (
                            <p className="text-[10px] text-muted-foreground/40 font-medium mt-1.5 uppercase tracking-wider">
                                ~{activity.duration}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const StayCard = ({ stay }: { stay: Day['stay'] }) => (
    <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-5 mt-2 mb-5 rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-transparent p-4"
    >
        <div className="flex items-start justify-between gap-2">
            <div className="flex gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20">
                    <BedDouble className="w-4 h-4 text-amber-400" />
                </div>
                <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-400/70 mb-0.5">
                        Tonight's Stay
                    </p>
                    <p className="text-sm font-semibold text-foreground leading-tight">{stay.name}</p>
                    {stay.address && (
                        <p className="text-xs text-muted-foreground/60 mt-0.5 truncate">{stay.address}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1.5">
                        {stay.stars && stay.stars > 0 && (
                            <div className="flex">
                                {Array.from({ length: Math.min(stay.stars, 5) }).map((_, i) => (
                                    <Star key={i} className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                                ))}
                            </div>
                        )}
                        {stay.checkIn && (
                            <span className="text-[10px] text-muted-foreground/50">Check-in {stay.checkIn}</span>
                        )}
                    </div>
                </div>
            </div>
            <div className="shrink-0 text-right">
                <p className="text-sm font-bold text-foreground">{stay.cost}</p>
                <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded px-1.5 py-0.5 mt-1">
                    Bookable
                </span>
            </div>
        </div>
    </motion.div>
);

const BudgetChart = ({ breakdown, total }: { breakdown: BudgetItem[]; total: string }) => {
    const nums = breakdown.map(b => parseCostNum(b.cost));
    const sum = nums.reduce((a, b) => a + b, 0) || 1;

    return (
        <div className="mx-5 my-5 p-4 rounded-2xl border border-white/10 bg-white/[0.02]">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground/50 mb-3">
                Budget Breakdown
            </p>

            {/* Bar */}
            <div className="flex rounded-full overflow-hidden h-3 mb-4 gap-0.5">
                {breakdown.map((item, i) => (
                    <div
                        key={i}
                        className={`${BUDGET_COLORS[i % BUDGET_COLORS.length]} transition-all`}
                        style={{ width: `${(nums[i] / sum) * 100}%` }}
                    />
                ))}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {breakdown.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${BUDGET_COLORS[i % BUDGET_COLORS.length]} shrink-0`} />
                            <span className="text-xs text-muted-foreground/60 truncate">{item.category}</span>
                        </div>
                        <span className="text-xs font-medium text-foreground/80 ml-2 shrink-0">{item.cost}</span>
                    </div>
                ))}
            </div>

            <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50">Total</span>
                <span className="text-base font-display font-bold text-foreground">{total}</span>
            </div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

interface MasterPlanCardProps {
    plan: string | ParsedPlan;
    onPlanAnother?: () => void;
}

const MasterPlanCard: React.FC<MasterPlanCardProps> = ({ plan, onPlanAnother }) => {
    const navigate = useNavigate();
    const [activeDay, setActiveDay] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);
    const dayRefs = useRef<(HTMLDivElement | null)[]>([]);

    const parsed = useMemo<ParsedPlan | null>(() => {
        if (!plan) return null;
        if (typeof plan === 'string') return parseMasterPlan(plan);
        if (typeof plan === 'object' && 'itinerary' in plan) return plan as ParsedPlan;
        return null;
    }, [plan]);

    const scrollToDay = (dayNum: number) => {
        setActiveDay(dayNum);
        const el = dayRefs.current[dayNum - 1];
        const container = containerRef.current;
        if (el && container) {
            container.scrollTo({ top: el.offsetTop - 56, behavior: 'smooth' });
        }
    };

    const handleBook = () => {
        navigate('/booking/summary', { state: { plan: parsed } });
    };

    if (!parsed || !parsed.itinerary?.length) {
        return (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center text-sm text-red-300">
                Could not render the itinerary. Please try again.
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/30"
        >
            {/* Trip header */}
            <TripStatsStrip plan={parsed} />

            {/* Scrollable body */}
            <div ref={containerRef} className="max-h-[72vh] overflow-y-auto">

                {/* Day pill nav — sticky inside the scroll container */}
                <DayPillNav days={parsed.itinerary} activeDay={activeDay} onSelect={scrollToDay} />

                {/* Day sections */}
                {parsed.itinerary.map((day, i) => (
                    <div
                        key={day.day}
                        ref={el => { dayRefs.current[i] = el; }}
                    >
                        <DayHeroBanner day={day} />

                        {day.activities.map((activity, j) =>
                            activity.isTransit
                                ? <TransitCard key={j} activity={activity} />
                                : <ActivityCard key={j} activity={activity} index={j} />
                        )}

                        {day.stay && <StayCard stay={day.stay} />}
                    </div>
                ))}

                {/* Budget chart */}
                {parsed.budgetBreakdown?.length > 0 && (
                    <BudgetChart breakdown={parsed.budgetBreakdown} total={parsed.totalCost || parsed.tripOverview?.totalBudget || ''} />
                )}

                {/* Bottom padding */}
                <div className="h-4" />
            </div>

            {/* CTA */}
            <div className="px-5 py-4 border-t border-white/10 bg-black/20 flex items-center gap-3">
                {onPlanAnother && (
                    <button
                        onClick={onPlanAnother}
                        className="flex-1 py-3 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:bg-white/5 transition-colors"
                    >
                        Change Plan
                    </button>
                )}
                <button
                    onClick={handleBook}
                    className="flex-1 h-12 rounded-xl bg-white text-black text-sm font-bold uppercase tracking-widest shadow-[0_0_30px_-8px_rgba(255,255,255,0.3)] hover:bg-white/90 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Book This Trip
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
};

export default MasterPlanCard;
