// src/features/messaging/screens/MessagingListScreen.tsx
import React from 'react';
import { Box, Heading } from '@gluestack-ui/themed';
import ScreenContainer from '../../../components/ScreenContainer';
import ThemedText from '../../../components/ThemedText';
// import type { ComponentProps } from 'react'; // Not needed for this stub

// Gluestack UI Prop Typing (Not needed for this stub)
// type BoxPropsMsgList = ComponentProps<typeof Box>;
// type HeadingPropsMsgList = ComponentProps<typeof Heading>;

const MessagingListScreen: React.FC = () => {
  // Reasoning: This screen serves as a placeholder for viewing chat conversations
  // and managing trade requests. Phase 1 focuses on setup and stall management.
  // The AppHeader will be rendered by the MainNavigator for this screen.
  return (
    <ScreenContainer testID="messaging-list-screen">
      <Box flex={1} justifyContent="center" alignItems="center">
        <Heading size="xl" mb="$4" fontFamily="$heading">Your Messages & Requests</Heading>
        <ThemedText textAlign="center" fontFamily="$body">
          Whispers and trade parleys will be found here, brave goblin!
        </ThemedText>
        <ThemedText textAlign="center" mt="$2" fontSize="$sm" color="$textSecondary" fontFamily="$body">
          (Full messaging features coming in Phase 2+)
        </ThemedText>
      </Box>
    </ScreenContainer>
  );
};
export default MessagingListScreen;
