import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface Hazard {
  id: string;
  type: 'flood' | 'storm' | 'tsunami' | 'cyclone' | 'other';
  description: string;
  location: string;
  distance: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  trustScore: number;
  crowdCount: number;
  reportedAt: string;
  aiSummary: string;
}

interface HazardCardProps {
  hazard: Hazard;
  onPress: () => void;
}

const HazardCard: React.FC<HazardCardProps> = ({ hazard, onPress }) => {
  const getHazardIcon = (type: string) => {
    switch (type) {
      case 'flood':
        return 'water';
      case 'storm':
        return 'thunderstorm';
      case 'tsunami':
        return 'wave';
      case 'cyclone':
        return 'tornado';
      default:
        return 'warning';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'from-red-500 to-red-400';
      case 'high':
        return 'from-orange-500 to-orange-400';
      case 'medium':
        return 'from-yellow-500 to-yellow-400';
      case 'low':
        return 'from-blue-500 to-blue-400';
      default:
        return 'from-gray-500 to-gray-400';
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      accessible={true}
      accessibilityLabel={`Hazard: ${hazard.type}`}
      accessibilityRole="button"
    >
      <LinearGradient
        colors={['#ffffff', '#f9fafb']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Ionicons 
              name={getHazardIcon(hazard.type) as any} 
              size={24} 
              color="#0369a1" 
            />
            <Text style={styles.title}>
              {hazard.type}
            </Text>
          </View>
          <View style={styles.trustBadge}>
            <Text style={styles.trustText}>
              {hazard.trustScore}% Trust
            </Text>
          </View>
        </View>
        
        <Text style={styles.description}>
          {hazard.description}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.infoContainer}>
            <Ionicons name="location" size={16} color="#6b7280" />
            <Text style={styles.infoText}>
              {hazard.location} • {hazard.distance}km
            </Text>
          </View>
          
          <View style={styles.infoContainer}>
            <Ionicons name="people" size={16} color="#6b7280" />
            <Text style={styles.infoText}>
              {hazard.crowdCount} reports
            </Text>
          </View>
        </View>
        
        <View style={[styles.severityBar, { backgroundColor: hazard.severity === 'critical' ? '#dc2626' : hazard.severity === 'high' ? '#ea580c' : '#0369a1' }]} />
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  gradient: {
    padding: 16,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#111827',
    marginLeft: 8,
    textTransform: 'capitalize',
  },
  trustBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trustText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#1e40af',
  },
  description: {
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  severityBar: {
    height: 4,
    borderRadius: 2,
    marginTop: 12,
  },
});

export default HazardCard;
