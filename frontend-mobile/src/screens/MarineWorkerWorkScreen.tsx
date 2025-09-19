import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../stores/authStore';
import { apiService } from '../services/api';

const MarineWorkerWorkScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    workToday: '',
    observations: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.workToday.trim()) {
      Alert.alert('Validation Error', 'Please describe what work you did today');
      return;
    }

    setIsLoading(true);

    try {
      // Update work details
      await apiService.updateWorkDetails({
        workToday: formData.workToday.trim(),
        observations: formData.observations.trim(),
      });

      Alert.alert(
        'Work Details Saved',
        'Your work details have been saved successfully!',
        [
          {
            text: 'Continue',
            onPress: () => navigation.navigate('MarineWorkerWarning' as never),
          },
        ]
      );
    } catch (error: any) {
      console.error('Error saving work details:', error);
      Alert.alert('Error', 'Failed to save work details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Work Details',
      'Are you sure you want to skip this step?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          onPress: () => navigation.navigate('MarineWorkerWarning' as never),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Work Details</Text>
              <Text style={styles.subtitle}>
                Tell us about your work today and any observations
              </Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>What work did you do today? *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.workToday}
                  onChangeText={(value) => handleInputChange('workToday', value)}
                  placeholder="Describe your work activities today..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  accessibilityLabel="Work today input"
                  accessibilityHint="Describe what work you did today"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>What did you observe? (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.observations}
                  onChangeText={(value) => handleInputChange('observations', value)}
                  placeholder="Any observations about weather, sea conditions, safety concerns, etc..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  accessibilityLabel="Observations input"
                  accessibilityHint="Describe any observations you made"
                />
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoIcon}>ℹ️</Text>
                <Text style={styles.infoText}>
                  This information helps us understand marine conditions and improve safety protocols.
                </Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={isLoading}
                accessibilityRole="button"
                accessibilityLabel="Submit work details"
              >
                <Text style={styles.submitButtonText}>
                  {isLoading ? 'Saving...' : 'Save Work Details'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.skipButton}
                onPress={handleSkip}
                disabled={isLoading}
                accessibilityRole="button"
                accessibilityLabel="Skip work details"
              >
                <Text style={styles.skipButtonText}>Skip for Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 24,
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
    color: '#1F2937',
  },
  textArea: {
    height: 100,
  },
  infoBox: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#0369A1',
    lineHeight: 20,
  },
  buttonContainer: {
    gap: 16,
  },
  submitButton: {
    backgroundColor: '#0369A1',
    borderRadius: 12,
    padding: 16,
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
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  skipButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default MarineWorkerWorkScreen;
