import { motion } from "framer-motion";
import { Calendar, MoreVertical, Ticket, XCircle, Eye, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Trip {
    id: string;
    destination: string;
    dates: string;
    status: 'upcoming' | 'completed' | 'cancelled';
    imageUrl?: string;
    bookingReference?: string;
    /** shareToken of the confirmed TripwiseBooking — present only after payment */
    passShareToken?: string;
}

interface TripCardProps {
    trip: Trip;
    onAction: (action: string, tripId: string) => void;
}

export const TripCard = ({ trip, onAction }: TripCardProps) => {
    const isUpcoming = trip.status === 'upcoming';
    // Draft trips (id='current') exist only in local state — no DB record to cancel
    const isDraft = trip.id === 'current';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:shadow-xl ${isUpcoming ? 'ring-1 ring-primary/20' : ''
                }`}
        >
            {/* Background Image Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative z-10 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                            <span className={`h-2 w-2 rounded-full ${trip.status === 'upcoming' ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]' :
                                    trip.status === 'completed' ? 'bg-blue-400' : 'bg-red-400'
                                }`} />
                            {trip.status}
                        </div>
                        <h3 className="font-display text-2xl font-medium tracking-tight text-foreground">
                            {trip.destination}
                        </h3>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="group/btn h-8 w-8 rounded-full hover:bg-white/10">
                                <MoreVertical className="h-4 w-4 text-muted-foreground transition-colors group-hover/btn:text-foreground" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-44 rounded-xl border border-white/10 bg-black/80 backdrop-blur-xl text-white shadow-xl"
                        >
                            <DropdownMenuItem
                                className="flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 text-sm hover:bg-white/10 focus:bg-white/10"
                                onClick={() => onAction('view_details', trip.id)}
                            >
                                <Eye className="h-4 w-4 text-muted-foreground" />
                                View Details
                            </DropdownMenuItem>

                            {isUpcoming && (
                                <>
                                    <DropdownMenuSeparator className="bg-white/10" />
                                    <DropdownMenuItem
                                        disabled={isDraft}
                                        title={isDraft ? 'Save your trip first to cancel it' : undefined}
                                        className="flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 disabled:opacity-40 disabled:cursor-not-allowed"
                                        onClick={() => !isDraft && onAction('cancel', trip.id)}
                                    >
                                        <XCircle className="h-4 w-4" />
                                        Cancel Trip
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 py-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground/80">
                        <Calendar className="h-4 w-4 text-primary/60" />
                        <span>{trip.dates}</span>
                    </div>
                    {trip.bookingReference && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground/80">
                            <Ticket className="h-4 w-4 text-primary/60" />
                            <span className="font-mono text-xs">{trip.bookingReference}</span>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                    {isUpcoming ? (
                        <>
                            {trip.passShareToken ? (
                                <Button
                                    className="h-10 flex-1 rounded-xl bg-emerald-600/80 text-xs font-semibold uppercase tracking-widest text-white shadow-lg shadow-emerald-700/20 transition-all hover:bg-emerald-600 hover:scale-[1.02]"
                                    onClick={() => onAction('continue', trip.id)}
                                >
                                    View Booking
                                </Button>
                            ) : (
                                <Button
                                    className="h-10 flex-1 rounded-xl bg-primary/90 text-xs font-semibold uppercase tracking-widest text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary hover:shadow-primary/30 hover:scale-[1.02]"
                                    onClick={() => onAction('continue', trip.id)}
                                >
                                    Continue Plan
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                disabled={!trip.passShareToken}
                                title={trip.passShareToken ? 'View your Travel Pass' : 'Complete booking to unlock your pass'}
                                className={`h-10 w-10 rounded-xl border-white/10 p-0 transition-all ${
                                    trip.passShareToken
                                        ? 'bg-primary/15 border-primary/30 text-primary hover:bg-primary/25 hover:border-primary/50'
                                        : 'bg-white/5 text-muted-foreground/40 cursor-not-allowed opacity-50'
                                }`}
                                onClick={() => onAction('view_ticket', trip.id)}
                            >
                                <Ticket className="h-4 w-4" />
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="outline"
                            className="h-10 w-full rounded-xl border-white/10 bg-white/5 text-xs uppercase tracking-widest hover:bg-white/10"
                            onClick={() => onAction('view_details', trip.id)}
                        >
                            View Details
                        </Button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
