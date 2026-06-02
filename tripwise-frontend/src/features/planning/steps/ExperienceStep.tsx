
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '@/store/profileStore';
import { queueSync } from '@/lib/api/syncManager';
import { useShallow } from 'zustand/react/shallow';
import { Label } from '@/components/ui/label';
import { Compass, AlertTriangle, CheckCircle } from 'lucide-react';
import { ConversationalLayout } from '@/components/layout/ConversationalLayout';

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
      className={`group relative p-4 rounded-xl border text-center transition-all duration-300 capitalize overflow-hidden ${active
        ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
        : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
        }`}
    >
      <div className={`font-medium text-sm z-10 relative ${active ? 'text-primary' : 'text-foreground/90 group-hover:text-foreground'}`}>
        {label}
      </div>
      {active && (
        <div className="absolute top-2 right-2">
          <CheckCircle className="w-3 h-3 text-primary" />
        </div>
      )}
    </button>
  );

  return (
    <ConversationalLayout
      title="Travel Experience"
      description="Help us gauge your comfort level."
      currentStep={11}
      totalSteps={12}
      onNext={handleContinue}
      onBack={handleBack}
      canNext={true}
      nextLabel="Continue Step"
    >
      <div className="space-y-5">
        {/* Frequency */}
        <div className="space-y-3">
          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
            <Compass className="w-3 h-3 text-primary" />
            Travel Frequency
          </Label>
          <div className="grid grid-cols-3 gap-3">
            {['never', 'sometimes', 'frequent'].map((freq) => (
              <SelectionCard
                key={freq}
                active={experience.frequency === freq}
                onClick={() => handleFrequencyChange(freq as any)}
                label={freq === 'never' ? 'First Timer' : freq === 'sometimes' ? 'Occasional' : 'Frequent'}
              />
            ))}
          </div>
        </div>

        {/* Bad Experiences */}
        <div className="space-y-3">
          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
            <AlertTriangle className="w-3 h-3 text-primary" />
            Any concerns? (Optional)
          </Label>
          <textarea
            value={experience.badExperiences || ''}
            onChange={(e) => {
              const data = { ...experience, badExperiences: e.target.value };
              updateTravelExperience(data);
              if (profileId) queueSync(profileId, 'experience', data);
            }}
            placeholder="Tell us about any past issues so we can avoid them..."
            className="w-full min-h-[140px] rounded-xl border border-white/10 bg-white/5 p-4 text-base text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all resize-none"
          />
        </div>
      </div>
    </ConversationalLayout>
  );
}
