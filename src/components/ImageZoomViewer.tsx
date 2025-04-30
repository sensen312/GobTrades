// src/components/ImageZoomViewer.tsx
// No direct Gluestack type imports needed here besides components
import React from 'react';
import { Dimensions } from 'react-native';
import { Modal, ModalBackdrop, ModalContent, ModalCloseButton, Icon, CloseIcon, Image, Box } from '@gluestack-ui/themed';

interface ImageZoomViewerProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

/** Basic modal for viewing an image larger. */
const ImageZoomViewer: React.FC<ImageZoomViewerProps> = ({ isOpen, onClose, imageUrl }) => {
  if (!imageUrl) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalBackdrop bg="rgba(0,0,0,0.9)" />
      <ModalContent bg="transparent" justifyContent="center" alignItems="center">
          <ModalCloseButton
            position="absolute" top={40} right={15} zIndex={1}
            bg="rgba(0,0,0,0.5)" borderRadius="$full" p="$1.5"
          >
              <Icon as={CloseIcon} color="$white" size="lg"/>
          </ModalCloseButton>
          <Box flex={1} width="100%" justifyContent="center">
              <Image
                  source={{ uri: imageUrl }}
                  alt="Zoomed Chat Image"
                  resizeMode="contain"
                  w={screenWidth}
                  h={screenHeight * 0.9}
              />
          </Box>
      </ModalContent>
    </Modal>
  );
};
export default ImageZoomViewer;