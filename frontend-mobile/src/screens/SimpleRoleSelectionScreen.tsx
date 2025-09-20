import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SimpleRoleSelectionScreen() {
  const navigation = useNavigation();

  const handleMarineWorker = () => {
    navigation.navigate('MarineWorkerVerification' as never);
  };

  const handleCitizen = () => {
    navigation.navigate('MainTabs' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Select Your Role</Text>
        <Text style={styles.subtitle}>Choose the role that best describes you</Text>
        
        <TouchableOpacity style={styles.button} onPress={handleMarineWorker}>
          <Text style={styles.buttonText}>Marine Worker</Text>
          <Text style={styles.buttonSubtext}>Professional verification required</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.citizenButton]} onPress={handleCitizen}>
          <Text style={styles.buttonText}>Citizen</Text>
          <Text style={styles.buttonSubtext}>Report hazards and access resources</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 48,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0369A1',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  citizenButton: {
    backgroundColor: '#10B981',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  buttonSubtext: {
    color: '#E5E7EB',
    fontSize: 14,
  },
});
