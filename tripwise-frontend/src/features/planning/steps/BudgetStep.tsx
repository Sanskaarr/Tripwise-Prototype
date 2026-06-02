
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '@/store/profileStore';
import { queueSync } from '@/lib/api/syncManager';
import { useShallow } from 'zustand/react/shallow';
import { Label } from '@/components/ui/label';
import { Wallet, CheckCircle } from 'lucide-react';
import { ConversationalLayout } from '@/components/layout/ConversationalLayout';

export default function BudgetStep() {
  const navigate = useNavigate();
  const {
    budget,
    updateBudgetPreference,
    goToNextStep,
    goToPrevStep,
    currentStep,
    profileId
  } = useProfileStore(useShallow(state => ({
    budget: state.budget,
    updateBudgetPreference: state.updateBudgetPreference,
    goToNextStep: state.goToNextStep,
    goToPrevStep: state.goToPrevStep,
    currentStep: state.currentStep,
    profileId: state.profileId
  })));

  const handleContinue = () => {
    if (!budget.level) return;
    goToNextStep();
    const nextStep = currentStep + 1;
    navigate(`/plan/step/${nextStep}`);
  };

  const handleBack = () => {
    const prevStep = currentStep - 1;
    navigate(`/plan/step/${prevStep}`);
  };

  const isFormValid = !!budget.level;

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
          <div className={`font-medium text-sm mb-1 ${selected ? 'text-primary' : 'text-foreground/90 group-hover:text-foreground'}`}>
            {label}
          </div>
          {desc && (
            <div className={`text-xs leading-relaxed ${selected ? 'text-primary/70' : 'text-muted-foreground group-hover:text-muted-foreground/80'}`}>
              {desc}
            </div>
          )}
        </div>
        {selected && <CheckCircle className="w-4 h-4 text-primary shrink-0" />}
      </div>
    </button>
  );

  return (
    <ConversationalLayout
      title="What's Your Budget?"
      description="We'll tailor recommendations to fit your range."
      currentStep={4}
      totalSteps={12}
      onNext={handleContinue}
      onBack={handleBack}
      canNext={isFormValid}
      nextLabel="Continue Step"
    >
      <div className="space-y-5">
        {/* Budget Level Grid */}
        <div className="space-y-3">
          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
            <Wallet className="w-3 h-3 text-primary" />
            Budget Level
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'low', label: 'Economy', desc: 'Budget-friendly' },
              { value: 'medium', label: 'Comfort', desc: 'Balanced' },
              { value: 'premium', label: 'Premium', desc: 'Upscale stuff' },
              { value: 'luxury', label: 'Luxury', desc: 'Exclusive' }
            ].map((option) => (
              <SelectionCard
                key={option.value}
                selected={budget.level === option.value}
                onClick={() => {
                  const newBudget = { ...budget, level: option.value as any };
                  updateBudgetPreference(newBudget);
                  if (profileId) queueSync(profileId, 'budget', newBudget);
                }}
                label={option.label}
                desc={option.desc}
              />
            ))}
          </div>
        </div>

      </div>
    </ConversationalLayout>
  );
}