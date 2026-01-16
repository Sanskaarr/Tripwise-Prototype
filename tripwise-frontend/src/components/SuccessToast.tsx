'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';

interface SuccessToastProps {
  show: boolean;
  message: string;
  duration?: number;
  onDismiss?: () => void;
}

export default function SuccessToast({ 
  show, 
  message, 
  duration = 3000, 
  onDismiss 
}: SuccessToastProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="fixed top-4 right-4 z-50 max-w-md"
        >
          <div className="bg-green-600 text-white rounded-lg shadow-lg p-4 flex items-center gap-3">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            
            <div className="flex-1">
              <p className="font-medium text-sm">{message}</p>
              <p className="text-xs opacity-90">Success!</p>
            </div>
            
            <button
              onClick={onDismiss}
              className="text-green-100 hover:text-green-200 transition-colors p-1 rounded"
              title="Dismiss"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
