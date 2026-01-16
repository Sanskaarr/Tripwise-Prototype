'use client';

import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '@/store/profileStore';
import { Button } from '@/components/ui/button';
import { queueSync } from '@/lib/api/syncManager';
import { useShallow } from 'zustand/react/shallow';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, RefreshCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function DatesStep() {
  const navigate = useNavigate();
  const {
    dates,
    updateTravelDates,
    goToNextStep,
    currentStep,
    profileId
  } = useProfileStore(useShallow(state => ({
    dates: state.dates,
    updateTravelDates: state.updateTravelDates,
    goToNextStep: state.goToNextStep,
    goToPrevStep: state.goToPrevStep,
    currentStep: state.currentStep,
    profileId: state.profileId
  })));

  const handleContinue = () => {
    // Validate required fields
    if (!dates.startDate || !dates.returnDate) {
      alert('Please select travel dates');
      return;
    }

    // Update store to next step
    goToNextStep();

    // Navigate to next URL
    const nextStep = currentStep + 1;
    navigate(`/plan/step/${nextStep}`);
  };

  const handleBack = () => {
    const prevStep = currentStep - 1;
    navigate(`/plan/step/${prevStep}`);
  };

  const InputGroup = ({ label, icon: Icon, children }: { label: string, icon: any, children: React.ReactNode }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium tracking-wide text-white/80 flex items-center gap-2">
        <Icon className="w-4 h-4 text-primary" />
        {label}
      </Label>
      {children}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          <InputGroup label="Start Date" icon={Calendar}>
            <Input
              type="date"
              value={dates.startDate || ''}
              onChange={(e) => {
                const newDates = { ...dates, startDate: e.target.value };
                updateTravelDates(newDates);
                if (profileId) queueSync(profileId, 'dates', newDates);
              }}
              className="glass-input [color-scheme:light]"
            />
          </InputGroup>

          <InputGroup label="Return Date" icon={Calendar}>
            <Input
              type="date"
              value={dates.returnDate || ''}
              onChange={(e) => {
                const newDates = { ...dates, returnDate: e.target.value };
                updateTravelDates(newDates);
                if (profileId) queueSync(profileId, 'dates', newDates);
              }}
              className="glass-input [color-scheme:light]"
            />
          </InputGroup>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <InputGroup label="Duration" icon={Clock}>
            <select
              value={dates.duration || 0}
              onChange={(e) => updateTravelDates({ duration: parseInt(e.target.value) })}
              className="glass-input appearance-none"
            >
              <option value={0}>Select duration</option>
              <option value={3}>Weekend (2-3 days)</option>
              <option value={7}>One week</option>
              <option value={14}>Two weeks</option>
              <option value={30}>One month</option>
              <option value={60}>Extended stay</option>
            </select>
          </InputGroup>

          <InputGroup label="Flexibility" icon={RefreshCcw}>
            <div className="grid grid-cols-2 gap-3 h-12">
              {[
                { value: false, label: 'Fixed' },
                { value: true, label: 'Flexible' }
              ].map((option) => (
                <button
                  key={option.value.toString()}
                  onClick={() => updateTravelDates({ isFlexible: option.value })}
                  className={`rounded-xl border transition-all duration-300 font-medium text-sm ${dates.isFlexible === option.value
                    ? 'border-primary bg-primary/10 text-primary shadow-sm'
                    : 'border-black/5 bg-white/40 text-gray-500 hover:bg-white/60 hover:text-gray-900'
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </InputGroup>
        </div>
      </div>

      <div className="flex justify-center gap-4 pt-4">
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
