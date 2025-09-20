import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SimpleMarineWorkerWarning() {
  const navigation = useNavigation();
  const [warning, setWarning] = useState('');
  const [hasWarning, setHasWarning] = useState<boolean | null>(null);

  const handleWarningChoice = (choice: boolean) => {
    setHasWarning(choice);
    if (!choice) {
      navigation.navigate('MainTabs' as never);
    }
  };

  const handleSubmit = async () => {
    if (!warning.trim()) {
      Alert.alert('Error', 'Please describe the warning');
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert('Success', 'Warning reported successfully!', [
        {
          text: 'Continue to Dashboard',
          onPress: () => navigation.navigate('MainTabs' as never),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to report warning. Please try again.');
    }
  };

  const handleSkip = () => {
    navigation.navigate('MainTabs' as never);
  };

  if (hasWarning === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Safety Check</Text>
          <Text style={styles.subtitle}>Do you have any warnings or safety concerns to report?</Text>
          
          <TouchableOpacity
            style={[styles.choiceButton, styles.yesButton]}
            onPress={() => handleWarningChoice(true)}
          >
            <Text style={styles.choiceButtonText}>Yes, Report Warning</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.choiceButton, styles.noButton]}
            onPress={() => handleWarningChoice(false)}
          >
            <Text style={styles.choiceButtonText}>No, All Good</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Report Warning</Text>
        <Text style={styles.subtitle}>Describe the warning or safety concern</Text>
        
        <View style={styles.form}>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe the warning, safety concern, or emergency situation..."
            value={warning}
            onChangeText={setWarning}
            multiline
            numberOfLines={4}
            placeholderTextColor="#9CA3AF"
          />
        </View>
        
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit Warning</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
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
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 32,
    textAlign: 'center',
  },
  choiceButton: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  yesButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 2,
    borderColor: '#FCA5A5',
  },
  noButton: {
    backgroundColor: '#F0FDF4',
    borderWidth: 2,
    borderColor: '#86EFAC',
  },
  choiceButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  form: {
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#DC2626',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    backgroundColor: 'transparent',
    padding: 16,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#6B7280',
    fontSize: 16,
  },
});
