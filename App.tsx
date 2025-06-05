// src/App.tsx
import React from 'react';
import { GluestackUIProvider, Box } from '@gluestack-ui/themed';
import type { ComponentProps } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // For react-native-draggable-flatlist

import { config as gluestackConfig } from './src/theme';
import AppNavigator from './src/navigation';
import { useLoadAssets } from './src/hooks/useLoadAssets';
import LoadingIndicator from './src/components/LoadingIndicator';
import ErrorDisplay from './src/components/ErrorDisplay';
import { toastConfig } from './src/config/toastConfig';

// MODIFICATION: Added imports for MarketClosedOverlay integration
import MarketClosedOverlay from './src/components/MarketClosedOverlay'; // NEW IMPORT
import { useAuthStore } from './src/features/auth/store/authStore';   // To check if user is authenticated
import { useMarketTimer } from './src/hooks/useMarketTimer';     // To check market status

type BoxPropsApp = ComponentProps<typeof Box>;

export default function App() {
  const { assetsLoaded, error: assetError } = useLoadAssets();
  // MODIFICATION: Get authentication and market status
  const { isAuthenticated, isLoading: authIsLoading } = useAuthStore();
  const { isMarketOpen, isLoadingMarketStatus } = useMarketTimer();

  // MODIFICATION: Adjusted loading condition to account for market status loading
  // Show loading if assets aren't loaded,
  // OR if user is authenticated and we are still loading market status (and auth check is complete).
  // This prevents showing the app briefly before the overlay might appear if market is closed.
  if (!assetsLoaded || (isAuthenticated && !authIsLoading && isLoadingMarketStatus)) {
    return (
      <SafeAreaProvider>
        <GluestackUIProvider config={gluestackConfig}>
          <Box flex={1} justifyContent="center" alignItems="center" bg="$backgroundLight" testID="app-initial-loading-screen">
            <StatusBar style="dark" />
            <LoadingIndicator text={!assetsLoaded ? "Gathering Wares..." : "Checking Market Hours..."} />
          </Box>
        </GluestackUIProvider>
      </SafeAreaProvider>
    );
  }

  if (assetError) {
    console.error("App.tsx: Asset loading error:", assetError);
    return (
      <SafeAreaProvider>
        <GluestackUIProvider config={gluestackConfig}>
          <Box flex={1} justifyContent="center" alignItems="center" p="$4" bg="$backgroundLight" testID="app-error-screen">
            <StatusBar style="dark" />
            <ErrorDisplay
              title="A Troll Blocked the Path!"
              message="Failed to load essential resources. Please restart the app."
            />
          </Box>
        </GluestackUIProvider>
      </SafeAreaProvider>
    );
  }

  // MODIFICATION: Determine if the MarketClosedOverlay should be shown
  // Conditions:
  // 1. User is authenticated (i.e., in the Main app, not Auth flow).
  // 2. Market status loading is complete.
  // 3. Market is actually closed.
  const showMarketClosedOverlay = isAuthenticated && !isLoadingMarketStatus && !isMarketOpen;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <GluestackUIProvider config={gluestackConfig}>
          <NavigationContainer>
            <StatusBar style="dark" />
            <AppNavigator />
            {/* MODIFICATION: Conditionally render the MarketClosedOverlay */}
            {/* This ensures it appears on top of the AppNavigator's content when active. */}
            {showMarketClosedOverlay && <MarketClosedOverlay />}
          </NavigationContainer>
          <Toast config={toastConfig} />
        </GluestackUIProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
