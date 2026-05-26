import React, { useState, useMemo } from 'react';
import { useWizardStore } from '@/store/wizardStore';
import ReactMarkdown from 'react-markdown';
import { 
    Download, Home, MapPin, IndianRupee, Calendar, Clock, 
    BedDouble, Plane, Train, Bus, Car, Utensils, Camera, 
    ShoppingBag, Mountain, Star, ArrowRight, Printer, Info, CheckCircle, Compass, Layers, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { parseMasterPlan, ParsedPlan, Day, Activity, StayInfo, BudgetItem } from '@/types/masterPlan';

// ─── Constants & Styles ──────────────────────────────────────────────────────

const BUDGET_STROKE_COLORS = [
    '#6366f1', '#f59e0b', '#10b981', '#f43f5e', '#8b5cf6'
];

const BUDGET_COLORS = [
    'text-indigo-500', 'text-amber-500', 'text-emerald-500', 'text-rose-500', 'text-violet-500'
];

const BUDGET_BG_COLORS = [
    'bg-indigo-500', 'bg-amber-500', 'bg-emerald-500', 'bg-rose-500', 'bg-violet-500'
];

const TIME_OF_DAY_CONFIG: Record<string, { label: string; color: string; dot: string; border: string; bg: string; pill: string }> = {
    Morning:   { label: 'Morning',   color: 'text-sky-600',    dot: 'bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.5)]',     border: 'border-l-sky-400',    bg: 'from-sky-50/60',    pill: 'bg-sky-100 text-sky-700 border-sky-200' },
    Afternoon: { label: 'Afternoon', color: 'text-amber-600',  dot: 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]',   border: 'border-l-amber-400',  bg: 'from-amber-50/60',  pill: 'bg-amber-100 text-amber-700 border-amber-200' },
    Evening:   { label: 'Evening',   color: 'text-violet-600', dot: 'bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.5)]', border: 'border-l-violet-400', bg: 'from-violet-50/60', pill: 'bg-violet-100 text-violet-700 border-violet-200' },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function activityIcon(type: string) {
    const cls = 'w-4 h-4';
    switch (type?.toLowerCase()) {
        case 'flight':      return <Plane       className={cls} />;
        case 'train':       return <Train       className={cls} />;
        case 'bus':         return <Bus         className={cls} />;
        case 'transport':   return <Car         className={cls} />;
        case 'food':        return <Utensils    className={cls} />;
        case 'sightseeing': return <Camera      className={cls} />;
        case 'shopping':    return <ShoppingBag className={cls} />;
        case 'nature':      return <Mountain    className={cls} />;
        default:            return <Compass     className={cls} />;
    }
}

function parseCostNum(cost: string): number {
    if (!cost) return 0;
    const n = parseFloat(cost.replace(/[₹,\s/night]/g, '').replace(/[^0-9.]/g, ''));
    return isNaN(n) ? 0 : n;
}

export default function MasterPlanView() {
    const { masterPlan } = useWizardStore();
    const navigate = useNavigate();
    
    const [activeDay, setActiveDay] = useState(1);
    const [expandedActivity, setExpandedActivity] = useState<number | null>(null);

    // Parse the masterPlan JSON
    const parsed = useMemo<ParsedPlan | null>(() => {
        if (!masterPlan) return null;
        return parseMasterPlan(masterPlan);
    }, [masterPlan]);

    // Compute stats
    const stats = useMemo(() => {
        if (!parsed) return { totalDays: 0, budget: '₹0', destination: '', title: '', stays: [] as string[] };
        const cities = [...new Set(parsed.itinerary.map(d => d.city).filter(Boolean))];
        const stays = [...new Set(parsed.itinerary.map(d => d.stay?.name).filter(Boolean))];
        const totalActivities = parsed.itinerary.reduce((acc, d) => acc + d.activities.filter(a => !a.isTransit).length, 0);
        return {
            totalDays: parsed.itinerary.length,
            budget: parsed.totalCost || parsed.tripOverview?.totalBudget || '₹0',
            destination: parsed.tripOverview?.destination || cities[0] || 'Destination',
            title: parsed.tripOverview?.title || 'Your Custom Escape',
            stays,
            totalActivities,
        };
    }, [parsed]);

    // Donut chart stroke configurations
    const donutSegments = useMemo(() => {
        if (!parsed || !parsed.budgetBreakdown) return [];
        let strokeOffset = 0;
        const breakdown = parsed.budgetBreakdown;
        const total = breakdown.reduce((acc, curr) => acc + parseCostNum(curr.cost), 0) || 1;
        
        return breakdown.map((item) => {
            const cost = parseCostNum(item.cost);
            const percentage = cost / total;
            const dashArray = 188.4;
            const dashOffset = dashArray - (percentage * dashArray) + strokeOffset;
            strokeOffset -= (percentage * dashArray);
            return { ...item, percentage, dashOffset };
        });
    }, [parsed]);

    if (!masterPlan) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center h-full min-h-[400px]">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                    <Info className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No Plan Found</h3>
                <p className="text-slate-500 mb-6 max-w-sm text-sm">
                    We couldn't locate any active plan. Please return to the conversational planner to generate one.
                </p>
                <button 
                    onClick={() => navigate('/chat')}
                    className="glass-button-primary"
                >
                    Back to Chat
                </button>
            </div>
        );
    }

    // Fallback for raw markdown output
    if (!parsed) {
        return (
            <div className="flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-slate-200/60 shadow-xl">
                <div className="p-6 border-b border-slate-200/50 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-500">Raw Output</span>
                        <h2 className="text-2xl font-display font-bold text-slate-800">Your Itinerary Outline</h2>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => window.print()}
                            className="p-3 bg-white hover:bg-slate-50 text-slate-700 rounded-xl transition-all duration-300 border border-slate-200 shadow-sm"
                            title="Print Itinerary"
                        >
                            <Printer className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="p-3 bg-white hover:bg-slate-50 text-slate-700 rounded-xl transition-all duration-300 border border-slate-200 shadow-sm"
                        >
                            <Home className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar text-slate-800">
                    <article className="prose prose-slate prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-h1:text-4xl prose-h2:text-2xl">
                        <ReactMarkdown>{masterPlan}</ReactMarkdown>
                    </article>
                </div>
            </div>
        );
    }

    const currentDay = parsed.itinerary[activeDay - 1];

    const handleConfirmBooking = () => {
        navigate('/booking/summary', { state: { plan: parsed } });
    };

    return (
        <div className="flex flex-col h-full text-slate-800 bg-slate-50/50 border border-slate-200/60 shadow-2xl shadow-slate-900/8 rounded-[2rem] overflow-hidden relative">

            {/* Print Stylesheet */}
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    body { background: #ffffff !important; color: #000000 !important; }
                    .no-print { display: none !important; }
                    .print-full-width { width: 100% !important; max-width: 100% !important; flex: 0 0 100% !important; }
                    .print-card { background: #ffffff !important; color: #000000 !important; border: 1px solid #e2e8f0 !important; box-shadow: none !important; page-break-inside: avoid !important; margin-bottom: 1.5rem !important; }
                }
            `}} />

            {/* ── HEADER ─────────────────────────────────────────────────── */}
            <header className="relative overflow-hidden no-print">
                {/* TripWise light-theme background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-indigo-50/50" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.08)_0%,_transparent_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(16,185,129,0.06)_0%,_transparent_60%)]" />
                {/* Hairline top accent */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-300/60 to-transparent" />
                {/* Decorative orbs — lighter */}
                <div className="absolute -top-12 -right-12 w-56 h-56 bg-indigo-100/40 rounded-full blur-3xl" />
                <div className="absolute -bottom-6 -left-6 w-36 h-36 bg-emerald-100/30 rounded-full blur-2xl" />

                <div className="relative p-6 md:p-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                    <div className="space-y-2.5">
                        {/* Label */}
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-primary bg-primary/8 border border-primary/15 px-2.5 py-1 rounded-full">
                                <Sparkles className="w-2.5 h-2.5" />
                                Master Itinerary
                            </span>
                        </div>
                        {/* Title */}
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 leading-tight tracking-tight">
                            {stats.title}
                        </h2>
                        {/* Destination sub-label */}
                        <p className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
                            <MapPin className="w-4 h-4 text-indigo-500 shrink-0" /> {stats.destination}
                        </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={() => window.print()}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all duration-300 border border-slate-200 shadow-sm"
                            title="Print / Save PDF"
                        >
                            <Printer className="w-3.5 h-3.5 text-slate-500" />
                            <span>Print</span>
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="p-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl transition-all duration-300 border border-slate-200 shadow-sm"
                            title="Back to Dashboard"
                        >
                            <Home className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Stat Cards Bar */}
                <div className="relative px-6 md:px-8 pb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { icon: <Calendar className="w-4 h-4" />, label: 'Duration', value: `${stats.totalDays} Days`, accent: 'text-sky-600', ring: 'ring-sky-200 bg-sky-50', cardBg: 'bg-white border-slate-200/70' },
                        { icon: <IndianRupee className="w-4 h-4" />, label: 'Total Budget', value: stats.budget, accent: 'text-emerald-600', ring: 'ring-emerald-200 bg-emerald-50', cardBg: 'bg-white border-slate-200/70' },
                        { icon: <BedDouble className="w-4 h-4" />, label: 'Base Hotel', value: stats.stays[0] || 'Selected Stay', accent: 'text-amber-600', ring: 'ring-amber-200 bg-amber-50', cardBg: 'bg-white border-slate-200/70' },
                        { icon: <Camera className="w-4 h-4" />, label: 'Activities', value: `${stats.totalActivities || '—'} Planned`, accent: 'text-violet-600', ring: 'ring-violet-200 bg-violet-50', cardBg: 'bg-white border-slate-200/70' },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.07 }}
                            className={`flex items-center gap-3 ${stat.cardBg} border backdrop-blur-md rounded-2xl p-3.5 hover:shadow-md transition-all shadow-sm`}
                        >
                            <div className={`w-9 h-9 rounded-xl ring-1 ${stat.ring} flex items-center justify-center shrink-0 ${stat.accent}`}>
                                {stat.icon}
                            </div>
                            <div className="min-w-0">
                                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{stat.label}</p>
                                <p className="text-sm font-bold text-slate-800 mt-0.5 truncate">{stat.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </header>

            {/* ── MAIN CONTENT ───────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                
                {/* Print title */}
                <div className="hidden print:block p-8 pb-4 border-b">
                    <h1 className="text-4xl font-bold font-display text-black">{stats.title}</h1>
                    <p className="text-gray-500 text-sm mt-1">Destination: {stats.destination} • Duration: {stats.totalDays} Days • Total Cost: {stats.budget}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 md:p-8 items-start">

                    {/* ─ LEFT: TIMELINE ─────────────────────────── */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-5 print-full-width">

                        {/* Day pill navigation */}
                        <div className="sticky top-0 z-30 flex gap-2 pb-3 pt-1 bg-slate-50/90 backdrop-blur-md overflow-x-auto scrollbar-none no-print border-b border-slate-200/50">
                            {parsed.itinerary.map(d => (
                                <button
                                    key={d.day}
                                    onClick={() => { setActiveDay(d.day); setExpandedActivity(null); }}
                                    className={`shrink-0 px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 border ${
                                        activeDay === d.day
                                            ? 'bg-gradient-to-r from-slate-800 to-indigo-900 text-white border-indigo-900 shadow-lg shadow-indigo-900/20'
                                            : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                    }`}
                                >
                                    Day {d.day}
                                </button>
                            ))}
                        </div>

                        {/* Day Header Card */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeDay}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.25 }}
                                className="print-card relative bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm"
                            >
                                {/* Top colour accent bar */}
                                <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500" />
                                <div className="p-5">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                        <div>
                                            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-indigo-500">
                                                Day Plan · Day {currentDay.day}{currentDay.date ? ` (${currentDay.date})` : ''}
                                            </span>
                                            <h3 className="text-xl font-bold text-slate-900 mt-1 leading-tight">
                                                {currentDay.theme}
                                            </h3>
                                            {currentDay.city && (
                                                <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5">
                                                    <MapPin className="w-3.5 h-3.5 text-indigo-400" /> {currentDay.city}
                                                </p>
                                            )}
                                        </div>
                                        {currentDay.dayBudget && (
                                            <span className="shrink-0 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2 self-start sm:self-center">
                                                Day Spend: {currentDay.dayBudget}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Activity Timeline */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeDay + '-timeline'}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="relative pl-8 sm:pl-12 space-y-4"
                            >
                                {/* Vertical timeline track */}
                                <div className="absolute left-[15px] sm:left-[23px] top-3 bottom-3 w-px bg-gradient-to-b from-indigo-300 via-slate-200 to-slate-100" />

                                {currentDay.activities.map((activity, idx) => {
                                    const tod = TIME_OF_DAY_CONFIG[activity.timeOfDay] || TIME_OF_DAY_CONFIG.Morning;
                                    const isTransit = activity.isTransit === true;
                                    const isExpanded = expandedActivity === idx;

                                    if (isTransit) {
                                        return (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, y: 12 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.06 }}
                                                className="relative print-card rounded-2xl overflow-hidden border border-dashed border-indigo-300/60 bg-gradient-to-br from-indigo-50 to-violet-50/30 p-5 sm:p-6"
                                            >
                                                {/* Timeline dot */}
                                                <div className="absolute -left-[27px] sm:-left-[35px] top-6 w-6 h-6 rounded-full bg-white border border-indigo-300 flex items-center justify-center shadow-sm">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                                                </div>

                                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between pb-4 border-b border-indigo-200/40">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-xl bg-white border border-indigo-200 text-indigo-600 flex items-center justify-center shadow-sm">
                                                            {activity.type === 'flight' ? <Plane className="w-5 h-5" /> : activity.type === 'train' ? <Train className="w-5 h-5" /> : <Car className="w-5 h-5" />}
                                                        </div>
                                                        <div>
                                                            <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-600 font-mono">Transit Itinerary</span>
                                                            <h4 className="text-sm font-bold text-slate-800 mt-0.5">{activity.title}</h4>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-slate-500 font-mono font-semibold bg-white border border-slate-200 px-2.5 py-1 rounded-lg">{activity.travelTime || activity.duration || 'Scheduled'}</span>
                                                </div>

                                                <div className="grid grid-cols-3 items-center py-5 text-center">
                                                    <div>
                                                        <p className="text-xl font-display font-bold text-slate-800">{activity.from || 'Origin'}</p>
                                                        <p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold mt-1">From</p>
                                                    </div>
                                                    <div className="flex flex-col items-center px-4 relative">
                                                        <div className="w-full border-t border-dashed border-indigo-300/70 my-2" />
                                                        <div className="w-8 h-8 rounded-full bg-white border border-indigo-200 flex items-center justify-center text-indigo-500 absolute -top-2 shadow-sm">
                                                            {activity.type === 'flight' ? <Plane className="w-4 h-4 rotate-90" /> : <Train className="w-4 h-4" />}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-xl font-display font-bold text-slate-800">{activity.to || 'Destination'}</p>
                                                        <p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold mt-1">To</p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-indigo-200/30 text-xs text-slate-500 bg-white/40 -mx-5 -mb-5 px-5 py-3 rounded-b-2xl">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-3.5 h-3.5 text-indigo-400" />
                                                        <span>Time: <strong className="text-slate-800">{activity.time || '—'}</strong></span>
                                                    </div>
                                                    {activity.placeName && (
                                                        <span className="truncate max-w-[150px]">Terminal: <strong className="text-slate-800">{activity.placeName}</strong></span>
                                                    )}
                                                    <span className="font-bold text-slate-800 font-mono">{activity.cost}</span>
                                                </div>
                                            </motion.div>
                                        );
                                    }

                                    return (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.06 }}
                                            onClick={() => setExpandedActivity(isExpanded ? null : idx)}
                                            className={`print-card relative border-l-2 ${tod.border} rounded-2xl p-4 sm:p-5 transition-all duration-300 cursor-pointer group hover:shadow-md select-none bg-white border border-slate-200/60 ${
                                                isExpanded ? 'shadow-md' : 'hover:border-slate-300'
                                            }`}
                                        >
                                            {/* Timeline dot */}
                                            <div className={`absolute -left-[27px] sm:-left-[35px] top-[22px] w-6 h-6 rounded-full bg-white border transition-all duration-300 flex items-center justify-center shadow-sm ${
                                                isExpanded ? 'scale-110 border-indigo-300' : 'border-slate-200'
                                            }`}>
                                                <div className={`w-2.5 h-2.5 rounded-full ${tod.dot} transition-transform ${isExpanded ? 'scale-110' : ''}`} />
                                            </div>

                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-start gap-4">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300 mt-1 shadow-sm border border-slate-200/60 bg-gradient-to-br ${tod.bg} to-white`}>
                                                        <span className={tod.color}>{activityIcon(activity.type)}</span>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center flex-wrap gap-2">
                                                            <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${tod.pill}`}>
                                                                {activity.time || activity.timeOfDay}
                                                            </span>
                                                            {activity.duration && (
                                                                <span className="text-[9px] font-semibold tracking-wider uppercase bg-slate-100 border border-slate-200 text-slate-500 rounded px-1.5 py-0.5">
                                                                    {activity.duration}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <h4 className="text-base font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">
                                                            {activity.title}
                                                        </h4>
                                                        <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                                                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" /> {activity.placeName}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="text-right shrink-0">
                                                    <span className="text-sm font-bold text-slate-900 font-mono">{activity.cost}</span>
                                                    <div className="text-[10px] text-slate-400 mt-1 no-print flex items-center justify-end gap-1 font-medium">
                                                        <span>{isExpanded ? 'Less' : 'Details'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Expandable details */}
                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                                        animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                                                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                                        transition={{ duration: 0.25 }}
                                                        className="overflow-hidden border-t border-slate-200 pt-4 text-xs text-slate-600 space-y-3"
                                                    >
                                                        {activity.description && (
                                                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                                <p className="text-slate-700 leading-relaxed">{activity.description}</p>
                                                            </div>
                                                        )}
                                                        {activity.address && (
                                                            <div className="flex gap-2">
                                                                <strong className="text-slate-800 shrink-0 uppercase tracking-widest text-[9px] mt-0.5">Address:</strong>
                                                                <span>{activity.address}</span>
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    );
                                })}

                                {/* Tonight's Stay */}
                                {currentDay.stay && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="print-card relative rounded-2xl overflow-hidden border border-amber-200/60 bg-gradient-to-br from-amber-50 to-orange-50/30 p-5 sm:p-6"
                                    >
                                        {/* Decorative orb */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full blur-3xl -translate-y-8 translate-x-8" />
                                        {/* Timeline dot */}
                                        <div className="absolute -left-[27px] sm:-left-[35px] top-[24px] w-6 h-6 rounded-full bg-white border border-amber-300/60 flex items-center justify-center shadow-sm">
                                            <BedDouble className="w-3.5 h-3.5 text-amber-500" />
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 relative">
                                            <div className="flex gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-white border border-amber-200 flex items-center justify-center shrink-0 shadow-sm">
                                                    <BedDouble className="w-5 h-5 text-amber-500" />
                                                </div>
                                                <div>
                                                    <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-amber-600 font-mono">Tonight's Lodging</span>
                                                    <h4 className="text-base font-bold text-slate-800 mt-1">{currentDay.stay.name}</h4>
                                                    {currentDay.stay.address && (
                                                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {currentDay.stay.address}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center gap-2 mt-2.5">
                                                        {currentDay.stay.stars && currentDay.stay.stars > 0 && (
                                                            <div className="flex">
                                                                {Array.from({ length: currentDay.stay.stars }).map((_, i) => (
                                                                    <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                                                                ))}
                                                            </div>
                                                        )}
                                                        {currentDay.stay.checkIn && (
                                                            <span className="text-[9px] bg-amber-100 border border-amber-200 text-amber-700 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider font-mono">
                                                                In: {currentDay.stay.checkIn}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-left sm:text-right shrink-0">
                                                <p className="text-sm font-bold text-slate-800 font-mono">{currentDay.stay.cost}</p>
                                                <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-full px-2 py-0.5 mt-2">
                                                    Included
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* ─ RIGHT: SIDEBAR ─────────────────────────── */}
                    <div className="lg:col-span-5 xl:col-span-4 space-y-5 no-print">

                        {/* Book CTA Card */}
                        <div className="relative rounded-2xl overflow-hidden border border-slate-200/60 bg-white shadow-sm">
                            <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500" />
                            <div className="p-6 space-y-5">
                                <div>
                                    <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-indigo-500">Finalize Plan</p>
                                    <h3 className="text-xl font-bold mt-1 text-slate-900">Lock in Itinerary</h3>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">Book stays, flights, and tours in one sweep using TripWise Pay.</p>
                                </div>
                                
                                <button
                                    onClick={handleConfirmBooking}
                                    className="w-full h-12 rounded-xl text-white text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 group relative overflow-hidden shadow-lg shadow-slate-900/10"
                                    style={{ background: 'linear-gradient(135deg, hsl(222,47%,11%) 0%, hsl(228,50%,20%) 100%)' }}
                                >
                                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                                    <CheckCircle className="w-4 h-4 text-emerald-400 relative z-10" />
                                    <span className="relative z-10">Confirm & Book Trip</span>
                                    <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-0.5 transition-transform" />
                                </button>

                                <div className="text-[10px] text-slate-500 leading-relaxed bg-slate-50 p-3 border border-slate-100 rounded-xl flex items-start gap-2">
                                    <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                                    <span>Includes flexible cancellations, booking protection, and 24/7 travel support during transit.</span>
                                </div>
                            </div>
                        </div>

                        {/* Route Map Card */}
                        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 space-y-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Route Map</p>
                                    <h3 className="text-base font-bold text-slate-800">Today's Trajectory</h3>
                                </div>
                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                                    <Compass className="w-4 h-4 text-slate-400" />
                                </div>
                            </div>

                            <div className="relative bg-slate-50 border border-slate-200/60 rounded-xl p-4 space-y-5 overflow-hidden">
                                <div className="absolute left-[26px] top-[28px] bottom-[28px] w-px border-l border-dashed border-slate-300" />

                                {[
                                    { label: currentDay.activities[0]?.placeName || 'Start Point', sub: 'Stop A', num: '1', color: 'bg-white border-indigo-200 text-indigo-600' },
                                    { label: currentDay.activities[1]?.placeName || 'Next Attraction', sub: 'Stop B', num: '2', color: 'bg-white border-slate-200 text-slate-700' },
                                ].map((stop, i) => (
                                    <React.Fragment key={i}>
                                        {i > 0 && (
                                            <div className="pl-10 flex items-center gap-1.5 text-[10px] text-slate-400 -my-3">
                                                <Clock className="w-3 h-3" />
                                                <span>~15–20 min transit</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-3 relative">
                                            <div className={`w-7 h-7 rounded-full border text-xs font-bold flex items-center justify-center shrink-0 z-10 shadow-sm ${stop.color}`}>
                                                {stop.num}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-slate-800 truncate">{stop.label}</p>
                                                <p className="text-[9px] text-slate-400 tracking-wider uppercase font-semibold">{stop.sub}</p>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                ))}

                                <div className="pl-11 flex items-center gap-1.5 text-[10px] text-slate-400 -my-3">
                                    <Clock className="w-3 h-3" />
                                    <span>~10 min to hotel</span>
                                </div>

                                <div className="flex items-center gap-3 relative">
                                    <div className="w-7 h-7 rounded-full bg-amber-100 border border-amber-300 text-amber-500 text-sm flex items-center justify-center shrink-0 z-10 shadow-sm">
                                        🏨
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-slate-800 truncate">{currentDay.stay?.name || 'Hotel Stay'}</p>
                                        <p className="text-[9px] text-amber-600 tracking-wider uppercase font-bold font-mono">Tonight's Stay</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Budget Chart Card */}
                        {parsed.budgetBreakdown && parsed.budgetBreakdown.length > 0 && (
                            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 space-y-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-600">Budget Analysis</p>
                                        <h3 className="text-base font-bold text-slate-800">Cost Breakdown</h3>
                                    </div>
                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                                        <Layers className="w-4 h-4 text-emerald-500" />
                                    </div>
                                </div>

                                {/* Donut chart */}
                                <div className="flex items-center justify-center py-2 relative">
                                    <svg width="140" height="140" viewBox="0 0 100 100" className="transform -rotate-90 drop-shadow-xl">
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
                                                className="transition-all duration-1000 ease-out"
                                            />
                                        ))}
                                    </svg>
                                    <div className="absolute flex flex-col items-center justify-center text-center">
                                        <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Total</span>
                                        <span className="text-sm font-bold text-slate-800 mt-0.5">{stats.budget}</span>
                                    </div>
                                </div>

                                {/* Budget list */}
                                <div className="space-y-2.5">
                                    {donutSegments.map((item, idx) => {
                                        const textColor = BUDGET_COLORS[idx % BUDGET_COLORS.length];
                                        const bgColor = BUDGET_BG_COLORS[idx % BUDGET_BG_COLORS.length];
                                        const pct = Math.round(item.percentage * 100);
                                        return (
                                            <div key={idx} className="bg-slate-50 border border-slate-200/50 rounded-xl p-3.5 space-y-2 hover:bg-white hover:shadow-sm transition-all duration-200">
                                                <div className="flex items-center justify-between text-xs">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2.5 h-2.5 rounded-full ${bgColor} shadow-[0_0_6px_rgba(0,0,0,0.15)]`} />
                                                        <span className="font-semibold text-slate-700">{item.category}</span>
                                                    </div>
                                                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                                        <span>{item.cost}</span>
                                                        <span className={`text-[10px] font-semibold ${textColor}`}>{pct}%</span>
                                                    </div>
                                                </div>
                                                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className={`h-full rounded-full ${bgColor}`}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${pct}%` }}
                                                        transition={{ duration: 0.8, delay: idx * 0.1, ease: 'easeOut' }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>

        </div>
    );
}
