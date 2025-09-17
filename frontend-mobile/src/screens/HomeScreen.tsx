import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Alert,
  ActivityIndicator,
  Vibration,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useAccessibilityStore } from '../stores/accessibilityStore';
import { useAuthStore } from '../stores/authStore';
import { useAppStore } from '../stores/appStore';
import { typography } from '../theme/theme';
import locationService from '../services/locationService';
import apiService from '../services/api';
import aiService from '../services/aiService';
import { i18n } from '../services/i18n';

const { width } = Dimensions.get('window');

interface Warning {
  id: string;
  title: string;
  description: string;
  source: 'govt' | 'marine_worker';
  area: string;
  expiry: string;
  advice: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  lastUpdated: string;
  color: string;
}

interface Hazard {
  id: string;
  type: string;
  distance: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  trustBadge: number;
  reportCount: number;
  description: string;
  timestamp: string;
}

interface SocialPost {
  id: string;
  platform: 'x' | 'instagram' | 'youtube';
  content: string;
  author: string;
  timestamp: string;
  type: 'crowd_report' | 'update' | 'resource_request';
  media?: string;
}

const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { speak, hapticFeedback, isHighContrast } = useAccessibilityStore();
  const { user, logout } = useAuthStore();
  const { networkStatus, setCurrentLocation } = useAppStore();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [hazards, setHazards] = useState<Hazard[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [location, setLocation] = useState<string>('Getting location...');
  const [currentLocationState, setCurrentLocationState] = useState<{latitude: number, longitude: number} | null>(null);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    severity: 'all',
    type: 'all',
    recency: 'all'
  });

  useEffect(() => {
    loadData();
    getCurrentLocation();
    speak('Home screen loaded. Warnings and hazards near you.');
  }, []);

  const getCurrentLocation = async () => {
    try {
      const location = await locationService.getCurrentLocation();
      if (location) {
        setCurrentLocation(location);
        setCurrentLocationState(location);
        const address = await locationService.reverseGeocode(location.latitude, location.longitude);
        setLocation(address);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      setLocation('Location unavailable');
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadWarnings(),
        loadHazards(),
        loadSocialPosts()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
      speak('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const loadWarnings = async () => {
    try {
      const warningsData = await apiService.getWarnings({
        latitude: currentLocationState?.latitude,
        longitude: currentLocationState?.longitude,
        radius: 50,
        limit: 10
      });

      let warningsToProcess = warningsData?.data || [];

      // If no data from API, use fallback
      if (warningsToProcess.length === 0) {
        warningsToProcess = [
          {
            id: 'w1',
            title: 'High Tide Warning',
            description: 'High tide expected at 3:00 PM. Water levels may rise significantly.',
            source: 'govt',
            area: 'Marina Beach',
            advice: 'Avoid coastal areas and low-lying regions',
            severity: 'high',
            type: 'tide',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'w2',
            title: 'Storm Alert',
            description: 'Severe weather conditions expected with strong winds and heavy rain.',
            source: 'marine_worker',
            area: 'Coastal Highway',
            advice: 'Stay indoors and secure loose objects',
            severity: 'critical',
            type: 'storm',
            createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          }
        ];
      }

      // Clean up expired warnings
      const activeWarnings = aiService.cleanupExpiredItems(warningsToProcess);

      const warningList: Warning[] = activeWarnings.map((warning: any) => {
        const aiAnalysis = aiService.analyzeWarning(warning.description, warning.location);
        const timeRemaining = aiService.getTimeUntilExpiration(
          new Date(warning.createdAt), 
          warning.severity, 
          warning.type || 'general'
        );
        
        return {
          id: warning.id,
          title: warning.title,
          description: warning.description,
          source: warning.source || 'govt',
          area: warning.area || 'Coastal Area',
          expiry: timeRemaining,
          advice: warning.advice || 'Stay indoors and avoid coastal areas',
          severity: aiAnalysis.severity,
          lastUpdated: formatTimeAgo(warning.createdAt),
          color: getSeverityColor(aiAnalysis.severity),
          isExpired: timeRemaining === 'Expired'
        };
      });

      setWarnings(warningList);
    } catch (error) {
      console.error('Error loading warnings:', error);
      setWarnings([]);
    }
  };

  const loadHazards = async () => {
    try {
      const hazardsData = await apiService.getReports({
        latitude: currentLocationState?.latitude,
        longitude: currentLocationState?.longitude,
        radius: 25,
        limit: 8
      });

      let hazardsToProcess = hazardsData?.data || [];

      // If no data from API, use fallback
      if (hazardsToProcess.length === 0) {
        hazardsToProcess = [
          {
            id: 'h1',
            type: 'Flood',
            description: 'Water level rising near Marina Beach. Exercise caution.',
            severity: 'high',
            createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
            location: currentLocationState,
            media: []
          },
          {
            id: 'h2',
            type: 'Infrastructure Damage',
            description: 'Road washed out near coastal highway. Avoid this route.',
            severity: 'medium',
            createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
            location: currentLocationState,
            media: []
          }
        ];
      }

      // Clean up expired reports
      const activeHazards = aiService.cleanupExpiredItems(hazardsToProcess);

      const hazardList: Hazard[] = activeHazards.map((hazard: any) => {
        const aiAnalysis = aiService.analyzeReport(hazard.description, hazard.media?.length || 0, hazard.location);
        return {
          id: hazard.id,
          type: hazard.type || 'Flood',
          distance: calculateDistance(hazard.location),
          severity: aiAnalysis.severity,
          trustBadge: aiAnalysis.trustScore,
          reportCount: Math.floor(Math.random() * 10) + 1,
          description: aiAnalysis.summary || hazard.description,
          timestamp: formatTimeAgo(hazard.createdAt)
        };
      });

      setHazards(hazardList);
    } catch (error) {
      console.error('Error loading hazards:', error);
      setHazards([]);
    }
  };

  const loadSocialPosts = async () => {
    try {
      const postsData = await apiService.getForumPosts({ limit: 10 });
      
      const socialList: SocialPost[] = postsData?.data?.map((post: any) => ({
        id: post.id,
        platform: post.platform || 'x',
        content: post.content,
        author: post.author?.name || 'Anonymous',
        timestamp: formatTimeAgo(post.createdAt),
        type: post.type || 'crowd_report',
        media: post.media?.[0]
      })) || [];

      setSocialPosts(socialList);
    } catch (error) {
      // Fallback data
      const samplePosts: SocialPost[] = [
        {
          id: 's1',
          platform: 'x',
          content: 'Just saw water levels rising near the beach. Stay safe everyone! #CoastKavach',
          author: 'CoastalResident',
          timestamp: '30 minutes ago',
          type: 'crowd_report'
        },
        {
          id: 's2',
          platform: 'instagram',
          content: 'Emergency supplies available at community center. DM for details.',
          author: 'HelpVolunteer',
          timestamp: '1 hour ago',
          type: 'resource_request'
        }
      ];
      setSocialPosts(samplePosts);
    }
  };

  const calculateDistance = (hazardLocation: any): string => {
    if (!hazardLocation || !currentLocationState) return 'Unknown';
    
    const distance = locationService.calculateDistance(
      currentLocationState.latitude,
      currentLocationState.longitude,
      hazardLocation.latitude,
      hazardLocation.longitude
    );
    
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#dc2626';
      case 'high': return '#f97316';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getConnectivityIcon = () => {
    switch (networkStatus) {
      case 'online': return 'wifi';
      case 'mesh': return 'git-network';
      case 'sms': return 'chatbubble';
      case 'offline': return 'cloud-offline';
      default: return 'wifi';
    }
  };

  const getConnectivityText = () => {
    switch (networkStatus) {
      case 'online': return 'Online';
      case 'mesh': return 'Mesh Network';
      case 'sms': return 'SMS Only';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case 'citizen': return 'person';
      case 'marine_worker': return 'boat';
      case 'analyst': return 'analytics';
      case 'moderator': return 'shield-checkmark';
      case 'admin': return 'settings';
      default: return 'person';
    }
  };

  const getRoleDisplayName = (role?: string) => {
    switch (role) {
      case 'citizen': return 'Citizen';
      case 'marine_worker': return 'Marine Worker';
      case 'analyst': return 'Analyst';
      case 'moderator': return 'Moderator';
      case 'admin': return 'Admin';
      default: return 'User';
    }
  };

  const getCurrentLanguageCode = () => {
    const currentLang = i18n.language || 'en';
    const languageMap: { [key: string]: string } = {
      'en': 'EN',
      'hi': 'हिं',
      'bn': 'বাং',
      'ta': 'த',
      'te': 'తె',
      'mr': 'मर',
      'gu': 'ગુ',
      'kn': 'ಕ',
      'ml': 'മ',
      'pa': 'ਪ',
      'or': 'ଓ',
      'as': 'অ'
    };
    return languageMap[currentLang] || 'EN';
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleEmergencyCall = () => {
    hapticFeedback('heavy');
    speak('Calling emergency helpline 112');
    Vibration.vibrate([0, 200, 100, 200]);
    // TODO: Implement actual phone call
    Alert.alert('Emergency Call', 'Calling 112...', [{ text: 'OK' }]);
  };

  const handleEmergencySMS = () => {
    hapticFeedback('heavy');
    speak('Sending emergency SMS');
    Vibration.vibrate([0, 200, 100, 200]);
    // TODO: Implement actual SMS
    Alert.alert('Emergency SMS', 'Sending SMS: "I need help! My location is..."', [{ text: 'OK' }]);
  };

  const handleReturnToLanding = () => {
    hapticFeedback('medium');
    speak('Returning to landing page');
    logout();
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇮🇳', region: 'India' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳', region: 'Hindi Belt' },
    { code: 'bn', name: 'বাংলা', flag: '🇮🇳', region: 'West Bengal' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳', region: 'Tamil Nadu' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳', region: 'Telangana & Andhra' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳', region: 'Maharashtra' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳', region: 'Gujarat' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳', region: 'Karnataka' },
    { code: 'ml', name: 'മലയാളം', flag: '🇮🇳', region: 'Kerala' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳', region: 'Punjab' },
    { code: 'or', name: 'ଓଡ଼ିଆ', flag: '🇮🇳', region: 'Odisha' },
    { code: 'as', name: 'অসমীয়া', flag: '🇮🇳', region: 'Assam' },
  ];

  const handleLanguageChange = (languageCode: string) => {
    hapticFeedback('medium');
    speak(`Switching to ${languages.find(l => l.code === languageCode)?.name}`);
    i18n.changeLanguage(languageCode);
    setShowLanguagePicker(false);
  };

  return (
    <SafeAreaView style={[styles.container, isHighContrast && styles.highContrast]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#3b82f6"
            colors={['#3b82f6']}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={['#1e40af', '#3b82f6', '#60a5fa']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            {/* Location & Connectivity */}
            <View style={styles.locationRow}>
              <View style={styles.locationInfo}>
                <Ionicons name="location" size={16} color="white" />
                <Text style={styles.locationText}>{location}</Text>
                <TouchableOpacity
                  style={styles.changeLocationButton}
                  onPress={() => {
                    hapticFeedback('light');
                    speak('Change location');
                  }}
                  accessible={true}
                  accessibilityLabel="Change location"
                  accessibilityRole="button"
                >
                  <Ionicons name="pencil" size={14} color="white" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.connectivityInfo}>
                <Ionicons name={getConnectivityIcon()} size={16} color="white" />
                <Text style={styles.connectivityText}>{getConnectivityText()}</Text>
              </View>
            </View>

            {/* User Role & Actions */}
            <View style={styles.headerActions}>
              <View style={styles.userInfo}>
                <Text style={styles.welcomeText}>Welcome, {user?.name || 'User'}!</Text>
                <View style={styles.roleBadge}>
                  <Ionicons name={getRoleIcon(user?.role)} size={14} color="white" />
                  <Text style={styles.roleText}>{getRoleDisplayName(user?.role)}</Text>
                </View>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.languageButton}
                  onPress={() => setShowLanguagePicker(true)}
                  accessible={true}
                  accessibilityLabel="Change language"
                  accessibilityRole="button"
                >
                  <Ionicons name="language" size={20} color="white" />
                  <Text style={styles.languageText}>{getCurrentLanguageCode()}</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.returnButton}
                  onPress={handleReturnToLanding}
                  accessible={true}
                  accessibilityLabel="Return to landing page"
                  accessibilityRole="button"
                >
                  <Ionicons name="home" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Warnings & Alerts Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>⚠️ Warnings & Alerts</Text>
            <Text style={styles.lastUpdated}>Last updated: {warnings[0]?.lastUpdated || 'Never'}</Text>
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#dc2626" />
              <Text style={styles.loadingText}>Loading warnings...</Text>
            </View>
          ) : (
            <View style={styles.warningsList}>
              {warnings.length > 0 ? warnings.map((warning) => (
                <TouchableOpacity
                  key={warning.id}
                  style={[styles.warningCard, { borderLeftColor: warning.color }]}
                  onPress={() => {
                    hapticFeedback('light');
                    speak(`Warning: ${warning.title}`);
                  }}
                  accessible={true}
                  accessibilityLabel={`Warning: ${warning.title}. Source: ${warning.source}. Advice: ${warning.advice}`}
                  accessibilityRole="button"
                >
                  <View style={styles.warningHeader}>
                    <View style={styles.warningSource}>
                      <Ionicons 
                        name={warning.source === 'govt' ? 'shield' : 'boat'} 
                        size={16} 
                        color={warning.color} 
                      />
                      <Text style={styles.warningSourceText}>
                        {warning.source === 'govt' ? 'Government' : 'Marine Worker'}
                      </Text>
                    </View>
                    <View style={[styles.severityBadge, { backgroundColor: warning.color }]}>
                      <Text style={styles.severityText}>
                        {warning.severity.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={styles.warningTitle}>{warning.title}</Text>
                  <Text style={styles.warningDescription}>{warning.description}</Text>
                  
                  <View style={styles.warningFooter}>
                    <Text style={styles.warningArea}>📍 {warning.area}</Text>
                    <Text style={styles.warningExpiry}>⏰ Expires in {warning.expiry}</Text>
                  </View>
                  
                  <Text style={styles.warningAdvice}>💡 {warning.advice}</Text>
                </TouchableOpacity>
              )) : (
                <View style={styles.emptyState}>
                  <Ionicons name="checkmark-circle" size={48} color="#10b981" />
                  <Text style={styles.emptyStateText}>No active warnings in your area</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Ongoing Hazards Near You */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🚨 Ongoing Hazards Near You</Text>
            <View style={styles.filters}>
              <TouchableOpacity style={styles.filterButton}>
                <Text style={styles.filterText}>Severity</Text>
                <Ionicons name="chevron-down" size={16} color="#6b7280" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterButton}>
                <Text style={styles.filterText}>Type</Text>
                <Ionicons name="chevron-down" size={16} color="#6b7280" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterButton}>
                <Text style={styles.filterText}>Recent</Text>
                <Ionicons name="chevron-down" size={16} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.hazardsList}>
            {hazards.length > 0 ? hazards.map((hazard) => (
              <TouchableOpacity
                key={hazard.id}
                style={styles.hazardCard}
                onPress={() => {
                  hapticFeedback('light');
                  speak(`Hazard: ${hazard.type}. Distance: ${hazard.distance}`);
                }}
                accessible={true}
                accessibilityLabel={`Hazard: ${hazard.type}. Distance: ${hazard.distance}. Severity: ${hazard.severity}`}
                accessibilityRole="button"
              >
                <View style={styles.hazardHeader}>
                  <View style={styles.hazardType}>
                    <Ionicons name="warning" size={20} color={getSeverityColor(hazard.severity)} />
                    <Text style={styles.hazardTypeText}>{hazard.type}</Text>
                  </View>
                  <Text style={styles.hazardDistance}>{hazard.distance}</Text>
                </View>
                
                <Text style={styles.hazardDescription}>{hazard.description}</Text>
                
                <View style={styles.hazardFooter}>
                  <View style={styles.trustBadge}>
                    <Ionicons name="shield-checkmark" size={14} color="#10b981" />
                    <Text style={styles.trustText}>{hazard.trustBadge}% Trust</Text>
                  </View>
                  <Text style={styles.reportCount}>{hazard.reportCount} reports</Text>
                  <Text style={styles.hazardTime}>{hazard.timestamp}</Text>
                </View>
              </TouchableOpacity>
            )) : (
              <View style={styles.emptyState}>
                <Ionicons name="checkmark-circle" size={48} color="#10b981" />
                <Text style={styles.emptyStateText}>No hazards reported in your area</Text>
              </View>
            )}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => {
                hapticFeedback('medium');
                speak('Report hazard');
                navigation.navigate('Report' as never);
              }}
              accessible={true}
              accessibilityLabel="Report hazard"
              accessibilityRole="button"
            >
              <LinearGradient
                colors={['#f59e0b', '#fbbf24']}
                style={styles.quickActionGradient}
              >
                <Ionicons name="warning" size={32} color="white" />
                <Text style={styles.quickActionText}>Report Hazard</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => {
                hapticFeedback('medium');
                speak('Request resources');
                // TODO: Navigate to resource request
              }}
              accessible={true}
              accessibilityLabel="Request resources"
              accessibilityRole="button"
            >
              <LinearGradient
                colors={['#10b981', '#34d399']}
                style={styles.quickActionGradient}
              >
                <Ionicons name="hand-left" size={32} color="white" />
                <Text style={styles.quickActionText}>Request Resources</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => {
                hapticFeedback('heavy');
                speak('Emergency SOS');
                // Navigate to SOS screen via stack navigation
                navigation.navigate('SOS' as never);
              }}
              accessible={true}
              accessibilityLabel="Emergency SOS"
              accessibilityRole="button"
            >
              <LinearGradient
                colors={['#dc2626', '#ef4444']}
                style={styles.quickActionGradient}
              >
                <Ionicons name="help-circle" size={32} color="white" />
                <Text style={styles.quickActionText}>SOS</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Social Feed */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📱 Social Feed</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterText}>Filter by Type</Text>
              <Ionicons name="chevron-down" size={16} color="#6b7280" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.socialFeed}>
            {socialPosts.length > 0 ? socialPosts.map((post) => (
              <View key={post.id} style={styles.socialPost}>
                <View style={styles.postHeader}>
                  <View style={styles.postPlatform}>
                    <Ionicons 
                      name={post.platform === 'x' ? 'logo-twitter' : post.platform === 'instagram' ? 'logo-instagram' : 'logo-youtube'} 
                      size={16} 
                      color={post.platform === 'x' ? '#1da1f2' : post.platform === 'instagram' ? '#e4405f' : '#ff0000'} 
                    />
                    <Text style={styles.platformText}>
                      {post.platform === 'x' ? 'X' : post.platform === 'instagram' ? 'Instagram' : 'YouTube'}
                    </Text>
                  </View>
                  <Text style={styles.postTime}>{post.timestamp}</Text>
                </View>
                
                <Text style={styles.postContent}>{post.content}</Text>
                <Text style={styles.postAuthor}>— {post.author}</Text>
              </View>
            )) : (
              <View style={styles.emptyState}>
                <Ionicons name="chatbubbles" size={48} color="#6b7280" />
                <Text style={styles.emptyStateText}>No social posts available</Text>
              </View>
            )}
          </View>
        </View>

        {/* Helpline/Emergency */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚨 Emergency Contacts</Text>
          <View style={styles.emergencyButtons}>
            <TouchableOpacity
              style={styles.emergencyButton}
              onPress={handleEmergencyCall}
              accessible={true}
              accessibilityLabel="Call emergency helpline 112"
              accessibilityRole="button"
            >
              <LinearGradient
                colors={['#dc2626', '#ef4444']}
                style={styles.emergencyGradient}
              >
                <Ionicons name="call" size={24} color="white" />
                <Text style={styles.emergencyText}>Call 112</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.emergencyButton}
              onPress={handleEmergencySMS}
              accessible={true}
              accessibilityLabel="Send emergency SMS"
              accessibilityRole="button"
            >
              <LinearGradient
                colors={['#059669', '#10b981']}
                style={styles.emergencyGradient}
              >
                <Ionicons name="chatbubble" size={24} color="white" />
                <Text style={styles.emergencyText}>SMS Help</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Language Picker Modal */}
      {showLanguagePicker && (
        <View style={styles.languagePickerOverlay}>
          <View style={styles.languagePicker}>
            <View style={styles.languagePickerHeader}>
              <Text style={styles.languagePickerTitle}>Select Language</Text>
              <TouchableOpacity 
                onPress={() => setShowLanguagePicker(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.languageList}>
              {languages.map((language) => (
                <TouchableOpacity
                  key={language.code}
                  style={[
                    styles.languageItem,
                    i18n.language === language.code && styles.selectedLanguageItem
                  ]}
                  onPress={() => handleLanguageChange(language.code)}
                  accessible={true}
                  accessibilityLabel={`Select ${language.name}`}
                  accessibilityRole="button"
                >
                  <Text style={styles.languageFlag}>{language.flag}</Text>
                  <View style={styles.languageInfo}>
                    <Text style={[
                      styles.languageName,
                      i18n.language === language.code && styles.selectedLanguageName
                    ]}>
                      {language.name}
                    </Text>
                    <Text style={styles.languageRegion}>{language.region}</Text>
                  </View>
                  {i18n.language === language.code && (
                    <Ionicons name="checkmark" size={20} color="#3b82f6" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  highContrast: {
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingTop: 40,
  },
  headerContent: {
    gap: 16,
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  locationText: {
    fontSize: 16,
    color: 'white',
    fontFamily: typography.fontFamily.medium,
    flex: 1,
  },
  changeLocationButton: {
    padding: 4,
  },
  connectivityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  connectivityText: {
    fontSize: 14,
    color: 'white',
    fontFamily: typography.fontFamily.semiBold,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  userInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
    color: 'white',
    marginBottom: 4,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 4,
  },
  roleText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
    color: 'white',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    gap: 6,
  },
  languageText: {
    fontSize: 14,
    color: 'white',
    fontFamily: typography.fontFamily.semiBold,
  },
  returnButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: typography.fontFamily.bold,
    color: '#111827',
  },
  lastUpdated: {
    fontSize: 12,
    fontFamily: typography.fontFamily.regular,
    color: '#6b7280',
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    gap: 4,
  },
  filterText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
    color: '#6b7280',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  warningsList: {
    gap: 12,
  },
  warningCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  warningHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  warningSource: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  warningSourceText: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: typography.fontFamily.medium,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 10,
    fontFamily: typography.fontFamily.semiBold,
    color: 'white',
  },
  warningTitle: {
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
    color: '#111827',
    marginBottom: 8,
  },
  warningDescription: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  warningFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  warningArea: {
    fontSize: 12,
    color: '#6b7280',
  },
  warningExpiry: {
    fontSize: 12,
    color: '#6b7280',
  },
  warningAdvice: {
    fontSize: 14,
    color: '#059669',
    fontFamily: typography.fontFamily.medium,
    fontStyle: 'italic',
  },
  hazardsList: {
    gap: 12,
  },
  hazardCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  hazardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  hazardType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hazardTypeText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
    color: '#111827',
  },
  hazardDistance: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: typography.fontFamily.medium,
  },
  hazardDescription: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  hazardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trustText: {
    fontSize: 12,
    color: '#10b981',
    fontFamily: typography.fontFamily.semiBold,
  },
  reportCount: {
    fontSize: 12,
    color: '#6b7280',
  },
  hazardTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: (width - 52) / 2,
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.semiBold,
    color: 'white',
    textAlign: 'center',
  },
  socialFeed: {
    gap: 12,
  },
  socialPost: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  postPlatform: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  platformText: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: typography.fontFamily.medium,
  },
  postTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  postContent: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 8,
  },
  postAuthor: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  emergencyButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  emergencyButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emergencyGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  emergencyText: {
    fontSize: 16,
    color: 'white',
    fontFamily: typography.fontFamily.semiBold,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 12,
  },
  languagePickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  languagePicker: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    maxHeight: '80%',
    width: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  languagePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  languagePickerTitle: {
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  languageList: {
    gap: 8,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
  },
  selectedLanguageItem: {
    backgroundColor: '#eff6ff',
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    color: '#374151',
    fontFamily: typography.fontFamily.medium,
  },
  languageRegion: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  selectedLanguageName: {
    color: '#1e40af',
    fontFamily: typography.fontFamily.semiBold,
  },
});

export default HomeScreen;