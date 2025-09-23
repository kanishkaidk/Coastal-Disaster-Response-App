import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, borderRadius, spacing, shadows } from '../theme/theme';
import ResourceCard, { ResourceRequest } from '../components/ResourceCard';

const OfflineQueueScreen: React.FC = () => {
  const [queuedRequests, setQueuedRequests] = useState<ResourceRequest[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data - in real app, this would come from local storage/queue
  useEffect(() => {
    const mockQueuedRequests: ResourceRequest[] = [
      {
        id: '1',
        type: 'food',
        quantity: '5 meals',
        urgency: 'high',
        location: 'Beach Road, Chennai',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        description: 'Need immediate food assistance for family of 5',
      },
      {
        id: '2',
        type: 'water',
        quantity: '10 liters',
        urgency: 'critical',
        location: 'Marina Beach Area',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        description: 'Urgent water requirement due to contamination',
      },
      {
        id: '3',
        type: 'medicine',
        quantity: '2 boxes',
        urgency: 'medium',
        location: 'Besant Nagar',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        status: 'pending',
        description: 'Need basic first aid supplies',
      },
    ];
    setQueuedRequests(mockQueuedRequests);
  }, []);

  const handleRetry = (requestId: string) => {
    Alert.alert(
      'Retry Request',
      'This will attempt to send the request again. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Retry',
          onPress: () => {
            // Simulate retry logic
            Alert.alert('Success', 'Request sent successfully!');
            setQueuedRequests(prev => 
              prev.filter(req => req.id !== requestId)
            );
          },
        },
      ]
    );
  };

  const handleEdit = (requestId: string) => {
    Alert.alert('Edit Request', 'This feature will be available soon.');
  };

  const handleDelete = (requestId: string) => {
    Alert.alert(
      'Delete Request',
      'Are you sure you want to delete this request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setQueuedRequests(prev => 
              prev.filter(req => req.id !== requestId)
            );
          },
        },
      ]
    );
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="checkmark-circle" size={64} color={colors.success} />
      <Text style={styles.emptyTitle}>All Caught Up!</Text>
      <Text style={styles.emptySubtitle}>
        No queued requests. All your requests have been sent successfully.
      </Text>
    </View>
  );

  const renderRequest = ({ item }: { item: ResourceRequest }) => (
    <ResourceCard
      request={item}
      onRetry={() => handleRetry(item.id)}
      onEdit={() => handleEdit(item.id)}
      onDelete={() => handleDelete(item.id)}
      showActions={true}
      variant="queue"
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Queued Requests</Text>
        <Text style={styles.subtitle}>
          {queuedRequests.length} request{queuedRequests.length !== 1 ? 's' : ''} pending
        </Text>
      </View>

      {/* Queue Status */}
      {queuedRequests.length > 0 && (
        <View style={styles.statusBanner}>
          <Ionicons name="cloud-offline" size={20} color={colors.warning} />
          <Text style={styles.statusText}>
            Requests will be sent automatically when connection is restored
          </Text>
        </View>
      )}

      {/* Requests List */}
      <FlatList
        data={queuedRequests}
        keyExtractor={(item) => item.id}
        renderItem={renderRequest}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={renderEmptyState}
      />

      {/* Retry All Button */}
      {queuedRequests.length > 0 && (
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={[styles.retryAllButton, shadows.lg]}
            onPress={() => {
              Alert.alert(
                'Retry All',
                `Retry sending all ${queuedRequests.length} queued requests?`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Retry All',
                    onPress: () => {
                      Alert.alert('Success', 'All requests sent successfully!');
                      setQueuedRequests([]);
                    },
                  },
                ]
              );
            }}
            accessibilityLabel="Retry all queued requests"
            accessibilityRole="button"
          >
            <Ionicons name="refresh" size={20} color={colors.background} />
            <Text style={styles.retryAllText}>Retry All</Text>
          </TouchableOpacity>
        </View>
      )}
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
    color: colors.onBackground,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.base,
    color: colors.gray600,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningLight + '20',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  statusText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.warningDark,
    marginLeft: spacing.sm,
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['2xl'],
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['3xl'],
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xl,
    color: colors.onBackground,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.base,
    color: colors.gray600,
    textAlign: 'center',
    lineHeight: typography.lineHeight.normal * typography.fontSize.base,
  },
  bottomActions: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  retryAllButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  retryAllText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.base,
    color: colors.background,
  },
});

export default OfflineQueueScreen;
