
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NetworkStatusBanner() {
  const networkStatus = useNetworkStatus();

  if (networkStatus.isOnline) {
    return null; // Don't show banner when online
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-500 to-red-600 text-white"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            {networkStatus.isSlow ? (
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <WifiOff className="w-5 h-5 flex-shrink-0" />
            )}
            
            <div className="flex-1">
              <p className="font-semibold text-sm">
                {networkStatus.isSlow 
                  ? 'Slow connection detected'
                  : 'You are offline'
                }
              </p>
              <p className="text-xs opacity-90">
                {networkStatus.isSlow 
                  ? 'Your data will be saved locally and synced when connection improves'
                  : 'Your data will be saved locally and synced when you reconnect'
                }
              </p>
            </div>
          </div>
          
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-white text-xs font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
