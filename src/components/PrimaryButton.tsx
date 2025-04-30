import React from 'react';
import { Button as GlueButton, ButtonText, ButtonSpinner } from '@gluestack-ui/themed';
import type { ComponentProps } from 'react';

// Get the base Button props type
type GlueButtonProps = ComponentProps<typeof GlueButton>;

// Define allowed action types based on Gluestack's Button config
type ButtonAction = 'default' | 'primary' | 'secondary' | 'positive' | 'negative';

// Extend the base props, but restrict the 'action' prop type
interface PrimaryButtonProps extends Omit<GlueButtonProps, 'action'> {
  title: string;
  isLoading?: boolean;
  action?: ButtonAction; // Use the restricted type
}

/** Renders the primary action button using theme's solid variant. */
const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  isLoading = false,
  variant = "solid",
  action, // Now correctly typed
  size = "md",
  disabled,
  ...props
}) => {
  const isEffectivelyDisabled = isLoading || disabled;

  return (
    <GlueButton
      variant={variant}
      action={action}
      size={size}
      disabled={isEffectivelyDisabled}
      {...props}
    >
      {isLoading && <ButtonSpinner mr="$2" color="$textOnPrimary" />}
      <ButtonText>{title}</ButtonText>
    </GlueButton>
  );
};
export default PrimaryButton;