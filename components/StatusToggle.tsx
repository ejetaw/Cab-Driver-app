import { StyleSheet, Switch, Text, View, ActivityIndicator } from 'react-native';
import React from 'react';

import Colors from '@/constants/colors';
import { useDriver } from '@/hooks/driver-store';

export default function StatusToggle() {
  const { driver, toggleStatus, isUpdating } = useDriver();
  
  if (!driver) return null;
  
  const isOnline = driver.status === 'online';

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Status:</Text>
      <View style={styles.statusContainer}>
        <Text style={[
          styles.statusText, 
          { color: isOnline ? Colors.statusOnline : Colors.statusOffline }
        ]}>
          {isOnline ? 'Online' : 'Offline'}
        </Text>
        {isUpdating ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          <Switch
            trackColor={{ false: '#E0E0E0', true: '#C8E6C9' }}
            thumbColor={isOnline ? Colors.statusOnline : Colors.statusOffline}
            ios_backgroundColor="#E0E0E0"
            onValueChange={toggleStatus}
            value={isOnline}
            disabled={isUpdating}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  label: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
