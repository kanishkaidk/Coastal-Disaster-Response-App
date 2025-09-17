import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  Alert, 
  Image,
  ActivityIndicator,
  Dimensions,
  Vibration
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '../stores/appStore';
import { useAuthStore } from '../stores/authStore';
import { useAccessibilityStore } from '../stores/accessibilityStore';
import { typography, spacing, borderRadius } from '../theme/theme';
import locationService from '../services/locationService';
import cameraService from '../services/cameraService';
import apiService from '../services/api';

interface MediaAsset {
  uri: string;
  type: 'image' | 'video';
  base64?: string;
}

const { width } = Dimensions.get('window');

const ReportScreen: React.FC = () => {
  const { t } = useTranslation();
  const { currentLocation, setCurrentLocation } = useAppStore();
  const { user } = useAuthStore();
  const { speak, hapticFeedback, getFontSize } = useAccessibilityStore();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hazardType, setHazardType] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [location, setLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const [showHazardTypes, setShowHazardTypes] = useState(false);
  const [showSeverity, setShowSeverity] = useState(false);
  const [reportType, setReportType] = useState<'report' | 'warning'>('report');
  const [showReportType, setShowReportType] = useState(false);

  const hazardTypes = [
    { id: 'flood', label: 'Flood', icon: 'water', color: '#3b82f6', description: 'Rising water levels' },
    { id: 'storm', label: 'Storm', icon: 'thunderstorm', color: '#8b5cf6', description: 'Severe weather conditions' },
    { id: 'erosion', label: 'Coastal Erosion', icon: 'trending-down', color: '#f59e0b', description: 'Land being worn away' },
    { id: 'pollution', label: 'Water Pollution', icon: 'warning', color: '#ef4444', description: 'Contaminated water' },
    { id: 'infrastructure', label: 'Infrastructure Damage', icon: 'construct', color: '#6b7280', description: 'Damaged structures' },
    { id: 'other', label: 'Other', icon: 'ellipsis-horizontal', color: '#10b981', description: 'Other hazards' },
  ];

  const severityLevels = [
    { id: 'low', label: 'Low', color: '#10b981', description: 'Minor impact, monitor closely' },
    { id: 'medium', label: 'Medium', color: '#f59e0b', description: 'Moderate impact, take precautions' },
    { id: 'high', label: 'High', color: '#f97316', description: 'Significant impact, immediate action needed' },
    { id: 'critical', label: 'Critical', color: '#dc2626', description: 'Severe impact, emergency response required' },
  ];

  useEffect(() => {
    getCurrentLocation();
    speak('Report Hazard screen loaded. Fill in the details to report a hazard.');
  }, []);

  const getCurrentLocation = async () => {
    try {
      const location = await locationService.getCurrentLocation();
      if (location) {
        setLocation({ latitude: location.latitude, longitude: location.longitude });
        setCurrentLocation(location);
        speak('Location acquired successfully');
      }
    } catch (error) {
      console.error('Error getting location:', error);
      speak('Unable to get current location');
    }
  };

  const takePhoto = async () => {
    try {
      hapticFeedback('medium');
      speak('Opening camera');
      const photo = await cameraService.takePhoto();
      if (photo) {
        const mediaAsset: MediaAsset = {
          uri: photo.uri,
          type: photo.type === 'audio' ? 'image' : photo.type as 'image' | 'video'
        };
        setMedia(prev => [...prev, mediaAsset]);
        speak('Photo captured successfully');
        Vibration.vibrate(100);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
      speak('Failed to take photo');
    }
  };

  const pickImage = async () => {
    try {
      hapticFeedback('medium');
      speak('Opening photo library');
      const image = await cameraService.pickFromGallery('image');
      if (image) {
        const mediaAsset: MediaAsset = {
          uri: image.uri,
          type: image.type === 'audio' ? 'image' : image.type as 'image' | 'video'
        };
        setMedia(prev => [...prev, mediaAsset]);
        speak('Photo selected successfully');
        Vibration.vibrate(100);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
      speak('Failed to select photo');
    }
  };

  const removeMedia = (index: number) => {
    hapticFeedback('light');
    speak('Removing photo');
    setMedia(prev => prev.filter((_, i) => i !== index));
  };

  const selectHazardType = (type: string) => {
    hapticFeedback('medium');
    setHazardType(type);
    setShowHazardTypes(false);
    const selectedType = hazardTypes.find(t => t.id === type);
    speak(`Selected ${selectedType?.label}`);
  };

  const selectSeverity = (level: string) => {
    hapticFeedback('medium');
    setSeverity(level as any);
    setShowSeverity(false);
    const selectedLevel = severityLevels.find(s => s.id === level);
    speak(`Selected ${selectedLevel?.label} severity`);
  };

  const submitReport = async () => {
    if (!title.trim() || !description.trim() || !hazardType) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      speak('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    hapticFeedback('heavy');
    speak(reportType === 'warning' ? 'Issuing warning' : 'Submitting report');

    try {
      const data = {
        title: title.trim(),
        description: description.trim(),
        type: hazardType,
        severity,
        location: location || currentLocation,
        media: media.map(m => ({
          uri: m.uri,
          type: m.type,
          base64: m.base64
        })),
        userId: user?.id,
      };

      let response;
      if (reportType === 'warning') {
        response = await apiService.createWarning(data);
      } else {
        response = await apiService.createReport(data);
      }
      
      Vibration.vibrate([0, 200, 100, 200]);
      const successMessage = reportType === 'warning' 
        ? 'Warning issued successfully' 
        : 'Report submitted successfully';
      speak(successMessage);
      
      const alertTitle = reportType === 'warning' ? 'Warning Issued' : 'Report Submitted';
      const alertMessage = reportType === 'warning' 
        ? 'Your warning has been issued successfully. The community will be notified immediately.'
        : 'Your hazard report has been submitted successfully. Emergency services have been notified.';
      
      Alert.alert(
        alertTitle, 
        alertMessage,
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setTitle('');
              setDescription('');
              setHazardType('');
              setSeverity('medium');
              setMedia([]);
              setReportType('report');
            }
          }
        ]
      );
    } catch (error) {
      console.error(`Error ${reportType === 'warning' ? 'issuing warning' : 'submitting report'}:`, error);
      const errorMessage = reportType === 'warning' 
        ? 'Failed to issue warning. Please try again.' 
        : 'Failed to submit report. Please try again.';
      speak(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const getSelectedHazardType = () => {
    return hazardTypes.find(t => t.id === hazardType);
  };

  const getSelectedSeverity = () => {
    return severityLevels.find(s => s.id === severity);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#1e40af', '#3b82f6']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.headerTitle}>Report Hazard</Text>
          <Text style={styles.headerSubtitle}>Help keep your community safe</Text>
        </LinearGradient>

        {/* Form */}
        <View style={styles.form}>
          {/* Report Type Selection - Only for Marine Workers */}
          {user?.role === 'marine_worker' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Type of Submission *</Text>
              <TouchableOpacity
                style={styles.selector}
                onPress={() => setShowReportType(!showReportType)}
                accessible={true}
                accessibilityLabel="Select report type"
                accessibilityRole="button"
              >
                <Text style={[styles.selectorText, { fontSize: getFontSize() }]}>
                  {reportType === 'report' ? '📋 Report Hazard' : '⚠️ Issue Warning'}
                </Text>
                <Ionicons 
                  name={showReportType ? 'chevron-up' : 'chevron-down'} 
                  size={20} 
                  color="#6b7280" 
                />
              </TouchableOpacity>
              
              {showReportType && (
                <View style={styles.optionsContainer}>
                  <TouchableOpacity
                    style={[
                      styles.optionItem,
                      reportType === 'report' && styles.selectedOption
                    ]}
                    onPress={() => {
                      setReportType('report');
                      setShowReportType(false);
                      hapticFeedback('light');
                      speak('Report hazard selected');
                    }}
                    accessible={true}
                    accessibilityLabel="Report hazard"
                    accessibilityRole="button"
                  >
                    <Text style={styles.optionText}>📋 Report Hazard</Text>
                    <Text style={styles.optionDescription}>Report an existing hazard or incident</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.optionItem,
                      reportType === 'warning' && styles.selectedOption
                    ]}
                    onPress={() => {
                      setReportType('warning');
                      setShowReportType(false);
                      hapticFeedback('light');
                      speak('Issue warning selected');
                    }}
                    accessible={true}
                    accessibilityLabel="Issue warning"
                    accessibilityRole="button"
                  >
                    <Text style={styles.optionText}>⚠️ Issue Warning</Text>
                    <Text style={styles.optionDescription}>Issue an official warning to the community</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* Title */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Brief description of the hazard"
              placeholderTextColor="#9ca3af"
              accessible={true}
              accessibilityLabel="Hazard title input"
            />
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Provide detailed information about the hazard..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              accessible={true}
              accessibilityLabel="Hazard description input"
            />
          </View>

          {/* Hazard Type */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hazard Type *</Text>
            <TouchableOpacity
              style={styles.selector}
              onPress={() => {
                setShowHazardTypes(!showHazardTypes);
                hapticFeedback('light');
                speak('Select hazard type');
              }}
              accessible={true}
              accessibilityLabel="Select hazard type"
            >
              <View style={styles.selectorContent}>
                {getSelectedHazardType() ? (
                  <View style={styles.selectedOption}>
                    <Ionicons 
                      name={getSelectedHazardType()?.icon as any} 
                      size={20} 
                      color={getSelectedHazardType()?.color} 
                    />
                    <Text style={styles.selectedText}>{getSelectedHazardType()?.label}</Text>
                  </View>
                ) : (
                  <Text style={styles.placeholderText}>Select hazard type</Text>
                )}
                <Ionicons name="chevron-down" size={20} color="#6b7280" />
              </View>
            </TouchableOpacity>

            {showHazardTypes && (
              <View style={styles.optionsList}>
                {hazardTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={styles.optionItem}
                    onPress={() => selectHazardType(type.id)}
                    accessible={true}
                    accessibilityLabel={`Select ${type.label}`}
                  >
                    <View style={styles.optionContent}>
                      <Ionicons name={type.icon as any} size={20} color={type.color} />
                      <View style={styles.optionText}>
                        <Text style={styles.optionLabel}>{type.label}</Text>
                        <Text style={styles.optionDescription}>{type.description}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Severity */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Severity Level *</Text>
            <TouchableOpacity
              style={styles.selector}
              onPress={() => {
                setShowSeverity(!showSeverity);
                hapticFeedback('light');
                speak('Select severity level');
              }}
              accessible={true}
              accessibilityLabel="Select severity level"
            >
              <View style={styles.selectorContent}>
                {getSelectedSeverity() ? (
                  <View style={styles.selectedOption}>
                    <View style={[styles.severityDot, { backgroundColor: getSelectedSeverity()?.color }]} />
                    <Text style={styles.selectedText}>{getSelectedSeverity()?.label}</Text>
                  </View>
                ) : (
                  <Text style={styles.placeholderText}>Select severity level</Text>
                )}
                <Ionicons name="chevron-down" size={20} color="#6b7280" />
              </View>
            </TouchableOpacity>

            {showSeverity && (
              <View style={styles.optionsList}>
                {severityLevels.map((level) => (
                  <TouchableOpacity
                    key={level.id}
                    style={styles.optionItem}
                    onPress={() => selectSeverity(level.id)}
                    accessible={true}
                    accessibilityLabel={`Select ${level.label} severity`}
                  >
                    <View style={styles.optionContent}>
                      <View style={[styles.severityDot, { backgroundColor: level.color }]} />
                      <View style={styles.optionText}>
                        <Text style={styles.optionLabel}>{level.label}</Text>
                        <Text style={styles.optionDescription}>{level.description}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Media Upload */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Photos/Videos</Text>
            <View style={styles.mediaContainer}>
              <TouchableOpacity
                style={styles.mediaButton}
                onPress={takePhoto}
                accessible={true}
                accessibilityLabel="Take photo"
              >
                <LinearGradient
                  colors={['#3b82f6', '#1d4ed8']}
                  style={styles.mediaButtonGradient}
                >
                  <Ionicons name="camera" size={24} color="white" />
                  <Text style={styles.mediaButtonText}>Take Photo</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.mediaButton}
                onPress={pickImage}
                accessible={true}
                accessibilityLabel="Select from gallery"
              >
                <LinearGradient
                  colors={['#10b981', '#059669']}
                  style={styles.mediaButtonGradient}
                >
                  <Ionicons name="images" size={24} color="white" />
                  <Text style={styles.mediaButtonText}>Gallery</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Media Preview */}
            {media.length > 0 && (
              <View style={styles.mediaPreview}>
                {media.map((item, index) => (
                  <View key={index} style={styles.mediaItem}>
                    <Image source={{ uri: item.uri }} style={styles.mediaImage} />
                    <TouchableOpacity
                      style={styles.removeMediaButton}
                      onPress={() => removeMedia(index)}
                      accessible={true}
                      accessibilityLabel="Remove photo"
                    >
                      <Ionicons name="close-circle" size={24} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Location */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={20} color="#3b82f6" />
              <Text style={styles.locationText}>
                {location 
                  ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
                  : 'Getting current location...'
                }
              </Text>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
            onPress={submitReport}
            disabled={submitting}
            accessible={true}
            accessibilityLabel="Submit hazard report"
          >
            <LinearGradient
              colors={submitting ? ['#9ca3af', '#6b7280'] : ['#dc2626', '#ef4444']}
              style={styles.submitButtonGradient}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Ionicons name="send" size={24} color="white" />
              )}
              <Text style={styles.submitButtonText}>
                {submitting 
                  ? (reportType === 'warning' ? 'Issuing Warning...' : 'Submitting...') 
                  : (reportType === 'warning' ? 'Issue Warning' : 'Submit Report')
                }
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: typography.fontFamily.bold,
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  optionsContainer: {
    marginTop: spacing.sm,
    backgroundColor: '#f8fafc',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  optionItem: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  selectedOption: {
    backgroundColor: '#dbeafe',
  },
  optionText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
    color: '#1e293b',
    marginBottom: 4,
  },
  label: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  textArea: {
    height: 100,
  },
  selector: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  selectorText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.medium,
    color: '#374151',
  },
  selectedText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 8,
  },
  placeholderText: {
    fontSize: 16,
    color: '#9ca3af',
    flex: 1,
  },
  optionsList: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionLabel: {
    fontSize: 16,
    fontFamily: typography.fontFamily.medium,
    color: '#374151',
  },
  optionDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  severityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  mediaContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  mediaButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mediaButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  mediaButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
  },
  mediaPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  mediaItem: {
    position: 'relative',
  },
  mediaImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeMediaButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  locationText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 8,
    flex: 1,
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
  },
});

export default ReportScreen;