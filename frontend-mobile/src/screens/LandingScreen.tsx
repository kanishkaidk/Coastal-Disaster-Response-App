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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useAccessibilityStore } from '../stores/accessibilityStore';
import { useAuthStore } from '../stores/authStore';
import { colors, typography, spacing, borderRadius, shadows } from '../theme/theme';

const { width, height } = Dimensions.get('window');

const LandingScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { speak, hapticFeedback, getFontSize } = useAccessibilityStore();
  const { logout } = useAuthStore();
  
  const [showLanguageSelection, setShowLanguageSelection] = useState(false);
  const [waveAnimation] = useState(new Animated.Value(0));
  const [fadeAnimation] = useState(new Animated.Value(1));

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇮🇳' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
  ];

  useEffect(() => {
    speak('Welcome to Coast-Kavach, India\'s premier coastal disaster response platform', { priority: 'high' });
    
    // Start wave animation
    startWaveAnimation();
    
    // Show language selection after 3 seconds
    const timer = setTimeout(() => {
      setShowLanguageSelection(true);
      speak('Please select your language');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const startWaveAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleLanguageSelect = (languageCode: string) => {
    hapticFeedback('medium');
    speak(`Language selected: ${languages.find(l => l.code === languageCode)?.name}`);
    setShowLanguageSelection(false);
    // TODO: Implement language change
  };

  const handleAccessibilityToggle = () => {
    hapticFeedback('light');
    speak('Accessibility settings');
    // TODO: Implement accessibility settings
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0066CC" />
      
      {/* Main Background Gradient - Ocean Theme */}
      <LinearGradient
        colors={['#0066CC', '#004499', '#002266']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header with Accessibility */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleAccessibilityToggle}
            accessible={true}
            accessibilityLabel="Accessibility settings"
            accessibilityRole="button"
          >
            <Ionicons name="accessibility" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Logo and Title Section */}
          <View style={styles.heroSection}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['#FFFFFF', '#E6F3FF']}
                style={styles.logoGradient}
              >
                <Text style={styles.logoText}>🌊</Text>
              </LinearGradient>
            </View>
            
            <Text style={[styles.appName, { fontSize: getFontSize() * 2.5 }]}>
              Coast-कवच
            </Text>
            
            <Text style={[styles.tagline, { fontSize: getFontSize() * 1.2 }]}>
              India's Coastal Disaster Response Platform
            </Text>
            
            <Text style={[styles.description, { fontSize: getFontSize() * 1.0 }]}>
              Protecting India's 7,500+ km coastline with real-time warnings and community-driven safety
            </Text>
          </View>

          {/* Wave Animation at Bottom */}
          <View style={styles.waveContainer}>
            <Animated.View
              style={[
                styles.wave,
                {
                  transform: [
                    {
                      translateY: waveAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -10],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.wave1} />
              <View style={styles.wave2} />
              <View style={styles.wave3} />
            </Animated.View>
          </View>
        </View>

        {/* Language Selection Modal */}
        <Modal
          visible={showLanguageSelection}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowLanguageSelection(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.languageModal}>
              <Text style={[styles.modalTitle, { fontSize: getFontSize() * 1.3 }]}>
                Select Language
              </Text>
              <Text style={[styles.modalSubtitle, { fontSize: getFontSize() * 0.9 }]}>
                Choose your preferred language
              </Text>
              
              <View style={styles.languageGrid}>
                {languages.map((language) => (
                  <TouchableOpacity
                    key={language.code}
                    style={styles.languageButton}
                    onPress={() => handleLanguageSelect(language.code)}
                    accessible={true}
                    accessibilityLabel={`Select ${language.name}`}
                    accessibilityRole="button"
                  >
                    <Text style={styles.languageFlag}>{language.flag}</Text>
                    <Text style={[styles.languageName, { fontSize: getFontSize() * 0.9 }]}>
                      {language.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </Modal>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: spacing['3xl'],
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: spacing['2xl'],
  },
  logoGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.xl,
    elevation: 8,
  },
  logoText: {
    fontSize: 60,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  appName: {
    fontFamily: typography.fontFamily.bold,
    color: 'white',
    textAlign: 'center',
    marginBottom: spacing.md,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontFamily: typography.fontFamily.semiBold,
    color: 'white',
    textAlign: 'center',
    marginBottom: spacing.lg,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  description: {
    fontFamily: typography.fontFamily.medium,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing.lg,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  waveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    overflow: 'hidden',
  },
  wave: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  wave1: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  wave2: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    height: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  wave3: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  languageModal: {
    backgroundColor: 'white',
    borderRadius: borderRadius.xl,
    padding: spacing['2xl'],
    width: '100%',
    maxWidth: 400,
    ...shadows.xl,
    elevation: 10,
  },
  modalTitle: {
    fontFamily: typography.fontFamily.bold,
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  modalSubtitle: {
    fontFamily: typography.fontFamily.medium,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: spacing['2xl'],
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  languageButton: {
    width: (width - spacing.lg * 4 - spacing.md * 3) / 4,
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.lg,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  languageFlag: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  languageName: {
    fontFamily: typography.fontFamily.medium,
    color: '#374151',
    textAlign: 'center',
  },
});

export default LandingScreen;