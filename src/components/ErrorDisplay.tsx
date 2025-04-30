import React from 'react';
import { Box, Icon, AlertCircleIcon } from '@gluestack-ui/themed';
import ThemedText from './ThemedText';

interface ErrorDisplayProps {
  message: string | null | undefined;
  title?: string;
}

/** Displays themed error message box with icon. */
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, title = "Oops! A Gremlin!" }) => {
  if (!message) return null;

  return (
    <Box
        bg="$errorBg"
        p="$3"
        borderRadius="$md"
        borderWidth={1}
        borderColor="$errorBase"
        flexDirection="row"
        alignItems="center"
        gap="$2"
        my="$2"
    >
      <Icon as={AlertCircleIcon} color="$errorBase" size="md" />
      <Box flex={1}>
        <ThemedText bold color="$errorBase" fontSize="$sm">{title}</ThemedText>
        <ThemedText color="$errorBase" fontSize="$sm">{message}</ThemedText>
      </Box>
    </Box>
  );
};
export default ErrorDisplay;