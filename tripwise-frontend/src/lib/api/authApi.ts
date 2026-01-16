import { apiClient, apiCall, ApiResponse } from './client';
import { TravelerProfile } from '@/store/profileStore';

// Check if user exists by phone or email
export interface CheckUserRequest {
    identifier: string; // phone or email
}

export interface CheckUserResponse {
    exists: boolean;
    profile?: TravelerProfile;
}

export class AuthApi {
    // Check if user exists in database
    static async checkUserExists(identifier: string): Promise<ApiResponse<CheckUserResponse>> {
        return apiCall(() => apiClient.post('/api/profiles/check', { identifier }));
    }
}

// Export individual functions for easier usage
export const { checkUserExists } = AuthApi;
