// src/components/ModalWrapper.tsx
import React from 'react';
import {
    Modal, ModalBackdrop, ModalContent, ModalHeader, ModalBody, ModalFooter
} from '@gluestack-ui/themed';
import type { ModalProps as GlueModalProps } from '@gluestack-ui/themed'; // Correct type import
// import type { ComponentProps } from 'react'; // Not strictly needed here if not using ComponentProps directly

interface ModalWrapperProps extends Omit<GlueModalProps, 'children'> {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  finalFocusRef?: React.RefObject<any>;
}

interface ModalSubComponentProps {
    children: React.ReactNode;
}

// Main Modal Wrapper Component using compound pattern.
// Reasoning: Simplifies modal creation by providing a standard layout structure.
const ModalWrapper: React.FC<ModalWrapperProps> & {
    Header: React.FC<ModalSubComponentProps>;
    Body: React.FC<ModalSubComponentProps>;
    Footer: React.FC<ModalSubComponentProps>;
} = ({ isOpen, onClose, children, size = 'lg', finalFocusRef, ...modalProps }) => {
  return (
    <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={size}
        finalFocusRef={finalFocusRef}
        {...modalProps}
        testID="modal-wrapper"
    >
      <ModalBackdrop />
      <ModalContent>
        {children}
      </ModalContent>
    </Modal>
  );
};

// Header Sub-component.
const HeaderMW: React.FC<ModalSubComponentProps> = ({ children }) => ( // Renamed locally
    <ModalHeader>{children}</ModalHeader>
);

// Body Sub-component.
const BodyMW: React.FC<ModalSubComponentProps> = ({ children }) => ( // Renamed locally
    <ModalBody>{children}</ModalBody>
);

// Footer Sub-component.
const FooterMW: React.FC<ModalSubComponentProps> = ({ children }) => ( // Renamed locally
    <ModalFooter>{children}</ModalFooter>
);

// Assign sub-components.
ModalWrapper.Header = HeaderMW;
ModalWrapper.Body = BodyMW;
ModalWrapper.Footer = FooterMW;

export default ModalWrapper;
