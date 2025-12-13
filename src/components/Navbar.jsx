import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plane, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/identify', label: 'Start Journey' },
    { path: '/plan-trip', label: 'Plan Trip' },
    { path: '/local-guide', label: 'Local Guide' },
  ];

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'es', label: 'Español' },
  ];

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
                Start
              </Link>
              
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-charcoal/10 hover:border-accent-coral/30 transition-all duration-300"
                >
                  <Globe size={16} className="text-accent-coral" />
                  <span className="text-xs font-medium text-gray">EN</span>
                </button>
                
                <AnimatePresence>
                  {isLangOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="absolute top-full right-0 mt-2 w-36 bg-white/90 backdrop-blur-xl rounded-xl overflow-hidden shadow-lg border border-charcoal/5"
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => setIsLangOpen(false)}
                          className="w-full px-4 py-2.5 text-left text-sm text-gray hover:bg-beige hover:text-charcoal transition-all duration-200"
                        >
                          {lang.label}
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

      {/* Full-Screen Overlay Menu - Inspired by cabanana.pt */}
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
                    <span>Available in 3 languages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Plane size={16} className="text-accent-coral" />
                    <span>AI-Powered Travel Companion</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
