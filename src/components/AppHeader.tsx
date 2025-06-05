// src/components/AppHeader.tsx
import React from 'react';
import { Box, HStack, Heading } from '@gluestack-ui/themed';
import type { ComponentProps } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import IconButton from './IconButton';
import ThemedText from './ThemedText';
import UserPfpDisplay from './UserPfpDisplay';
import { useAuthStore as useAuthStoreHeader } from '../features/auth/store/authStore';
import { useMarketTimer as useMarketTimerHeader } from '../hooks/useMarketTimer';
import { AppScreenProps, AppStackParamList } from '../navigation/types'; // Ensure AppStackParamList is available for typing useNavigation
import LoadingIndicator from './LoadingIndicator'; // Added for consistency
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // Import for stronger typing

// Gluestack UI Prop Typing
type BoxPropsAppHeader = ComponentProps<typeof Box>;
type HStackPropsAppHeader = ComponentProps<typeof HStack>;
type HeadingPropsAppHeader = ComponentProps<typeof Heading>;

// More specific navigation type
type AppHeaderNavigationProp = NativeStackNavigationProp<AppStackParamList, 'Main'>;


/** Custom header component for the main app screens. (Stories 75, 76, 77) */
const AppHeader: React.FC = () => {
  // Reasoning: This component provides a consistent header across main app sections.
  // It uses safe area insets for proper padding on devices with notches/islands.
  // It fetches user info and market status from their respective stores/hooks.
  const insets = useSafeAreaInsets();
  // Type navigation for navigating to the 'Settings' screen, which is part of AppStack.
  const navigation = useNavigation<AppHeaderNavigationProp>();
  const { pfpIdentifier, goblinName } = useAuthStoreHeader(); // Use aliased store
  const { timeLeft, isMarketOpen, isLoadingMarketStatus } = useMarketTimerHeader(); // Use aliased hook

  const goToSettings = () => {
    navigation.navigate('Settings');
  };

  return (
    <Box
      bg="$backgroundCard" // Use theme token for card background
      style={{ paddingTop: insets.top }} // Dynamic top padding for safe area
      borderBottomWidth={1}
      borderColor="$borderLight" // Use theme token for light border
      testID="app-header"
    >
      <HStack px="$4" py="$2" alignItems="center" justifyContent="space-between">
        {/* Left Side: User PFP and Name - Tapping PFP could navigate to MyStallScreen later */}
        <HStack alignItems="center" space="sm">
          <UserPfpDisplay
              pfpIdentifier={pfpIdentifier}
              userName={goblinName || undefined}
              size="sm"
          />
          <ThemedText size="sm" bold numberOfLines={1} ellipsizeMode="tail" maxWidth={100}>
              {goblinName || 'Trader'}
          </ThemedText>
        </HStack>


        {/* Center: Market Timer/Status */}
        <Box alignItems="center" testID="market-timer-status">
          <ThemedText size="xs" color="$textSecondary">Market Closes In:</ThemedText>
          {isLoadingMarketStatus ? (
            <LoadingIndicator size="small" />
          ) : (
            <Heading size="sm" color={!isMarketOpen ? "$errorBase" : "$textPrimary"}>
              {isMarketOpen ? timeLeft : "CLOSED"}
            </Heading>
          )}
        </Box>

        {/* Right Side: Settings Button */}
        <IconButton
          iconName="cog-outline"
          iconColor="$iconColor" // Use theme token for icon color
          onPress={goToSettings}
          aria-label="Settings"
          testID="settings-button"
        />
      </HStack>
    </Box>
  );
};
export default AppHeader;
