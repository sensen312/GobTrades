import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// Remove useToken import if no longer needed here
// import { useToken } from '@gluestack-ui/themed';

import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import SettingsScreen from '../features/settings/screens/SettingsScreen'; // Assuming path
import { useAuthStore } from '../features/auth/store/authStore'; // Path to auth store
import AuthLoadingScreen from '../features/auth/screens/AuthLoadingScreen'; // Import AuthLoading

import { AppStackParamList } from './types'; // Import root param list type

// Create the Stack Navigator
const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppNavigator() {
    const { isAuthenticated, isLoading, loadFromStorage } = useAuthStore(state => ({
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        loadFromStorage: state.loadFromStorage, // Get action if needed here (usually done in AuthLoadingScreen)
    }));

    // --- No need for useToken here if setting bg directly ---
    // const backgroundColor = useToken('colors', 'backgroundLight'); // This line is likely causing the error
    // Gluestack Box/View props generally accept the token string directly

     // Use AuthLoadingScreen to handle the initial check and navigation
     // The isLoading check might still be useful here for an initial splash/loading state
     if (isLoading) {
          // Render the AuthLoadingScreen directly while checking storage
          // Or a simpler global loading indicator if preferred
          return <AuthLoadingScreen />;
     }


    return (
        // Navigator Screen Options can set defaults for all screens in this stack
        <Stack.Navigator screenOptions={{
            headerShown: false, // Hide headers by default, let screens/tabs manage their own
            // Example: Set a default background color using the theme token string
             contentStyle: { backgroundColor: '$backgroundLight' } // Apply to screen content area
        }}>
            {isAuthenticated ? (
                // User is authenticated
                 <>
                    <Stack.Screen name="Main" component={MainNavigator} />
                     {/* Define globally accessible screens outside the main tabs */}
                    <Stack.Screen
                         name="Settings"
                         component={SettingsScreen}
                         options={{
                            headerShown: true, // Show header for settings
                            title: 'Settings',
                            // Add other header customizations if needed
                         }}
                    />
                     {/* Add other modal/global screens here if needed */}
                     {/* e.g., <Stack.Screen name="FilterModal" component={FilterModalScreen} options={{ presentation: 'modal' }} /> */}
                 </>
            ) : (
                // User is not authenticated
                <Stack.Screen name="Auth" component={AuthNavigator} />
            )}
        </Stack.Navigator>
    );
}