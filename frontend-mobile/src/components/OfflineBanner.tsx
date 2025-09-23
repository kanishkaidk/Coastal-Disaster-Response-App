import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, borderRadius, spacing, shadows } from '../theme/theme';

interface OfflineBannerProps {
  visible: boolean;
  style?: any;
}

const OfflineBanner: React.FC<OfflineBannerProps> = ({ visible, style }) => {
  if (!visible) return null;

  return (
    <View style={[styles.banner, shadows.sm, style]}>
      <View style={styles.bannerContent}>
        <View style={styles.iconContainer}>
          <Ionicons name="cloud-offline" size={20} color={colors.warning} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Offline Mode</Text>
          <Text style={styles.subtitle}>
            Your request will be queued and sent when connection is restored
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.warningLight + '20',
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  iconContainer: {
    marginRight: spacing.sm,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.sm,
    color: colors.warningDark,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.warningDark,
    lineHeight: typography.lineHeight.normal * typography.fontSize.xs,
  },
});

export default OfflineBanner;
