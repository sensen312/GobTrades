// src/components/MarketClosedOverlay.tsx
import React from 'react';
import { Box, Heading, VStack, Icon } from '@gluestack-ui/themed';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ThemedText from './ThemedText';

const MarketClosedOverlay: React.FC = () => {
  return (
    <Box
      position="absolute"
      top={0} left={0} right={0} bottom={0}
      bg="$marketClosedOverlay"
      justifyContent="center"
      alignItems="center"
      zIndex={2000}
      p="$8"
      testID="market-closed-overlay"
    >
      <VStack space="lg" alignItems="center">
        <Icon
          as={MaterialCommunityIcons}
          // @ts-ignore The 'name' prop is valid for MaterialCommunityIcons at runtime.
          name="door-closed-lock"
          size="xl"
          color="$parchment300"
          mb="$2"
        />
        <Heading size="2xl" color="$parchment100" fontFamily="$heading" textAlign="center">
          Market Closed!
        </Heading>
        <ThemedText color="$parchment200" textAlign="center" fontSize="$lg" fontFamily="$body">
          The stalls are shuttered and the merchants are resting.
        </ThemedText>
      </VStack>
    </Box>
  );
};
export default MarketClosedOverlay;
