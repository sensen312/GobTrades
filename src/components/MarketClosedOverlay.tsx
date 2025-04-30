import React from 'react';
import { Box, Heading, VStack, Icon } from '@gluestack-ui/themed';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ThemedText from './ThemedText';

interface MarketClosedOverlayProps {
    isVisible: boolean;
}

/** Displays an overlay indicating the market is closed. */
const MarketClosedOverlay: React.FC<MarketClosedOverlayProps> = ({ isVisible }) => {
    if (!isVisible) return null;

    return (
        <Box
            position="absolute" top={0} left={0} right={0} bottom={0}
            bg="$marketClosedOverlay"
            justifyContent="center" alignItems="center"
            zIndex={2000} p="$8"
        >
            <VStack space="md" alignItems="center">
                <Icon
                    as={MaterialCommunityIcons}
                    // @ts-ignore Pass name prop to underlying component
                    name="store-remove-outline"
                    size="xl"
                    color="$textLight"
                />
                <Heading color="$textLight" textAlign="center">Market Closed!</Heading>
                <ThemedText color="$textLight" textAlign="center" lineHeight="$lg">
                   The trading session has ended. Check back next time for more treasures!
                </ThemedText>
            </VStack>
        </Box>
    );
};
export default MarketClosedOverlay;