import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator,
  ScrollView,
  TextInput,
  Vibration
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../stores/appStore';
import { useAuthStore } from '../stores/authStore';
import locationService from '../services/locationService';
import api from '../services/api';

interface SOSAlert {
  id: string;
  message: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  channels: string[];
  createdAt: string;
  emergencyContacts: string[];
}

const SOSScreen: React.FC = () => {
  const { t } = useTranslation();
  const { currentLocation, setCurrentLocation } = useAppStore();
  const { user } = useAuthStore();
  const [sosMessage, setSosMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [recentAlerts, setRecentAlerts] = useState<SOSAlert[]>([]);
  const [location, setLocation] = useState<{latitude: number; longitude: number} | null>(null);

  const emergencyTypes = [
    { id: 'medical', label: 'Medical Emergency', icon: 'medical', color: '#dc2626' },
    { id: 'flood', label: 'Flood Emergency', icon: 'water', color: '#0369a1' },
    { id: 'storm', label: 'Storm Emergency', icon: 'thunderstorm', color: '#7c3aed' },
    { id: 'fire', label: 'Fire Emergency', icon: 'flame', color: '#ea580c' },
    { id: 'trapped', label: 'Trapped/Stranded', icon: 'lock-closed', color: '#dc2626' },
    { id: 'other', label: 'Other Emergency', icon: 'warning', color: '#6b7280' },
  ];

  const quickMessages = [
    "I need immediate help!",
    "Medical emergency - send ambulance",
    "Flood emergency - need rescue",
    "I'm trapped and need assistance",
    "Storm emergency - shelter needed",
    "Fire emergency - need fire department"
  ];

  useEffect(() => {
    getCurrentLocation();
    loadRecentAlerts();
  }, []);

  const getCurrentLocation = async () => {
    const location = await locationService.getCurrentLocation();
    if (location) {
      setLocation({ latitude: location.latitude, longitude: location.longitude });
      setCurrentLocation(location);
    }
  };

  const loadRecentAlerts = async () => {
    try {
      const response = await api.get('/sos?limit=5&sortBy=createdAt&order=desc');
      setRecentAlerts(response.data);
    } catch (error) {
      console.error('Error loading recent alerts:', error);
    }
  };

  const sendSOS = async (emergencyType: string, customMessage?: string) => {
    if (!location) {
      Alert.alert('Error', 'Location is required for SOS. Please enable location services.');
      return;
    }

    const message = customMessage || sosMessage || `Emergency: ${emergencyType} - Immediate assistance needed!`;
    
    Alert.alert(
      'Send SOS Alert',
      `Are you sure you want to send an emergency alert? This will notify emergency services and your contacts.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send SOS', 
          style: 'destructive',
          onPress: () => performSOS(emergencyType, message)
        }
      ]
    );
  };

  const performSOS = async (emergencyType: string, message: string) => {
    try {
      setSending(true);
      
      // Vibrate device for immediate feedback
      Vibration.vibrate([0, 500, 200, 500]);

      const sosData = {
        message,
        emergencyType,
        location: {
          type: 'Point',
          coordinates: [location!.longitude, location!.latitude]
        },
        reportedBy: user?.id,
        emergencyContacts: user?.emergencyContacts || []
      };

      const response = await api.post('/sos', sosData);
      
      // Add to recent alerts
      setRecentAlerts(prev => [response.data, ...prev]);
      
      Alert.alert(
        'SOS Sent!',
        'Your emergency alert has been sent to emergency services and your contacts. Help is on the way!',
        [{ text: 'OK' }]
      );

      // Reset message
      setSosMessage('');
      
    } catch (error) {
      console.error('Error sending SOS:', error);
      Alert.alert('Error', 'Failed to send SOS alert. Please try again or call emergency services directly.');
    } finally {
      setSending(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return '#059669';
      case 'delivered': return '#0369a1';
      case 'failed': return '#dc2626';
      case 'pending': return '#d97706';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return 'checkmark-circle';
      case 'delivered': return 'checkmark-done-circle';
      case 'failed': return 'close-circle';
      case 'pending': return 'time';
      default: return 'help-circle';
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
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Emergency SOS</Text>
          <Text style={styles.subtitle}>
            {location 
              ? `Location: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
              : 'Getting your location...'
            }
          </Text>
        </View>

        {/* Emergency Types */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Type</Text>
          <View style={styles.emergencyTypesGrid}>
            {emergencyTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[styles.emergencyTypeButton, { borderColor: type.color }]}
                onPress={() => sendSOS(type.id)}
                disabled={sending}
              >
                <Ionicons name={type.icon as any} size={32} color={type.color} />
                <Text style={[styles.emergencyTypeText, { color: type.color }]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Custom Message */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Custom Message (Optional)</Text>
          <TextInput
            style={styles.messageInput}
            value={sosMessage}
            onChangeText={setSosMessage}
            placeholder="Describe your emergency situation..."
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Quick Messages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Messages</Text>
          <View style={styles.quickMessagesList}>
            {quickMessages.map((message, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickMessageButton}
                onPress={() => {
                  setSosMessage(message);
                  sendSOS('other', message);
                }}
                disabled={sending}
              >
                <Text style={styles.quickMessageText}>{message}</Text>
                <Ionicons name="arrow-forward" size={16} color="#6b7280" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Alerts */}
        {recentAlerts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Alerts</Text>
            <View style={styles.alertsList}>
              {recentAlerts.map((alert) => (
                <View key={alert.id} style={styles.alertItem}>
                  <View style={styles.alertHeader}>
                    <View style={styles.alertInfo}>
                      <Text style={styles.alertMessage} numberOfLines={2}>
                        {alert.message}
                      </Text>
                      <Text style={styles.alertTime}>
                        {formatTimeAgo(alert.createdAt)}
                      </Text>
                    </View>
                    <View style={styles.alertStatus}>
                      <Ionicons 
                        name={getStatusIcon(alert.status)} 
                        size={20} 
                        color={getStatusColor(alert.status)} 
                      />
                      <Text style={[styles.statusText, { color: getStatusColor(alert.status) }]}>
                        {alert.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.alertChannels}>
                    <Text style={styles.channelsLabel}>Sent via:</Text>
                    <Text style={styles.channelsText}>
                      {alert.channels.join(', ')}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Emergency Contacts Info */}
        <View style={styles.section}>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color="#0369a1" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Emergency Information</Text>
              <Text style={styles.infoText}>
                • SOS alerts are sent to emergency services and your contacts
              </Text>
              <Text style={styles.infoText}>
                • Your location is automatically included
              </Text>
              <Text style={styles.infoText}>
                • For immediate help, call 100 (Police), 101 (Fire), 102 (Ambulance)
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating SOS Button */}
      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity
          style={[styles.sosButton, sending && styles.sosButtonDisabled]}
          onPress={() => sendSOS('other')}
          disabled={sending}
        >
          {sending ? (
            <ActivityIndicator color="white" size="large" />
          ) : (
            <>
              <Ionicons name="warning" size={32} color="white" />
              <Text style={styles.sosButtonText}>SOS</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
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
    paddingBottom: 100, // Space for floating button
  },
  header: {
    backgroundColor: '#dc2626',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  emergencyTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  emergencyTypeButton: {
    width: '47%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: '#f9fafb',
  },
  emergencyTypeText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  messageInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: 'white',
    height: 80,
    textAlignVertical: 'top',
  },
  quickMessagesList: {
    gap: 8,
  },
  quickMessageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  quickMessageText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  alertsList: {
    gap: 12,
  },
  alertItem: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  alertInfo: {
    flex: 1,
    marginRight: 12,
  },
  alertMessage: {
    fontSize: 14,
    color: '#111827',
    marginBottom: 4,
  },
  alertTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  alertStatus: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  alertChannels: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  channelsLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginRight: 4,
  },
  channelsText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1e40af',
    marginBottom: 4,
    lineHeight: 20,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1000,
  },
  sosButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#dc2626',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sosButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  sosButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 4,
  },
});

export default SOSScreen;
