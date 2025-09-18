import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useAccessibilityStore } from '../stores/accessibilityStore';
import { useAuthStore } from '../stores/authStore';
import { colors, typography, spacing, borderRadius, shadows } from '../theme/theme';
import { i18n } from '../services/i18n';

const { width, height } = Dimensions.get('window');

const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation();
  const { speak, hapticFeedback, getFontSize, preferences } = useAccessibilityStore();
  const { logout } = useAuthStore();
  
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [enableVoiceModulation, setEnableVoiceModulation] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

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

  const onboardingPages = [
    {
      id: 1,
      title: "What is Coast-कवच?",
      description: "India's premier coastal disaster response platform that enables real-time warnings, community reporting, and emergency coordination for our 7,500+ km coastline.",
      icon: "shield-checkmark",
      color: "#3770E6"
    },
    {
      id: 2,
      title: "Real-time Warnings",
      description: "Receive instant alerts from IMD, NDMA, and coastal authorities about storms, high tides, cyclones, and other coastal hazards in your area.",
      icon: "warning",
      color: "#F59E0B"
    },
    {
      id: 3,
      title: "Community Reporting",
      description: "Report hazards, upload photos/videos, and help keep your coastal community safe. Your reports help others stay informed.",
      icon: "people",
      color: "#10B981"
    },
    {
      id: 4,
      title: "Offline & Mesh Network",
      description: "Works even without internet! Uses mesh networking and SMS fallback to ensure critical information reaches everyone during emergencies.",
      icon: "wifi",
      color: "#8B5CF6"
    },
    {
      id: 5,
      title: "Multi-language Support",
      description: "Available in 9+ Indian languages with voice guidance, haptic feedback, and accessibility features for all users.",
      icon: "language",
      color: "#EF4444"
    }
  ];

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    setCurrentPage(roundIndex);
  };

  const scrollToPage = (index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * width,
      animated: true,
    });
  };

  const handleLanguageSelect = (languageCode: string) => {
    hapticFeedback('medium');
    setCurrentLanguage(languageCode);
    i18n.changeLanguage(languageCode);
    speak(`Language changed to ${languages.find(l => l.code === languageCode)?.name}`, { 
      priority: 'high'
    });
  };

  const handleVoiceModulationToggle = () => {
    hapticFeedback('light');
    setEnableVoiceModulation(!enableVoiceModulation);
    speak(`Voice modulation ${!enableVoiceModulation ? 'enabled' : 'disabled'}`, { 
      priority: 'high'
    });
  };

  const handleLanguageModalToggle = () => {
    hapticFeedback('light');
    setShowLanguageModal(!showLanguageModal);
    speak('Language selection', { priority: 'high' });
  };

  const handleLogin = () => {
    hapticFeedback('medium');
    speak('Login selected', { priority: 'high' });
    navigation.navigate('Auth' as never);
  };

  const handleSignup = () => {
    hapticFeedback('medium');
    speak('Signup selected', { priority: 'high' });
    navigation.navigate('Auth' as never);
  };

  const handlePagePress = (pageIndex: number) => {
    hapticFeedback('light');
    const page = onboardingPages[pageIndex];
    speak(`${page.title}. ${page.description}`, { priority: 'high' });
  };

  const handleAdminLogin = () => {
    hapticFeedback('medium');
    speak('Admin login selected', { priority: 'high' });
    navigation.navigate('Auth' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        
        <TouchableOpacity 
          style={styles.languageButton}
          onPress={handleLanguageModalToggle}
          accessible={true}
          accessibilityLabel="Change language"
          accessibilityRole="button"
        >
          <Ionicons name="chatbubbles" size={20} color="#3770E6" />
          <Text style={[styles.languageText, { fontSize: getFontSize() * 0.9 }]}>
            {languages.find(l => l.code === currentLanguage)?.nativeName || 'English'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.scrollView}
      >
        {onboardingPages.map((page, index) => (
          <TouchableOpacity 
            key={page.id} 
            style={styles.page}
            onPress={() => handlePagePress(index)}
            accessible={true}
            accessibilityLabel={`Page ${index + 1}: ${page.title}`}
            accessibilityRole="button"
          >
            <View style={styles.illustrationContainer}>
              <View style={styles.illustration}>
                {/* Main Icon */}
                <View style={[styles.mainIconContainer, { backgroundColor: page.color + '15' }]}>
                  <Ionicons name={page.icon as any} size={80} color={page.color} />
                </View>
                
                {/* Decorative Elements */}
                <View style={styles.decorativeElements}>
                  <View style={[styles.decorativeCircle, { backgroundColor: page.color + '20' }]} />
                  <View style={[styles.decorativeCircle, styles.decorativeCircleSmall, { backgroundColor: page.color + '30' }]} />
                  <View style={[styles.decorativeCircle, styles.decorativeCircleLarge, { backgroundColor: page.color + '10' }]} />
                </View>
                
                {/* Feature Icons */}
                <View style={styles.featureIcons}>
                  {index === 0 && (
                    <>
                      <View style={[styles.featureIcon, { backgroundColor: page.color + '20' }]}>
                        <Ionicons name="location" size={20} color={page.color} />
                      </View>
                      <View style={[styles.featureIcon, { backgroundColor: page.color + '20' }]}>
                        <Ionicons name="notifications" size={20} color={page.color} />
                      </View>
                    </>
                  )}
                  {index === 1 && (
                    <>
                      <View style={[styles.featureIcon, { backgroundColor: page.color + '20' }]}>
                        <Ionicons name="flash" size={20} color={page.color} />
                      </View>
                      <View style={[styles.featureIcon, { backgroundColor: page.color + '20' }]}>
                        <Ionicons name="alert-circle" size={20} color={page.color} />
                      </View>
                    </>
                  )}
                  {index === 2 && (
                    <>
                      <View style={[styles.featureIcon, { backgroundColor: page.color + '20' }]}>
                        <Ionicons name="camera" size={20} color={page.color} />
                      </View>
                      <View style={[styles.featureIcon, { backgroundColor: page.color + '20' }]}>
                        <Ionicons name="share" size={20} color={page.color} />
                      </View>
                    </>
                  )}
                  {index === 3 && (
                    <>
                      <View style={[styles.featureIcon, { backgroundColor: page.color + '20' }]}>
                        <Ionicons name="phone-portrait" size={20} color={page.color} />
                      </View>
                      <View style={[styles.featureIcon, { backgroundColor: page.color + '20' }]}>
                        <Ionicons name="chatbubbles" size={20} color={page.color} />
                      </View>
                    </>
                  )}
                  {index === 4 && (
                    <>
                      <View style={[styles.featureIcon, { backgroundColor: page.color + '20' }]}>
                        <Ionicons name="volume-high" size={20} color={page.color} />
                      </View>
                      <View style={[styles.featureIcon, { backgroundColor: page.color + '20' }]}>
                        <Ionicons name="accessibility" size={20} color={page.color} />
                      </View>
                    </>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.contentContainer}>
              <Text style={[styles.title, { fontSize: getFontSize() * 1.4 }]}>
                {page.title}
              </Text>
              <Text style={[styles.description, { fontSize: getFontSize() * 1.0 }]}>
                {page.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Page Indicators */}
      <View style={styles.pageIndicators}>
        {onboardingPages.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.indicator,
              currentPage === index && styles.activeIndicator
            ]}
            onPress={() => scrollToPage(index)}
            accessible={true}
            accessibilityLabel={`Go to page ${index + 1}`}
            accessibilityRole="button"
          />
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleSignup}
          accessible={true}
          accessibilityLabel="Register for Coast-Kavach"
          accessibilityRole="button"
        >
          <Text style={[styles.registerButtonText, { fontSize: getFontSize() * 1.1 }]}>
            Register
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          accessible={true}
          accessibilityLabel="Login to Coast-Kavach"
          accessibilityRole="button"
        >
          <Text style={[styles.loginButtonText, { fontSize: getFontSize() * 1.1 }]}>
            Login
          </Text>
        </TouchableOpacity>
      </View>

      {/* Admin Login Button */}
      <TouchableOpacity
        style={styles.adminButton}
        onPress={handleAdminLogin}
        accessible={true}
        accessibilityLabel="Login as admin"
        accessibilityRole="button"
      >
        <Ionicons name="shield" size={16} color="#6B7280" />
        <Text style={[styles.adminButtonText, { fontSize: getFontSize() * 0.9 }]}>
          Login as Admin
        </Text>
      </TouchableOpacity>

      {/* Language Selection Modal */}
      {showLanguageModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.languageModal}>
            <Text style={[styles.modalTitle, { fontSize: getFontSize() * 1.4 }]}>
              Select Language
            </Text>
            
            <ScrollView style={styles.languageScrollView}>
              {languages.map((language) => (
                <TouchableOpacity
                  key={language.code}
                  style={[
                    styles.languageOption,
                    currentLanguage === language.code && styles.languageOptionSelected
                  ]}
                  onPress={() => {
                    handleLanguageSelect(language.code);
                    // Update accessibility preferences with voice modulation setting
                    const { updatePreferences } = useAccessibilityStore.getState();
                    updatePreferences({ voiceModulated: enableVoiceModulation });
                    setShowLanguageModal(false);
                  }}
                  accessible={true}
                  accessibilityLabel={`Select ${language.name}`}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: currentLanguage === language.code }}
                >
                  <View style={styles.radioContainer}>
                    <View style={[
                      styles.radioButton,
                      currentLanguage === language.code && styles.radioButtonSelected
                    ]}>
                      {currentLanguage === language.code && (
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
              ))}
            </ScrollView>
            
            {/* Voice Modulation Toggle */}
            <View style={styles.voiceModulationContainer}>
              <View style={styles.voiceModulationInfo}>
                <Ionicons name="volume-high" size={20} color="#0D4090" />
                <View style={styles.voiceModulationTextContainer}>
                  <Text style={[styles.voiceModulationLabel, { fontSize: getFontSize() * 1.0 }]}>
                    Voice Modulation
                  </Text>
                  <Text style={[styles.voiceModulationDescription, { fontSize: getFontSize() * 0.85 }]}>
                    Enhanced voice for better clarity
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={[
                  styles.voiceModulationToggle,
                  enableVoiceModulation && styles.voiceModulationToggleActive
                ]}
                onPress={handleVoiceModulationToggle}
                accessible={true}
                accessibilityLabel={`Voice modulation ${enableVoiceModulation ? 'enabled' : 'disabled'}`}
                accessibilityRole="switch"
                accessibilityState={{ checked: enableVoiceModulation }}
              >
                <View style={[
                  styles.voiceModulationToggleThumb,
                  enableVoiceModulation && styles.voiceModulationToggleThumbActive
                ]} />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setShowLanguageModal(false)}
              accessible={true}
              accessibilityLabel="Close language selection"
              accessibilityRole="button"
            >
              <Text style={[styles.closeModalButtonText, { fontSize: getFontSize() * 1.0 }]}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qrIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    backgroundColor: '#F3F4F6',
  },
  languageText: {
    fontFamily: typography.fontFamily.medium,
    color: '#3770E6',
    marginLeft: spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  page: {
    width: width,
    flex: 1,
  },
  illustrationContainer: {
    height: height * 0.25,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  illustration: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mainIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.sm,
    elevation: 2,
  },
  decorativeElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  decorativeCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.3,
  },
  decorativeCircleSmall: {
    width: 150,
    height: 150,
    borderRadius: 75,
    opacity: 0.4,
  },
  decorativeCircleLarge: {
    width: 250,
    height: 250,
    borderRadius: 125,
    opacity: 0.2,
  },
  featureIcons: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'column',
    gap: spacing.sm,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
    elevation: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing['2xl'],
    alignItems: 'center',
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  description: {
    fontFamily: typography.fontFamily.medium,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  pageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },
  activeIndicator: {
    backgroundColor: '#3770E6',
    width: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  registerButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: '#F59E0B',
    backgroundColor: 'white',
    alignItems: 'center',
    ...shadows.sm,
    elevation: 2,
  },
  registerButtonText: {
    fontFamily: typography.fontFamily.bold,
    color: '#F59E0B',
  },
  loginButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    ...shadows.sm,
    elevation: 2,
  },
  loginButtonText: {
    fontFamily: typography.fontFamily.bold,
    color: 'white',
  },
  adminButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  adminButtonText: {
    fontFamily: typography.fontFamily.medium,
    color: '#6B7280',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageModal: {
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    padding: spacing['2xl'],
    margin: spacing.lg,
    maxHeight: height * 0.7,
    width: width * 0.9,
    ...shadows.xl,
    elevation: 10,
  },
  modalTitle: {
    fontFamily: typography.fontFamily.bold,
    color: '#0D4090',
    textAlign: 'center',
    marginBottom: spacing['2xl'],
  },
  languageScrollView: {
    maxHeight: height * 0.4,
    marginBottom: spacing.md,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
  },
  languageOptionSelected: {
    backgroundColor: 'rgba(13, 64, 144, 0.1)',
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
  closeModalButton: {
    backgroundColor: '#0D4090',
    borderRadius: 12,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    ...shadows.md,
    elevation: 4,
  },
  closeModalButtonText: {
    fontFamily: typography.fontFamily.bold,
    color: 'white',
  },
  voiceModulationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
    backgroundColor: 'rgba(13, 64, 144, 0.05)',
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  voiceModulationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  voiceModulationTextContainer: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  voiceModulationLabel: {
    fontFamily: typography.fontFamily.medium,
    color: '#0D4090',
    marginBottom: 2,
  },
  voiceModulationDescription: {
    fontFamily: typography.fontFamily.regular,
    color: '#6B7280',
  },
  voiceModulationToggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
    padding: 2,
    justifyContent: 'center',
  },
  voiceModulationToggleActive: {
    backgroundColor: '#0D4090',
  },
  voiceModulationToggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  voiceModulationToggleThumbActive: {
    transform: [{ translateX: 22 }],
  },
});

export default OnboardingScreen;