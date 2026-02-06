import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import localforage from 'localforage';

export interface TravelerInfo {
  fullName: string;
  whatsappNumber: string;
  email: string;
  cityOfDeparture: string;
  adults: number;
  children: number;
  infants: number;
}

export interface TravelDates {
  startDate: string | null;
  returnDate: string | null;
  isFlexible: boolean;
  duration: number;
}

export interface DestinationPreference {
  destination: string;
  travelType: 'domestic' | 'international' | null;
  preferenceType: 'mountains' | 'beach' | 'city' | 'spiritual' | 'adventure' | null;
  isFirstVisit: boolean | null;
}

export interface BudgetPreference {
  level: 'low' | 'medium' | 'premium' | 'luxury' | null;
  includesFlights: 'yes' | 'no' | 'not-sure' | null;
}

export interface AccommodationPreference {
  category: 'budget' | 'mid-range' | 'luxury' | 'resort' | 'homestay' | null;
  roomType: 'single' | 'double' | 'twin' | 'family' | 'dorm' | null;
  specialNeeds: string[];
}

export interface TransportPreference {
  mode: 'flight' | 'train' | 'bus' | 'own-vehicle' | null;
  timingPreference: string;
  pickupDrop: boolean;
}

export interface TravelPurpose {
  purpose: 'vacation' | 'honeymoon' | 'family' | 'solo' | 'business' | 'religious' | null;
  specialOccasion: string;
}

export interface Activities {
  sightseeing: boolean;
  relaxation: boolean;
  adventure: boolean;
  shopping: boolean;
  nature: boolean;
  food: boolean;
}

export interface FoodPreference {
  type: 'veg' | 'non-veg' | 'both' | null;
  allergies: string;
}

export interface DocumentStatus {
  hasPassport: boolean | null;
  passportExpiry: string;
  visaAwareness: 'yes' | 'no' | 'not-sure' | null;
}

export interface TravelExperience {
  frequency: 'never' | 'sometimes' | 'frequent' | null;
  badExperiences: string;
}

export interface CommunicationPreference {
  method: 'whatsapp' | 'call' | 'email' | null;
  bestTime: string;
}

export interface TravelerProfile {
  profileId: string | null;
  currentStep: number;
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;
  lastSavedAt: number | null;

  // Authentication state
  isAuthenticated: boolean;
  isNewUser: boolean;
  userIdentifier: string | null; // phone or email
  token: string | null;

  // Step Data (1-12)
  basicInfo: TravelerInfo;
  dates: TravelDates;
  destination: DestinationPreference;
  budget: BudgetPreference;
  accommodation: AccommodationPreference;
  transport: TransportPreference;
  purpose: TravelPurpose;
  interests: Activities;
  food: FoodPreference;
  documents: DocumentStatus;
  experience: TravelExperience;
  communication: CommunicationPreference;
}

export interface ProfileState extends TravelerProfile {
  // Actions
  initializeProfile: (profileId?: string, data?: Partial<TravelerProfile>) => void;
  updateStepData: (stepId: string, data: Record<string, unknown>) => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  goToStep: (stepNumber: number) => void;
  setLoading: (loading: boolean) => void;
  setSyncing: (syncing: boolean) => void;
  setError: (message: string | null) => void;
  markSaved: () => void;
  resetProfile: () => void;

  // Auth actions
  authenticateUser: (identifier: string, token: string, profile?: TravelerProfile) => void;
  logout: () => void;
  setNewUser: (isNew: boolean) => void;
  validateSession: () => Promise<void>;

  // Legacy actions for compatibility
  setProfileId: (id: string) => void;
  setCurrentStep: (step: number) => void;
  updateTravelerInfo: (info: Partial<TravelerInfo>) => void;
  updateTravelDates: (dates: Partial<TravelDates>) => void;
  updateDestinationPreference: (pref: Partial<DestinationPreference>) => void;
  updateBudgetPreference: (pref: Partial<BudgetPreference>) => void;
  updateAccommodationPreference: (pref: Partial<AccommodationPreference>) => void;
  updateTransportPreference: (pref: Partial<TransportPreference>) => void;
  updateTravelPurpose: (purpose: Partial<TravelPurpose>) => void;
  updateActivities: (activities: Partial<Activities>) => void;
  updateFoodPreference: (pref: Partial<FoodPreference>) => void;
  updateDocumentStatus: (status: Partial<DocumentStatus>) => void;
  updateTravelExperience: (exp: Partial<TravelExperience>) => void;
  updateCommunicationPreference: (pref: Partial<CommunicationPreference>) => void;
  completeOnboarding: () => void;
}

const initialDataState: Omit<TravelerProfile, 'profileId' | 'currentStep' | 'isLoading' | 'isSyncing' | 'error' | 'lastSavedAt' | 'isAuthenticated' | 'isNewUser' | 'userIdentifier' | 'token'> = {
  // Step 1: Basic Info
  basicInfo: {
    fullName: '',
    whatsappNumber: '',
    email: '',
    cityOfDeparture: '',
    adults: 1,
    children: 0,
    infants: 0,
  },

  // Step 2: Dates
  dates: {
    startDate: null,
    returnDate: null,
    isFlexible: false,
    duration: 0,
  },

  // Step 3: Destination
  destination: {
    destination: '',
    travelType: null,
    preferenceType: null,
    isFirstVisit: null,
  },

  // Step 4: Budget
  budget: {
    level: null,
    includesFlights: null,
  },

  // Step 5: Accommodation
  accommodation: {
    category: null,
    roomType: null,
    specialNeeds: [],
  },

  // Step 6: Transport
  transport: {
    mode: null,
    timingPreference: '',
    pickupDrop: false,
  },

  // Step 7: Purpose
  purpose: {
    purpose: null,
    specialOccasion: '',
  },

  // Step 8: Interests
  interests: {
    sightseeing: false,
    relaxation: false,
    adventure: false,
    shopping: false,
    nature: false,
    food: false,
  },

  // Step 9: Food
  food: {
    type: null,
    allergies: '',
  },

  // Step 10: Documents
  documents: {
    hasPassport: null,
    passportExpiry: '',
    visaAwareness: null,
  },

  // Step 11: Experience
  experience: {
    frequency: null,
    badExperiences: '',
  },

  // Step 12: Communication
  communication: {
    method: null,
    bestTime: '',
  },
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profileId: null,
      currentStep: 1,
      isLoading: false,
      isSyncing: false,
      error: null,
      lastSavedAt: null,
      isAuthenticated: false,
      isNewUser: true,
      userIdentifier: null,
      token: localStorage.getItem('auth_token'),
      ...initialDataState,

      // New actions
      initializeProfile: (profileId?: string, data?: Partial<TravelerProfile>) => {
        const id = profileId || `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        if (data) {
          set({
            ...initialDataState, // Defaults first
            ...data,
            // Ensure nested objects are safety merged
            basicInfo: data.basicInfo || initialDataState.basicInfo,
            dates: data.dates || initialDataState.dates,
            destination: data.destination || initialDataState.destination,
            budget: data.budget || initialDataState.budget,
            accommodation: data.accommodation || initialDataState.accommodation,
            transport: data.transport || initialDataState.transport,
            purpose: data.purpose || initialDataState.purpose,
            interests: data.interests || initialDataState.interests,
            food: data.food || initialDataState.food,
            documents: data.documents || initialDataState.documents,
            experience: data.experience || initialDataState.experience,
            communication: data.communication || initialDataState.communication,

            profileId: id,
            isLoading: false,
            error: null
          });
        } else {
          set({ profileId: id, isLoading: false, error: null });
        }
      },

      updateStepData: (stepId: string, data: Record<string, unknown>) => {
        const stepMapping: Record<string, keyof Omit<TravelerProfile, 'profileId' | 'currentStep' | 'isLoading' | 'isSyncing' | 'error' | 'lastSavedAt'>> = {
          'basicInfo': 'basicInfo',
          'dates': 'dates',
          'destination': 'destination',
          'budget': 'budget',
          'accommodation': 'accommodation',
          'transport': 'transport',
          'purpose': 'purpose',
          'interests': 'interests',
          'food': 'food',
          'documents': 'documents',
          'experience': 'experience',
          'communication': 'communication',
        };

        const stateKey = stepMapping[stepId];
        if (stateKey) {
          set((state) => {
            const currentState = state as ProfileState;
            const currentValue = currentState[stateKey] as unknown as Record<string, unknown>;
            return {
              [stateKey]: { ...currentValue, ...data },
              error: null
            };
          });
        }
      },

      goToNextStep: () => {
        const currentStep = get().currentStep;
        if (currentStep < 12) {
          set({ currentStep: currentStep + 1 });
        }
      },

      goToPrevStep: () => {
        const currentStep = get().currentStep;
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1 });
        }
      },

      goToStep: (stepNumber: number) => {
        if (stepNumber >= 1 && stepNumber <= 12) {
          set({ currentStep: stepNumber });
        }
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setSyncing: (syncing: boolean) => set({ isSyncing: syncing }),
      setError: (message: string | null) => set({ error: message }),
      markSaved: () => set({ lastSavedAt: Date.now() }),
      resetProfile: () => set({ profileId: null, currentStep: 1, ...initialDataState }),

      // Auth actions
      // Auth actions
      authenticateUser: (identifier: string, token: string, profile?: TravelerProfile) => {
        // Save token securely (separate from store to survive purges)
        if (token) {
          localStorage.setItem('auth_token', token);
        }

        if (profile) {
          // Returning user - load their profile and merge with defaults to avoid nulls
          set({
            ...initialDataState, // Defaults first
            ...profile, // Overwrite with backend data
            // Ensure nested objects are safety merged
            basicInfo: profile.basicInfo || initialDataState.basicInfo,
            dates: profile.dates || initialDataState.dates,
            destination: profile.destination || initialDataState.destination,
            budget: profile.budget || initialDataState.budget,
            accommodation: profile.accommodation || initialDataState.accommodation,
            transport: profile.transport || initialDataState.transport,
            purpose: profile.purpose || initialDataState.purpose,
            interests: profile.interests || initialDataState.interests,
            food: profile.food || initialDataState.food,
            documents: profile.documents || initialDataState.documents,
            experience: profile.experience || initialDataState.experience,
            communication: profile.communication || initialDataState.communication,

            isAuthenticated: true,
            isNewUser: false,
            userIdentifier: identifier,
            token: token
          });
        } else {
          // New user - determine type and pre-fill basic info
          const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

          set((state) => ({
            isAuthenticated: true,
            isNewUser: true,
            userIdentifier: identifier,
            token: token,
            // Keep existing state or reset? Usually keep current progress if authenticating mid-flow
            // But if it's a fresh auth... lets verify logic behavior.
            basicInfo: {
              ...state.basicInfo,
              email: isEmail ? identifier : state.basicInfo.email,
              whatsappNumber: !isEmail ? identifier : state.basicInfo.whatsappNumber,
            }
          }));
        }
      },

      validateSession: async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) return;

        try {
          // Dynamic import to avoid circular dependency issues if any
          const { validateSession } = await import('@/lib/api/authApi');

          set({ isSyncing: true });
          const response = await validateSession(token);

          if (response.success && response.data) {
            const { profile, isNewUser, identifier } = response.data;

            if (profile) {
              // Restore full profile
              get().authenticateUser(identifier || profile.basicInfo.whatsappNumber || profile.basicInfo.email || "", token, profile);
            } else if (isNewUser && identifier) {
              // Valid session but new user (stay on step 1)
              get().authenticateUser(identifier, token);
            }
          } else {
            // Invalid token
            localStorage.removeItem('auth_token');
            set({ isAuthenticated: false, token: null });
          }
        } catch (error) {
          console.error("Session validation failed:", error);
          // Don't logout immediately on network error, but maybe on 401?
          // AuthApi handles 401 by returning appropriate error message or status
          // For now, let's just stop loading
        } finally {
          set({ isSyncing: false });
        }
      },

      setNewUser: (isNew: boolean) => set({ isNewUser: isNew }),

      logout: () => {
        set({
          isAuthenticated: false,
          userIdentifier: null,
          profileId: null,
          currentStep: 1,
          ...initialDataState
        });
        // Clear persistence
        localStorage.removeItem('tripwise-profile');
        localStorage.removeItem('auth_token');
      },

      // Legacy actions for compatibility
      setProfileId: (id: string) => set({ profileId: id }),
      setCurrentStep: (step: number) => set({ currentStep: step }),

      updateTravelerInfo: (info) =>
        set((state) => ({
          basicInfo: { ...state.basicInfo, ...info },
        })),

      updateTravelDates: (dates) =>
        set((state) => ({
          dates: { ...state.dates, ...dates },
        })),

      updateDestinationPreference: (pref) =>
        set((state) => ({
          destination: { ...state.destination, ...pref },
        })),

      updateBudgetPreference: (pref) =>
        set((state) => ({
          budget: { ...state.budget, ...pref },
        })),

      updateAccommodationPreference: (pref) =>
        set((state) => ({
          accommodation: { ...state.accommodation, ...pref },
        })),

      updateTransportPreference: (pref) =>
        set((state) => ({
          transport: { ...state.transport, ...pref },
        })),

      updateTravelPurpose: (purpose) =>
        set((state) => ({
          purpose: { ...state.purpose, ...purpose },
        })),

      updateActivities: (activities) =>
        set((state) => ({
          interests: { ...state.interests, ...activities },
        })),

      updateFoodPreference: (pref) =>
        set((state) => ({
          food: { ...state.food, ...pref },
        })),

      updateDocumentStatus: (status) =>
        set((state) => ({
          documents: { ...state.documents, ...status },
        })),

      updateTravelExperience: (exp) =>
        set((state) => ({
          experience: { ...state.experience, ...exp },
        })),

      updateCommunicationPreference: (pref) =>
        set((state) => ({
          communication: { ...state.communication, ...pref },
        })),

      completeOnboarding: () => set({ currentStep: 12 }),
    }),
    {
      name: 'tripwise-profile',
      storage: createJSONStorage(() => localforage),
    }
  )
);

// Selectors for performance
export const selectProfileId = (state: ProfileState) => state.profileId;
export const selectCurrentStep = (state: ProfileState) => state.currentStep;

export const selectStepData = (stepId: string) => (state: ProfileState) => {
  const stepMapping: Record<string, keyof ProfileState> = {
    'basicInfo': 'basicInfo',
    'dates': 'dates',
    'destination': 'destination',
    'budget': 'budget',
    'accommodation': 'accommodation',
    'transport': 'transport',
    'purpose': 'purpose',
    'interests': 'interests',
    'food': 'food',
    'documents': 'documents',
    'experience': 'experience',
    'communication': 'communication',
  };

  const stateKey = stepMapping[stepId];
  return stateKey ? state[stateKey] : null;
};

export const selectIsComplete = (stepId: string) => (state: ProfileState) => {
  const stepData = selectStepData(stepId)(state);
  if (!stepData) return false;

  // Basic validation for each step
  switch (stepId) {
    case 'basicInfo': {
      const basicInfo = stepData as TravelerInfo;
      return !!(basicInfo.fullName && basicInfo.whatsappNumber && basicInfo.email && basicInfo.cityOfDeparture);
    }

    case 'dates': {
      const dates = stepData as TravelDates;
      return !!(dates.startDate && dates.returnDate && dates.duration > 0);
    }

    case 'destination': {
      const destination = stepData as DestinationPreference;
      return !!(destination.destination && destination.travelType && destination.preferenceType);
    }

    case 'budget': {
      const budget = stepData as BudgetPreference;
      return !!(budget.level && budget.includesFlights);
    }

    case 'accommodation': {
      const accommodation = stepData as AccommodationPreference;
      return !!(accommodation.category && accommodation.roomType);
    }

    case 'transport': {
      const transport = stepData as TransportPreference;
      return !!(transport.mode && transport.timingPreference);
    }

    case 'purpose': {
      const purpose = stepData as TravelPurpose;
      return !!purpose.purpose;
    }

    case 'interests': {
      const interests = stepData as Activities;
      return Object.values(interests).some(value => value === true);
    }

    case 'food': {
      const food = stepData as FoodPreference;
      return !!food.type;
    }

    case 'documents': {
      const documents = stepData as DocumentStatus;
      return documents.hasPassport !== null && !!documents.visaAwareness;
    }

    case 'experience': {
      const experience = stepData as TravelExperience;
      return !!experience.frequency;
    }

    case 'communication': {
      const communication = stepData as CommunicationPreference;
      return !!(communication.method && communication.bestTime);
    }

    default:
      return false;
  }
};

export const selectCanProceed = (stepId: string) => (state: ProfileState) => {
  return selectIsComplete(stepId)(state);
};

export const selectProgress = (state: ProfileState) => {
  const steps = ['basicInfo', 'dates', 'destination', 'budget', 'accommodation', 'transport', 'purpose', 'interests', 'food', 'documents', 'experience', 'communication'];
  const completedSteps = steps.filter(step => selectIsComplete(step)(state)).length;
  return Math.round((completedSteps / 12) * 100);
};
