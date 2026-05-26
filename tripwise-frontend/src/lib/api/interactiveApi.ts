import { apiClient, ApiResponse, apiCall, createApiResponse } from './client';

export interface TripPlanSession {
    id: string; // Session ID
    profileId: string;
    currentStep: 'INIT' | 'HOTEL_SELECTION' | 'TRANSPORT_SELECTION' | 'FINALIZED';
    destinationOverview?: string; // JSON string
    suggestedHotelsJson?: string; // JSON string
    selectedHotel?: HotelOption;
    suggestedTransportJson?: string; // JSON string
    finalizedTransportChoice?: TransportOption;
}

export interface HotelOption {
    name: string;
    address: string;
    costPerNight: string;
    reason: string;
}

export interface TransportOption {
    mode: string;
    cost: string;
    duration: string;
    details: string;
}

export interface HotelSuggestionsResponse {
    options: HotelOption[];
}

export interface TransportSuggestionsResponse {
    arrivalPoint: string;
    options: TransportOption[];
}

export interface BookingExpansion {
    transport: {
        carrier: string;
        number: string;
        departureTime: string;
        arrivalTime: string;
        duration: string;
        terminal: string;
        class: string;
        fromCode: string;
        toCode: string;
    };
    hotel: {
        roomType: string;
        checkInTime: string;
        checkOutTime: string;
        amenities: string[];
    };
    localTransport: {
        operator: string;
        coverage: string;
    };
}

export const InteractiveApi = {
    // 1. Init Session (Overview)
    initSession: async (profileId: string): Promise<ApiResponse<TripPlanSession>> => {
        return apiCall(() => apiClient.post<TripPlanSession>(`/api/tripwise/interactive/init/${profileId}`));
    },

    // 2A. Get Hotel Suggestions
    getHotelSuggestions: async (sessionId: string): Promise<ApiResponse<HotelSuggestionsResponse>> => {
        return apiCall(() => apiClient.get<HotelSuggestionsResponse>(`/api/tripwise/interactive/${sessionId}/hotels`));
    },

    // 2B. Select Hotel
    selectHotel: async (sessionId: string, choice: HotelOption): Promise<ApiResponse<TripPlanSession>> => {
        return apiCall(() => apiClient.post<TripPlanSession>(`/api/tripwise/interactive/${sessionId}/hotels`, choice));
    },

    // 3A. Get Transport Suggestions
    getTransportOptions: async (sessionId: string): Promise<ApiResponse<TransportSuggestionsResponse>> => {
        return apiCall(() => apiClient.get<TransportSuggestionsResponse>(`/api/tripwise/interactive/${sessionId}/transport`));
    },

    // 3B. Select Transport
    selectTransport: async (sessionId: string, choice: TransportOption): Promise<ApiResponse<TripPlanSession>> => {
        return apiCall(() => apiClient.post<TripPlanSession>(`/api/tripwise/interactive/${sessionId}/transport`, choice));
    },

    // 4. Finalize Trip (Master Plan)
    finalizeTrip: async (sessionId: string, messages?: { role: string; content: string }[]): Promise<ApiResponse<string>> => {
        // This returns the markdown string directly
        return apiCall(() => apiClient.post<string>(`/api/tripwise/interactive/${sessionId}/finalize`, { messages }));
    },

    // Stage 1: Booking Summary Expansion
    getBookingDetails: async (sessionId: string): Promise<ApiResponse<BookingExpansion>> => {
        return apiCall(() => apiClient.get<BookingExpansion>(`/api/tripwise/interactive/${sessionId}/booking-details`));
    },
};
