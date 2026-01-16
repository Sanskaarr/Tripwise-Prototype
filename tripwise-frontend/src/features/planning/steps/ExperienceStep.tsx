'use client';

import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '@/store/profileStore';
import { Button } from '@/components/ui/button';
import { queueSync } from '@/lib/api/syncManager';
import { useShallow } from 'zustand/react/shallow';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Compass, AlertTriangle } from 'lucide-react';

export default function ExperienceStep() {
  const navigate = useNavigate();
  const { experience, updateTravelExperience, currentStep, profileId } = useProfileStore(useShallow(state => ({
    experience: state.experience,
    updateTravelExperience: state.updateTravelExperience,
    currentStep: state.currentStep,
    profileId: state.profileId
  })));

  const handleFrequencyChange = (frequency: 'never' | 'sometimes' | 'frequent') => {
    const data = { ...experience, frequency };
    updateTravelExperience(data);
    if (profileId) {
      queueSync(profileId, 'experience', data);
    }
  };

  const handleContinue = () => {
    navigate(`/plan/step/${currentStep + 1}`);
  };

  const handleBack = () => {
    navigate(`/plan/step/${currentStep - 1}`);
  };

  const SelectionCard = ({
    active,
    onClick,
    label
  }: {
    active: boolean;
    onClick: () => void;
    label: string;
  }) => (
    <button
      onClick={onClick}
      className={`relative p-5 rounded-xl border text-center transition-all duration-300 capitalize overflow-hidden ${active
        ? 'border-primary/50 bg-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
        : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
        }`}
    >
      <div className={`font-medium text-lg relative z-10 ${active ? 'text-white' : 'text-white/80'}`}>
        {label}
      </div>
      {active && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      )}
    </button>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl md:text-4xl font-display font-medium text-white tracking-tight">
          Share your travel experience
        </h2>
        <p className="text-white/60 text-lg font-light">
          This is optional but helps us understand you better
        </p>
      </div>

      <div className="space-y-8">
        <div className="space-y-3">
          <Label className="text-sm font-medium tracking-wide text-white/80 flex items-center gap-2">
            <Compass className="w-4 h-4 text-primary" />
            How often do you travel?
          </Label>
          <div className="grid grid-cols-3 gap-3">
            {['never', 'sometimes', 'frequent'].map((freq) => (
              <SelectionCard
                key={freq}
                active={experience.frequency === freq}
                onClick={() => handleFrequencyChange(freq as any)}
                label={freq === 'never' ? 'First Time' : freq}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium tracking-wide text-white/80 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-primary" />
            Any bad experiences? (Optional)
          </Label>
          <Textarea
            value={experience.badExperiences || ''}
            onChange={(e) => {
              const data = { ...experience, badExperiences: e.target.value };
              updateTravelExperience(data);
              if (profileId) queueSync(profileId, 'experience', data);
            }}
            placeholder="Tell us so we can help you avoid them..."
            className="min-h-[140px] rounded-xl border-white/10 bg-white/5 text-lg text-white placeholder:text-white/20 focus:border-primary/50 focus:bg-white/10"
          />
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
