import React, { useState, useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Platform,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAccessibilityStore } from '../stores/accessibilityStore';
import { colors, typography, spacing, borderRadius, shadows } from '../theme/theme';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface VoiceInputButtonProps {
  onVoiceResult: (text: string) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  style?: any;
  language?: string;
}

const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onVoiceResult,
  disabled = false,
  size = 'medium',
  style,
  language = 'en-US',
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { speak, hapticFeedback } = useAccessibilityStore();

  // Check for speech recognition support
  React.useEffect(() => {
    if (Platform.OS === 'web') {
      // For web platform, check Web Speech API support
      const SpeechRecognition = (globalThis as any).SpeechRecognition || (globalThis as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSupported(true);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = language;

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setIsListening(false);
          onVoiceResult(transcript);
          speak('Voice input received');
          hapticFeedback('light');
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event);
          setIsListening(false);
          speak('Voice input failed, please try again');
          hapticFeedback('error');
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    } else {
      // For mobile platforms, we'll use a fallback approach
      setIsSupported(false);
    }
  }, [onVoiceResult, speak, hapticFeedback, language]);

  const startListening = () => {
    if (Platform.OS === 'web' && recognitionRef.current && isSupported) {
      try {
        setIsListening(true);
        speak('Listening...');
        hapticFeedback('medium');
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setIsListening(false);
        speak('Failed to start voice input');
        hapticFeedback('error');
      }
    } else {
      // Fallback for mobile or unsupported platforms
      Alert.alert(
        'Voice Input',
        'Voice input is currently only available on web browsers. Please type your message manually.',
        [{ text: 'OK' }]
      );
    }
  };

  const stopListening = () => {
    if (Platform.OS === 'web' && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
        speak('Voice input stopped');
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small': return 16;
      case 'large': return 32;
      default: return 24;
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'small': return 32;
      case 'large': return 56;
      default: return 44;
    }
  };

  if (!isSupported && Platform.OS !== 'web') {
    // Don't render on mobile platforms without native support
    return null;
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          width: getButtonSize(),
          height: getButtonSize(),
          backgroundColor: isListening ? colors.primary : colors.background,
          borderColor: isListening ? colors.primary : colors.gray200,
        },
        disabled && styles.disabled,
        style,
      ]}
      onPress={isListening ? stopListening : startListening}
      disabled={disabled}
      accessibilityLabel={isListening ? 'Stop voice input' : 'Start voice input'}
      accessibilityHint={isListening ? 'Tap to stop voice input' : 'Tap to start voice input'}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name={isListening ? 'stop' : 'mic'}
          size={getIconSize()}
          color={isListening ? colors.background : colors.primary}
        />
        {isListening && (
          <View style={styles.pulseIndicator} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.full,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  disabled: {
    opacity: 0.5,
  },
  iconContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseIndicator: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    opacity: 0.3,
    // Animation would be added here for the pulse effect
  },
});

export default VoiceInputButton;
