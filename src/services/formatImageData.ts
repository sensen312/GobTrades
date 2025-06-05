// src/services/formatImageData.ts
import { Platform } from 'react-native';
import type { ImageObject as AppImageObject } from '../types'; // Corrected to use AppImageObject

export const formatImageDataForUpload = (image: AppImageObject): { uri: string; name: string; type: string } | null => {
  if (!image || !image.uri) {
    console.warn("formatImageDataForUpload: Invalid image asset provided (missing URI).", image);
    return null;
  }
  const uri = image.uri;
  const filename = image.name || `upload_${Date.now()}.${uri.split('.').pop() || 'jpg'}`;
  let type = image.type;
  if (!type) {
    const extension = (filename.split('.').pop() || 'jpeg').toLowerCase();
    type = `image/${extension === 'jpg' ? 'jpeg' : extension}`;
  }
  const formattedImage = {
    uri: Platform.OS === 'android' ? uri : uri.replace(/^file:\/\//, ''),
    name: filename,
    type: type,
  };
  if (!formattedImage.uri || !formattedImage.name || !formattedImage.type) {
    console.warn("formatImageDataForUpload: Could not determine all required image properties.", formattedImage);
    return null;
  }
  return formattedImage;
};
