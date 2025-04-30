/**
 * Application configuration
 */

// Environment detection
const isProd = import.meta.env.PROD;

// API configuration
export const API_CONFIG = {
  // Base URL for API requests
  BASE_URL: isProd 
    ? 'https://tech-spec-generator-server-a925ce447590.herokuapp.com'
    : 'http://localhost:3000',
  
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