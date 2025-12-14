"use client";

import { Train, Plane, Bus, Clock, IndianRupee } from "lucide-react";
import type { TravelOption, Hotel } from "@/lib/api";

const modeIcons = {
  train: Train,
  flight: Plane,
  bus: Bus,
};

const modeColors = {
  train: "from-orange-500 to-red-500",
  flight: "from-sky-500 to-blue-600",
  bus: "from-emerald-500 to-teal-600",
};

interface TripCardProps {
  option: TravelOption;
  selected?: boolean;
  onSelect: () => void;
}

export function TripCard({ option, selected, onSelect }: TripCardProps) {
  const Icon = modeIcons[option.type];
  const gradient = modeColors[option.type];

  return (
    <button
      onClick={onSelect}
      className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
        selected
          ? "border-sky-500 bg-sky-50 shadow-lg shadow-sky-100"
          : "border-slate-100 bg-white hover:border-sky-200 hover:shadow-md"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-slate-800 truncate">{option.name}</h3>
              <p className="text-sm text-slate-500">{option.class}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center text-lg font-bold text-emerald-600">
                <IndianRupee className="w-4 h-4" />
                {option.price.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-4 text-sm text-slate-600">
            <span>{option.departure}</span>
            <div className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3 h-3" />
              {option.duration}
            </div>
            <span>{option.arrival}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

interface HotelCardProps {
  hotel: Hotel;
  selected?: boolean;
  onSelect: () => void;
}

export function HotelCard({ hotel, selected, onSelect }: HotelCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`w-full rounded-2xl border-2 overflow-hidden transition-all text-left ${
        selected
          ? "border-sky-500 shadow-lg shadow-sky-100"
          : "border-slate-100 hover:border-sky-200 hover:shadow-md"
      }`}
    >
      <div className="h-32 bg-slate-200 relative">
        <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur rounded-lg text-sm font-medium">
          {"⭐".repeat(hotel.rating)}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-800">{hotel.name}</h3>
        <div className="flex flex-wrap gap-1 mt-2">
          {hotel.amenities.slice(0, 3).map((amenity) => (
            <span key={amenity} className="px-2 py-0.5 bg-slate-100 rounded text-xs text-slate-600">
              {amenity}
            </span>
          ))}
        </div>
        <div className="mt-3 flex items-center text-emerald-600 font-bold">
          <IndianRupee className="w-4 h-4" />
          {hotel.pricePerNight.toLocaleString()}
          <span className="text-sm font-normal text-slate-400 ml-1">/night</span>
        </div>
      </div>
    </button>
  );
}
