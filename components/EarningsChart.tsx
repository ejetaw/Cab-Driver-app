import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

import Colors from '@/constants/colors';
import { EarningPeriod } from '@/types/driver';

interface EarningsChartProps {
  data: EarningPeriod[];
}

export default function EarningsChart({ data }: EarningsChartProps) {
  // Find the maximum amount to scale the bars
  const maxAmount = Math.max(...data.map(item => item.amount));
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Earnings</Text>
      
      <View style={styles.chartContainer}>
        {data.map((item, index) => {
          // Calculate the height of the bar based on the amount
          const barHeight = (item.amount / maxAmount) * 150;
          
          // Get day of week from date
          const date = new Date(item.date);
          const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3);
          
          return (
            <View key={item.id} style={styles.barContainer}>
              <View style={styles.barLabelContainer}>
                <Text style={styles.barValue}>${item.amount.toFixed(0)}</Text>
              </View>
              <View style={[styles.bar, { height: barHeight }]} />
              <Text style={styles.barLabel}>{dayOfWeek}</Text>
            </View>
          );
        })}
      </View>
      
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Earnings</Text>
          <Text style={styles.summaryValue}>
            ${data.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Trips</Text>
          <Text style={styles.summaryValue}>
            {data.reduce((sum, item) => sum + item.trips, 0)}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Hours</Text>
          <Text style={styles.summaryValue}>
            {data.reduce((sum, item) => sum + item.hours, 0).toFixed(1)}
          </Text>
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
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 200,
    marginBottom: 16,
  },
  barContainer: {
    alignItems: 'center',
    width: '13%',
  },
  barLabelContainer: {
    marginBottom: 8,
  },
  barValue: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  bar: {
    width: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    marginTop: 8,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 16,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
});
