// API Configuration for Beacon
// Replace these URLs with your actual backend endpoints

export const API_CONFIG = {
  // Base API URL - replace with your backend URL
  BASE_URL: process.env.VITE_API_BASE_URL || 'http://localhost:3001',
  
  // Chat endpoints
  CHAT_ENDPOINT: '/api/chat',
  AUDIO_TRANSCRIBE_ENDPOINT: '/api/audio/transcribe',
  
  // Emergency endpoints
  EMERGENCY_ALERT_ENDPOINT: '/api/emergency/alert',
  EMERGENCY_STATUS_ENDPOINT: '/api/emergency/status',
  
  // Operator endpoints
  OPERATOR_REQUEST_ENDPOINT: '/api/operator/request',
  OPERATOR_HANDOFF_ENDPOINT: '/api/operator/handoff',
};

// Descope Configuration
export const DESCOPE_CONFIG = {
  // Replace with your Descope Project ID
  PROJECT_ID: process.env.VITE_DESCOPE_PROJECT_ID || 'your-descope-project-id',
  
  // Descope Flow IDs
  SIGN_IN_FLOW_ID: 'sign-in',
  SIGN_UP_FLOW_ID: 'sign-up',
  
  // Redirect URLs
  BASE_URL: process.env.VITE_APP_BASE_URL || 'http://localhost:8080',
};

// Audio Recording Configuration
export const AUDIO_CONFIG = {
  MAX_RECORDING_DURATION: 5 * 60 * 1000, // 5 minutes in milliseconds
  AUDIO_FORMAT: 'audio/webm',
  SAMPLE_RATE: 44100,
};

// Mock API helper for development
export const mockApiCall = async <T>(
  endpoint: string,
  data?: any,
  delay: number = 1000
): Promise<T> => {
  console.log(`Mock API call to ${endpoint}:`, data);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return mock responses based on endpoint
      const mockResponses: Record<string, any> = {
        [API_CONFIG.CHAT_ENDPOINT]: {
          message: "This is a mock AI response. In production, this would be replaced with actual AI chat.",
          timestamp: new Date().toISOString(),
        },
        [API_CONFIG.AUDIO_TRANSCRIBE_ENDPOINT]: {
          transcription: "Mock transcription of audio message",
          confidence: 0.95,
        },
        [API_CONFIG.EMERGENCY_ALERT_ENDPOINT]: {
          alertId: 'alert-' + Date.now(),
          status: 'sent',
          services: ['emergency', 'family'],
        },
      };
      
      resolve(mockResponses[endpoint] || { success: true });
    }, delay);
  });
};