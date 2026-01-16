'use client';

import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '@/store/profileStore';
import { Button } from '@/components/ui/button';
import { queueSync } from '@/lib/api/syncManager';
import { useShallow } from 'zustand/react/shallow';
import { Label } from '@/components/ui/label';
import { Hotel, Bed, Accessibility } from 'lucide-react';

export default function AccommodationStep() {
  const navigate = useNavigate();
  const {
    accommodation,
    updateAccommodationPreference,
    currentStep,
    profileId
  } = useProfileStore(useShallow(state => ({
    accommodation: state.accommodation,
    updateAccommodationPreference: state.updateAccommodationPreference,
    currentStep: state.currentStep,
    profileId: state.profileId
  })));

  const handleCategoryChange = (category: 'budget' | 'mid-range' | 'luxury' | 'resort' | 'homestay') => {
    const data = { ...accommodation, category };
    updateAccommodationPreference(data);
    if (profileId) {
      queueSync(profileId, 'accommodation', data);
    }
  };

  const handleRoomTypeChange = (roomType: 'single' | 'double' | 'twin' | 'family' | 'dorm') => {
    const data = { ...accommodation, roomType };
    updateAccommodationPreference(data);
    if (profileId) {
      queueSync(profileId, 'accommodation', data);
    }
  };

  const handleContinue = () => {
    navigate(`/plan/step/${currentStep + 1}`);
  };

  const handleBack = () => {
    navigate(`/plan/step/${currentStep - 1}`);
  };

  const GlassButton = ({
    active,
    onClick,
    children,
    className = ""
  }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
  }) => (
    <button
      onClick={onClick}
      className={`relative px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-300 capitalize overflow-hidden ${active
          ? 'border-primary/50 bg-primary/20 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]'
          : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/20'
        } ${className}`}
    >
      {active && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      )}
      <div className="relative z-10">{children}</div>
    </button>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl md:text-4xl font-display font-medium text-white tracking-tight">
          Where would you prefer to stay?
        </h2>
        <p className="text-white/60 text-lg font-light">
          Your comfort matters to us
        </p>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <Label className="text-sm font-medium tracking-wide text-white/80 flex items-center gap-2">
            <Hotel className="w-4 h-4 text-primary" />
            Hotel Category
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {['budget', 'mid-range', 'luxury', 'resort', 'homestay'].map((cat) => (
              <GlassButton
                key={cat}
                active={accommodation.category === cat}
                onClick={() => handleCategoryChange(cat as any)}
              >
                {cat.replace('-', ' ')}
              </GlassButton>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-sm font-medium tracking-wide text-white/80 flex items-center gap-2">
            <Bed className="w-4 h-4 text-primary" />
            Room Type
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {['single', 'double', 'twin', 'family', 'dorm'].map((room) => (
              <GlassButton
                key={room}
                active={accommodation.roomType === room}
                onClick={() => handleRoomTypeChange(room as any)}
              >
                {room}
              </GlassButton>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-sm font-medium tracking-wide text-white/80 flex items-center gap-2">
            <Accessibility className="w-4 h-4 text-primary" />
            Special Needs (Optional)
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {['WiFi', 'Breakfast', 'Parking', 'Pool', 'Gym', 'Spa'].map((need) => {
              const needLower = need.toLowerCase();
              const isSelected = accommodation.specialNeeds?.includes(needLower) || false;

              return (
                <GlassButton
                  key={need}
                  active={isSelected}
                  onClick={() => {
                    const currentNeeds = accommodation.specialNeeds || [];
                    const newNeeds = isSelected
                      ? currentNeeds.filter(n => n !== needLower)
                      : [...currentNeeds, needLower];

                    const data = { ...accommodation, specialNeeds: newNeeds };
                    updateAccommodationPreference(data);
                    if (profileId) queueSync(profileId, 'accommodation', data);
                  }}
                >
                  {need}
                </GlassButton>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          onClick={handleBack}
          variant="outline"
          size="lg"
          className="flex-1 h-14 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
        >
          Back
        </Button>
        <Button
          onClick={handleContinue}
          size="lg"
          className="flex-[2] h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-lg font-bold tracking-widest uppercase hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.01] transition-all duration-300"
        >
          Continue Step
        </Button>
      </div>
    </div>
  );
}
