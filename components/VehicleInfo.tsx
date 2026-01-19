import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import { Car } from 'lucide-react-native';

import Colors from '@/constants/colors';
import { useDriver } from '@/hooks/driver-store';

export default function VehicleInfo() {
  const { driver } = useDriver();
  
  if (!driver) return null;
  
  const { vehicle } = driver;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Car size={20} color={Colors.primary} />
        <Text style={styles.title}>Vehicle Information</Text>
      </View>
      
      <Image 
        source={{ uri: vehicle.image }} 
        style={styles.vehicleImage} 
      />
      
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Make</Text>
            <Text style={styles.detailValue}>{vehicle.make || 'Not specified'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Model</Text>
            <Text style={styles.detailValue}>{vehicle.model || 'Not specified'}</Text>
          </View>
        </View>
        
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Year</Text>
            <Text style={styles.detailValue}>{vehicle.year || 'Not specified'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Color</Text>
            <Text style={styles.detailValue}>{vehicle.color || 'Not specified'}</Text>
          </View>
        </View>
        
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Registration</Text>
            <Text style={styles.detailValue}>{vehicle.licensePlate || 'Not specified'}</Text>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginLeft: 8,
  },
  vehicleImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 16,
  },
  detailsContainer: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
});
