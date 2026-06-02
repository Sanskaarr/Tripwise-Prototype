
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProfileStore } from '@/store/profileStore';
import { ProfileApi } from '@/lib/api/profileApi';
import { getCompletionStatus } from '@/lib/validation/helpers';

// Import all step components
import BasicInfoStep from '@/features/planning/steps/BasicInfoStep';
import DatesStep from '@/features/planning/steps/DatesStep';
import DestinationStep from '@/features/planning/steps/DestinationStep';
import BudgetStep from '@/features/planning/steps/BudgetStep';
import AccommodationStep from '@/features/planning/steps/AccommodationStep';
import { LiquidBackground } from '@/components/ui/LiquidBackground';
import { SiteHeader } from '@/components/layout/SiteHeader';
import TransportStep from '@/features/planning/steps/TransportStep';
import PurposeStep from '@/features/planning/steps/PurposeStep';
import InterestsStep from '@/features/planning/steps/InterestsStep';
import FoodStep from '@/features/planning/steps/FoodStep';
import DocumentsStep from '@/features/planning/steps/DocumentsStep';
import ExperienceStep from '@/features/planning/steps/ExperienceStep';
import CommunicationStep from '@/features/planning/steps/CommunicationStep';

// Step component mapping
const stepComponents = {
    '1': BasicInfoStep,
    '2': DatesStep,
    '3': DestinationStep,
    '4': BudgetStep,
    '5': AccommodationStep,
    '6': TransportStep,
    '7': PurposeStep,
    '8': InterestsStep,
    '9': FoodStep,
    '10': DocumentsStep,
    '11': ExperienceStep,
    '12': CommunicationStep,
} as const;

type StepId = keyof typeof stepComponents;

// Step order for navigation
const stepOrder: StepId[] = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12'
];

export default function StepPage() {
    const navigate = useNavigate();
    const { stepId } = useParams<{ stepId: string }>();
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

    // Validate stepId
    const validatedStepId = (stepComponents[stepId as StepId] ? stepId : '1') as StepId;

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
                const stepIndex = stepOrder.indexOf(validatedStepId);
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
    }, [validatedStepId, profileId]);

    const StepComponent = stepComponents[validatedStepId];

    if (isInitializing) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-6 p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 rounded-full border-4 border-white/10" />
                        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                    </div>
                    <p className="font-display text-lg text-white/80 animate-pulse tracking-wide">Preparing your journey...</p>
                </div>
            </div>
        );
    }

    if (showWelcomeBack) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center p-4">
                <div className="ios-glass p-8 rounded-3xl max-w-md w-full text-center">
                    <h2 className="text-2xl font-display font-medium text-white mb-4">Session Expired</h2>
                    <p className="text-white/60 mb-8 leading-relaxed">
                        Your planning session has expired. Please start a new travel plan to continue your journey.
                    </p>
                    <button
                        onClick={() => navigate('/plan')}
                        className="w-full bg-white/10 hover:bg-white/20 text-white font-bold tracking-widest uppercase py-4 rounded-xl transition-all duration-300 border border-white/10"
                    >
                        Start New Plan
                    </button>
                </div>
            </div>
        );
    }

    if (!StepComponent) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center p-4">
                <div className="ios-glass p-8 rounded-3xl text-center max-w-md w-full">
                    <h2 className="text-2xl font-display font-medium text-white mb-4">Step Not Found</h2>
                    <p className="text-white/60 mb-8">
                        The requested step doesn't exist.
                    </p>
                    <button
                        onClick={() => navigate('/plan')}
                        className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl transition-colors font-medium"
                    >
                        Back to Planning
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="fixed inset-0 z-[-1]">
                <LiquidBackground />
            </div>
            <SiteHeader />
            <div className="relative min-h-screen pt-20 pb-10 flex items-center justify-center">
                <StepComponent />
            </div>
        </>
    );
}
