'use client';

import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '@/store/profileStore';
import { queueSync } from '@/lib/api/syncManager';
import { useShallow } from 'zustand/react/shallow';
import { Label } from '@/components/ui/label';
import { Lightbulb, Gift } from 'lucide-react';
import { ConversationalLayout } from '@/components/layout/ConversationalLayout';

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

  const isFormValid = !!purpose.purpose;

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
    </button>
  );

  return (
    <ConversationalLayout
      title="Why Are You Traveling?"
      description="Help us understand the goal of your trip."
      currentStep={7}
      totalSteps={12}
      onNext={handleContinue}
      onBack={handleBack}
      canNext={isFormValid}
      nextLabel="Continue Step"
    >
      <div className="space-y-5">
        <div className="space-y-3">
          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
            <Lightbulb className="w-3 h-3 text-primary" />
            Travel Purpose
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
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
              <Gift className="w-3 h-3 text-primary" />
              Special Occasion (Optional)
            </Label>
            <input
              type="text"
              value={purpose.specialOccasion || ''}
              onChange={(e) => {
                const data = { ...purpose, specialOccasion: e.target.value };
                updateTravelPurpose(data);
                if (profileId) queueSync(profileId, 'purpose', data);
              }}
              placeholder="e.g., Anniversary, Birthday..."
              className="glass-input h-12"
            />
          </div>
        )}
      </div>
    </ConversationalLayout>
  );
}
