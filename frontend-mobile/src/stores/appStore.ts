import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from '../services/api';

// Types
export interface ForumPost {
  id: string;
  content: string;
  type: 'help' | 'info' | 'offer';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  location?: {
    latitude: number;
    longitude: number;
  };
  author: {
    id: string;
    name: string;
    role: string;
  };
  media?: string[];
  trustScore: number;
  aiSummary?: string;
  translations?: Record<string, string>;
  moderationFlags?: string[];
  reactions: Record<string, number>;
  comments: ForumComment[];
  createdAt: string;
  updatedAt: string;
}

export interface ForumComment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    role: string;
  };
  createdAt: string;
}

export interface Report {
  id: string;
  type: 'flood' | 'storm' | 'tsunami' | 'cyclone' | 'other';
  description: string;
  location: {
    latitude: number;
    longitude: number;
  };
  media?: string[];
  status: 'pending' | 'verified' | 'resolved' | 'false_alarm';
  trustScore: number;
  aiSummary?: string;
  translations?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface Warning {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  area: string;
  location: {
    type: 'Polygon';
    coordinates: number[][][];
  };
  expiresAt: string;
  source: string;
  trustScore: number;
  aiSummary?: string;
  translations?: Record<string, string>;
  createdAt: string;
}

export interface SOS {
  id: string;
  location: {
    latitude: number;
    longitude: number;
  };
  message?: string;
  status: 'pending' | 'acknowledged' | 'responding' | 'resolved';
  channels: ('internet' | 'mesh' | 'sms' | 'call')[];
  createdAt: string;
  updatedAt: string;
}

interface AppState {
  // Data
  forumPosts: ForumPost[];
  reports: Report[];
  warnings: Warning[];
  sosAlerts: SOS[];
  
  // App state
  networkStatus: 'online' | 'offline' | 'mesh' | 'sms';
  currentLocation: { latitude: number; longitude: number } | null;
  lastSync: string | null;
  isSyncing: boolean;
  
  // Loading states
  isLoading: boolean;
  isRefreshing: boolean;
  
  // Error states
  error: string | null;
  
  // Actions
  setNetworkStatus: (status: 'online' | 'offline' | 'mesh' | 'sms') => void;
  setCurrentLocation: (location: { latitude: number; longitude: number } | null) => void;
  setLastSync: (timestamp: string) => void;
  setIsSyncing: (syncing: boolean) => void;
  
  fetchForumPosts: (params?: any) => Promise<void>;
  createForumPost: (data: any) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
  addReaction: (postId: string, emoji: string) => Promise<void>;
  
  fetchReports: (params?: any) => Promise<void>;
  createReport: (data: any) => Promise<void>;
  
  fetchWarnings: (params?: any) => Promise<void>;
  
  createSOS: (data: any) => Promise<void>;
  fetchSOSStatus: (id: string) => Promise<void>;
  
  refreshAll: () => Promise<void>;
  clearError: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      forumPosts: [],
      reports: [],
      warnings: [],
      sosAlerts: [],
      networkStatus: 'online',
      currentLocation: null,
      lastSync: null,
      isSyncing: false,
      isLoading: false,
      isRefreshing: false,
      error: null,

      // App state actions
      setNetworkStatus: (status) => set({ networkStatus: status }),
      setCurrentLocation: (location) => set({ currentLocation: location }),
      setLastSync: (timestamp) => set({ lastSync: timestamp }),
      setIsSyncing: (syncing) => set({ isSyncing: syncing }),

      // Forum actions
      fetchForumPosts: async (params = {}) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiService.getForumPosts(params);
          set({ forumPosts: response.data, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch posts',
            isLoading: false 
          });
        }
      },

      createForumPost: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiService.createForumPost(data);
          set((state) => ({
            forumPosts: [response.data, ...state.forumPosts],
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create post',
            isLoading: false 
          });
        }
      },

      addComment: async (postId, content) => {
        try {
          const response = await apiService.addComment(postId, { content });
          set((state) => ({
            forumPosts: state.forumPosts.map(post =>
              post.id === postId
                ? { ...post, comments: [...post.comments, response.data] }
                : post
            )
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add comment'
          });
        }
      },

      addReaction: async (postId, emoji) => {
        try {
          const response = await apiService.addReaction(postId, { emoji });
          set((state) => ({
            forumPosts: state.forumPosts.map(post =>
              post.id === postId
                ? { ...post, reactions: response.data.reactions }
                : post
            )
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add reaction'
          });
        }
      },

      // Report actions
      fetchReports: async (params = {}) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiService.getReports(params);
          set({ reports: response.data, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch reports',
            isLoading: false 
          });
        }
      },

      createReport: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiService.createReport(data);
          set((state) => ({
            reports: [response.data, ...state.reports],
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create report',
            isLoading: false 
          });
        }
      },

      // Warning actions
      fetchWarnings: async (params = {}) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiService.getWarnings(params);
          set({ warnings: response.data, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch warnings',
            isLoading: false 
          });
        }
      },

      // SOS actions
      createSOS: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiService.createSOS(data);
          set((state) => ({
            sosAlerts: [response.data, ...state.sosAlerts],
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create SOS',
            isLoading: false 
          });
        }
      },

      fetchSOSStatus: async (id) => {
        try {
          const response = await apiService.getSOSStatus(id);
          set((state) => ({
            sosAlerts: state.sosAlerts.map(alert =>
              alert.id === id ? { ...alert, ...response.data } : alert
            )
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch SOS status'
          });
        }
      },

      // Utility actions
      refreshAll: async () => {
        set({ isRefreshing: true });
        const { fetchForumPosts, fetchReports, fetchWarnings } = get();
        await Promise.all([
          fetchForumPosts(),
          fetchReports(),
          fetchWarnings()
        ]);
        set({ isRefreshing: false });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'app-storage',
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
