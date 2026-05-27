import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import localforage from 'localforage';
import { HotelOption, TransportOption } from '@/lib/api/interactiveApi';
import { ChatMessageData } from '@/components/chat/ChatMessage';

export interface MapLocation {
    name: string;
    lat: number;
    lng: number;
    type: 'hotel' | 'airport' | 'sightseeing' | 'transport' | 'restaurant' | 'activity';
}

interface WizardState {
    _hasHydrated: boolean;
    sessionId: string | null;
    currentStep: 'OVERVIEW' | 'HOTEL' | 'TRANSPORT' | 'PLAN';
    isLoading: boolean;
    error: string | null;

    // Chat messages
    messages: ChatMessageData[];

    // Data
    overviewData: any | null;
    hotelOptions: HotelOption[];
    selectedHotel: HotelOption | null;
    transportOptions: TransportOption[];
    selectedTransport: TransportOption | null;
    masterPlan: string | null;

    // Map
    mapLocations: MapLocation[];
    addLocations: (places: MapLocation[]) => void;

    // Booking result
    bookingId: string | null;
    setBookingId: (id: string) => void;

    // Actions
    setHasHydrated: (hydrated: boolean) => void;
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

    addMessage: (msg: ChatMessageData) => void;
    removeLastMessage: () => void;
    updateLastMessage: (content: string) => void;
    clearMessages: () => void;

    resetWizard: () => void;
    revisePlan: () => void;
}

export const useWizardStore = create<WizardState>()(
    persist(
        (set) => ({
            _hasHydrated: false,
            sessionId: null,
            currentStep: 'OVERVIEW',
            isLoading: false,
            error: null,

            messages: [],
            overviewData: null,
            hotelOptions: [],
            selectedHotel: null,
            transportOptions: [],
            selectedTransport: null,
            masterPlan: null,
            bookingId: null,
            mapLocations: [],

            addLocations: (places) => set((state) => {
                const existing = new Set(state.mapLocations.map(p => p.name));
                const fresh = places.filter(p => !existing.has(p.name));
                return fresh.length > 0 ? { mapLocations: [...state.mapLocations, ...fresh] } : state;
            }),

            setHasHydrated: (hydrated) => set({ _hasHydrated: hydrated }),
            setBookingId: (id) => set({ bookingId: id }),
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

            addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
            removeLastMessage: () => set((state) => ({ messages: state.messages.slice(0, -1) })),
            updateLastMessage: (content) =>
                set((state) => {
                    if (state.messages.length === 0) return state;
                    const updated = [...state.messages];
                    updated[updated.length - 1] = { ...updated[updated.length - 1], content };
                    return { messages: updated };
                }),
            clearMessages: () => set({ messages: [] }),

            resetWizard: () => set({
                sessionId: null,
                currentStep: 'OVERVIEW',
                isLoading: false,
                error: null,
                messages: [],
                overviewData: null,
                hotelOptions: [],
                selectedHotel: null,
                transportOptions: [],
                selectedTransport: null,
                masterPlan: null,
                bookingId: null,
                mapLocations: [],
            }),

            revisePlan: () => set((state) => ({
                currentStep: 'TRANSPORT',
                masterPlan: null,
                mapLocations: [],
                messages: state.messages.filter(m => m.type !== 'master-plan'),
            })),
        }),
        {
            name: 'tripwise-wizard',
            storage: createJSONStorage(() => localforage),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.setHasHydrated(true);
                } else {
                    useWizardStore.setState({ _hasHydrated: true });
                }
            },
        }
    )
);
