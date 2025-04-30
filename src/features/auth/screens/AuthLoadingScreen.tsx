import React, { useEffect } from 'react';
import { Box } from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import LoadingIndicator from '../../../components/LoadingIndicator';
import { useAuthStore } from '../store/authStore';
import { AppScreenProps } from '../../../navigation/types'; // Use root navigator props type

// Use the specific navigation prop type for the Auth stack nested within App stack
type Props = AppScreenProps<'Auth'>;

const AuthLoadingScreen: React.FC = () => {
  const { loadFromStorage, isAuthenticated, isLoading } = useAuthStore();
  // Use the specific navigation type
  const navigation = useNavigation<Props['navigation']>();

  // Attempt to load profile from storage on mount
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Navigate based on auth state once loading is complete
  useEffect(() => {
    // Only navigate once loading is finished
    if (!isLoading) {
      if (isAuthenticated) {
        // User is authenticated, replace Auth stack with Main stack
        navigation.replace('Main', { screen: 'Listings', params: { screen: 'ListingsFeed'} });
      } else {
        // User is not authenticated, navigate to the Setup screen within Auth stack
        // No need to replace here, just ensure Setup screen is shown
        // This assumes AuthLoading is the initial route in AuthNavigator
        // If Setup needs to be explicitly navigated to:
        // navigation.navigate('Setup');
      }
    }
  }, [isLoading, isAuthenticated, navigation]);

  // Render loading indicator while checking auth status
  return (
    <Box flex={1} justifyContent="center" alignItems="center" bg="$backgroundLight">
      <LoadingIndicator text="Checking Your Credentials..." />
    </Box>
  );
};

export default AuthLoadingScreen;

