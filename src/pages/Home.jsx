import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Mic, Globe, CreditCard, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../contexts/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export function Home() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const { t } = useLanguage();
  
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6, 1],
    ['#FDFBF7', '#F5F0E8', '#FAF2ED', '#F4F7FA']
  );

  useEffect(() => {
    const sections = gsap.utils.toArray('.scroll-section');
    
    sections.forEach((section, index) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 40%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <motion.div 
      ref={sectionRef}
      style={{ backgroundColor }}
      className="min-h-screen"
    >
      {/* Hero Section - Cream Background */}
      <section className="scroll-section section-bg-cream min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="container mx-auto px-6 py-32 pt-40">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                <Plane size={80} className="text-accent-coral" />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-6 inline-flex items-center gap-2 px-6 py-2 rounded-full border border-charcoal/10"
            >
              <Sparkles size={18} className="text-accent-lavender" />
              <span className="text-sm font-medium tracking-wider text-gray">{t('aiPowered')}</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-6xl md:text-8xl font-display font-bold mb-6 text-charcoal"
            >
              {t('welcomeTitle')}
              <br />
              <span className="text-gradient-pastel">{t('welcomeSubtitle')}</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-2xl md:text-3xl text-gray mb-12 font-light"
            >
              {t('welcomeDescription')}
            </motion.p>
            
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/identify')}
              className="group px-12 py-5 bg-charcoal text-cream text-lg font-medium rounded-full hover:shadow-xl transition-all duration-500"
            >
              <span className="flex items-center gap-3">
                {t('getStarted')}
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Features Section - Beige Background */}
      <section className="scroll-section section-bg-beige py-32">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-display font-bold text-center mb-16 text-charcoal"
          >
            {t('whyChooseTripwise')}
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Plane size={36} />}
              title={t('smartPlanning')}
              description={t('smartPlanningDesc')}
              delay={0}
            />
            <FeatureCard
              icon={<CreditCard size={36} />}
              title={t('instantBooking')}
              description={t('instantBookingDesc')}
              delay={0.1}
            />
            <FeatureCard
              icon={<Mic size={36} />}
              title={t('voiceControl')}
              description={t('voiceControlDesc')}
              delay={0.2}
            />
            <FeatureCard
              icon={<Globe size={36} />}
              title={t('multiLanguage')}
              description={t('multiLanguageDesc')}
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* CTA Section - Peach Background */}
      <section className="scroll-section section-bg-peach py-32">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-4 bg-white/60 backdrop-blur-xl px-12 py-8 rounded-3xl hover-lift border border-charcoal/5">
              <MapPin className="text-accent-coral" size={32} />
              <span className="text-2xl font-display font-medium text-charcoal">
                {t('aiPowered')}
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}

function FeatureCard({ icon, title, description, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="bg-white/60 backdrop-blur-xl p-8 rounded-2xl border border-charcoal/5 cursor-pointer group"
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ duration: 0.3 }}
        className="text-accent-coral mb-4 group-hover:text-accent-lavender transition-colors duration-500"
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-display font-bold text-charcoal mb-3">{title}</h3>
      <p className="text-gray leading-relaxed">{description}</p>
    </motion.div>
  );
}