import { apiClient } from '@/lib/api/client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Calendar, Users, Wallet, Sparkles, X, Minus, Plus, ArrowRight, ArrowLeft, CheckCircle,
} from 'lucide-react';
import { useProfileStore } from '@/store/profileStore';
import { useWizardStore } from '@/store/wizardStore';
import { InteractiveApi } from '@/lib/api/interactiveApi';
import { userService } from '@/services/userService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PremiumButton } from '@/components/ui/PremiumButton';

interface QuickTripModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  { id: 'destination', title: 'Where Are You Heading?', description: 'Enter your dream destination.' },
  { id: 'dates', title: 'When Are You Travelling?', description: 'Pick your departure and return dates.' },
  { id: 'travelers', title: "Who's Coming Along?", description: 'Tell us how many travelers.' },
  { id: 'budget', title: "What's Your Budget?", description: "We'll tailor recommendations to fit your range." },
  { id: 'purpose', title: "What's the Occasion?", description: 'Helps us personalise your experience.' },
] as const;

type StepId = typeof STEPS[number]['id'];

// ─── Exact SelectionCard from wizard ─────────────────────────────────────────
function SelectionCard({
  selected, onClick, label, desc, className = '',
}: { selected: boolean; onClick: () => void; label: string; desc?: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative p-4 rounded-xl border text-left transition-all duration-300 overflow-hidden ${
        selected
          ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
          : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
      } ${className}`}
    >
      <div className="relative z-10 flex items-start justify-between gap-2">
        <div>
          <div className={`font-medium text-sm mb-0.5 ${selected ? 'text-primary' : 'text-foreground/90 group-hover:text-foreground'}`}>
            {label}
          </div>
          {desc && (
            <div className={`text-xs leading-relaxed ${selected ? 'text-primary/70' : 'text-muted-foreground group-hover:text-muted-foreground/80'}`}>
              {desc}
            </div>
          )}
        </div>
        {selected && <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />}
      </div>
    </button>
  );
}

// ─── Counter ──────────────────────────────────────────────────────────────────
function Counter({ label, sub, value, onChange }: {
  label: string; sub: string; value: number; onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5">
      <div>
        <p className="font-medium text-sm text-foreground/90">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-muted-foreground hover:bg-white/10 hover:text-foreground transition-all"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="w-6 text-center text-base font-semibold tabular-nums">{value}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-muted-foreground hover:bg-white/10 hover:text-foreground transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

const BUDGET_OPTIONS = [
  { value: 'low', label: 'Economy', desc: 'Budget-friendly, hostels & local transport' },
  { value: 'medium', label: 'Comfort', desc: 'Balanced — 3-star hotels, comfort travel' },
  { value: 'premium', label: 'Premium', desc: '4-star hotels, upscale experiences' },
  { value: 'luxury', label: 'Luxury', desc: '5-star resorts, fine dining & exclusivity' },
] as const;

const PURPOSE_OPTIONS = [
  { value: 'vacation', label: 'Vacation', desc: 'Leisure & relaxation' },
  { value: 'honeymoon', label: 'Honeymoon', desc: 'Romantic getaway' },
  { value: 'family', label: 'Family', desc: 'With the whole family' },
  { value: 'solo', label: 'Solo', desc: 'Just you and the world' },
  { value: 'business', label: 'Business', desc: 'Work + some sightseeing' },
  { value: 'religious', label: 'Pilgrimage', desc: 'Spiritual journey' },
] as const;

export function QuickTripModal({ isOpen, onClose }: QuickTripModalProps) {
  const navigate = useNavigate();
  const store = useProfileStore();

  const [stepIdx, setStepIdx] = useState(0);
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [adults, setAdults] = useState(store.basicInfo.adults ?? 1);
  const [children, setChildren] = useState(store.basicInfo.children ?? 0);
  const [budget, setBudget] = useState<string | null>(store.budget.level);
  const [purpose, setPurpose] = useState<string | null>(store.purpose.purpose);
  const [isStarting, setIsStarting] = useState(false);

  const currentStep = STEPS[stepIdx];
  const totalSteps = STEPS.length;
  const progress = ((stepIdx + 1) / totalSteps) * 100;

  const canProceed = (() => {
    if (currentStep.id === 'destination') return destination.trim().length > 1;
    if (currentStep.id === 'dates') return !!startDate;
    if (currentStep.id === 'travelers') return adults >= 1;
    if (currentStep.id === 'budget') return !!budget;
    return true;
  })();

  const isLastStep = stepIdx === totalSteps - 1;

  const handleNext = () => {
    if (!canProceed) return;
    if (isLastStep) handleStart();
    else setStepIdx(i => i + 1);
  };

  const handleBack = () => {
    if (stepIdx > 0) setStepIdx(i => i - 1);
  };

  const handleStart = async () => {
    if (!store.profileId) return;
    setIsStarting(true);
    try {
      const pid = store.profileId;

      await Promise.all([
        userService.updateDestination(pid, {
          destination: destination.trim(),
          travelType: store.destination.travelType,
          preferenceType: store.destination.preferenceType,
          travelStyle: store.destination.travelStyle,
        }),
        userService.updateBudget(pid, {
          level: budget ?? store.budget.level,
          includesFlights: store.budget.includesFlights,
        }),
        userService.updatePurpose(pid, {
          purpose: purpose ?? store.purpose.purpose,
          specialOccasion: store.purpose.specialOccasion,
        }),
        userService.updateBasicInfo(pid, {
          fullName: store.basicInfo.fullName,
          email: store.basicInfo.email,
          whatsappNumber: store.basicInfo.whatsappNumber,
          cityOfDeparture: store.basicInfo.cityOfDeparture,
          adults, children,
          infants: store.basicInfo.infants ?? 0,
        }),
        apiClient.post(`/api/profiles/${pid}/dates`, {
          startDate: startDate || null,
          returnDate: endDate || null,
          isFlexible: false,
          duration: startDate && endDate
            ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000)
            : 0,
        }),
      ]);

      store.updateDestinationPreference({ ...store.destination, destination: destination.trim() });
      store.updateBudgetPreference({ level: budget as any ?? store.budget.level, includesFlights: store.budget.includesFlights });
      store.updateTravelPurpose({ purpose: purpose as any ?? store.purpose.purpose, specialOccasion: store.purpose.specialOccasion });
      store.updateTravelerInfo({ ...store.basicInfo, adults, children });
      store.updateTravelDates({
        startDate: startDate || null,
        returnDate: endDate || null,
        isFlexible: false,
        duration: startDate && endDate
          ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000)
          : 0,
      });

      const sessionRes = await InteractiveApi.initSession(pid);
      if (!sessionRes.success || !sessionRes.data) throw new Error('Session init failed');

      const wizardState = useWizardStore.getState();
      wizardState.resetWizard();
      wizardState.setSessionId(sessionRes.data.id);
      wizardState.setOverviewData(sessionRes.data.destinationOverview);
      wizardState.setStep('OVERVIEW');
      wizardState.clearMessages();

      onClose();
      navigate('/chat');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong — please try again');
    } finally {
      setIsStarting(false);
    }
  };

  if (!isOpen) return null;

  const nightCount = startDate && endDate
    ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000)
    : 0;

  return (
    // Full-screen overlay — same as wizard page container
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Animated liquid blobs — same colours as LiquidBackground so ios-glass works */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="liquid-blob blob-1" style={{ opacity: 0.45 }} />
        <div className="liquid-blob blob-2" style={{ opacity: 0.45 }} />
        <div className="liquid-blob blob-3" style={{ opacity: 0.35 }} />
        <div className="liquid-blob blob-4" style={{ opacity: 0.35 }} />
        {/* Dark overlay on top of blobs */}
        <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
      </div>

      {/* Clickaway */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Card — exact ios-glass shell used in ConversationalLayout */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="ios-glass relative overflow-hidden rounded-[2rem] shadow-xl border-white/10 w-full max-w-2xl z-10"
        onClick={e => e.stopPropagation()}
      >

        {/* Top bar: circular progress + close — copied from ConversationalLayout */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor"
                  strokeWidth="3" className="text-white/10" />
                <motion.circle
                  cx="16" cy="16" r="14" fill="none" stroke="currentColor"
                  strokeWidth="3"
                  className="text-primary drop-shadow-[0_0_4px_rgba(59,130,246,0.5)]"
                  strokeDasharray={88}
                  strokeDashoffset={88 - (88 * progress) / 100}
                  initial={{ strokeDashoffset: 88 }}
                  animate={{ strokeDashoffset: 88 - (88 * progress) / 100 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </svg>
              <span className="absolute text-[9px] font-bold text-muted-foreground/80">{stepIdx + 1}</span>
            </div>
            <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60 font-bold">
              Step {stepIdx + 1}/{totalSteps}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content area */}
        <div className="px-6 md:px-8 py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.22 }}
            >
              {/* Title block — matches ConversationalLayout exactly */}
              <div className="mb-6 text-center space-y-1">
                <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-foreground">
                  {currentStep.title}
                </h2>
                <p className="text-muted-foreground/80 text-sm md:text-base font-light leading-relaxed max-w-md mx-auto">
                  {currentStep.description}
                </p>
              </div>

              {/* Step body */}
              <div className="min-h-[160px]">

                {/* ── Destination ── */}
                {currentStep.id === 'destination' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-primary" />
                        Destination
                      </Label>
                      <Input
                        value={destination}
                        onChange={e => setDestination(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && canProceed && handleNext()}
                        placeholder="e.g. Goa, Manali, Bali, Paris…"
                        autoFocus
                        className="h-12 rounded-xl bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground/50 text-base"
                      />
                    </div>
                    <p className="text-xs text-center text-muted-foreground/50">
                      Your saved preferences (food, interests, transport) will be applied automatically.
                    </p>
                  </div>
                )}

                {/* ── Dates ── */}
                {currentStep.id === 'dates' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-primary" />
                          Departure
                        </Label>
                        <Input
                          type="date"
                          value={startDate}
                          onChange={e => setStartDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="h-11 rounded-xl bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 text-foreground text-sm [color-scheme:dark]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-primary" />
                          Return <span className="text-muted-foreground/30 normal-case font-normal ml-1">(optional)</span>
                        </Label>
                        <Input
                          type="date"
                          value={endDate}
                          onChange={e => setEndDate(e.target.value)}
                          min={startDate || new Date().toISOString().split('T')[0]}
                          className="h-11 rounded-xl bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 text-foreground text-sm [color-scheme:dark]"
                        />
                      </div>
                    </div>
                    {nightCount > 0 && (
                      <motion.p
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-sm text-primary/80 font-medium"
                      >
                        {nightCount} night{nightCount !== 1 ? 's' : ''}
                      </motion.p>
                    )}
                  </div>
                )}

                {/* ── Travelers ── */}
                {currentStep.id === 'travelers' && (
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
                      <Users className="w-3 h-3 text-primary" />
                      Travelers
                    </Label>
                    <Counter label="Adults" sub="Age 12 & above" value={adults} onChange={v => setAdults(Math.max(1, v))} />
                    <Counter label="Children" sub="Ages 2–11" value={children} onChange={setChildren} />
                    {(adults + children) > 1 && (
                      <p className="text-xs text-center text-muted-foreground/50 mt-2">
                        {adults + children} travelers total
                      </p>
                    )}
                  </div>
                )}

                {/* ── Budget ── */}
                {currentStep.id === 'budget' && (
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
                      <Wallet className="w-3 h-3 text-primary" />
                      Budget Level
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      {BUDGET_OPTIONS.map(o => (
                        <SelectionCard
                          key={o.value}
                          label={o.label}
                          desc={o.desc}
                          selected={budget === o.value}
                          onClick={() => setBudget(o.value)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Purpose ── */}
                {currentStep.id === 'purpose' && (
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-primary" />
                      Occasion
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      {PURPOSE_OPTIONS.map(o => (
                        <SelectionCard
                          key={o.value}
                          label={o.label}
                          desc={o.desc}
                          selected={purpose === o.value}
                          onClick={() => setPurpose(o.value)}
                        />
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer — exact ConversationalLayout footer */}
        <div className="px-6 pb-6 pt-2 flex flex-col-reverse md:flex-row gap-3 items-center justify-between">
          {stepIdx > 0 ? (
            <button
              onClick={handleBack}
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors py-2 px-3 flex items-center gap-2"
            >
              <ArrowLeft className="w-3 h-3" />
              Back
            </button>
          ) : (
            <div className="w-16" />
          )}

          <PremiumButton
            onClick={handleNext}
            disabled={!canProceed || isStarting}
            isLoading={isStarting}
            className="w-full md:w-auto min-w-[140px] py-3 text-sm"
          >
            {isLastStep ? (isStarting ? 'Starting…' : 'Start Planning') : 'Continue'}
            {!isStarting && <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />}
          </PremiumButton>
        </div>

      </motion.div>
    </div>
  );
}
