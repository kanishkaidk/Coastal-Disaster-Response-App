import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function RoleSelectionScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Role</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('MarineWorkerVerification' as never)}
      >
        <Text style={styles.buttonText}>Marine Worker</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('MainTabs' as never)}
      >
        <Text style={styles.buttonText}>Citizen</Text>
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
    fontSize: 24, 
    marginBottom: 32,
    fontWeight: 'bold',
    color: '#1F2937'
  },
  button: { 
    backgroundColor: '#2e86de', 
    padding: 16, 
    borderRadius: 8, 
    marginBottom: 16, 
    width: '80%', 
    alignItems: 'center' 
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 18,
    fontWeight: '600'
  },
});
