import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types'; // Import the param list

// Import Auth Screens
import AuthLoadingScreen from '../features/auth/screens/AuthLoadingScreen';
import SetupScreen from '../features/auth/screens/SetupScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

/** Navigator for the authentication flow (Loading & Setup). */
const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="AuthLoading" // Start with the loading check
      screenOptions={{
        headerShown: false, // No default headers in the auth flow
      }}
    >
      <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} />
      <Stack.Screen name="Setup" component={SetupScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;