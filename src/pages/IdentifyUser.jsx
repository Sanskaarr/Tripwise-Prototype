import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';

export function IdentifyUser() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [isReturning, setIsReturning] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { login, user } = useUser();

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      setStep(2);
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (identifier.trim()) {
      const storedUser = localStorage.getItem('tripwise_user');
      const hasVisited = !!storedUser;
      
      if (hasVisited) {
        try {
          const userData = JSON.parse(storedUser);
          if (userData.identifier === identifier) {
            setIsReturning(true);
          } else {
            setIsReturning(false);
          }
        } catch {
          setIsReturning(false);
        }
      } else {
        setIsReturning(false);
      }
      
      login(identifier, name);
      
      setTimeout(() => {
        navigate('/plan-trip');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen section-bg-cream flex items-center justify-center px-4 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="bg-white/60 backdrop-blur-xl p-10 rounded-3xl shadow-lg border border-charcoal/5 max-w-lg w-full"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative inline-flex mb-6"
          >
            <div className="bg-accent-coral/10 p-6 rounded-2xl">
              <User size={56} className="text-accent-coral" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-4 inline-flex items-center gap-2 px-5 py-2 rounded-full border border-charcoal/10"
          >
            <Sparkles size={16} className="text-accent-lavender" />
            <span className="text-xs font-medium tracking-wider text-gray">{t('stepOf')} {step} {t('of')} 2</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-4xl font-display font-bold text-charcoal mb-3"
          >
            {step === 1 ? (
              <>{t('whatsYourName')} <span className="text-gradient-pastel">{t('name')}</span>?</>
            ) : (
              <>{t('howCanWeReachYou')} <span className="text-gradient-pastel">{t('reachYou')}</span>?</>
            )}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-gray text-lg"
          >
            {step === 1 ? t('tellUsYourName') : t('enterPhoneOrEmail')}
          </motion.p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleNameSubmit} className="space-y-7">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <label className="block text-sm font-semibold text-gray mb-3 tracking-wide">
                {t('yourName')}
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-coral" size={22} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('enterFullName')}
                  className="w-full pl-14 pr-5 py-5 bg-white/80 border border-charcoal/10 rounded-xl text-charcoal placeholder-gray/50 focus:border-accent-coral focus:outline-none transition-all duration-300 text-lg"
                  required
                  autoFocus
                />
              </div>
            </motion.div>

            <motion.button
              type="submit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-5 bg-charcoal text-cream text-lg font-display font-semibold rounded-xl hover:shadow-xl transition-all duration-300"
            >
              {t('continue')}
            </motion.button>
          </form>
        ) : (
          <form onSubmit={handleContactSubmit} className="space-y-7">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <label className="block text-sm font-semibold text-gray mb-3 tracking-wide">
                {t('phoneOrEmail')}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-coral">
                  {identifier.includes('@') ? <Mail size={22} /> : <Phone size={22} />}
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={t('enterPhoneEmail')}
                  className="w-full pl-14 pr-5 py-5 bg-white/80 border border-charcoal/10 rounded-xl text-charcoal placeholder-gray/50 focus:border-accent-coral focus:outline-none transition-all duration-300 text-lg"
                  required
                  autoFocus
                />
              </div>
            </motion.div>

            {isReturning && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="border border-accent-sage/30 rounded-xl p-5 text-charcoal text-center bg-accent-sage/10"
              >
                <span className="text-2xl mb-2 block">🎉</span>
                <span className="font-semibold">{t('welcomeBack')}, {name}!</span>
              </motion.div>
            )}

            {isReturning === false && identifier && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="border border-accent-coral/30 rounded-xl p-5 text-charcoal text-center bg-accent-coral/10"
              >
                <span className="text-2xl mb-2 block">✈️</span>
                <span className="font-semibold">{t('letsplanFirstAdventure')}, {name}!</span>
              </motion.div>
            )}

            <div className="flex gap-3">
              <motion.button
                type="button"
                onClick={() => setStep(1)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="py-5 px-8 bg-white/80 text-charcoal text-lg font-display font-semibold rounded-xl hover:shadow-lg transition-all duration-300 border border-charcoal/10"
              >
                {t('back')}
              </motion.button>
              <motion.button
                type="submit"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-5 bg-charcoal text-cream text-lg font-display font-semibold rounded-xl hover:shadow-xl transition-all duration-300"
              >
                {t('startPlanning')}
              </motion.button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}