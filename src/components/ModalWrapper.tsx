// src/components/ModalWrapper.tsx
import React from 'react';
import {
    Modal, ModalBackdrop, ModalContent, ModalHeader, ModalBody, ModalFooter
} from '@gluestack-ui/themed';
import type { IModalProps } from '@gluestack-ui/themed';

interface ModalWrapperProps extends Omit<IModalProps, 'children'> {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  finalFocusRef?: React.RefObject<any>;
}

interface ModalSubComponentProps {
    children: React.ReactNode;
}

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

const Header: React.FC<ModalSubComponentProps> = ({ children }) => <ModalHeader>{children}</ModalHeader>;
const Body: React.FC<ModalSubComponentProps> = ({ children }) => <ModalBody>{children}</ModalBody>;
const Footer: React.FC<ModalSubComponentProps> = ({ children }) => <ModalFooter>{children}</ModalFooter>;

ModalWrapper.Header = Header;
ModalWrapper.Body = Body;
ModalWrapper.Footer = Footer;

export default ModalWrapper;
