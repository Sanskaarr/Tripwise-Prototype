import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plane, Menu, X, Globe } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/identify', label: 'Start' },
    { path: '/plan-trip', label: 'Plan' },
    { path: '/local-guide', label: 'Guide' },
  ];

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'es', label: 'Español' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glassmorphism border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <Plane 
                size={32} 
                className="text-aurora-blue group-hover:text-aurora-purple transition-all duration-300 group-hover:rotate-12" 
              />
              <div className="absolute inset-0 bg-aurora-blue blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
            </div>
            <span className="text-2xl font-display font-bold text-gradient">
              TripWise
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-sm font-medium tracking-wide transition-all duration-300 hover:text-aurora-blue ${
                  location.pathname === link.path ? 'text-aurora-blue' : 'text-ice-white/80'
                }`}
              >
                {link.label}
                {location.pathname === link.path && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-aurora-blue to-aurora-purple rounded-full" />
                )}
              </Link>
            ))}
            
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-full glassmorphism hover:bg-white/10 transition-all duration-300"
              >
                <Globe size={18} className="text-aurora-blue" />
                <span className="text-sm font-medium">EN</span>
              </button>
              
              {isLangOpen && (
                <div className="absolute top-full right-0 mt-2 w-40 glassmorphism rounded-2xl overflow-hidden shadow-2xl animate-fade-in">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setIsLangOpen(false)}
                      className="w-full px-4 py-3 text-left text-sm hover:bg-white/10 transition-all duration-200"
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-6 pb-4 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-medium py-2 px-4 rounded-lg transition-all duration-300 ${
                    location.pathname === link.path
                      ? 'bg-aurora-blue/20 text-aurora-blue'
                      : 'text-ice-white/80 hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="flex gap-2 pt-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className="flex-1 px-3 py-2 text-sm rounded-lg glassmorphism hover:bg-white/10 transition-all duration-200"
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
