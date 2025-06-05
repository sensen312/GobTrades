// src/components/AppHeader.tsx
import React from 'react';
import { Box, HStack, Heading } from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import IconButton from './IconButton';
import ThemedText from './ThemedText';
import UserPfpDisplay from './UserPfpDisplay';
import { useAuthStore } from '../features/auth/store/authStore';
import { useMarketTimer } from '../hooks/useMarketTimer';
import { AppStackParamList } from '../navigation/types';
import LoadingIndicator from './LoadingIndicator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type AppHeaderNavigationProp = NativeStackNavigationProp<AppStackParamList, 'Main'>;

const AppHeader: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<AppHeaderNavigationProp>();
  const { pfpIdentifier, goblinName } = useAuthStore();
  const { timeLeft, isMarketOpen, isLoadingMarketStatus } = useMarketTimer();

  const goToSettings = () => {
    navigation.navigate('Settings');
  };

  return (
    <Box
      bg="$backgroundCard"
      style={{ paddingTop: insets.top }}
      borderBottomWidth={1}
      borderColor="$borderLight"
      testID="app-header"
    >
      <HStack px="$4" py="$2" alignItems="center" justifyContent="space-between">
        <HStack alignItems="center" space="sm" flex={1}>
          <UserPfpDisplay
              pfpIdentifier={pfpIdentifier}
              userName={goblinName || undefined}
              size="sm"
          />
          <ThemedText size="sm" bold numberOfLines={1} ellipsizeMode="tail" flexShrink={1}>
              {goblinName || 'Trader'}
          </ThemedText>
        </HStack>

        <Box alignItems="center" mx="$4">
          <ThemedText size="xs" color="$textSecondary">Market Closes In:</ThemedText>
          {isLoadingMarketStatus ? (
            <LoadingIndicator size="small" />
          ) : (
            <Heading size="sm" color={!isMarketOpen ? "$errorBase" : "$textPrimary"}>
              {isMarketOpen ? timeLeft : "CLOSED"}
            </Heading>
          )}
        </Box>

        <Box flex={1} alignItems="flex-end">
          <IconButton
            iconName="cog-outline"
            iconColor="$iconColor"
            onPress={goToSettings}
            aria-label="Settings"
            testID="settings-button"
          />
        </Box>
      </HStack>
    </Box>
  );
};
export default AppHeader;
