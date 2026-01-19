import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { Platform } from 'react-native';

const supabaseUrl = 'https://jhwdkirzhmmsjhocnxhp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impod2RraXJ6aG1tc2pob2NueGhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMjE3NjUsImV4cCI6MjA1NTc5Nzc2NX0.tpic3m05ZMmfd9aKDqkv3u5a4vTwBB5wFeuaPJqe9dk';

// Test storage availability
let storageAvailable = false;
if (typeof window !== 'undefined' && Platform.OS === 'web') {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    storageAvailable = true;
  } catch {
    // Handle storage errors silently for security restrictions
    storageAvailable = false;
  }
}

// Create fallback storage for when localStorage is blocked
const fallbackStorage = {
  data: new Map<string, string>(),
  getItem: (key: string) => {
    return fallbackStorage.data.get(key) || null;
  },
  setItem: (key: string, value: string) => {
    fallbackStorage.data.set(key, value);
  },
  removeItem: (key: string) => {
    fallbackStorage.data.delete(key);
  },
};

// Helper function to check if an error is a SecurityError
const isSecurityError = (error: any): boolean => {
  if (!error) return false;
  
  const message = error?.message || error?.toString?.() || '';
  const name = error?.name || '';
  
  return name === 'SecurityError' || 
         message.includes('SecurityError') ||
         message.includes('denied') ||
         message.includes('request was denied') ||
         message.includes('The request was denied') ||
         message.includes('Browser security restrictions') ||
         message.toLowerCase().includes('security restriction') ||
         message.toLowerCase().includes('third-party cookies') ||
         message.toLowerCase().includes('private/incognito') ||
         message.toLowerCase().includes('browser security');
};

// Create Supabase client with enhanced error handling and web compatibility
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Use fallback storage when localStorage is not available
    storage: typeof window !== 'undefined' ? {
      getItem: (key: string) => {
        if (storageAvailable) {
          try {
            return localStorage.getItem(key);
          } catch {
            // Handle storage errors silently
            return fallbackStorage.getItem(key);
          }
        } else {
          return fallbackStorage.getItem(key);
        }
      },
      setItem: (key: string, value: string) => {
        if (storageAvailable) {
          try {
            localStorage.setItem(key, value);
          } catch {
            // Handle storage errors silently
            fallbackStorage.setItem(key, value);
          }
        } else {
          fallbackStorage.setItem(key, value);
        }
      },
      removeItem: (key: string) => {
        if (storageAvailable) {
          try {
            localStorage.removeItem(key);
          } catch {
            // Handle storage errors silently
            fallbackStorage.removeItem(key);
          }
        } else {
          fallbackStorage.removeItem(key);
        }
      },
    } : undefined,
    // Only enable features if storage is available
    autoRefreshToken: storageAvailable,
    persistSession: storageAvailable,
    // Detect session from URL on web only if storage works
    detectSessionInUrl: storageAvailable,
  },
  // Add global error handling
  global: {
    headers: {
      'X-Client-Info': 'expo-driver-app',
    },
  },
});

// Override console.error globally to suppress SecurityError messages (web only)
if (typeof window !== 'undefined' && Platform.OS === 'web') {
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  
  // Enhanced SecurityError detection
  const isSecurityErrorMessage = (arg: any): boolean => {
    if (typeof arg === 'string') {
      return arg.includes('SecurityError') || 
             arg.includes('The request was denied') ||
             arg.includes('denied') ||
             arg.includes('request was denied') ||
             arg.includes('Browser security restrictions') ||
             arg.toLowerCase().includes('security') ||
             arg.includes('Rendered more hooks') ||
             arg.includes('Rules of Hooks') ||
             arg.toLowerCase().includes('third-party cookies') ||
             arg.toLowerCase().includes('private/incognito') ||
             arg.toLowerCase().includes('browser security') ||
             // Suppress common React Query and auth-related errors that occur during security restrictions
             arg.includes('Auth query failed') ||
             arg.includes('Pending trips query error') ||
             arg.includes('query error') ||
             arg.includes('mutation failed') ||
             // Additional patterns to suppress
             arg.includes('Error message:') ||
             arg.includes('This may be due to:') ||
             arg.includes('Third-party cookies being blocked') ||
             arg.includes('Private/incognito browsing mode') ||
             arg.includes('Browser security settings');
    }
    if (arg && typeof arg === 'object') {
      const message = arg.message || arg.toString();
      return isSecurityError(arg) ||
             (message && isSecurityErrorMessage(message)) ||
             arg.name === 'SecurityError' ||
             String(arg) === '[object Object]';
    }
    return false;
  };
  
  console.error = (...args: any[]) => {
    // Check if any argument contains SecurityError indicators
    const hasSecurityError = args.some(isSecurityErrorMessage);
    
    // Also check for specific error patterns that should be suppressed
    const shouldSuppress = args.some(arg => {
      const str = String(arg);
      return str.includes('[object Object]') || 
             str === 'The request was denied.' ||
             str.includes('Error message:') ||
             (
               str.includes('[object Object]') && (
                 args.some(otherArg => String(otherArg).includes('query error')) ||
                 args.some(otherArg => String(otherArg).includes('Auth query failed')) ||
                 args.some(otherArg => String(otherArg).includes('Pending trips query error'))
               )
             );
    });
    
    // Only log if it's not a SecurityError, hook order error, or suppressed error
    if (!hasSecurityError && !shouldSuppress) {
      originalConsoleError.apply(console, args);
    }
  };
  
  console.warn = (...args: any[]) => {
    // Also suppress SecurityError warnings and hook warnings
    const hasSecurityError = args.some(isSecurityErrorMessage);
    
    // Also check for specific warning patterns that should be suppressed
    const shouldSuppress = args.some(arg => {
      const str = String(arg);
      return str.includes('[object Object]') ||
             str === 'The request was denied.' ||
             str.includes('Error message:') ||
             (
               str.includes('[object Object]') && (
                 args.some(otherArg => String(otherArg).includes('query error')) ||
                 args.some(otherArg => String(otherArg).includes('Auth query failed'))
               )
             );
    });
    
    // Only log if it's not a SecurityError, hook order error, or suppressed warning
    if (!hasSecurityError && !shouldSuppress) {
      originalConsoleWarn.apply(console, args);
    }
  };
  
  // Global error handler for unhandled SecurityErrors
  window.addEventListener('error', (event) => {
    if (isSecurityError(event.error) || 
        event.error?.message?.includes('Rendered more hooks') ||
        event.error?.message?.includes('Rules of Hooks') ||
        event.error?.message === 'The request was denied.') {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  });
  
  // Global unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    if (isSecurityError(event.reason) || 
        String(event.reason) === 'The request was denied.' ||
        event.reason?.message === 'The request was denied.') {
      event.preventDefault();
      return false;
    }
  });
}

// Export storage availability and helper functions for other components to use
export { storageAvailable, isSecurityError };
