import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, borderRadius, spacing, shadows } from '../theme/theme';
import ResourceRequestFormScreen from './ResourceRequestFormScreen';
import OfflineQueueScreen from './OfflineQueueScreen';
import NearbyFeedScreen from './NearbyFeedScreen';

type TabType = 'request' | 'queue' | 'feed';

const ResourcesScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('request');

  const tabs = [
    {
      id: 'request' as TabType,
      label: 'Request',
      icon: 'add-circle',
      component: ResourceRequestFormScreen,
    },
    {
      id: 'queue' as TabType,
      label: 'Queue',
      icon: 'time',
      component: OfflineQueueScreen,
    },
    {
      id: 'feed' as TabType,
      label: 'Nearby',
      icon: 'people',
      component: NearbyFeedScreen,
    },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || ResourceRequestFormScreen;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Resources</Text>
        <Text style={styles.subtitle}>
          Request help, manage offline queue, and find nearby requests
        </Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScrollContent}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && styles.tabActive,
              ]}
              onPress={() => setActiveTab(tab.id)}
              accessibilityLabel={`${tab.label} tab`}
              accessibilityRole="button"
              accessibilityState={{ selected: activeTab === tab.id }}
            >
              <Ionicons
                name={tab.icon as any}
                size={20}
                color={activeTab === tab.id ? colors.background : colors.gray600}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.id && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <ActiveComponent />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize['3xl'],
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.base,
    color: colors.gray600,
    lineHeight: typography.lineHeight.normal * typography.fontSize.base,
  },
  tabContainer: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
    paddingHorizontal: spacing.lg,
  },
  tabScrollContent: {
    paddingVertical: spacing.sm,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginRight: spacing.sm,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.gray100,
  },
  tabActive: {
    backgroundColor: colors.primary,
    ...shadows.sm,
  },
  tabText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
    marginLeft: spacing.xs,
  },
  tabTextActive: {
    color: colors.background,
  },
  content: {
    flex: 1,
  },
});

export default ResourcesScreen;

