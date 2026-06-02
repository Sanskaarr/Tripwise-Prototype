
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '@/store/profileStore';
import { ProfileApi } from '@/lib/api/profileApi';
import { motion } from 'framer-motion';
import { CheckCircle, Send, ArrowRight, Home, Download } from 'lucide-react';

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const { profileId, isLoading, error, resetProfile, validateSession, ...profileData } = useProfileStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!profileId) return;

    setIsSubmitting(true);
    try {
      // Collect all profile data to submit
      const dataToSubmit = {
        basicInfo: profileData.basicInfo,
        dates: profileData.dates,
        // ... (other fields remain same, relying on spread in original or explicit)
        destination: profileData.destination,
        budget: profileData.budget,
        accommodation: profileData.accommodation,
        transport: profileData.transport,
        purpose: profileData.purpose,
        interests: profileData.interests,
        food: profileData.food,
        documents: profileData.documents,
        experience: profileData.experience,
        communication: profileData.communication,
      };

      console.log('Submitting profile data:', dataToSubmit);

      // 1. Submit Profile
      const response = await ProfileApi.submitProfile(profileId, dataToSubmit);

      if (response.success) {
        // Step 1: Reset the wizard step state (clears profileId, currentStep, etc.)
        resetProfile();

        // Step 2: Re-fetch the full profile from backend so basicInfo.fullName is
        // restored before the dashboard loads — this fixes the 'Hello, Traveler' bug
        await validateSession();

        // Step 3: Initialize the Wizard Session (The "Magic" Handoff)
        try {
          const { InteractiveApi } = await import('@/lib/api/interactiveApi');
          const { useWizardStore } = await import('@/store/wizardStore');

          const sessionRes = await InteractiveApi.initSession(profileId);
          if (sessionRes.success && sessionRes.data) {
            // Initialize Store
            useWizardStore.getState().setSessionId(sessionRes.data.id);
            useWizardStore.getState().setOverviewData(sessionRes.data.destinationOverview);
            useWizardStore.getState().setStep('OVERVIEW');

            // Navigate to Dashboard
            navigate('/dashboard');
          } else {
            console.error("Failed to init wizard session");
            navigate('/'); // Fallback
          }
        } catch (e) {
          console.error("Wizard init error", e);
          navigate('/');
        }

      } else {
        throw new Error(response.error || 'Failed to submit profile');
      }
    } catch (err) {
      console.error('Profile submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReturnToPlanning = () => {
    navigate('/plan/step/communication');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900/20 via-background to-blue-900/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full"
      >
        <div className="glass-card-material p-5 sm:p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center justify-center mb-4"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
            </motion.div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4">
              Ready to Submit!
            </h1>

            <p className="text-sm sm:text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
              Review your travel preferences and submit your profile to receive personalized recommendations.
            </p>
          </div>

          {/* Profile Summary */}
          <div className="glass-card-subtle rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Profile Summary</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Profile ID:</span>
                <span className="font-mono">{profileId}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-green-600 font-medium">Ready to Submit</span>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card-subtle border border-red-500/30 rounded-lg p-4 mb-6"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                  <Send className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-red-400">Submission Failed</h4>
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            {!isSubmitted ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || isLoading || !profileId}
                className="w-full glass-button-primary text-foreground font-semibold py-4 px-8 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 rounded-full animate-spin"></div>
                    <span>Submitting your profile...</span>
                  </>
                ) : (
                  <>
                    <span>Submit My Plan</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Successfully Submitted!
                </h3>
                <p className="text-muted-foreground mb-4">
                  Your travel profile has been submitted successfully. We'll send you personalized recommendations soon.
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={handleReturnToPlanning}
                    className="glass-card-subtle flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-foreground"
                  >
                    <Home className="w-4 h-4" />
                    <span>Back to Planning</span>
                  </button>

                  <button
                    onClick={() => navigate('/')}
                    className="glass-button-primary flex items-center gap-2 px-4 py-2 rounded-lg text-foreground"
                  >
                    <Download className="w-4 h-4" />
                    <span>Go to Home</span>
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Trust Indicators */}
          <div className="mt-8 pt-8 border-t border-border/20">
            <div className="text-center text-sm text-muted-foreground">
              <p className="mb-2">Your data is secure and will be processed within 24 hours</p>
              <div className="flex justify-center gap-4 text-xs">
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  End-to-end encrypted
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  GDPR Compliant
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  Safe & Secure
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
