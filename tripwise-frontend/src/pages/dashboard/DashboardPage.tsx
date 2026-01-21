import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Settings, LogOut, User as UserIcon, Receipt } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { LiquidBackground } from "@/components/ui/LiquidBackground";
import { useProfileStore } from "@/store/profileStore";
import { Button } from "@/components/ui/button";
import { TripCard, Trip } from "@/components/dashboard/TripCard";
import { WalletSection } from "@/components/dashboard/WalletSection";

// Mock Data
const MOCK_TRIPS: Trip[] = [
    {
        id: '1',
        destination: 'Paris, France',
        dates: 'Jun 12 - Jun 19, 2024',
        status: 'upcoming',
        bookingReference: 'TW-8842',
    },
    {
        id: '2',
        destination: 'Tokyo, Japan',
        dates: 'Mar 10 - Mar 22, 2023',
        status: 'completed',
    },
    {
        id: '3',
        destination: 'Bali, Indonesia',
        dates: 'Aug 05 - Aug 12, 2022',
        status: 'cancelled',
    }
];

const DashboardPage = () => {
    const navigate = useNavigate();
    const { basicInfo, destination, dates, authenticateUser } = useProfileStore();
    const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');

    // Combine Mock Data with Actual Profile Data
    const currentTrip: Trip | null = (destination?.destination && dates) ? {
        id: 'current',
        destination: destination.destination,
        dates: dates.startDate && dates.returnDate
            ? `${new Date(dates.startDate).toLocaleDateString()} - ${new Date(dates.returnDate).toLocaleDateString()}`
            : 'Dates TBD',
        status: 'upcoming',
        bookingReference: 'DRAFT-001',
    } : null;

    const allTrips = currentTrip ? [currentTrip, ...MOCK_TRIPS] : MOCK_TRIPS;
    const filteredTrips = allTrips.filter(trip => trip.status === activeTab);

    const handleAction = (action: string, tripId: string) => {
        if (action === 'continue') {
            navigate('/chat', { state: { isReturning: true } });
        } else if (action === 'view_ticket' || action === 'view_details') {
            console.log('View details for', tripId);
            // TODO: Implement details modal
        }
    };

    const handleNewTrip = () => {
        // Reset state for new trip planning if needed
        navigate('/plan'); // Redirect to wizard
    };

    const handleLogout = () => {
        // Simple logout for now
        navigate('/auth');
    };

    return (
        <div className="relative min-h-screen">
            <LiquidBackground />
            <SiteHeader />

            <main className="relative z-10 container mx-auto px-4 pt-24 pb-12 max-w-7xl">
                {/* Dashboard Header */}
                <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-2"
                    >
                        <h1 className="font-display text-4xl font-light tracking-tight text-foreground md:text-5xl lg:text-6xl">
                            Welcome back,<br />
                            <span className="font-handwriting text-5xl italic text-primary md:text-6xl">
                                {basicInfo.fullName?.split(' ')[0] || 'Traveler'}
                            </span>
                        </h1>
                        <p className="text-lg text-muted-foreground/80 font-light max-w-md">
                            Your journey continues here. Manage your trips, wallet, and profile.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex gap-3"
                    >
                        <Button
                            onClick={handleNewTrip}
                            className="h-12 rounded-2xl bg-primary px-6 text-sm font-bold uppercase tracking-widest text-white shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-primary/30 hover:scale-105"
                        >
                            <Plus className="mr-2 h-5 w-5" />
                            Plan New Trip
                        </Button>
                    </motion.div>
                </div>

                <div className="space-y-24">
                    {/* SECTION 1: TRIPS */}
                    <section className="space-y-8">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-white/5 pb-6">
                            <div>
                                <h2 className="font-display text-3xl font-medium tracking-tight">Your Journeys</h2>
                                <p className="text-muted-foreground/60">Manage your upcoming and past adventures</p>
                            </div>

                            {/* Trips Tabs */}
                            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-full backdrop-blur-sm border border-white/10 self-start md:self-auto">
                                {(['upcoming', 'completed', 'cancelled'] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`relative px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${activeTab === tab
                                            ? 'text-white'
                                            : 'text-muted-foreground/60 hover:text-white'
                                            }`}
                                    >
                                        {activeTab === tab && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 rounded-full bg-white/10 shadow-inner"
                                            />
                                        )}
                                        <span className="relative z-10">{tab}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Trips Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence mode="popLayout">
                                {filteredTrips.map((trip) => (
                                    <TripCard
                                        key={trip.id}
                                        trip={trip}
                                        onAction={handleAction}
                                    />
                                ))}
                            </AnimatePresence>

                            {/* Empty State */}
                            {filteredTrips.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="col-span-full py-16 text-center rounded-[2.5rem] border border-dashed border-white/10 bg-white/5"
                                >
                                    <p className="text-muted-foreground">No {activeTab} trips found.</p>
                                    {activeTab === 'upcoming' && (
                                        <Button
                                            variant="link"
                                            onClick={handleNewTrip}
                                            className="mt-2 text-primary"
                                        >
                                            Plan a new trip now &rarr;
                                        </Button>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </section>

                    {/* SECTION 2: PAYMENT & WALLET */}
                    <section className="space-y-8">
                        <div className="border-b border-white/5 pb-6">
                            <h2 className="font-display text-3xl font-medium tracking-tight">Wallet & Payments</h2>
                            <p className="text-muted-foreground/60">Manage your payment methods and TripWise Pay balance</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1">
                                <WalletSection />
                            </div>

                            {/* Recent Transactions Placeholder/List */}
                            <div className="lg:col-span-2 ios-glass rounded-[2.5rem] p-8 min-h-[300px] flex flex-col">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="font-medium text-lg flex items-center gap-2">
                                        <Receipt className="w-5 h-5 text-primary" />
                                        Recent Transactions
                                    </h3>
                                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white">View All</Button>
                                </div>

                                <div className="space-y-4">
                                    {/* Mock Transactions */}
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${i === 1 ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                    {i === 1 ? '+' : '↗'}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{i === 1 ? 'Wallet Top-up' : 'Flight Booking'}</p>
                                                    <p className="text-xs text-muted-foreground">Jun {12 + i}, 2024 • ••• 4242</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-medium ${i === 1 ? 'text-green-400' : ''}`}>
                                                    {i === 1 ? '+' : '-'}${i === 1 ? '500.00' : '1,250.00'}
                                                </p>
                                                <p className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">View Receipt</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* SECTION 3: PROFILE */}
                    <section className="space-y-8">
                        <div className="border-b border-white/5 pb-6">
                            <h2 className="font-display text-3xl font-medium tracking-tight">Traveler Profile</h2>
                            <p className="text-muted-foreground/60">Update your details and co-traveler information</p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="ios-glass overflow-hidden rounded-[2.5rem] p-8 md:p-12"
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
                                                <Button size="sm" variant="outline" className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10">
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
                                            <p className="font-medium">Adventure & Culture</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Co-Travelers</p>
                                            <p className="font-medium">2 Saved</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full h-px md:w-px md:h-64 bg-gradient-to-r md:bg-gradient-to-b from-transparent via-white/10 to-transparent my-4 md:my-0 md:mx-4" />

                                <div className="flex-1 space-y-6 w-full">
                                    <h4 className="font-medium text-lg">Quick Access</h4>
                                    <div className="space-y-3">
                                        <Button variant="outline" className="w-full justify-between h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 px-6 group">
                                            <span className="font-normal">Manage Co-Travelers</span>
                                            <Settings className="h-4 w-4 text-muted-foreground transition-transform group-hover:rotate-90" />
                                        </Button>
                                        <Button variant="outline" className="w-full justify-between h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 px-6 group">
                                            <span className="font-normal">Upload Travel Documents</span>
                                            <Plus className="h-4 w-4 text-muted-foreground transition-transform group-hover:rotate-90" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
