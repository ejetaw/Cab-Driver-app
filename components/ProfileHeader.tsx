import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import { Star } from 'lucide-react-native';

import Colors from '@/constants/colors';
import { useDriver } from '@/hooks/driver-store';

export default function ProfileHeader() {
  const { driver } = useDriver();

  if (!driver) return null;

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: driver.profileImage }} 
        style={styles.profileImage} 
      />
      
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{driver.name}</Text>
        
        <View style={styles.ratingContainer}>
          <Star size={16} color={Colors.warning} fill={Colors.warning} />
          <Text style={styles.rating}>{driver.rating.toFixed(1)}</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{driver.totalTrips}</Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{driver.memberSince}</Text>
            <Text style={styles.statLabel}>Member Since</Text>
          </View>
        </View>
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
    flexDirection: 'row',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
    marginHorizontal: 12,
  },
});
