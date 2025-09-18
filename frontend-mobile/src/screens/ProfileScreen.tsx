import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  Alert, 
  Switch,
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../stores/authStore';
import { useAccessibilityStore } from '../stores/accessibilityStore';
import { useAppStore } from '../stores/appStore';
import api from '../services/api';

const ProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const { user, updateUser, logout } = useAuthStore();
  const { 
    preferences,
    updatePreferences,
    setFontSize,
    getFontSize
  } = useAccessibilityStore();
  const { networkStatus, lastSync } = useAppStore();
  
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState({
    reportsSubmitted: 0,
    sosAlerts: 0,
    forumPosts: 0,
    warningsIssued: 0
  });

  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.phone || '',
    phone: user?.phone || '',
    emergencyContacts: user?.emergencyContacts?.map(c => `${c.name}:${c.phone}`).join(', ') || '',
    preferences: user?.preferences || {}
  });

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/users/${user?.id}/stats`);
      setUserStats(response.data);
    } catch (error) {
      console.error('Error loading user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      const updateData = {
        ...formData,
        emergencyContacts: formData.emergencyContacts.split(',').map(contact => {
          const [name, phone] = contact.trim().split(':');
          return { name: name?.trim() || '', phone: phone?.trim() || '' };
        }).filter(c => c.name && c.phone),
        preferences: {
          notifications: true,
          voiceAssistance: preferences.voiceAssistance,
          highContrast: preferences.highContrast,
          fontSize: preferences.fontSize
        }
      };

      await api.put(`/users/${user?.id}`, updateData);
      updateUser(updateData);
      
      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: logout
        }
      ]
    );
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#dc2626';
      case 'moderator': return '#7c3aed';
      case 'marine_worker': return '#0369a1';
      case 'analyst': return '#059669';
      default: return '#6b7280';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return 'shield';
      case 'moderator': return 'checkmark-circle';
      case 'marine_worker': return 'boat';
      case 'analyst': return 'analytics';
      default: return 'person';
    }
  };

  const formatLastSync = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
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
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={16} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <View style={styles.roleContainer}>
            <Ionicons 
              name={getRoleIcon(user?.role || 'citizen')} 
              size={16} 
              color={getRoleColor(user?.role || 'citizen')} 
            />
            <Text style={[styles.roleText, { color: getRoleColor(user?.role || 'citizen') }]}>
              {user?.role?.replace('_', ' ').toUpperCase() || 'CITIZEN'}
            </Text>
          </View>
        </View>

        {/* User Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Activity</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Ionicons name="document-text" size={24} color="#3b82f6" />
              <Text style={styles.statNumber}>{userStats.reportsSubmitted}</Text>
              <Text style={styles.statLabel}>Reports</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="warning" size={24} color="#dc2626" />
              <Text style={styles.statNumber}>{userStats.sosAlerts}</Text>
              <Text style={styles.statLabel}>SOS Alerts</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="chatbubbles" size={24} color="#059669" />
              <Text style={styles.statNumber}>{userStats.forumPosts}</Text>
              <Text style={styles.statLabel}>Forum Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="alert-circle" size={24} color="#d97706" />
              <Text style={styles.statNumber}>{userStats.warningsIssued}</Text>
              <Text style={styles.statLabel}>Warnings</Text>
            </View>
          </View>
        </View>

        {/* Profile Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Profile Information</Text>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setEditing(!editing)}
            >
              <Ionicons name={editing ? "close" : "create"} size={20} color="#3b82f6" />
              <Text style={styles.editButtonText}>
                {editing ? 'Cancel' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={[styles.input, !editing && styles.inputDisabled]}
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                editable={editing}
                placeholder="Enter your name"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={[styles.input, !editing && styles.inputDisabled]}
                value={formData.email}
                onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                editable={editing}
                placeholder="Enter your email"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone</Text>
              <TextInput
                style={[styles.input, !editing && styles.inputDisabled]}
                value={formData.phone}
                onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                editable={editing}
                placeholder="Enter your phone number"
                placeholderTextColor="#9ca3af"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Emergency Contacts</Text>
              <TextInput
                style={[styles.input, styles.textArea, !editing && styles.inputDisabled]}
                value={formData.emergencyContacts}
                onChangeText={(text) => setFormData(prev => ({ ...prev, emergencyContacts: text }))}
                editable={editing}
                placeholder="Enter emergency contacts (comma separated)"
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={2}
                textAlignVertical="top"
              />
            </View>

            {editing && (
              <TouchableOpacity
                style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Ionicons name="checkmark" size={20} color="white" />
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Accessibility Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accessibility Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>High Contrast Mode</Text>
              <Text style={styles.settingDescription}>Improve visibility with high contrast colors</Text>
            </View>
            <Switch
              value={preferences.highContrast}
              onValueChange={(value) => updatePreferences({ highContrast: value })}
              trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
              thumbColor={preferences.highContrast ? 'white' : '#f3f4f6'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Text-to-Speech</Text>
              <Text style={styles.settingDescription}>Enable voice announcements</Text>
            </View>
            <Switch
              value={preferences.voiceAssistance}
              onValueChange={(value) => updatePreferences({ voiceAssistance: value })}
              trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
              thumbColor={preferences.voiceAssistance ? 'white' : '#f3f4f6'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Haptic Feedback</Text>
              <Text style={styles.settingDescription}>Enable vibration feedback</Text>
            </View>
            <Switch
              value={preferences.hapticFeedback}
              onValueChange={(value) => updatePreferences({ hapticFeedback: value })}
              trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
              thumbColor={preferences.hapticFeedback ? 'white' : '#f3f4f6'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Sound Effects</Text>
              <Text style={styles.settingDescription}>Enable audio notifications</Text>
            </View>
            <Switch
              value={preferences.soundEffects}
              onValueChange={(value) => updatePreferences({ soundEffects: value })}
              trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
              thumbColor={preferences.soundEffects ? 'white' : '#f3f4f6'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Font Size</Text>
              <Text style={styles.settingDescription}>Adjust text size for better readability</Text>
            </View>
            <View style={styles.fontSizeControls}>
              <TouchableOpacity 
                style={styles.fontSizeButton}
                onPress={() => setFontSize('small')}
              >
                <Ionicons name="remove" size={16} color="#6b7280" />
              </TouchableOpacity>
              <Text style={styles.fontSizeText}>{getFontSize()}px</Text>
              <TouchableOpacity 
                style={styles.fontSizeButton}
                onPress={() => setFontSize('large')}
              >
                <Ionicons name="add" size={16} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* App Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Status</Text>
          
          <View style={styles.statusItem}>
            <Ionicons 
              name={networkStatus === 'online' ? 'wifi' : 'wifi-outline'} 
              size={20} 
              color={networkStatus === 'online' ? '#059669' : '#dc2626'} 
            />
            <Text style={styles.statusLabel}>Network Status</Text>
            <Text style={[styles.statusValue, { 
              color: networkStatus === 'online' ? '#059669' : '#dc2626' 
            }]}>
              {networkStatus.toUpperCase()}
            </Text>
          </View>

          <View style={styles.statusItem}>
            <Ionicons name="sync" size={20} color="#6b7280" />
            <Text style={styles.statusLabel}>Last Sync</Text>
            <Text style={styles.statusValue}>
              {formatLastSync(lastSync)}
            </Text>
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={20} color="#dc2626" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: 'white',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#6b7280',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editButtonText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: 'white',
  },
  inputDisabled: {
    backgroundColor: '#f9fafb',
    color: '#6b7280',
  },
  textArea: {
    height: 60,
    textAlignVertical: 'top',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  fontSizeControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fontSizeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontSizeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    minWidth: 40,
    textAlign: 'center',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  statusLabel: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
    marginLeft: 12,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
    gap: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#dc2626',
  },
});

export default ProfileScreen;
