'use client';

import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '@/store/profileStore';
import { Button } from '@/components/ui/button';
import { queueSync } from '@/lib/api/syncManager';
import { useShallow } from 'zustand/react/shallow';
import { Label } from '@/components/ui/label';
import { Heart } from 'lucide-react';

export default function InterestsStep() {
  const navigate = useNavigate();
  const { interests, updateActivities, currentStep, profileId } = useProfileStore(useShallow(state => ({
    interests: state.interests,
    updateActivities: state.updateActivities,
    currentStep: state.currentStep,
    profileId: state.profileId
  })));

  const handleToggle = (key: keyof typeof interests) => {
    const data = { ...interests, [key]: !interests[key] };
    updateActivities(data);
    if (profileId) {
      queueSync(profileId, 'interests', data);
    }
  };

  const handleContinue = () => {
    navigate(`/plan/step/${currentStep + 1}`);
  };

  const handleBack = () => {
    navigate(`/plan/step/${currentStep - 1}`);
  };

  const InterestCard = ({
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
      className={`group relative p-4 rounded-xl border text-left transition-all duration-300 overflow-hidden ${active
          ? 'border-primary/50 bg-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
          : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
        }`}
    >
      <div className={`flex items-center gap-3 relative z-10 transition-colors ${active ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${active ? 'border-primary bg-primary text-white' : 'border-white/30 group-hover:border-white/50'
          }`}>
          {active && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
        </div>
        <span className="font-medium capitalize">{label.replace(/([A-Z])/g, ' $1').trim()}</span>
      </div>

      {active && (
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
      )}
    </button>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl md:text-4xl font-display font-medium text-white tracking-tight">
          What interests you most?
        </h2>
        <p className="text-white/60 text-lg font-light">
          Select up to 4 activities
        </p>
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-medium tracking-wide text-white/80 flex items-center gap-2">
          <Heart className="w-4 h-4 text-primary" />
          Your Interests
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {Object.keys(interests).map((key) => (
            <InterestCard
              key={key}
              active={interests[key as keyof typeof interests]}
              onClick={() => handleToggle(key as keyof typeof interests)}
              label={key}
            />
          ))}
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
