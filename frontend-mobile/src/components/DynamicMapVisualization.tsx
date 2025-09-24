import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../theme/theme';

const { width } = Dimensions.get('window');

interface HazardData {
  id: string;
  type: 'flood' | 'storm' | 'tsunami' | 'cyclone' | 'oil_spill' | 'marine_pollution';
  severity: 'low' | 'medium' | 'high' | 'critical';
  latitude: number;
  longitude: number;
  timestamp: Date;
  affectedArea: number;
  populationAtRisk: number;
  status: 'active' | 'warning' | 'resolved';
}

interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  waveHeight: number;
  tideLevel: number;
  visibility: number;
}

interface EmergencyData {
  id: string;
  type: string;
  location: string;
  timestamp: Date;
  responseTime: number;
  status: 'pending' | 'in_progress' | 'resolved';
}

const DynamicMapVisualization: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedLayer, setSelectedLayer] = useState<'hazards' | 'weather' | 'emergency'>('hazards');
  const [animationPhase, setAnimationPhase] = useState(0);
  
  // Demo data generator
  // Mock data generation (replace with actual data source)
  const [hazards, setHazards] = useState<HazardData[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [emergencies, setEmergencies] = useState<EmergencyData[]>([]);
  const [stats, setStats] = useState<any>({});

  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initialize demo data
    const initializeData = () => {
      // Initialize with empty data (replace with actual API calls)
      setHazards([]);
      setWeatherData([]);
      setEmergencies([]);
      setStats({});
    };

    initializeData();

    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Animation loop
    const animationTimer = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 2000);

    // Real-time data updates (disabled - replace with actual API calls)
    const dataUpdateTimer = null;

    // Start animations
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    return () => {
      clearInterval(timer);
      clearInterval(animationTimer);
      if (dataUpdateTimer) clearInterval(dataUpdateTimer);
    };
  }, []);

  const getHazardIcon = (type: string) => {
    switch (type) {
      case 'flood': return 'water';
      case 'storm': return 'thunderstorm';
      case 'tsunami': return 'flash';
      case 'cyclone': return 'tornado';
      default: return 'warning';
    }
  };

  const getHazardColor = (severity: string) => {
    switch (severity) {
      case 'low': return colors.success;
      case 'medium': return colors.warning;
      case 'high': return colors.emergency;
      case 'critical': return colors.emergencyDark;
      default: return colors.primary;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return colors.emergency;
      case 'warning': return colors.warning;
      case 'resolved': return colors.success;
      case 'pending': return colors.warning;
      case 'in_progress': return colors.primary;
      default: return colors.gray500;
    }
  };

  const renderMapLayer = () => {
    switch (selectedLayer) {
      case 'hazards':
        return (
          <View style={styles.mapLayer}>
            <Text style={styles.layerTitle}>Hazard Monitoring</Text>
            <View style={styles.mapGrid}>
              {hazards.map((hazard, index) => (
                <Animated.View
                  key={hazard.id}
                  style={[
                    styles.hazardMarker,
                    {
                      backgroundColor: getHazardColor(hazard.severity),
                      transform: [{ scale: pulseAnim }],
                    },
                  ]}
                >
                  <Ionicons
                    name={getHazardIcon(hazard.type) as any}
                    size={16}
                    color="#FFFFFF"
                  />
                </Animated.View>
              ))}
            </View>
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: colors.success }]} />
                <Text style={styles.legendText}>Low Risk</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: colors.warning }]} />
                <Text style={styles.legendText}>Medium Risk</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: colors.emergency }]} />
                <Text style={styles.legendText}>High Risk</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: colors.emergencyDark }]} />
                <Text style={styles.legendText}>Critical</Text>
              </View>
            </View>
          </View>
        );
      
      case 'weather':
        return (
          <View style={styles.mapLayer}>
            <Text style={styles.layerTitle}>Weather Monitoring</Text>
            <View style={styles.weatherGrid}>
              {weatherData.map((weather, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.weatherCard,
                    {
                      opacity: fadeAnim,
                      transform: [{
                        translateX: slideAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 20 * (index % 2 === 0 ? 1 : -1)],
                        }),
                      }],
                    },
                  ]}
                >
                  <Text style={styles.weatherLocation}>{weather.location}</Text>
                  <View style={styles.weatherMetrics}>
                    <View style={styles.metric}>
                      <Ionicons name="thermometer" size={16} color={colors.primary} />
                      <Text style={styles.metricText}>{weather.temperature}°C</Text>
                    </View>
                    <View style={styles.metric}>
                      <Ionicons name="water" size={16} color={colors.primary} />
                      <Text style={styles.metricText}>{weather.humidity}%</Text>
                    </View>
                    <View style={styles.metric}>
                      <Ionicons name="leaf" size={16} color={colors.primary} />
                      <Text style={styles.metricText}>{weather.windSpeed} km/h</Text>
                    </View>
                    <View style={styles.metric}>
                      <Ionicons name="water" size={16} color={colors.primary} />
                      <Text style={styles.metricText}>{weather.waveHeight}m</Text>
                    </View>
                  </View>
                </Animated.View>
              ))}
            </View>
          </View>
        );
      
      case 'emergency':
        return (
          <View style={styles.mapLayer}>
            <Text style={styles.layerTitle}>Emergency Response</Text>
            <View style={styles.emergencyGrid}>
              {emergencies.map((emergency, index) => (
                <Animated.View
                  key={emergency.id}
                  style={[
                    styles.emergencyCard,
                    {
                      borderLeftColor: getStatusColor(emergency.status),
                      opacity: fadeAnim,
                    },
                  ]}
                >
                  <View style={styles.emergencyHeader}>
                    <Ionicons name="alert-circle" size={20} color={getStatusColor(emergency.status)} />
                    <Text style={styles.emergencyType}>{emergency.type}</Text>
                  </View>
                  <Text style={styles.emergencyLocation}>{emergency.location}</Text>
                  <View style={styles.emergencyDetails}>
                    <Text style={styles.emergencyTime}>
                      {emergency.timestamp.toLocaleTimeString()}
                    </Text>
                    <Text style={[
                      styles.emergencyStatus,
                      { color: getStatusColor(emergency.status) }
                    ]}>
                      {emergency.status.replace('_', ' ').toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.responseTimeContainer}>
                    <Text style={styles.responseTimeLabel}>Response Time:</Text>
                    <Text style={styles.responseTimeValue}>{emergency.responseTime} min</Text>
                  </View>
                </Animated.View>
              ))}
            </View>
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="map" size={24} color={colors.primary} />
          <Text style={styles.title}>Dynamic Map Visualization</Text>
        </View>
        <View style={styles.timeContainer}>
          <Ionicons name="time" size={16} color={colors.gray500} />
          <Text style={styles.timeText}>
            {currentTime.toLocaleTimeString()}
          </Text>
        </View>
      </View>

      <View style={styles.layerTabs}>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedLayer === 'hazards' && styles.activeTab,
          ]}
          onPress={() => setSelectedLayer('hazards')}
        >
          <Ionicons name="warning" size={20} color={selectedLayer === 'hazards' ? colors.background : colors.primary} />
          <Text style={[
            styles.tabText,
            selectedLayer === 'hazards' && styles.activeTabText,
          ]}>
            Hazards
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            selectedLayer === 'weather' && styles.activeTab,
          ]}
          onPress={() => setSelectedLayer('weather')}
        >
          <Ionicons name="cloud" size={20} color={selectedLayer === 'weather' ? colors.background : colors.primary} />
          <Text style={[
            styles.tabText,
            selectedLayer === 'weather' && styles.activeTabText,
          ]}>
            Weather
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            selectedLayer === 'emergency' && styles.activeTab,
          ]}
          onPress={() => setSelectedLayer('emergency')}
        >
          <Ionicons name="medical" size={20} color={selectedLayer === 'emergency' ? colors.background : colors.primary} />
          <Text style={[
            styles.tabText,
            selectedLayer === 'emergency' && styles.activeTabText,
          ]}>
            Emergency
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.mapContainer} showsVerticalScrollIndicator={false}>
        {renderMapLayer()}
        
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Real-time Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="people" size={24} color={colors.primary} />
              <Text style={styles.statValue}>{stats.totalAlertsProcessed?.toLocaleString() || '0'}</Text>
              <Text style={styles.statLabel}>Alerts Processed</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="time" size={24} color={colors.warning} />
              <Text style={styles.statValue}>{stats.averageResponseTime || '0m'}</Text>
              <Text style={styles.statLabel}>Avg Response Time</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="shield-checkmark" size={24} color={colors.success} />
              <Text style={styles.statValue}>{stats.systemAccuracy || '0%'}</Text>
              <Text style={styles.statLabel}>System Accuracy</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="heart" size={24} color={colors.emergency} />
              <Text style={styles.statValue}>{stats.livesSaved || '0'}</Text>
              <Text style={styles.statLabel}>Lives Saved</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="location" size={24} color={colors.primary} />
              <Text style={styles.statValue}>{stats.coastalAreasMonitored || '0'}</Text>
              <Text style={styles.statLabel}>Areas Monitored</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="checkmark-circle" size={24} color={colors.success} />
              <Text style={styles.statValue}>{stats.uptime || '0%'}</Text>
              <Text style={styles.statLabel}>System Uptime</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
    ...shadows.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.onBackground,
    marginLeft: spacing.sm,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray500,
    marginLeft: spacing.xs,
    fontFamily: 'monospace',
  },
  layerTabs: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.xs,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  activeTabText: {
    color: colors.background,
  },
  mapContainer: {
    flex: 1,
    padding: spacing.lg,
  },
  mapLayer: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  layerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.onBackground,
    marginBottom: spacing.lg,
  },
  mapGrid: {
    height: 200,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    position: 'relative',
    marginBottom: spacing.lg,
  },
  hazardMarker: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xs,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: spacing.xs,
  },
  legendText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray500,
  },
  weatherGrid: {
    gap: spacing.md,
  },
  weatherCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  weatherLocation: {
    fontSize: typography?.fontSize?.base || 16,
    fontWeight: 'bold',
    color: colors.onBackground,
    marginBottom: spacing.sm,
  },
  weatherMetrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
  },
  metricText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray500,
    marginLeft: spacing.xs,
  },
  emergencyGrid: {
    gap: spacing.md,
  },
  emergencyCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderLeftWidth: 4,
    ...shadows.sm,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  emergencyType: {
    fontSize: typography?.fontSize?.base || 16,
    fontWeight: 'bold',
    color: colors.onBackground,
    marginLeft: spacing.sm,
  },
  emergencyLocation: {
    fontSize: typography.fontSize.sm,
    color: colors.gray500,
    marginBottom: spacing.sm,
  },
  emergencyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  emergencyTime: {
    fontSize: typography.fontSize.sm,
    color: colors.gray500,
  },
  emergencyStatus: {
    fontSize: typography.fontSize.sm,
    fontWeight: 'bold',
  },
  responseTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  responseTimeLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.gray500,
  },
  responseTimeValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statsContainer: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  statsTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.onBackground,
    marginBottom: spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: 'bold',
    color: colors.onBackground,
    marginVertical: spacing.xs,
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.gray500,
    textAlign: 'center',
  },
});

export default DynamicMapVisualization;

