import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { MapPin, Clock, DollarSign, ChevronRight } from 'lucide-react-native';
import { useRouter, Href } from 'expo-router';

import Colors from '@/constants/colors';
import { Trip } from '@/types/driver';

interface TripHistoryItemProps {
  trip: Trip;
}

export default function TripHistoryItem({ trip }: TripHistoryItemProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/trip/${trip.id}` as Href);
  };

  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.header}>
        <Text style={styles.date}>{formatDate(trip.timestamp)}</Text>
        <Text style={styles.fare}>${trip.fare.toFixed(2)}</Text>
      </View>
      
      <View style={styles.locations}>
        <View style={styles.locationItem}>
          <MapPin size={16} color={Colors.primary} />
          <Text style={styles.locationText} numberOfLines={1}>
            {trip.pickup.address}
          </Text>
        </View>
        
        <View style={styles.locationItem}>
          <MapPin size={16} color={Colors.accent} />
          <Text style={styles.locationText} numberOfLines={1}>
            {trip.dropoff.address}
          </Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <View style={styles.infoItem}>
          <Clock size={14} color={Colors.textSecondary} />
          <Text style={styles.infoText}>{trip.duration} min</Text>
        </View>
        <View style={styles.infoItem}>
          <MapPin size={14} color={Colors.textSecondary} />
          <Text style={styles.infoText}>{trip.distance.toFixed(1)} mi</Text>
        </View>
        <View style={styles.infoItem}>
          <DollarSign size={14} color={Colors.textSecondary} />
          <Text style={styles.infoText}>{trip.paymentMethod}</Text>
        </View>
        <ChevronRight size={16} color={Colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  date: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  fare: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  locations: {
    marginBottom: 12,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  infoText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
});
