import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// Coast-Kavach Brand Colors
export const colors = {
  // Primary Ocean Blue
  primary: '#0369A1',
  primaryLight: '#0EA5E9',
  primaryDark: '#075985',
  
  // Emergency Red
  emergency: '#DC2626',
  emergencyLight: '#EF4444',
  emergencyDark: '#B91C1C',
  
  // Warning Orange
  warning: '#EA580C',
  warningLight: '#F97316',
  warningDark: '#C2410C',
  
  // Success Green
  success: '#059669',
  successLight: '#10B981',
  successDark: '#047857',
  
  // Neutral Grays
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  
  // Background
  background: '#FFFFFF',
  surface: '#F9FAFB',
  surfaceVariant: '#F3F4F6',
  
  // Text
  onBackground: '#111827',
  onSurface: '#374151',
  onSurfaceVariant: '#6B7280',
  
  // High Contrast
  highContrast: {
    background: '#000000',
    surface: '#1A1A1A',
    text: '#FFFFFF',
    primary: '#FFFFFF',
    accent: '#00FF00',
  },
  
  // Gradients
  gradients: {
    primary: ['#0369A1', '#0EA5E9'],
    emergency: ['#DC2626', '#EF4444'],
    warning: ['#EA580C', '#F97316'],
    success: ['#059669', '#10B981'],
    ocean: ['#0369A1', '#0EA5E9', '#7DD3FC'],
    sunset: ['#F97316', '#EF4444', '#DC2626'],
    calm: ['#10B981', '#34D399', '#6EE7B7'],
  },
};

// Typography
export const typography = {
  fontFamily: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semiBold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

// Border Radius
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

// Shadows
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
};

// Animation Durations
export const animations = {
  fast: 150,
  normal: 300,
  slow: 500,
  verySlow: 1000,
};

// Accessibility
export const accessibility = {
  minTouchTarget: 44,
  highContrastRatio: 4.5,
  largeText: 18,
  extraLargeText: 24,
};

// Light Theme
export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    primaryContainer: colors.primaryLight,
    secondary: colors.success,
    secondaryContainer: colors.successLight,
    tertiary: colors.warning,
    tertiaryContainer: colors.warningLight,
    error: colors.emergency,
    errorContainer: colors.emergencyLight,
    background: colors.background,
    surface: colors.surface,
    surfaceVariant: colors.surfaceVariant,
    onBackground: colors.onBackground,
    onSurface: colors.onSurface,
    onSurfaceVariant: colors.onSurfaceVariant,
  },
  fonts: {
    ...MD3LightTheme.fonts,
    bodyLarge: {
      ...MD3LightTheme.fonts.bodyLarge,
      fontFamily: typography.fontFamily.regular,
      fontSize: typography.fontSize.lg,
    },
    bodyMedium: {
      ...MD3LightTheme.fonts.bodyMedium,
      fontFamily: typography.fontFamily.regular,
      fontSize: typography.fontSize.base,
    },
    bodySmall: {
      ...MD3LightTheme.fonts.bodySmall,
      fontFamily: typography.fontFamily.regular,
      fontSize: typography.fontSize.sm,
    },
    headlineLarge: {
      ...MD3LightTheme.fonts.headlineLarge,
      fontFamily: typography.fontFamily.bold,
      fontSize: typography.fontSize['4xl'],
    },
    headlineMedium: {
      ...MD3LightTheme.fonts.headlineMedium,
      fontFamily: typography.fontFamily.bold,
      fontSize: typography.fontSize['3xl'],
    },
    headlineSmall: {
      ...MD3LightTheme.fonts.headlineSmall,
      fontFamily: typography.fontFamily.semiBold,
      fontSize: typography.fontSize['2xl'],
    },
    titleLarge: {
      ...MD3LightTheme.fonts.titleLarge,
      fontFamily: typography.fontFamily.semiBold,
      fontSize: typography.fontSize.xl,
    },
    titleMedium: {
      ...MD3LightTheme.fonts.titleMedium,
      fontFamily: typography.fontFamily.medium,
      fontSize: typography.fontSize.lg,
    },
    titleSmall: {
      ...MD3LightTheme.fonts.titleSmall,
      fontFamily: typography.fontFamily.medium,
      fontSize: typography.fontSize.base,
    },
  },
};

// Dark Theme
export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.primaryLight,
    primaryContainer: colors.primary,
    secondary: colors.successLight,
    secondaryContainer: colors.success,
    tertiary: colors.warningLight,
    tertiaryContainer: colors.warning,
    error: colors.emergencyLight,
    errorContainer: colors.emergency,
    background: colors.gray900,
    surface: colors.gray800,
    surfaceVariant: colors.gray700,
    onBackground: colors.gray50,
    onSurface: colors.gray100,
    onSurfaceVariant: colors.gray300,
  },
  fonts: lightTheme.fonts,
};

// High Contrast Theme
export const highContrastTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: colors.highContrast.primary,
    background: colors.highContrast.background,
    surface: colors.highContrast.surface,
    onBackground: colors.highContrast.text,
    onSurface: colors.highContrast.text,
    onSurfaceVariant: colors.highContrast.text,
  },
};

export const theme = lightTheme;
