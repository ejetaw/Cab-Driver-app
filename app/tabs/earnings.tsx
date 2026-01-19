import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react-native';

import Colors from '@/constants/colors';
import { useDriver } from '@/hooks/driver-store';
import EarningsChart from '@/components/EarningsChart';
import TripHistoryItem from '@/components/TripHistoryItem';

export default function EarningsScreen() {
  const { getCompletedTrips, earnings } = useDriver();
  
  const completedTrips = getCompletedTrips();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.periodSelector}>
          <Calendar size={20} color={Colors.primary} />
          <Text style={styles.periodText}>This Week</Text>
          <ChevronDown size={16} color={Colors.textSecondary} />
        </View>
      </View>
      
      <EarningsChart data={earnings} />
      
      <View style={styles.tripsHeader}>
        <Text style={styles.tripsTitle}>Trip History</Text>
        <Text style={styles.tripsCount}>{completedTrips.length} trips</Text>
      </View>
      
      {completedTrips.map(trip => (
        <TripHistoryItem key={trip.id} trip={trip} />
      ))}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  periodText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginHorizontal: 8,
  },
  tripsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  tripsTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  tripsCount: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
