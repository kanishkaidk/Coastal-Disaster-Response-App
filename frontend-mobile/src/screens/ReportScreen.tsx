import React, { useState, useEffect, useRef } from 'react';
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
  Vibration,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Modal
} from 'react-native';
// Note: DateTimePickerAndroid is part of React Native core on Android
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '../stores/appStore';
import { useAuthStore } from '../stores/authStore';
import { useAccessibilityStore } from '../stores/accessibilityStore';
import { typography, spacing, borderRadius, colors, shadows } from '../theme/theme';
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
  const [location, setLocation] = useState<{latitude: number; longitude: number; accuracy?: number} | null>(null);
  const [showHazardTypes, setShowHazardTypes] = useState(false);
  const [showSeverity, setShowSeverity] = useState(false);
  const [reportType, setReportType] = useState<'report' | 'warning'>('report');
  const [showReportType, setShowReportType] = useState(false);
  
  // Enhanced location features
  const [address, setAddress] = useState<string>('');
  const [locationAccuracy, setLocationAccuracy] = useState<'high' | 'medium' | 'low'>('medium');
  const [isManualLocation, setIsManualLocation] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  
  // Manual location input
  const [manualLatitude, setManualLatitude] = useState<string>('');
  const [manualLongitude, setManualLongitude] = useState<string>('');
  const [manualAddress, setManualAddress] = useState<string>('');
  
  // Time picker features
  const [hazardTime, setHazardTime] = useState<Date>(new Date());
  const [showTimePickerModal, setShowTimePickerModal] = useState(false);
  const [isRealTimeReport, setIsRealTimeReport] = useState(true);
  
  // Form validation state
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [touched, setTouched] = useState<{[key: string]: boolean}>({});
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const cardAnimations = useRef<{[key: string]: Animated.Value}>({}).current;

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
    
    // Animate screen entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate cards with staggered delay
    setTimeout(() => {
      animateCard('reportType', 0);
      animateCard('title', 100);
      animateCard('description', 200);
      animateCard('hazardType', 300);
      animateCard('severity', 400);
      animateCard('time', 500);
      animateCard('media', 600);
      animateCard('location', 700);
      animateCard('submit', 800);
    }, 400);
  }, []);

  // Initialize manual location with current location
  useEffect(() => {
    if (location && !isManualLocation) {
      setManualLatitude(location.latitude.toString());
      setManualLongitude(location.longitude.toString());
    }
  }, [location, isManualLocation]);

  // Create card animation
  const getCardAnimation = (cardId: string) => {
    if (!cardAnimations[cardId]) {
      cardAnimations[cardId] = new Animated.Value(0);
    }
    return cardAnimations[cardId];
  };

  // Animate card entrance
  const animateCard = (cardId: string, delay: number = 0) => {
    const animValue = getCardAnimation(cardId);
    Animated.timing(animValue, {
      toValue: 1,
      duration: 400,
      delay: delay,
      useNativeDriver: true,
    }).start();
  };

  // Form validation
  const validateField = (field: string, value: string) => {
    let error = '';
    
    switch (field) {
      case 'title':
        if (!value.trim()) {
          error = 'Title is required';
        } else if (value.trim().length < 5) {
          error = 'Title must be at least 5 characters';
        }
        break;
      case 'description':
        if (!value.trim()) {
          error = 'Description is required';
        } else if (value.trim().length < 20) {
          error = 'Description must be at least 20 characters';
        }
        break;
      case 'hazardType':
        if (!value) {
          error = 'Please select a hazard type';
        }
        break;
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
    return error === '';
  };

  const validateForm = () => {
    const titleValid = validateField('title', title);
    const descriptionValid = validateField('description', description);
    const hazardTypeValid = validateField('hazardType', hazardType);
    
    return titleValid && descriptionValid && hazardTypeValid;
  };

  const handleFieldChange = (field: string, value: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    switch (field) {
      case 'title':
        setTitle(value);
        break;
      case 'description':
        setDescription(value);
        break;
    }
    
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await locationService.getCurrentLocation();
      if (location) {
        setLocation({ 
          latitude: location.latitude, 
          longitude: location.longitude,
          accuracy: location.accuracy 
        });
        setCurrentLocation(location);
        
        // Assess location accuracy
        if (location.accuracy) {
          if (location.accuracy <= 10) {
            setLocationAccuracy('high');
          } else if (location.accuracy <= 50) {
            setLocationAccuracy('medium');
          } else {
            setLocationAccuracy('low');
          }
        }
        
        // Get reverse geocoded address
        try {
          const address = await locationService.reverseGeocode(location.latitude, location.longitude);
          setAddress(address);
        } catch (geocodeError) {
          console.error('Error reverse geocoding:', geocodeError);
          setAddress(`${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`);
        }
        
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
    // Mark all fields as touched for validation
    setTouched({
      title: true,
      description: true,
      hazardType: true,
    });

    if (!validateForm()) {
      Alert.alert('Missing Information', 'Please fill in all required fields correctly.');
      speak('Please fill in all required fields correctly');
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
        address: address,
        locationAccuracy: locationAccuracy,
        hazardTime: hazardTime.toISOString(),
        isRealTimeReport,
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
              setAddress('');
              setLocationAccuracy('medium');
              setIsManualLocation(false);
              setManualLatitude('');
              setManualLongitude('');
              setManualAddress('');
              setHazardTime(new Date());
              setIsRealTimeReport(true);
              setErrors({});
              setTouched({});
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

  // Time picker functions
  const showDateTimePicker = () => {
    setShowTimePickerModal(true);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setHazardTime(selectedDate);
      setIsRealTimeReport(false);
    }
    setShowTimePickerModal(false);
  };

  const showDatePicker = () => {
    if (Platform.OS === 'android') {
      const DateTimePicker = require('@react-native-community/datetimepicker').default;
      DateTimePicker.open({
        value: hazardTime,
        mode: 'date',
        is24Hour: true,
        onChange: handleDateChange,
      });
    }
  };

  const showTimePicker = () => {
    if (Platform.OS === 'android') {
      const DateTimePicker = require('@react-native-community/datetimepicker').default;
      DateTimePicker.open({
        value: hazardTime,
        mode: 'time',
        is24Hour: true,
        onChange: handleDateChange,
      });
    }
  };

  const getAccuracyColor = (accuracy: 'high' | 'medium' | 'low') => {
    switch (accuracy) {
      case 'high': return colors.success;
      case 'medium': return colors.warning;
      case 'low': return colors.emergency;
      default: return colors.gray500;
    }
  };

  const getAccuracyIcon = (accuracy: 'high' | 'medium' | 'low') => {
    switch (accuracy) {
      case 'high': return 'checkmark-circle';
      case 'medium': return 'warning';
      case 'low': return 'alert-circle';
      default: return 'help-circle';
    }
  };

  const getAccuracyText = (accuracy: 'high' | 'medium' | 'low') => {
    switch (accuracy) {
      case 'high': return 'High Accuracy';
      case 'medium': return 'Medium Accuracy';
      case 'low': return 'Low Accuracy';
      default: return 'Unknown Accuracy';
    }
  };

  const formatHazardTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  // Manual location functions
  const handleManualLocationInput = async () => {
    const lat = parseFloat(manualLatitude);
    const lng = parseFloat(manualLongitude);
    
    if (isNaN(lat) || isNaN(lng)) {
      Alert.alert('Invalid Coordinates', 'Please enter valid latitude and longitude values.');
      return;
    }
    
    if (lat < -90 || lat > 90) {
      Alert.alert('Invalid Latitude', 'Latitude must be between -90 and 90 degrees.');
      return;
    }
    
    if (lng < -180 || lng > 180) {
      Alert.alert('Invalid Longitude', 'Longitude must be between -180 and 180 degrees.');
      return;
    }
    
    try {
      const address = await locationService.reverseGeocode(lat, lng);
      setManualAddress(address);
    } catch (error) {
      console.error('Error reverse geocoding manual location:', error);
      setManualAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }
  };

  const confirmManualLocation = () => {
    const lat = parseFloat(manualLatitude);
    const lng = parseFloat(manualLongitude);
    
    if (isNaN(lat) || isNaN(lng)) {
      Alert.alert('Invalid Coordinates', 'Please enter valid latitude and longitude values.');
      return;
    }
    
    setLocation({ latitude: lat, longitude: lng });
    setAddress(manualAddress || `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    setIsManualLocation(true);
    setLocationAccuracy('high'); // Manual selection is considered high accuracy
    setShowLocationModal(false);
    speak('Manual location selected');
  };

  const resetToAutoLocation = () => {
    getCurrentLocation();
    setIsManualLocation(false);
    setManualLatitude('');
    setManualLongitude('');
    setManualAddress('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <Animated.View 
            style={[
              styles.headerContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ]
              }
            ]}
          >
            <LinearGradient
              colors={colors.gradients.ocean as any}
              style={styles.header}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.headerBackground}>
                <View style={styles.headerPattern} />
              </View>
              <View style={styles.headerContent}>
                <View style={styles.headerIconContainer}>
                  <View style={styles.headerIconBackground}>
                    <Ionicons 
                      name={reportType === 'warning' ? 'warning' : 'shield-checkmark'} 
                      size={28} 
                      color="white" 
                    />
                  </View>
                </View>
                <View style={styles.headerTextContainer}>
                  <Text style={styles.headerTitle}>
                    {reportType === 'warning' ? 'Issue Warning' : 'Report Hazard'}
                  </Text>
                  <Text style={styles.headerSubtitle}>
                    {reportType === 'warning' 
                      ? 'Alert the community about potential dangers' 
                      : 'Help keep your community safe'
                    }
                  </Text>
                  <View style={styles.headerStatus}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>Ready to submit</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Form */}
          <Animated.View 
            style={[
              styles.form,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {/* Report Type Selection - Only for Marine Workers */}
            {user?.role === 'marine_worker' && (
              <Animated.View 
                style={[
                  styles.card,
                  {
                    opacity: getCardAnimation('reportType'),
                    transform: [
                      {
                        translateY: getCardAnimation('reportType').interpolate({
                          inputRange: [0, 1],
                          outputRange: [30, 0],
                        }),
                      },
                      {
                        scale: getCardAnimation('reportType').interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.95, 1],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={styles.cardHeader}>
                  <Ionicons name="document-text" size={20} color={colors.primary} />
                  <Text style={styles.cardTitle}>Type of Submission</Text>
                  <Text style={styles.required}>*</Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.selector,
                    errors.reportType && touched.reportType && styles.inputError
                  ]}
                  onPress={() => setShowReportType(!showReportType)}
                  accessible={true}
                  accessibilityLabel="Select report type"
                  accessibilityRole="button"
                >
                  <View style={styles.selectorContent}>
                    <View style={styles.selectorLeft}>
                      <Ionicons 
                        name={reportType === 'report' ? 'document-text' : 'warning'} 
                        size={20} 
                        color={colors.primary} 
                      />
                      <Text style={[styles.selectorText, { fontSize: getFontSize() }]}>
                        {reportType === 'report' ? 'Report Hazard' : 'Issue Warning'}
                      </Text>
                    </View>
                    <Ionicons 
                      name={showReportType ? 'chevron-up' : 'chevron-down'} 
                      size={20} 
                      color={colors.gray500} 
                    />
                  </View>
                </TouchableOpacity>
              
              {showReportType && (
                <View style={styles.optionsList}>
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
                    <View style={styles.optionContent}>
                      <Ionicons name="document-text" size={20} color={colors.primary} />
                      <View style={styles.optionTextContainer}>
                        <Text style={styles.optionLabel}>Report Hazard</Text>
                        <Text style={styles.optionDescription}>Report an existing hazard or incident</Text>
                      </View>
                      {reportType === 'report' && (
                        <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                      )}
                    </View>
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
                    <View style={styles.optionContent}>
                      <Ionicons name="warning" size={20} color={colors.emergency} />
                      <View style={styles.optionTextContainer}>
                        <Text style={styles.optionLabel}>Issue Warning</Text>
                        <Text style={styles.optionDescription}>Issue an official warning to the community</Text>
                      </View>
                      {reportType === 'warning' && (
                        <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              </Animated.View>
            )}

            {/* Title */}
            <Animated.View 
              style={[
                styles.card,
                {
                  opacity: getCardAnimation('title'),
                  transform: [
                    {
                      translateY: getCardAnimation('title').interpolate({
                        inputRange: [0, 1],
                        outputRange: [30, 0],
                      }),
                    },
                    {
                      scale: getCardAnimation('title').interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.95, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.cardHeader}>
                <Ionicons name="text" size={20} color={colors.primary} />
                <Text style={styles.cardTitle}>Title</Text>
                <Text style={styles.required}>*</Text>
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    errors.title && touched.title && styles.inputError,
                    title.length > 0 && styles.inputFocused
                  ]}
                  value={title}
                  onChangeText={(value) => handleFieldChange('title', value)}
                  placeholder="Brief description of the hazard"
                  placeholderTextColor={colors.gray400}
                  accessible={true}
                  accessibilityLabel="Hazard title input"
                />
                <View style={styles.inputIcon}>
                  <Ionicons 
                    name="create-outline" 
                    size={16} 
                    color={title.length > 0 ? colors.primary : colors.gray400} 
                  />
                </View>
              </View>
              {errors.title && touched.title && (
                <Text style={styles.errorText}>{errors.title}</Text>
              )}
            </Animated.View>

            {/* Description */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="document-text" size={20} color={colors.primary} />
                <Text style={styles.cardTitle}>Description</Text>
                <Text style={styles.required}>*</Text>
              </View>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  errors.description && touched.description && styles.inputError
                ]}
                value={description}
                onChangeText={(value) => handleFieldChange('description', value)}
                placeholder="Provide detailed information about the hazard..."
                placeholderTextColor={colors.gray400}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                accessible={true}
                accessibilityLabel="Hazard description input"
              />
              {errors.description && touched.description && (
                <Text style={styles.errorText}>{errors.description}</Text>
              )}
              <Text style={styles.characterCount}>
                {description.length}/500 characters
              </Text>
            </View>

            {/* Hazard Type */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="warning" size={20} color={colors.primary} />
                <Text style={styles.cardTitle}>Hazard Type</Text>
                <Text style={styles.required}>*</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.selector,
                  errors.hazardType && touched.hazardType && styles.inputError
                ]}
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
                    <View style={styles.selectorLeft}>
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
                  <Ionicons name="chevron-down" size={20} color={colors.gray500} />
                </View>
              </TouchableOpacity>
              {errors.hazardType && touched.hazardType && (
                <Text style={styles.errorText}>{errors.hazardType}</Text>
              )}

              {showHazardTypes && (
                <View style={styles.optionsList}>
                  {hazardTypes.map((type) => (
                    <TouchableOpacity
                      key={type.id}
                      style={[
                        styles.optionItem,
                        hazardType === type.id && styles.selectedOption
                      ]}
                      onPress={() => selectHazardType(type.id)}
                      accessible={true}
                      accessibilityLabel={`Select ${type.label}`}
                    >
                      <View style={styles.optionContent}>
                        <Ionicons name={type.icon as any} size={20} color={type.color} />
                        <View style={styles.optionTextContainer}>
                          <Text style={styles.optionLabel}>{type.label}</Text>
                          <Text style={styles.optionDescription}>{type.description}</Text>
                        </View>
                        {hazardType === type.id && (
                          <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Severity */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="alert-circle" size={20} color={colors.primary} />
                <Text style={styles.cardTitle}>Severity Level</Text>
                <Text style={styles.required}>*</Text>
              </View>
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
                    <View style={styles.selectorLeft}>
                      <View style={[styles.severityDot, { backgroundColor: getSelectedSeverity()?.color }]} />
                      <Text style={styles.selectedText}>{getSelectedSeverity()?.label}</Text>
                    </View>
                  ) : (
                    <Text style={styles.placeholderText}>Select severity level</Text>
                  )}
                  <Ionicons name="chevron-down" size={20} color={colors.gray500} />
                </View>
              </TouchableOpacity>

              {showSeverity && (
                <View style={styles.optionsList}>
                  {severityLevels.map((level) => (
                    <TouchableOpacity
                      key={level.id}
                      style={[
                        styles.optionItem,
                        severity === level.id && styles.selectedOption
                      ]}
                      onPress={() => selectSeverity(level.id)}
                      accessible={true}
                      accessibilityLabel={`Select ${level.label} severity`}
                    >
                      <View style={styles.optionContent}>
                        <View style={[styles.severityDot, { backgroundColor: level.color }]} />
                        <View style={styles.optionTextContainer}>
                          <Text style={styles.optionLabel}>{level.label}</Text>
                          <Text style={styles.optionDescription}>{level.description}</Text>
                        </View>
                        {severity === level.id && (
                          <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Time of Hazard Observation */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="time" size={20} color={colors.primary} />
                <Text style={styles.cardTitle}>Time of Hazard Observation</Text>
                <Text style={styles.optional}>(Optional)</Text>
              </View>
              
              <View style={styles.timeContainer}>
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => setShowTimePickerModal(true)}
                  accessible={true}
                  accessibilityLabel="Select hazard observation time"
                >
                  <View style={styles.timeButtonContent}>
                    <Ionicons name="calendar" size={20} color={colors.primary} />
                    <View style={styles.timeTextContainer}>
                      <Text style={styles.timeLabel}>
                        {isRealTimeReport ? 'Real-time Report' : 'Custom Time'}
                      </Text>
                      <Text style={styles.timeValue}>
                        {isRealTimeReport ? 'Just now' : formatHazardTime(hazardTime)}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.gray500} />
                  </View>
                </TouchableOpacity>
                
                {!isRealTimeReport && (
                  <TouchableOpacity
                    style={styles.realTimeButton}
                    onPress={() => {
                      setIsRealTimeReport(true);
                      setHazardTime(new Date());
                    }}
                    accessible={true}
                    accessibilityLabel="Switch to real-time report"
                  >
                    <Ionicons name="refresh" size={16} color={colors.primary} />
                    <Text style={styles.realTimeButtonText}>Use Current Time</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Media Upload */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="camera" size={20} color={colors.primary} />
                <Text style={styles.cardTitle}>Photos/Videos</Text>
                <Text style={styles.optional}>(Optional)</Text>
              </View>
              <View style={styles.mediaContainer}>
                <TouchableOpacity
                  style={styles.mediaButton}
                  onPress={takePhoto}
                  accessible={true}
                  accessibilityLabel="Take photo"
                >
                  <LinearGradient
                    colors={colors.gradients.primary as any}
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
                    colors={colors.gradients.success as any}
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
                  <Text style={styles.mediaPreviewTitle}>Selected Media ({media.length})</Text>
                  <View style={styles.mediaGrid}>
                    {media.map((item, index) => (
                      <View key={index} style={styles.mediaItem}>
                        <Image source={{ uri: item.uri }} style={styles.mediaImage} />
                        <TouchableOpacity
                          style={styles.removeMediaButton}
                          onPress={() => removeMedia(index)}
                          accessible={true}
                          accessibilityLabel="Remove photo"
                        >
                          <Ionicons name="close-circle" size={20} color={colors.emergency} />
                        </TouchableOpacity>
                        <View style={styles.mediaTypeIndicator}>
                          <Ionicons 
                            name={item.type === 'video' ? 'play-circle' : 'image'} 
                            size={16} 
                            color="white" 
                          />
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>

            {/* Location */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="location" size={20} color={colors.primary} />
                <Text style={styles.cardTitle}>Location</Text>
                <Text style={styles.optional}>
                  {isManualLocation ? '(Manual)' : '(Auto-detected)'}
                </Text>
              </View>
              
              <View style={styles.locationContainer}>
                <Ionicons name="location" size={20} color={colors.primary} />
                <View style={styles.locationTextContainer}>
                  <Text style={styles.locationText}>
                    {address || (location 
                      ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
                      : 'Getting current location...'
                    )}
                  </Text>
                  {location && (
                    <View style={styles.locationAccuracyContainer}>
                      <Ionicons 
                        name={getAccuracyIcon(locationAccuracy)} 
                        size={14} 
                        color={getAccuracyColor(locationAccuracy)} 
                      />
                      <Text style={[
                        styles.locationAccuracyText,
                        { color: getAccuracyColor(locationAccuracy) }
                      ]}>
                        {getAccuracyText(locationAccuracy)}
                      </Text>
                    </View>
                  )}
                </View>
                {!location && (
                  <ActivityIndicator size="small" color={colors.primary} />
                )}
              </View>
              
              <View style={styles.locationActions}>
                <TouchableOpacity
                  style={styles.locationActionButton}
                  onPress={() => setShowLocationModal(true)}
                  accessible={true}
                  accessibilityLabel="Set manual location"
                >
                  <Ionicons name="map" size={16} color={colors.primary} />
                  <Text style={styles.locationActionText}>
                    {isManualLocation ? 'Change Location' : 'Set Manual Location'}
                  </Text>
                </TouchableOpacity>
                
                {isManualLocation ? (
                  <TouchableOpacity
                    style={styles.locationActionButton}
                    onPress={resetToAutoLocation}
                    accessible={true}
                    accessibilityLabel="Reset to auto location"
                  >
                    <Ionicons name="refresh" size={16} color={colors.primary} />
                    <Text style={styles.locationActionText}>Use Auto Location</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.locationActionButton}
                    onPress={getCurrentLocation}
                    accessible={true}
                    accessibilityLabel="Refresh location"
                  >
                    <Ionicons name="refresh" size={16} color={colors.primary} />
                    <Text style={styles.locationActionText}>Refresh</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Submit Button */}
            <Animated.View
              style={[
                styles.submitButtonContainer,
                {
                  opacity: getCardAnimation('submit'),
                  transform: [
                    {
                      translateY: getCardAnimation('submit').interpolate({
                        inputRange: [0, 1],
                        outputRange: [30, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <TouchableOpacity
                style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
                onPress={submitReport}
                disabled={submitting}
                accessible={true}
                accessibilityLabel="Submit hazard report"
              >
                <LinearGradient
                  colors={submitting 
                    ? [colors.gray400, colors.gray500] 
                    : reportType === 'warning' 
                      ? colors.gradients.emergency as any
                      : colors.gradients.primary as any
                  }
                  style={styles.submitButtonGradient}
                >
                  <View style={styles.submitButtonContent}>
                    {submitting ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <View style={styles.submitButtonIcon}>
                        <Ionicons 
                          name={reportType === 'warning' ? 'warning' : 'send'} 
                          size={24} 
                          color="white" 
                        />
                      </View>
                    )}
                    <View style={styles.submitButtonTextContainer}>
                      <Text style={styles.submitButtonText}>
                        {submitting 
                          ? (reportType === 'warning' ? 'Issuing Warning...' : 'Submitting...') 
                          : (reportType === 'warning' ? 'Issue Warning' : 'Submit Report')
                        }
                      </Text>
                      <Text style={styles.submitButtonSubtext}>
                        {submitting 
                          ? 'Please wait...' 
                          : 'Tap to submit your report'
                        }
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </ScrollView>
        
        {/* Time Picker Modal */}
        <Modal
          visible={showTimePickerModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowTimePickerModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Hazard Observation Time</Text>
                <TouchableOpacity
                  onPress={() => setShowTimePickerModal(false)}
                  style={styles.modalCloseButton}
                >
                  <Ionicons name="close" size={24} color={colors.gray600} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.timePickerContainer}>
                <TouchableOpacity
                  style={styles.timeOption}
                  onPress={() => {
                    setIsRealTimeReport(true);
                    setHazardTime(new Date());
                    setShowTimePickerModal(false);
                  }}
                >
                  <Ionicons name="radio-button-on" size={20} color={isRealTimeReport ? colors.primary : colors.gray400} />
                  <View style={styles.timeOptionText}>
                    <Text style={styles.timeOptionTitle}>Real-time Report</Text>
                    <Text style={styles.timeOptionDescription}>Hazard observed just now</Text>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.timeOption}
                  onPress={() => {
                    setIsRealTimeReport(false);
                    setShowTimePickerModal(false);
                  }}
                >
                  <Ionicons name="radio-button-on" size={20} color={!isRealTimeReport ? colors.primary : colors.gray400} />
                  <View style={styles.timeOptionText}>
                    <Text style={styles.timeOptionTitle}>Custom Time</Text>
                    <Text style={styles.timeOptionDescription}>Hazard observed at a specific time</Text>
                  </View>
                </TouchableOpacity>
                
                {!isRealTimeReport && (
                  <View style={styles.customTimeContainer}>
                    <View style={styles.currentTimeDisplay}>
                      <Ionicons name="time" size={20} color={colors.primary} />
                      <Text style={styles.currentTimeText}>
                        {formatHazardTime(hazardTime)}
                      </Text>
                    </View>
                    
                    <View style={styles.timePickerButtons}>
                      <TouchableOpacity
                        style={styles.timePickerButton}
                        onPress={showDatePicker}
                      >
                        <Ionicons name="calendar" size={20} color={colors.primary} />
                        <Text style={styles.timePickerButtonText}>Select Date</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={styles.timePickerButton}
                        onPress={showTimePicker}
                      >
                        <Ionicons name="time" size={20} color={colors.primary} />
                        <Text style={styles.timePickerButtonText}>Select Time</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </View>
        </Modal>
        
        {/* Manual Location Input Modal */}
        <Modal
          visible={showLocationModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowLocationModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Set Manual Location</Text>
                <TouchableOpacity
                  onPress={() => setShowLocationModal(false)}
                  style={styles.modalCloseButton}
                >
                  <Ionicons name="close" size={24} color={colors.gray600} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.manualLocationContent}>
                <Text style={styles.manualLocationDescription}>
                  Enter the exact coordinates of the hazard location
                </Text>
                
                <View style={styles.coordinateInputs}>
                  <View style={styles.coordinateInputGroup}>
                    <Text style={styles.coordinateLabel}>Latitude</Text>
                    <TextInput
                      style={styles.coordinateInput}
                      value={manualLatitude}
                      onChangeText={setManualLatitude}
                      placeholder="e.g., 19.0760"
                      placeholderTextColor={colors.gray400}
                      keyboardType="numeric"
                      accessible={true}
                      accessibilityLabel="Latitude input"
                    />
                  </View>
                  
                  <View style={styles.coordinateInputGroup}>
                    <Text style={styles.coordinateLabel}>Longitude</Text>
                    <TextInput
                      style={styles.coordinateInput}
                      value={manualLongitude}
                      onChangeText={setManualLongitude}
                      placeholder="e.g., 72.8777"
                      placeholderTextColor={colors.gray400}
                      keyboardType="numeric"
                      accessible={true}
                      accessibilityLabel="Longitude input"
                    />
                  </View>
                </View>
                
                <TouchableOpacity
                  style={styles.lookupButton}
                  onPress={handleManualLocationInput}
                  accessible={true}
                  accessibilityLabel="Look up address for coordinates"
                >
                  <Ionicons name="search" size={20} color="white" />
                  <Text style={styles.lookupButtonText}>Look Up Address</Text>
                </TouchableOpacity>
                
                {manualAddress && (
                  <View style={styles.addressPreview}>
                    <Ionicons name="location" size={20} color={colors.primary} />
                    <Text style={styles.addressPreviewText}>{manualAddress}</Text>
                  </View>
                )}
                
                <View style={styles.manualLocationActions}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setShowLocationModal(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={confirmManualLocation}
                  >
                    <Ionicons name="checkmark" size={20} color="white" />
                    <Text style={styles.confirmButtonText}>Confirm Location</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['2xl'],
  },
  headerContainer: {
    marginBottom: spacing.lg,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing['2xl'],
    paddingTop: spacing['3xl'],
    position: 'relative',
    overflow: 'hidden',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerPattern: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  headerIconContainer: {
    marginRight: spacing.md,
  },
  headerIconBackground: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: typography.fontSize['3xl'],
    fontFamily: typography.fontFamily.bold,
    color: 'white',
    marginBottom: spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.base,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: typography.lineHeight.normal * typography.fontSize.base,
    marginBottom: spacing.sm,
  },
  headerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginRight: spacing.xs,
  },
  statusText: {
    fontSize: typography.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: typography.fontFamily.medium,
  },
  form: {
    paddingHorizontal: spacing.lg,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.onSurface,
    marginLeft: spacing.sm,
    flex: 1,
  },
  required: {
    fontSize: typography.fontSize.lg,
    color: colors.emergency,
    fontWeight: 'bold',
  },
  optional: {
    fontSize: typography.fontSize.sm,
    color: colors.gray500,
    fontStyle: 'italic',
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    paddingRight: spacing['2xl'],
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    borderWidth: 1,
    borderColor: colors.gray200,
    color: colors.onSurface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputError: {
    borderColor: colors.emergency,
    borderWidth: 2,
    shadowColor: colors.emergency,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: {
    position: 'absolute',
    right: spacing.md,
    top: '50%',
    transform: [{ translateY: -8 }],
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: typography.fontSize.sm,
    color: colors.emergency,
    marginTop: spacing.xs,
    fontFamily: typography.fontFamily.medium,
  },
  characterCount: {
    fontSize: typography.fontSize.xs,
    color: colors.gray500,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  selector: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  selectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectorText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
    color: colors.onSurface,
    marginLeft: spacing.sm,
  },
  selectedText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
    color: colors.onSurface,
    marginLeft: spacing.sm,
  },
  placeholderText: {
    fontSize: typography.fontSize.base,
    color: colors.gray400,
    fontFamily: typography.fontFamily.regular,
  },
  optionsList: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.gray200,
    ...shadows.sm,
  },
  optionItem: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  selectedOption: {
    backgroundColor: colors.primaryLight + '20',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionTextContainer: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  optionLabel: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
    color: colors.onSurface,
    marginBottom: spacing.xs,
  },
  optionDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
    lineHeight: typography.lineHeight.normal * typography.fontSize.sm,
  },
  severityDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  mediaContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  mediaButton: {
    flex: 1,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  mediaButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  mediaButtonText: {
    color: 'white',
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
  },
  mediaPreview: {
    marginTop: spacing.md,
  },
  mediaPreviewTitle: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.gray600,
    marginBottom: spacing.sm,
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  mediaItem: {
    position: 'relative',
    width: 80,
    height: 80,
  },
  mediaImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
  },
  removeMediaButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.background,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  mediaTypeIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  locationText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.onSurface,
    marginLeft: spacing.sm,
    flex: 1,
  },
  submitButtonContainer: {
    marginTop: spacing.lg,
  },
  submitButton: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.lg,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonGradient: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  submitButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  submitButtonTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  submitButtonSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    textAlign: 'center',
  },
  // Time picker styles
  timeContainer: {
    gap: spacing.sm,
  },
  timeButton: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  timeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  timeTextContainer: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  timeLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.gray600,
    marginBottom: spacing.xs,
  },
  timeValue: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.onSurface,
  },
  realTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.primaryLight + '20',
    borderRadius: borderRadius.md,
  },
  realTimeButtonText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  // Enhanced location styles
  locationTextContainer: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  locationAccuracyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  locationAccuracyText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    marginLeft: spacing.xs,
  },
  locationActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  locationActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  locationActionText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    width: '100%',
    maxWidth: 400,
    ...shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  modalTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.onSurface,
    flex: 1,
  },
  modalCloseButton: {
    padding: spacing.xs,
  },
  timePickerContainer: {
    padding: spacing.lg,
  },
  timeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  timeOptionText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  timeOptionTitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
    color: colors.onSurface,
    marginBottom: spacing.xs,
  },
  timeOptionDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
  },
  customTimeContainer: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  currentTimeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
  },
  currentTimeText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
    color: colors.onSurface,
    marginLeft: spacing.sm,
  },
  timePickerButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  timePickerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primary + '10',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  timePickerButtonText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  locationModalContent: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  locationModalText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.onSurface,
    textAlign: 'center',
    lineHeight: typography.lineHeight.normal * typography.fontSize.base,
    marginBottom: spacing.lg,
  },
  locationModalButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  locationModalButtonText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: 'white',
  },
  // Manual location input styles
  manualLocationContent: {
    padding: spacing.lg,
  },
  manualLocationDescription: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.gray600,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: typography.lineHeight.normal * typography.fontSize.base,
  },
  coordinateInputs: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  coordinateInputGroup: {
    gap: spacing.xs,
  },
  coordinateLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.onSurface,
  },
  coordinateInput: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    borderWidth: 1,
    borderColor: colors.gray200,
    color: colors.onSurface,
  },
  lookupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  lookupButtonText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: 'white',
  },
  addressPreview: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.gray200,
    marginBottom: spacing.lg,
  },
  addressPreviewText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.onSurface,
    marginLeft: spacing.sm,
    flex: 1,
    lineHeight: typography.lineHeight.normal * typography.fontSize.sm,
  },
  manualLocationActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  cancelButtonText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
    color: colors.gray600,
  },
  confirmButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  confirmButtonText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: 'white',
  },
});

export default ReportScreen;