import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function MarineWorkerVerificationScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.4:4000/api/v1/marine-worker/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, role: 'marine_worker' }),
      });
      
      if (response.ok) {
        Alert.alert('Success', 'Verification complete!', [
          { text: 'OK', onPress: () => navigation.navigate('MainTabs' as never) }
        ]);
      } else {
        Alert.alert('Error', 'Failed to save data.');
      }
    } catch (error) {
      Alert.alert('Error', 'Network/server issue.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Marine Worker Verification</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#fff' 
  },
  title: { 
    fontSize: 22, 
    marginBottom: 24,
    fontWeight: 'bold',
    color: '#1F2937'
  },
  input: { 
    width: '80%', 
    borderColor: '#ccc', 
    borderWidth: 1, 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 16,
    fontSize: 16
  },
  button: { 
    backgroundColor: '#27ae60', 
    padding: 16, 
    borderRadius: 8, 
    width: '80%', 
    alignItems: 'center' 
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 18,
    fontWeight: '600'
  },
});