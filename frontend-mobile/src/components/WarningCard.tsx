import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface Warning {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  area: string;
  expiresAt: string;
  source: string;
  trustScore: number;
  aiSummary: string;
  translations: Record<string, string>;
}

interface WarningCardProps {
  warning: Warning;
  onPress: () => void;
}

const WarningCard: React.FC<WarningCardProps> = ({ warning, onPress }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'from-red-600 to-red-500';
      case 'high':
        return 'from-orange-600 to-orange-500';
      case 'medium':
        return 'from-yellow-600 to-yellow-500';
      case 'low':
        return 'from-blue-600 to-blue-500';
      default:
        return 'from-gray-600 to-gray-500';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'alert-circle';
      case 'high':
        return 'warning';
      case 'medium':
        return 'information-circle';
      case 'low':
        return 'checkmark-circle';
      default:
        return 'help-circle';
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      accessible={true}
      accessibilityLabel={`Warning: ${warning.title}`}
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
              name={getSeverityIcon(warning.severity) as any} 
              size={24} 
              color={warning.severity === 'critical' ? '#dc2626' : warning.severity === 'high' ? '#ea580c' : '#0369a1'} 
            />
            <Text style={styles.title}>
              {warning.title}
            </Text>
          </View>
          <View style={styles.trustBadge}>
            <Text style={styles.trustText}>
              {warning.trustScore}% Trust
            </Text>
          </View>
        </View>
        
        <Text style={styles.description}>
          {warning.description}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.infoContainer}>
            <Ionicons name="location" size={16} color="#6b7280" />
            <Text style={styles.infoText}>
              {warning.area}
            </Text>
          </View>
          
          <View style={styles.infoContainer}>
            <Ionicons name="shield" size={16} color="#6b7280" />
            <Text style={styles.infoText}>
              {warning.source}
            </Text>
          </View>
        </View>
        
        <View style={[styles.severityBar, { backgroundColor: warning.severity === 'critical' ? '#dc2626' : warning.severity === 'high' ? '#ea580c' : '#0369a1' }]} />
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  },
  trustBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trustText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#166534',
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

export default WarningCard;
