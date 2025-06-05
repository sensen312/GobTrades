// src/components/ThemedText.tsx
import React from 'react';
import { Text as GlueText } from '@gluestack-ui/themed';
import type { ComponentProps } from 'react';

// Define the props type using ComponentProps
type ThemedTextProps = ComponentProps<typeof GlueText>;

/** Applies default body font and primary text color from theme. */
const ThemedText: React.FC<ThemedTextProps> = ({
  fontFamily = "$body", // Default to body font from theme
  color = "$textPrimary", // Default to primary text color from theme
  ...props // Spread other Text props
}) => {
  return <GlueText fontFamily={fontFamily} color={color} {...props} />;
};
export default ThemedText;
