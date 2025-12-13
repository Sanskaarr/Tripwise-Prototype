import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plane, Globe, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user } = useUser();
  const location = useLocation();

  const navLinks = [
    { path: '/', label: t('home') },
    { path: '/identify', label: t('startJourney') },
    { path: '/plan-trip', label: t('planTrip') },
    { path: '/local-guide', label: t('localGuide') },
  ];

  // Add user dashboard link if logged in
  if (user) {
    navLinks.push({ path: '/user-dashboard', label: t('myDashboard') || 'My Dashboard' });
  }

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
    { code: 'pt', label: 'Português', flag: '🇵🇹' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  ];

  const currentLang = languages.find(lang => lang.code === language) || languages[0];

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode);
    setIsLangOpen(false);
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.05,
        staggerDirection: -1,
      }
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.08,
        delayChildren: 0.2,
      }
    }
  };

  const linkVariants = {
    closed: {
      opacity: 0,
      y: 50,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <>
      {/* Fixed Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-40 glassmorphism-light border-b border-charcoal/5">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                <Plane 
                  size={28} 
                  className="text-accent-coral group-hover:text-accent-lavender transition-all duration-500 group-hover:rotate-12" 
                />
              </div>
              <span className="text-xl font-display font-bold text-charcoal">
                TripWise
              </span>
            </Link>

            {/* Desktop Quick Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/identify"
                className="text-sm font-medium text-gray hover:text-charcoal transition-all duration-300"
              >
                {t('startJourney')}
              </Link>
              
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-charcoal/10 hover:border-accent-coral/30 transition-all duration-300"
                >
                  <span className="text-lg">{currentLang.flag}</span>
                  <span className="text-xs font-medium text-gray">{currentLang.code.toUpperCase()}</span>
                </button>
                
                <AnimatePresence>
                  {isLangOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="absolute top-full right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-xl overflow-hidden shadow-xl border border-charcoal/5 max-h-[400px] overflow-y-auto"
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang.code)}
                          className={`w-full px-4 py-3 text-left text-sm flex items-center gap-3 transition-all duration-200 ${
                            language === lang.code 
                              ? 'bg-accent-coral/10 text-accent-coral font-semibold' 
                              : 'text-gray hover:bg-beige hover:text-charcoal'
                          }`}
                        >
                          <span className="text-lg">{lang.flag}</span>
                          <span>{lang.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex flex-col gap-1.5 p-2 group"
              aria-label="Menu"
            >
              <motion.span
                animate={isMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-6 h-0.5 bg-charcoal group-hover:bg-accent-coral transition-colors duration-300"
              />
              <motion.span
                animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="w-6 h-0.5 bg-charcoal group-hover:bg-accent-coral transition-colors duration-300"
              />
              <motion.span
                animate={isMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-6 h-0.5 bg-charcoal group-hover:bg-accent-coral transition-colors duration-300"
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Full-Screen Overlay Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-50 bg-cream"
            style={{ paddingTop: '80px' }}
          >
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="container mx-auto px-6 py-12 h-full flex flex-col justify-center"
            >
              {/* Navigation Links */}
              <nav className="space-y-6 mb-16">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.path}
                    variants={linkVariants}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className="block group"
                    >
                      <div className="flex items-baseline gap-4">
                        <span className="text-sm font-medium text-mid-gray">
                          0{index + 1}
                        </span>
                        <h2 className="text-5xl md:text-7xl font-display font-bold text-charcoal group-hover:text-accent-coral transition-all duration-500">
                          {link.label}
                        </h2>
                      </div>
                      {location.pathname === link.path && (
                        <motion.div
                          layoutId="activeLink"
                          className="h-1 bg-accent-coral rounded-full ml-12 mt-2"
                          initial={false}
                          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Bottom Info */}
              <motion.div
                variants={linkVariants}
                className="mt-auto pt-8 border-t border-charcoal/10"
              >
                <div className="flex flex-wrap gap-6 text-sm text-mid-gray">
                  <div className="flex items-center gap-2">
                    <Globe size={16} className="text-accent-coral" />
                    <span>{t('availableLanguages')} {languages.length} {t('languages')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Plane size={16} className="text-accent-coral" />
                    <span>{t('aiPowered')}</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close Button - Separate from menu animation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsMenuOpen(false)}
            className="fixed top-8 right-8 z-[60] p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-accent-coral hover:text-white transition-all duration-300 shadow-2xl group"
            aria-label="Close menu"
          >
            <X size={24} className="text-charcoal group-hover:text-white transition-colors" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}