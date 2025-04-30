// src/components/ThemedText.tsx
import React from 'react';
// Import the component itself
import { Text as GlueText } from '@gluestack-ui/themed';
// Import ComponentProps from React to get the type
import type { ComponentProps } from 'react';

// Define the props type using ComponentProps
type ThemedTextProps = ComponentProps<typeof GlueText>;

/** Applies default body font and primary text color from theme. */
const ThemedText: React.FC<ThemedTextProps> = ({
  fontFamily = "$body",
  color = "$textPrimary",
  ...props
}) => {
  return <GlueText fontFamily={fontFamily} color={color} {...props} />;
};
export default ThemedText;