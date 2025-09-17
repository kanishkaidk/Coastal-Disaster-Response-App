import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  StatusBar,
  Image,
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
  const [currentSlide, setCurrentSlide] = useState(0);

  const features = [
    {
      icon: 'shield-checkmark',
      title: 'Government Verified',
      description: 'Official warnings from IMD, NDMA, and coastal authorities',
      color: '#10b981'
    },
    {
      icon: 'people',
      title: 'Community Driven',
      description: 'Real-time reports from marine workers and coastal residents',
      color: '#3b82f6'
    },
    {
      icon: 'accessibility',
      title: 'Fully Accessible',
      description: 'Multi-language support, voice guidance, and haptic feedback',
      color: '#8b5cf6'
    },
    {
      icon: 'cloud-offline',
      title: 'Works Offline',
      description: 'Mesh networking, SMS fallback, and offline data storage',
      color: '#f59e0b'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Active Users' },
    { number: '1M+', label: 'Warnings Issued' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Monitoring' }
  ];

  useEffect(() => {
    speak('Welcome to Coast-Kavach, India\'s premier coastal disaster response platform', { priority: 'high' });
  }, []);

  const handleButtonPress = (action: string) => {
    hapticFeedback('medium');
    speak(`${action} button pressed`);
    
    switch (action) {
      case 'login':
        navigation.navigate('Auth' as never);
        break;
      case 'signup':
        navigation.navigate('Auth' as never);
        break;
      case 'admin':
        navigation.navigate('Auth' as never);
        break;
    }
  };

  const handleLanguageChange = () => {
    hapticFeedback('light');
    speak('Language selection');
    // TODO: Implement language picker
  };

  const handleAccessibilityToggle = () => {
    hapticFeedback('light');
    speak('Accessibility settings');
    // TODO: Implement accessibility settings
  };

  const handleRestart = () => {
    hapticFeedback('medium');
    speak('Restarting app');
    logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#334155']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleLanguageChange}
            accessible={true}
            accessibilityLabel="Select language"
            accessibilityRole="button"
          >
            <Ionicons name="language" size={24} color="white" />
          </TouchableOpacity>
          
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

        <View style={styles.content}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.logoContainer}>
              <View style={styles.armorLogo}>
                <LinearGradient
                  colors={['#3b82f6', '#1d4ed8', '#1e40af']}
                  style={styles.armorOuter}
                >
                  <View style={styles.armorInner}>
                    <Text style={styles.tideIcon}>🌊</Text>
                    <View style={styles.armorDetails}>
                      <View style={styles.armorLine} />
                      <View style={styles.armorLine} />
                      <View style={styles.armorLine} />
                    </View>
                  </View>
                </LinearGradient>
              </View>
            </View>
            
            <Text style={[styles.appName, { fontSize: getFontSize() * 2.5 }]}>
              Coast-कवच
            </Text>
            
            <Text style={[styles.tagline, { fontSize: getFontSize() * 1.2 }]}>
              India's Coastal Disaster Response Platform
            </Text>
            
            <Text style={[styles.description, { fontSize: getFontSize() * 1.1 }]}>
              Real-time warnings, community reports, and emergency response for India's 7,500+ km coastline
            </Text>
          </View>


          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.primaryButton, styles.loginButton]}
              onPress={() => handleButtonPress('login')}
              accessible={true}
              accessibilityLabel="Login to Coast-Kavach"
              accessibilityRole="button"
              accessibilityHint="Access your account and emergency features"
            >
              <LinearGradient
                colors={['#3b82f6', '#1d4ed8', '#1e40af']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="log-in" size={28} color="white" />
                <Text style={[styles.buttonText, { fontSize: getFontSize() * 1.3 }]}>
                  LOGIN
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryButton, styles.signupButton]}
              onPress={() => handleButtonPress('signup')}
              accessible={true}
              accessibilityLabel="Create new account"
              accessibilityRole="button"
              accessibilityHint="Register for Coast-Kavach to report hazards and receive warnings"
            >
              <LinearGradient
                colors={['#10b981', '#059669', '#047857']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="person-add" size={28} color="white" />
                <Text style={[styles.buttonText, { fontSize: getFontSize() * 1.3 }]}>
                  CREATE ACCOUNT
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryButton, styles.adminButton]}
              onPress={() => handleButtonPress('admin')}
              accessible={true}
              accessibilityLabel="Admin access"
              accessibilityRole="button"
              accessibilityHint="Access administrative features for marine workers and officials"
            >
              <Ionicons name="shield" size={24} color="white" />
              <Text style={[styles.secondaryButtonText, { fontSize: getFontSize() * 1.1 }]}>
                Marine Worker / Admin Access
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryButton, styles.restartButton]}
              onPress={handleRestart}
              accessible={true}
              accessibilityLabel="Restart application"
              accessibilityRole="button"
              accessibilityHint="Return to the beginning of the application"
            >
              <Ionicons name="refresh" size={24} color="white" />
              <Text style={[styles.secondaryButtonText, { fontSize: getFontSize() * 1.1 }]}>
                Restart App
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { fontSize: getFontSize() }]}>
              Developed for India's Coastal Communities
            </Text>
            <Text style={[styles.footerSubtext, { fontSize: getFontSize() * 0.9 }]}>
              In partnership with IMD, NDMA, and State Disaster Management Authorities
            </Text>
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
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  headerButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    justifyContent: 'space-between',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingTop: spacing.lg,
  },
  logoContainer: {
    marginBottom: spacing.lg,
  },
  armorLogo: {
    ...shadows.xl,
  },
  armorOuter: {
    width: 140,
    height: 140,
    borderRadius: 20,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  armorInner: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  tideIcon: {
    fontSize: 50,
    marginBottom: 8,
  },
  armorDetails: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  armorLine: {
    width: 8,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 1,
  },
  scrollIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    opacity: 0.8,
  },
  scrollText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginRight: 8,
  },
  appName: {
    fontFamily: typography.fontFamily.bold,
    color: 'white',
    textAlign: 'center',
    marginBottom: spacing.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontFamily: typography.fontFamily.semiBold,
    color: 'white',
    textAlign: 'center',
    marginBottom: spacing.md,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  description: {
    fontFamily: typography.fontFamily.medium,
    color: 'white',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: spacing.md,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  statsSection: {
    marginBottom: spacing['3xl'],
  },
  statsTitle: {
    fontFamily: typography.fontFamily.bold,
    color: 'white',
    textAlign: 'center',
    marginBottom: spacing.lg,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  statCard: {
    width: (width - spacing.lg * 2 - spacing.md) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: typography.fontFamily.bold,
    color: '#3b82f6',
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontFamily: typography.fontFamily.medium,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  featuresSection: {
    marginBottom: spacing['3xl'],
  },
  featuresTitle: {
    fontFamily: typography.fontFamily.bold,
    color: 'white',
    textAlign: 'center',
    marginBottom: spacing.lg,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  featuresList: {
    gap: spacing.md,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: typography.fontFamily.bold,
    color: 'white',
    marginBottom: spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  featureDescription: {
    fontFamily: typography.fontFamily.medium,
    color: 'white',
    lineHeight: 22,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  buttonContainer: {
    marginBottom: spacing.lg,
  },
  primaryButton: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.md,
    elevation: 4,
  },
  loginButton: {
    // Styles handled by gradient
  },
  signupButton: {
    // Styles handled by gradient
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    minHeight: 50,
  },
  buttonText: {
    fontFamily: typography.fontFamily.bold,
    marginLeft: spacing.md,
    letterSpacing: 1,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    ...shadows.sm,
  },
  adminButton: {
    // Styles handled by secondaryButton
  },
  restartButton: {
    // Styles handled by secondaryButton
  },
  secondaryButtonText: {
    fontFamily: typography.fontFamily.semiBold,
    color: 'white',
    marginLeft: spacing.md,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  footer: {
    alignItems: 'center',
    paddingTop: spacing.lg,
  },
  footerText: {
    fontFamily: typography.fontFamily.semiBold,
    color: 'white',
    textAlign: 'center',
    marginBottom: spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  footerSubtext: {
    fontFamily: typography.fontFamily.medium,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});

export default LandingScreen;