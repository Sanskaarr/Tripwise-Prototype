import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import localforage from 'localforage';
import { TripPlanSession, HotelOption, TransportOption } from '@/lib/api/interactiveApi';

interface WizardState {
    sessionId: string | null;
    currentStep: 'OVERVIEW' | 'HOTEL' | 'TRANSPORT' | 'PLAN';
    isLoading: boolean;
    error: string | null;

    // Data
    overviewData: any | null; // Parsed JSON
    hotelOptions: HotelOption[];
    selectedHotel: HotelOption | null;
    transportOptions: TransportOption[];
    selectedTransport: TransportOption | null;
    masterPlan: string | null; // Markdown

    // Actions
    setSessionId: (id: string) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setStep: (step: 'OVERVIEW' | 'HOTEL' | 'TRANSPORT' | 'PLAN') => void;

    setOverviewData: (data: any) => void;
    setHotelOptions: (options: HotelOption[]) => void;
    selectHotel: (hotel: HotelOption) => void;
    setTransportOptions: (options: TransportOption[]) => void;
    selectTransport: (transport: TransportOption) => void;
    setMasterPlan: (plan: string) => void;

    resetWizard: () => void;
}

export const useWizardStore = create<WizardState>()(
    persist(
        (set) => ({
            sessionId: null,
            currentStep: 'OVERVIEW',
            isLoading: false,
            error: null,

            overviewData: null,
            hotelOptions: [],
            selectedHotel: null,
            transportOptions: [],
            selectedTransport: null,
            masterPlan: null,

            setSessionId: (id) => set({ sessionId: id }),
            setLoading: (loading) => set({ isLoading: loading }),
            setError: (error) => set({ error }),
            setStep: (step) => set({ currentStep: step }),

            setOverviewData: (data) => set({ overviewData: data }),
            setHotelOptions: (options) => set({ hotelOptions: options }),
            selectHotel: (hotel) => set({ selectedHotel: hotel }),
            setTransportOptions: (options) => set({ transportOptions: options }),
            selectTransport: (transport) => set({ selectedTransport: transport }),
            setMasterPlan: (plan) => set({ masterPlan: plan }),

            resetWizard: () => set({
                sessionId: null,
                currentStep: 'OVERVIEW',
                isLoading: false,
                error: null,
                overviewData: null,
                hotelOptions: [],
                selectedHotel: null,
                transportOptions: [],
                selectedTransport: null,
                masterPlan: null
            }),
        }),
        {
            name: 'tripwise-wizard',
            storage: createJSONStorage(() => localforage),
        }
    )
);
