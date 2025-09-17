import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';

export interface User {
  id: string;
  phone: string;
  name: string;
  role: 'citizen' | 'marine_worker' | 'analyst' | 'moderator' | 'admin';
  language: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  emergencyContacts: Array<{
    name: string;
    phone: string;
  }>;
  preferences: {
    notifications: boolean;
    voiceAssistance: boolean;
    highContrast: boolean;
    fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  };
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isAdmin: boolean;
  isModerator: boolean;
  isMarineWorker: boolean;
  
  // Actions
  login: (phone: string, otp: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  checkAuthStatus: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isAdmin: false,
      isModerator: false,
      isMarineWorker: false,

      login: async (phone: string, otp: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Mock login for demo purposes
          // In production, this would be an actual API call
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
          
          const user: User = {
            id: '1',
            phone,
            name: 'Demo User',
            role: 'citizen', // Will be updated in role selection step
            language: 'en',
            location: {
              latitude: 13.0827,
              longitude: 80.2707, // Chennai coordinates
            },
            emergencyContacts: [],
            preferences: {
              notifications: true,
              voiceAssistance: true,
              highContrast: false,
              fontSize: 'medium',
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          set({
            user,
            isAuthenticated: true,
            isAdmin: false,
            isModerator: false,
            isMarineWorker: false,
            isLoading: false,
            error: null,
          });

          // TTS feedback for successful login
          Speech.speak(`Welcome to Coast-Kavach, ${user.name}`, {
            language: user.language || 'en',
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({
            error: errorMessage,
            isLoading: false,
          });
          
          // TTS feedback for error
          Speech.speak('Login failed. Please try again.', {
            language: get().user?.language || 'en',
          });
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isAdmin: false,
          isModerator: false,
          isMarineWorker: false,
          error: null,
        });
      },

      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...updates };
          set({ 
            user: updatedUser,
            isAdmin: updatedUser.role === 'admin',
            isModerator: updatedUser.role === 'moderator' || updatedUser.role === 'admin',
            isMarineWorker: updatedUser.role === 'marine_worker',
          });
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuthStatus: async () => {
        set({ isLoading: true });
        
        try {
          // TODO: Replace with actual API call
          const token = await AsyncStorage.getItem('auth_token');
          if (!token) {
            set({ isLoading: false });
            return;
          }

          const response = await fetch('http://localhost:4000/api/v1/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const user = await response.json();
            set({
              user,
              isAuthenticated: true,
              isAdmin: user.role === 'admin',
              isModerator: user.role === 'moderator' || user.role === 'admin',
              isMarineWorker: user.role === 'marine_worker',
              isLoading: false,
            });
          } else {
            await AsyncStorage.removeItem('auth_token');
            set({
              user: null,
              isAuthenticated: false,
              isAdmin: false,
              isModerator: false,
              isMarineWorker: false,
              isLoading: false,
            });
          }
        } catch (error) {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
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
