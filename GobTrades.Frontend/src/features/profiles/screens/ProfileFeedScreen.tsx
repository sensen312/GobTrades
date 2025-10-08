// src/features/profiles/screens/ProfileFeedScreen.tsx
import React from 'react';
import { Box, Heading } from '@gluestack-ui/themed';
import ScreenContainer from '../../../components/ScreenContainer';
import ThemedText from '../../../components/ThemedText';
// import type { ComponentProps } from 'react'; // Not needed for this stub

// Gluestack UI Prop Typing (Not needed for this stub)
// type BoxPropsProfileFeed = ComponentProps<typeof Box>;
// type HeadingPropsProfileFeed = ComponentProps<typeof Heading>;


const ProfileFeedScreen: React.FC = () => {
  // Reasoning: This screen serves as a placeholder for the main trading feed.
  // Phase 1 focuses on user setup and their own stall management.
  // The actual feed functionality will be built in a subsequent phase.
  // The AppHeader will be rendered by the MainNavigator for this screen.
  return (
    <ScreenContainer testID="profile-feed-screen">
      <Box flex={1} justifyContent="center" alignItems="center">
        <Heading size="xl" mb="$4" fontFamily="$heading">Trades Board</Heading>
        <ThemedText textAlign="center" fontFamily="$body">
          Hark, Goblin! The bustling marketplace of trades will appear here soon!
        </ThemedText>
        <ThemedText textAlign="center" mt="$2" fontSize="$sm" color="$textSecondary" fontFamily="$body">
          (Feature coming in Phase 2)
        </ThemedText>
      </Box>
    </ScreenContainer>
  );
};
export default ProfileFeedScreen;
