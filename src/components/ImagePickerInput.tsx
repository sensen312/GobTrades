// src/components/ImagePickerInput.tsx
import React, { useState, useEffect, FC } from 'react';
import { Box, Pressable, Icon, Image, HStack } from '@gluestack-ui/themed';
import { Alert, Platform, StyleProp, ViewStyle, FlatList } from 'react-native';
import * as ExpoImagePicker from 'expo-image-picker';
import { CameraIcon, ImageIcon, TrashIcon, AlertCircleIcon } from 'lucide-react-native';
import ThemedText from './ThemedText';
import { ImageObject as AppImageObject } from '../types';
import { IMAGE_API_PATH } from '../api';
import uuid from 'react-native-uuid';
import { showErrorToast } from '../utils/toast';

// CORRECTED: Exporting the interface so other files can import it.
export interface ImagePickerObjectType {
    uri: string;
    type?: string;
    name?: string;
    localId: string;
    isNew: boolean;
    originalFilename?: string;
}

export interface ImagePickerInputProps {
  initialImages?: AppImageObject[];
  onImagesChange: (images: AppImageObject[]) => void;
  maxImages?: number;
  style?: StyleProp<ViewStyle>;
  isEditMode?: boolean;
}

const ImagePickerInput: FC<ImagePickerInputProps> = ({
  initialImages = [],
  onImagesChange,
  maxImages = 10,
  style,
  isEditMode = false,
}) => {
  const [images, setImages] = useState<ImagePickerObjectType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode) {
      const mappedInitialImages: ImagePickerObjectType[] = initialImages.map(item => ({
        uri: item.uri || `${IMAGE_API_PATH}${item.originalFilename}`,
        name: item.name || item.originalFilename,
        localId: item.localId,
        isNew: false,
        originalFilename: item.originalFilename,
      }));
      setImages(mappedInitialImages);
    } else {
      setImages([]);
    }
  }, [initialImages, isEditMode]);

  const requestPermissions = async (): Promise<boolean> => {
    setError(null);
    if (Platform.OS !== 'web') {
      const cameraPerm = await ExpoImagePicker.requestCameraPermissionsAsync();
      const mediaPerm = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
      if (cameraPerm.status !== 'granted' || mediaPerm.status !== 'granted') {
        const permError = 'Camera and Photo Library permissions are required.';
        setError(permError);
        Alert.alert('Permission Required', permError, [{ text: 'OK' }]);
        return false;
      }
    }
    return true;
  };

  const handleSelectImage = async (useCamera: boolean) => {
    if (images.length >= maxImages) {
      showErrorToast(`Maximum of ${maxImages} images allowed.`, "Stall Full");
      return;
    }
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const options: ExpoImagePicker.ImagePickerOptions = {
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    };

    let result;
    try {
      result = useCamera ? await ExpoImagePicker.launchCameraAsync(options) : await ExpoImagePicker.launchImageLibraryAsync(options);
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const newImage: ImagePickerObjectType = {
          uri: asset.uri,
          type: asset.mimeType || 'image/jpeg',
          name: asset.fileName || `stall_item_${Date.now()}.${asset.uri.split('.').pop() || 'jpg'}`,
          localId: uuid.v4() as string,
          isNew: true,
        };
        const updatedImages = [...images, newImage];
        setImages(updatedImages);
        onImagesChange(updatedImages as AppImageObject[]);
        setError(null);
      }
    } catch (e: any) {
      console.error("ImagePickerInput Error:", e);
      setError(`Failed to ${useCamera ? 'take photo' : 'select image'}: ${e.message || 'Unknown error'}`);
      showErrorToast(`Failed to ${useCamera ? 'take photo' : 'select image'}.`, "Image Error");
    }
  };

  const handleRemoveImage = (localIdToRemove: string) => {
    const updatedImages = images.filter(img => img.localId !== localIdToRemove);
    setImages(updatedImages);
    onImagesChange(updatedImages as AppImageObject[]);
    setError(null);
  };

  const renderImagePreview = ({ item, index }: { item: ImagePickerObjectType; index: number }) => (
    <Box mr="$3" mb="$3" position="relative" testID={`image-preview-${item.localId}`}>
      <Image
        source={{ uri: item.uri }}
        alt={item.name || item.originalFilename || `Stall item ${index + 1}`}
        w={100} h={100} borderRadius={6} bg="$parchment100"
      />
      <Pressable
        position="absolute" top={-8} right={-8} bg="$errorBase" borderRadius="$full" p="$1.5"
        onPress={() => handleRemoveImage(item.localId)}
        accessibilityLabel={`Remove image ${item.name || item.originalFilename || index + 1}`}
        sx={{ ":hover": { bg: "$error700" } }} testID={`remove-image-button-${item.localId}`}
      >
        <Icon as={TrashIcon} color="$textLight" size="sm" />
      </Pressable>
    </Box>
  );

  const renderAddImageButtons = () => (
    <HStack space="md">
      <Pressable justifyContent="center" alignItems="center" w={100} h={100} bg="$parchment100" borderRadius="$md" borderWidth={1} borderColor="$parchment500" borderStyle="dashed" onPress={() => handleSelectImage(true)} accessibilityLabel="Add image using camera" sx={{ ":hover": { bg: "$parchment200" } }} testID="add-image-camera-button">
        <Icon as={CameraIcon} size="xl" color="$textSecondary" />
        <ThemedText size="xs" mt="$1" color="$textSecondary">Camera</ThemedText>
      </Pressable>
      <Pressable justifyContent="center" alignItems="center" w={100} h={100} bg="$parchment100" borderRadius="$md" borderWidth={1} borderColor="$parchment500" borderStyle="dashed" onPress={() => handleSelectImage(false)} accessibilityLabel="Add image from gallery" sx={{ ":hover": { bg: "$parchment200" } }} testID="add-image-gallery-button">
        <Icon as={ImageIcon} size="xl" color="$textSecondary" />
        <ThemedText size="xs" mt="$1" color="$textSecondary">Gallery</ThemedText>
      </Pressable>
    </HStack>
  );

  return (
    <Box style={style} mb="$4">
      {error && (
        <Box flexDirection="row" alignItems="center" bg="$errorBg" p="$2" borderRadius="$sm" mb="$2">
          <Icon as={AlertCircleIcon} color="$error700" size="sm" mr="$2" />
          <ThemedText color="$error700" size="sm">{error}</ThemedText>
        </Box>
      )}
      <FlatList
        horizontal
        data={images}
        renderItem={renderImagePreview}
        keyExtractor={(item) => item.localId}
        showsHorizontalScrollIndicator={false}
        ListFooterComponent={images.length < maxImages ? renderAddImageButtons() : null}
        ListFooterComponentStyle={{ marginLeft: images.length > 0 ? 12 : 0 }}
        contentContainerStyle={{ paddingVertical: 8 }}
      />
    </Box>
  );
};
export default ImagePickerInput;
