import { apiClient, apiCall, ApiResponse } from './client';
import { TravelerProfile } from '@/store/profileStore';

export interface AuthResponse {
    success: boolean;
    token?: string;
    exists?: boolean;
    isNewUser?: boolean;
    identifier?: string;
    profile?: TravelerProfile;
}

export class AuthApi {
    // Login with identifier (phone/email)
    static async login(identifier: string): Promise<ApiResponse<AuthResponse>> {
        return apiCall(() => apiClient.post('/api/auth/login', { identifier }));
    }

    // Validate existing session token
    static async validateSession(token: string): Promise<ApiResponse<AuthResponse>> {
        return apiCall(() => apiClient.get('/api/auth/validate', {
            headers: { Authorization: `Bearer ${token}` }
        }));
    }
}

// Export individual functions for easier usage
export const { login, validateSession } = AuthApi;
