import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, IndianRupee, Star } from 'lucide-react';

interface HotelCardProps {
    hotel: {
        name: string;
        address: string;
        costPerNight: string;
        reason: string;
    };
    isSelected: boolean;
    onSelect: () => void;
    index: number;
    disabled?: boolean;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, isSelected, onSelect, index, disabled }) => {
    return (
        <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            onClick={disabled ? undefined : onSelect}
            disabled={disabled}
            className={`group relative text-left rounded-2xl border p-5 transition-all duration-300 overflow-hidden ${disabled && !isSelected
                ? 'border-white/5 bg-white/[0.01] opacity-50 cursor-not-allowed'
                : isSelected
                    ? 'border-primary/50 bg-primary/10 shadow-[0_0_30px_rgba(59,130,246,0.15)] scale-[1.02]'
                    : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20 hover:scale-[1.01]'
                }`}
        >
            {/* Glow effect on selection */}
            {isSelected && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 pointer-events-none" />
            )}

            <div className="relative z-10 space-y-3">
                {/* Hotel Name */}
                <div className="flex items-start justify-between gap-2">
                    <h3 className={`text-sm font-semibold leading-tight ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                        {hotel.name}
                    </h3>
                    {isSelected && <Star className="w-4 h-4 text-primary shrink-0 fill-primary" />}
                </div>

                {/* Address */}
                <div className="flex items-start gap-1.5">
                    <MapPin className="w-3 h-3 text-muted-foreground mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground leading-relaxed">{hotel.address}</p>
                </div>

                {/* Cost */}
                <div className="flex items-center gap-1.5 pt-2 border-t border-white/5">
                    <IndianRupee className="w-3 h-3 text-emerald-400" />
                    <span className="text-sm font-bold text-emerald-400">{hotel.costPerNight}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">/night</span>
                </div>

                {/* AI Reason */}
                <p className="text-xs text-foreground/60 italic leading-relaxed">&ldquo;{hotel.reason}&rdquo;</p>
            </div>
        </motion.button>
    );
};

export default HotelCard;
