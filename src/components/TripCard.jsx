import { Clock, Calendar, IndianRupee } from 'lucide-react';

export function TripCard({ option, onSelect, selected }) {
  return (
    <div
      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
        selected ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-400'
      }`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{option.name}</h3>
          <p className="text-sm text-gray-600">{option.mode}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center text-xl font-bold text-blue-600">
            <IndianRupee size={20} />
            <span>{option.price}</span>
          </div>
        </div>
      </div>
      
      <div className="flex gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Clock size={16} />
          <span>{option.duration}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar size={16} />
          <span>{option.departure} - {option.arrival}</span>
        </div>
      </div>
    </div>
  );
}
