import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSecurityError } from '@/lib/supabase';
import { useEffect } from 'react';

export function useAuth() {
  const queryClient = useQueryClient();

  // Set up auth state listener
  useEffect(() => {
    let subscription: any;
    
    try {
      const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          try {
            // Update the auth query cache immediately
            queryClient.setQueryData(['auth'], session);
            
            if (event === 'SIGNED_OUT') {
              // Clear all cached data when user signs out
              queryClient.clear();
              queryClient.removeQueries();
            }
          } catch {
            // Silently handle cache errors
          }
        }
      );
      
      subscription = authSubscription;
    } catch {
      // Silently handle auth listener setup errors
    }

    return () => {
      try {
        subscription?.unsubscribe();
      } catch {
        // Silently handle unsubscribe errors
      }
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          if (isSecurityError(error)) {
            return null;
          }
          return null;
        }
        
        return session;
      } catch {
        return null;
      }
    },
    staleTime: 30000,
    retry: (failureCount, err: any) => {
      if (isSecurityError(err)) {
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    throwOnError: false,
  });
}

export function useSignIn() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          if (isSecurityError(error)) {
            throw new Error('Browser security restrictions detected. Please try refreshing the page or disabling private browsing mode.');
          }
          throw error;
        }
        
        // If user signed in successfully, ensure driver profile exists
        if (data.user && data.user.email) {
          // Check if driver profile exists by EMAIL (not by id)
          const { data: driverData, error: driverError } = await supabase
            .from('drivers')
            .select('id, name, email, phone')
            .eq('email', data.user.email)
            .maybeSingle();
          
          // If no driver profile exists, create one using RPC
          if (!driverData && !driverError) {
            const userName = data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Driver';
            const userPhone = data.user.user_metadata?.phone || '';
            
            const { error: insertError } = await supabase.rpc('register_driver_safely', {
              p_email: data.user.email,
              p_name: userName,
              p_phone: userPhone,
              p_license_number: 'PENDING',
              p_vehicle_make: 'PENDING',
              p_vehicle_model: 'PENDING',
              p_vehicle_year: new Date().getFullYear().toString(),
              p_vehicle_type: 'Sedan',
            });
            
            if (insertError) {
              console.error('Failed to create driver profile on sign in:', JSON.stringify(insertError, null, 2));
              // Don't throw - allow sign in to continue even if profile creation fails
            }
          }
        }
        
        return data;
      } catch (error: any) {
        if (isSecurityError(error)) {
          throw new Error('Browser security restrictions detected. Please try refreshing the page or disabling private browsing mode.');
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      try {
        queryClient.setQueryData(['auth'], data.session);
        queryClient.invalidateQueries({ queryKey: ['driver'] });
      } catch {
        if (typeof window !== 'undefined') {
          setTimeout(() => window.location.reload(), 100);
        }
      }
    },
  });
}

export function useSignUp() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      email, 
      password, 
      name, 
      phone 
    }: { 
      email: string; 
      password: string; 
      name: string; 
      phone: string; 
    }) => {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              phone,
            },
            emailRedirectTo: undefined,
          },
        });
        
        if (error) {
          if (isSecurityError(error)) {
            throw new Error('Browser security restrictions detected. Please try refreshing the page or disabling private browsing mode.');
          }
          throw error;
        }
        
        // If user was created, ensure driver profile exists
        if (data.user && data.user.email) {
          // Wait a moment for any database triggers
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if driver profile exists by EMAIL
          const { data: driverData, error: driverError } = await supabase
            .from('drivers')
            .select('id')
            .eq('email', data.user.email)
            .maybeSingle();
          
          // If no driver profile exists, create one using RPC
          if (!driverData && !driverError) {
            const { error: insertError } = await supabase.rpc('register_driver_safely', {
              p_email: data.user.email,
              p_name: name,
              p_phone: phone || '',
              p_license_number: 'PENDING',
              p_vehicle_make: 'PENDING',
              p_vehicle_model: 'PENDING',
              p_vehicle_year: new Date().getFullYear().toString(),
              p_vehicle_type: 'Sedan',
            });
            
            if (insertError) {
              console.error('Failed to create driver profile:', JSON.stringify(insertError, null, 2));
              // Don't throw - the trigger might have created it
            }
          }
        }
        
        return data;
      } catch (error: any) {
        if (isSecurityError(error)) {
          throw new Error('Browser security restrictions detected. Please try refreshing the page or disabling private browsing mode.');
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      try {
        queryClient.setQueryData(['auth'], data.session);
      } catch {
        // Silently handle cache errors
      }
    },
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      try {
        const { error } = await supabase.auth.signOut();
        
        if (error) {
          if (isSecurityError(error)) {
            return true;
          }
          if (error.message?.includes('Auth session missing') || error.name === 'AuthSessionMissingError') {
            return true;
          }
          throw error;
        }
        
        return true;
      } catch (error: any) {
        if (isSecurityError(error)) {
          return true;
        }
        if (error?.message?.includes('Auth session missing') || error?.name === 'AuthSessionMissingError') {
          return true;
        }
        throw error;
      }
    },
    onSuccess: () => {
      try {
        queryClient.setQueryData(['auth'], null);
        queryClient.clear();
        queryClient.removeQueries();
      } catch {
        // Silently handle cache errors
      }
    },
    onError: (error: any) => {
      if (!isSecurityError(error) && 
          !error?.message?.includes('Auth session missing') && 
          error?.name !== 'AuthSessionMissingError') {
        console.error('Sign out mutation failed:', error);
      }
      
      try {
        queryClient.setQueryData(['auth'], null);
        queryClient.clear();
        queryClient.removeQueries();
      } catch {
        // Silently handle cache errors
      }
    },
  });
}

