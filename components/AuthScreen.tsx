import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { LogIn, UserPlus, AlertTriangle } from 'lucide-react-native';

import Colors from '@/constants/colors';
import { useSignIn, useSignUp } from '@/hooks/use-auth';
import { storageAvailable } from '@/lib/supabase';

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const signInMutation = useSignIn();
  const signUpMutation = useSignUp();

  const handleSignIn = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    signInMutation.mutate({ email, password }, {
      onError: (error) => {
        Alert.alert('Sign In Failed', error.message);
      },
    });
  };

  const handleSignUp = () => {
    if (!email || !password || !name || !phone) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    signUpMutation.mutate({ email, password, name, phone }, {
      onSuccess: (data) => {
        if (data.session) {
          Alert.alert('Success', 'Account created and signed in!');
        } else {
          Alert.alert('Success', 'Account created! You can now sign in.');
        }
      },
      onError: (error) => {
        Alert.alert('Sign Up Failed', error.message);
      },
    });
  };

  const isLoading = signInMutation.isPending || signUpMutation.isPending;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Driver App</Text>
        <Text style={styles.subtitle}>
          {isSignUp ? 'Create your account' : 'Sign in to continue'}
        </Text>
      </View>

      <View style={styles.form}>
        {isSignUp && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </>
        )}
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={isSignUp ? handleSignUp : handleSignIn}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.card} />
          ) : (
            <>
              {isSignUp ? (
                <UserPlus size={20} color={Colors.card} />
              ) : (
                <LogIn size={20} color={Colors.card} />
              )}
              <Text style={styles.primaryButtonText}>
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => setIsSignUp(!isSignUp)}
          disabled={isLoading}
        >
          <Text style={styles.secondaryButtonText}>
            {isSignUp 
              ? 'Already have an account? Sign In' 
              : "Don't have an account? Sign Up"
            }
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.infoText}>
        This app works with drivers registered through both the web app and mobile app. 
        Use your existing credentials to sign in.
      </Text>
      
      {!storageAvailable && (
        <View style={styles.warningContainer}>
          <AlertTriangle size={16} color={Colors.warning} />
          <Text style={styles.warningText}>
            Browser storage is restricted. Session may not persist after page reload.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    marginBottom: 40,
  },
  input: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  primaryButtonText: {
    color: Colors.card,
    fontSize: 16,
    fontWeight: '600' as const,
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  infoText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    backgroundColor: Colors.card,
    padding: 12,
    borderRadius: 8,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.warning,
  },
  warningText: {
    fontSize: 12,
    color: Colors.warning,
    marginLeft: 8,
    flex: 1,
  },
});
