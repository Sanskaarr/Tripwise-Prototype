'use client';

import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '@/store/profileStore';
import { Button } from '@/components/ui/button';
import { queueSync } from '@/lib/api/syncManager';
import { useShallow } from 'zustand/react/shallow';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Map, Plane, Compass, CheckCircle } from 'lucide-react';

export default function DestinationStep() {
  const navigate = useNavigate();
  const {
    destination,
    updateDestinationPreference,
    goToNextStep,
    currentStep,
    profileId
  } = useProfileStore(useShallow(state => ({
    destination: state.destination,
    updateDestinationPreference: state.updateDestinationPreference,
    goToNextStep: state.goToNextStep,
    goToPrevStep: state.goToPrevStep,
    currentStep: state.currentStep,
    profileId: state.profileId
  })));

  const handleContinue = () => {
    if (!destination.destination) {
      alert('Please select a destination');
      return;
    }
    goToNextStep();
    const nextStep = currentStep + 1;
    navigate(`/plan/step/${nextStep}`);
  };

  const handleBack = () => {
    const prevStep = currentStep - 1;
    navigate(`/plan/step/${prevStep}`);
  };

  const SelectionCard = ({
    selected,
    onClick,
    label,
    desc,
    className = ""
  }: {
    selected: boolean;
    onClick: () => void;
    label: string;
    desc?: string;
    className?: string;
  }) => (
    <button
      onClick={onClick}
      className={`group relative p-6 rounded-2xl border text-left transition-all duration-300 overflow-hidden ${selected
          ? 'border-primary/50 bg-primary/20 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
          : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
        } ${className}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-500 ${selected ? 'opacity-100' : 'group-hover:opacity-100'}`} />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <div className={`font-medium text-lg mb-1 ${selected ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>
            {label}
          </div>
          {desc && (
            <div className={`text-sm ${selected ? 'text-white/70' : 'text-white/50 group-hover:text-white/60'}`}>
              {desc}
            </div>
          )}
        </div>
        {selected && <CheckCircle className="w-5 h-5 text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" />}
      </div>
    </button>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl md:text-4xl font-display font-medium text-white tracking-tight">
          Where would you like to travel?
        </h2>
        <p className="text-white/60 text-lg font-light">
          Tell us about your destination preferences
        </p>
      </div>

      <div className="space-y-8">
        <div className="space-y-3">
          <Label className="text-sm font-medium tracking-wide text-white/80 flex items-center gap-2">
            <Map className="w-4 h-4 text-primary" />
            Destination
          </Label>
          <Input
            type="text"
            value={destination.destination || ''}
            onChange={(e) => {
              const newDest = { ...destination, destination: e.target.value };
              updateDestinationPreference(newDest);
              if (profileId) queueSync(profileId, 'destination', newDest);
            }}
            className="h-14 rounded-xl border-white/10 bg-white/5 text-lg text-white placeholder:text-white/20 focus:border-primary/50 focus:bg-white/10"
            placeholder="e.g., Paris, Bali, New York"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium tracking-wide text-white/80 flex items-center gap-2">
            <Plane className="w-4 h-4 text-primary" />
            Travel Type
          </Label>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { value: 'domestic', label: 'Domestic Travel', desc: 'Explore within your country' },
              { value: 'international', label: 'International Travel', desc: 'Discover new countries' }
            ].map((option) => (
              <SelectionCard
                key={option.value}
                selected={destination.travelType === option.value}
                onClick={() => updateDestinationPreference({ travelType: option.value as 'domestic' | 'international' })}
                label={option.label}
                desc={option.desc}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium tracking-wide text-white/80 flex items-center gap-2">
            <Compass className="w-4 h-4 text-primary" />
            What interests you most?
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { value: 'mountains', label: 'Mountains', desc: 'Hills & peaks' },
              { value: 'beach', label: 'Beach', desc: 'Sun & sand' },
              { value: 'city', label: 'City', desc: 'Urban life' },
              { value: 'spiritual', label: 'Spiritual', desc: 'Culture & peace' },
              { value: 'adventure', label: 'Adventure', desc: 'Thrills' }
            ].map((option) => (
              <SelectionCard
                key={option.value}
                selected={destination.preferenceType === option.value}
                onClick={() => updateDestinationPreference({ preferenceType: option.value as any })}
                label={option.label}
                desc={option.desc}
                className="p-4"
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium tracking-wide text-white/80">
            Is this your first visit?
          </Label>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: true, label: 'First Visit' },
              { value: false, label: 'Revisiting' }
            ].map((option) => (
              <SelectionCard
                key={option.value.toString()}
                selected={destination.isFirstVisit === option.value}
                onClick={() => updateDestinationPreference({ isFirstVisit: option.value })}
                label={option.label}
              />
            ))}
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
