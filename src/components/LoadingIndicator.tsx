import React from 'react';
import { Spinner, Box } from '@gluestack-ui/themed';
import ThemedText from './ThemedText';

interface LoadingIndicatorProps {
  size?: 'small' | 'large';
  overlay?: boolean;
  text?: string;
  bg?: string; // Theme token for overlay background
}

/** Displays themed loading spinner, optionally as overlay. */
const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
    size = 'large',
    overlay = false,
    text,
    bg = '$modalOverlay'
}) => {
  const spinnerContent = (
    <Box alignItems="center">
      <Spinner size={size} color="$primary500" />
      {text && <ThemedText mt="$2" color={overlay ? '$textLight' : '$textSecondary'}>{text}</ThemedText>}
    </Box>
  );

  if (overlay) {
    return (
      <Box
        position="absolute" top={0} left={0} right={0} bottom={0}
        justifyContent="center" alignItems="center"
        bg={bg}
        zIndex={1000}
      >
        {spinnerContent}
      </Box>
    );
  }
  return spinnerContent;
};
export default LoadingIndicator;