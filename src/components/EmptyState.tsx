import React from 'react';
import { Box, Icon } from '@gluestack-ui/themed';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ThemedText from './ThemedText';

interface EmptyStateProps {
  iconName?: string;
  message: string;
  title?: string;
}

/** Displays message and icon for empty lists. */
const EmptyState: React.FC<EmptyStateProps> = ({
    iconName = "compass-off-outline",
    message,
    title
}) => {
  return (
    <Box flex={1} justifyContent="center" alignItems="center" p="$8" minHeight={200}>
      <Icon
        as={MaterialCommunityIcons}
        // @ts-ignore - Pass name prop for MaterialCommunityIcons
        name={iconName}
        size="xl"
        color="$textSecondary"
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