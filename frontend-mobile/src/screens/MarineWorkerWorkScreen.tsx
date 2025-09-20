import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SimpleMarineWorkerWork() {
  const navigation = useNavigation();
  const [workType, setWorkType] = useState('');
  const [observations, setObservations] = useState('');

  const handleSubmit = async () => {
    if (!workType.trim()) {
      Alert.alert('Error', 'Please describe what work you did today');
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert('Success', 'Work details saved!', [
        {
          text: 'Continue',
          onPress: () => navigation.navigate('MarineWorkerWarning' as never),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save work details. Please try again.');
    }
  };

  const handleSkip = () => {
    navigation.navigate('MarineWorkerWarning' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Work Details</Text>
        <Text style={styles.subtitle}>Tell us about your work today</Text>
        
        <View style={styles.form}>
          <Text style={styles.label}>What work did you do today? *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe your work activities..."
            value={workType}
            onChangeText={setWorkType}
            multiline
            numberOfLines={3}
            placeholderTextColor="#9CA3AF"
          />
          
          <Text style={styles.label}>Any observations? (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Weather, sea conditions, safety concerns, etc..."
            value={observations}
            onChangeText={setObservations}
            multiline
            numberOfLines={3}
            placeholderTextColor="#9CA3AF"
          />
        </View>
        
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Save Work Details</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip for Now</Text>
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
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 32,
    textAlign: 'center',
  },
  form: {
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    color: '#1F2937',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#0369A1',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    backgroundColor: 'transparent',
    padding: 16,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#6B7280',
    fontSize: 16,
  },
});
