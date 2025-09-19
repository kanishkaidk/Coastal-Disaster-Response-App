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

const MarineWorkerWarningScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    description: '',
    severity: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasWarning, setHasWarning] = useState<boolean | null>(null);

  const severityOptions = [
    { value: 1, label: 'Low', color: '#10B981' },
    { value: 2, label: 'Minor', color: '#F59E0B' },
    { value: 3, label: 'Moderate', color: '#F97316' },
    { value: 4, label: 'High', color: '#EF4444' },
    { value: 5, label: 'Critical', color: '#DC2626' },
  ];

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleWarningChoice = (choice: boolean) => {
    setHasWarning(choice);
    if (!choice) {
      // No warning, go to dashboard
      navigation.navigate('MainTabs' as never);
    }
  };

  const handleSubmit = async () => {
    if (!formData.description.trim()) {
      Alert.alert('Validation Error', 'Please describe the warning or concern');
      return;
    }

    setIsLoading(true);

    try {
      // Create warning
      await apiService.createMarineWorkerWarning({
        description: formData.description.trim(),
        severity: formData.severity,
      });

      Alert.alert(
        'Warning Submitted',
        'Your warning has been submitted successfully! Emergency services have been notified.',
        [
          {
            text: 'Continue to Dashboard',
            onPress: () => navigation.navigate('MainTabs' as never),
          },
        ]
      );
    } catch (error: any) {
      console.error('Error submitting warning:', error);
      Alert.alert('Error', 'Failed to submit warning. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Warning',
      'Are you sure you want to skip this step?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          onPress: () => navigation.navigate('MainTabs' as never),
        },
      ]
    );
  };

  if (hasWarning === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Safety Check</Text>
            <Text style={styles.subtitle}>
              Do you have any warnings or safety concerns to report?
            </Text>
          </View>

          <View style={styles.choiceContainer}>
            <TouchableOpacity
              style={[styles.choiceButton, styles.yesButton]}
              onPress={() => handleWarningChoice(true)}
              accessibilityRole="button"
              accessibilityLabel="Yes, I have a warning to report"
            >
              <Text style={styles.choiceButtonText}>Yes, Report Warning</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.choiceButton, styles.noButton]}
              onPress={() => handleWarningChoice(false)}
              accessibilityRole="button"
              accessibilityLabel="No, no warnings to report"
            >
              <Text style={styles.choiceButtonText}>No, All Good</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

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
              <Text style={styles.title}>Report Warning</Text>
              <Text style={styles.subtitle}>
                Please describe the warning or safety concern
              </Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Warning Description *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.description}
                  onChangeText={(value) => handleInputChange('description', value)}
                  placeholder="Describe the warning, safety concern, or emergency situation..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  accessibilityLabel="Warning description input"
                  accessibilityHint="Describe the warning or safety concern"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Severity Level</Text>
                <View style={styles.severityContainer}>
                  {severityOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.severityButton,
                        formData.severity === option.value && styles.severityButtonSelected,
                        { borderColor: option.color }
                      ]}
                      onPress={() => handleInputChange('severity', option.value)}
                      accessibilityRole="button"
                      accessibilityLabel={`Select ${option.label} severity`}
                    >
                      <Text style={[
                        styles.severityButtonText,
                        formData.severity === option.value && { color: option.color }
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoIcon}>⚠️</Text>
                <Text style={styles.infoText}>
                  This warning will be immediately shared with emergency services and other marine workers in the area.
                </Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={isLoading}
                accessibilityRole="button"
                accessibilityLabel="Submit warning"
              >
                <Text style={styles.submitButtonText}>
                  {isLoading ? 'Submitting...' : 'Submit Warning'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.skipButton}
                onPress={handleSkip}
                disabled={isLoading}
                accessibilityRole="button"
                accessibilityLabel="Skip warning"
              >
                <Text style={styles.skipButtonText}>Skip</Text>
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
  choiceContainer: {
    gap: 16,
  },
  choiceButton: {
    borderRadius: 12,
    padding: 20,
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
  yesButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 2,
    borderColor: '#FCA5A5',
  },
  noButton: {
    backgroundColor: '#F0FDF4',
    borderWidth: 2,
    borderColor: '#86EFAC',
  },
  choiceButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
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
  severityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  severityButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
  },
  severityButtonSelected: {
    backgroundColor: '#F3F4F6',
  },
  severityButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  infoBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
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
    color: '#DC2626',
    lineHeight: 20,
  },
  buttonContainer: {
    gap: 16,
  },
  submitButton: {
    backgroundColor: '#DC2626',
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

export default MarineWorkerWarningScreen;
