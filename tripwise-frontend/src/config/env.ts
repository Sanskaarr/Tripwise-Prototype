// Environment configuration
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  appEnv: import.meta.env.VITE_APP_ENV || 'development',
};

// Type definitions for environment variables
declare global {
  interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    readonly VITE_APP_ENV: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
