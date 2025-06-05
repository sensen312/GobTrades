// src/navigation/index.tsx
import React, { useEffect } from 'react';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore as useAuthStoreAppNav } from '../features/auth/store/authStore';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import SettingsScreen from '../features/settings/screens/SettingsScreen';
import AuthLoadingScreen from '../features/auth/screens/AuthLoadingScreen';
import { AppStackParamList, AuthStackParamList } from './types';
import { useTheme } from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';

const StackApp = createNativeStackNavigator<AppStackParamList>();

export default function AppNavigator() {
  const { isAuthenticated, isLoading, loadUserIdentity } = useAuthStoreAppNav(state => ({
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    loadUserIdentity: state.loadUserIdentity,
  }));
  const { colors, fonts } = useTheme();

  useEffect(() => {
    loadUserIdentity();
  }, [loadUserIdentity]);

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  return (
    <StackApp.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.backgroundLight as string }
      }}
    >
      {isAuthenticated ? (
        <>
          <StackApp.Screen name="Main" component={MainNavigator} />
          <StackApp.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              headerShown: true,
              title: 'Settings',
              headerStyle: { backgroundColor: colors.backgroundCard as string },
              headerTintColor: colors.textPrimary as string,
              headerTitleStyle: { fontFamily: fonts.heading as string },
              // headerBackTitleVisible: false, // Removed to resolve type error
            }}
          />
        </>
      ) : (
        <StackApp.Screen name="Auth" component={AuthNavigator} />
      )}
    </StackApp.Navigator>
  );
}
