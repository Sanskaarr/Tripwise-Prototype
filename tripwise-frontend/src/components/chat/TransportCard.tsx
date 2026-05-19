import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Train, Car, Bus, Clock, IndianRupee, CheckCircle } from 'lucide-react';

interface TransportCardProps {
    transport: {
        mode: string;
        cost: string;
        duration: string;
        details: string;
    };
    isSelected: boolean;
    onSelect: () => void;
    index: number;
    disabled?: boolean;
}

// Dynamic icon based on transport mode
const getTransportIcon = (mode: string) => {
    const lower = mode.toLowerCase();
    if (lower.includes('flight') || lower.includes('plane') || lower.includes('air')) return Plane;
    if (lower.includes('train') || lower.includes('rail') || lower.includes('metro')) return Train;
    if (lower.includes('bus')) return Bus;
    return Car; // Default for cab, taxi, uber, shuttle, etc.
};

const TransportCard: React.FC<TransportCardProps> = ({ transport, isSelected, onSelect, index, disabled }) => {
    const Icon = getTransportIcon(transport.mode);

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
            {isSelected && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 pointer-events-none" />
            )}

            <div className="relative z-10 space-y-3">
                {/* Mode + Icon */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-primary/20 text-primary' : 'bg-white/10 text-muted-foreground'
                            }`}>
                            <Icon className="w-4 h-4" />
                        </div>
                        <h3 className={`text-sm font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                            {transport.mode}
                        </h3>
                    </div>
                    {isSelected && <CheckCircle className="w-4 h-4 text-primary shrink-0" />}
                </div>

                {/* Cost + Duration */}
                <div className="flex items-center gap-4 pt-2 border-t border-white/5">
                    <div className="flex items-center gap-1">
                        <IndianRupee className="w-3 h-3 text-emerald-400" />
                        <span className="text-sm font-bold text-emerald-400">{transport.cost}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{transport.duration}</span>
                    </div>
                </div>

                {/* Details */}
                <p className="text-xs text-foreground/70 leading-relaxed">{transport.details}</p>
            </div>
        </motion.button>
    );
};

export default TransportCard;
