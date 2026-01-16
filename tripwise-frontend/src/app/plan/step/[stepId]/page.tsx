'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '@/store/profileStore';
import { ProfileApi } from '@/lib/api/profileApi';
import { getCompletionStatus } from '@/lib/validation/helpers';

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
  'basic-info': BasicInfoStep,
  'dates': DatesStep,
  'destination': DestinationStep,
  'budget': BudgetStep,
  'accommodation': AccommodationStep,
  'transport': TransportStep,
  'purpose': PurposeStep,
  'interests': InterestsStep,
  'food': FoodStep,
  'documents': DocumentsStep,
  'experience': ExperienceStep,
  'communication': CommunicationStep,
} as const;

type StepId = keyof typeof stepComponents;

// Step order for navigation
const stepOrder: StepId[] = [
  'basic-info',
  'dates', 
  'destination',
  'budget',
  'accommodation',
  'transport',
  'purpose',
  'interests',
  'food',
  'documents',
  'experience',
  'communication',
];

export default function StepPage({ params }: { params: { stepId: string } }) {
  const navigate = useNavigate();
  const { 
    profileId, 
    currentStep, 
    initializeProfile, 
    goToStep, 
    setLoading, 
    setError,
    isLoading 
  } = useProfileStore();

  const [isInitializing, setIsInitializing] = useState(true);
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);

  const stepId = params.stepId as StepId;

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsInitializing(true);
        
        // Check if profileId exists in store
        if (!profileId) {
          // Try to load from local storage first
          const storedProfileId = localStorage.getItem('tripwise-profile-id');
          if (storedProfileId) {
            // Load existing profile
            const response = await ProfileApi.getProfile(storedProfileId);
            if (response.success && response.data) {
              initializeProfile(storedProfileId, response.data);
              return;
            }
          }
          
          // No existing profile, redirect to welcome
          setShowWelcomeBack(true);
          return;
        }

        // Validate current step
        const stepIndex = stepOrder.indexOf(stepId);
        if (stepIndex === -1) {
          navigate('/plan');
          return;
        }

        // Simple completion check - if any previous step is incomplete, allow access
        const canAccessStep = stepIndex <= 0 || true;
        if (!canAccessStep) {
          // Find the first incomplete step
          for (let i = 0; i < stepIndex; i++) {
            if (i === 0) {
              navigate(`/plan/step/${stepOrder[i]}`);
              return;
            }
          }
        }

        // Update current step in store
        goToStep(stepIndex + 1);

      } catch (error) {
        console.error('Failed to initialize step:', error);
        setError('Failed to load profile. Please try again.');
      } finally {
        setIsInitializing(false);
      }
    };

    initializeApp();
  }, [stepId, profileId]);

  const StepComponent = stepComponents[stepId];

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading your travel profile...</p>
        </div>
      </div>
    );
  }

  if (showWelcomeBack) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Session Expired</h2>
          <p className="text-gray-600 mb-6">
            Your planning session has expired. Please start a new travel plan.
          </p>
          <button
            onClick={() => navigate('/plan')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start New Plan
          </button>
        </div>
      </div>
    );
  }

  if (!StepComponent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Step Not Found</h2>
          <p className="text-gray-600 mb-6">
            The requested step doesn't exist.
          </p>
          <button
            onClick={() => navigate('/plan')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Planning
          </button>
        </div>
      </div>
    );
  }

  return <StepComponent />;
}
