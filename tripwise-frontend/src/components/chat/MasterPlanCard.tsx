import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Plane, Train, Bus, Car, Utensils, Camera, ShoppingBag,
    Mountain, MapPin, BedDouble, Sparkles, IndianRupee, Calendar,
    ChevronRight, Star, LayoutList, BarChart3, RotateCcw, Clock, Compass
} from 'lucide-react';
import { parseMasterPlan, ParsedPlan, Day, Activity, BudgetItem, StayInfo } from '@/types/masterPlan';

// ─── Constants & Styles ──────────────────────────────────────────────────────

const BUDGET_COLORS = [
    'text-blue-500', 'text-amber-500', 'text-violet-500', 'text-emerald-500', 'text-rose-500'
];

const BUDGET_STROKE_COLORS = [
    '#3b82f6', '#f59e0b', '#8b5cf6', '#10b981', '#f43f5e'
];

const BUDGET_BG_COLORS = [
    'bg-blue-500', 'bg-amber-500', 'bg-violet-500', 'bg-emerald-500', 'bg-rose-500'
];

const BUDGET_GLOW_COLORS = [
    'shadow-blue-500/30', 'shadow-amber-500/30', 'shadow-violet-500/30', 'shadow-emerald-500/30', 'shadow-rose-500/30'
];

const TIME_OF_DAY_CONFIG: Record<string, { label: string; color: string; dot: string; border: string; bg: string; pill: string }> = {
    Morning:   { label: 'Morning',   color: 'text-sky-600',    dot: 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]',     border: 'border-l-sky-400',    bg: 'bg-sky-500/5',    pill: 'bg-sky-100 text-sky-700 border-sky-200' },
    Afternoon: { label: 'Afternoon', color: 'text-amber-600',  dot: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]',   border: 'border-l-amber-400',  bg: 'bg-amber-500/5',  pill: 'bg-amber-100 text-amber-700 border-amber-200' },
    Evening:   { label: 'Evening',   color: 'text-violet-600', dot: 'bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.5)]', border: 'border-l-violet-400', bg: 'bg-violet-500/5', pill: 'bg-violet-100 text-violet-700 border-violet-200' },
};

type ActiveTab = 'itinerary' | 'budget';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function activityIcon(type: string) {
    const cls = 'w-3.5 h-3.5';
    switch (type?.toLowerCase()) {
        case 'flight':      return <Plane       className={cls} />;
        case 'train':       return <Train       className={cls} />;
        case 'bus':         return <Bus         className={cls} />;
        case 'transport':   return <Car         className={cls} />;
        case 'food':        return <Utensils    className={cls} />;
        case 'sightseeing': return <Camera      className={cls} />;
        case 'shopping':    return <ShoppingBag className={cls} />;
        case 'nature':      return <Mountain    className={cls} />;
        default:            return <Compass      className={cls} />;
    }
}

function parseCostNum(cost: string): number {
    if (!cost) return 0;
    const n = parseFloat(cost.replace(/[₹,\s/night]/g, '').replace(/[^0-9.]/g, ''));
    return isNaN(n) ? 0 : n;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const TripHero = ({ plan }: { plan: ParsedPlan }) => {
    const cities = [...new Set(plan.itinerary.map(d => d.city).filter(Boolean))];
    const totalActivities = plan.itinerary.reduce(
        (acc, d) => acc + d.activities.filter(a => !a.isTransit).length, 0
    );

    return (
        <div className="relative px-6 pt-6 pb-5 overflow-hidden">
            {/* TripWise light-theme background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-indigo-50/40" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.07)_0%,_transparent_65%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(16,185,129,0.06)_0%,_transparent_65%)]" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-200/60 to-transparent" />
            
            <div className="relative space-y-3">
                {/* Label pill */}
                <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-primary bg-primary/8 border border-primary/15 px-2.5 py-1 rounded-full">
                        <Sparkles className="w-2.5 h-2.5" />
                        AI Itinerary
                    </span>
                </div>

                {/* Trip Title */}
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 leading-tight tracking-tight">
                    {plan.tripOverview.title}
                </h2>

                {/* Destination */}
                <p className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                    <MapPin className="w-3 h-3 text-indigo-500" />
                    {cities[0] || plan.tripOverview.destination}
                </p>

                {/* Stat chips row */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-600 shadow-sm">
                        <Calendar className="w-2.5 h-2.5 text-sky-500" />
                        {plan.itinerary.length} Days
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-600 shadow-sm">
                        <Camera className="w-2.5 h-2.5 text-violet-500" />
                        {totalActivities} Activities
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-sm">
                        <IndianRupee className="w-2.5 h-2.5" />
                        {(plan.totalCost?.replace('₹', '') || plan.tripOverview?.totalBudget?.replace('₹', '') || '—')}
                    </span>
                </div>
            </div>
        </div>
    );
};

const TabBar = ({ active, onChange }: { active: ActiveTab; onChange: (t: ActiveTab) => void }) => (
    <div className="flex border-b border-slate-200/50 bg-slate-50/80 backdrop-blur-sm">
        {(['itinerary', 'budget'] as ActiveTab[]).map(tab => (
            <button
                key={tab}
                onClick={() => onChange(tab)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-bold uppercase tracking-widest transition-all relative ${
                    active === tab ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
                }`}
            >
                {tab === 'itinerary'
                    ? <LayoutList className="w-3.5 h-3.5" />
                    : <BarChart3  className="w-3.5 h-3.5" />
                }
                {tab}
                {active === tab && (
                    <motion.div
                        layoutId="plan-tab-indicator-chat"
                        className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-t-full"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                )}
            </button>
        ))}
    </div>
);

const DayPillNav = ({
    days, activeDay, onSelect,
}: { days: Day[]; activeDay: number; onSelect: (d: number) => void }) => (
    <div className="sticky top-0 z-20 flex gap-2 px-5 py-3 border-b border-slate-200/50 bg-white/80 backdrop-blur-md overflow-x-auto scrollbar-none">
        {days.map(d => (
            <button
                key={d.day}
                onClick={() => onSelect(d.day)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-200 border ${
                    activeDay === d.day
                        ? 'bg-gradient-to-r from-slate-800 to-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/20'
                        : 'bg-white/60 border-slate-200 text-slate-500 hover:bg-white hover:border-slate-300'
                }`}
            >
                Day {d.day}
            </button>
        ))}
    </div>
);

const DayHeroBanner = ({ day }: { day: Day }) => (
    <div className="px-5 py-4 bg-gradient-to-r from-indigo-50/70 via-white/40 to-transparent border-b border-slate-200/40">
        <div className="flex items-start justify-between gap-4">
            <div>
                <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-indigo-500">
                    Day {day.day}{day.date ? ` · ${day.date}` : ''}
                </span>
                <h4 className="text-sm font-bold text-slate-800 mt-0.5 leading-tight">
                    {day.theme}
                </h4>
                {day.city && (
                    <p className="flex items-center gap-1 text-[10px] text-slate-500 mt-1">
                        <MapPin className="w-3 h-3 text-indigo-400" /> {day.city}
                    </p>
                )}
            </div>
            {day.dayBudget && (
                <span className="shrink-0 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1">
                    {day.dayBudget}
                </span>
            )}
        </div>
    </div>
);

const TransitCard = ({ activity }: { activity: Activity }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-5 my-3 rounded-2xl border border-dashed border-indigo-300/60 bg-gradient-to-br from-indigo-50/80 to-violet-50/40 p-4 relative overflow-hidden"
    >
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-200/20 rounded-full blur-2xl -translate-y-6 translate-x-6" />
        <div className="flex items-center gap-2 mb-3 relative">
            <div className="w-7 h-7 rounded-xl bg-white border border-indigo-200 text-indigo-600 flex items-center justify-center shadow-sm">
                {activity.type === 'flight' ? <Plane className="w-4 h-4" /> : activity.type === 'train' ? <Train className="w-4 h-4" /> : <Car className="w-4 h-4" />}
            </div>
            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-indigo-700">
                {activity.type === 'flight' ? 'Transit Flight' : activity.type === 'train' ? 'Transit Train' : 'Transit Leg'}
            </span>
            <span className="ml-auto text-[10px] font-mono text-slate-500 font-semibold bg-white/70 border border-slate-200 px-2 py-0.5 rounded-lg">{activity.travelTime || activity.duration}</span>
        </div>
        <div className="flex items-center gap-3 mb-3 relative">
            <div className="min-w-[50px] text-center">
                <p className="text-sm font-bold text-slate-800 leading-tight">{activity.from || 'Origin'}</p>
                <p className="text-[9px] text-slate-400 mt-0.5">{activity.time}</p>
            </div>
            <div className="flex-1 flex items-center relative">
                <div className="w-full border-t border-dashed border-indigo-300/70" />
                <div className="absolute left-1/2 transform -translate-x-1/2 -top-2.5 w-5 h-5 bg-white border border-indigo-200 rounded-full flex items-center justify-center text-indigo-500 shadow-sm">
                    {activity.type === 'flight' ? <Plane className="w-3 h-3 rotate-90" /> : <Train className="w-3 h-3" />}
                </div>
            </div>
            <div className="min-w-[50px] text-center">
                <p className="text-sm font-bold text-slate-800 leading-tight">{activity.to || 'Destination'}</p>
                <p className="text-[9px] text-slate-400 mt-0.5">~{activity.travelTime || activity.duration}</p>
            </div>
        </div>
        <div className="flex items-center justify-between pt-2.5 border-t border-indigo-200/40 text-[10px] text-slate-500">
            <p className="truncate max-w-[70%] font-medium">{activity.title}</p>
            <span className="font-bold text-slate-800 font-mono">{activity.cost}</span>
        </div>
    </motion.div>
);

const ActivityCard = ({ activity, index }: { activity: Activity; index: number }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const tod = TIME_OF_DAY_CONFIG[activity.timeOfDay] || TIME_OF_DAY_CONFIG.Morning;
    
    return (
        <motion.div
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.04 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="mx-5 my-2.5"
        >
            <div className={`rounded-xl border border-slate-200/50 border-l-2 ${tod.border} bg-white/70 p-3 hover:bg-white hover:shadow-md hover:border-slate-300 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.06)] transition-all cursor-pointer group select-none relative`}>
                <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${tod.pill}`}>
                            {activity.time || activity.timeOfDay}
                        </span>
                        {activity.duration && (
                            <span className="text-[8px] text-slate-400 bg-slate-100 border border-slate-200/60 px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold">
                                {activity.duration}
                            </span>
                        )}
                    </div>
                    <span className="text-xs font-bold text-slate-800 font-mono shrink-0">{activity.cost}</span>
                </div>
                
                <div className="flex items-start gap-2.5">
                    <div className={`shrink-0 w-7 h-7 rounded-lg ${tod.bg} border border-slate-200/60 flex items-center justify-center mt-0.5 group-hover:scale-105 transition-transform`}>
                        <span className={tod.color}>{activityIcon(activity.type)}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors">{activity.title}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" /> {activity.placeName}</p>
                        
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                    animate={{ height: 'auto', opacity: 1, marginTop: 8 }}
                                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                    className="overflow-hidden border-t border-slate-200/50 pt-2 text-[10px] text-slate-500 space-y-2 leading-relaxed"
                                >
                                    {activity.description && <p className="text-slate-700 font-normal bg-slate-50 p-2.5 rounded-lg border border-slate-100">{activity.description}</p>}
                                    {activity.address && <p><strong className="text-slate-800">Address:</strong> {activity.address}</p>}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const StayCard = ({ stay }: { stay: StayInfo }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-5 mt-2 mb-4 rounded-xl border border-amber-300/40 bg-gradient-to-br from-amber-50/80 to-orange-50/30 p-4 relative overflow-hidden"
    >
        <div className="absolute top-0 right-0 w-20 h-20 bg-amber-200/20 rounded-full blur-2xl -translate-y-4 translate-x-4" />
        <div className="flex items-start justify-between gap-3 relative">
            <div className="flex gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 border border-amber-300/50 shadow-sm">
                    <BedDouble className="w-4 h-4 text-amber-500" />
                </div>
                <div className="min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-amber-600 font-mono">Tonight's Stay</p>
                    <p className="text-xs font-bold text-slate-800 leading-tight mt-0.5">{stay.name}</p>
                    {stay.address && (
                        <p className="text-[10px] text-slate-500 mt-0.5 truncate">{stay.address}</p>
                    )}
                    <div className="flex items-center gap-1.5 mt-1.5">
                        {stay.stars && stay.stars > 0 && (
                            <div className="flex">
                                {Array.from({ length: stay.stars }).map((_, i) => (
                                    <Star key={i} className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                                ))}
                            </div>
                        )}
                        {stay.checkIn && (
                            <span className="text-[9px] text-amber-600 font-semibold uppercase bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded-full">Check-in {stay.checkIn}</span>
                        )}
                    </div>
                </div>
            </div>
            <div className="shrink-0 text-right">
                <p className="text-xs font-bold text-slate-800 font-mono">{stay.cost}</p>
                <span className="inline-block text-[8px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100 border border-emerald-200 rounded-full px-1.5 py-0.5 mt-1.5">
                    Confirmed
                </span>
            </div>
        </div>
    </motion.div>
);

const BudgetTab = ({ breakdown, total }: { breakdown: BudgetItem[]; total: string }) => {
    const nums = breakdown.map(b => parseCostNum(b.cost));
    const sum = nums.reduce((a, b) => a + b, 0) || 1;

    let strokeOffset = 0;
    const donutSegments = breakdown.map((item, idx) => {
        const cost = parseCostNum(item.cost);
        const percentage = cost / sum;
        const dashOffset = 188.4 - (percentage * 188.4) + strokeOffset;
        strokeOffset -= (percentage * 188.4);
        return { ...item, percentage, dashOffset };
    });

    return (
        <div className="p-5 space-y-5">
            {/* Total Budget Hero */}
            <div className="relative rounded-2xl overflow-hidden p-5 text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.3)_0%,_transparent_70%)]" />
                <div className="relative">
                    <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-400">Grand Trip Budget</p>
                    <p className="text-3xl font-display font-bold text-white mt-1">{total}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{breakdown.length} spending categories</p>
                </div>
            </div>

            {/* Premium Donut Chart */}
            <div className="flex items-center justify-center py-2 relative">
                <svg width="120" height="120" viewBox="0 0 100 100" className="transform -rotate-90 drop-shadow-xl">
                    <circle cx="50" cy="50" r="30" fill="transparent" stroke="#f1f5f9" strokeWidth="10" />
                    {donutSegments.map((seg, idx) => (
                        <circle
                            key={idx}
                            cx="50"
                            cy="50"
                            r="30"
                            fill="transparent"
                            stroke={BUDGET_STROKE_COLORS[idx % BUDGET_STROKE_COLORS.length]}
                            strokeWidth="10"
                            strokeDasharray="188.4"
                            strokeDashoffset={seg.dashOffset}
                            strokeLinecap="round"
                            className="transition-all duration-1000"
                        />
                    ))}
                </svg>
                <div className="absolute text-center flex flex-col items-center">
                    <span className="text-[8px] font-bold uppercase text-slate-400 tracking-widest">Split</span>
                    <span className="text-xs font-bold text-slate-800 mt-0.5">{breakdown.length} cats</span>
                </div>
            </div>

            {/* Category breakdown */}
            <div className="space-y-2.5">
                {donutSegments.map((item, i) => {
                    const textColor = BUDGET_COLORS[i % BUDGET_COLORS.length];
                    const bgColor = BUDGET_BG_COLORS[i % BUDGET_BG_COLORS.length];
                    const glowColor = BUDGET_GLOW_COLORS[i % BUDGET_GLOW_COLORS.length];
                    const pct = Math.round(item.percentage * 100);

                    return (
                        <div key={i} className={`bg-white border border-slate-200/70 rounded-xl p-3 space-y-2 hover:shadow-md ${glowColor} hover:shadow-sm transition-all duration-200`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-2.5 h-2.5 rounded-full ${bgColor} shrink-0 shadow-[0_0_6px_rgba(0,0,0,0.15)]`} />
                                <span className="text-xs text-slate-700 flex-1 font-semibold">{item.category}</span>
                                <div className="text-right flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-slate-900 font-mono">{item.cost}</span>
                                    <span className={`text-[9px] font-bold ${textColor}`}>{pct}%</span>
                                </div>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <motion.div
                                    className={`h-full rounded-full ${bgColor}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pct}%` }}
                                    transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                                />
                            </div>
                        </div>
                    );
                })}
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
    const [activeTab, setActiveTab] = useState<ActiveTab>('itinerary');
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
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center text-xs text-red-500">
                Could not render the itinerary. Please try again.
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="w-full rounded-3xl border border-slate-200/50 overflow-hidden shadow-xl shadow-slate-900/8 text-slate-800 bg-white"
        >
            {/* Hero */}
            <TripHero plan={parsed} />

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            {/* Tabs */}
            <TabBar active={activeTab} onChange={setActiveTab} />

            {/* Tab content */}
            <AnimatePresence mode="wait">
                {activeTab === 'itinerary' ? (
                    <motion.div
                        key="itinerary"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div ref={containerRef} className="max-h-[52vh] overflow-y-auto custom-scrollbar relative bg-white">
                            <DayPillNav days={parsed.itinerary} activeDay={activeDay} onSelect={scrollToDay} />

                            {parsed.itinerary.map((day, i) => (
                                <div key={day.day} ref={el => { dayRefs.current[i] = el; }}>
                                    <DayHeroBanner day={day} />
                                    {day.activities.map((activity, j) =>
                                        activity.isTransit
                                            ? <TransitCard key={j} activity={activity} />
                                            : <ActivityCard key={j} activity={activity} index={j} />
                                    )}
                                    {day.stay && <StayCard stay={day.stay} />}
                                </div>
                            ))}
                            <div className="h-4" />
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="budget"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="max-h-[52vh] overflow-y-auto custom-scrollbar bg-white"
                    >
                        {parsed.budgetBreakdown?.length > 0 ? (
                            <BudgetTab
                                breakdown={parsed.budgetBreakdown}
                                total={parsed.totalCost || parsed.tripOverview?.totalBudget || ''}
                            />
                        ) : (
                            <div className="p-8 text-center text-xs text-slate-400">
                                No budget breakdown available.
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* CTA Footer */}
            <div className="px-5 py-4 border-t border-slate-200/50 bg-slate-50/60 flex items-center gap-3">
                {onPlanAnother && (
                    <button
                        onClick={onPlanAnother}
                        title="Change Plan"
                        className="w-10 h-10 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700 hover:border-slate-300 transition-all flex items-center justify-center shrink-0"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                )}
                <button
                    onClick={handleBook}
                    className="flex-1 h-11 rounded-xl text-white text-[11px] font-bold uppercase tracking-widest
                               shadow-lg transition-all flex items-center justify-center gap-2 relative overflow-hidden group"
                    style={{ background: 'linear-gradient(135deg, hsl(222,47%,11%) 0%, hsl(225,50%,18%) 50%, hsl(222,47%,11%) 100%)' }}
                >
                    {/* Shimmer sweep */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                    {/* Glow ring on hover */}
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[inset_0_0_20px_rgba(99,102,241,0.3)]" />
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 relative z-10 animate-pulse" />
                    <span className="relative z-10">Book This Trip</span>
                    <ChevronRight className="w-4 h-4 relative z-10 group-hover:translate-x-0.5 transition-transform" />
                </button>
            </div>
        </motion.div>
    );
};

export default MasterPlanCard;
