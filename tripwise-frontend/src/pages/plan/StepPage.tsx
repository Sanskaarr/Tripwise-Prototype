import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProfileStore } from '@/store/profileStore';
import { useShallow } from 'zustand/react/shallow';
import StepLayout from '@/components/layout/StepLayout';
import BasicInfoStep from '@/features/planning/steps/BasicInfoStep';
import DatesStep from '@/features/planning/steps/DatesStep';
import DestinationStep from '@/features/planning/steps/DestinationStep';
import BudgetStep from '@/features/planning/steps/BudgetStep';
import AccommodationStep from '@/features/planning/steps/AccommodationStep';
import TransportStep from '@/features/planning/steps/TransportStep';
import PurposeStep from '@/features/planning/steps/PurposeStep';
import InterestsStep from '@/features/planning/steps/InterestsStep';
import FoodStep from '@/features/planning/steps/FoodStep';
import DocumentsStep from '@/features/planning/steps/DocumentsStep';
import ExperienceStep from '@/features/planning/steps/ExperienceStep';
import CommunicationStep from '@/features/planning/steps/CommunicationStep';

const TOTAL_STEPS = 12;

const StepPage = () => {
  const { stepId } = useParams<{ stepId: string }>();
  const navigate = useNavigate();
  const { currentStep, profileId, setCurrentStep } = useProfileStore(useShallow(state => ({
    currentStep: state.currentStep,
    profileId: state.profileId,
    setCurrentStep: state.setCurrentStep
  })));

  const stepNumber = parseInt(stepId || '1', 10);

  useEffect(() => {
    // If no profile, redirect to welcome
    if (!profileId) {
      navigate('/plan');
      return;
    }

    // Update store if step doesn't match
    if (stepNumber !== currentStep) {
      setCurrentStep(stepNumber);
    }
  }, [stepNumber, currentStep, profileId, navigate, setCurrentStep]);

  const renderStep = () => {
    switch (stepNumber) {
      case 1:
        return <BasicInfoStep />;
      case 2:
        return <DatesStep />;
      case 3:
        return <DestinationStep />;
      case 4:
        return <BudgetStep />;
      case 5:
        return <AccommodationStep />;
      case 6:
        return <TransportStep />;
      case 7:
        return <PurposeStep />;
      case 8:
        return <InterestsStep />;
      case 9:
        return <FoodStep />;
      case 10:
        return <DocumentsStep />;
      case 11:
        return <ExperienceStep />;
      case 12:
        return <CommunicationStep />;
      default:
        return (
          <div className="text-center py-12">
            <h2 className="font-display text-2xl mb-4">Step {stepNumber}</h2>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        );
    }
  };

  return (
    <StepLayout currentStep={stepNumber} totalSteps={TOTAL_STEPS}>
      {renderStep()}
    </StepLayout>
  );
};

export default StepPage;
