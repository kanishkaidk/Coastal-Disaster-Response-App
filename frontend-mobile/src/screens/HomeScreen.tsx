import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useAccessibilityStore } from '../stores/accessibilityStore';
import { useAuthStore } from '../stores/authStore';
import { colors, typography, spacing, borderRadius, shadows } from '../theme/theme';
import WarningCard from '../components/WarningCard';
import HazardCard from '../components/HazardCard';
import SocialFeedCard from '../components/SocialFeedCard';
import QuickActionButton from '../components/QuickActionButton';

const { width } = Dimensions.get('window');

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

interface SocialPost {
  id: string;
  author: string;
  type: 'forum' | 'social' | 'official';
  content: string;
  media?: string[];
  location: string;
  distance: number;
  trustScore: number;
  urgencyScore: number;
  aiSummary: string;
  translations: Record<string, string>;
  moderationFlags: string[];
  reactions: Record<string, number>;
  comments: number;
  createdAt: string;
}

const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { speak, hapticFeedback, getFontSize } = useAccessibilityStore();

  // State
  const [refreshing, setRefreshing] = useState(false);
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [hazards, setHazards] = useState<Hazard[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [connectivity, setConnectivity] = useState<'online' | 'offline' | 'mesh' | 'sms'>('online');

  useEffect(() => {
    // Load initial data
    loadData();
    
    // Welcome message
    speak(`Welcome to Coast-Kavach, ${user?.name || 'User'}`, { priority: 'high' });
  }, []);

  const loadData = async () => {
    // TODO: Replace with actual API calls
    setWarnings([
      {
        id: '1',
        title: 'High Tide Warning',
        description: 'High tide expected in coastal areas. Avoid beach activities.',
        severity: 'high',
        area: 'Chennai Coast',
        expiresAt: '2024-01-15T18:00:00Z',
        source: 'IMD',
        trustScore: 95,
        aiSummary: 'High tide warning for Chennai coast, avoid beach activities',
        translations: {
          hi: 'उच्च ज्वार चेतावनी',
          ta: 'உயர் அலை எச்சரிக்கை',
        },
      },
    ]);

    setHazards([
      {
        id: '1',
        type: 'flood',
        description: 'Water level rising in low-lying areas',
        location: 'Besant Nagar',
        distance: 2.5,
        severity: 'medium',
        trustScore: 78,
        crowdCount: 12,
        reportedAt: '2024-01-15T10:30:00Z',
        aiSummary: 'Flood risk in Besant Nagar area',
      },
    ]);

    setSocialPosts([
      {
        id: '1',
        author: 'Marine Worker',
        type: 'official',
        content: 'All fishing activities suspended due to rough weather conditions',
        location: 'Chennai Port',
        distance: 5.2,
        trustScore: 92,
        urgencyScore: 85,
        aiSummary: 'Official notice: Fishing suspended due to weather',
        translations: {
          hi: 'मौसम की स्थिति के कारण सभी मछली पकड़ने की गतिविधियां निलंबित',
          ta: 'வானிலை நிலைமைகள் காரணமாக அனைத்து மீன்பிடி நடவடிக்கைகளும் நிறுத்தப்பட்டன',
        },
        moderationFlags: [],
        reactions: { '👍': 15, '❤️': 8, '🙏': 3 },
        comments: 5,
        createdAt: '2024-01-15T09:00:00Z',
      },
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    hapticFeedback('light');
    speak('Refreshing data', { priority: 'normal' });
    
    await loadData();
    setRefreshing(false);
    
    speak('Data refreshed', { priority: 'normal' });
  };

  const handleQuickAction = (action: string) => {
    hapticFeedback('medium');
    speak(`${action} action selected`, { priority: 'normal' });
    
    switch (action) {
      case 'report':
        navigation.navigate('Report' as never);
        break;
      case 'resources':
        navigation.navigate('Resources' as never);
        break;
      case 'sos':
        navigation.navigate('SOS' as never);
        break;
    }
  };

  const handleCallHelpline = () => {
    hapticFeedback('medium');
    speak('Calling helpline', { priority: 'high' });
    // TODO: Implement actual call functionality
  };

  const handleSendSMS = () => {
    hapticFeedback('medium');
    speak('Opening SMS', { priority: 'high' });
    // TODO: Implement SMS functionality
  };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
        accessible={true}
        accessibilityLabel="Home screen content"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={20} color={colors.primary} />
              <Text style={[styles.locationText, { fontSize: getFontSize() }]}>
                {user?.location ? 'Chennai, Tamil Nadu' : t('location')}
              </Text>
            </View>
            
            <View style={styles.connectivityContainer}>
              <View style={styles.connectivityIndicator}>
                <Ionicons
                  name={connectivity === 'online' ? 'wifi' : connectivity === 'mesh' ? 'git-network' : 'call'}
                  size={16}
                  color={connectivity === 'online' ? colors.success : colors.warning}
                />
              </View>
              <Text style={[styles.connectivityText, { fontSize: getFontSize() * 0.9 }]}>
                {t(connectivity)}
              </Text>
            </View>
          </View>
        </View>

        {/* Warnings & Alerts */}
        {warnings.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { fontSize: getFontSize() * 1.3 }]}>
              {t('warnings')}
            </Text>
            {warnings.map((warning) => (
              <WarningCard
                key={warning.id}
                warning={warning}
                onPress={() => {
                  hapticFeedback('light');
                  speak(`Warning: ${warning.title}`, { priority: 'high' });
                }}
              />
            ))}
          </View>
        )}

        {/* Hazards Near You */}
        {hazards.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { fontSize: getFontSize() * 1.3 }]}>
              {t('hazardsNearYou')}
            </Text>
            {hazards.map((hazard) => (
              <HazardCard
                key={hazard.id}
                hazard={hazard}
                onPress={() => {
                  hapticFeedback('light');
                  speak(`Hazard: ${hazard.type}`, { priority: 'normal' });
                }}
              />
            ))}
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: getFontSize() * 1.3 }]}>
            {t('quickActions')}
          </Text>
          <View style={styles.quickActionsContainer}>
            <QuickActionButton
              icon="warning"
              label={t('reportHazard')}
              color={colors.emergency}
              onPress={() => handleQuickAction('report')}
            />
            <QuickActionButton
              icon="hand-left"
              label={t('requestResources')}
              color={colors.success}
              onPress={() => handleQuickAction('resources')}
            />
            <QuickActionButton
              icon="help-circle"
              label={t('sos')}
              color={colors.emergency}
              onPress={() => handleQuickAction('sos')}
            />
          </View>
        </View>

        {/* Social Feed */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: getFontSize() * 1.3 }]}>
            {t('socialFeed')}
          </Text>
          {socialPosts.map((post) => (
            <SocialFeedCard
              key={post.id}
              post={post}
              onPress={() => {
                hapticFeedback('light');
                speak(`Post by ${post.author}`, { priority: 'normal' });
              }}
              onReact={(emoji) => {
                hapticFeedback('light');
                speak(`${emoji} reaction`, { priority: 'low' });
              }}
              onComment={() => {
                hapticFeedback('light');
                speak('Comment on post', { priority: 'normal' });
              }}
              onShare={() => {
                hapticFeedback('light');
                speak('Share post', { priority: 'normal' });
              }}
            />
          ))}
        </View>

        {/* Helpline */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: getFontSize() * 1.3 }]}>
            {t('helpline')}
          </Text>
          <View style={styles.helplineContainer}>
            <TouchableOpacity
              style={styles.helplineButton}
              onPress={handleCallHelpline}
              accessible={true}
              accessibilityLabel="Call helpline"
              accessibilityRole="button"
            >
              <LinearGradient
                colors={colors.gradients.success}
                style={styles.helplineGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="call" size={24} color={colors.background} />
                <Text style={[styles.helplineText, { fontSize: getFontSize() * 1.1 }]}>
                  {t('call')}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.helplineButton}
              onPress={handleSendSMS}
              accessible={true}
              accessibilityLabel="Send SMS to helpline"
              accessibilityRole="button"
            >
              <LinearGradient
                colors={colors.gradients.primary}
                style={styles.helplineGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="chatbubble" size={24} color={colors.background} />
                <Text style={[styles.helplineText, { fontSize: getFontSize() * 1.1 }]}>
                  {t('sendSms')}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    paddingVertical: spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontFamily: typography.fontFamily.medium,
    color: colors.gray700,
    marginLeft: spacing.sm,
  },
  connectivityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectivityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    marginRight: spacing.sm,
  },
  connectivityText: {
    fontFamily: typography.fontFamily.medium,
    color: colors.gray600,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.semiBold,
    color: colors.gray900,
    marginBottom: spacing.md,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  helplineContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  helplineButton: {
    flex: 1,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  helplineGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
  },
  helplineText: {
    fontFamily: typography.fontFamily.semiBold,
    color: colors.background,
    marginLeft: spacing.sm,
  },
});

export default HomeScreen;
