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
    // Validate required fields
    if (!basicInfo.fullName || !basicInfo.email || !basicInfo.whatsappNumber) {
      alert('Please fill all required fields');
      return;
    }

    // Update store to next step
    goToNextStep();

    // Navigate to next URL
    const nextStep = currentStep + 1;
    navigate(`/plan/step/${nextStep}`);
  };

  const InputGroup = ({ label, icon: Icon, children }: { label: string, icon: any, children: React.ReactNode }) => (
    <div className="space-y-3">
      <Label className="text-sm font-medium tracking-wide text-white/80 flex items-center gap-2">
        <Icon className="w-4 h-4 text-primary" />
        {label}
      </Label>
      {children}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h2 className="text-3xl md:text-4xl font-display font-medium text-white tracking-tight">
          Let's get to know you
        </h2>
        <p className="text-white/60 text-lg font-light">
          Tell us a bit about yourself to personalize your journey
        </p>
      </div>

      {/* Form */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2 space-y-6">
          <InputGroup label="Full Name" icon={User}>
            <Input
              type="text"
              value={basicInfo.fullName}
              onChange={(e) => {
                const newInfo = { ...basicInfo, fullName: e.target.value };
                updateTravelerInfo(newInfo);
                if (profileId) queueSync(profileId, 'basicInfo', newInfo);
              }}
              className="h-14 rounded-xl border-white/10 bg-white/5 text-lg text-white placeholder:text-white/20 focus:border-primary/50 focus:bg-white/10"
              placeholder="Enter your full name"
            />
          </InputGroup>

          <div className="grid md:grid-cols-2 gap-6">
            <InputGroup label="WhatsApp Number" icon={Smartphone}>
              <Input
                type="tel"
                value={basicInfo.whatsappNumber}
                onChange={(e) => {
                  const newInfo = { ...basicInfo, whatsappNumber: e.target.value };
                  updateTravelerInfo(newInfo);
                  if (profileId) queueSync(profileId, 'basicInfo', newInfo);
                }}
                className="h-14 rounded-xl border-white/10 bg-white/5 text-lg text-white placeholder:text-white/20 focus:border-primary/50 focus:bg-white/10"
                placeholder="+91 98765 43210"
              />
            </InputGroup>

            <InputGroup label="Email Address" icon={Mail}>
              <Input
                type="email"
                value={basicInfo.email}
                onChange={(e) => {
                  const newInfo = { ...basicInfo, email: e.target.value };
                  updateTravelerInfo(newInfo);
                  if (profileId) queueSync(profileId, 'basicInfo', newInfo);
                }}
                className="h-14 rounded-xl border-white/10 bg-white/5 text-lg text-white placeholder:text-white/20 focus:border-primary/50 focus:bg-white/10"
                placeholder="your@email.com"
              />
            </InputGroup>
          </div>

          <InputGroup label="City of Departure" icon={MapPin}>
            <Input
              type="text"
              value={basicInfo.cityOfDeparture}
              onChange={(e) => {
                const newInfo = { ...basicInfo, cityOfDeparture: e.target.value };
                updateTravelerInfo(newInfo);
                if (profileId) queueSync(profileId, 'basicInfo', newInfo);
              }}
              className="h-14 rounded-xl border-white/10 bg-white/5 text-lg text-white placeholder:text-white/20 focus:border-primary/50 focus:bg-white/10"
              placeholder="e.g., Mumbai, Delhi"
            />
          </InputGroup>
        </div>

        {/* Travelers Section */}
        <div className="md:col-span-2 pt-4">
          <Label className="text-sm font-medium tracking-wide text-white/80 flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-primary" />
            Who is traveling?
          </Label>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: 'Adults', key: 'adults', min: 1, sub: '12+ years' },
              { label: 'Children', key: 'children', min: 0, sub: '2-12 years' },
              { label: 'Infants', key: 'infants', min: 0, sub: '< 2 years' }
            ].map((item) => (
              <div key={item.key} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center gap-3 hover:bg-white/10 transition-colors">
                <span className="text-white font-medium">{item.label}</span>
                <span className="text-xs text-white/40 -mt-2">{item.sub}</span>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => updateTravelerInfo({ [item.key]: Math.max(item.min, (basicInfo as any)[item.key] - 1) })}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  >
                    -
                  </button>
                  <span className="text-xl font-bold text-white tabular-nums w-4 text-center">
                    {(basicInfo as any)[item.key]}
                  </span>
                  <button
                    onClick={() => updateTravelerInfo({ [item.key]: (basicInfo as any)[item.key] + 1 })}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-8">
        <Button
          onClick={handleContinue}
          size="lg"
          className="w-full h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-lg font-bold tracking-widest uppercase hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.01] transition-all duration-300"
        >
          Continue Step
        </Button>
      </div>
    </div>
  );
}
