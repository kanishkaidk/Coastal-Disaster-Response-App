import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

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

interface SocialFeedCardProps {
  post: SocialPost;
  onPress: () => void;
  onReact: (emoji: string) => void;
  onComment: () => void;
  onShare: () => void;
}

const SocialFeedCard: React.FC<SocialFeedCardProps> = ({ 
  post, 
  onPress, 
  onReact, 
  onComment, 
  onShare 
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'official':
        return 'shield-checkmark';
      case 'forum':
        return 'chatbubbles';
      case 'social':
        return 'people';
      default:
        return 'person';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'official':
        return 'from-green-500 to-green-400';
      case 'forum':
        return 'from-blue-500 to-blue-400';
      case 'social':
        return 'from-purple-500 to-purple-400';
      default:
        return 'from-gray-500 to-gray-400';
    }
  };

  const getUrgencyColor = (score: number) => {
    if (score >= 80) return 'bg-red-100 text-red-800';
    if (score >= 60) return 'bg-orange-100 text-orange-800';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      accessible={true}
      accessibilityLabel={`Post by ${post.author}`}
      accessibilityRole="button"
    >
      <LinearGradient
        colors={['#ffffff', '#f9fafb']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.authorContainer}>
            <View style={[styles.avatar, { backgroundColor: post.type === 'official' ? '#10b981' : post.type === 'forum' ? '#3b82f6' : '#8b5cf6' }]}>
              <Ionicons 
                name={getTypeIcon(post.type) as any} 
                size={20} 
                color="white" 
              />
            </View>
            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>
                {post.author}
              </Text>
              <Text style={styles.authorLocation}>
                {post.location} • {post.distance}km
              </Text>
            </View>
          </View>
          
          <View style={styles.badgesContainer}>
            <View style={[styles.urgencyBadge, { backgroundColor: post.urgencyScore >= 80 ? '#fef2f2' : post.urgencyScore >= 60 ? '#fef3c7' : '#f0fdf4' }]}>
              <Text style={[styles.badgeText, { color: post.urgencyScore >= 80 ? '#dc2626' : post.urgencyScore >= 60 ? '#d97706' : '#059669' }]}>
                {post.urgencyScore}% Urgent
              </Text>
            </View>
            <View style={styles.trustBadge}>
              <Text style={styles.trustText}>
                {post.trustScore}% Trust
              </Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <Text style={styles.content}>
          {post.content}
        </Text>

        {/* AI Summary */}
        {post.aiSummary && (
          <View style={styles.aiSummary}>
            <Text style={styles.aiSummaryText}>
              AI Summary: {post.aiSummary}
            </Text>
          </View>
        )}

        {/* Moderation Flags */}
        {post.moderationFlags.length > 0 && (
          <View style={styles.flagsContainer}>
            {post.moderationFlags.map((flag, index) => (
              <View key={index} style={styles.flagBadge}>
                <Text style={styles.flagText}>
                  {flag}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onReact('👍')}
              accessible={true}
              accessibilityLabel="Like post"
              accessibilityRole="button"
            >
              <Ionicons name="thumbs-up" size={20} color="#6b7280" />
              <Text style={styles.actionText}>
                {post.reactions['👍'] || 0}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onComment}
              accessible={true}
              accessibilityLabel="Comment on post"
              accessibilityRole="button"
            >
              <Ionicons name="chatbubble" size={20} color="#6b7280" />
              <Text style={styles.actionText}>
                {post.comments}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onShare}
              accessible={true}
              accessibilityLabel="Share post"
              accessibilityRole="button"
            >
              <Ionicons name="share" size={20} color="#6b7280" />
              <Text style={styles.actionText}>
                Share
              </Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.timestamp}>
            {new Date(post.createdAt).toLocaleTimeString()}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  gradient: {
    padding: 16,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorInfo: {
    marginLeft: 12,
  },
  authorName: {
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  authorLocation: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#6b7280',
  },
  badgesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  badgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
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
  content: {
    fontFamily: 'Inter-Medium',
    color: '#1f2937',
    marginBottom: 12,
  },
  aiSummary: {
    backgroundColor: '#eff6ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  aiSummaryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1e40af',
  },
  flagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  flagBadge: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  flagText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#dc2626',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  timestamp: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#9ca3af',
  },
});

export default SocialFeedCard;
