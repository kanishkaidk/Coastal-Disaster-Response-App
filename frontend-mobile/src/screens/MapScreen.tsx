import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../stores/appStore';
import { useAuthStore } from '../stores/authStore';
import locationService from '../services/locationService';
import apiService from '../services/api';

const { width, height } = Dimensions.get('window');

interface MapMarker {
  id: string;
  type: 'hazard' | 'warning' | 'sos' | 'forum';
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  author?: string;
}

const MapScreen: React.FC = () => {
  const { t } = useTranslation();
  const { currentLocation, setCurrentLocation } = useAppStore();
  const { user } = useAuthStore();
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);

  useEffect(() => {
    loadMapData();
    startLocationTracking();
  }, []);

  const loadMapData = async () => {
    try {
      setLoading(true);
      // Load warnings, hazards, SOS alerts, and forum posts with location data
      const [warnings, hazards, sosAlerts, forumPosts] = await Promise.all([
        apiService.getWarnings({ limit: 50 }),
        apiService.getReports({ type: 'hazard', limit: 50 }),
        apiService.getSOSStatus('active'),
        apiService.getForumPosts({ hasLocation: true, limit: 30 })
      ]);

      const mapMarkers: MapMarker[] = [
        ...warnings.data.map((warning: any) => ({
          id: `warning-${warning.id}`,
          type: 'warning' as const,
          title: warning.title,
          description: warning.description,
          latitude: warning.location.coordinates[1],
          longitude: warning.location.coordinates[0],
          severity: warning.severity,
          timestamp: warning.createdAt,
          author: warning.issuedBy?.name
        })),
        ...hazards.data.map((hazard: any) => ({
          id: `hazard-${hazard.id}`,
          type: 'hazard' as const,
          title: hazard.title,
          description: hazard.description,
          latitude: hazard.location.coordinates[1],
          longitude: hazard.location.coordinates[0],
          severity: hazard.severity,
          timestamp: hazard.createdAt,
          author: hazard.reportedBy?.name
        })),
        ...sosAlerts.data.map((sos: any) => ({
          id: `sos-${sos.id}`,
          type: 'sos' as const,
          title: 'SOS Alert',
          description: sos.message,
          latitude: sos.location.coordinates[1],
          longitude: sos.location.coordinates[0],
          severity: 'critical' as const,
          timestamp: sos.createdAt,
          author: sos.reportedBy?.name
        })),
        ...forumPosts.data.map((post: any) => ({
          id: `forum-${post.id}`,
          type: 'forum' as const,
          title: post.title,
          description: post.content,
          latitude: post.location.coordinates[1],
          longitude: post.location.coordinates[0],
          severity: post.urgency === 'high' ? 'high' : 'low',
          timestamp: post.createdAt,
          author: post.author?.name
        }))
      ];

      setMarkers(mapMarkers);
    } catch (error) {
      console.error('Error loading map data:', error);
      Alert.alert('Error', 'Failed to load map data. Please try again.');
    } finally {
      setLoading(false);
    }
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

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'hazard': return 'warning';
      case 'warning': return 'alert-circle';
      case 'sos': return 'help-circle';
      case 'forum': return 'chatbubble';
      default: return 'location';
    }
  };

  const getMarkerColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#d97706';
      case 'low': return '#059669';
      default: return '#6b7280';
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
      <View style={styles.header}>
        <Text style={styles.title}>Coast-Kavach Map</Text>
        <TouchableOpacity onPress={loadMapData} style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color="#0369a1" />
        </TouchableOpacity>
      </View>

      {/* Map Placeholder - In a real app, this would be a proper map component */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={64} color="#0369a1" />
          <Text style={styles.mapText}>Interactive Map</Text>
          <Text style={styles.mapSubtext}>
            {currentLocation 
              ? `Your location: ${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)}`
              : 'Getting your location...'
            }
          </Text>
        </View>
      </View>

      {/* Markers List */}
      <View style={styles.markersContainer}>
        <Text style={styles.markersTitle}>
          Nearby Events ({markers.length})
        </Text>
        <ScrollView 
          style={styles.markersList}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading map data...</Text>
            </View>
          ) : markers.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="map-outline" size={48} color="#9ca3af" />
              <Text style={styles.emptyText}>No events in your area</Text>
            </View>
          ) : (
            markers.map((marker) => (
              <TouchableOpacity
                key={marker.id}
                style={[
                  styles.markerItem,
                  selectedMarker?.id === marker.id && styles.selectedMarker
                ]}
                onPress={() => setSelectedMarker(marker)}
              >
                <View style={styles.markerHeader}>
                  <View style={styles.markerIconContainer}>
                    <Ionicons 
                      name={getMarkerIcon(marker.type)} 
                      size={20} 
                      color={getMarkerColor(marker.severity)} 
                    />
                  </View>
                  <View style={styles.markerInfo}>
                    <Text style={styles.markerTitle}>{marker.title}</Text>
                    <Text style={styles.markerTime}>
                      {formatTimeAgo(marker.timestamp)}
                    </Text>
                  </View>
                  <View style={[
                    styles.severityBadge,
                    { backgroundColor: getMarkerColor(marker.severity) }
                  ]}>
                    <Text style={styles.severityText}>
                      {marker.severity.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text style={styles.markerDescription} numberOfLines={2}>
                  {marker.description}
                </Text>
                {marker.author && (
                  <Text style={styles.markerAuthor}>
                    by {marker.author}
                  </Text>
                )}
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
  mapContainer: {
    height: height * 0.4,
    backgroundColor: '#e5e7eb',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
  },
  mapText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 12,
  },
  mapSubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 20,
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
});

export default MapScreen;
