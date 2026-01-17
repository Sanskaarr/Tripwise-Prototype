'use client';

import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '@/store/profileStore';
import { queueSync } from '@/lib/api/syncManager';
import { useShallow } from 'zustand/react/shallow';
import { Label } from '@/components/ui/label';
import { MessageCircle, Clock, CheckCircle } from 'lucide-react';
import { ConversationalLayout } from '@/components/layout/ConversationalLayout';

export default function CommunicationStep() {
  const navigate = useNavigate();
  const { communication, updateCommunicationPreference, currentStep, profileId } = useProfileStore(useShallow(state => ({
    communication: state.communication,
    updateCommunicationPreference: state.updateCommunicationPreference,
    currentStep: state.currentStep,
    profileId: state.profileId
  })));

  const handleMethodChange = (method: 'whatsapp' | 'call' | 'email') => {
    const data = { ...communication, method };
    updateCommunicationPreference(data);
    if (profileId) {
      queueSync(profileId, 'communication', data);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const data = { ...communication, bestTime: e.target.value };
    updateCommunicationPreference(data);
    if (profileId) {
      queueSync(profileId, 'communication', data);
    }
  };

  const handleContinue = () => {
    navigate('/plan/confirmation');
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
      title="Stay In Touch"
      description="How should we reach out with your plan?"
      currentStep={12}
      totalSteps={12}
      onNext={handleContinue}
      onBack={handleBack}
      canNext={!!communication.method}
      nextLabel="Complete Planning" // Custom label for final step
    >
      <div className="space-y-5">
        {/* Contact Method */}
        <div className="space-y-3">
          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
            <MessageCircle className="w-3 h-3 text-primary" />
            Preferred Method
          </Label>
          <div className="grid grid-cols-3 gap-3">
            {['whatsapp', 'call', 'email'].map((method) => (
              <SelectionCard
                key={method}
                active={communication.method === method}
                onClick={() => handleMethodChange(method as any)}
                label={method === 'whatsapp' ? 'WhatsApp' : method.charAt(0).toUpperCase() + method.slice(1)}
              />
            ))}
          </div>
        </div>

        {/* Best Time */}
        <div className="space-y-3">
          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 flex items-center gap-2">
            <Clock className="w-3 h-3 text-primary" />
            Best Time to Contact
          </Label>
          <input
            type="text"
            value={communication.bestTime || ''}
            onChange={handleTimeChange}
            placeholder="e.g., After 6 PM, Weekend mornings..."
            className="glass-input h-12"
          />
        </div>
      </div>
    </ConversationalLayout>
  );
}
