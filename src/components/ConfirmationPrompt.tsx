import React from 'react';
import { Heading, ButtonGroup } from '@gluestack-ui/themed';
import ModalWrapper from './ModalWrapper'; // Use the ModalWrapper
import ThemedText from './ThemedText';
import PrimaryButton from './PrimaryButton';   // Assuming PrimaryButton accepts onPress
import SecondaryButton from './SecondaryButton'; // Assuming SecondaryButton accepts onPress

interface ConfirmationPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void; // Callback when confirm is pressed
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean; // Show loading state on confirm button
}

/** Renders a confirmation modal dialog using ModalWrapper. (Story 29) */
const ConfirmationPrompt: React.FC<ConfirmationPromptProps> = ({
  isOpen, onClose, onConfirm, title = "Are you sure?", message,
  confirmText = "Confirm", cancelText = "Cancel", isLoading = false
}) => {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} size="md">
        <ModalWrapper.Header>
            <Heading size="lg">{title}</Heading>
        </ModalWrapper.Header>
        <ModalWrapper.Body>
            <ThemedText>{message}</ThemedText>
        </ModalWrapper.Body>
        <ModalWrapper.Footer>
            <ButtonGroup space="md" w="$full" justifyContent='flex-end'>
                {/* Pass onPress directly */}
                <SecondaryButton
                    title={cancelText}
                    onPress={onClose} // Pass the onPress handler
                    disabled={isLoading}
                />
                {/* Pass onPress directly */}
                <PrimaryButton
                    title={confirmText}
                    onPress={onConfirm} // Pass the onPress handler
                    isLoading={isLoading}
                    // Assuming 'action' is a valid prop for PrimaryButton based on theme
                    action="negative" // Use themed negative style for confirm
                />
            </ButtonGroup>
        </ModalWrapper.Footer>
    </ModalWrapper>
  );
};
export default ConfirmationPrompt;
