import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MapPin, Clock, DollarSign, Navigation, Phone, MessageSquare, Star } from 'lucide-react-native';

import Colors from '@/constants/colors';
import { useDriver } from '@/hooks/driver-store';

function TripDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getTripById, completeTrip } = useDriver();
  
  const trip = getTripById(id);
  
  if (!trip) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Trip not found</Text>
      </View>
    );
  }
  
  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  const handleCompleteTrip = () => {
    if (trip.status === 'accepted') {
      completeTrip(trip.id);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Trip Details</Text>
          <View style={[
            styles.statusBadge,
            { 
              backgroundColor: trip.status === 'completed' 
                ? Colors.success + '20' 
                : trip.status === 'accepted'
                ? Colors.warning + '20'
                : Colors.danger + '20'
            }
          ]}>
            <Text style={[
              styles.statusText,
              {
                color: trip.status === 'completed' 
                  ? Colors.success 
                  : trip.status === 'accepted'
                  ? Colors.warning
                  : Colors.danger
              }
            ]}>
              {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
            </Text>
          </View>
        </View>
        
        <Text style={styles.date}>{formatDate(trip.timestamp)}</Text>
        
        <View style={styles.fareContainer}>
          <Text style={styles.fareLabel}>Fare</Text>
          <Text style={styles.fareAmount}>${trip.fare.toFixed(2)}</Text>
          <Text style={styles.paymentMethod}>Paid with {trip.paymentMethod}</Text>
        </View>
      </View>
      
      <View style={styles.card}>
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
        
        <View style={styles.contactButtons}>
          <TouchableOpacity style={styles.contactButton}>
            <Phone size={20} color={Colors.primary} />
            <Text style={styles.contactButtonText}>Call</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.contactButton}>
            <MessageSquare size={20} color={Colors.primary} />
            <Text style={styles.contactButtonText}>Message</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Trip Route</Text>
        
        <View style={styles.routeContainer}>
          <View style={styles.locationContainer}>
            <View style={styles.locationMarker}>
              <View style={[styles.marker, styles.pickupMarker]} />
            </View>
            <View style={styles.locationDetails}>
              <Text style={styles.locationLabel}>Pickup</Text>
              <Text style={styles.locationAddress}>{trip.pickup.address}</Text>
            </View>
          </View>
          
          <View style={styles.routeLine} />
          
          <View style={styles.locationContainer}>
            <View style={styles.locationMarker}>
              <View style={[styles.marker, styles.dropoffMarker]} />
            </View>
            <View style={styles.locationDetails}>
              <Text style={styles.locationLabel}>Dropoff</Text>
              <Text style={styles.locationAddress}>{trip.dropoff.address}</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity style={styles.navigationButton}>
          <Navigation size={20} color={Colors.card} />
          <Text style={styles.navigationButtonText}>Navigate</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Trip Summary</Text>
        
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <Clock size={16} color={Colors.textSecondary} />
            <View style={styles.summaryDetails}>
              <Text style={styles.summaryLabel}>Duration</Text>
              <Text style={styles.summaryValue}>{trip.duration} minutes</Text>
            </View>
          </View>
          
          <View style={styles.summaryItem}>
            <MapPin size={16} color={Colors.textSecondary} />
            <View style={styles.summaryDetails}>
              <Text style={styles.summaryLabel}>Distance</Text>
              <Text style={styles.summaryValue}>{trip.distance.toFixed(1)} miles</Text>
            </View>
          </View>
          
          <View style={styles.summaryItem}>
            <DollarSign size={16} color={Colors.textSecondary} />
            <View style={styles.summaryDetails}>
              <Text style={styles.summaryLabel}>Fare</Text>
              <Text style={styles.summaryValue}>${trip.fare.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </View>
      
      {trip.status === 'accepted' && (
        <TouchableOpacity 
          style={styles.completeButton}
          onPress={handleCompleteTrip}
        >
          <Text style={styles.completeButtonText}>Complete Trip</Text>
        </TouchableOpacity>
      )}
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
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  card: {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  date: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  fareContainer: {
    alignItems: 'center',
  },
  fareLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  fareAmount: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.primary,
    marginBottom: 4,
  },
  paymentMethod: {
    fontSize: 14,
    color: Colors.textSecondary,
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
  contactButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  routeContainer: {
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationMarker: {
    width: 24,
    alignItems: 'center',
    marginRight: 8,
  },
  marker: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  pickupMarker: {
    backgroundColor: Colors.primary,
  },
  dropoffMarker: {
    backgroundColor: Colors.accent,
  },
  routeLine: {
    width: 2,
    height: 30,
    backgroundColor: Colors.border,
    marginLeft: 12,
    marginVertical: 4,
  },
  locationDetails: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 8,
  },
  navigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
  },
  navigationButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.card,
    marginLeft: 8,
  },
  summaryContainer: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryDetails: {
    marginLeft: 12,
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  completeButton: {
    backgroundColor: Colors.success,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.card,
  },
});

export default TripDetailsScreen;
