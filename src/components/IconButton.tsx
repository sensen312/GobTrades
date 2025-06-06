// src/components/IconButton.tsx
import React from 'react';
import { Pressable as GluePressable, useToken } from '@gluestack-ui/themed';
import type { ComponentProps } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { StyleProp, ViewStyle } from 'react-native';

type GluePressablePropsIconButton = ComponentProps<typeof GluePressable>;

interface IconButtonProps extends Omit<GluePressablePropsIconButton, 'children' | 'style'> {
  iconName: string;
  iconSize?: number;
  iconColor?: string;
  'aria-label': string;
  style?: StyleProp<ViewStyle>;
}

const IconButton: React.FC<IconButtonProps> = ({
  iconName,
  iconSize = 24,
  iconColor: iconColorProp = '$iconColor',
  'aria-label': ariaLabel,
  style,
  disabled,
  sx,
  ...pressableProps
}) => {
  const finalIconColorToken = disabled ? '$textDisabled' : iconColorProp;
  const resolvedIconColor = useToken('colors', finalIconColorToken as any);

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
      <MaterialCommunityIcons
        name={iconName}
        size={iconSize}
        color={resolvedIconColor}
      />
    </GluePressable>
  );
};
export default IconButton;
