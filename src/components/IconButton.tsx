// src/components/IconButton.tsx
import React from 'react';
import { Pressable as GluePressable, Icon as GlueIcon } from '@gluestack-ui/themed';
import type { ComponentProps, ISizes } from '@gluestack-ui/themed';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { StyleProp, ViewStyle } from 'react-native';

type GlueIconPropsIconButton = ComponentProps<typeof GlueIcon>;
type GluePressablePropsIconButton = ComponentProps<typeof GluePressable>;

interface IconButtonProps extends Omit<GluePressablePropsIconButton, 'children' | 'style'> {
  iconName: string;
  iconSize?: ISizes['Icon'];
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
        // @ts-ignore The 'name' prop is valid for MaterialCommunityIcons at runtime.
        name={iconName}
        size={iconSize}
        color={finalIconColorToken}
      />
    </GluePressable>
  );
};
export default IconButton;
