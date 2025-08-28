import { DESCOPE_CONFIG } from '@/config/api';

// Initialize Descope - simplified for React SDK
export const initializeDescope = () => {
  try {
    console.log('Descope SDK ready for use');
  } catch (error) {
    console.error('Failed to initialize Descope:', error);
  }
};

// Descope theme configuration for dark mode
export const descopeTheme = {
  colors: {
    primary: '#fbbf24', // amber
    secondary: '#1e293b', // dark slate
    background: '#0f172a', // dark background
    surface: '#1e293b',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    border: '#374151',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
  },
  borderRadius: '0.75rem',
  fontFamily: 'Inter, system-ui, sans-serif',
};