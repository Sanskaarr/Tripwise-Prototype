import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plane, Calendar, MapPin, QrCode, Share2, Download, Clock } from "lucide-react";
import { Trip } from "@/components/dashboard/TripCard";

interface TripDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    trip: Trip | null;
}

export function TripDetailsModal({ isOpen, onClose, trip }: TripDetailsModalProps) {
    if (!trip) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden bg-white text-black rounded-[2rem]">
                {/* Boarding Pass Style Header */}
                <div className="bg-primary p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-1/2 -translate-y-1/2">
                        <Plane className="w-64 h-64" />
                    </div>

                    <div className="relative z-10">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-80 mb-4">Boarding Pass</p>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-3xl font-display font-medium">BOM</p>
                                <p className="text-xs opacity-70">Mumbai</p>
                            </div>
                            <div className="flex flex-col items-center px-4">
                                <Plane className="w-6 h-6 rotate-90 mb-1" />
                                <div className="w-16 h-px bg-white/30 border-t border-dashed border-white/50" />
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-display font-medium">{trip.destination.substring(0, 3).toUpperCase()}</p>
                                <p className="text-xs opacity-70">{trip.destination}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ticket Body */}
                <div className="p-6 space-y-6 bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Passenger</p>
                            <p className="font-medium text-lg">Traveler</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Date</p>
                            <p className="font-medium text-lg">{trip.dates.split(' - ')[0]}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Flight</p>
                            <p className="font-medium text-lg">TW-404</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Class</p>
                            <p className="font-medium text-lg">Economy</p>
                        </div>
                    </div>

                    <div className="border-t border-dashed border-gray-200 pt-6">
                        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Booking Ref</p>
                                <p className="font-mono text-xl font-bold tracking-widest text-primary">{trip.bookingReference || 'TW-PENDING'}</p>
                            </div>
                            <QrCode className="w-12 h-12 text-gray-800" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="w-full rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50">
                            <Share2 className="w-4 h-4 mr-2" /> Share
                        </Button>
                        <Button className="w-full rounded-xl bg-black text-white hover:bg-gray-800">
                            <Download className="w-4 h-4 mr-2" /> Save PDF
                        </Button>
                    </div>
                </div>

                {/* Tear-off effect */}
                <div className="relative h-4 bg-gray-100 -mt-2">
                    <div className="absolute inset-x-0 bottom-0 h-4 bg-[linear-gradient(45deg,transparent_33.333%,#ffffff_33.333%,#ffffff_66.667%,transparent_66.667%),linear-gradient(-45deg,transparent_33.333%,#ffffff_33.333%,#ffffff_66.667%,transparent_66.667%)] [background-size:16px_32px] transform rotate-180"></div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
