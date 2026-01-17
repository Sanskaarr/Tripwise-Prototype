'use client';

import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '@/store/profileStore';
import { queueSync } from '@/lib/api/syncManager';
import { useShallow } from 'zustand/react/shallow';
import { Label } from '@/components/ui/label';
import { Map, Plane, Compass, CheckCircle } from 'lucide-react';
import { ConversationalLayout } from '@/components/layout/ConversationalLayout';

export default function DestinationStep() {
  const navigate = useNavigate();
  const {
    destination,
    updateDestinationPreference,
    goToNextStep,
    goToPrevStep,
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
      // Could animate error
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

  const isFormValid = !!destination.destination;

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
      className={`group relative p-4 rounded-xl border text-left transition-all duration-300 overflow-hidden ${selected
        ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
        : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
        } ${className}`}
    >
      <div className="relative z-10 flex items-start justify-between gap-2">
        <div>
          <div className={`font-medium text-sm mb-0.5 ${selected ? 'text-primary' : 'text-foreground/90 group-hover:text-foreground'}`}>
            {label}
          </div>
          {desc && (
            <div className={`text-xs leading-relaxed ${selected ? 'text-primary/70' : 'text-muted-foreground group-hover:text-muted-foreground/80'}`}>
              {desc}
            </div>
          )}
        </div>
        {selected && (
          <CheckCircle className="w-4 h-4 text-primary shrink-0" />
        )}
      </div>
    </button>
  );

  return (
    <ConversationalLayout
      title="Where Are You Heading?"
      description="Tell us about your dream destination."
      currentStep={3}
      totalSteps={12}
      onNext={handleContinue}
      onBack={handleBack}
      canNext={isFormValid}
      nextLabel="Continue Step"
    >
      <div className="space-y-5">
        {/* Main Destination Input */}
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
            <Map className="w-3 h-3 text-primary" />
            Destination
          </Label>
          <input
            type="text"
            value={destination.destination || ''}
            onChange={(e) => {
              const newDest = { ...destination, destination: e.target.value };
              updateDestinationPreference(newDest);
              if (profileId) queueSync(profileId, 'destination', newDest);
            }}
            className="glass-input h-12 text-lg font-medium placeholder:font-normal"
            placeholder="e.g., Paris, Bali, New York"
            autoFocus
          />
        </div>

        {/* Travel Type */}
        <div className="space-y-3">
          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
            <Plane className="w-3 h-3 text-primary" />
            Travel Scope
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'domestic', label: 'Domestic', desc: 'Within country' },
              { value: 'international', label: 'International', desc: 'Abroad' }
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

        {/* Interests Grid - Compact */}
        <div className="space-y-3">
          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
            <Compass className="w-3 h-3 text-primary" />
            Vibe Preference
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'mountains', label: 'Mountains' },
              { value: 'beach', label: 'Beach' },
              { value: 'city', label: 'City' },
              { value: 'spiritual', label: 'Spirit' },
              { value: 'adventure', label: 'Action' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => updateDestinationPreference({ preferenceType: option.value as any })}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${destination.preferenceType === option.value
                    ? 'border-primary bg-primary/10 text-primary font-medium shadow-sm'
                    : 'border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground'
                  }`}
              >
                <span className="text-xs">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* First Visit Toggle */}
        <div className="space-y-2 pt-2 border-t border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground/80">Is this your first visit?</span>
            <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
              {[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ].map((option) => (
                <button
                  key={option.value.toString()}
                  onClick={() => updateDestinationPreference({ isFirstVisit: option.value })}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${destination.isFirstVisit === option.value
                      ? 'bg-foreground text-background shadow-md'
                      : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ConversationalLayout>
  );
}
