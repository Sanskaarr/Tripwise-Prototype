import { Clock, Calendar, IndianRupee } from 'lucide-react';

export function TripCard({ option, onSelect, selected }) {
  return (
    <div
      className={`group relative rounded-2xl p-6 cursor-pointer transition-all duration-300 border-2 hover-lift ${
        selected 
          ? 'border-aurora-blue bg-aurora-blue/10 shadow-lg shadow-aurora-blue/30' 
          : 'border-white/10 glassmorphism hover:border-aurora-blue/50'
      }`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-display font-bold text-ice-white mb-1">{option.name}</h3>
          <p className="text-sm text-ice-white/60 font-medium">{option.mode}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center text-2xl font-bold text-aurora-blue">
            <IndianRupee size={22} />
            <span>{option.price}</span>
          </div>
        </div>
      </div>
      
      <div className="flex gap-6 text-sm text-ice-white/70">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-aurora-purple" />
          <span>{option.duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-aurora-pink" />
          <span>{option.departure} - {option.arrival}</span>
        </div>
      </div>

      {selected && (
        <div className="absolute top-4 right-4 w-6 h-6 bg-aurora-blue rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
      )}
    </div>
  );
}
