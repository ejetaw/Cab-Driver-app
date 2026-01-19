import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { MapPin, Clock, DollarSign, Star } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import Colors from '@/constants/colors';
import { Trip } from '@/types/driver';
import { useDriver } from '@/hooks/driver-store';

interface TripRequestProps {
  trip: Trip;
}

export default function TripRequest({ trip }: TripRequestProps) {
  const { acceptTrip, rejectTrip } = useDriver();

  const handleAccept = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    acceptTrip(trip.id);
  };

  const handleReject = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    rejectTrip(trip.id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Trip Request</Text>
      
      <View style={styles.passengerInfo}>
        <Image 
          source={{ uri: trip.passenger.profileImage }} 
          style={styles.passengerImage} 
        />
        <View style={styles.passengerDetails}>
          <Text style={styles.passengerName}>{trip.passenger.name}</Text>
          <View style={styles.ratingContainer}>
            <Star size={16} color={Colors.warning} fill={Colors.warning} />
            <Text style={styles.ratingText}>{trip.passenger.rating.toFixed(1)}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.tripDetails}>
        <View style={styles.locationContainer}>
          <View style={styles.iconContainer}>
            <MapPin size={18} color={Colors.primary} />
          </View>
          <View style={styles.locationDetails}>
            <Text style={styles.locationLabel}>Pickup</Text>
            <Text style={styles.locationText}>{trip.pickup.address}</Text>
          </View>
        </View>
        
        <View style={styles.locationContainer}>
          <View style={styles.iconContainer}>
            <MapPin size={18} color={Colors.accent} />
          </View>
          <View style={styles.locationDetails}>
            <Text style={styles.locationLabel}>Dropoff</Text>
            <Text style={styles.locationText}>{trip.dropoff.address}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.tripInfo}>
        <View style={styles.infoItem}>
          <Clock size={16} color={Colors.textSecondary} />
          <Text style={styles.infoText}>{trip.duration} min</Text>
        </View>
        <View style={styles.infoItem}>
          <MapPin size={16} color={Colors.textSecondary} />
          <Text style={styles.infoText}>{trip.distance.toFixed(1)} mi</Text>
        </View>
        <View style={styles.infoItem}>
          <DollarSign size={16} color={Colors.textSecondary} />
          <Text style={styles.infoText}>${trip.fare.toFixed(2)}</Text>
        </View>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.rejectButton]} 
          onPress={handleReject}
        >
          <Text style={styles.rejectButtonText}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.acceptButton]} 
          onPress={handleAccept}
        >
          <Text style={styles.acceptButtonText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  passengerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  passengerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  passengerDetails: {
    flex: 1,
  },
  passengerName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  tripDetails: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  iconContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: 8,
  },
  locationDetails: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  locationText: {
    fontSize: 14,
    color: Colors.text,
  },
  tripInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectButton: {
    backgroundColor: Colors.background,
    marginRight: 8,
  },
  acceptButton: {
    backgroundColor: Colors.primary,
    marginLeft: 8,
  },
  rejectButtonText: {
    color: Colors.textSecondary,
    fontWeight: '600' as const,
  },
  acceptButtonText: {
    color: Colors.card,
    fontWeight: '600' as const,
  },
});
