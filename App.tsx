import React from 'react';
import { GluestackUIProvider, Box } from '@gluestack-ui/themed';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message'; // Import Toast

import { config } from './src/theme';
// Import the default export from the .tsx file
import AppNavigator from './src/navigation/index'; // Corrected import path/extension assumed
import { useLoadAssets } from './src/hooks/useLoadAssets';
import LoadingIndicator from './src/components/LoadingIndicator';
import ErrorDisplay from './src/components/ErrorDisplay';
import { toastConfig } from './src/config/toastConfig'; // Import toast config

export default function App() {
  const { assetsLoaded, error } = useLoadAssets();

  if (!assetsLoaded) {
    return (
      <SafeAreaProvider>
        <GluestackUIProvider config={config}>
          <Box flex={1} justifyContent="center" alignItems="center" bg="$backgroundLight">
            <StatusBar style="dark" />
            <LoadingIndicator text="Gathering Wares..." />
          </Box>
        </GluestackUIProvider>
      </SafeAreaProvider>
    );
  }

  if (error) {
    console.error("Asset loading error:", error);
    return (
      <SafeAreaProvider>
        <GluestackUIProvider config={config}>
          <Box flex={1} justifyContent="center" alignItems="center" p="$4" bg="$backgroundLight">
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

  return (
    <SafeAreaProvider>
      <GluestackUIProvider config={config}>
        <NavigationContainer>
          <StatusBar style="dark" />
          {/* AppNavigator is now a valid component */}
          <AppNavigator />
        </NavigationContainer>
        {/* Setup Toast component *once* at the root */}
        <Toast config={toastConfig} />
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}