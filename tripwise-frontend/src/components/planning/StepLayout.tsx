import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { useProfileStore } from '@/store/profileStore';
import { useShallow } from 'zustand/react/shallow';
import { getSyncStatus, SyncStatus, onSyncStatusChange, offSyncStatusChange } from '@/lib/api/syncManager';
import ProgressIndicator from './ProgressIndicator';

interface StepLayoutProps {
  stepNumber: number;
  title: string;
  subtitle: string;
  onBack?: (() => void) | null;
  children: React.ReactNode;
  className?: string;
}

export default function StepLayout({
  stepNumber,
  title,
  subtitle,
  onBack,
  children,
  className = '',
}: StepLayoutProps) {
  const { lastSavedAt, error, isSyncing } = useProfileStore(useShallow(state => ({
    lastSavedAt: state.lastSavedAt,
    error: state.error,
    isSyncing: state.isSyncing
  })));
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(SyncStatus.IDLE);
  const [timeAgo, setTimeAgo] = useState<string>('');
  const [showExitWarning, setShowExitWarning] = useState(false);

  // Listen to sync status changes
  useEffect(() => {
    const handleStatusChange = (status: SyncStatus) => {
      setSyncStatus(status);
    };

    onSyncStatusChange?.(handleStatusChange);

    return () => {
      offSyncStatusChange?.(handleStatusChange);
    };
  }, []);

  // Update time ago display
  useEffect(() => {
    if (!lastSavedAt) {
      setTimeAgo('Not saved yet');
      return;
    }

    const updateTimeAgo = () => {
      const now = Date.now();
      const diff = now - lastSavedAt;

      if (diff < 60000) {
        setTimeAgo('Just now');
      } else if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        setTimeAgo(`${minutes} minute${minutes > 1 ? 's' : ''} ago`);
      } else {
        const hours = Math.floor(diff / 3600000);
        setTimeAgo(`${hours} hour${hours > 1 ? 's' : ''} ago`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [lastSavedAt]);

  // Handle exit warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (lastSavedAt) {
        e.preventDefault();
        e.returnValue = 'Your progress is saved. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [lastSavedAt]);

  const getSyncIndicator = () => {
    if (error) {
      return (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">Failed to save</span>
        </div>
      );
    }

    if (isSyncing || syncStatus === SyncStatus.SYNCING) {
      return (
        <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
          <motion.div
            className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <span className="text-sm">Syncing...</span>
        </div>
      );
    }

    if (lastSavedAt) {
      return (
        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg">
          <Save className="w-4 h-4" />
          <span className="text-sm">Saved {timeAgo}</span>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 ${className}`}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Back button */}
            {onBack && (
              <motion.button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                whileHover={{ x: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </motion.button>
            )}

            {/* Sync indicator */}
            <div className="flex-1 flex justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={syncStatus}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  {getSyncIndicator()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Spacer for balance */}
            <div className="w-20" />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <ProgressIndicator currentStep={stepNumber} />
        </motion.div>

        {/* Step header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            {title}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Form content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-6 sm:p-8"
        >
          {children}
        </motion.div>
      </div>

      {/* Exit warning modal */}
      <AnimatePresence>
        {showExitWarning && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowExitWarning(false)}
          >
            <motion.div
              className="bg-white rounded-xl p-6 max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-2">Leave this page?</h3>
              <p className="text-gray-600 mb-4">Your progress is saved. You can come back anytime to continue.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExitWarning(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Stay
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Leave
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
