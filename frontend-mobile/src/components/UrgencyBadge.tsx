import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, borderRadius, spacing } from '../theme/theme';

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

interface UrgencyBadgeProps {
  urgency: UrgencyLevel;
  size?: 'small' | 'medium' | 'large';
  style?: any;
}

const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ 
  urgency, 
  size = 'medium',
  style 
}) => {
  const getUrgencyConfig = (level: UrgencyLevel) => {
    switch (level) {
      case 'low':
        return {
          color: colors.primary,
          backgroundColor: colors.primaryLight + '20',
          text: 'Low',
          icon: '🟦'
        };
      case 'medium':
        return {
          color: colors.warning,
          backgroundColor: colors.warningLight + '20',
          text: 'Medium',
          icon: '🟨'
        };
      case 'high':
        return {
          color: colors.warningDark,
          backgroundColor: colors.warning + '20',
          text: 'High',
          icon: '🟧'
        };
      case 'critical':
        return {
          color: colors.emergency,
          backgroundColor: colors.emergencyLight + '20',
          text: 'Critical',
          icon: '🟥'
        };
      default:
        return {
          color: colors.primary,
          backgroundColor: colors.primaryLight + '20',
          text: 'Low',
          icon: '🟦'
        };
    }
  };

  const config = getUrgencyConfig(urgency);
  const sizeConfig = {
    small: { padding: spacing.xs, fontSize: typography.fontSize.xs },
    medium: { padding: spacing.sm, fontSize: typography.fontSize.sm },
    large: { padding: spacing.md, fontSize: typography.fontSize.base }
  };

  const currentSize = sizeConfig[size];

  return (
    <View 
      style={[
        styles.badge,
        {
          backgroundColor: config.backgroundColor,
          paddingHorizontal: currentSize.padding,
          paddingVertical: currentSize.padding / 2,
        },
        style
      ]}
    >
      <Text style={[styles.icon, { fontSize: currentSize.fontSize }]}>
        {config.icon}
      </Text>
      <Text 
        style={[
          styles.text,
          {
            color: config.color,
            fontSize: currentSize.fontSize,
          }
        ]}
      >
        {config.text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: spacing.xs,
  },
  text: {
    fontFamily: typography.fontFamily.semiBold,
    fontWeight: '600',
  },
});

export default UrgencyBadge;
