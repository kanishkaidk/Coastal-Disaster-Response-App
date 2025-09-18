import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
// Removed unused Picker import

import { useAuthStore } from '../stores/authStore';
import { useAccessibilityStore } from '../stores/accessibilityStore';
import { colors, typography, spacing, borderRadius, shadows } from '../theme/theme';

const AuthScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { login, isLoading, error, updateUser } = useAuthStore();
  const { speak, hapticFeedback, getFontSize } = useAccessibilityStore();

  // Form state
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp' | 'role' | 'contacts'>('phone');
  const [selectedRole, setSelectedRole] = useState<'citizen' | 'marine_worker' | 'analyst' | 'moderator' | 'admin'>('citizen');
  const [emergencyContacts, setEmergencyContacts] = useState<Array<{ name: string; phone: string }>>([]);
  const [newContact, setNewContact] = useState({ name: '', phone: '' });

  useEffect(() => {
    speak(t('enterPhone'), { priority: 'high' });
  }, []);

  useEffect(() => {
    if (error) {
      speak(error, { priority: 'high' });
    }
  }, [error]);


  const handlePhoneSubmit = async () => {
    if (!phone.trim()) {
      speak('Please enter a valid phone number', { priority: 'high' });
      return;
    }

    hapticFeedback('medium');
    speak('Sending OTP', { priority: 'normal' });
    
    // TODO: Replace with actual API call
    try {
      // Simulate OTP sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep('otp');
      speak(t('enterOtp'), { priority: 'high' });
    } catch (error) {
      speak('Failed to send OTP. Please try again.', { priority: 'high' });
    }
  };

  const handleOtpSubmit = async () => {
    if (!otp.trim() || otp.length !== 6) {
      speak('Please enter a valid 6-digit OTP', { priority: 'high' });
      return;
    }

    hapticFeedback('medium');
    speak('Verifying OTP', { priority: 'normal' });
    
    try {
      await login(phone, otp);
      setStep('role');
      speak(t('selectRole'), { priority: 'high' });
    } catch (error) {
      speak('OTP verification failed. Please try again.', { priority: 'high' });
    }
  };

  const handleRoleSelect = (role: typeof selectedRole) => {
    hapticFeedback('light');
    setSelectedRole(role);
    speak(`${role} role selected`, { priority: 'normal' });
    
    // Update user role immediately
    updateUser({ role });
  };

  const handleContinue = () => {
    hapticFeedback('medium');
    setStep('contacts');
    speak(t('emergencyContacts'), { priority: 'high' });
  };

  const handleAddContact = () => {
    if (newContact.name.trim() && newContact.phone.trim()) {
      setEmergencyContacts([...emergencyContacts, newContact]);
      setNewContact({ name: '', phone: '' });
      hapticFeedback('light');
      speak('Emergency contact added', { priority: 'normal' });
    }
  };

  const handleSkip = async () => {
    hapticFeedback('medium');
    speak('Skipping emergency contacts', { priority: 'normal' });
    
    // Complete the registration without emergency contacts
    try {
      updateUser({
        emergencyContacts: [],
        preferences: {
          notifications: true,
          voiceAssistance: true,
          highContrast: false,
          fontSize: 'medium',
        },
      });
      
      // The navigation will be handled by authentication state change
      // The user is already logged in from the OTP step
    } catch (error) {
      speak('Failed to complete registration. Please try again.', { priority: 'high' });
    }
  };

  const handleFinish = async () => {
    hapticFeedback('success');
    speak('Registration completed successfully', { priority: 'high' });
    
    // Complete the registration by updating user with emergency contacts
    try {
      updateUser({
        emergencyContacts,
        preferences: {
          notifications: true,
          voiceAssistance: true,
          highContrast: false,
          fontSize: 'medium',
        },
      });
      
      // The navigation will be handled by authentication state change
      // The user is already logged in from the OTP step
    } catch (error) {
      speak('Failed to complete registration. Please try again.', { priority: 'high' });
    }
  };

  const renderPhoneStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.header}>
        <Text style={[styles.title, { fontSize: getFontSize() * 2 }]}>
          {t('enterPhone')}
        </Text>
        <Text style={[styles.subtitle, { fontSize: getFontSize() * 1.1 }]}>
          We'll send you a verification code
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { fontSize: getFontSize() }]}>
          Phone Number
        </Text>
        <View style={styles.phoneInputContainer}>
          <View style={styles.countryCode}>
            <Text style={[styles.countryCodeText, { fontSize: getFontSize() }]}>
              🇮🇳 +91
            </Text>
          </View>
          <TextInput
            style={[styles.phoneInput, { fontSize: getFontSize() }]}
            value={phone}
            onChangeText={setPhone}
            placeholder={t('phonePlaceholder')}
            placeholderTextColor={colors.gray400}
            keyboardType="phone-pad"
            accessible={true}
            accessibilityLabel="Phone number input"
            accessibilityHint="Enter your 10-digit phone number"
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, { opacity: phone.trim() ? 1 : 0.5 }]}
        onPress={handlePhoneSubmit}
        disabled={!phone.trim() || isLoading}
        accessible={true}
        accessibilityLabel="Send OTP"
        accessibilityRole="button"
      >
        <LinearGradient
          colors={colors.gradients.primary as [string, string]}
          style={styles.buttonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="send" size={24} color={colors.background} />
          <Text style={[styles.buttonText, { fontSize: getFontSize() * 1.1 }]}>
            {isLoading ? t('loading') : t('sendOtp')}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderOtpStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.header}>
        <Text style={[styles.title, { fontSize: getFontSize() * 2 }]}>
          {t('enterOtp')}
        </Text>
        <Text style={[styles.subtitle, { fontSize: getFontSize() * 1.1 }]}>
          Enter the 6-digit code sent to {phone}
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { fontSize: getFontSize() }]}>
          Verification Code
        </Text>
        <TextInput
          style={[styles.otpInput, { fontSize: getFontSize() * 1.5 }]}
          value={otp}
          onChangeText={setOtp}
          placeholder="123456"
          placeholderTextColor={colors.gray400}
          keyboardType="number-pad"
          maxLength={6}
          accessible={true}
          accessibilityLabel="OTP input"
          accessibilityHint="Enter the 6-digit verification code"
        />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => {
            setStep('phone');
          }}
          accessible={true}
          accessibilityLabel="Back to phone"
          accessibilityRole="button"
        >
          <Text style={[styles.secondaryButtonText, { fontSize: getFontSize() }]}>
            {t('back')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primaryButton, { opacity: otp.length === 6 ? 1 : 0.5 }]}
          onPress={handleOtpSubmit}
          disabled={otp.length !== 6 || isLoading}
          accessible={true}
          accessibilityLabel="Verify OTP"
          accessibilityRole="button"
        >
          <LinearGradient
            colors={colors.gradients.primary as [string, string]}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="checkmark" size={24} color={colors.background} />
            <Text style={[styles.buttonText, { fontSize: getFontSize() * 1.1 }]}>
              {isLoading ? t('loading') : t('verifyOtp')}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderRoleStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.header}>
        <Text style={[styles.title, { fontSize: getFontSize() * 2 }]}>
          {t('selectRole')}
        </Text>
        <Text style={[styles.subtitle, { fontSize: getFontSize() * 1.1 }]}>
          Choose your role to customize your experience
        </Text>
      </View>

      <View style={styles.roleContainer}>
        {[
          { key: 'citizen', label: t('citizen'), icon: 'person', color: colors.primary },
          { key: 'marine_worker', label: t('marineWorker'), icon: 'boat', color: colors.success },
          { key: 'analyst', label: t('analyst'), icon: 'analytics', color: colors.warning },
          { key: 'moderator', label: t('moderator'), icon: 'shield', color: colors.emergency },
          { key: 'admin', label: t('admin'), icon: 'settings', color: colors.gray600 },
        ].map((role) => (
          <TouchableOpacity
            key={role.key}
            style={[
              styles.roleButton,
              selectedRole === role.key && styles.selectedRoleButton,
            ]}
            onPress={() => handleRoleSelect(role.key as typeof selectedRole)}
            accessible={true}
            accessibilityLabel={`${role.label} role`}
            accessibilityRole="button"
            accessibilityState={{ selected: selectedRole === role.key }}
          >
            <LinearGradient
              colors={
                selectedRole === role.key
                  ? [role.color, role.color + '80']
                  : [colors.gray100, colors.gray200]
              }
              style={styles.roleGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons
                name={role.icon as any}
                size={32}
                color={selectedRole === role.key ? colors.background : colors.gray600}
              />
              <Text
                style={[
                  styles.roleText,
                  {
                    color: selectedRole === role.key ? colors.background : colors.gray700,
                    fontSize: getFontSize(),
                  },
                ]}
              >
                {role.label}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleContinue}
        accessible={true}
        accessibilityLabel="Continue"
        accessibilityRole="button"
      >
        <LinearGradient
          colors={colors.gradients.primary as [string, string]}
          style={styles.buttonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="arrow-forward" size={24} color={colors.background} />
          <Text style={[styles.buttonText, { fontSize: getFontSize() * 1.1 }]}>
            {t('continue')}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderContactsStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.header}>
        <Text style={[styles.title, { fontSize: getFontSize() * 2 }]}>
          {t('emergencyContacts')}
        </Text>
        <Text style={[styles.subtitle, { fontSize: getFontSize() * 1.1 }]}>
          Add emergency contacts (optional)
        </Text>
      </View>

      <View style={styles.contactsContainer}>
        {emergencyContacts.map((contact, index) => (
          <View key={index} style={styles.contactItem}>
            <Ionicons name="person" size={20} color={colors.primary} />
            <View style={styles.contactInfo}>
              <Text style={[styles.contactName, { fontSize: getFontSize() }]}>
                {contact.name}
              </Text>
              <Text style={[styles.contactPhone, { fontSize: getFontSize() * 0.9 }]}>
                {contact.phone}
              </Text>
            </View>
          </View>
        ))}

        <View style={styles.addContactContainer}>
          <TextInput
            style={[styles.contactInput, { fontSize: getFontSize() }]}
            value={newContact.name}
            onChangeText={(text) => setNewContact({ ...newContact, name: text })}
            placeholder="Contact Name"
            placeholderTextColor={colors.gray400}
            accessible={true}
            accessibilityLabel="Emergency contact name"
          />
          <TextInput
            style={[styles.contactInput, { fontSize: getFontSize() }]}
            value={newContact.phone}
            onChangeText={(text) => setNewContact({ ...newContact, phone: text })}
            placeholder="Phone Number"
            placeholderTextColor={colors.gray400}
            keyboardType="phone-pad"
            accessible={true}
            accessibilityLabel="Emergency contact phone"
          />
          <TouchableOpacity
            style={styles.addContactButton}
            onPress={handleAddContact}
            accessible={true}
            accessibilityLabel="Add emergency contact"
            accessibilityRole="button"
          >
            <Ionicons name="add" size={20} color={colors.background} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleSkip}
          accessible={true}
          accessibilityLabel="Skip emergency contacts"
          accessibilityRole="button"
        >
          <Text style={[styles.secondaryButtonText, { fontSize: getFontSize() }]}>
            {t('skip')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleFinish}
          accessible={true}
          accessibilityLabel="Finish registration"
          accessibilityRole="button"
        >
          <LinearGradient
            colors={colors.gradients.success as [string, string]}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="checkmark-circle" size={24} color={colors.background} />
            <Text style={[styles.buttonText, { fontSize: getFontSize() * 1.1 }]}>
              {t('done')}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={colors.gradients.ocean as [string, string, string]}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            accessible={true}
            accessibilityLabel="Authentication form"
          >
            {step === 'phone' && renderPhoneStep()}
            {step === 'otp' && renderOtpStep()}
            {step === 'role' && renderRoleStep()}
            {step === 'contacts' && renderContactsStep()}
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    color: colors.background,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontFamily: typography.fontFamily.medium,
    color: colors.background,
    textAlign: 'center',
    opacity: 0.9,
  },
  inputContainer: {
    marginBottom: spacing['2xl'],
  },
  label: {
    fontFamily: typography.fontFamily.medium,
    color: colors.background,
    marginBottom: spacing.sm,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  countryCode: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    backgroundColor: colors.gray100,
    justifyContent: 'center',
  },
  countryCodeText: {
    fontFamily: typography.fontFamily.medium,
    color: colors.gray700,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    fontFamily: typography.fontFamily.medium,
    color: colors.gray900,
  },
  otpInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    textAlign: 'center',
    fontFamily: typography.fontFamily.bold,
    color: colors.gray900,
    letterSpacing: 8,
  },
  roleContainer: {
    marginBottom: spacing['2xl'],
  },
  roleButton: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  selectedRoleButton: {
    // Styles handled by gradient
  },
  roleGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  roleText: {
    fontFamily: typography.fontFamily.semiBold,
    marginLeft: spacing.md,
    flex: 1,
  },
  contactsContainer: {
    marginBottom: spacing['2xl'],
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
  },
  contactInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  contactName: {
    fontFamily: typography.fontFamily.semiBold,
    color: colors.gray900,
  },
  contactPhone: {
    fontFamily: typography.fontFamily.medium,
    color: colors.gray600,
  },
  addContactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  contactInput: {
    flex: 1,
    paddingVertical: spacing.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.gray900,
  },
  addContactButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  primaryButton: {
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.xl,
  },
  buttonText: {
    fontFamily: typography.fontFamily.semiBold,
    color: colors.background,
    marginLeft: spacing.sm,
  },
  secondaryButton: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.background,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontFamily: typography.fontFamily.medium,
    color: colors.background,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
});

export default AuthScreen;
