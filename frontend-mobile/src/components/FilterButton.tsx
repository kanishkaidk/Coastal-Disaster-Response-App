import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, borderRadius, spacing, shadows } from '../theme/theme';

interface FilterButtonProps {
  onPress: () => void;
  activeFilters?: number;
  style?: any;
}

const FilterButton: React.FC<FilterButtonProps> = ({ 
  onPress, 
  activeFilters = 0,
  style 
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, shadows.md, style]}
      onPress={onPress}
      accessibilityLabel="Filter requests"
      accessibilityRole="button"
      accessibilityHint="Opens filter options for nearby requests"
    >
      <Ionicons name="filter" size={20} color={colors.primary} />
      {activeFilters > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{activeFilters}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    backgroundColor: colors.background,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.emergency,
    borderRadius: borderRadius.full,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  badgeText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.xs,
    color: colors.background,
  },
});

export default FilterButton;
