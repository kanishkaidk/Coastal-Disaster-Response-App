import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, borderRadius, spacing, shadows } from '../theme/theme';
import ResourceCard, { ResourceRequest } from '../components/ResourceCard';
import FilterButton from '../components/FilterButton';
import { ResourceType } from '../components/ResourceTypeDropdown';
import UrgencyBadge, { UrgencyLevel } from '../components/UrgencyBadge';

interface FilterOptions {
  resourceTypes: ResourceType[];
  urgencyLevels: UrgencyLevel[];
}

const NearbyFeedScreen: React.FC = () => {
  const [nearbyRequests, setNearbyRequests] = useState<ResourceRequest[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    resourceTypes: [],
    urgencyLevels: [],
  });

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockNearbyRequests: ResourceRequest[] = [
      {
        id: '1',
        type: 'food',
        quantity: '3 meals',
        urgency: 'high',
        location: 'Beach Road, Chennai',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        requesterName: 'Sarah M.',
        description: 'Need immediate food assistance for family',
      },
      {
        id: '2',
        type: 'water',
        quantity: '5 liters',
        urgency: 'critical',
        location: 'Marina Beach Area',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        requesterName: 'Raj K.',
        description: 'Urgent water requirement due to contamination',
      },
      {
        id: '3',
        type: 'medicine',
        quantity: '1 box',
        urgency: 'medium',
        location: 'Besant Nagar',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        requesterName: 'Priya S.',
        description: 'Need basic first aid supplies',
      },
      {
        id: '4',
        type: 'shelter',
        quantity: '2 people',
        urgency: 'high',
        location: 'Thiruvanmiyur',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        requesterName: 'Kumar R.',
        description: 'Temporary shelter needed for displaced family',
      },
      {
        id: '5',
        type: 'clothing',
        quantity: '4 sets',
        urgency: 'low',
        location: 'Adyar',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        requesterName: 'Meera L.',
        description: 'Clothing for children affected by flood',
      },
    ];
    setNearbyRequests(mockNearbyRequests);
  }, []);

  const handleOfferHelp = (requestId: string) => {
    Alert.alert(
      'Offer Help',
      'Thank you for wanting to help! This will connect you with the requester.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Connect',
          onPress: () => {
            Alert.alert('Success', 'You have been connected with the requester!');
            // In real app, this would initiate contact/chat
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

  const getActiveFiltersCount = () => {
    return filters.resourceTypes.length + filters.urgencyLevels.length;
  };

  const getFilteredRequests = () => {
    return nearbyRequests.filter(request => {
      const typeMatch = filters.resourceTypes.length === 0 || 
        filters.resourceTypes.includes(request.type);
      const urgencyMatch = filters.urgencyLevels.length === 0 || 
        filters.urgencyLevels.includes(request.urgency);
      return typeMatch && urgencyMatch;
    });
  };

  const toggleResourceTypeFilter = (type: ResourceType) => {
    setFilters(prev => ({
      ...prev,
      resourceTypes: prev.resourceTypes.includes(type)
        ? prev.resourceTypes.filter(t => t !== type)
        : [...prev.resourceTypes, type],
    }));
  };

  const toggleUrgencyFilter = (urgency: UrgencyLevel) => {
    setFilters(prev => ({
      ...prev,
      urgencyLevels: prev.urgencyLevels.includes(urgency)
        ? prev.urgencyLevels.filter(u => u !== urgency)
        : [...prev.urgencyLevels, urgency],
    }));
  };

  const clearFilters = () => {
    setFilters({ resourceTypes: [], urgencyLevels: [] });
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="people" size={64} color={colors.gray400} />
      <Text style={styles.emptyTitle}>No Nearby Requests</Text>
      <Text style={styles.emptySubtitle}>
        There are no resource requests in your area at the moment.
      </Text>
    </View>
  );

  const renderRequest = ({ item }: { item: ResourceRequest }) => (
    <ResourceCard
      request={item}
      onOfferHelp={() => handleOfferHelp(item.id)}
      showActions={true}
      variant="feed"
    />
  );

  const renderFilterModal = () => (
    <Modal
      visible={showFilters}
      transparent
      animationType="slide"
      onRequestClose={() => setShowFilters(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Requests</Text>
            <TouchableOpacity
              onPress={() => setShowFilters(false)}
              accessibilityLabel="Close filters"
              accessibilityRole="button"
            >
              <Ionicons name="close" size={24} color={colors.gray500} />
            </TouchableOpacity>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Resource Type</Text>
            <View style={styles.filterOptions}>
              {['food', 'water', 'medicine', 'shelter', 'clothing', 'fuel', 'tools', 'other'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.filterOption,
                    filters.resourceTypes.includes(type as ResourceType) && styles.filterOptionActive,
                  ]}
                  onPress={() => toggleResourceTypeFilter(type as ResourceType)}
                >
                  <Text style={[
                    styles.filterOptionText,
                    filters.resourceTypes.includes(type as ResourceType) && styles.filterOptionTextActive,
                  ]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Urgency Level</Text>
            <View style={styles.urgencyFilters}>
              {['low', 'medium', 'high', 'critical'].map((urgency) => (
                <TouchableOpacity
                  key={urgency}
                  style={[
                    styles.urgencyFilterButton,
                    filters.urgencyLevels.includes(urgency as UrgencyLevel) && styles.urgencyFilterButtonActive,
                  ]}
                  onPress={() => toggleUrgencyFilter(urgency as UrgencyLevel)}
                >
                  <UrgencyBadge urgency={urgency as UrgencyLevel} size="small" />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearFilters}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setShowFilters(false)}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const filteredRequests = getFilteredRequests();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Nearby Requests</Text>
          <Text style={styles.subtitle}>
            {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''} found
          </Text>
        </View>
        <FilterButton
          onPress={() => setShowFilters(true)}
          activeFilters={getActiveFiltersCount()}
        />
      </View>

      {/* Requests List */}
      <FlatList
        data={filteredRequests}
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

      {renderFilterModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius['2xl'],
    borderTopRightRadius: borderRadius['2xl'],
    maxHeight: '80%',
    paddingBottom: spacing['2xl'],
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  modalTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xl,
    color: colors.onBackground,
  },
  filterSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  filterSectionTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.lg,
    color: colors.onBackground,
    marginBottom: spacing.md,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  filterOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.gray300,
    backgroundColor: colors.background,
  },
  filterOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterOptionText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.gray700,
  },
  filterOptionTextActive: {
    color: colors.background,
  },
  urgencyFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  urgencyFilterButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  urgencyFilterButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight + '20',
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  clearButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.gray300,
    alignItems: 'center',
  },
  clearButtonText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.base,
    color: colors.gray700,
  },
  applyButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  applyButtonText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.base,
    color: colors.background,
  },
});

export default NearbyFeedScreen;
