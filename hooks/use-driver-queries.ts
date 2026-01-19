import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSecurityError } from '@/lib/supabase';
import { Driver, Trip, EarningPeriod } from '@/types/driver';
import { Database } from '@/types/database';
import { useAuth } from './use-auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

type BookingRow = Database['public']['Tables']['bookings']['Row'];

const logError = (context: string, error: any) => {
  // Don't log SecurityErrors as errors
  if (isSecurityError(error)) {
    return; // Silently ignore SecurityErrors
  }
  
  console.error(`${context}:`, {
    message: error?.message || 'Unknown error',
    code: error?.code || 'No code',
    details: error?.details || 'No details',
    hint: error?.hint || 'No hint',
  });
};

export function useDriverProfile() {
  const authQuery = useAuth();
  const session = authQuery.data;
  const authLoading = authQuery.isLoading;
  
  return useQuery({
    queryKey: ['driver', session?.user?.id, session?.user],
    queryFn: async (): Promise<Driver | null> => {
      if (!session?.user) {
        return null;
      }

      try {
        
        // Query driver data using authenticated user's ID
        const { data: driverData, error: driverError } = await supabase
          .from('drivers')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (driverError) {
          logError('Driver query error', driverError);
          return null;
        }

        if (!driverData) {
          return null;
        }

        // Query vehicle data using operator_id (the correct foreign key)
        const { data: vehicleData, error: vehicleError } = await supabase
          .from('vehicles')
          .select('*')
          .eq('operator_id', driverData.id)
          .maybeSingle();

        if (vehicleError) {
          logError('Vehicle query error', vehicleError);
        }

        // Calculate earnings from bookings
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('*')
          .eq('driver_id', driverData.id)
          .eq('status', 'completed');

        if (bookingsError) {
          logError('Bookings query error', bookingsError);
        }

        // Calculate earnings
        const today = new Date().toISOString().split('T')[0];
        const thisWeekStart = new Date();
        thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
        const thisMonthStart = new Date();
        thisMonthStart.setDate(1);

        const todayBookings = bookingsData?.filter(b => {
          const bookingDate = b.created_at ? new Date(b.created_at).toISOString().split('T')[0] : '';
          return bookingDate === today;
        }) || [];
        
        const weekBookings = bookingsData?.filter(b => {
          const bookingDate = b.created_at ? new Date(b.created_at) : new Date(0);
          return bookingDate >= thisWeekStart;
        }) || [];
        
        const monthBookings = bookingsData?.filter(b => {
          const bookingDate = b.created_at ? new Date(b.created_at) : new Date(0);
          return bookingDate >= thisMonthStart;
        }) || [];

        const todayEarnings = todayBookings.reduce((sum: number, b: BookingRow) => 
          sum + (b.final_fare || b.fare || b.base_fare || 0), 0
        );
        const weekEarnings = weekBookings.reduce((sum: number, b: BookingRow) => 
          sum + (b.final_fare || b.fare || b.base_fare || 0), 0
        );
        const monthEarnings = monthBookings.reduce((sum: number, b: BookingRow) => 
          sum + (b.final_fare || b.fare || b.base_fare || 0), 0
        );
        const totalEarnings = bookingsData?.reduce((sum: number, b: BookingRow) => 
          sum + (b.final_fare || b.fare || b.base_fare || 0), 0
        ) || 0;

        const result: Driver = {
          id: driverData.id,
          name: driverData.name,
          phone: driverData.phone || '',
          email: driverData.email,
          profileImage: driverData.profile_image || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          rating: driverData.rating || 5.0,
          totalTrips: driverData.total_trips || bookingsData?.length || 0,
          memberSince: driverData.member_since || 'Jan 2023',
          status: driverData.status || 'offline',
          vehicle: vehicleData ? {
            id: vehicleData.id,
            make: vehicleData.make || driverData.vehicle_make || 'Unknown',
            model: vehicleData.model || driverData.vehicle_model || 'Unknown',
            year: parseInt(vehicleData.year) || parseInt(driverData.vehicle_year) || 2020,
            color: vehicleData.color || driverData.vehicle_colour || 'Unknown',
            licensePlate: vehicleData.registration_number || driverData.vehicle_registration || 'Unknown',
            image: vehicleData.image || 'https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          } : {
            id: 'no-vehicle',
            make: driverData.vehicle_make || 'Unknown',
            model: driverData.vehicle_model || 'Unknown',
            year: parseInt(driverData.vehicle_year) || 2020,
            color: driverData.vehicle_colour || 'Unknown',
            licensePlate: driverData.vehicle_registration || 'Unknown',
            image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          },
          earnings: {
            today: todayEarnings,
            week: weekEarnings,
            month: monthEarnings,
            total: totalEarnings,
          },
        };

        return result;
      } catch (error) {
        logError('Database error', error);
        return null;
      }
    },
    enabled: !!session?.user && !authLoading,
    retry: (failureCount, error: any) => {
      // Don't retry on SecurityError
      if (isSecurityError(error)) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });
}

export function useTrips() {
  // Always call hooks in the same order - no conditional hook calls
  const authQuery = useAuth();
  const driverQuery = useDriverProfile();
  
  const session = authQuery.data;
  const driver = driverQuery.data;
  const authLoading = authQuery.isLoading;
  const driverLoading = driverQuery.isLoading;
  
  return useQuery({
    queryKey: ['trips', session?.user?.id, driver?.id, session?.user],
    queryFn: async (): Promise<Trip[]> => {
      if (!session?.user || !driver?.id) {
        return [];
      }

      try {
        
        // Query trips in two parts:
        // 1. Trips assigned to this driver
        // 2. Pending trips that are ready for dispatch (posted by admin)
        const { data: assignedTrips, error: assignedError } = await supabase
          .from('bookings')
          .select('*')
          .eq('driver_id', driver.id)
          .order('created_at', { ascending: false });

        if (assignedError) {
          logError('Assigned trips query error', assignedError);
        }

        // Only show pending trips that have been posted by dispatcher
        
        let pendingTrips: any[] = [];
        let pendingError: any = null;
        
        try {
          // Try the full query first
          const result = await supabase
            .from('bookings')
            .select('*')
            .is('driver_id', null)
            .eq('status', 'pending')
            .order('created_at', { ascending: false });
            
          pendingTrips = result.data || [];
          pendingError = result.error;
          
          // Log basic info for debugging
          if (pendingTrips.length > 0) {
            console.log('Found', pendingTrips.length, 'pending trips');
          }
          
          // Filter trips that have the required fields for dispatch
          if (!pendingError && pendingTrips.length > 0) {
            pendingTrips = pendingTrips.filter(trip => {
              const hasRequiredFields = (
                trip.pickup_address && 
                trip.dropoff_address && 
                (trip.fare || trip.base_fare || trip.final_fare)
              );
              
              // Filter out incomplete trips silently
              
              return hasRequiredFields;
            });
            
            // Filtered pending trips
          }
        } catch (error) {
          console.error('Error in pending trips query:', error);
          pendingError = error;
          pendingTrips = [];
        }

        // Filter out trips that this driver has already rejected
        let filteredPendingTrips = pendingTrips || [];
        try {
          const rejectedTripsKey = `rejected_trips_${driver.id}`;
          const rejectedTripsJson = await AsyncStorage.getItem(rejectedTripsKey);
          const rejectedTripIds = rejectedTripsJson ? JSON.parse(rejectedTripsJson) : [];
          
          // Clean up old rejections (older than 24 hours)
          const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          const validRejectedTripIds = rejectedTripIds.filter((tripId: string) => {
            const trip = (pendingTrips || []).find(t => t.id === tripId);
            if (!trip) return false; // Trip no longer exists, remove from rejected list
            const tripDate = new Date(trip.created_at || 0);
            return tripDate > oneDayAgo; // Keep rejections for trips created in last 24 hours
          });
          
          // Update storage if we cleaned up any old rejections
          if (validRejectedTripIds.length !== rejectedTripIds.length) {
            await AsyncStorage.setItem(rejectedTripsKey, JSON.stringify(validRejectedTripIds));
          }
          
          filteredPendingTrips = (pendingTrips || []).filter(trip => 
            !validRejectedTripIds.includes(trip.id)
          );
          
          // Filtered out rejected trips
        } catch {
          // Silently handle rejection filtering errors
        }

        if (pendingError) {
          logError('Pending trips query error', pendingError);
          // Return early if there's a critical error
          if (pendingError.code === '42703') {
            throw new Error(`Database schema error: ${pendingError.message}`);
          }
        }

        // Combine both results
        const allTrips = [
          ...(assignedTrips || []),
          ...filteredPendingTrips
        ];

        // Remove duplicates (shouldn't happen, but just in case)
        const uniqueTrips = allTrips.filter((trip, index, self) => 
          index === self.findIndex(t => t.id === trip.id)
        );

        if (uniqueTrips.length === 0) {
          return [];
        }

        const trips: Trip[] = uniqueTrips
          .map(booking => {
            // Calculate fare with better fallback logic
            let fare = 0;
            if (booking.final_fare && booking.final_fare > 0) {
              fare = booking.final_fare;
            } else if (booking.fare && booking.fare > 0) {
              fare = booking.fare;
            } else if (booking.base_fare && booking.base_fare > 0) {
              fare = booking.base_fare;
            } else {
              // If no fare is set, calculate a basic fare based on distance
              const distance = booking.distance || 0;
              fare = Math.max(5, distance * 2); // Minimum £5, £2 per unit distance
            }
            
            // Process trip data
            
            // Use the correct column names from database schema
            const pickupAddress = booking.pickup_address || 'Address not available';
            const dropoffAddress = booking.dropoff_address || 'Address not available';
            
            return {
              id: booking.id,
              status: booking.status,
              passenger: {
                id: booking.passenger_id || 'unknown',
                name: booking.passenger_name || 'Unknown Passenger',
                rating: booking.passenger_rating || 5.0,
                profileImage: booking.passenger_image || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
              },
              pickup: {
                address: pickupAddress,
                location: {
                  latitude: booking.pickup_latitude || 0,
                  longitude: booking.pickup_longitude || 0,
                },
              },
              dropoff: {
                address: dropoffAddress,
                location: {
                  latitude: booking.dropoff_latitude || 0,
                  longitude: booking.dropoff_longitude || 0,
                },
              },
              distance: booking.distance || 0,
              duration: booking.duration || 0,
              fare: fare,
              timestamp: booking.created_at || new Date().toISOString(),
              paymentMethod: booking.payment_method || 'card',
            };
          });

        // Trips query successful
        
        return trips;
      } catch (error) {
        logError('Trips query failed', error);
        return [];
      }
    },
    enabled: !!session && !!driver?.id && !authLoading && !driverLoading,
    retry: (failureCount, error: any) => {
      // Don't retry on SecurityError or database schema errors
      if (isSecurityError(error) || error?.code === '42703') {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 10000, // Shorter stale time for real-time trip updates
    refetchInterval: 30000, // Refetch every 30 seconds for new trips
    throwOnError: false,
  });
}

export function useEarnings() {
  // Always call hooks in the same order - no conditional hook calls
  const authQuery = useAuth();
  const driverQuery = useDriverProfile();
  
  const session = authQuery.data;
  const driver = driverQuery.data;
  const authLoading = authQuery.isLoading;
  const driverLoading = driverQuery.isLoading;
  
  return useQuery({
    queryKey: ['earnings', session?.user?.id, driver?.id, session?.user],
    queryFn: async (): Promise<EarningPeriod[]> => {
      if (!session?.user || !driver?.id) {
        return [];
      }

      try {
        
        // Get completed bookings for earnings calculation
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('*')
          .eq('driver_id', driver.id)
          .eq('status', 'completed')
          .order('created_at', { ascending: false });

        if (bookingsError) {
          logError('Bookings for earnings query error', bookingsError);
          return [];
        }

        if (!bookingsData || bookingsData.length === 0) {
          return [];
        }

        // Group bookings by date
        const groupedByDate = bookingsData.reduce((acc: Record<string, BookingRow[]>, booking) => {
          const date = booking.created_at ? new Date(booking.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(booking);
          return acc;
        }, {});

        // Convert to EarningPeriod format
        const earnings = Object.entries(groupedByDate)
          .slice(0, 7)
          .map(([date, bookings]) => ({
            id: `earning-${date}`,
            date: new Date(date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            }),
            trips: bookings.length,
            amount: bookings.reduce((sum: number, b: BookingRow) => sum + (b.final_fare || b.fare || b.base_fare || 0), 0),
            hours: bookings.reduce((sum: number, b: BookingRow) => sum + ((b.duration || 0) / 60), 0),
          }));

        return earnings;
      } catch (error) {
        logError('Earnings query failed', error);
        return [];
      }
    },
    enabled: !!session && !!driver?.id && !authLoading && !driverLoading,
    retry: (failureCount, error: any) => {
      // Don't retry on SecurityError
      if (isSecurityError(error)) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 60000, // 1 minute stale time for earnings
    throwOnError: false,
  });
}

export function useUpdateDriverStatus() {
  const queryClient = useQueryClient();
  const authQuery = useAuth();
  const session = authQuery.data;
  
  return useMutation({
    mutationFn: async (status: 'online' | 'offline') => {
      if (!session?.user) {
        throw new Error('User not authenticated');
      }

      // Update driver status
      
      // Update driver status using authenticated user's ID
      const { error: updateError } = await supabase
        .from('drivers')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', session.user.id);

      if (updateError) {
        logError('Update driver status error', updateError);
        throw new Error(`Failed to update status: ${updateError.message}`);
      }
      
      return status;
    },
    onSuccess: (status) => {
      queryClient.invalidateQueries({ queryKey: ['driver'] });
      // If going online, also refresh trips to get any pending ones
      if (status === 'online') {
        queryClient.invalidateQueries({ queryKey: ['trips'] });
      }
    },
    onError: (error) => {
      logError('Driver status update failed', error);
    },
  });
}

export function useUpdateTripStatus() {
  const queryClient = useQueryClient();
  // Always call hooks in the same order - no conditional hook calls
  const authQuery = useAuth();
  const driverQuery = useDriverProfile();
  
  const session = authQuery.data;
  const driver = driverQuery.data;
  
  return useMutation({
    mutationFn: async ({ tripId, status }: { tripId: string; status: 'accepted' | 'completed' | 'cancelled' }) => {
      if (!session?.user) {
        throw new Error('User not authenticated');
      }

      if (!driver?.id) {
        throw new Error('Driver not found');
      }

      // Update trip status
      
      // For accepting a trip, we need to assign it to the current driver
      const updateData: any = { 
        status, 
        updated_at: new Date().toISOString() 
      };
      
      if (status === 'accepted') {
        updateData.driver_id = driver.id;
      }
      
      // Update trip status
      const { error: updateError } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', tripId);

      if (updateError) {
        logError('Update trip status error', updateError);
        throw new Error(`Failed to update trip: ${updateError.message}`);
      }

      // Trip status updated

      // If completing a trip, update driver's total trips
      if (status === 'completed') {
        
        try {
          // Get current total trips and increment by 1
          const { data: driverData, error: driverQueryError } = await supabase
            .from('drivers')
            .select('total_trips')
            .eq('id', session.user.id)
            .single();

          if (driverQueryError) {
            logError('Driver query error', driverQueryError);
          } else {
            const newTotalTrips = (driverData?.total_trips || 0) + 1;
            
            const { error: driverUpdateError } = await supabase
              .from('drivers')
              .update({ 
                total_trips: newTotalTrips,
                updated_at: new Date().toISOString()
              })
              .eq('id', session.user.id);

            if (driverUpdateError) {
              logError('Update driver total trips error', driverUpdateError);
            }
          }
        } catch (driverUpdateError) {
          logError('Driver stats update error (non-critical)', driverUpdateError);
        }
      }

      return { tripId, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['driver'] });
      queryClient.invalidateQueries({ queryKey: ['earnings'] });
    },
    onError: (error) => {
      logError('Trip status update failed', error);
    },
  });
}

export function useRejectTrip() {
  const queryClient = useQueryClient();
  // Always call hooks in the same order - no conditional hook calls
  const authQuery = useAuth();
  const driverQuery = useDriverProfile();
  
  const session = authQuery.data;
  const driver = driverQuery.data;
  
  return useMutation({
    mutationFn: async (tripId: string) => {
      if (!session?.user) {
        throw new Error('User not authenticated');
      }

      if (!driver?.id) {
        throw new Error('Driver not found');
      }

      // Reject trip for driver
      
      // Store the rejection locally so this driver won't see this trip again
      try {
        const rejectedTripsKey = `rejected_trips_${driver.id}`;
        const existingRejectedJson = await AsyncStorage.getItem(rejectedTripsKey);
        const existingRejected = existingRejectedJson ? JSON.parse(existingRejectedJson) : [];
        
        if (!existingRejected.includes(tripId)) {
          const updatedRejected = [...existingRejected, tripId];
          await AsyncStorage.setItem(rejectedTripsKey, JSON.stringify(updatedRejected));
        }
      } catch {
        // Silently handle storage errors
      }
      
      return { tripId, driverId: driver.id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
    onError: (error) => {
      logError('Trip rejection failed', error);
    },
  });
}
