'use client';

import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '@/store/profileStore';
import { Button } from '@/components/ui/button';
import { queueSync } from '@/lib/api/syncManager';
import { useShallow } from 'zustand/react/shallow';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Book, Calendar, Globe } from 'lucide-react';

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

  const SelectionButton = ({
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
      className={`relative p-4 rounded-xl border text-center transition-all duration-300 capitalize overflow-hidden ${active
          ? 'border-primary/50 bg-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
          : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
        } ${className}`}
    >
      <div className={`font-medium text-lg relative z-10 ${active ? 'text-white' : 'text-white/80'}`}>
        {label}
      </div>
    </button>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl md:text-4xl font-display font-medium text-white tracking-tight">
          Let's check your travel documents
        </h2>
        <p className="text-white/60 text-lg font-light">
          Don't worry, we'll help if anything's missing
        </p>
      </div>

      <div className="space-y-8">
        <div className="space-y-3">
          <Label className="text-sm font-medium tracking-wide text-white/80 flex items-center gap-2">
            <Book className="w-4 h-4 text-primary" />
            Do you have a passport? *
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <SelectionButton
              active={documents.hasPassport === true}
              onClick={() => handlePassportChange(true)}
              label="Yes"
            />
            <SelectionButton
              active={documents.hasPassport === false}
              onClick={() => handlePassportChange(false)}
              label="No"
            />
          </div>
        </div>

        {documents.hasPassport && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
            <Label className="text-sm font-medium tracking-wide text-white/80 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Passport Expiry Date
            </Label>
            <Input
              type="date"
              value={documents.passportExpiry || ''}
              onChange={handleExpiryChange}
              className="h-14 rounded-xl border-white/10 bg-white/5 text-lg text-white placeholder:text-white/20 focus:border-primary/50 focus:bg-white/10"
            />
          </div>
        )}

        <div className="space-y-3">
          <Label className="text-sm font-medium tracking-wide text-white/80 flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            Visa Awareness *
          </Label>
          <div className="grid grid-cols-3 gap-3">
            {['yes', 'no', 'not-sure'].map((option) => (
              <SelectionButton
                key={option}
                active={documents.visaAwareness === option}
                onClick={() => handleVisaChange(option as any)}
                label={option === 'not-sure' ? 'Not Sure' : option}
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
