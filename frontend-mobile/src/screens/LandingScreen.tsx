import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useAccessibilityStore } from '../stores/accessibilityStore';
import { colors, typography, spacing, borderRadius, shadows } from '../theme/theme';

const { width, height } = Dimensions.get('window');

const LandingScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { speak, hapticFeedback, getFontSize } = useAccessibilityStore();

  useEffect(() => {
    // Welcome message
    speak(t('welcome'), { priority: 'high' });
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={colors.gradients.ocean}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Subtle Wave */}
        <View style={styles.wave} />
        
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          accessible={true}
          accessibilityLabel="Landing screen content"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.languageButton}
              onPress={handleLanguageChange}
              accessible={true}
              accessibilityLabel={t('selectLanguage')}
              accessibilityRole="button"
            >
              <Ionicons name="language" size={24} color={colors.background} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.accessibilityButton}
              onPress={handleAccessibilityToggle}
              accessible={true}
              accessibilityLabel={t('accessibility')}
              accessibilityRole="button"
            >
              <Ionicons name="accessibility" size={24} color={colors.background} />
            </TouchableOpacity>
          </View>

          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={[colors.background, colors.gray100]}
                style={styles.logo}
              >
                <Text style={[styles.logoText, { fontSize: getFontSize() * 2 }]}>
                  🌊
                </Text>
              </LinearGradient>
            </View>
            
            <Text style={[styles.appName, { fontSize: getFontSize() * 2.5 }]}>
              {t('appName')}
            </Text>
            
            <Text style={[styles.tagline, { fontSize: getFontSize() * 1.2 }]}>
              {t('tagline')}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.primaryButton, styles.loginButton]}
              onPress={() => handleButtonPress('login')}
              accessible={true}
              accessibilityLabel={t('login')}
              accessibilityRole="button"
              accessibilityHint="Navigate to login screen"
            >
              <LinearGradient
                colors={[colors.background, colors.gray100]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="log-in" size={24} color={colors.primary} />
                <Text style={[styles.buttonText, { color: colors.primary, fontSize: getFontSize() * 1.1 }]}>
                  {t('login')}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryButton, styles.signupButton]}
              onPress={() => handleButtonPress('signup')}
              accessible={true}
              accessibilityLabel={t('signUp')}
              accessibilityRole="button"
              accessibilityHint="Navigate to sign up screen"
            >
              <LinearGradient
                colors={[colors.success, colors.successLight]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="person-add" size={24} color={colors.background} />
                <Text style={[styles.buttonText, { color: colors.background, fontSize: getFontSize() * 1.1 }]}>
                  {t('signUp')}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryButton, styles.adminButton]}
              onPress={() => handleButtonPress('admin')}
              accessible={true}
              accessibilityLabel={t('adminLogin')}
              accessibilityRole="button"
              accessibilityHint="Navigate to admin login"
            >
              <Ionicons name="shield" size={20} color={colors.background} />
              <Text style={[styles.secondaryButtonText, { fontSize: getFontSize() }]}>
                {t('adminLogin')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Features Preview */}
          <View style={styles.featuresContainer}>
            <Text style={[styles.featuresTitle, { fontSize: getFontSize() * 1.3 }]}>
              Stay Safe, Stay Connected
            </Text>
            
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Ionicons name="warning" size={24} color={colors.background} />
                <Text style={[styles.featureText, { fontSize: getFontSize() }]}>
                  Real-time warnings
                </Text>
              </View>
              
              <View style={styles.featureItem}>
                <Ionicons name="people" size={24} color={colors.background} />
                <Text style={[styles.featureText, { fontSize: getFontSize() }]}>
                  Community support
                </Text>
              </View>
              
              <View style={styles.featureItem}>
                <Ionicons name="accessibility" size={24} color={colors.background} />
                <Text style={[styles.featureText, { fontSize: getFontSize() }]}>
                  Fully accessible
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
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
  wave: {
    position: 'absolute',
    top: height * 0.3,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 50,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    marginBottom: spacing.xl,
  },
  languageButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  accessibilityButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },
  logoContainer: {
    marginBottom: spacing.lg,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.lg,
  },
  logoText: {
    fontSize: 60,
  },
  appName: {
    fontFamily: typography.fontFamily.bold,
    color: colors.background,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  tagline: {
    fontFamily: typography.fontFamily.medium,
    color: colors.background,
    textAlign: 'center',
    opacity: 0.9,
  },
  buttonContainer: {
    marginBottom: spacing['3xl'],
  },
  primaryButton: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.xl,
    ...shadows.md,
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
    borderRadius: borderRadius.xl,
  },
  buttonText: {
    fontFamily: typography.fontFamily.semiBold,
    marginLeft: spacing.sm,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.background,
  },
  adminButton: {
    // Styles handled by secondaryButton
  },
  secondaryButtonText: {
    fontFamily: typography.fontFamily.medium,
    color: colors.background,
    marginLeft: spacing.sm,
  },
  featuresContainer: {
    alignItems: 'center',
  },
  featuresTitle: {
    fontFamily: typography.fontFamily.semiBold,
    color: colors.background,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  featuresList: {
    width: '100%',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.lg,
  },
  featureText: {
    fontFamily: typography.fontFamily.medium,
    color: colors.background,
    marginLeft: spacing.md,
    flex: 1,
  },
});

export default LandingScreen;
