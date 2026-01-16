'use client';

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProfileStore } from '@/store/profileStore';

// Import all step components
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

// Step component mapping
const stepComponents = {
  1: BasicInfoStep,
  2: DatesStep,
  3: DestinationStep,
  4: BudgetStep,
  5: AccommodationStep,
  6: TransportStep,
  7: PurposeStep,
  8: InterestsStep,
  9: FoodStep,
  10: DocumentsStep,
  11: ExperienceStep,
  12: CommunicationStep,
};

export default function StepPage() {
  const { stepNumber } = useParams<{ stepNumber: string }>();
  const navigate = useNavigate();
  const { profileId, currentStep, setCurrentStep } = useProfileStore();

  useEffect(() => {
    console.log('StepPage mounted. StepNumber:', stepNumber, 'ProfileId:', profileId, 'CurrentStep:', currentStep);
    
    // Validate step number
    const stepNum = parseInt(stepNumber || '1');
    if (isNaN(stepNum) || stepNum < 1 || stepNum > 12) {
      console.log('Invalid step number, redirecting to welcome');
      navigate('/plan');
      return;
    }

    // Check if user has profile
    if (!profileId) {
      console.log('No profile found, redirecting to welcome');
      navigate('/plan');
      return;
    }

    // Update current step in store
    setCurrentStep(stepNum);
  }, [stepNumber, profileId, currentStep, navigate, setCurrentStep]);

  // Get step component
  const stepNum = parseInt(stepNumber || '1');
  const StepComponent = stepComponents[stepNum as keyof typeof stepComponents];

  if (!StepComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Step Not Found</h1>
          <p className="text-gray-600 mb-4">The requested step could not be found.</p>
          <button
            onClick={() => navigate('/plan')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Planning
          </button>
        </div>
      </div>
    );
  }

  return <StepComponent />;
}
