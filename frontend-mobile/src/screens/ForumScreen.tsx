import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  Alert, 
  RefreshControl,
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../stores/authStore';
import api from '../services/api';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    role: string;
  };
  createdAt: string;
  urgency: 'low' | 'medium' | 'high';
  type: 'help' | 'info' | 'offer';
  trustScore?: number;
  summary?: string;
  translations?: Record<string, string>;
  moderationFlags?: string[];
  reactions: Record<string, number>;
  commentsCount: number;
  isPinned?: boolean;
  isLocked?: boolean;
}

const ForumScreen: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostType, setNewPostType] = useState<'help' | 'info' | 'offer'>('help');
  const [newPostUrgency, setNewPostUrgency] = useState<'low' | 'medium' | 'high'>('medium');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/forums?limit=20&sortBy=createdAt&order=desc');
      setPosts(response.data);
    } catch (error) {
      console.error('Error loading posts:', error);
      Alert.alert('Error', 'Failed to load forum posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  };

  const createPost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.post('/forums', {
        title: newPostTitle.trim(),
        content: newPostContent.trim(),
        type: newPostType,
        urgency: newPostUrgency,
        author: user?.id
      });

      // Add the new post to the beginning of the list
      setPosts(prev => [response.data, ...prev]);
      
      // Reset form
      setNewPostTitle('');
      setNewPostContent('');
      setNewPostType('help');
      setNewPostUrgency('medium');
      setShowCreateForm(false);
      
      Alert.alert('Success', 'Your post has been created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const reactToPost = async (postId: string, emoji: string) => {
    try {
      await api.post(`/forums/${postId}/react`, { emoji });
      // Refresh posts to get updated reaction counts
      loadPosts();
    } catch (error) {
      console.error('Error reacting to post:', error);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return '#dc2626';
      case 'medium': return '#d97706';
      case 'low': return '#059669';
      default: return '#6b7280';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'help': return 'help-circle';
      case 'info': return 'information-circle';
      case 'offer': return 'hand-left';
      default: return 'chatbubble';
    }
  };

  const getTrustScoreColor = (score?: number) => {
    if (!score) return '#6b7280';
    if (score >= 80) return '#059669';
    if (score >= 60) return '#d97706';
    if (score >= 40) return '#ea580c';
    return '#dc2626';
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

  const renderPost = (post: ForumPost) => (
    <View key={post.id} style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.postAuthor}>
          <View style={styles.authorAvatar}>
            <Text style={styles.authorInitial}>
              {post.author.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{post.author.name}</Text>
            <Text style={styles.postTime}>{formatTimeAgo(post.createdAt)}</Text>
          </View>
        </View>
        <View style={styles.postMeta}>
          {post.isPinned && (
            <Ionicons name="pin" size={16} color="#3b82f6" />
          )}
          {post.isLocked && (
            <Ionicons name="lock-closed" size={16} color="#6b7280" />
          )}
        </View>
      </View>

      <Text style={styles.postTitle}>{post.title}</Text>
      <Text style={styles.postContent} numberOfLines={3}>
        {post.summary || post.content}
      </Text>

      <View style={styles.postTags}>
        <View style={[styles.typeTag, { backgroundColor: getUrgencyColor(post.urgency) }]}>
          <Ionicons name={getTypeIcon(post.type)} size={12} color="white" />
          <Text style={styles.typeTagText}>{post.type.toUpperCase()}</Text>
        </View>
        <View style={[styles.urgencyTag, { borderColor: getUrgencyColor(post.urgency) }]}>
          <Text style={[styles.urgencyText, { color: getUrgencyColor(post.urgency) }]}>
            {post.urgency.toUpperCase()}
          </Text>
        </View>
        {post.trustScore && (
          <View style={[styles.trustTag, { backgroundColor: getTrustScoreColor(post.trustScore) }]}>
            <Text style={styles.trustText}>
              Trust: {post.trustScore}%
            </Text>
          </View>
        )}
      </View>

      <View style={styles.postActions}>
        <View style={styles.reactions}>
          {Object.entries(post.reactions).map(([emoji, count]) => (
            <TouchableOpacity
              key={emoji}
              style={styles.reactionButton}
              onPress={() => reactToPost(post.id, emoji)}
            >
              <Text style={styles.reactionEmoji}>{emoji}</Text>
              <Text style={styles.reactionCount}>{count}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.commentInfo}>
          <Ionicons name="chatbubble-outline" size={16} color="#6b7280" />
          <Text style={styles.commentCount}>{post.commentsCount}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Community Forum</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => setShowCreateForm(true)}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {showCreateForm && (
        <View style={styles.createForm}>
          <Text style={styles.formTitle}>Create New Post</Text>
          
          <TextInput
            style={styles.formInput}
            value={newPostTitle}
            onChangeText={setNewPostTitle}
            placeholder="Post title"
            placeholderTextColor="#9ca3af"
          />
          
          <TextInput
            style={[styles.formInput, styles.formTextArea]}
            value={newPostContent}
            onChangeText={setNewPostContent}
            placeholder="What's on your mind?"
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <View style={styles.formRow}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Type</Text>
              <View style={styles.typeButtons}>
                {(['help', 'info', 'offer'] as const).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      newPostType === type && styles.selectedTypeButton
                    ]}
                    onPress={() => setNewPostType(type)}
                  >
                    <Text style={[
                      styles.typeButtonText,
                      newPostType === type && styles.selectedTypeButtonText
                    ]}>
                      {type.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Urgency</Text>
              <View style={styles.urgencyButtons}>
                {(['low', 'medium', 'high'] as const).map((urgency) => (
                  <TouchableOpacity
                    key={urgency}
                    style={[
                      styles.urgencyButton,
                      newPostUrgency === urgency && styles.selectedUrgencyButton,
                      { borderColor: getUrgencyColor(urgency) }
                    ]}
                    onPress={() => setNewPostUrgency(urgency)}
                  >
                    <Text style={[
                      styles.urgencyButtonText,
                      newPostUrgency === urgency && styles.selectedUrgencyButtonText
                    ]}>
                      {urgency.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.formActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowCreateForm(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
              onPress={createPost}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Post</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView
        style={styles.postsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text style={styles.loadingText}>Loading posts...</Text>
          </View>
        ) : posts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={64} color="#9ca3af" />
            <Text style={styles.emptyText}>No posts yet</Text>
            <Text style={styles.emptySubtext}>Be the first to start a discussion!</Text>
          </View>
        ) : (
          posts.map(renderPost)
        )}
      </ScrollView>
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
  createButton: {
    backgroundColor: '#3b82f6',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createForm: {
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: 'white',
    marginBottom: 16,
  },
  formTextArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  formRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  formGroup: {
    flex: 1,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
    alignItems: 'center',
  },
  selectedTypeButton: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  typeButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  selectedTypeButtonText: {
    color: 'white',
  },
  urgencyButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  urgencyButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 2,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
  },
  selectedUrgencyButton: {
    backgroundColor: '#eff6ff',
  },
  urgencyButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  selectedUrgencyButtonText: {
    color: '#1f2937',
    fontWeight: '600',
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  postsList: {
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
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  postCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  postAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  authorInitial: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  postTime: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  postMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  postContent: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  postTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  typeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  typeTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  urgencyTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  urgencyText: {
    fontSize: 10,
    fontWeight: '600',
  },
  trustTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trustText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reactions: {
    flexDirection: 'row',
    gap: 12,
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    gap: 4,
  },
  reactionEmoji: {
    fontSize: 16,
  },
  reactionCount: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  commentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentCount: {
    fontSize: 12,
    color: '#6b7280',
  },
});

export default ForumScreen;
