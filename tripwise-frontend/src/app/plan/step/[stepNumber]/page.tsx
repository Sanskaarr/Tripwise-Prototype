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

// Import layout
import StepLayout from '@/components/planning/StepLayout';

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

// Step metadata mapping
const stepMetadata = {
  1: { title: "Let's get to know you", subtitle: "Tell us a bit about yourself to personalize your journey" },
  2: { title: "When are you traveling?", subtitle: "Dates help us recommend the best seasonal activities" },
  3: { title: "Where do you want to go?", subtitle: "Choose up to 3 destinations for your itinerary" },
  4: { title: "What is your budget?", subtitle: "We'll suggest options that match your financial comfort" },
  5: { title: "Where would you like to stay?", subtitle: "From luxury hotels to cozy hostels" },
  6: { title: "How will you get around?", subtitle: "Select your preferred modes of transport" },
  7: { title: "Why are you traveling?", subtitle: "Help us understand the goal of your trip" },
  8: { title: "What interests you?", subtitle: "We'll curate experiences based on your passions" },
  9: { title: "Any food preferences?", subtitle: "Let us know about dietary restrictions or cravings" },
  10: { title: "Do you need visas?", subtitle: "We can help you track documentation requirements" },
  11: { title: "What is your experience level?", subtitle: "Are you a seasoned traveler or first-timer?" },
  12: { title: "How should we contact you?", subtitle: "Final details to send your itinerary" },
};

export default function StepPage() {
  const { stepNumber } = useParams<{ stepNumber: string }>();
  const navigate = useNavigate();
  const { profileId, currentStep, setCurrentStep } = useProfileStore();

  useEffect(() => {
    // console.log('StepPage mounted. StepNumber:', stepNumber, 'ProfileId:', profileId, 'CurrentStep:', currentStep);

    // Validate step number
    const stepNum = parseInt(stepNumber || '1');
    if (isNaN(stepNum) || stepNum < 1 || stepNum > 12) {
      console.log('Invalid step number, redirecting to welcome');
      navigate('/plan');
      return;
    }

    // Check if user has profile
    if (!profileId) {
      // console.log('No profile found, redirecting to welcome');
      navigate('/plan');
      return;
    }

    // Update current step in store
    setCurrentStep(stepNum);
  }, [stepNumber, profileId, currentStep, navigate, setCurrentStep]);

  // Get step component
  const stepNum = parseInt(stepNumber || '1');
  const StepComponent = stepComponents[stepNum as keyof typeof stepComponents];
  // @ts-ignore
  const metadata = stepMetadata[stepNum] || { title: 'Trip Planning', subtitle: `Step ${stepNum}` };

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

  return (
    <StepLayout
      stepNumber={stepNum}
      title={metadata.title}
      subtitle={metadata.subtitle}
      onBack={stepNum > 1 ? () => navigate(`/plan/step/${stepNum - 1}`) : null}
    >
      <StepComponent />
    </StepLayout>
  );
}
