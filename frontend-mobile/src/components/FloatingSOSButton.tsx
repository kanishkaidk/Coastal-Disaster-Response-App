import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const FloatingSOSButton: React.FC = () => {
  const navigation = useNavigation();

  const handleSOSPress = () => {
    navigation.navigate('SOS' as never);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleSOSPress}
      accessible={true}
      accessibilityLabel="Emergency SOS"
      accessibilityRole="button"
    >
      <LinearGradient
        colors={['#dc2626', '#ef4444']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Ionicons name="help" size={32} color="white" />
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    right: 16,
    width: 64,
    height: 64,
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 50,
  },
  gradient: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FloatingSOSButton;
