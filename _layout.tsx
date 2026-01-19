import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, Component, ReactNode } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";

import { DriverContext } from "@/hooks/driver-store";
import { useAuth } from "@/hooks/use-auth";
import { storageAvailable, isSecurityError } from "@/lib/supabase";
import AuthScreen from "@/components/AuthScreen";
import Colors from "@/constants/colors";

// Error Boundary for handling SecurityErrors and other auth-related errors
class AuthErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null; retryCount: number }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error) {
    // Handle SecurityError and hook order errors silently
    if (isSecurityError(error) || 
        error?.message?.includes('Rendered more hooks') ||
        error?.message?.includes('Rules of Hooks')) {
      // Don't show error boundary for these errors, just continue normally
      return { hasError: false, error: null, retryCount: 0 };
    }
    
    console.error('AuthErrorBoundary caught error:', error);
    return { hasError: true, error, retryCount: 0 };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Handle SecurityError and hook order errors silently
    if (isSecurityError(error) || 
        error?.message?.includes('Rendered more hooks') ||
        error?.message?.includes('Rules of Hooks')) {
      // Silently handle these errors and try to recover
      setTimeout(() => {
        this.setState({ hasError: false, error: null, retryCount: 0 });
      }, 100);
      return;
    }
    
    console.error('AuthErrorBoundary error details:', { error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      const isSecurityErrorState = isSecurityError(this.state.error);
      
      return (
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center', 
          backgroundColor: Colors.background,
          padding: 20 
        }}>
          <Text style={{ 
            fontSize: 18, 
            fontWeight: '600', 
            color: Colors.danger, 
            textAlign: 'center',
            marginBottom: 16 
          }}>
            {isSecurityErrorState ? 'Browser Security Restriction' : 'Authentication Error'}
          </Text>
          
          <Text style={{ 
            fontSize: 14, 
            color: Colors.textSecondary, 
            textAlign: 'center',
            marginBottom: 24,
            lineHeight: 20
          }}>
            {isSecurityErrorState 
              ? `Your browser is blocking storage access. Please try:\n\n• Disabling private/incognito mode\n• Allowing third-party cookies\n• Refreshing the page\n\nStorage Available: ${storageAvailable ? 'Yes' : 'No'}`
              : 'An authentication error occurred. Please refresh the page to try again.'
            }
          </Text>
          
          <TouchableOpacity
            style={{
              backgroundColor: Colors.primary,
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 8
            }}
            onPress={() => {
              this.setState({ hasError: false, error: null, retryCount: this.state.retryCount + 1 });
              if (typeof window !== 'undefined') {
                window.location.reload();
              }
            }}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>Refresh Page</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on SecurityError as it won't resolve
        if (isSecurityError(error)) {
          return false;
        }
        return failureCount < 2;
      },
      staleTime: 30000,
      refetchOnWindowFocus: false,
      throwOnError: false, // Don't throw errors, let components handle them
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // Don't retry on SecurityError as it won't resolve
        if (isSecurityError(error)) {
          return false;
        }
        return failureCount < 1;
      },
      throwOnError: false, // Don't throw errors, let components handle them
    },
  },
});

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="trip/[id]" options={{ title: "Trip Details" }} />
    </Stack>
  );
}

function AuthenticatedApp() {
  const { data: session, isLoading } = useAuth();

  // Removed verbose logging

  // Show loading screen while checking auth
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 16, fontSize: 16, color: Colors.textSecondary }}>
          Loading...
        </Text>
      </View>
    );
  }

  // Show auth screen if no session
  if (!session) {
    return <AuthScreen />;
  }

  return (
    <DriverContext>
      <RootLayoutNav />
    </DriverContext>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthErrorBoundary>
          <AuthenticatedApp />
        </AuthErrorBoundary>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
