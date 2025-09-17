import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';

export interface AccessibilityPreferences {
  voiceAssistance: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  reducedMotion: boolean;
  screenReader: boolean;
  hapticFeedback: boolean;
  soundEffects: boolean;
  language: string;
  ttsRate: number;
  ttsPitch: number;
  ttsVolume: number;
}

interface AccessibilityState {
  preferences: AccessibilityPreferences;
  isInitialized: boolean;
  isHighContrast: boolean;
  
  // Actions
  initializeAccessibility: () => Promise<void>;
  updatePreferences: (updates: Partial<AccessibilityPreferences>) => void;
  speak: (text: string, options?: { priority?: 'high' | 'normal' | 'low' }) => void;
  stopSpeaking: () => void;
  hapticFeedback: (type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error') => void;
  playSound: (type: 'success' | 'error' | 'warning' | 'notification') => void;
  getFontSize: () => number;
  getContrastColors: () => { background: string; text: string; primary: string };
}

const defaultPreferences: AccessibilityPreferences = {
  voiceAssistance: true,
  highContrast: false,
  fontSize: 'medium',
  reducedMotion: false,
  screenReader: false,
  hapticFeedback: true,
  soundEffects: true,
  language: 'en',
  ttsRate: 0.5,
  ttsPitch: 1.0,
  ttsVolume: 1.0,
};

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set, get) => ({
      preferences: defaultPreferences,
      isInitialized: false,
      isHighContrast: false,

      initializeAccessibility: async () => {
        try {
          // Check for system accessibility settings
          const hasScreenReader = await checkScreenReader();
          
          set((state) => ({
            preferences: {
              ...state.preferences,
              screenReader: hasScreenReader,
            },
            isInitialized: true,
          }));

          // Welcome message with TTS
          if (hasScreenReader) {
            get().speak('Coast-Kavach accessibility features enabled', { priority: 'high' });
          }
        } catch (error) {
          console.error('Failed to initialize accessibility:', error);
          set({ isInitialized: true });
        }
      },

      updatePreferences: (updates: Partial<AccessibilityPreferences>) => {
        set((state) => ({
          preferences: { ...state.preferences, ...updates },
          isHighContrast: updates.highContrast ?? state.preferences.highContrast,
        }));

        // Provide feedback for preference changes
        const { hapticFeedback, soundEffects } = get().preferences;
        if (hapticFeedback) {
          get().hapticFeedback('light');
        }
        if (soundEffects) {
          get().playSound('success');
        }
      },

      speak: (text: string, options: { priority?: 'high' | 'normal' | 'low' } = {}) => {
        const { voiceAssistance, language, ttsRate, ttsPitch, ttsVolume } = get().preferences;
        
        if (!voiceAssistance) return;

        const priority = options.priority || 'normal';
        
        // Stop any current speech for high priority messages
        if (priority === 'high') {
          Speech.stop();
        }

        Speech.speak(text, {
          language,
          rate: ttsRate,
          pitch: ttsPitch,
          volume: ttsVolume,
          onStart: () => {
            if (priority === 'high') {
              get().hapticFeedback('light');
            }
          },
          onDone: () => {
            if (priority === 'high') {
              get().hapticFeedback('light');
            }
          },
          onError: (error) => {
            console.error('TTS Error:', error);
          },
        });
      },

      stopSpeaking: () => {
        Speech.stop();
      },

      hapticFeedback: (type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error') => {
        const { hapticFeedback } = get().preferences;
        if (!hapticFeedback) return;

        switch (type) {
          case 'light':
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            break;
          case 'medium':
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            break;
          case 'heavy':
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            break;
          case 'success':
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            break;
          case 'warning':
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            break;
          case 'error':
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            break;
        }
      },

      playSound: (type: 'success' | 'error' | 'warning' | 'notification') => {
        const { soundEffects } = get().preferences;
        if (!soundEffects) return;

        // TODO: Implement actual sound effects
        // For now, use haptic feedback as audio substitute
        switch (type) {
          case 'success':
            get().hapticFeedback('success');
            break;
          case 'error':
            get().hapticFeedback('error');
            break;
          case 'warning':
            get().hapticFeedback('warning');
            break;
          case 'notification':
            get().hapticFeedback('light');
            break;
        }
      },

      getFontSize: () => {
        const { fontSize } = get().preferences;
        const baseSize = 16;
        
        switch (fontSize) {
          case 'small':
            return baseSize * 0.875; // 14px
          case 'medium':
            return baseSize; // 16px
          case 'large':
            return baseSize * 1.25; // 20px
          case 'extra-large':
            return baseSize * 1.5; // 24px
          default:
            return baseSize;
        }
      },

      getContrastColors: () => {
        const { highContrast } = get().preferences;
        
        if (highContrast) {
          return {
            background: '#000000',
            text: '#FFFFFF',
            primary: '#FFFFFF',
          };
        }
        
        return {
          background: '#FFFFFF',
          text: '#111827',
          primary: '#0369A1',
        };
      },
    }),
    {
      name: 'accessibility-storage',
      storage: {
        getItem: async (name: string) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name: string, value: any) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name: string) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);

// Helper function to check for screen reader
async function checkScreenReader(): Promise<boolean> {
  try {
    // This is a simplified check - in a real app, you'd use proper accessibility APIs
    // For now, we'll assume screen reader is available if voice assistance is enabled
    return true;
  } catch (error) {
    console.error('Failed to check screen reader:', error);
    return false;
  }
}
