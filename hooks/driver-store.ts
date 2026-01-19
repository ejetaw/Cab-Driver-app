import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

import { 
  useDriverProfile, 
  useTrips, 
  useEarnings, 
  useUpdateDriverStatus, 
  useUpdateTripStatus,
  useRejectTrip 
} from '@/hooks/use-driver-queries';
import { Trip } from '@/types/driver';

export const [DriverContext, useDriver] = createContextHook(() => {
  // Always call hooks in the same order
  const [pendingTrip, setPendingTrip] = useState<Trip | null>(null);

  // Always call all query hooks first
  const driverQuery = useDriverProfile();
  const tripsQuery = useTrips();
  const earningsQuery = useEarnings();
  
  // Always call all mutation hooks
  const updateStatusMutation = useUpdateDriverStatus();
  const updateTripMutation = useUpdateTripStatus();
  const rejectTripMutation = useRejectTrip();

  // Process data after all hooks are called
  const trips = tripsQuery.data || [];
  const currentPendingTrip = trips.find(trip => trip.status === 'pending') || null;
  
  // Update pending trip state when data changes using useEffect
  useEffect(() => {
    if (currentPendingTrip?.id !== pendingTrip?.id) {
      setPendingTrip(currentPendingTrip);
    }
  }, [currentPendingTrip, pendingTrip]);

  const toggleStatus = async () => {
    if (!driverQuery.data) return;
    
    const newStatus = driverQuery.data.status === 'online' ? 'offline' : 'online';
    
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    updateStatusMutation.mutate(newStatus);
  };

  const acceptTrip = async (tripId: string) => {
    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    updateTripMutation.mutate({ tripId, status: 'accepted' });
    setPendingTrip(null);
  };

  const rejectTrip = async (tripId: string) => {
    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    
    rejectTripMutation.mutate(tripId);
    setPendingTrip(null);
  };

  const completeTrip = async (tripId: string) => {
    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    updateTripMutation.mutate({ tripId, status: 'completed' });
  };

  const getCompletedTrips = () => {
    return trips.filter(trip => trip.status === 'completed');
  };

  const getTripById = (tripId: string) => {
    return trips.find(trip => trip.id === tripId);
  };

  return {
    driver: driverQuery.data,
    isLoading: driverQuery.isLoading || tripsQuery.isLoading || earningsQuery.isLoading,
    error: driverQuery.error || tripsQuery.error || earningsQuery.error,
    pendingTrip,
    toggleStatus,
    acceptTrip,
    rejectTrip,
    completeTrip,
    getCompletedTrips,
    getTripById,
    earnings: earningsQuery.data || [],
    isUpdating: updateStatusMutation.isPending || updateTripMutation.isPending || rejectTripMutation.isPending,
  };
});
