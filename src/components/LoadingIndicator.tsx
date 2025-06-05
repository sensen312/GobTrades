// src/components/LoadingIndicator.tsx
import React from 'react';
import { Spinner, Box } from '@gluestack-ui/themed';
import ThemedText from './ThemedText'; // Corrected: Ensure ThemedText is imported
import type { ComponentProps } from 'react';

// Gluestack UI Prop Typing
type SpinnerPropsLoading = ComponentProps<typeof Spinner>;
type BoxPropsLoading = ComponentProps<typeof Box>;


interface LoadingIndicatorProps {
  size?: ComponentProps<typeof Spinner>['size']; // Use Gluestack's SpinnerSize type
  overlay?: boolean;
  text?: string;
  bg?: BoxPropsLoading['bg']; // Theme token for overlay background
}

/** Displays themed loading spinner, optionally as overlay. */
const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
    size = 'large',
    overlay = false,
    text,
    bg = '$modalOverlay' // Default overlay background from theme
}) => {
  const spinnerContent = (
    <Box alignItems="center" testID="loading-spinner-content">
      <Spinner size={size} color="$goblinGreen500" /> {/* Use theme color */}
      {text && <ThemedText mt="$2" color={overlay ? '$textLight' : '$textSecondary'}>{text}</ThemedText>}
    </Box>
  );

  if (overlay) {
    return (
      <Box
        position="absolute" top={0} left={0} right={0} bottom={0}
        justifyContent="center" alignItems="center"
        bg={bg}
        zIndex={1000} // Ensure overlay is on top
        testID="loading-indicator-overlay"
      >
        {spinnerContent}
      </Box>
    );
  }
  return spinnerContent;
};
export default LoadingIndicator;
