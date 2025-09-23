import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, borderRadius, spacing, shadows } from '../theme/theme';
import UrgencyBadge, { UrgencyLevel } from './UrgencyBadge';
import { ResourceType } from './ResourceTypeDropdown';

export interface ResourceRequest {
  id: string;
  type: ResourceType;
  quantity: string;
  urgency: UrgencyLevel;
  location: string;
  timestamp: string;
  status?: 'pending' | 'fulfilled' | 'cancelled';
  requesterName?: string;
  description?: string;
}

interface ResourceCardProps {
  request: ResourceRequest;
  onOfferHelp?: () => void;
  onRetry?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
  variant?: 'request' | 'queue' | 'feed';
  style?: any;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  request,
  onOfferHelp,
  onRetry,
  onEdit,
  onDelete,
  showActions = false,
  variant = 'request',
  style
}) => {
  const getResourceIcon = (type: ResourceType) => {
    const icons = {
      food: 'restaurant',
      water: 'water',
      medicine: 'medical',
      shelter: 'home',
      clothing: 'shirt',
      fuel: 'flame',
      tools: 'construct',
      other: 'ellipsis-horizontal',
    };
    return icons[type] || 'ellipsis-horizontal';
  };

  const getResourceColor = (type: ResourceType) => {
    const colors_map = {
      food: colors.success,
      water: colors.primary,
      medicine: colors.emergency,
      shelter: colors.warning,
      clothing: colors.gray600,
      fuel: colors.warningDark,
      tools: colors.gray700,
      other: colors.gray500,
    };
    return colors_map[type] || colors.gray500;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const resourceColor = getResourceColor(request.type);
  const resourceIcon = getResourceIcon(request.type);

  return (
    <View style={[styles.card, shadows.md, style]}>
      {/* Header Row */}
      <View style={styles.header}>
        <View style={styles.resourceInfo}>
          <View style={[styles.resourceIcon, { backgroundColor: resourceColor + '20' }]}>
            <Ionicons name={resourceIcon as any} size={24} color={resourceColor} />
          </View>
          <View style={styles.resourceDetails}>
            <Text style={styles.resourceType}>
              {request.type.charAt(0).toUpperCase() + request.type.slice(1)}
            </Text>
            <Text style={styles.quantity}>
              Quantity: {request.quantity}
            </Text>
          </View>
        </View>
        <UrgencyBadge urgency={request.urgency} size="small" />
      </View>

      {/* Location and Timestamp */}
      <View style={styles.metaInfo}>
        <View style={styles.locationRow}>
          <Ionicons name="location" size={16} color={colors.gray500} />
          <Text style={styles.location} numberOfLines={1}>
            {request.location}
          </Text>
        </View>
        <Text style={styles.timestamp}>
          {formatTimestamp(request.timestamp)}
        </Text>
      </View>

      {/* Description (if available) */}
      {request.description && (
        <Text style={styles.description} numberOfLines={2}>
          {request.description}
        </Text>
      )}

      {/* Requester Name (if available) */}
      {request.requesterName && (
        <View style={styles.requesterRow}>
          <Ionicons name="person" size={16} color={colors.gray500} />
          <Text style={styles.requesterName}>
            {request.requesterName}
          </Text>
        </View>
      )}

      {/* Action Buttons */}
      {showActions && (
        <View style={styles.actions}>
          {variant === 'feed' && onOfferHelp && (
            <TouchableOpacity
              style={[styles.actionButton, styles.offerButton]}
              onPress={onOfferHelp}
              accessibilityLabel="Offer help for this request"
              accessibilityRole="button"
            >
              <Ionicons name="hand-left" size={16} color={colors.background} />
              <Text style={styles.offerButtonText}>Offer Help</Text>
            </TouchableOpacity>
          )}
          
          {variant === 'queue' && (
            <View style={styles.queueActions}>
              {onRetry && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.retryButton]}
                  onPress={onRetry}
                  accessibilityLabel="Retry sending request"
                  accessibilityRole="button"
                >
                  <Ionicons name="refresh" size={16} color={colors.primary} />
                </TouchableOpacity>
              )}
              {onEdit && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.editButton]}
                  onPress={onEdit}
                  accessibilityLabel="Edit request"
                  accessibilityRole="button"
                >
                  <Ionicons name="create" size={16} color={colors.warning} />
                </TouchableOpacity>
              )}
              {onDelete && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={onDelete}
                  accessibilityLabel="Delete request"
                  accessibilityRole="button"
                >
                  <Ionicons name="trash" size={16} color={colors.emergency} />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  resourceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  resourceIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  resourceDetails: {
    flex: 1,
  },
  resourceType: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.lg,
    color: colors.onBackground,
    marginBottom: spacing.xs,
  },
  quantity: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  location: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
    marginLeft: spacing.xs,
    flex: 1,
  },
  timestamp: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.gray500,
  },
  description: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.gray700,
    marginBottom: spacing.sm,
    lineHeight: typography.lineHeight.normal * typography.fontSize.sm,
  },
  requesterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  requesterName: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
    marginLeft: spacing.xs,
  },
  actions: {
    marginTop: spacing.sm,
  },
  offerButton: {
    backgroundColor: colors.success,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  offerButtonText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.sm,
    color: colors.background,
    marginLeft: spacing.xs,
  },
  queueActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  retryButton: {
    backgroundColor: colors.primaryLight + '20',
    borderColor: colors.primary,
  },
  editButton: {
    backgroundColor: colors.warningLight + '20',
    borderColor: colors.warning,
  },
  deleteButton: {
    backgroundColor: colors.emergencyLight + '20',
    borderColor: colors.emergency,
  },
});

export default ResourceCard;
