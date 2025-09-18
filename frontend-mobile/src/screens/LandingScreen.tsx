import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
  Modal,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useAccessibilityStore } from '../stores/accessibilityStore';
import { useAuthStore } from '../stores/authStore';
import { colors, typography, spacing, borderRadius, shadows } from '../theme/theme';
import { i18n } from '../services/i18n';

const { width, height } = Dimensions.get('window');

const LandingScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { speak, hapticFeedback, getFontSize } = useAccessibilityStore();
  const { logout } = useAuthStore();
  
  const [showLanguageSelection, setShowLanguageSelection] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [slideAnimation] = useState(new Animated.Value(height));
  const [showLanguageButton, setShowLanguageButton] = useState(false);
  const [enableVoiceModulation, setEnableVoiceModulation] = useState(false);

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  ];

  useEffect(() => {
    // Only speak if voice modulation is enabled
    if (enableVoiceModulation) {
      speak('Welcome to Coast-Kavach, India\'s premier coastal disaster response platform', { priority: 'high' });
    }
    
    // Show language selection after 3 seconds
    const timer = setTimeout(() => {
      setShowLanguageSelection(true);
      // Slide up animation
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
      // Only speak if voice modulation is enabled
      if (enableVoiceModulation) {
        speak('Please select your language');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [enableVoiceModulation]);

  const showLanguageModal = () => {
    setShowLanguageSelection(true);
    setShowLanguageButton(false);
    // Slide up animation
    Animated.timing(slideAnimation, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
    speak('Please select your language', { priority: 'high' });
  };

  const handleLanguageSelect = (languageCode: string) => {
    hapticFeedback('medium');
    setSelectedLanguage(languageCode);
    i18n.changeLanguage(languageCode);
    // Only speak if voice modulation is enabled
    if (enableVoiceModulation) {
      speak(`Language selected: ${languages.find(l => l.code === languageCode)?.name}`, { 
        priority: 'high'
      });
    }
  };

  const handleVoiceModulationToggle = () => {
    hapticFeedback('light');
    setEnableVoiceModulation(!enableVoiceModulation);
    // Only speak if voice modulation is enabled
    if (!enableVoiceModulation) {
      speak(`Voice modulation enabled`, { 
        priority: 'high'
      });
    }
  };

  const handleContinue = () => {
    hapticFeedback('medium');
    // Update accessibility preferences with voice modulation setting
    const { updatePreferences } = useAccessibilityStore.getState();
    updatePreferences({ voiceModulated: enableVoiceModulation });
    
    // Only speak if voice modulation is enabled
    if (enableVoiceModulation) {
      speak('Language selection completed', { priority: 'high' });
    }
    // Slide down animation
    Animated.timing(slideAnimation, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowLanguageSelection(false);
      // Navigate to onboarding screen
      navigation.navigate('Onboarding' as never);
    });
  };

  const handleModalClose = () => {
    // Slide down animation
    Animated.timing(slideAnimation, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowLanguageSelection(false);
      setShowLanguageButton(true);
    });
  };

  const handleAccessibilityToggle = () => {
    hapticFeedback('light');
    speak('Accessibility settings');
    // TODO: Implement accessibility settings
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Main White Background */}
      <View style={styles.background}>
        {/* Header with Language and Accessibility */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={showLanguageModal}
            accessible={true}
            accessibilityLabel="Select language"
            accessibilityRole="button"
          >
            <Ionicons name="language" size={24} color="#3770E6" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleAccessibilityToggle}
            accessible={true}
            accessibilityLabel="Accessibility settings"
            accessibilityRole="button"
          >
            <Ionicons name="accessibility" size={24} color="#3770E6" />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
                {/* Logo Section */}
                <View style={styles.logoSection}>
                  <Image
                    source={require('../../assets/images/logo.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </View>

                {/* Title Section */}
                <View style={styles.titleSection}>
                  <Text style={[styles.coastText, { fontSize: getFontSize() * 2.5 }]}>
                    COAST
                  </Text>
                  <Text style={[styles.kavachText, { fontSize: getFontSize() * 3.0 }]}>
                    कवच
                  </Text>
                </View>

                {/* Tagline */}
                <Text style={[styles.tagline, { fontSize: getFontSize() * 1.1 }]}>
                  Alert | Unite | Safeguard
                </Text>

          {/* Wave Image at Bottom */}
          <View style={styles.waveContainer}>
            <Image
              source={require('../../assets/images/wave.png')}
              style={styles.waveImage}
              resizeMode="cover"
            />
          </View>

          {/* Small Language Selection Button */}
          {showLanguageButton && (
            <View style={styles.languageButtonContainer}>
              <TouchableOpacity
                style={styles.smallLanguageButton}
                onPress={showLanguageModal}
                accessible={true}
                accessibilityLabel="Select language"
                accessibilityRole="button"
              >
                <Ionicons name="language" size={16} color="white" />
                <Text style={[styles.smallLanguageButtonText, { fontSize: getFontSize() * 0.8 }]}>
                  Select Language
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Language Selection Modal */}
        <Modal
          visible={showLanguageSelection}
          transparent={true}
          animationType="none"
          onRequestClose={handleModalClose}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity 
              style={styles.modalBackdrop}
              activeOpacity={1}
              onPress={handleModalClose}
            />
            <Animated.View 
              style={[
                styles.languageModal,
                {
                  transform: [{ translateY: slideAnimation }]
                }
              ]}
            >
                      <ScrollView 
                        style={styles.languageScrollView}
                        showsVerticalScrollIndicator={true}
                        bounces={false}
                      >
                <View style={styles.languageList}>
                  {languages.map((language, index) => (
                    <View key={language.code}>
                      <TouchableOpacity
                        style={styles.languageOption}
                        onPress={() => handleLanguageSelect(language.code)}
                        accessible={true}
                        accessibilityLabel={`Select ${language.name}`}
                        accessibilityRole="radio"
                        accessibilityState={{ checked: selectedLanguage === language.code }}
                      >
                        <View style={styles.radioContainer}>
                          <View style={[
                            styles.radioButton,
                            selectedLanguage === language.code && styles.radioButtonSelected
                          ]}>
                            {selectedLanguage === language.code && (
                              <View style={styles.radioButtonInner} />
                            )}
                          </View>
                        </View>
                        <View style={styles.languageTextContainer}>
                          <Text style={[styles.languageName, { fontSize: getFontSize() * 1.0 }]}>
                            {language.name}
                          </Text>
                          <Text style={[styles.languageNativeName, { fontSize: getFontSize() * 0.9 }]}>
                            {language.nativeName}
                          </Text>
                        </View>
                      </TouchableOpacity>
                      {index < languages.length - 1 && <View style={styles.separator} />}
                    </View>
                  ))}
                </View>
                      </ScrollView>
                      
                      {/* Compact Language Selector */}
                      <View style={styles.compactLanguageSelector}>
                        <Text style={[styles.selectLanguageText, { fontSize: getFontSize() * 0.9 }]}>
                          Select Language
                        </Text>
                        <TouchableOpacity
                          style={[
                            styles.voiceToggleButton,
                            { backgroundColor: enableVoiceModulation ? 'rgba(13, 64, 144, 0.1)' : 'rgba(107, 114, 128, 0.1)' }
                          ]}
                          onPress={handleVoiceModulationToggle}
                          accessible={true}
                          accessibilityLabel={`Voice modulation ${enableVoiceModulation ? 'enabled' : 'disabled'}`}
                          accessibilityRole="switch"
                          accessibilityState={{ checked: enableVoiceModulation }}
                        >
                          <Ionicons 
                            name={enableVoiceModulation ? "volume-high" : "volume-mute"} 
                            size={16} 
                            color={enableVoiceModulation ? "#0D4090" : "#6B7280"} 
                          />
                        </TouchableOpacity>
                      </View>
                      
                      <TouchableOpacity
                        style={styles.continueButton}
                        onPress={handleContinue}
                        accessible={true}
                        accessibilityLabel="Continue with selected language"
                        accessibilityRole="button"
                      >
                        <Text style={[styles.continueButtonText, { fontSize: getFontSize() * 1.1 }]}>
                          Continue
                        </Text>
                      </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(55, 112, 230, 0.1)',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'flex-start',
  },
  logoSection: {
    alignItems: 'center',
    paddingTop: spacing['3xl'] * 2,
    marginBottom: spacing.sm,
  },
  logoImage: {
    width: 150,
    height: 120,
    marginBottom: spacing['2xl'],
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  coastText: {
    fontFamily: typography.fontFamily.bold,
    color: '#3770E6',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
    marginRight: spacing.xs,
  },
  kavachText: {
    fontFamily: typography.fontFamily.bold,
    color: '#0D4090',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
    marginTop: spacing['2xl'],
    marginLeft: spacing.xs,
  },
  tagline: {
    fontFamily: typography.fontFamily.medium,
    color: '#3770E6',
    textAlign: 'center',
    marginBottom: spacing['2xl'],
  },
  waveContainer: {
    position: 'absolute',
    bottom: 20,
    left: -8,
    right: -8,
    height: 185,
  },
  waveImage: {
    width: '100%',
    height: '100%',
  },
  languageButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  smallLanguageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(13, 64, 144, 0.9)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    ...shadows.md,
    elevation: 4,
  },
  smallLanguageButtonText: {
    fontFamily: typography.fontFamily.medium,
    color: 'white',
    marginLeft: spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  languageModal: {
    backgroundColor: '#F8F9FA',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    maxHeight: height * 0.6,
    ...shadows.xl,
    elevation: 10,
  },
  languageScrollView: {
    maxHeight: height * 0.3,
    marginBottom: spacing.sm,
  },
  languageList: {
    paddingBottom: spacing.sm,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  radioContainer: {
    marginRight: spacing.md,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#0D4090',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0D4090',
  },
  languageTextContainer: {
    flex: 1,
  },
  languageName: {
    fontFamily: typography.fontFamily.medium,
    color: '#374151',
    marginBottom: 2,
  },
  languageNativeName: {
    fontFamily: typography.fontFamily.regular,
    color: '#6B7280',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginLeft: 40,
  },
  continueButton: {
    backgroundColor: '#D2691E',
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
    ...shadows.md,
    elevation: 4,
  },
  continueButtonText: {
    fontFamily: typography.fontFamily.bold,
    color: 'white',
  },
  compactLanguageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(13, 64, 144, 0.05)',
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  selectLanguageText: {
    fontFamily: typography.fontFamily.medium,
    color: '#0D4090',
  },
  voiceToggleButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(13, 64, 144, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LandingScreen;