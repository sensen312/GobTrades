// src/components/PrimaryButton.tsx
import React from 'react';
import { Button as GlueButton, ButtonText, ButtonSpinner } from '@gluestack-ui/themed';
import type { ComponentProps } from 'react';

// Get the base Button props type
type GlueButtonPropsPrimary = ComponentProps<typeof GlueButton>;

// Define allowed action types based on Gluestack's Button config
type ButtonActionPrimary = 'default' | 'primary' | 'secondary' | 'positive' | 'negative';

// Extend the base props, but restrict the 'action' prop type
interface PrimaryButtonProps extends Omit<GlueButtonPropsPrimary, 'action'> {
  title: string;
  isLoading?: boolean;
  action?: ButtonActionPrimary; // Use the restricted type
}

/** Renders the primary action button using theme's solid variant. */
const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  isLoading = false,
  variant = "solid", // Default to solid variant for primary actions
  action = "primary", // Default to primary action styling
  size = "md",
  disabled,
  ...props // Spread other Gluestack Button props
}) => {
  const isEffectivelyDisabled = isLoading || disabled;

  return (
    <GlueButton
      variant={variant}
      action={action} // This will apply styles from theme.components.Button.variants.action.primary
      size={size}
      disabled={isEffectivelyDisabled}
      opacity={isEffectivelyDisabled ? 0.6 : 1} // Ensure disabled opacity is applied
      {...props}
    >
      {isLoading && <ButtonSpinner mr="$2" color="$textOnPrimary" />}
      <ButtonText>{title}</ButtonText>
    </GlueButton>
  );
};
export default PrimaryButton;
