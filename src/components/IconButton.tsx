// src/components/IconButton.tsx
import React from 'react';
import { Pressable as RNPressable, PressableProps as RNPressableProps, StyleProp, ViewStyle } from 'react-native';
import { Pressable as GluePressable, Icon as GlueIcon } from '@gluestack-ui/themed';
import type { ComponentProps } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type GlueIconPropsIconButton = ComponentProps<typeof GlueIcon>;
type GluePressablePropsIconButton = ComponentProps<typeof GluePressable>;

interface IconButtonProps extends Omit<GluePressablePropsIconButton, 'children' | 'style'> {
  iconName: string;
  iconSize?: GlueIconPropsIconButton['size']; // Use Gluestack's size tokens like 'sm', 'md', 'lg', 'xl'
  iconColor?: string;
  'aria-label': string;
  style?: StyleProp<ViewStyle>;
}

const IconButton: React.FC<IconButtonProps> = ({
  iconName,
  iconSize = "xl",
  iconColor: iconColorProp = '$iconColor',
  'aria-label': ariaLabel,
  style,
  disabled,
  sx,
  ...pressableProps
}) => {
  const finalIconColorToken = disabled ? '$textDisabled' : iconColorProp;

  return (
    <GluePressable
      accessibilityRole="button"
      accessibilityLabel={ariaLabel}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      sx={{
        padding: '$2',
        opacity: disabled ? 0.5 : 1,
        ':pressed': {
          opacity: 0.6,
        },
        ...sx,
      }}
      style={style}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      {...pressableProps}
    >
      <GlueIcon
        as={MaterialCommunityIcons}
        // @ts-ignore The 'name' prop is valid for MaterialCommunityIcons and will be passed through.
        name={iconName}
        // The 'size' prop for GlueIcon expects specific tokens.
        // MaterialCommunityIcons takes a number. Gluestack <Icon> should handle mapping.
        // If direct number needed, use style prop on MaterialCommunityIcons directly.
        size={iconSize}
        color={finalIconColorToken}
      />
    </GluePressable>
  );
};
export default IconButton;
