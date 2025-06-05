// src/components/EmptyState.tsx
import React from 'react';
import { Box, Icon as GlueIconEmpty } from '@gluestack-ui/themed'; // Aliased
import type { ComponentProps } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ThemedText from './ThemedText';

// Gluestack UI Prop Typing
type BoxPropsEmpty = ComponentProps<typeof Box>;
// type GlueIconPropsEmpty = ComponentProps<typeof GlueIconEmpty>; // Not directly spread

interface EmptyStateProps {
  iconName?: string; // Icon name from MaterialCommunityIcons
  message: string;
  title?: string;
  boxProps?: BoxPropsEmpty; // Allow passing Box props for customization
}

/** Displays message and icon for empty lists. */
const EmptyState: React.FC<EmptyStateProps> = ({
    iconName = "compass-off-outline", // Default icon
    message,
    title,
    boxProps
}) => {
  // Reasoning: Provides a consistent and themed way to indicate empty states,
  // improving user understanding of why content might be missing.
  return (
    <Box flex={1} justifyContent="center" alignItems="center" p="$8" minHeight={200} {...boxProps} testID="empty-state-container">
      <GlueIconEmpty
        as={MaterialCommunityIcons}
        // @ts-ignore - name prop is valid for MaterialCommunityIcons
        name={iconName}
        size="xl" // Use Gluestack size token
        color="$textSecondary" // Use theme token
        mb="$4"
      />
      {title && <ThemedText bold fontSize="$xl" mb="$2" textAlign="center">{title}</ThemedText>}
      <ThemedText textAlign="center" color="$textSecondary" lineHeight="$lg">
        {message}
      </ThemedText>
    </Box>
  );
};
export default EmptyState;
