'use client';

import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '@/store/profileStore';
import { queueSync } from '@/lib/api/syncManager';
import { useShallow } from 'zustand/react/shallow';
import { Label } from '@/components/ui/label';
import { Heart, CheckCircle } from 'lucide-react';
import { ConversationalLayout } from '@/components/layout/ConversationalLayout';

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
      className={`group relative p-3 rounded-xl border text-left transition-all duration-300 overflow-hidden ${active
        ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
        : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
        }`}
    >
      <div className="flex items-center justify-between gap-2 relative z-10 p-1">
        <span className={`font-medium capitalize text-sm ${active ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
          {label.replace(/([A-Z])/g, ' $1').trim()}
        </span>

        {active && <CheckCircle className="w-4 h-4 text-primary" />}
      </div>
    </button>
  );

  return (
    <ConversationalLayout
      title="What Interests You?"
      description="Pick things you love doing."
      currentStep={8}
      totalSteps={12}
      onNext={handleContinue}
      onBack={handleBack}
      canNext={true} // Interests can be optional
      nextLabel="Continue Step"
    >
      <div className="space-y-4">
        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
          <Heart className="w-3 h-3 text-primary" />
          Activities
        </Label>

        {/* Scrollable Grid Area */}
        <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {Object.keys(interests).map((key) => (
            <InterestCard
              key={key}
              active={interests[key as keyof typeof interests]}
              onClick={() => handleToggle(key as keyof typeof interests)}
              label={key}
            />
          ))}
        </div>

        <div className="text-xs text-center text-white/40 pt-2">
          Scroll for more options
        </div>
      </div>
    </ConversationalLayout>
  );
}
