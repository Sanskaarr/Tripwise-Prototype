import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Settings, User as UserIcon, Receipt, Sparkles, Map, Wallet, Calendar, LogOut } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { LiquidBackground } from "@/components/ui/LiquidBackground";
import { useProfileStore } from "@/store/profileStore";
import { Button } from "@/components/ui/button";
import { TripCard, Trip } from "@/components/dashboard/TripCard";
import { WalletSection } from "@/components/dashboard/WalletSection";
import { tripService } from "@/services/tripService";
import { coTravelerService } from "@/services/coTravelerService";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { AddMoneyModal } from "@/components/dashboard/AddMoneyModal";
import { walletService, Transaction } from "@/services/walletService";
import { CoTravelersModal } from "@/components/profile/CoTravelersModal";
import { DocumentUploadModal } from "@/components/profile/DocumentUploadModal";
import { SavedCardsModal } from "@/components/dashboard/SavedCardsModal";
import { TransactionHistoryModal } from "@/components/dashboard/TransactionHistoryModal";
import { TripDetailsModal } from "@/components/dashboard/TripDetailsModal";


const DashboardPage = () => {
    const navigate = useNavigate();
    const { basicInfo, destination, dates, profileId, isNewUser, logout } = useProfileStore();
    const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');

    // Data State
    const [trips, setTrips] = useState<Trip[]>([]);
    const [isLoadingTrips, setIsLoadingTrips] = useState(true);

    // Modal State
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showCoTravelers, setShowCoTravelers] = useState(false);
    const [showDocuments, setShowDocuments] = useState(false);
    const [showAddMoney, setShowAddMoney] = useState(false);
    const [showSavedCards, setShowSavedCards] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [showTripDetails, setShowTripDetails] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

    // Wallet State
    const [walletBalance, setWalletBalance] = useState(0);
    const [walletCurrency, setWalletCurrency] = useState('INR');
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    // Co-traveler count
    const [coTravelerCount, setCoTravelerCount] = useState<number | null>(null);

    const fetchCoTravelerCount = useCallback(async () => {
        if (!profileId) return;
        try {
            const data = await coTravelerService.getCoTravelers(profileId);
            setCoTravelerCount(Array.isArray(data) ? data.length : 0);
        } catch {
            setCoTravelerCount(null);
        }
    }, [profileId]);

    useEffect(() => {
        fetchCoTravelerCount();
    }, [fetchCoTravelerCount]);

    const fetchWalletData = useCallback(async () => {
        if (!profileId) return;
        try {
            const [wallet, history] = await Promise.all([
                walletService.getBalance(profileId),
                walletService.getHistory(profileId)
            ]);
            setWalletBalance(wallet.balance);
            setWalletCurrency(wallet.currency);
            setTransactions(history.reverse());
        } catch (error) {
            console.error("Failed to fetch wallet data", error);
        }
    }, [profileId]);

    // Wallet fetch — only reruns when profileId changes, not on every destination/dates update.
    useEffect(() => {
        fetchWalletData();
    }, [fetchWalletData]);

    // Fetch Data
    useEffect(() => {
        const fetchTrips = async () => {
            if (!profileId) {
                // If local user with no backend ID, check store for draft
                setTimeout(() => {
                    const currentTrip: Trip | null = (destination?.destination && dates) ? {
                        id: 'current',
                        destination: destination.destination,
                        dates: dates.startDate && dates.returnDate
                            ? `${new Date(dates.startDate).toLocaleDateString()} - ${new Date(dates.returnDate).toLocaleDateString()}`
                            : 'Dates TBD',
                        status: 'upcoming',
                        bookingReference: 'DRAFT-001',
                    } : null;

                    setTrips(currentTrip ? [currentTrip] : []);
                    setIsLoadingTrips(false);
                }, 500);
                return;
            }

            try {
                const userTrips = await tripService.getUserTrips(profileId);
                setTrips(userTrips);

                // For now, if we have a draft in state, show it
                const currentTrip: Trip | null = (destination?.destination && dates) ? {
                    id: 'current',
                    destination: destination.destination,
                    dates: dates.startDate && dates.returnDate
                        ? `${new Date(dates.startDate).toLocaleDateString()} - ${new Date(dates.returnDate).toLocaleDateString()}`
                        : 'Dates TBD',
                    status: 'upcoming',
                    bookingReference: 'DRAFT-001',
                } : null;

                setTrips(currentTrip ? [currentTrip] : []);
            } catch (error) {
                console.error("Failed to fetch trips", error);
                setTrips([]);
            } finally {
                setIsLoadingTrips(false);
            }
        };

        fetchTrips();
    }, [profileId, destination, dates]);

    // Combine Mock Data with Actual Profile Data
    const filteredTrips = trips.filter(trip => trip.status === activeTab);

    const handleAction = (action: string, tripId: string) => {
        if (action === 'continue') {
            navigate('/chat', { state: { isReturning: true } });
        } else if (action === 'view_ticket' || action === 'view_details') {
            const trip = trips.find(t => t.id === tripId) || null;
            setSelectedTrip(trip);
            setShowTripDetails(true);
        }
    };

    const handleNewTrip = () => {
        // Returning users (completed onboarding) skip the 12-step flow
        if (!isNewUser && basicInfo?.fullName) {
            navigate('/plan/quick');
        } else {
            navigate('/plan');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="relative min-h-screen pb-20 overflow-x-hidden">
            <LiquidBackground />
            <SiteHeader />

            <main className="relative z-10 container mx-auto px-4 sm:px-6 pt-32 pb-12 max-w-7xl">
                {/* Dashboard Header */}
                <div className="mb-20 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                    >
                        {/* Premium Member Badge Removed */}
                        <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-light tracking-tight text-foreground">
                            Hello,<br />
                            <span className="font-handwriting text-5xl sm:text-6xl lg:text-7xl italic text-primary">
                                {basicInfo.fullName?.split(' ')[0] || 'Traveler'}
                            </span>
                        </h1>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <Button
                            onClick={handleNewTrip}
                            className="h-14 rounded-2xl bg-white text-black px-8 text-sm font-bold uppercase tracking-widest shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-all hover:bg-white/90 hover:scale-[1.02] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.4)]"
                        >
                            <Sparkles className="mr-2 h-4 w-4 text-amber-500" />
                            Plan New Trip
                        </Button>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 gap-24">
                    {/* SECTION 1: TRIPS */}
                    <section className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-white/5 pb-6">
                            <div className="space-y-1">
                                <h2 className="flex items-center gap-3 font-display text-3xl font-medium tracking-tight">
                                    <Map className="w-6 h-6 text-muted-foreground/50" />
                                    Your Journeys
                                </h2>
                                <p className="text-muted-foreground/60 pl-9">Manage your upcoming and past adventures</p>
                            </div>

                            {/* Trips Tabs - Enhanced Responsiveness */}
                            <div className="flex w-full md:w-auto items-center gap-1 bg-white/5 p-1.5 rounded-2xl backdrop-blur-sm border border-white/10 overflow-x-auto scrollbar-hide">
                                {(['upcoming', 'completed', 'cancelled'] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`relative flex-1 md:flex-none px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${activeTab === tab
                                            ? 'text-black'
                                            : 'text-muted-foreground hover:text-white'
                                            }`}
                                    >
                                        {activeTab === tab && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 rounded-xl bg-white shadow-lg"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <span className="relative z-10">{tab}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Trips Grid - Enhanced Responsive Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
                            <AnimatePresence mode="sync">
                                {isLoadingTrips ? (
                                    // Loading Skeletons
                                    [1, 2].map(i => (
                                        <div key={i} className="h-64 rounded-[2.5rem] bg-white/5 animate-pulse" />
                                    ))
                                ) : (
                                    filteredTrips.map((trip) => (
                                        <TripCard
                                            key={trip.id}
                                            trip={trip}
                                            onAction={handleAction}
                                        />
                                    ))
                                )}
                            </AnimatePresence>

                            {/* Empty State */}
                            {!isLoadingTrips && filteredTrips.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="col-span-full py-24 text-center rounded-[2.5rem] border border-dashed border-white/10 bg-white/5 backdrop-blur-sm"
                                >
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                                        <Calendar className="w-8 h-8 text-muted-foreground/50" />
                                    </div>
                                    <h3 className="text-xl font-medium mb-2">No {activeTab} trips</h3>
                                    <p className="text-muted-foreground mb-6">Time to start planning your next adventure?</p>
                                    {activeTab === 'upcoming' && (
                                        <p className="text-sm text-muted-foreground/50 font-medium">
                                            Use <span className="text-white/60">"Plan New Trip"</span> above to get started
                                        </p>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </section>

                    {/* SECTION 2: PAYMENT & WALLET */}
                    <section className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        <div className="border-b border-white/5 pb-6">
                            <div className="space-y-1">
                                <h2 className="flex items-center gap-3 font-display text-3xl font-medium tracking-tight">
                                    <Wallet className="w-6 h-6 text-muted-foreground/50" />
                                    Wallet & Payments
                                </h2>
                                <p className="text-muted-foreground/60 pl-9">Manage your payment methods and TripWise Pay balance</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            <div className="lg:col-span-5 xl:col-span-4">
                                <WalletSection
                                    balance={walletBalance}
                                    currency={walletCurrency}
                                    onAddMoney={() => setShowAddMoney(true)}
                                    onHistory={() => setShowHistory(true)}
                                    onSavedCards={() => setShowSavedCards(true)}
                                />
                            </div>

                            <div className="lg:col-span-7 xl:col-span-8 ios-glass rounded-[2.5rem] p-6 sm:p-8 flex flex-col border border-white/10">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="font-medium text-lg flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Receipt className="w-4 h-4 text-primary" />
                                        </div>
                                        Recent Activity
                                    </h3>
                                    <Button variant="ghost" size="sm" onClick={() => setShowHistory(true)} className="text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-white hover:bg-white/5">View All</Button>
                                </div>

                                <div className="space-y-3">
                                    {transactions.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            No recent transactions
                                        </div>
                                    ) : (
                                        transactions.slice(0, 5).map((tx) => (
                                            <div key={tx.id} onClick={() => setShowHistory(true)} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer group">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-white/5 ${tx.type === 'TOPUP' || tx.type === 'REFUND' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                                        {tx.type === 'TOPUP' ? <Plus className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-base sm:text-lg">{tx.description || tx.type}</p>
                                                        <p className="text-xs text-muted-foreground">{new Date(tx.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} • {tx.method}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="px-3 py-1 rounded-full bg-primary/10">
                                                        <p className="font-bold text-base sm:text-lg text-primary">
                                                            {tx.type === 'TOPUP' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                                                        </p>
                                                    </div>
                                                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 mt-1">Details &rarr;</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* SECTION 3: PROFILE */}
                    <section className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                        <div className="border-b border-white/5 pb-6">
                            <div className="space-y-1">
                                <h2 className="flex items-center gap-3 font-display text-3xl font-medium tracking-tight">
                                    <UserIcon className="w-6 h-6 text-muted-foreground/50" />
                                    Traveler Profile
                                </h2>
                                <p className="text-muted-foreground/60 pl-9">Update your details and co-traveler information</p>
                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="ios-glass overflow-hidden rounded-[2.5rem] p-8 md:p-12 border border-white/10"
                        >
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="space-y-6 flex-1 w-full">
                                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                                        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500/20 to-pink-500/20 flex items-center justify-center border border-white/10 shadow-xl shrink-0">
                                            <UserIcon className="h-10 w-10 text-foreground" />
                                        </div>
                                        <div>
                                            <h3 className="font-display text-2xl font-medium">
                                                {basicInfo.fullName || 'User Profile'}
                                            </h3>
                                            <p className="text-muted-foreground">{basicInfo.email || basicInfo.whatsappNumber}</p>
                                            <div className="flex gap-2 mt-4">
                                                <Button size="sm" variant="outline" className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10"
                                                    onClick={() => setShowEditProfile(true)}>
                                                    Edit Profile
                                                </Button>
                                                <Button size="sm" variant="ghost" className="rounded-xl hover:bg-red-500/10 hover:text-red-400" onClick={handleLogout}>
                                                    <LogOut className="w-4 h-4 mr-2" />
                                                    Sign Out
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Travel Style</p>
                                            <p className="font-medium">
                                                {destination.travelStyle
                                                    ? destination.travelStyle.charAt(0).toUpperCase() + destination.travelStyle.slice(1)
                                                    : '—'}
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Co-Travelers</p>
                                            <p className="font-medium">
                                                {coTravelerCount === null
                                                    ? '—'
                                                    : coTravelerCount === 0
                                                        ? 'None saved'
                                                        : `${coTravelerCount} Saved`}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full h-px md:w-px md:h-64 bg-gradient-to-r md:bg-gradient-to-b from-transparent via-white/10 to-transparent my-4 md:my-0 md:mx-4" />

                                <div className="flex-1 space-y-6 w-full">
                                    <h4 className="font-medium text-lg">Quick Access</h4>
                                    <div className="space-y-3">
                                        <Button variant="outline" className="w-full justify-between h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 px-6 group"
                                            onClick={() => setShowCoTravelers(true)}>
                                            <span className="font-normal">Manage Co-Travelers</span>
                                            <Settings className="h-4 w-4 text-muted-foreground transition-transform group-hover:rotate-90" />
                                        </Button>
                                        <Button variant="outline" className="w-full justify-between h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 px-6 group"
                                            onClick={() => setShowDocuments(true)}>
                                            <span className="font-normal">Upload Travel Documents</span>
                                            <Plus className="h-4 w-4 text-muted-foreground transition-transform group-hover:rotate-90" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </section>
                </div>

                {/* Modals */}
                <EditProfileModal isOpen={showEditProfile} onClose={() => setShowEditProfile(false)} />
                <CoTravelersModal isOpen={showCoTravelers} onClose={() => { setShowCoTravelers(false); fetchCoTravelerCount(); }} />
                <DocumentUploadModal isOpen={showDocuments} onClose={() => setShowDocuments(false)} />
                <AddMoneyModal
                    isOpen={showAddMoney}
                    onClose={() => setShowAddMoney(false)}
                    onSuccess={fetchWalletData}
                />
                <SavedCardsModal isOpen={showSavedCards} onClose={() => setShowSavedCards(false)} />
                <TransactionHistoryModal isOpen={showHistory} onClose={() => setShowHistory(false)} />
                <TripDetailsModal
                    isOpen={showTripDetails}
                    onClose={() => setShowTripDetails(false)}
                    trip={selectedTrip}
                />
            </main>
        </div>
    );
};

export default DashboardPage;
