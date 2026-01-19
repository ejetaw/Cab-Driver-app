import { StyleSheet, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { Bell, CreditCard, HelpCircle, LogOut, Car, Shield, User } from 'lucide-react-native';

import Colors from '@/constants/colors';
import ProfileHeader from '@/components/ProfileHeader';
import VehicleInfo from '@/components/VehicleInfo';
import ProfileMenuItem from '@/components/ProfileMenuItem';
import { useSignOut } from '@/hooks/use-auth';
import { useDriver } from '@/hooks/driver-store';

export default function ProfileScreen() {
  const signOutMutation = useSignOut();
  const { driver } = useDriver();

  const handleAccountSettings = () => {
    Alert.alert(
      'Account Settings',
      `Name: ${driver?.name || 'Not set'}\nEmail: ${driver?.email || 'Not set'}\nPhone: ${driver?.phone || 'Not set'}\nLicense: ${driver?.vehicle?.licensePlate || 'Not set'}\nAddress: Available in database\nDate of Birth: Available in database`,
      [{ text: 'OK' }]
    );
  };

  const handleVehicleInfo = () => {
    if (!driver?.vehicle) {
      Alert.alert('Vehicle Information', 'No vehicle information available');
      return;
    }
    
    const vehicle = driver.vehicle;
    Alert.alert(
      'Vehicle Details',
      `Make: ${vehicle.make}\nModel: ${vehicle.model}\nYear: ${vehicle.year}\nColor: ${vehicle.color}\nRegistration: ${vehicle.licensePlate}\nInsurance: Available in database\nMOT: Available in database`,
      [{ text: 'OK' }]
    );
  };

  const handleDocuments = () => {
    Alert.alert(
      'Documents',
      `Your documents are stored in the database:\n• Driver License (DVLA)\n• PCO License\n• Vehicle License\n• Insurance Certificate\n• MOT Certificate\n\nAll document expiry dates are tracked in the system.`,
      [{ text: 'OK' }]
    );
  };

  const handleNotifications = () => {
    Alert.alert(
      'Notifications',
      `Push notifications are enabled for:\n• New trip requests\n• Trip status updates\n• Earnings notifications\n• Document expiry reminders\n\nNotification preferences can be managed in your account settings.`,
      [{ text: 'OK' }]
    );
  };

  const handlePaymentMethods = () => {
    Alert.alert(
      'Payment Methods',
      `Your earnings are tracked in the system:\n• Daily earnings: Calculated from completed trips\n• Weekly earnings: Automatically aggregated\n• Monthly earnings: Available in earnings section\n\nBank account details for payouts are managed through the admin panel.`,
      [{ text: 'OK' }]
    );
  };

  const handleHelp = () => {
    Alert.alert(
      'Help & Support',
      `For assistance, please contact:\n• Email: support@yourcompany.com\n• Phone: +44 (0) 20 1234 5678\n• Hours: Monday-Friday, 9 AM - 6 PM\n\nCommon issues:\n• Trip not showing: Check your internet connection\n• Payment queries: Contact support with trip details\n• App issues: Try restarting the app`,
      [{ text: 'OK' }]
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive', 
          onPress: () => {
            console.log('User confirmed sign out');
            signOutMutation.mutate();
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ProfileHeader />
      
      <VehicleInfo />
      
      <Text style={styles.sectionTitle}>Account</Text>
      
      <ProfileMenuItem 
        icon={User}
        title="Account Settings"
        subtitle="Personal information, contact details"
        onPress={handleAccountSettings}
      />
      
      <ProfileMenuItem 
        icon={Bell}
        title="Notifications"
        subtitle="Trip alerts, earnings, document reminders"
        onPress={handleNotifications}
      />
      
      <ProfileMenuItem 
        icon={CreditCard}
        title="Payment Methods"
        subtitle="Earnings tracking and payout information"
        onPress={handlePaymentMethods}
      />
      
      <Text style={styles.sectionTitle}>Driver</Text>
      
      <ProfileMenuItem 
        icon={Car}
        title="Vehicle Information"
        subtitle="View vehicle details and documentation"
        onPress={handleVehicleInfo}
      />
      
      <ProfileMenuItem 
        icon={Shield}
        title="Documents"
        subtitle="License, insurance, MOT status"
        onPress={handleDocuments}
      />
      
      <Text style={styles.sectionTitle}>Support</Text>
      
      <ProfileMenuItem 
        icon={HelpCircle}
        title="Help & Support"
        subtitle="Contact support, FAQs, and assistance"
        onPress={handleHelp}
      />
      
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleSignOut}
        disabled={signOutMutation.isPending}
      >
        <LogOut size={20} color={Colors.danger} />
        <Text style={styles.logoutText}>
          {signOutMutation.isPending ? 'Signing Out...' : 'Log Out'}
        </Text>
      </TouchableOpacity>
      
      <Text style={styles.versionText}>Version 1.0.0</Text>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.textSecondary,
    marginTop: 8,
    marginBottom: 12,
    paddingLeft: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    marginBottom: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.danger,
    marginLeft: 8,
  },
  versionText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
});
