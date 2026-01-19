import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import React from 'react';

import Colors from '@/constants/colors';
import { useDriver } from '@/hooks/driver-store';
import StatusToggle from '@/components/StatusToggle';
import EarningsSummary from '@/components/EarningsSummary';
import TripRequest from '@/components/TripRequest';
import ConnectionStatus from '@/components/ConnectionStatus';
import { useAuth } from '@/hooks/use-auth';

export default function HomeScreen() {
  // Always call hooks in the same order
  const authQuery = useAuth();
  const driverContext = useDriver();
  
  const session = authQuery.data;
  const { driver, pendingTrip, isLoading, error } = driverContext;

  const handleRetry = () => {
    // Force refetch by invalidating queries
    window.location.reload();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!session) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Authentication required</Text>
        <Text style={styles.errorSubtext}>Please sign in to continue</Text>
      </View>
    );
  }

  if (!driver && error) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <ConnectionStatus 
          isConnected={false} 
          onRetry={handleRetry}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Unable to load driver data</Text>
          <Text style={styles.errorSubtext}>Please check your connection and try again</Text>
        </View>
      </ScrollView>
    );
  }

  if (!driver) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Driver profile not found</Text>
        <Text style={styles.errorSubtext}>Please contact support for assistance</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>Hello, {driver.name}!</Text>
      <Text style={styles.date}>
        {new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </Text>
      
      <StatusToggle />
      
      {driver.status === 'online' && pendingTrip && (
        <TripRequest trip={pendingTrip} />
      )}
      
      {driver.status === 'offline' && (
        <View style={styles.offlineMessage}>
          <Text style={styles.offlineText}>
            You&apos;re currently offline. Go online to receive trip requests.
          </Text>
        </View>
      )}
      
      <EarningsSummary />
      
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Your Stats</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{driver.totalTrips}</Text>
            <Text style={styles.statLabel}>Total Trips</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{driver.rating.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{driver.memberSince}</Text>
            <Text style={styles.statLabel}>Member Since</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.danger,
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  offlineMessage: {
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  offlineText: {
    fontSize: 14,
    color: Colors.text,
  },
  statsContainer: {
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
