'use client';

import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '@/store/profileStore';
import { Button } from '@/components/ui/button';
import { queueSync } from '@/lib/api/syncManager';
import { useShallow } from 'zustand/react/shallow';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { MessageCircle, Clock, CheckCircle } from 'lucide-react';

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
    // Step 12 is the last step - go to confirmation page
    navigate('/plan/confirmation');
  };

  const handleBack = () => {
    navigate(`/plan/step/${currentStep - 1}`);
  };

  const SelectionButton = ({
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
      className={`relative p-4 rounded-xl border text-center transition-all duration-300 capitalize overflow-hidden ${active
          ? 'border-primary/50 bg-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
          : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
        }`}
    >
      <div className={`font-medium text-lg relative z-10 ${active ? 'text-white' : 'text-white/80'}`}>
        {label}
      </div>
      {active && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      )}
    </button>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl md:text-4xl font-display font-medium text-white tracking-tight">
          How can we reach you?
        </h2>
        <p className="text-white/60 text-lg font-light">
          Choose your preferred way to stay connected
        </p>
      </div>

      <div className="space-y-8">
        <div className="space-y-3">
          <Label className="text-sm font-medium tracking-wide text-white/80 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-primary" />
            Preferred Method *
          </Label>
          <div className="grid grid-cols-3 gap-3">
            {['whatsapp', 'call', 'email'].map((method) => (
              <SelectionButton
                key={method}
                active={communication.method === method}
                onClick={() => handleMethodChange(method as any)}
                label={method === 'whatsapp' ? 'WhatsApp' : method.charAt(0).toUpperCase() + method.slice(1)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium tracking-wide text-white/80 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Best Time to Contact *
          </Label>
          <Input
            type="text"
            value={communication.bestTime || ''}
            onChange={handleTimeChange}
            placeholder="e.g., morning, afternoon, evening, any-time"
            className="h-14 rounded-xl border-white/10 bg-white/5 text-lg text-white placeholder:text-white/20 focus:border-primary/50 focus:bg-white/10"
          />
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
          className="flex-[2] h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-lg font-bold tracking-widest uppercase hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.01] transition-all duration-300 relative overflow-hidden group"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            Complete Planning
            <CheckCircle className="w-5 h-5 ml-1" />
          </span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </Button>
      </div>
    </div>
  );
}
