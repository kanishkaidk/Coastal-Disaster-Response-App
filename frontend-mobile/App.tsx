import React from 'react';
import { StatusBar } from 'expo-status-bar';
import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Import Intl polyfill for better compatibility
import 'intl-pluralrules';

// Screens
import LandingScreen from './src/screens/LandingScreen';
import AuthScreen from './src/screens/AuthScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import RoleSelectionScreen from './src/screens/RoleSelectionScreen';
import MarineWorkerVerificationScreen from './src/screens/MarineWorkerVerificationScreen';
import MarineWorkerWorkScreen from './src/screens/MarineWorkerWorkScreen';
import MarineWorkerWarningScreen from './src/screens/MarineWorkerWarningScreen';
import HomeScreen from './src/screens/HomeScreen';
import MapScreen from './src/screens/MapScreen';
import ReportScreen from './src/screens/ReportScreen';
import ResourcesScreen from './src/screens/ResourcesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SOSScreen from './src/screens/SOSScreen';
import ForumScreen from './src/screens/ForumScreen';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';

// Components
import FloatingSOSButton from './src/components/FloatingSOSButton';
import TabBarIcon from './src/components/TabBarIcon';

// Services
import { i18n } from './src/services/i18n';
import { theme } from './src/theme/theme';
import { useAuthStore } from './src/stores/authStore';
import { useAccessibilityStore } from './src/stores/accessibilityStore';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const queryClient = new QueryClient();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      <Stack.Screen name="MarineWorkerVerification" component={MarineWorkerVerificationScreen} />
      <Stack.Screen name="MarineWorkerWork" component={MarineWorkerWorkScreen} />
      <Stack.Screen name="MarineWorkerWarning" component={MarineWorkerWarningScreen} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="MarineWorkerVerification" component={MarineWorkerVerificationScreen} />
      <Stack.Screen name="MarineWorkerWork" component={MarineWorkerWorkScreen} />
      <Stack.Screen name="MarineWorkerWarning" component={MarineWorkerWarningScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="SOS" component={SOSScreen} />
    </Stack.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="SOS" component={SOSScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  const { isAdmin } = useAuthStore();
  const { isHighContrast } = useAccessibilityStore();

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => (
            <TabBarIcon route={route} focused={focused} color={color} size={size} />
          ),
          tabBarActiveTintColor: isHighContrast ? '#FFFFFF' : '#0369A1',
          tabBarInactiveTintColor: isHighContrast ? '#CCCCCC' : '#6B7280',
          tabBarStyle: {
            backgroundColor: isHighContrast ? '#000000' : '#FFFFFF',
            borderTopColor: isHighContrast ? '#FFFFFF' : '#E5E7EB',
            height: 90,
            paddingBottom: 30,
            paddingTop: 15,
            elevation: 12,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: -4,
            },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            borderTopWidth: 2,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
          headerShown: false,
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ tabBarLabel: 'Home', tabBarAccessibilityLabel: 'Home screen' }}
        />
        <Tab.Screen 
          name="Map" 
          component={MapScreen}
          options={{ tabBarLabel: 'Map', tabBarAccessibilityLabel: 'Map screen' }}
        />
        <Tab.Screen 
          name="Report" 
          component={ReportScreen}
          options={{ tabBarLabel: 'Report', tabBarAccessibilityLabel: 'Report hazard screen' }}
        />
        <Tab.Screen 
          name="Resources" 
          component={ResourcesScreen}
          options={{ tabBarLabel: 'Resources', tabBarAccessibilityLabel: 'Resources screen' }}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{ tabBarLabel: 'Profile', tabBarAccessibilityLabel: 'Profile screen' }}
        />
        {isAdmin && (
          <Tab.Screen 
            name="Admin" 
            component={AdminDashboardScreen}
            options={{ tabBarLabel: 'Admin', tabBarAccessibilityLabel: 'Admin dashboard' }}
          />
        )}
      </Tab.Navigator>
      <FloatingSOSButton />
    </>
  );
}

function AppContent() {
  const { isAuthenticated, user } = useAuthStore();
  const { initializeAccessibility } = useAccessibilityStore();

  useEffect(() => {
    initializeAccessibility();
  }, []);

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <I18nextProvider i18n={i18n}>
            <PaperProvider theme={theme}>
              <AppContent />
              <StatusBar style="auto" />
            </PaperProvider>
          </I18nextProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
