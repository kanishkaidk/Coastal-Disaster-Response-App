import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useAccessibilityStore } from '../stores/accessibilityStore';
import { useAuthStore } from '../stores/authStore';
import { typography, spacing, borderRadius, colors } from '../theme/theme';
import { i18n } from '../services/i18n';

const { width } = Dimensions.get('window');

type OnboardingStep = 'language' | 'role' | 'emergency' | 'complete';

const OnboardingScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { speak, hapticFeedback, getFontSize } = useAccessibilityStore();
  const { user, updateUser } = useAuthStore();

  const [currentStep, setCurrentStep] = useState<OnboardingStep>('language');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedRole, setSelectedRole] = useState<'citizen' | 'marine_worker' | 'analyst' | 'moderator' | 'admin'>('citizen');
  const [emergencyContacts, setEmergencyContacts] = useState<Array<{ name: string; phone: string }>>([
    { name: '', phone: '' }
  ]);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸', region: 'Global' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳', region: 'North India' },
    { code: 'bn', name: 'বাংলা', flag: '🇮🇳', region: 'West Bengal' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳', region: 'Tamil Nadu' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳', region: 'Andhra Pradesh' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳', region: 'Maharashtra' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳', region: 'Gujarat' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳', region: 'Karnataka' },
    { code: 'ml', name: 'മലയാളം', flag: '🇮🇳', region: 'Kerala' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳', region: 'Punjab' },
    { code: 'or', name: 'ଓଡ଼ିଆ', flag: '🇮🇳', region: 'Odisha' },
    { code: 'as', name: 'অসমীয়া', flag: '🇮🇳', region: 'Assam' },
  ];

  const roles = [
    { key: 'citizen', name: 'Citizen', description: 'Report hazards and receive warnings', icon: 'person', color: '#3b82f6' },
    { key: 'marine_worker', name: 'Marine Worker', description: 'Issue warnings and monitor coastal areas', icon: 'boat', color: '#10b981' },
    { key: 'analyst', name: 'Analyst', description: 'Analyze data and provide insights', icon: 'analytics', color: '#8b5cf6' },
    { key: 'moderator', name: 'Moderator', description: 'Moderate content and ensure quality', icon: 'shield-checkmark', color: '#f59e0b' },
    { key: 'admin', name: 'Admin', description: 'Full system access and management', icon: 'settings', color: '#ef4444' },
  ];

  const handleLanguageSelect = (languageCode: string) => {
    hapticFeedback('light');
    speak(`Selected ${languages.find(l => l.code === languageCode)?.name}`);
    setSelectedLanguage(languageCode);
  };

  const handleRoleSelect = (role: typeof selectedRole) => {
    hapticFeedback('light');
    speak(`Selected ${roles.find(r => r.key === role)?.name}`);
    setSelectedRole(role);
  };

  const handleNext = () => {
    hapticFeedback('medium');
    speak('Next step');
    
    switch (currentStep) {
      case 'language':
        setCurrentStep('role');
        break;
      case 'role':
        setCurrentStep('emergency');
        break;
      case 'emergency':
        handleComplete();
        break;
    }
  };

  const handleSkip = () => {
    hapticFeedback('light');
    speak('Skipped');
    
    if (currentStep === 'emergency') {
      handleComplete();
    } else {
      handleNext();
    }
  };

  const handleComplete = async () => {
    try {
      // Update user with selected preferences
      await updateUser({
        language: selectedLanguage,
        role: selectedRole,
        emergencyContacts: emergencyContacts.filter(contact => contact.name && contact.phone),
      });

      // Change language
      await i18n.changeLanguage(selectedLanguage);
      
      hapticFeedback('success');
      speak('Setup complete! Welcome to Coast-Kavach');
      
      // Navigate to main tabs
      navigation.navigate('MainTabs' as never);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      Alert.alert('Error', 'Failed to save preferences. Please try again.');
    }
  };

  const addEmergencyContact = () => {
    setEmergencyContacts([...emergencyContacts, { name: '', phone: '' }]);
  };

  const removeEmergencyContact = (index: number) => {
    if (emergencyContacts.length > 1) {
      setEmergencyContacts(emergencyContacts.filter((_, i) => i !== index));
    }
  };

  const updateEmergencyContact = (index: number, field: 'name' | 'phone', value: string) => {
    const updated = [...emergencyContacts];
    updated[index][field] = value;
    setEmergencyContacts(updated);
  };

  const renderLanguageStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Ionicons name="language" size={48} color="white" />
        <Text style={styles.stepTitle}>Choose Your Language</Text>
        <Text style={styles.stepDescription}>
          Select your preferred language for the app interface
        </Text>
      </View>

      <ScrollView style={styles.optionsList} showsVerticalScrollIndicator={false}>
        {languages.map((language) => (
          <TouchableOpacity
            key={language.code}
            style={[
              styles.optionItem,
              selectedLanguage === language.code && styles.selectedOption
            ]}
            onPress={() => handleLanguageSelect(language.code)}
            accessible={true}
            accessibilityLabel={`Select ${language.name}`}
            accessibilityRole="button"
          >
            <Text style={styles.optionFlag}>{language.flag}</Text>
            <View style={styles.optionContent}>
              <Text style={styles.optionName}>{language.name}</Text>
              <Text style={styles.optionRegion}>{language.region}</Text>
            </View>
            {selectedLanguage === language.code && (
              <Ionicons name="checkmark-circle" size={24} color="white" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderRoleStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Ionicons name="person" size={48} color="white" />
        <Text style={styles.stepTitle}>Select Your Role</Text>
        <Text style={styles.stepDescription}>
          Choose your role to get personalized features
        </Text>
      </View>

      <ScrollView style={styles.optionsList} showsVerticalScrollIndicator={false}>
        {roles.map((role) => (
          <TouchableOpacity
            key={role.key}
            style={[
              styles.roleOption,
              selectedRole === role.key && styles.selectedRoleOption
            ]}
            onPress={() => handleRoleSelect(role.key as typeof selectedRole)}
            accessible={true}
            accessibilityLabel={`Select ${role.name}`}
            accessibilityRole="button"
          >
            <View style={[styles.roleIcon, { backgroundColor: role.color }]}>
              <Ionicons name={role.icon as any} size={24} color="white" />
            </View>
            <View style={styles.roleContent}>
              <Text style={styles.roleName}>{role.name}</Text>
              <Text style={styles.roleDescription}>{role.description}</Text>
            </View>
            {selectedRole === role.key && (
              <Ionicons name="checkmark-circle" size={24} color="white" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderEmergencyStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Ionicons name="call" size={48} color="white" />
        <Text style={styles.stepTitle}>Emergency Contacts</Text>
        <Text style={styles.stepDescription}>
          Add emergency contacts for quick access during disasters
        </Text>
      </View>

      <ScrollView style={styles.emergencyList} showsVerticalScrollIndicator={false}>
        {emergencyContacts.map((contact, index) => (
          <View key={index} style={styles.emergencyItem}>
            <View style={styles.emergencyInputs}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={contact.name}
                  onChangeText={(value) => updateEmergencyContact(index, 'name', value)}
                  placeholder="Enter name"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone</Text>
                <TextInput
                  style={styles.input}
                  value={contact.phone}
                  onChangeText={(value) => updateEmergencyContact(index, 'phone', value)}
                  placeholder="Enter phone number"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  keyboardType="phone-pad"
                />
              </View>
            </View>
            {emergencyContacts.length > 1 && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeEmergencyContact(index)}
                accessible={true}
                accessibilityLabel="Remove contact"
                accessibilityRole="button"
              >
                <Ionicons name="trash" size={20} color="#ef4444" />
              </TouchableOpacity>
            )}
          </View>
        ))}
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={addEmergencyContact}
          accessible={true}
          accessibilityLabel="Add emergency contact"
          accessibilityRole="button"
        >
          <Ionicons name="add-circle" size={24} color="white" />
          <Text style={styles.addButtonText}>Add Contact</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  const getStepTitle = () => {
    switch (currentStep) {
      case 'language': return 'Language Selection';
      case 'role': return 'Role Selection';
      case 'emergency': return 'Emergency Contacts';
      default: return 'Setup Complete';
    }
  };

  const getStepNumber = () => {
    switch (currentStep) {
      case 'language': return 1;
      case 'role': return 2;
      case 'emergency': return 3;
      default: return 3;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1e40af', '#3b82f6', '#60a5fa']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Coast-कवच</Text>
          <Text style={styles.headerSubtitle}>Setup - Step {getStepNumber()}/3</Text>
        </View>

        {/* Step Content */}
        <View style={styles.content}>
          {currentStep === 'language' && renderLanguageStep()}
          {currentStep === 'role' && renderRoleStep()}
          {currentStep === 'emergency' && renderEmergencyStep()}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.buttonRow}>
            {currentStep === 'emergency' && (
              <TouchableOpacity
                style={styles.skipButton}
                onPress={handleSkip}
                accessible={true}
                accessibilityLabel="Skip emergency contacts"
                accessibilityRole="button"
              >
                <Text style={styles.skipButtonText}>Skip</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNext}
              accessible={true}
              accessibilityLabel="Continue to next step"
              accessibilityRole="button"
            >
              <Text style={styles.nextButtonText}>
                {currentStep === 'emergency' ? 'Complete Setup' : 'Next'}
              </Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: typography.fontFamily.bold,
    color: 'white',
    marginBottom: spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: typography.fontFamily.medium,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  stepContainer: {
    flex: 1,
  },
  stepHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  stepTitle: {
    fontSize: 24,
    fontFamily: typography.fontFamily.bold,
    color: 'white',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    fontFamily: typography.fontFamily.medium,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  optionsList: {
    flex: 1,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  optionFlag: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  optionContent: {
    flex: 1,
  },
  optionName: {
    fontSize: 18,
    fontFamily: typography.fontFamily.semiBold,
    color: 'white',
    marginBottom: spacing.xs,
  },
  optionRegion: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedRoleOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  roleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  roleContent: {
    flex: 1,
  },
  roleName: {
    fontSize: 18,
    fontFamily: typography.fontFamily.semiBold,
    color: 'white',
    marginBottom: spacing.xs,
  },
  roleDescription: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  emergencyList: {
    flex: 1,
  },
  emergencyItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  emergencyInputs: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: typography.fontFamily.semiBold,
    color: 'white',
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 16,
    fontFamily: typography.fontFamily.medium,
    color: 'white',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  removeButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    padding: spacing.sm,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderStyle: 'dashed',
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
    color: 'white',
    marginLeft: spacing.sm,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  skipButtonText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.medium,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
    color: 'white',
    marginRight: spacing.sm,
  },
});

export default OnboardingScreen;