
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '@/store/profileStore';
import { queueSync } from '@/lib/api/syncManager';
import { useShallow } from 'zustand/react/shallow';
import { Label } from '@/components/ui/label';
import { Book, Calendar, Globe, CheckCircle } from 'lucide-react';
import { ConversationalLayout } from '@/components/layout/ConversationalLayout';

export default function DocumentsStep() {
  const navigate = useNavigate();
  const { documents, updateDocumentStatus, currentStep, profileId } = useProfileStore(useShallow(state => ({
    documents: state.documents,
    updateDocumentStatus: state.updateDocumentStatus,
    currentStep: state.currentStep,
    profileId: state.profileId
  })));

  const handlePassportChange = (hasPassport: boolean) => {
    const data = { ...documents, hasPassport };
    updateDocumentStatus(data);
    if (profileId) {
      queueSync(profileId, 'documents', data);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const data = { ...documents, passportExpiry: e.target.value };
    updateDocumentStatus(data);
    if (profileId) {
      queueSync(profileId, 'documents', data);
    }
  };

  const handleVisaChange = (visaAwareness: 'yes' | 'no' | 'not-sure') => {
    const data = { ...documents, visaAwareness };
    updateDocumentStatus(data);
    if (profileId) {
      queueSync(profileId, 'documents', data);
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
    label,
    className = ""
  }: {
    active: boolean;
    onClick: () => void;
    label: string;
    className?: string;
  }) => (
    <button
      onClick={onClick}
      className={`group relative p-4 rounded-xl border text-center transition-all duration-300 overflow-hidden ${active
        ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
        : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
        } ${className}`}
    >
      <div className={`font-medium text-sm ${active ? 'text-primary' : 'text-foreground/90 group-hover:text-foreground'}`}>
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
      title="Travel Documents"
      description="Let's make sure you're ready to fly."
      currentStep={10}
      totalSteps={12}
      onNext={handleContinue}
      onBack={handleBack}
      canNext={true} // Usually safe to proceed even if incomplete unless strict blocking needed
      nextLabel="Continue Step"
    >
      <div className="space-y-5">
        {/* Passport Status */}
        <div className="space-y-3">
          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
            <Book className="w-3 h-3 text-primary" />
            Do you have a passport?
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <SelectionCard
              active={documents.hasPassport === true}
              onClick={() => handlePassportChange(true)}
              label="Yes, I do"
            />
            <SelectionCard
              active={documents.hasPassport === false}
              onClick={() => handlePassportChange(false)}
              label="No / Expired"
            />
          </div>
        </div>

        {/* Passport Expiry - Conditional */}
        {documents.hasPassport && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-500">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
              <Calendar className="w-3 h-3 text-primary" />
              Passport Expiry Date
            </Label>
            <input
              type="date"
              value={documents.passportExpiry || ''}
              onChange={handleExpiryChange}
              className="glass-input h-12 w-full text-lg font-medium [color-scheme:dark]"
            />
          </div>
        )}

        {/* Visa Awareness */}
        <div className="space-y-3">
          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
            <Globe className="w-3 h-3 text-primary" />
            Visa Status
          </Label>
          <div className="grid grid-cols-3 gap-3">
            {['yes', 'no', 'not-sure'].map((option) => (
              <SelectionCard
                key={option}
                active={documents.visaAwareness === option}
                onClick={() => handleVisaChange(option as any)}
                label={option === 'not-sure' ? 'Not Sure' : option === 'yes' ? 'Have Visa' : 'Need Visa'}
              />
            ))}
          </div>
        </div>
      </div>
    </ConversationalLayout>
  );
}
