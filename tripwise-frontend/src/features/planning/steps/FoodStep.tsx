
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '@/store/profileStore';
import { queueSync } from '@/lib/api/syncManager';
import { useShallow } from 'zustand/react/shallow';
import { Label } from '@/components/ui/label';
import { Utensils, AlertCircle } from 'lucide-react';
import { ConversationalLayout } from '@/components/layout/ConversationalLayout';

export default function FoodStep() {
  const navigate = useNavigate();
  const { food, updateFoodPreference, currentStep, profileId } = useProfileStore(useShallow(state => ({
    food: state.food,
    updateFoodPreference: state.updateFoodPreference,
    currentStep: state.currentStep,
    profileId: state.profileId
  })));

  const handleTypeChange = (type: 'veg' | 'non-veg' | 'both') => {
    const data = { ...food, type };
    updateFoodPreference(data);
    if (profileId) {
      queueSync(profileId, 'food', data);
    }
  };

  const handleContinue = () => {
    navigate(`/plan/step/${currentStep + 1}`);
  };

  const handleBack = () => {
    navigate(`/plan/step/${currentStep - 1}`);
  };

  // Using a simplified Pill component for food types
  const FoodPill = ({
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
      className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold uppercase tracking-wide transition-all duration-300 ${active
        ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-[1.02]'
        : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white'
        }`}
    >
      {label}
    </button>
  );

  return (
    <ConversationalLayout
      title="Any Dietary Preferences?"
      description="We'll find the best spots for you."
      currentStep={9}
      totalSteps={12}
      onNext={handleContinue}
      onBack={handleBack}
      canNext={!!food.type}
      nextLabel="Continue Step"
    >
      <div className="space-y-5">
        <div className="space-y-4">
          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
            <Utensils className="w-3 h-3 text-primary" />
            Diet Type
          </Label>
          <div className="flex gap-3 bg-white/5 p-2 rounded-2xl border border-white/10">
            {['veg', 'non-veg', 'both'].map((type) => (
              <FoodPill
                key={type}
                active={food.type === type}
                onClick={() => handleTypeChange(type as any)}
                label={type === 'non-veg' ? 'Non-Veg' : type}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
            <AlertCircle className="w-3 h-3 text-primary" />
            Allergies (Optional)
          </Label>
          <input
            type="text"
            value={food.allergies || ''}
            onChange={(e) => {
              const data = { ...food, allergies: e.target.value };
              updateFoodPreference(data);
              if (profileId) queueSync(profileId, 'food', data);
            }}
            placeholder="e.g., Peanuts, Shellfish..."
            className="glass-input h-12"
          />
        </div>
      </div>
    </ConversationalLayout>
  );
}
