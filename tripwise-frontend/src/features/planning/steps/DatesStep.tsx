'use client';

import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '@/store/profileStore';
import { queueSync } from '@/lib/api/syncManager';
import { useShallow } from 'zustand/react/shallow';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, RefreshCcw } from 'lucide-react';
import { ConversationalLayout } from '@/components/layout/ConversationalLayout';

export default function DatesStep() {
  const navigate = useNavigate();
  const {
    dates,
    updateTravelDates,
    goToNextStep,
    goToPrevStep,
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
      // Could animate error state here
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

  const today = new Date().toISOString().split('T')[0];
  const isFormValid = dates.startDate && dates.returnDate;

  const GlassInputGroup = ({ label, icon: Icon, children }: { label: string, icon: any, children: React.ReactNode }) => (
    <div className="space-y-4 group">
      <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 group-focus-within:text-primary transition-colors flex items-center gap-2">
        <Icon className="w-3 h-3" />
        {label}
      </Label>
      {children}
    </div>
  );

  return (
    <ConversationalLayout
      title="When Are You Planning To Go?"
      description="Select your travel dates or rough duration."
      currentStep={2}
      totalSteps={12}
      onNext={handleContinue}
      onBack={handleBack}
      canNext={!!isFormValid}
      nextLabel="Continue Step"
    >
      <div className="space-y-5">
        {/* Date Selection - Side by Side */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-8">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2 mb-2">
              <Calendar className="w-3 h-3 text-primary" /> Start Date
            </Label>
            <input
              type="date"
              value={dates.startDate || ''}
              min={today}
              onChange={(e) => {
                const newStartDate = e.target.value;
                // If return date is now before new start date, clear it
                const newReturnDate = dates.returnDate && dates.returnDate < newStartDate ? '' : dates.returnDate;
                const newDates = { ...dates, startDate: newStartDate, returnDate: newReturnDate };
                updateTravelDates(newDates);
                if (profileId) queueSync(profileId, 'dates', newDates);
              }}
              className="glass-input h-12 w-full text-lg font-medium [color-scheme:dark]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2 mb-2">
              <Calendar className="w-3 h-3 text-primary" /> Return Date
            </Label>
            <input
              type="date"
              value={dates.returnDate || ''}
              min={dates.startDate || today}
              onChange={(e) => {
                const newDates = { ...dates, returnDate: e.target.value };
                updateTravelDates(newDates);
                if (profileId) queueSync(profileId, 'dates', newDates);
              }}
              className="glass-input h-12 w-full text-lg font-medium [color-scheme:dark]"
            />
          </div>
        </div>

        <div className="h-px bg-white/10 w-full" />

        {/* Secondary Options Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          <GlassInputGroup label="Duration Estimate" icon={Clock}>
            <div className="relative">
              <select
                value={dates.duration || 0}
                onChange={(e) => updateTravelDates({ duration: parseInt(e.target.value) })}
                className="glass-input h-12 w-full appearance-none pl-4 pr-10 cursor-pointer text-base hover:bg-white/10 transition-colors"
              >
                <option value={0} className="text-black">Select duration...</option>
                <option value={3} className="text-black">Weekend (2-3 days)</option>
                <option value={7} className="text-black">One week</option>
                <option value={14} className="text-black">Two weeks</option>
                <option value={30} className="text-black">One month</option>
                <option value={60} className="text-black">Extended stay</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 1L5 5L9 1" />
                </svg>
              </div>
            </div>
          </GlassInputGroup>

          <GlassInputGroup label="Are dates flexible?" icon={RefreshCcw}>
            <div className="flex gap-2 bg-white/5 rounded-xl p-1 border border-white/10">
              {[
                { value: false, label: 'Fixed Dates' },
                { value: true, label: 'Flexible' }
              ].map((option) => (
                <button
                  key={option.value.toString()}
                  onClick={() => updateTravelDates({ isFlexible: option.value })}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${dates.isFlexible === option.value
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-muted-foreground hover:text-white hover:bg-white/10'
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </GlassInputGroup>
        </div>
      </div>
    </ConversationalLayout>
  );
}
