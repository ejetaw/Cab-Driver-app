import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { RefreshCw, WifiOff } from 'lucide-react-native';

import Colors from '@/constants/colors';

interface ConnectionStatusProps {
  isConnected: boolean;
  onRetry: () => void;
  isRetrying?: boolean;
}

export default function ConnectionStatus({ 
  isConnected, 
  onRetry, 
  isRetrying = false 
}: ConnectionStatusProps) {
  if (isConnected) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <WifiOff size={24} color={Colors.danger} />
        <Text style={styles.title}>Connection Issue</Text>
        <Text style={styles.message}>
          Unable to connect to the server. Please check your internet connection.
        </Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={onRetry}
          disabled={isRetrying}
        >
          <RefreshCw size={16} color={Colors.card} />
          <Text style={styles.retryText}>
            {isRetrying ? 'Retrying...' : 'Retry'}
          </Text>
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
    borderLeftWidth: 4,
    borderLeftColor: Colors.danger,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: {
    color: Colors.card,
    fontSize: 14,
    fontWeight: '600' as const,
    marginLeft: 4,
  },
});
