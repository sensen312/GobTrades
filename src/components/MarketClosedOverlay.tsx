// src/components/MarketClosedOverlay.tsx
import React from 'react';
import { Box, Heading, VStack, Icon as GlueIcon } from '@gluestack-ui/themed';
import type { ComponentProps } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ThemedText from './ThemedText'; // Assuming ThemedText is in the same components directory

// Gluestack UI Prop Typing
type BoxPropsOverlay = ComponentProps<typeof Box>;
type HeadingPropsOverlay = ComponentProps<typeof Heading>;
type VStackPropsOverlay = ComponentProps<typeof VStack>; // Kept for consistency, though not directly spread
type GlueIconPropsOverlay = ComponentProps<typeof GlueIcon>; // Kept for consistency

interface MarketClosedOverlayProps {
  // This component is purely presentational based on global state, so no props are needed.
}

const MarketClosedOverlay: React.FC<MarketClosedOverlayProps> = () => {
  // Reasoning: This component renders a full-screen, semi-transparent overlay
  // with a clear message that the market is closed. It is designed to be
  // non-interactive, simply informing the user of the market state.
  // The visual design aims for clarity and thematic consistency.
  return (
    <Box
      position="absolute" // Ensures it covers the entire screen
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="$marketClosedOverlay" // Theme token for a dark, semi-transparent background
      justifyContent="center"
      alignItems="center"
      zIndex={2000} // High z-index to be on top of other UI elements, but potentially below critical modals
      p="$8" // Padding for content within the overlay
      testID="market-closed-overlay"
    >
      <VStack space="lg" alignItems="center">
        <GlueIcon
          as={MaterialCommunityIcons} // Using MaterialCommunityIcons for thematic icons
          // @ts-ignore The 'name' prop is valid for MaterialCommunityIcons
          name="door-closed-lock" // Icon visually representing "closed"
          size="2xl" // Adjusted to a valid Gluestack Icon size token
          color="$parchment300" // Light color for good contrast on the dark overlay
          mb="$2" // Margin below the icon
        />
        <Heading size="2xl" color="$parchment100" fontFamily="$heading" textAlign="center">
          Market Closed!
        </Heading>
        <ThemedText color="$parchment200" textAlign="center" fontSize="$lg" fontFamily="$body">
          The stalls are shuttered and the merchants are resting.
        </ThemedText>
        <ThemedText color="$parchment300" textAlign="center" fontSize="$md" fontFamily="$body">
          Come back when the market reopens to trade your wares!
        </ThemedText>
        <ThemedText color="$parchment400" textAlign="center" fontSize="$sm" fontFamily="$body" mt="$4">
          (You can still view your own stall and settings.)
        </ThemedText>
      </VStack>
    </Box>
  );
};

export default MarketClosedOverlay;
