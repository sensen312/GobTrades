// src/components/ImagePickerInput.tsx
import React, { useState, useEffect } from 'react';
import { Box, Pressable, Icon as GlueIcon, Image as GlueImage, Text as GlueText, HStack as HStackImagePicker } from '@gluestack-ui/themed';
import type { ComponentProps } from 'react';
import { Alert, Platform, StyleProp, ViewStyle, FlatList } from 'react-native';
import * as ExpoImagePicker from 'expo-image-picker';
import { CameraIcon as LucideCameraIcon, ImageIcon as LucideImageIcon, Trash2Icon as LucideTrashIcon, AlertCircleIcon as LucideAlertCircleIcon } from 'lucide-react-native';
import ThemedText from './ThemedText';
import { ImageObject as AppImageObject } from '../types'; // Use AppImageObject for consistency
import { IMAGE_API_PATH as IMAGE_API_PATH_PICKER } from '../api'; // Correct import
import uuid from 'react-native-uuid';
import { showErrorToast as showErrorToastImagePicker } from '../utils/toast'; // Correct import

type BoxPropsImagePicker = ComponentProps<typeof Box>;
type PressablePropsImagePicker = ComponentProps<typeof Pressable>;
type GlueImagePropsImagePicker = ComponentProps<typeof GlueImage>;
type GlueIconPropsImagePicker = ComponentProps<typeof GlueIcon>;
// type GlueTextPropsImagePicker = ComponentProps<typeof GlueText>; // Not directly spread
type HStackPropsImagePicker = ComponentProps<typeof HStackImagePicker>;

export interface ImagePickerInputProps {
  initialImages?: AppImageObject[]; // URIs/filenames of existing images, now typed as AppImageObject
  onImagesChange: (images: AppImageObject[]) => void; // Callback with full AppImageObject array
  maxImages?: number;
  style?: StyleProp<ViewStyle>;
}

const ImagePickerInput: React.FC<ImagePickerInputProps> = ({
  initialImages = [],
  onImagesChange,
  maxImages = 10,
  style,
}) => {
  // Internal state uses AppImageObject for consistency
  const [images, setImages] = useState<AppImageObject[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Effect to process initialImages. Ensures full AppImageObject structure internally.
  useEffect(() => {
    const processedInitialImages: AppImageObject[] = initialImages.map(img => {
      // Ensure localId is present for all items, critical for keying and updates
      const localId = img.localId || uuid.v4() as string;
      let displayUri = img.uri;

      // If it's an existing image (not new) and URI is just a filename, construct full path
      if (img.isNew === false && img.originalFilename && !img.uri.startsWith('http') && !img.uri.startsWith('file:')) {
        displayUri = `${IMAGE_API_PATH_PICKER}${img.originalFilename}`;
      }
      return {
        ...img, // Spread original properties
        localId, // Ensure localId
        uri: displayUri, // Ensure URI is correctly formed for display
        isNew: img.isNew !== undefined ? img.isNew : !img.dbId, // Infer isNew if not provided
      };
    });
    setImages(processedInitialImages);
  }, [initialImages]); // Rerun if initialImages prop changes


  const requestPermissions = async (): Promise<boolean> => {
    setError(null);
    if (Platform.OS !== 'web') {
      const cameraPerm = await ExpoImagePicker.requestCameraPermissionsAsync();
      const mediaPerm = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
      if (cameraPerm.status !== 'granted' || mediaPerm.status !== 'granted') {
        const permError = 'Camera and Photo Library permissions are required.';
        setError(permError); Alert.alert('Permission Required', permError, [{ text: 'OK' }]);
        return false;
      }
    }
    return true;
  };

  const handleSelectImage = async (useCamera: boolean) => {
    if (images.length >= maxImages) {
      showErrorToastImagePicker(`Maximum of ${maxImages} images allowed.`, "Stall Full"); return;
    }
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const options: ExpoImagePicker.ImagePickerOptions = {
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images, allowsEditing: true,
      aspect: [4, 3], quality: 0.7,
    };

    let result;
    try {
      if (useCamera) { result = await ExpoImagePicker.launchCameraAsync(options); }
      else { result = await ExpoImagePicker.launchImageLibraryAsync(options); }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const clientDerivedName = `stallItem_${Date.now()}_${images.length}.${asset.uri.split('.').pop() || 'jpg'}`;
        const newImage: AppImageObject = { // Ensure new image conforms to AppImageObject
          uri: asset.uri,
          type: asset.mimeType || 'image/jpeg',
          name: asset.fileName || clientDerivedName,
          localId: uuid.v4() as string, // Generate new localId for new image
          isNew: true,
          // originalFilename and dbId will be undefined for new images
        };
        const updatedImages = [...images, newImage];
        setImages(updatedImages);
        onImagesChange(updatedImages); // Pass the updated array of AppImageObject
        setError(null);
      }
    } catch (e: any) {
      console.error("ImagePickerInput Error:", e);
      setError(`Failed to ${useCamera ? 'take photo' : 'select image'}: ${e.message || 'Unknown error'}`);
      showErrorToastImagePicker(`Failed to ${useCamera ? 'take photo' : 'select image'}.`, "Image Error");
    }
  };

  // Remove image by its unique localId
  const handleRemoveImage = (localIdToRemove: string) => {
    const updatedImages = images.filter(img => img.localId !== localIdToRemove);
    setImages(updatedImages);
    onImagesChange(updatedImages); // Pass the updated array
    setError(null);
  };

  const renderImagePreview = ({ item, index }: { item: AppImageObject; index: number }) => (
    <BoxPropsImagePicker mr="$3" mb="$3" position="relative" testID={`image-preview-${item.localId}`}>
      <GlueImagePropsImagePicker
        source={{ uri: item.uri }}
        alt={item.name || item.originalFilename || `Stall item ${index + 1}`}
        w={100} h={100} borderRadius="$md" bg="$parchment100"
      />
      <PressablePropsImagePicker
        position="absolute" top={-8} right={-8} bg="$errorBase" borderRadius="$full" p="$1.5"
        onPress={() => handleRemoveImage(item.localId)} // Use localId for removal
        accessibilityLabel={`Remove image ${item.name || item.originalFilename || index + 1}`}
        sx={{ ":hover": { bg: "$error700" } }} testID={`remove-image-button-${item.localId}`}
      >
        <GlueIconPropsImagePicker as={LucideTrashIcon} color="$textLight" size="sm" />
      </PressablePropsImagePicker>
    </BoxPropsImagePicker>
  );

  const renderAddImageButtons = () => (
    <HStackImagePicker space="md">
      <PressablePropsImagePicker justifyContent="center" alignItems="center" w={100} h={100} bg="$parchment100" borderRadius="$md" borderWidth={1} borderColor="$parchment500" borderStyle="dashed" onPress={() => handleSelectImage(true)} accessibilityLabel="Add image using camera" sx={{ ":hover": { bg: "$parchment200" } }} testID="add-image-camera-button">
        <GlueIconPropsImagePicker as={LucideCameraIcon} size="xl" color="$textSecondary" />
        <ThemedText size="xs" mt="$1" color="$textSecondary">Camera</ThemedText>
      </PressablePropsImagePicker>
      <PressablePropsImagePicker justifyContent="center" alignItems="center" w={100} h={100} bg="$parchment100" borderRadius="$md" borderWidth={1} borderColor="$parchment500" borderStyle="dashed" onPress={() => handleSelectImage(false)} accessibilityLabel="Add image from gallery" sx={{ ":hover": { bg: "$parchment200" } }} testID="add-image-gallery-button">
        <GlueIconPropsImagePicker as={LucideImageIcon} size="xl" color="$textSecondary" />
        <ThemedText size="xs" mt="$1" color="$textSecondary">Gallery</ThemedText>
      </PressablePropsImagePicker>
    </HStackImagePicker>
  );

  return (
    <BoxPropsImagePicker style={style} mb="$4">
      {error && (
        <BoxPropsImagePicker flexDirection="row" alignItems="center" bg="$errorBg" p="$2" borderRadius="$sm" mb="$2">
          <GlueIconPropsImagePicker as={LucideAlertCircleIcon} color="$error700" size="sm" mr="$2" />
          <ThemedText color="$error700" size="sm">{error}</ThemedText>
        </BoxPropsImagePicker>
      )}
      <FlatList
        horizontal
        data={images}
        renderItem={renderImagePreview}
        keyExtractor={(item) => item.localId} // Use mandatory localId as key
        showsHorizontalScrollIndicator={false}
        ListFooterComponent={images.length < maxImages ? renderAddImageButtons() : null}
        ListFooterComponentStyle={{ marginLeft: images.length > 0 ? 12 : 0 }}
        contentContainerStyle={{ paddingVertical: 8 }}
      />
    </BoxPropsImagePicker>
  );
};
export default ImagePickerInput;
