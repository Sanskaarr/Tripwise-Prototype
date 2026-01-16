import { apiClient, apiCall, ApiResponse } from './client';
import {
  TravelerInfo,
  TravelDates,
  DestinationPreference,
  BudgetPreference,
  AccommodationPreference,
  TransportPreference,
  TravelPurpose,
  Activities,
  FoodPreference,
  DocumentStatus,
  TravelExperience,
  CommunicationPreference,
  TravelerProfile,
} from '@/store/profileStore';

// Re-export ApiResponse for use in other modules
export type { ApiResponse } from './client';

// Profile creation response
export interface CreateProfileResponse {
  profileId: string;
  message: string;
}

// Profile data response
export interface ProfileDataResponse {
  profileId: string;
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
  createdAt: string;
  updatedAt: string;
}

// Update response
export interface UpdateResponse {
  message: string;
  updatedAt: string;
}

// Submit response
export interface SubmitResponse {
  message: string;
  submittedAt: string;
  referenceNumber: string;
}

export class ProfileApi {
  // Create a new profile
  static async createProfile(): Promise<ApiResponse<CreateProfileResponse>> {
    return apiCall(() => apiClient.post('/api/profile/create'));
  }

  // Get profile by ID
  static async getProfile(profileId: string): Promise<ApiResponse<ProfileDataResponse>> {
    return apiCall(() => apiClient.get(`/api/profile/${profileId}`));
  }

  // Update basic info
  static async updateBasicInfo(
    profileId: string,
    data: TravelerInfo
  ): Promise<ApiResponse<UpdateResponse>> {
    return apiCall(() => apiClient.post(`/api/profile/${profileId}/basicInfo`, data));
  }

  // Update travel dates
  static async updateDates(
    profileId: string,
    data: TravelDates
  ): Promise<ApiResponse<UpdateResponse>> {
    return apiCall(() => apiClient.post(`/api/profile/${profileId}/dates`, data));
  }

  // Update destination preference
  static async updateDestination(
    profileId: string,
    data: DestinationPreference
  ): Promise<ApiResponse<UpdateResponse>> {
    return apiCall(() => apiClient.post(`/api/profile/${profileId}/destination`, data));
  }

  // Update budget preference
  static async updateBudget(
    profileId: string,
    data: BudgetPreference
  ): Promise<ApiResponse<UpdateResponse>> {
    return apiCall(() => apiClient.post(`/api/profile/${profileId}/budget`, data));
  }

  // Update accommodation preference
  static async updateAccommodation(
    profileId: string,
    data: AccommodationPreference
  ): Promise<ApiResponse<UpdateResponse>> {
    return apiCall(() => apiClient.post(`/api/profile/${profileId}/accommodation`, data));
  }

  // Update transport preference
  static async updateTransport(
    profileId: string,
    data: TransportPreference
  ): Promise<ApiResponse<UpdateResponse>> {
    return apiCall(() => apiClient.post(`/api/profile/${profileId}/transport`, data));
  }

  // Update travel purpose
  static async updatePurpose(
    profileId: string,
    data: TravelPurpose
  ): Promise<ApiResponse<UpdateResponse>> {
    return apiCall(() => apiClient.post(`/api/profile/${profileId}/purpose`, data));
  }

  // Update interests/activities
  static async updateInterests(
    profileId: string,
    data: Activities
  ): Promise<ApiResponse<UpdateResponse>> {
    return apiCall(() => apiClient.post(`/api/profile/${profileId}/interests`, data));
  }

  // Update food preference
  static async updateFood(
    profileId: string,
    data: FoodPreference
  ): Promise<ApiResponse<UpdateResponse>> {
    return apiCall(() => apiClient.post(`/api/profile/${profileId}/food`, data));
  }

  // Update document status
  static async updateDocuments(
    profileId: string,
    data: DocumentStatus
  ): Promise<ApiResponse<UpdateResponse>> {
    return apiCall(() => apiClient.post(`/api/profile/${profileId}/documents`, data));
  }

  // Update travel experience
  static async updateExperience(
    profileId: string,
    data: TravelExperience
  ): Promise<ApiResponse<UpdateResponse>> {
    return apiCall(() => apiClient.post(`/api/profile/${profileId}/experience`, data));
  }

  // Update communication preference
  static async updateCommunication(
    profileId: string,
    data: CommunicationPreference
  ): Promise<ApiResponse<UpdateResponse>> {
    return apiCall(() => apiClient.post(`/api/profile/${profileId}/communication`, data));
  }

  // Submit complete profile
  static async submitProfile(profileId: string, profileData: Partial<TravelerProfile>): Promise<ApiResponse<SubmitResponse>> {
    return apiCall(() => apiClient.post(`/api/profile/${profileId}/submit`, profileData));
  }
}

// Export individual functions for easier usage
export const {
  createProfile,
  getProfile,
  updateBasicInfo,
  updateDates,
  updateDestination,
  updateBudget,
  updateAccommodation,
  updateTransport,
  updatePurpose,
  updateInterests,
  updateFood,
  updateDocuments,
  updateExperience,
  updateCommunication,
  submitProfile,
} = ProfileApi;
