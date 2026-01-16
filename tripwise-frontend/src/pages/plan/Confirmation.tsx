import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProfileStore } from '@/store/profileStore';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles, Home, RefreshCcw, MessageCircle, Clock, Heart } from 'lucide-react';

const Confirmation = () => {
  const navigate = useNavigate();
  const { profileId, basicInfo, completeOnboarding, resetProfile } = useProfileStore();

  useEffect(() => {
    if (!profileId) {
      navigate('/plan');
      return;
    }
    completeOnboarding();
  }, [profileId, navigate, completeOnboarding]);

  const handleStartOver = () => {
    resetProfile();
    navigate('/plan');
  };

  const firstName = basicInfo?.fullName?.split(' ')[0] || 'Traveler';

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg"
      >
        {/* Success Card */}
        <div className="glass-card-elevated p-6 sm:p-8 md:p-10 text-center">
          {/* Animated Check */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="relative inline-block mb-6"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: 'spring' }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-display text-2xl sm:text-3xl md:text-4xl text-foreground mb-3"
          >
            Thank You, {firstName}!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground text-sm sm:text-base mb-8 max-w-sm mx-auto"
          >
            Your trip planning is complete. We'll take it from here and craft your perfect journey.
          </motion.p>

          {/* What's Next */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-muted/50 rounded-2xl p-5 sm:p-6 mb-8 text-left"
          >
            <h3 className="font-medium text-foreground mb-4 text-center text-sm sm:text-base">
              What happens next?
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MessageCircle className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">We'll reach out</p>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Our travel expert will contact you within 24 hours
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Personalized itinerary</p>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Receive a custom trip plan based on your preferences
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Heart className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Refine together</p>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    We'll work with you to perfect every detail
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Button
              variant="outline"
              onClick={handleStartOver}
              className="group text-sm sm:text-base"
            >
              <RefreshCcw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
              Plan Another Trip
            </Button>
            <Button
              onClick={() => navigate('/chat')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground group text-sm sm:text-base"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Continue to Chat
            </Button>
          </motion.div>
        </div>

        {/* Bottom Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-muted-foreground text-xs sm:text-sm mt-6"
        >
          Made with ❤️ by TripWise
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Confirmation;
