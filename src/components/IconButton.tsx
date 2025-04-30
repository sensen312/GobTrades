import React from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
// Import the Gluestack Icon component
import { Icon } from '@gluestack-ui/themed';
// Import the specific icon set component
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface IconButtonProps extends PressableProps {
  iconName: string;
  iconSize?: number;
  iconColor?: string; // Theme color token (e.g., '$textPrimary') or hex code
  'aria-label': string;
  style?: StyleProp<ViewStyle>;
}

/** Renders a button containing only an icon using Gluestack's Icon component. */
const IconButton: React.FC<IconButtonProps> = ({
  iconName,
  iconSize = 24,
  iconColor: iconColorProp = '$iconColor', // Default theme token
  'aria-label': ariaLabel,
  style,
  disabled,
  ...props
}) => {
  // Determine the color token based on the disabled state
  const finalIconColorToken = disabled ? '$textSecondary' : iconColorProp;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={ariaLabel}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      style={({ pressed }) => [
        { padding: 8 }, // Add padding for touch target size
        { opacity: disabled ? 0.5 : pressed ? 0.6 : 1 }, // Dim when disabled or pressed
        style, // Allow custom styles
      ]}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Increase touch area
      {...props}
    >
      {/* Use Gluestack Icon component */}
      <Icon
        as={MaterialCommunityIcons} // Pass the icon set component
        // @ts-ignore - Pass name prop directly to the underlying component
        name={iconName}
        size="xl" // Use a valid Icon size token ('xl' corresponds to 24)
        // Pass the theme token directly to the color prop
        color={finalIconColorToken}
      />
    </Pressable>
  );
};
export default IconButton;