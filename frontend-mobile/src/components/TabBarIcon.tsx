import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface TabBarIconProps {
  route: any;
  focused: boolean;
  color: string;
  size: number;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({ route, focused, color, size }) => {
  const getIconName = (routeName: string) => {
    switch (routeName) {
      case 'Home':
        return focused ? 'home' : 'home-outline';
      case 'Map':
        return focused ? 'map' : 'map-outline';
      case 'Report':
        return focused ? 'warning' : 'warning-outline';
      case 'Resources':
        return focused ? 'hand-left' : 'hand-left-outline';
      case 'Profile':
        return focused ? 'person' : 'person-outline';
      case 'Admin':
        return focused ? 'settings' : 'settings-outline';
      default:
        return 'help-outline';
    }
  };

  const getGradientColors = (routeName: string): [string, string] => {
    switch (routeName) {
      case 'Home':
        return ['#3b82f6', '#1d4ed8'];
      case 'Map':
        return ['#10b981', '#059669'];
      case 'Report':
        return ['#f59e0b', '#f97316'];
      case 'Resources':
        return ['#8b5cf6', '#7c3aed'];
      case 'Profile':
        return ['#ef4444', '#dc2626'];
      case 'Admin':
        return ['#6b7280', '#4b5563'];
      default:
        return ['#6b7280', '#4b5563'];
    }
  };

  return (
    <View style={[styles.iconContainer, focused && styles.focusedContainer]}>
      {focused ? (
        <LinearGradient
          colors={getGradientColors(route.name)}
          style={styles.gradientContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons
            name={getIconName(route.name)}
            size={size + 4}
            color="white"
          />
        </LinearGradient>
      ) : (
        <Ionicons
          name={getIconName(route.name)}
          size={size}
          color={color}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  focusedContainer: {
    transform: [{ translateY: -3 }],
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  gradientContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TabBarIcon;
