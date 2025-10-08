// src/features/auth/screens/AuthLoadingScreen.tsx
import React, { useEffect } from 'react';
import { Box } from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // Import for stronger typing
import LoadingIndicator from '../../../components/LoadingIndicator';
import { useAuthStore as useAuthStoreLoading } from '../store/authStore';
import { AuthStackParamList, AppStackParamList } from '../../../navigation/types'; // Import relevant param lists

// Correct navigation prop type for AuthLoadingScreen within AuthNavigator
type AuthLoadingScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'AuthLoading'>;
// Type for navigating between stacks (from Auth to Main)
type AppStackNavigationProp = NativeStackNavigationProp<AppStackParamList>;


const AuthLoadingScreen: React.FC = () => {
  const { loadUserIdentity, isAuthenticated, isLoading } = useAuthStoreLoading();
  // Get navigation prop specific to the current stack (AuthStack)
  const authNavigation = useNavigation<AuthLoadingScreenNavigationProp>();
  // Get root navigation prop to navigate between stacks (Auth to Main)
  const appNavigation = useNavigation<AppStackNavigationProp>();


  // Attempt to load profile from storage on mount.
  // Reasoning: Determines if a user session already exists.
  useEffect(() => {
    loadUserIdentity();
  }, [loadUserIdentity]);

  // Navigate based on auth state once loading is complete.
  // Reasoning: Directs the user to the appropriate part of the app.
  useEffect(() => {
    if (!isLoading) { // Only navigate once the loading check is complete
      if (isAuthenticated) {
        // User is authenticated, replace Auth stack with Main stack, defaulting to "Trades" tab.
        console.log("AuthLoadingScreen: User authenticated, navigating to Main > Trades.");
        appNavigation.replace('Main', { screen: 'Trades', params: { screen: 'ProfileFeedScreen'} });
      } else {
        // User is not authenticated, navigate to the Setup screen within Auth stack.
        console.log("AuthLoadingScreen: User not authenticated, navigating to Setup.");
        authNavigation.replace('Setup'); // Replace AuthLoading with Setup within the AuthStack
      }
    }
  }, [isLoading, isAuthenticated, authNavigation, appNavigation]);

  // Render loading indicator while checking auth status.
  return (
    <Box flex={1} justifyContent="center" alignItems="center" bg="$backgroundLight" testID="auth-loading-screen">
      <LoadingIndicator text="Checking Your Goblin Credentials..." />
    </Box>
  );
};
export default AuthLoadingScreen;
