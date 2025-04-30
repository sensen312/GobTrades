import React from 'react';
 import {
     Modal, ModalBackdrop, ModalContent, ModalHeader, ModalBody, ModalFooter
 } from '@gluestack-ui/themed';
 import type { IModalProps as GlueModalProps } from '@gluestack-ui/themed';

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
     >
       <ModalBackdrop />
       <ModalContent>
         {children}
       </ModalContent>
     </Modal>
   );
 };

 // Header Sub-component.
 const Header: React.FC<ModalSubComponentProps> = ({ children }) => (
     <ModalHeader>{children}</ModalHeader>
 );

 // Body Sub-component.
 const Body: React.FC<ModalSubComponentProps> = ({ children }) => (
     <ModalBody>{children}</ModalBody>
 );

 // Footer Sub-component.
 const Footer: React.FC<ModalSubComponentProps> = ({ children }) => (
     <ModalFooter>{children}</ModalFooter>
 );

 // Assign sub-components.
 ModalWrapper.Header = Header;
 ModalWrapper.Body = Body;
 ModalWrapper.Footer = Footer;

 export default ModalWrapper;
