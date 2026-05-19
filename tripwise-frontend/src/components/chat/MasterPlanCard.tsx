import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import MasterPlanView from '@/features/wizard/MasterPlanView';

interface MasterPlanCardProps {
  plan: string;
  onPlanAnother?: () => void;
}

const MasterPlanCard: React.FC<MasterPlanCardProps> = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {/* Header badge */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
          <Sparkles className="w-3 h-3 text-primary" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/70">
          Your Master Itinerary
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-primary/20 to-transparent" />
      </div>

      {/* Plan card */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.02] backdrop-blur-md overflow-hidden shadow-xl shadow-black/20">
        <div className="p-5">
          <MasterPlanView embedded />
        </div>
      </div>
    </motion.div>
  );
};

export default MasterPlanCard;
