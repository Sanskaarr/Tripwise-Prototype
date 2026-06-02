
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '@/store/profileStore';
import { queueSync } from '@/lib/api/syncManager';
import { useShallow } from 'zustand/react/shallow';
import { Label } from '@/components/ui/label';
import { Calendar, RefreshCcw } from 'lucide-react';
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

  const computedDuration = (dates.startDate && dates.returnDate)
    ? Math.round((new Date(dates.returnDate).getTime() - new Date(dates.startDate).getTime()) / (1000 * 60 * 60 * 24))
    : null;

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
                const newReturnDate = dates.returnDate && dates.returnDate < newStartDate ? '' : dates.returnDate;
                const diff = newStartDate && newReturnDate
                  ? Math.round((new Date(newReturnDate).getTime() - new Date(newStartDate).getTime()) / (1000 * 60 * 60 * 24))
                  : 0;
                const newDates = { ...dates, startDate: newStartDate, returnDate: newReturnDate, duration: diff };
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
                const diff = dates.startDate && e.target.value
                  ? Math.round((new Date(e.target.value).getTime() - new Date(dates.startDate).getTime()) / (1000 * 60 * 60 * 24))
                  : 0;
                const newDates = { ...dates, returnDate: e.target.value, duration: diff };
                updateTravelDates(newDates);
                if (profileId) queueSync(profileId, 'dates', newDates);
              }}
              className="glass-input h-12 w-full text-lg font-medium [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Computed duration badge */}
        {computedDuration !== null && computedDuration > 0 && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/20 w-fit">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span className="text-sm font-semibold text-primary">{computedDuration} day{computedDuration !== 1 ? 's' : ''}</span>
          </div>
        )}

        <div className="h-px bg-white/10 w-full" />

        {/* Flexible dates */}
        <div className="space-y-3">
          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
            <RefreshCcw className="w-3 h-3 text-primary" />
            Are your dates flexible?
          </Label>
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
        </div>
      </div>
    </ConversationalLayout>
  );
}
