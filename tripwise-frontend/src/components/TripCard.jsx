import { Clock, Calendar, IndianRupee } from 'lucide-react';

export function TripCard({ option, onSelect, selected }) {
  return (
    <div
      className={`group relative rounded-2xl p-6 cursor-pointer transition-all duration-300 border-2 ${
        selected 
          ? 'border-primary bg-primary/10 shadow-lg shadow-primary/30' 
          : 'border-white/10 glassmorphism hover:border-primary/50'
      }`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{option.name}</h3>
          <p className="text-sm text-gray-400 font-medium">{option.mode}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center text-2xl font-bold text-primary">
            <IndianRupee size={22} />
            <span>{option.price}</span>
          </div>
        </div>
      </div>
      
      <div className="flex gap-6 text-sm text-gray-300">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-accent" />
          <span>{option.duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-primary" />
          <span>{option.departure} - {option.arrival}</span>
        </div>
      </div>

      {selected && (
        <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
      )}
    </div>
  );
}
