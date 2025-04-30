import React from 'react';
import { Button as GlueButton, ButtonText, ButtonSpinner } from '@gluestack-ui/themed';
import type { ComponentProps } from 'react';

interface SecondaryButtonProps extends ComponentProps<typeof GlueButton> {
  title: string;
  isLoading?: boolean;
}

/** Renders the secondary action button using theme's outline variant. */
const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  title,
  isLoading = false,
  variant = "outline",
  size = "md",
  disabled,
  ...props // Includes onPress, style, etc.
}) => {
  const isEffectivelyDisabled = isLoading || disabled;

  return (
    <GlueButton
      variant={variant}
      size={size}
      disabled={isEffectivelyDisabled}
      {...props}
    >
      {isLoading && <ButtonSpinner mr="$2" color="$primary500" />}
      <ButtonText>{title}</ButtonText>
    </GlueButton>
  );
};
export default SecondaryButton;