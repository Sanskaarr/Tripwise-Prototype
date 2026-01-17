'use client';

import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '@/store/profileStore';
import { queueSync } from '@/lib/api/syncManager';
import { useShallow } from 'zustand/react/shallow';
import { Label } from '@/components/ui/label';
import { Plane, Clock, Car, CheckCircle } from 'lucide-react';
import { ConversationalLayout } from '@/components/layout/ConversationalLayout';

export default function TransportStep() {
  const navigate = useNavigate();
  const { transport, updateTransportPreference, currentStep, profileId } = useProfileStore(useShallow(state => ({
    transport: state.transport,
    updateTransportPreference: state.updateTransportPreference,
    currentStep: state.currentStep,
    profileId: state.profileId
  })));

  const handleModeChange = (mode: 'flight' | 'train' | 'bus' | 'own-vehicle') => {
    const data = { ...transport, mode };
    updateTransportPreference(data);
    if (profileId) {
      queueSync(profileId, 'transport', data);
    }
  };

  const handleTimingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const data = { ...transport, timingPreference: e.target.value };
    updateTransportPreference(data);
    if (profileId) {
      queueSync(profileId, 'transport', data);
    }
  };

  const handlePickupChange = (pickupDrop: boolean) => {
    const data = { ...transport, pickupDrop };
    updateTransportPreference(data);
    if (profileId) {
      queueSync(profileId, 'transport', data);
    }
  };

  const handleContinue = () => {
    navigate(`/plan/step/${currentStep + 1}`);
  };

  const handleBack = () => {
    navigate(`/plan/step/${currentStep - 1}`);
  };

  const isFormValid = !!transport.mode;

  const SelectionCard = ({
    selected,
    onClick,
    label,
    className = ""
  }: {
    selected: boolean;
    onClick: () => void;
    label: string;
    className?: string;
  }) => (
    <button
      onClick={onClick}
      className={`group relative p-4 rounded-xl border text-center transition-all duration-300 overflow-hidden ${selected
        ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
        : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
        } ${className}`}
    >
      <div className={`font-medium text-sm ${selected ? 'text-primary' : 'text-foreground/90 group-hover:text-foreground'}`}>
        {label}
      </div>
      {selected && (
        <div className="absolute top-2 right-2">
          <CheckCircle className="w-3 h-3 text-primary" />
        </div>
      )}
    </button>
  );

  return (
    <ConversationalLayout
      title="How Will You Get There?"
      description="Choose your preferred mode of transport."
      currentStep={6}
      totalSteps={12}
      onNext={handleContinue}
      onBack={handleBack}
      canNext={isFormValid}
      nextLabel="Continue Step"
    >
      <div className="space-y-5">
        {/* Transport Mode */}
        <div className="space-y-3">
          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
            <Plane className="w-3 h-3 text-primary" />
            Transport Mode
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {['flight', 'train', 'bus', 'own-vehicle'].map((option) => (
              <SelectionCard
                key={option}
                selected={transport.mode === option}
                onClick={() => handleModeChange(option as any)}
                label={option === 'own-vehicle' ? 'Own Vehicle' : option.charAt(0).toUpperCase() + option.slice(1)}
              />
            ))}
          </div>
        </div>

        {/* Preferred Timing */}
        <div className="space-y-3">
          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
            <Clock className="w-3 h-3 text-primary" />
            Preferred Timing
          </Label>
          <input
            type="text"
            value={transport.timingPreference || ''}
            onChange={handleTimingChange}
            placeholder="e.g., Early morning, Late night"
            className="glass-input h-12"
          />
        </div>

        {/* Pickup Service Toggle */}
        <div className="pt-2 border-t border-white/5">
          <div className="flex items-center justify-between p-1">
            <Label className="text-sm font-medium text-foreground/80 flex items-center gap-2 cursor-pointer" onClick={() => handlePickupChange(!transport.pickupDrop)}>
              <Car className="w-4 h-4 text-primary" />
              Request Pickup & Drop Service?
            </Label>

            <button
              onClick={() => handlePickupChange(!transport.pickupDrop)}
              className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${transport.pickupDrop ? 'bg-primary' : 'bg-white/10'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${transport.pickupDrop ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </div>
    </ConversationalLayout>
  );
}
