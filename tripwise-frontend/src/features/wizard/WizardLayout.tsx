import React from 'react';
import { useWizardStore } from '@/store/wizardStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Hotel, Car, CheckCircle } from 'lucide-react';
import OverviewView from '@/features/wizard/OverviewView';
import HotelSelectionView from '@/features/wizard/HotelSelectionView';
import TransportSelectionView from '@/features/wizard/TransportSelectionView';
import MasterPlanView from '@/features/wizard/MasterPlanView';
import { LiquidBackground } from '@/components/ui/LiquidBackground';
import { SiteHeader } from '@/components/layout/SiteHeader';

export default function WizardLayout() {
    const { currentStep } = useWizardStore();

    const steps = [
        { id: 'OVERVIEW', label: 'Overview', icon: Map },
        { id: 'HOTEL', label: 'Stay', icon: Hotel },
        { id: 'TRANSPORT', label: 'Commute', icon: Car },
        { id: 'PLAN', label: 'Master Plan', icon: CheckCircle },
    ];

    const getCurrentStepIndex = () => {
        return steps.findIndex(s => s.id === currentStep);
    };

    const renderStep = () => {
        switch (currentStep) {
            case 'OVERVIEW': return <OverviewView />;
            case 'HOTEL': return <HotelSelectionView />;
            case 'TRANSPORT': return <TransportSelectionView />;
            case 'PLAN': return <MasterPlanView />;
            default: return <div>Unknown Step</div>;
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-10 px-4 md:px-8 relative font-sans">
            <LiquidBackground />
            <SiteHeader />

            <div className="max-w-5xl mx-auto relative z-10">

                {/* Progress Header */}
                <div className="mb-12 relative">
                    {/* Background Line */}
                    <div className="absolute top-6 left-0 w-full h-0.5 bg-white/10 -z-0 hidden md:block" />
                    <motion.div
                        className="absolute top-6 left-0 h-0.5 bg-primary -z-0 hidden md:block origin-left"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: (getCurrentStepIndex() / (steps.length - 1)) }}
                        transition={{ duration: 0.5 }}
                    />

                    <div className="flex justify-between items-center relative z-10">
                        {steps.map((step, index) => {
                            const isActive = step.id === currentStep;
                            const isCompleted = getCurrentStepIndex() > index;
                            const Icon = step.icon;

                            return (
                                <div key={step.id} className="flex flex-col items-center gap-3">
                                    <motion.div
                                        initial={false}
                                        animate={{
                                            scale: isActive ? 1.2 : 1,
                                            borderColor: isActive ? 'rgba(var(--primary), 1)' : 'rgba(255,255,255,0.1)'
                                        }}
                                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 relative
                                            ${isActive || isCompleted ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)]' : 'bg-black/20 backdrop-blur-md text-muted-foreground border border-white/10'}
                                        `}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {isActive && (
                                            <motion.div
                                                layoutId="glow"
                                                className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
                                                transition={{ duration: 0.5 }}
                                            />
                                        )}
                                    </motion.div>
                                    <span className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${isActive ? 'text-primary' : 'text-muted-foreground/60'}`}>
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Content Area */}
                <div className="glass-card-material p-5 sm:p-8 md:p-12 min-h-[70vh] md:min-h-[600px] relative overflow-hidden backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="h-full"
                        >
                            {renderStep()}
                        </motion.div>
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
}
