import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView, 
  Dimensions, 
  Animated, 
  Vibration
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '../stores/appStore';
import { useAuthStore } from '../stores/authStore';
import { useAccessibilityStore } from '../stores/accessibilityStore';
import locationService from '../services/locationService';
import { realApiService, RealApiService, API_CONFIG } from '../services/realApi';
import { MockApiService } from '../services/mockApi';
import { colors, typography, spacing, borderRadius, shadows } from '../theme/theme';

const { width, height } = Dimensions.get('window');

interface MapMarker {
  id: string;
  type: 'hazard' | 'warning' | 'sos' | 'forum' | 'social';
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  author?: string;
  trustScore?: number;
  media?: string[];
  reportCount?: number;
  affectedRadius?: number;
  estimatedImpact?: number;
  platform?: string;
  engagement?: number;
  sentiment?: string;
}

interface Hotspot {
  id: string;
  latitude: number;
  longitude: number;
  intensity: number;
  severity: string;
  reportCount: number;
  radius: number;
  timestamp: string;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  waveHeight: number;
  visibility: number;
  pressure: number;
  condition: string;
}

const MapScreen: React.FC = () => {
  const { t } = useTranslation();
  const { currentLocation, setCurrentLocation } = useAppStore();
  const { user } = useAuthStore();
  const { speak, hapticFeedback, getFontSize } = useAccessibilityStore();
  
  // State management
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    hazards: true,
    warnings: true,
    sos: true,
    forum: true,
    social: false,
    hotspots: true,
    weather: true
  });
  
  // Map view states
  const [mapType, setMapType] = useState<'standard' | 'satellite' | 'hybrid'>('hybrid');
  const [showWeather, setShowWeather] = useState(true);
  const [showHotspots, setShowHotspots] = useState(true);
  // Auto-detect if API keys are configured
  const hasApiKeys = !!(API_CONFIG.MAPBOX_ACCESS_TOKEN && API_CONFIG.OPENWEATHER_API_KEY);
  const [useRealAPI, setUseRealAPI] = useState(hasApiKeys); // Use real API if keys are configured
  
  // Animation refs
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const filterSlideAnim = useRef(new Animated.Value(-width)).current;
  const weatherSlideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadMapData();
    startLocationTracking();
    startAnimations();
    startRealTimeUpdates();
  }, []);

  const loadMapData = async () => {
    try {
      setLoading(true);
      speak('Loading coastal map data');
      
      if (useRealAPI) {
        // Use real API endpoints
        const location = currentLocation || { latitude: 19.0760, longitude: 72.8777 }; // Default to Mumbai
        
        const [reports, alerts, socialMedia, weatherData, hotspotsData] = await Promise.all([
          realApiService.getReports({ limit: 50 }),
          realApiService.getGovernmentAlerts(),
          realApiService.getSocialMediaPosts({ limit: 30 }),
          realApiService.getWeatherData(location),
          realApiService.getHotspots()
        ]);

        // Combine all markers with proper typing and unique IDs
        const allMarkers: MapMarker[] = [
          ...reports.data.map((r: any, index: number) => ({ 
            ...r, 
            type: r.type as MapMarker['type'],
            id: `report-${r.id || index}`
          })),
          ...alerts.data.map((a: any, index: number) => ({ 
            ...a, 
            type: 'warning' as const,
            id: `alert-${a.id || index}`
          })),
          ...socialMedia.data.map((s: any, index: number) => ({ 
            ...s, 
            type: 'social' as const,
            id: `social-${s.id || index}`
          }))
        ];

        setMarkers(allMarkers);
        setHotspots(hotspotsData.data);
        setWeather(weatherData.data);
        
        speak(`Loaded ${allMarkers.length} reports and ${hotspotsData.data.length} hotspots from real API`);
      } else {
        // Use mock API for development
        const [reports, warnings, socialMedia, weatherData, hotspotsData] = await Promise.all([
          MockApiService.getReports(),
          MockApiService.getWarnings(),
          MockApiService.getSocialMedia(),
          MockApiService.getWeather(),
          MockApiService.getHotspots()
        ]);

        // Combine all markers with proper typing and unique IDs
        const allMarkers: MapMarker[] = [
          ...reports.data.map((r: any, index: number) => ({ 
            ...r, 
            type: r.type as MapMarker['type'],
            id: `report-${r.id || index}`
          })),
          ...warnings.data.map((w: any, index: number) => ({ 
            ...w, 
            type: w.type as MapMarker['type'],
            id: `warning-${w.id || index}`
          })),
          ...socialMedia.data.map((s: any, index: number) => ({ 
            ...s, 
            type: s.type as MapMarker['type'],
            id: `social-${s.id || index}`
          }))
        ];

        setMarkers(allMarkers);
        setHotspots(hotspotsData.data);
        setWeather(weatherData.data);
        
        speak(`Loaded ${allMarkers.length} reports and ${hotspotsData.data.length} hotspots from mock API`);
      }
    } catch (error) {
      console.error('Error loading map data:', error);
      speak('Failed to load map data');
      Alert.alert('Error', 'Failed to load map data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startRealTimeUpdates = () => {
    if (useRealAPI) {
      // Use real API WebSocket updates
      realApiService.startRealTimeUpdates((updateData) => {
        if (updateData.type === 'update') {
          if (updateData.data.reports) {
            setMarkers(prev => [...prev, ...updateData.data.reports]);
            Vibration.vibrate(100);
            speak('New coastal report received');
          }
          if (updateData.data.weather) {
            setWeather(updateData.data.weather);
          }
        }
      });
    } else {
      // Use mock API updates
      MockApiService.startRealTimeUpdates((updateData) => {
        if (updateData.type === 'new_reports') {
          setMarkers(prev => [...prev, ...updateData.data]);
          Vibration.vibrate(100);
          speak('New coastal report received');
        } else if (updateData.type === 'weather_update') {
          setWeather(updateData.data);
        }
      });
    }
  };

  const startAnimations = () => {
    // Pulse animation for critical markers
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

    // Slide in animation for weather panel
    Animated.timing(weatherSlideAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const startLocationTracking = async () => {
    try {
      await locationService.watchLocation((location) => {
        setCurrentLocation(location);
      }, {
        timeInterval: 30000, // Update every 30 seconds
        distanceInterval: 100 // Update every 100 meters
      });
    } catch (error) {
      console.error('Error starting location tracking:', error);
    }
  };

  const toggleFilter = (filterType: keyof typeof activeFilters) => {
    hapticFeedback('light');
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: !prev[filterType]
    }));
    speak(`${filterType} filter ${activeFilters[filterType] ? 'disabled' : 'enabled'}`);
  };

  const toggleFiltersPanel = () => {
    hapticFeedback('medium');
    setShowFilters(!showFilters);
    Animated.timing(filterSlideAnim, {
      toValue: showFilters ? -width : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const changeMapType = () => {
    hapticFeedback('light');
    const types: ('standard' | 'satellite' | 'hybrid')[] = ['standard', 'satellite', 'hybrid'];
    const currentIndex = types.indexOf(mapType);
    const nextType = types[(currentIndex + 1) % types.length];
    setMapType(nextType);
    speak(`Map view changed to ${nextType}`);
  };

  const filteredMarkers = markers.filter(marker => {
    switch (marker.type) {
      case 'hazard': return activeFilters.hazards;
      case 'warning': return activeFilters.warnings;
      case 'sos': return activeFilters.sos;
      case 'forum': return activeFilters.forum;
      case 'social': return activeFilters.social;
      default: return true;
    }
  });

  const criticalMarkers = filteredMarkers.filter(m => m.severity === 'critical');
  const highSeverityMarkers = filteredMarkers.filter(m => m.severity === 'high');

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'hazard': return 'warning';
      case 'warning': return 'alert-circle';
      case 'sos': return 'help-circle';
      case 'forum': return 'chatbubble';
      default: return 'location';
    }
  };

  const getMarkerColor = (severity?: string) => {
    switch (severity) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#d97706';
      case 'low': return '#059669';
      default: return '#6b7280';
    }
  };

  const getSeverityColor = (severity?: string) => {
    return getMarkerColor(severity);
  };

  const getFilterIcon = (filterType: string) => {
    switch (filterType) {
      case 'hazards': return 'warning';
      case 'warnings': return 'alert-circle';
      case 'sos': return 'help-circle';
      case 'forum': return 'chatbubble';
      case 'social': return 'share-social';
      case 'hotspots': return 'radio-button-on';
      case 'weather': return 'partly-sunny';
      default: return 'filter';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Controls */}
      <LinearGradient
        colors={colors.gradients.ocean as any}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={[styles.title, { fontSize: getFontSize() * 1.3 }]}>
              Coast-Kavach Map
            </Text>
            <View style={styles.statsContainer}>
              <Text style={styles.statsText}>
                {criticalMarkers.length} Critical • {filteredMarkers.length} Total
              </Text>
              <Text style={styles.apiStatusText}>
                {hasApiKeys ? '🌐 Real APIs' : '🎭 Mock Data'}
              </Text>
            </View>
          </View>
          <View style={styles.headerControls}>
            <TouchableOpacity 
              onPress={() => {
                setUseRealAPI(!useRealAPI);
                hapticFeedback('medium');
                speak(`Switched to ${!useRealAPI ? 'real' : 'mock'} API`);
                loadMapData();
              }}
              style={[styles.headerButton, useRealAPI && styles.activeButton]}
              accessible={true}
              accessibilityLabel={`Switch to ${useRealAPI ? 'mock' : 'real'} API`}
            >
              <Ionicons name={useRealAPI ? "cloud-done" : "cloud-offline"} size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={toggleFiltersPanel} 
              style={styles.headerButton}
              accessible={true}
              accessibilityLabel="Toggle filters"
            >
              <Ionicons name="options" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={changeMapType} 
              style={styles.headerButton}
              accessible={true}
              accessibilityLabel="Change map type"
            >
              <Ionicons name="layers" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={loadMapData} 
              style={styles.headerButton}
              accessible={true}
              accessibilityLabel="Refresh data"
            >
              <Ionicons name="refresh" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Main Content Area */}
      <View style={styles.mainContent}>
        {/* Interactive Map Container */}
        <View style={styles.mapContainer}>
          {/* Real Map Background */}
          <View style={[
            styles.mapBackground,
            {
              backgroundColor: mapType === 'satellite' ? '#2D5016' : 
                             mapType === 'hybrid' ? '#4682B4' : '#87CEEB'
            }
          ]}>
            {/* Map Grid Pattern */}
            <View style={styles.mapGrid} />
            
            {/* Map Placeholder with Coastal Theme */}
            <View style={styles.mapPlaceholder}>
              <Ionicons name="map" size={64} color="#0369a1" />
              <Text style={styles.mapText}>Coastal Disaster Map</Text>
              <Text style={styles.mapSubtext}>
                {currentLocation 
                  ? `Location: ${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)}`
                  : 'Getting your location...'
                }
              </Text>
              <Text style={styles.mapSubtext}>
                Map Type: {mapType.toUpperCase()}
              </Text>
            </View>
            
            {/* Dynamic Hotspots */}
            {showHotspots && hotspots.map((hotspot) => (
              <Animated.View
                key={hotspot.id}
                style={[
                  styles.hotspotCircle,
                  {
                    left: hotspot.latitude * 100,
                    top: hotspot.longitude * 100,
                    width: hotspot.radius * 2,
                    height: hotspot.radius * 2,
                    backgroundColor: getSeverityColor(hotspot.severity) + '40',
                    transform: [{ scale: pulseAnim }]
                  }
                ]}
              />
            ))}

            {/* Interactive Markers */}
            {filteredMarkers.map((marker) => (
              <TouchableOpacity
                key={marker.id}
                style={[
                  styles.markerPin,
                  {
                    left: marker.latitude * 100,
                    top: marker.longitude * 100,
                    backgroundColor: getMarkerColor(marker.severity)
                  },
                  selectedMarker?.id === marker.id && styles.selectedMarkerPin,
                  marker.severity === 'critical' && { transform: [{ scale: pulseAnim }] }
                ]}
                onPress={() => {
                  hapticFeedback('medium');
                  setSelectedMarker(marker);
                  speak(`${marker.type} ${marker.severity} severity`);
                }}
                accessible={true}
                accessibilityLabel={`${marker.type} marker`}
              >
                <Ionicons 
                  name={getMarkerIcon(marker.type)} 
                  size={16} 
                  color="white" 
                />
              </TouchableOpacity>
            ))}

            {/* Map Controls Overlay */}
            <View style={styles.mapControls}>
              <TouchableOpacity 
                style={styles.mapControlButton}
                onPress={() => setShowHotspots(!showHotspots)}
              >
                <Ionicons 
                  name={showHotspots ? "eye" : "eye-off"} 
                  size={20} 
                  color={colors?.primary || '#3b82f6'} 
                />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.mapControlButton}
                onPress={() => setShowWeather(!showWeather)}
              >
                <Ionicons 
                  name={showWeather ? "cloud" : "cloud-offline"} 
                  size={20} 
                  color={colors?.primary || '#3b82f6'} 
                />
              </TouchableOpacity>
            </View>

            {/* Location Indicator */}
            {currentLocation && (
              <View 
                style={[
                  styles.currentLocationPin,
                  {
                    left: currentLocation.latitude * 100,
                    top: currentLocation.longitude * 100
                  }
                ]}
              >
                <View style={styles.locationPulse} />
                <View style={styles.locationCenter}>
                  <Ionicons name="location" size={12} color="white" />
                </View>
              </View>
            )}
          </View>

          {/* Map Type Indicator */}
          <View style={styles.mapTypeIndicator}>
            <Text style={styles.mapTypeText}>{mapType?.toUpperCase() || 'HYBRID'}</Text>
          </View>
        </View>
      </View>

      {/* Compact Weather Widget */}
      {showWeather && weather && (
        <View style={styles.weatherWidget}>
          <View style={styles.weatherCompact}>
            <Ionicons name="partly-sunny" size={16} color="#3b82f6" />
            <Text style={styles.weatherTempCompact}>{weather.temperature}°C</Text>
            <Text style={styles.weatherConditionCompact}>{weather.condition}</Text>
          </View>
        </View>
      )}

      {/* Filter Panel */}
      <Animated.View 
        style={[
          styles.filterPanel,
          {
            transform: [{ translateX: filterSlideAnim }]
          }
        ]}
      >
        <View style={styles.filterHeader}>
          <Text style={styles.filterTitle}>Map Filters</Text>
          <TouchableOpacity onPress={toggleFiltersPanel}>
            <Ionicons name="close" size={24} color={colors.gray600} />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.filterContent}>
          {Object.entries(activeFilters).map(([key, value]) => (
            <TouchableOpacity
              key={key}
              style={[styles.filterItem, value && styles.filterItemActive]}
              onPress={() => toggleFilter(key as keyof typeof activeFilters)}
            >
              <View style={styles.filterItemContent}>
                <Ionicons 
                  name={getFilterIcon(key)} 
                  size={20} 
                  color={value ? (colors?.primary || '#3b82f6') : (colors?.gray500 || '#6b7280')} 
                />
                <Text style={[styles.filterItemText, value && styles.filterItemTextActive]}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Text>
              </View>
              <View style={[styles.filterToggle, value && styles.filterToggleActive]}>
                <View style={[styles.filterToggleThumb, value && styles.filterToggleThumbActive]} />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => {
          hapticFeedback('medium');
          speak('Emergency report');
        }}
        accessible={true}
        accessibilityLabel="Emergency SOS"
      >
        <Ionicons name="help" size={24} color="white" />
      </TouchableOpacity>

      {/* Bottom Drawer - Collapsible */}
      <View style={styles.bottomDrawer}>
        <TouchableOpacity 
          style={styles.drawerHandle}
          onPress={() => {
            hapticFeedback('light');
            // Toggle drawer visibility
          }}
        >
          <View style={styles.handleBar} />
          <Text style={styles.drawerTitle}>
            {filteredMarkers.length} Coastal Events
          </Text>
        </TouchableOpacity>
        
        <ScrollView 
          style={styles.drawerContent}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading coastal data...</Text>
            </View>
          ) : filteredMarkers.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="map-outline" size={48} color="#9ca3af" />
              <Text style={styles.emptyText}>No events in your area</Text>
            </View>
          ) : (
            (filteredMarkers || []).slice(0, 5).map((marker) => (
              <TouchableOpacity
                key={marker.id}
                style={[
                  styles.eventItemCompact,
                  selectedMarker?.id === marker.id && styles.selectedEventItem
                ]}
                onPress={() => {
                  hapticFeedback('light');
                  setSelectedMarker(marker);
                }}
              >
                <View style={[
                  styles.eventIconCompact,
                  { backgroundColor: getMarkerColor(marker.severity) }
                ]}>
                  <Ionicons 
                    name={getMarkerIcon(marker.type)} 
                    size={14} 
                    color="white" 
                  />
                </View>
                <View style={styles.eventInfoCompact}>
                  <Text style={styles.eventTitleCompact}>{marker.title || 'Untitled'}</Text>
                  <Text style={styles.eventTimeCompact}>
                    {formatTimeAgo(marker.timestamp || new Date().toISOString())}
                  </Text>
                </View>
                <View style={[
                  styles.severityBadgeCompact,
                  { backgroundColor: getMarkerColor(marker.severity) }
                ]}>
                  <Text style={styles.severityTextCompact}>
                    {(marker.severity || 'low').toUpperCase()}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  mainContent: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#e5e7eb',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  markersContainer: {
    flex: 1,
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  markersTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  markersList: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 12,
  },
  markerItem: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedMarker: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
  },
  markerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  markerIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  markerInfo: {
    flex: 1,
  },
  markerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  markerTime: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  markerDescription: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  markerAuthor: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    fontStyle: 'italic',
  },
  // New enhanced styles
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  statsText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  apiStatusText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '400',
    marginTop: 2,
  },
  headerControls: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  activeButton: {
    backgroundColor: 'rgba(34, 197, 94, 0.3)',
    borderColor: 'rgba(34, 197, 94, 0.5)',
  },
  mapBackground: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#87CEEB', // Default ocean blue
  },
  mapGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
  },
  mapText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginTop: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  mapSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  hotspotCircle: {
    position: 'absolute',
    borderRadius: 1000,
    opacity: 0.6,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  markerPin: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedMarkerPin: {
    borderColor: '#3b82f6',
    borderWidth: 4,
    transform: [{ scale: 1.2 }],
  },
  mapControls: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'column',
    gap: 12,
  },
  mapControlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  currentLocationPin: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationPulse: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3b82f6',
    opacity: 0.6,
  },
  locationCenter: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapTypeIndicator: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  mapTypeText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  weatherWidget: {
    position: 'absolute',
    top: 100,
    right: 16,
    zIndex: 1000,
  },
  weatherCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    gap: 8,
  },
  weatherTempCompact: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  weatherConditionCompact: {
    fontSize: 12,
    color: '#6b7280',
  },
  weatherGradient: {
    padding: 16,
  },
  weatherContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherMain: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  weatherInfo: {
    marginLeft: 12,
  },
  weatherTemp: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  weatherCondition: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textTransform: 'capitalize',
  },
  weatherDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  weatherDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  weatherDetailText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  filterPanel: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: width * 0.8,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  filterContent: {
    flex: 1,
    padding: 20,
  },
  filterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  filterItemActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  filterItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  filterItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
    marginLeft: 12,
  },
  filterItemTextActive: {
    color: '#3b82f6',
  },
  filterToggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#d1d5db',
    padding: 2,
    justifyContent: 'center',
  },
  filterToggleActive: {
    backgroundColor: '#3b82f6',
  },
  filterToggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  filterToggleThumbActive: {
    transform: [{ translateX: 22 }],
  },
  fab: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#dc2626',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
    zIndex: 1000,
  },
  bottomDrawer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  drawerHandle: {
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    marginBottom: 8,
  },
  drawerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  drawerContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  panelHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  panelTitle: {
    fontWeight: 'bold',
    color: '#111827',
  },
  eventsList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  eventItem: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  selectedEventItem: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: '#3b82f6',
    borderWidth: 2,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  eventTime: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  eventDescription: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 8,
  },
  eventAuthor: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  trustScore: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  trustScoreText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '500',
  },
  eventItemCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  eventIconCompact: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  eventInfoCompact: {
    flex: 1,
  },
  eventTitleCompact: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  eventTimeCompact: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  severityBadgeCompact: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  severityTextCompact: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
});

export default MapScreen;
