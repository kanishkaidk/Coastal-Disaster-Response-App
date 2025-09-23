import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, borderRadius, spacing, shadows } from '../theme/theme';
import ResourceTypeDropdown, { ResourceType } from '../components/ResourceTypeDropdown';
import UrgencyBadge, { UrgencyLevel } from '../components/UrgencyBadge';
import OfflineBanner from '../components/OfflineBanner';
import locationService from '../services/locationService';

interface ResourceRequestFormData {
  type: ResourceType | null;
  quantity: string;
  urgency: UrgencyLevel;
  location: string;
  description: string;
}

const ResourceRequestFormScreen: React.FC = () => {
  const [formData, setFormData] = useState<ResourceRequestFormData>({
    type: null,
    quantity: '',
    urgency: 'medium',
    location: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOffline, setIsOffline] = useState(false); // This would come from network state
  // const { getCurrentLocation } = useLocationService();


  const urgencyLevels: { level: UrgencyLevel; label: string }[] = [
    { level: 'low', label: 'Low' },
    { level: 'medium', label: 'Medium' },
    { level: 'high', label: 'High' },
    { level: 'critical', label: 'Critical' },
  ];

 const handleLocationDetect = async () => {
  try {
    const location = await locationService.getCurrentLocation();
    if (location) {
      setFormData(prev => ({
        ...prev,
        location: `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`,
      }));
    }
  } catch (error) {
    Alert.alert(
      'Location Error',
      'Unable to detect your current location. Please enter manually.'
    );
  }
};


  const handleSubmit = async () => {
    // Validation
    if (!formData.type) {
      Alert.alert('Validation Error', 'Please select a resource type.');
      return;
    }
    if (!formData.quantity.trim()) {
      Alert.alert('Validation Error', 'Please enter the quantity.');
      return;
    }
    if (!formData.location.trim()) {
      Alert.alert('Validation Error', 'Please enter or detect your location.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form
      setFormData({
        type: null,
        quantity: '',
        urgency: 'medium',
        location: '',
        description: '',
      });
      
      Alert.alert(
        'Request Submitted',
        isOffline 
          ? 'Your request has been queued and will be sent when connection is restored.'
          : 'Your resource request has been submitted successfully.'
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Request Resources</Text>
            <Text style={styles.subtitle}>
              Fill in the details below to request help.
            </Text>
          </View>

          {/* Offline Banner */}
          <OfflineBanner visible={isOffline} />

          {/* Form */}
          <View style={styles.form}>
            {/* Resource Type */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Resource Type *</Text>
              <ResourceTypeDropdown
                selectedType={formData.type}
                onSelect={(type) => setFormData(prev => ({ ...prev, type }))}
                placeholder="Select resource type"
              />
            </View>

            {/* Quantity */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Quantity *</Text>
              <View style={[styles.inputContainer, shadows.sm]}>
                <TextInput
                  style={styles.textInput}
                  value={formData.quantity}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, quantity: text }))}
                  placeholder="Enter quantity"
                  keyboardType="numeric"
                  accessibilityLabel="Quantity input"
                  accessibilityHint="Enter the quantity of resources needed"
                />
              </View>
            </View>

            {/* Urgency Level */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Urgency Level *</Text>
              <View style={styles.urgencyContainer}>
                {urgencyLevels.map(({ level, label }) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.urgencyButton,
                      formData.urgency === level && styles.urgencyButtonActive,
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, urgency: level }))}
                    accessibilityLabel={`Select ${label} urgency`}
                    accessibilityRole="button"
                  >
                    <UrgencyBadge urgency={level} size="small" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Location */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Location *</Text>
              <View style={styles.locationContainer}>
                <View style={[styles.inputContainer, styles.locationInput, shadows.sm]}>
                  <TextInput
                    style={styles.textInput}
                    value={formData.location}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
                    placeholder="Enter your location"
                    accessibilityLabel="Location input"
                    accessibilityHint="Enter your current location or use GPS to detect"
                  />
                </View>
                <TouchableOpacity
                  style={[styles.gpsButton, shadows.sm]}
                  onPress={handleLocationDetect}
                  accessibilityLabel="Detect current location"
                  accessibilityRole="button"
                >
                  <Ionicons name="location" size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Description (Optional) */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Description (Optional)</Text>
              <View style={[styles.inputContainer, styles.textAreaContainer, shadows.sm]}>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={formData.description}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                  placeholder="Additional details about your request"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  accessibilityLabel="Description input"
                  accessibilityHint="Enter additional details about your resource request"
                />
              </View>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              shadows.lg,
              isSubmitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
            accessibilityLabel="Submit resource request"
            accessibilityRole="button"
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Text>
            {!isSubmitting && (
              <Ionicons name="arrow-forward" size={20} color={colors.background} />
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['2xl'],
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize['3xl'],
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.base,
    color: colors.gray600,
    lineHeight: typography.lineHeight.normal * typography.fontSize.base,
  },
  form: {
    paddingHorizontal: spacing.lg,
  },
  formGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.base,
    color: colors.onBackground,
    marginBottom: spacing.sm,
  },
  inputContainer: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.gray200,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  textInput: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.base,
    color: colors.onBackground,
    minHeight: 24,
  },
  urgencyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  urgencyButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  urgencyButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight + '20',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  locationInput: {
    flex: 1,
  },
  gpsButton: {
    width: 48,
    height: 48,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textAreaContainer: {
    minHeight: 100,
  },
  textArea: {
    minHeight: 80,
  },
  submitButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: borderRadius.xl,
    gap: spacing.sm,
  },
  submitButtonDisabled: {
    backgroundColor: colors.gray400,
  },
  submitButtonText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.lg,
    color: colors.background,
  },
});

export default ResourceRequestFormScreen;
