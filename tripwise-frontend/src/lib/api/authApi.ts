import { apiClient, apiCall, ApiResponse } from './client';
import { TravelerProfile } from '@/store/profileStore';

export interface AuthResponse {
    success: boolean;
    exists?: boolean;
    isNewUser?: boolean;
    identifier?: string;
    profile?: TravelerProfile;
    token?: string;
}

export class AuthApi {
    static async login(identifier: string): Promise<ApiResponse<AuthResponse>> {
        return apiCall(() => apiClient.post('/api/auth/login', { identifier }));
    }

    // No token parameter — the httpOnly cookie is sent automatically by the browser.
    static async validateSession(): Promise<ApiResponse<AuthResponse>> {
        return apiCall(() => apiClient.get('/api/auth/validate'));
    }

    static async logout(): Promise<void> {
        try {
            await apiClient.post('/api/auth/logout');
        } catch {
            // Ignore errors — the cookie will expire naturally
        }
    }
}

export const { login, validateSession, logout } = AuthApi;
