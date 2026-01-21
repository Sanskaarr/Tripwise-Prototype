'use client';

import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '@/store/profileStore';
import { queueSync } from '@/lib/api/syncManager';
import { useShallow } from 'zustand/react/shallow';
import { Label } from '@/components/ui/label';
import { Hotel, Bed, Accessibility } from 'lucide-react';
import { ConversationalLayout } from '@/components/layout/ConversationalLayout';

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

  const Pill = ({
    active,
    onClick,
    children,
  }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wider transition-all duration-200 ${active
        ? 'border-primary bg-primary/10 text-primary shadow-sm'
        : 'border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground'
        }`}
    >
      {children}
    </button>
  );

  return (
    <ConversationalLayout
      title="Where Will You Stay?"
      description="Choose your comfort level and preferences."
      currentStep={5}
      totalSteps={12}
      onNext={handleContinue}
      onBack={handleBack}
      canNext={true} // Accommodation is often optional or loaded with defaults? Assuming true for now.
      nextLabel="Continue Step"
    >
      <div className="space-y-5">
        {/* Hotel Category */}
        <div className="space-y-3">
          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
            <Hotel className="w-3 h-3 text-primary" />
            Category
          </Label>
          <div className="flex flex-wrap gap-2">
            {['budget', 'mid-range', 'luxury', 'resort', 'homestay'].map((cat) => (
              <Pill
                key={cat}
                active={accommodation.category === cat}
                onClick={() => handleCategoryChange(cat as any)}
              >
                {cat.replace('-', ' ')}
              </Pill>
            ))}
          </div>
        </div>

        {/* Room Type */}
        <div className="space-y-3">
          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
            <Bed className="w-3 h-3 text-primary" />
            Room Type
          </Label>
          <div className="flex flex-wrap gap-2">
            {['single', 'double', 'twin', 'family', 'dorm'].map((room) => (
              <Pill
                key={room}
                active={accommodation.roomType === room}
                onClick={() => handleRoomTypeChange(room as any)}
              >
                {room}
              </Pill>
            ))}
          </div>
        </div>

        {/* Special Needs */}
        <div className="space-y-3">
          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
            <Accessibility className="w-3 h-3 text-primary" />
            Amenities (Optional)
          </Label>
          <div className="flex flex-wrap gap-2">
            {['WiFi', 'Breakfast', 'Parking', 'Pool', 'Gym', 'Spa'].map((need) => {
              const needLower = need.toLowerCase();
              const isSelected = accommodation.specialNeeds?.includes(needLower) || false;

              return (
                <Pill
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
                </Pill>
              );
            })}
          </div>
        </div>
      </div>
    </ConversationalLayout>
  );
}
