'use client';

import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '@/store/profileStore';
import { useShallow } from 'zustand/react/shallow';
import { Button } from '@/components/ui/button';
import { ProfileApi } from '@/lib/api/profileApi';
import { queueSync } from '@/lib/api/syncManager';
import { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Smartphone, Mail, MapPin, Users } from 'lucide-react';

import { ConversationalLayout } from '@/components/layout/ConversationalLayout';

// Reusable input group for this step - defined outside to prevent re-renders
const GlassInputGroup = ({ label, icon: Icon, children }: { label: string, icon: any, children: React.ReactNode }) => (
  <div className="space-y-2 group">
    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 group-focus-within:text-primary transition-colors flex items-center gap-2">
      <Icon className="w-3 h-3" />
      {label}
    </Label>
    {children}
  </div>
);

export default function BasicInfoStep() {
  const navigate = useNavigate();
  const {
    basicInfo,
    currentStep,
    profileId
  } = useProfileStore(useShallow(state => ({
    basicInfo: state.basicInfo,
    currentStep: state.currentStep,
    profileId: state.profileId
  })));

  const {
    updateTravelerInfo,
    goToNextStep,
    setProfileId
  } = useProfileStore(useShallow(state => ({
    updateTravelerInfo: state.updateTravelerInfo,
    goToNextStep: state.goToNextStep,
    setProfileId: state.setProfileId
  })));

  // Create profile on mount if doesn't exist
  useEffect(() => {
    const initProfile = async () => {
      if (!profileId) {
        const response = await ProfileApi.createProfile();
        if (response.success && response.data) {
          setProfileId(response.data.profileId);
        }
      }
    };
    initProfile();
  }, [profileId, setProfileId]);

  const handleContinue = () => {
    if (!basicInfo.fullName || !basicInfo.email || !basicInfo.whatsappNumber) {
      // Shaking animation or toast could be added here
      return;
    }

    goToNextStep();
    const nextStep = currentStep + 1;
    navigate(`/plan/step/${nextStep}`);
  };

  const isFormValid = basicInfo.fullName && basicInfo.email && basicInfo.whatsappNumber;



  return (
    <ConversationalLayout
      title="Let's Start With The Basics"
      description="We need a few details to personalize your journey."
      currentStep={1}
      totalSteps={12}
      onNext={handleContinue}
      canNext={!!isFormValid}
      nextLabel="Continue Step"
    >
      <div className="space-y-5">
        {/* Main Inputs Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <GlassInputGroup label="Full Name" icon={User}>
              <input
                type="text"
                value={basicInfo.fullName}
                onChange={(e) => {
                  const newInfo = { ...basicInfo, fullName: e.target.value };
                  updateTravelerInfo(newInfo);
                  if (profileId) queueSync(profileId, 'basicInfo', newInfo);
                }}
                className="glass-input h-12 text-lg" // Larger text for better readability
                placeholder="Enter your full name"
                autoFocus
              />
            </GlassInputGroup>
          </div>

          <GlassInputGroup label="WhatsApp Number" icon={Smartphone}>
            <input
              type="tel"
              value={basicInfo.whatsappNumber}
              onChange={(e) => {
                const newInfo = { ...basicInfo, whatsappNumber: e.target.value };
                updateTravelerInfo(newInfo);
                if (profileId) queueSync(profileId, 'basicInfo', newInfo);
              }}
              className="glass-input h-12 text-lg"
              placeholder="+91 98765 43210"
            />
          </GlassInputGroup>

          <GlassInputGroup label="Email Address" icon={Mail}>
            <input
              type="email"
              value={basicInfo.email}
              onChange={(e) => {
                const newInfo = { ...basicInfo, email: e.target.value };
                updateTravelerInfo(newInfo);
                if (profileId) queueSync(profileId, 'basicInfo', newInfo);
              }}
              className="glass-input h-12 text-lg"
              placeholder="your@email.com"
            />
          </GlassInputGroup>

          <div className="md:col-span-2">
            <GlassInputGroup label="City of Departure" icon={MapPin}>
              <input
                type="text"
                value={basicInfo.cityOfDeparture}
                onChange={(e) => {
                  const newInfo = { ...basicInfo, cityOfDeparture: e.target.value };
                  updateTravelerInfo(newInfo);
                  if (profileId) queueSync(profileId, 'basicInfo', newInfo);
                }}
                className="glass-input h-12 text-lg"
                placeholder="e.g., Mumbai, Delhi"
              />
            </GlassInputGroup>
          </div>
        </div>

        {/* Travelers Counter Section - Compact Row */}
        <div className="pt-4 border-t border-white/10">
          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 mb-4 flex items-center gap-2">
            <Users className="w-3 h-3" />
            Who is traveling?
          </Label>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Adults', key: 'adults', min: 1, sub: '12+' },
              { label: 'Children', key: 'children', min: 0, sub: '2-12' },
              { label: 'Infants', key: 'infants', min: 0, sub: '< 2' }
            ].map((item) => (
              <div key={item.key} className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center justify-center gap-2 hover:bg-white/10 transition-colors group">
                <span className="text-sm font-medium text-foreground/80">{item.label}</span>

                <div className="flex items-center justify-between w-full px-1">
                  <button
                    onClick={() => updateTravelerInfo({ [item.key]: Math.max(item.min, (basicInfo as any)[item.key] - 1) })}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-foreground/60 hover:text-foreground transition-all active:scale-95"
                  >
                    -
                  </button>
                  <span className="text-lg font-bold text-foreground tabular-nums">
                    {(basicInfo as any)[item.key]}
                  </span>
                  <button
                    onClick={() => updateTravelerInfo({ [item.key]: (basicInfo as any)[item.key] + 1 })}
                    className="w-8 h-8 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 flex items-center justify-center transition-all active:scale-95 border border-indigo-500/20"
                  >
                    +
                  </button>
                </div>
                <span className="text-[10px] text-muted-foreground/50 font-bold tracking-wider">{item.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ConversationalLayout>
  );
}
