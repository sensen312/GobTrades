import React from 'react';
import { Box, Platform } from '@gluestack-ui/themed';
import type { ComponentProps } from 'react';

type BoxProps = ComponentProps<typeof Box>;

interface CardProps extends BoxProps {
    children: React.ReactNode;
}

/** Renders a styled container using Box, accepting BoxProps for customization. */
const Card: React.FC<CardProps> = ({
    children,
    bg = "$backgroundCard",
    borderRadius = "$md",
    borderWidth = 1,
    borderColor = "$borderLight",
    p = "$4",
    mb = "$4",
    shadowColor = "$shadowColor",
    shadowOffset = { width: 0, height: 2 },
    shadowOpacity = 0.1,
    shadowRadius = 3,
    sx, // Capture sx prop
    ...props // Spread rest of BoxProps
}) => {
    // Combine passed sx with elevation style for Android
    const combinedSx = {
        ...sx,
         ...(Platform.OS === 'android' && { elevation: 2 }),
    };

    return (
        <Box
            bg={bg}
            borderRadius={borderRadius}
            borderWidth={borderWidth}
            borderColor={borderColor}
            p={p}
            mb={mb}
            shadowColor={shadowColor}
            shadowOffset={shadowOffset}
            shadowOpacity={shadowOpacity}
            shadowRadius={shadowRadius}
            sx={combinedSx} // Apply combined sx prop
            {...props}
        >
            {children}
        </Box>
    );
};
export default Card;