// src/components/Card.tsx
import React from 'react';
import { Box } from '@gluestack-ui/themed';
import type { ComponentProps } from 'react';
import { Platform } from 'react-native'; // Correct import source

type BoxProps = ComponentProps<typeof Box>;

interface CardProps extends BoxProps {
    children: React.ReactNode;
}

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
    sx,
    ...props
}) => {
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
            sx={combinedSx}
            {...props}
        >
            {children}
        </Box>
    );
};
export default Card;
