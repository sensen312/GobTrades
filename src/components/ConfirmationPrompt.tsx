// src/components/ConfirmationPrompt.tsx
import React from 'react';
import { Heading, ButtonGroup } from '@gluestack-ui/themed';
import ModalWrapper from './ModalWrapper';
import ThemedText from './ThemedText';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import type { ComponentProps } from 'react';

// Gluestack UI Prop Typing
type HeadingPropsConfirm = ComponentProps<typeof Heading>;
// type ButtonGroupPropsConfirm = ComponentProps<typeof ButtonGroup>; // Not directly spread


interface ConfirmationPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

/** Renders a confirmation modal dialog using ModalWrapper. (Story 29) */
const ConfirmationPrompt: React.FC<ConfirmationPromptProps> = ({
  isOpen, onClose, onConfirm, title = "Are you sure?", message,
  confirmText = "Confirm", cancelText = "Cancel", isLoading = false
}) => {
  // Reasoning: Standardizes confirmation dialogs, ensuring consistent UX for destructive actions.
  const finalFocusRef = React.useRef(null); // Ref for accessibility

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} size="md" finalFocusRef={finalFocusRef}>
        <ModalWrapper.Header>
            <Heading size="lg">{title}</Heading>
        </ModalWrapper.Header>
        <ModalWrapper.Body>
            <ThemedText>{message}</ThemedText>
        </ModalWrapper.Body>
        <ModalWrapper.Footer>
            <ButtonGroup space="md" w="$full" justifyContent='flex-end'>
                <SecondaryButton
                    title={cancelText}
                    onPress={onClose}
                    disabled={isLoading}
                    ref={finalFocusRef} // Focus cancel button when modal opens
                />
                <PrimaryButton
                    title={confirmText}
                    onPress={onConfirm}
                    isLoading={isLoading}
                    action="negative" // Use themed negative style for confirm
                />
            </ButtonGroup>
        </ModalWrapper.Footer>
    </ModalWrapper>
  );
};
export default ConfirmationPrompt;
