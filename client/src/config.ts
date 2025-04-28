/**
 * Application configuration
 */

// API configuration
export const API_CONFIG = {
  // Base URL for API requests
  BASE_URL: 'http://localhost:3000',
  
  // API endpoints
  ENDPOINTS: {
    GENERATE_SPEC: '/api/generate-spec',
    SPECS: '/api/specs',
    SPEC: (id: string) => `/api/specs/${id}`,
  }
};

// Logging configuration
export const LOG_CONFIG = {
  // Maximum number of logs to keep in localStorage
  MAX_LOGS: 100,
  
  // Log refresh interval in milliseconds
  REFRESH_INTERVAL: 1000,
}; 