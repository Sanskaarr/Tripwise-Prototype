import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useProfileStore } from '@/store/profileStore';
import { useShallow } from 'zustand/react/shallow';
import { ProfileApi } from '@/lib/api/profileApi';

interface SessionRecoveryOptions {
  enableAutoRecovery?: boolean;
  maxRetries?: number;
  retryDelay?: number;
}

export const useSessionRecovery = (options: SessionRecoveryOptions = {}) => {
  const location = useLocation();
  const {
    profileId,
    initializeProfile,
    setLoading,
    setError,
    resetProfile
  } = useProfileStore();

  const [isRecovering, setIsRecovering] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const {
    enableAutoRecovery = true,
    maxRetries = 3,
    retryDelay = 2000,
  } = options;

  const attemptRecovery = useCallback(async () => {
    // Only run on welcome page
    if (location.pathname !== '/plan') {
      return;
    }

    if (!profileId || isRecovering || retryCount >= maxRetries) {
      return;
    }

    setIsRecovering(true);
    setLoading(true);

    try {
      // Try to recover session from localStorage
      const storedProfileId = localStorage.getItem('tripwise-profile-id');
      const storedData = localStorage.getItem(`tripwise-profile-${storedProfileId}`);

      if (storedProfileId && storedData) {
        // Try to validate of stored profile with server
        const response = await ProfileApi.getProfile(storedProfileId);

        if (response.success && response.data) {
          // Profile is valid, restore it
          initializeProfile(storedProfileId);
          setRetryCount(0);
          console.log('Session recovered successfully');
        } else {
          // Profile is invalid or missing, clear and start fresh
          localStorage.removeItem('tripwise-profile-id');
          localStorage.removeItem(`tripwise-profile-${storedProfileId}`);
          resetProfile();
          setRetryCount(0);
          console.log('Invalid session cleared');
        }
      } else {
        // No stored session, check if we have a recent profile ID to try
        const recentProfiles = Object.keys(localStorage)
          .filter(key => key.startsWith('tripwise-profile-'))
          .map(key => key.replace('tripwise-profile-', ''));

        if (recentProfiles.length > 0) {
          // Try to most recent profile
          const mostRecent = recentProfiles[recentProfiles.length - 1];
          const response = await ProfileApi.getProfile(mostRecent);

          if (response.success && response.data) {
            initializeProfile(mostRecent);
            setRetryCount(0);
            console.log('Session recovered from recent profile');
          } else {
            localStorage.removeItem(`tripwise-profile-${mostRecent}`);
            resetProfile();
            setRetryCount(0);
          }
        }
      }
    } catch (error) {
      console.error('Session recovery failed:', error);
      setRetryCount(prev => prev + 1);
      setError('Failed to recover session. Please try again.');
    } finally {
      setIsRecovering(false);
      setLoading(false);
    }
  }, [location.pathname, profileId, isRecovering, retryCount, maxRetries, initializeProfile, setLoading, setError, resetProfile]);

  const checkSession = useCallback(() => {
    // Only run on welcome page
    if (location.pathname !== '/plan') {
      return;
    }

    const hasActiveSession = profileId &&
      localStorage.getItem(`tripwise-profile-${profileId}`);

    if (!hasActiveSession) {
      console.log('No active session found, attempting recovery');
      attemptRecovery();
    }
  }, [location.pathname, profileId, attemptRecovery]);

  useEffect(() => {
    // Auto-recovery on page load if enabled and on welcome page
    if (enableAutoRecovery && location.pathname === '/plan') {
      // Check session immediately
      checkSession();

      // Set up periodic session checking
      const sessionCheckInterval = setInterval(checkSession, 10000); // Every 10 seconds

      return () => {
        clearInterval(sessionCheckInterval);
      };
    }
  }, [enableAutoRecovery, location.pathname, checkSession]);

  return {
    isRecovering: location.pathname === '/plan' ? isRecovering : false,
    retryCount,
    attemptRecovery,
    recoverSession: attemptRecovery,
  };
};