import React from 'react';
import { Ionicons } from '@expo/vector-icons';

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

  return (
    <Ionicons
      name={getIconName(route.name)}
      size={size}
      color={color}
    />
  );
};

export default TabBarIcon;
