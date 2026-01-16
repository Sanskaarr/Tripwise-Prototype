'use client';

import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '@/store/profileStore';
import { Button } from '@/components/ui/button';
import { queueSync } from '@/lib/api/syncManager';
import { useShallow } from 'zustand/react/shallow';
import { Label } from '@/components/ui/label';
import { Wallet, Plane } from 'lucide-react';

export default function BudgetStep() {
  const navigate = useNavigate();
  const {
    budget,
    updateBudgetPreference,
    goToNextStep,
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
    if (!budget.level || !budget.includesFlights) {
      alert('Please select budget level and flight preference');
      return;
    }
    goToNextStep();
    const nextStep = currentStep + 1;
    navigate(`/plan/step/${nextStep}`);
  };

  const handleBack = () => {
    const prevStep = currentStep - 1;
    navigate(`/plan/step/${prevStep}`);
  };

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
      className={`group relative p-5 rounded-2xl border text-left transition-all duration-300 overflow-hidden ${selected
        ? 'border-primary/50 bg-primary/20 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
        : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
        } ${className}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-500 ${selected ? 'opacity-100' : 'group-hover:opacity-100'}`} />

      <div className="relative z-10">
        <div className={`font-medium text-lg mb-1 ${selected ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>
          {label}
        </div>
        {desc && (
          <div className={`text-sm ${selected ? 'text-white/70' : 'text-white/50 group-hover:text-white/60'}`}>
            {desc}
          </div>
        )}
      </div>
    </button>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl md:text-4xl font-display font-medium text-white tracking-tight">
          What's your budget range?
        </h2>
        <p className="text-white/60 text-lg font-light">
          This helps us recommend suitable options for your trip
        </p>
      </div>

      <div className="space-y-8">
        <div className="space-y-3">
          <Label className="text-sm font-medium tracking-wide text-white/80 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-primary" />
            Budget Level
          </Label>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: 'low', label: 'Economy', desc: 'Budget-friendly options' },
              { value: 'medium', label: 'Comfort', desc: 'Balanced experience' },
              { value: 'premium', label: 'Premium', desc: 'High-end experiences' },
              { value: 'luxury', label: 'Luxury', desc: 'Exclusive & lavish' }
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

        <div className="space-y-3">
          <Label className="text-sm font-medium tracking-wide text-white/80 flex items-center gap-2">
            <Plane className="w-4 h-4 text-primary" />
            Include Flights?
          </Label>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { value: 'yes', label: 'Yes, include flights' },
              { value: 'no', label: 'No, booking separately' },
              { value: 'not-sure', label: 'Not sure yet' }
            ].map((option) => (
              <SelectionCard
                key={option.value}
                selected={budget.includesFlights === option.value}
                onClick={() => updateBudgetPreference({ includesFlights: option.value as any })}
                label={option.label}
                className="py-4 px-5"
              />
            ))}
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