import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
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
            <Ionicons name="language" size={20} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleAccessibilityToggle}
            accessible={true}
            accessibilityLabel="Accessibility settings"
            accessibilityRole="button"
          >
            <Ionicons name="accessibility" size={20} color="white" />
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
                    <View style={styles.waveContainer}>
                      <Text style={styles.waveIcon}>🌊</Text>
                      <View style={styles.waveEffect} />
                    </View>
                    <View style={styles.armorDetails}>
                      <View style={styles.armorLine} />
                      <View style={styles.armorLine} />
                      <View style={styles.armorLine} />
                    </View>
                  </View>
                </LinearGradient>
              </View>
            </View>
            
            <Text style={[styles.appName, { fontSize: getFontSize() * 2.2 }]}>
              Coast-कवच
            </Text>
            
            <Text style={[styles.tagline, { fontSize: getFontSize() * 1.1 }]}>
              India's Coastal Disaster Response Platform
            </Text>
            
            <Text style={[styles.description, { fontSize: getFontSize() * 0.95 }]}>
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
                <Ionicons name="log-in" size={22} color="white" />
                <Text style={[styles.buttonText, { fontSize: getFontSize() * 1.1 }]}>
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
                <Ionicons name="person-add" size={22} color="white" />
                <Text style={[styles.buttonText, { fontSize: getFontSize() * 1.1 }]}>
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
              <Ionicons name="shield" size={20} color="white" />
              <Text style={[styles.secondaryButtonText, { fontSize: getFontSize() * 0.95 }]}>
                Sign in as Admin
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
              <Ionicons name="refresh" size={20} color="white" />
              <Text style={[styles.secondaryButtonText, { fontSize: getFontSize() * 0.95 }]}>
                Restart App
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { fontSize: getFontSize() * 0.9 }]}>
              Developed for India's Coastal Communities
            </Text>
            <Text style={[styles.footerSubtext, { fontSize: getFontSize() * 0.8 }]}>
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
    paddingBottom: spacing.sm,
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
    marginBottom: spacing.md,
    paddingTop: spacing.sm,
  },
  logoContainer: {
    marginBottom: spacing.md,
  },
  armorLogo: {
    ...shadows.xl,
  },
  armorOuter: {
    width: 120,
    height: 120,
    borderRadius: 25,
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  armorInner: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  waveContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveIcon: {
    fontSize: 45,
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  waveEffect: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.4)',
  },
  armorDetails: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    right: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  armorLine: {
    width: 6,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 1,
  },
  appName: {
    fontFamily: typography.fontFamily.bold,
    color: 'white',
    textAlign: 'center',
    marginBottom: spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontFamily: typography.fontFamily.semiBold,
    color: 'white',
    textAlign: 'center',
    marginBottom: spacing.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  description: {
    fontFamily: typography.fontFamily.medium,
    color: 'white',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.md,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  buttonContainer: {
    marginBottom: spacing.md,
  },
  primaryButton: {
    marginBottom: spacing.sm,
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
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    minHeight: 44,
  },
  buttonText: {
    fontFamily: typography.fontFamily.bold,
    marginLeft: spacing.sm,
    letterSpacing: 0.5,
    color: 'white',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: spacing.xs,
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
    marginLeft: spacing.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  footer: {
    alignItems: 'center',
    paddingTop: spacing.md,
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