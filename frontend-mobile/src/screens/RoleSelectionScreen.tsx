import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useAccessibilityStore } from '../stores/accessibilityStore';
import { useAuthStore } from '../stores/authStore';

export default function RoleSelectionScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { speak, hapticFeedback, getFontSize } = useAccessibilityStore();
  const { updateUser } = useAuthStore();

  const handleMarineWorker = async () => {
    hapticFeedback('medium');
    speak('Marine Worker role selected', { priority: 'normal' });
    
    try {
      await updateUser({ role: 'marine_worker' });
      navigation.navigate('MarineWorkerVerification' as never);
    } catch (error) {
      console.error('Failed to update user role:', error);
      speak('Failed to set role. Please try again.', { priority: 'high' });
    }
  };

  const handleCitizen = async () => {
    hapticFeedback('medium');
    speak('Citizen role selected', { priority: 'normal' });
    
    try {
      await updateUser({ role: 'citizen' });
      navigation.navigate('MainTabs' as never);
    } catch (error) {
      console.error('Failed to update user role:', error);
      speak('Failed to set role. Please try again.', { priority: 'high' });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={[styles.title, { fontSize: getFontSize() * 2 }]}>
          {t('selectYourRole')}
        </Text>
        <Text style={[styles.subtitle, { fontSize: getFontSize() * 1.1 }]}>
          {t('chooseRoleDescription')}
        </Text>
        
        <View style={styles.roleOptionsContainer}>
          <TouchableOpacity
            style={styles.roleButton}
            onPress={handleMarineWorker}
            accessible={true}
            accessibilityLabel={t('marineWorkerRole')}
            accessibilityRole="button"
          >
            <Text style={[styles.roleButtonText, { fontSize: getFontSize() * 1.2 }]}>
              {t('marineWorkerRole')}
            </Text>
            <Text style={[styles.roleDescription, { fontSize: getFontSize() }]}>
              {t('marineWorkerRoleDescription')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.roleButton, styles.citizenButton]}
            onPress={handleCitizen}
            accessible={true}
            accessibilityLabel={t('citizenRole')}
            accessibilityRole="button"
          >
            <Text style={[styles.roleButtonText, { fontSize: getFontSize() * 1.2 }]}>
              {t('citizenRole')}
            </Text>
            <Text style={[styles.roleDescription, { fontSize: getFontSize() }]}>
              {t('citizenRoleDescription')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    color: '#6B7280',
    marginBottom: 48,
    textAlign: 'center',
  },
  roleOptionsContainer: {
    width: '100%',
    maxWidth: 400,
  },
  roleButton: {
    backgroundColor: '#0369A1',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  citizenButton: {
    backgroundColor: '#10B981',
  },
  roleButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  roleDescription: {
    color: '#E5E7EB',
    textAlign: 'center',
  },
});

