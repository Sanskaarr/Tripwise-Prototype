import { apiClient, apiCall, ApiResponse } from './client';

export interface TripwiseBooking {
  id: string;
  shareToken: string;
  sessionId: string;
  profileId: string;
  destination: string;
  hotelName: string;
  hotelAddress: string;
  transportMode: string;
  totalAmount: string;
  razorpayPaymentId: string;
  razorpayOrderId: string;

  // Legacy PNR fields (always populated)
  flightPnr: string;
  hotelRef: string;
  transportRef: string;

  // Gemini-generated arrival transport
  transportType?: string;      // FLIGHT | TRAIN | BUS
  airline?: string;            // carrier name
  transportNumber?: string;    // e.g. 6E-2347
  fromCity?: string;
  toCity?: string;
  transportDate?: string;
  departureTime?: string;
  arrivalTime?: string;
  platform?: string;           // terminal / platform / bay
  seatOrCoach?: string;
  travelClass?: string;

  // Gemini-generated return transport
  returnTransportNumber?: string;
  returnPnr?: string;
  returnDate?: string;
  returnDepartureTime?: string;
  returnArrivalTime?: string;
  returnSeat?: string;

  // Gemini-generated hotel
  hotelConfirmationRef?: string;
  roomType?: string;
  hotelCheckInTime?: string;
  hotelCheckOutTime?: string;

  // Gemini-generated local transport
  localTransportOperator?: string;
  localTransportBookingRef?: string;

  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  checkInDate?: string;
  checkOutDate?: string;
}

export interface CreateBookingRequest {
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
  walletAmountUsed?: number;
}

export const bookingApi = {
  createBooking: async (
    sessionId: string,
    payload: CreateBookingRequest
  ): Promise<ApiResponse<TripwiseBooking>> => {
    return apiCall(() =>
      apiClient.post<TripwiseBooking>(`/api/booking/${sessionId}/create`, payload)
    );
  },

  getBooking: async (bookingId: string): Promise<ApiResponse<TripwiseBooking>> => {
    return apiCall(() => apiClient.get<TripwiseBooking>(`/api/booking/${bookingId}`));
  },
};
