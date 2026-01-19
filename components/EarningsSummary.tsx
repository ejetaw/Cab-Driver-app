import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

import Colors from '@/constants/colors';
import { useDriver } from '@/hooks/driver-store';

export default function EarningsSummary() {
  const { driver } = useDriver();
  
  if (!driver) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Earnings Summary</Text>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }
  
  const { earnings } = driver;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Earnings Summary</Text>
      
      <View style={styles.earningsGrid}>
        <View style={styles.earningItem}>
          <Text style={styles.earningLabel}>Today</Text>
          <Text style={styles.earningValue}>${earnings.today.toFixed(2)}</Text>
        </View>
        
        <View style={styles.earningItem}>
          <Text style={styles.earningLabel}>This Week</Text>
          <Text style={styles.earningValue}>${earnings.week.toFixed(2)}</Text>
        </View>
        
        <View style={styles.earningItem}>
          <Text style={styles.earningLabel}>This Month</Text>
          <Text style={styles.earningValue}>${earnings.month.toFixed(2)}</Text>
        </View>
        
        <View style={styles.earningItem}>
          <Text style={styles.earningLabel}>Total</Text>
          <Text style={styles.earningValue}>${earnings.total.toFixed(2)}</Text>
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
  title: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  earningsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  earningItem: {
    width: '48%',
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  earningLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  earningValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center' as const,
    marginTop: 12,
  },
});
