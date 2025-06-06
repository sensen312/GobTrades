// src/navigation/AuthNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import AuthLoadingScreen from '../features/auth/screens/AuthLoadingScreen';
import SetupScreen from '../features/auth/screens/SetupScreen';
import MyStallScreen from '../features/profiles/screens/MyStallScreen';

const StackAuthNav = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <StackAuthNav.Navigator
      initialRouteName="AuthLoading"
      screenOptions={{
        headerShown: false,
      }}
    >
      <StackAuthNav.Screen name="AuthLoading" component={AuthLoadingScreen} />
      <StackAuthNav.Screen name="Setup" component={SetupScreen} />
      <StackAuthNav.Screen name="MyStallSetup" component={MyStallScreen} initialParams={{ isFirstSetup: true }} />
    </StackAuthNav.Navigator>
  );
};
export default AuthNavigator;
