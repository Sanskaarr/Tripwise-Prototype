'use client';

import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '@/store/profileStore';
import { Button } from '@/components/ui/button';
import { queueSync } from '@/lib/api/syncManager';
import { useShallow } from 'zustand/react/shallow';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Lightbulb, Gift } from 'lucide-react';

export default function PurposeStep() {
  const navigate = useNavigate();
  const { purpose, updateTravelPurpose, currentStep, profileId } = useProfileStore(useShallow(state => ({
    purpose: state.purpose,
    updateTravelPurpose: state.updateTravelPurpose,
    currentStep: state.currentStep,
    profileId: state.profileId
  })));

  const handlePurposeChange = (purposeType: 'vacation' | 'honeymoon' | 'family' | 'solo' | 'business' | 'religious') => {
    const data = { ...purpose, purpose: purposeType };
    updateTravelPurpose(data);
    if (profileId) {
      queueSync(profileId, 'purpose', data);
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
      className={`group relative p-5 rounded-xl border text-center transition-all duration-300 overflow-hidden ${selected
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
          What's the purpose of this trip?
        </h2>
        <p className="text-white/60 text-lg font-light">
          This helps us tailor the experience
        </p>
      </div>

      <div className="space-y-8">
        <div className="space-y-3">
          <Label className="text-sm font-medium tracking-wide text-white/80 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-primary" />
            Travel Purpose *
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {['vacation', 'honeymoon', 'family', 'solo', 'business', 'religious'].map((option) => (
              <SelectionCard
                key={option}
                selected={purpose.purpose === option}
                onClick={() => handlePurposeChange(option as any)}
                label={option.charAt(0).toUpperCase() + option.slice(1)}
              />
            ))}
          </div>
        </div>

        {/* Special Occasion - Show for certain purposes */}
        {(purpose.purpose === 'honeymoon' || purpose.purpose === 'family' || purpose.purpose === 'vacation') && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
            <Label className="text-sm font-medium tracking-wide text-white/80 flex items-center gap-2">
              <Gift className="w-4 h-4 text-primary" />
              Special Occasion (Optional)
            </Label>
            <Input
              type="text"
              value={purpose.specialOccasion || ''}
              onChange={(e) => {
                const data = { ...purpose, specialOccasion: e.target.value };
                updateTravelPurpose(data);
                if (profileId) queueSync(profileId, 'purpose', data);
              }}
              placeholder="e.g., Anniversary, Birthday, Graduation"
              className="glass-input"
            />
          </div>
        )}
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
