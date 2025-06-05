// src/components/SecondaryButton.tsx
import React from 'react';
import { Button as GlueButton, ButtonText, ButtonSpinner } from '@gluestack-ui/themed';
import type { ComponentProps } from 'react';

// Get the base Button props type
type GlueButtonPropsSecondary = ComponentProps<typeof GlueButton>;

// Define allowed action types based on Gluestack's Button config
type ButtonActionSecondary = 'default' | 'primary' | 'secondary' | 'positive' | 'negative';


interface SecondaryButtonProps extends Omit<GlueButtonPropsSecondary, 'action'>{
  title: string;
  isLoading?: boolean;
  action?: ButtonActionSecondary;
}

/** Renders the secondary action button using theme's outline variant. */
const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  title,
  isLoading = false,
  variant = "outline", // Default to outline variant for secondary actions
  action = "secondary", // Default to secondary action styling for outline
  size = "md",
  disabled,
  ...props // Includes onPress, style, etc.
}) => {
  const isEffectivelyDisabled = isLoading || disabled;

  return (
    <GlueButton
      variant={variant}
      action={action} // This will apply styles from theme.components.Button.variants.action.secondary
      size={size}
      disabled={isEffectivelyDisabled}
      opacity={isEffectivelyDisabled ? 0.5 : 1} // Ensure disabled opacity is applied
      {...props}
    >
      {isLoading && <ButtonSpinner mr="$2" color="$goblinGreen700" />} {/* Primary color for spinner in outline */}
      <ButtonText>{title}</ButtonText>
    </GlueButton>
  );
};
export default SecondaryButton;
