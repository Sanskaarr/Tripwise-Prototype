
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

interface ValidationErrorsProps {
  errors: Record<string, string>;
  onDismiss?: (field: string) => void;
  className?: string;
}

export default function ValidationErrors({ errors, onDismiss, className = '' }: ValidationErrorsProps) {
  const errorEntries = Object.entries(errors);

  if (errorEntries.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`fixed top-4 right-4 z-50 max-w-md ${className}`}
      >
        <div className="bg-white rounded-lg shadow-lg border border-red-200 p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-red-900">Validation Errors</h3>
                <p className="text-sm text-red-700">
                  {errorEntries.length} {errorEntries.length === 1 ? 'error' : 'errors'} found
                </p>
              </div>
            </div>
            
            <button
              onClick={() => onDismiss?.('all')}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Dismiss all errors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {errorEntries.map(([field, message], index) => (
              <motion.div
                key={field}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-start gap-3 p-3 bg-red-50 rounded border border-red-200"
              >
                <div className="flex-shrink-0 w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-xs font-medium text-red-600">
                    {index + 1}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-red-900 text-sm">
                      {field.replace(/([A-Z])/g, ' $1').replace(/^./, '')}
                    </span>
                    
                    {onDismiss && (
                      <button
                        onClick={() => onDismiss(field)}
                        className="text-red-400 hover:text-red-600 transition-colors p-1 rounded"
                        title={`Dismiss ${field} error`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-red-700">
                  {message}
                </p>
              </motion.div>
            ))}
          </div>

          {errorEntries.length > 3 && (
            <div className="mt-3 pt-3 border-t border-red-200">
              <button
                onClick={() => onDismiss?.('all')}
                className="w-full text-center text-sm text-red-600 hover:text-red-700 transition-colors py-2"
              >
                Dismiss All Errors
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
