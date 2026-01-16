'use client';

import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '@/store/profileStore';
import { Button } from '@/components/ui/button';
import { queueSync } from '@/lib/api/syncManager';
import { useShallow } from 'zustand/react/shallow';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Plane, Clock, Car } from 'lucide-react';

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
          ? 'border-primary/50 bg-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
          : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
        } ${className}`}
    >
      <div className={`font-medium text-base ${selected ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>
        {label}
      </div>
    </button>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl md:text-4xl font-display font-medium text-white tracking-tight">
          How would you like to travel?
        </h2>
        <p className="text-white/60 text-lg font-light">
          We'll help you get there comfortably
        </p>
      </div>

      <div className="space-y-8">
        <div className="space-y-3">
          <Label className="text-sm font-medium tracking-wide text-white/80 flex items-center gap-2">
            <Plane className="w-4 h-4 text-primary" />
            Transport Mode *
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

        <div className="space-y-3">
          <Label className="text-sm font-medium tracking-wide text-white/80 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Preferred Timing
          </Label>
          <Input
            type="text"
            value={transport.timingPreference || ''}
            onChange={handleTimingChange}
            placeholder="e.g., morning, evening, night"
            className="h-14 rounded-xl border-white/10 bg-white/5 text-lg text-white placeholder:text-white/20 focus:border-primary/50 focus:bg-white/10"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium tracking-wide text-white/80 flex items-center gap-2">
            <Car className="w-4 h-4 text-primary" />
            Additional Services
          </Label>
          <div className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/5">
            <input
              id="pickup-drop"
              type="checkbox"
              checked={transport.pickupDrop || false}
              onChange={(e) => handlePickupChange(e.target.checked)}
              className="w-5 h-5 rounded border-white/20 bg-white/10 text-primary focus:ring-primary/50"
            />
            <label htmlFor="pickup-drop" className="text-white/90 text-base cursor-pointer select-none">
              Need pickup & drop service
            </label>
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
