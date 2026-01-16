import { useState, useEffect } from 'react';

interface NetworkStatus {
  isOnline: boolean;
  isSlow: boolean;
  lastChecked: Date;
}

export const useNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    isSlow: false,
    lastChecked: new Date(),
  });

  useEffect(() => {
    const handleOnline = () => {
      setNetworkStatus(prev => ({
        ...prev,
        isOnline: true,
        lastChecked: new Date(),
      }));
    };

    const handleOffline = () => {
      setNetworkStatus(prev => ({
        ...prev,
        isOnline: false,
        lastChecked: new Date(),
      }));
    };

    const checkConnectionSpeed = () => {
      const startTime = Date.now();
      
      fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache',
      })
        .then(() => {
          const endTime = Date.now();
          const duration = endTime - startTime;
          
          setNetworkStatus(prev => ({
            ...prev,
            isSlow: duration > 3000, // Consider slow if > 3 seconds
            lastChecked: new Date(),
          }));
        })
        .catch(() => {
          // If fetch fails, assume offline/slow
          setNetworkStatus(prev => ({
            ...prev,
            isOnline: false,
            isSlow: true,
            lastChecked: new Date(),
          }));
        });
    };

    // Listen for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check connection speed periodically
    const speedCheckInterval = setInterval(checkConnectionSpeed, 30000); // Every 30 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(speedCheckInterval);
    };
  }, []);

  return networkStatus;
};
