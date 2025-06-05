// src/components/ErrorDisplay.tsx
import React from 'react';
import { Box, Icon as GlueIconError, AlertCircleIcon } from '@gluestack-ui/themed'; // Aliased Icon
import ThemedText from './ThemedText'; // Already defined above
import type { ComponentProps } from 'react';

// Gluestack UI Prop Typing
type BoxPropsError = ComponentProps<typeof Box>;
type GlueIconPropsError = ComponentProps<typeof GlueIconError>;


interface ErrorDisplayProps {
  message: string | null | undefined;
  title?: string;
}

/** Displays themed error message box with icon. */
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, title = "Oops! A Gremlin!" }) => {
  if (!message) return null; // Don't render if no message

  return (
    <Box
        bg="$errorBg" // Use theme token for error background
        p="$3"
        borderRadius="$md"
        borderWidth={1}
        borderColor="$errorBase" // Use theme token for error border
        flexDirection="row"
        alignItems="center"
        gap="$2" // Use theme token for gap if available, otherwise direct value
        my="$2" // Margin for spacing
        testID="error-display-box"
    >
      <GlueIconError as={AlertCircleIcon} color="$errorBase" size="md" />
      <Box flex={1}>
        <ThemedText bold color="$errorBase" fontSize="$sm">{title}</ThemedText>
        <ThemedText color="$errorBase" fontSize="$sm">{message}</ThemedText>
      </Box>
    </Box>
  );
};
export default ErrorDisplay;
