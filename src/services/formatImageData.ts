import { Platform } from 'react-native';

/**
 * Represents the structure of an image asset from expo-image-picker or similar.
 */
interface ImageAsset {
    uri: string;
    type?: string; // Mime type (e.g., 'image/jpeg')
    name?: string; // Filename
    // Add other potential fields from expo-image-picker Asset if needed
    // e.g., width, height, fileSize, base64
}

/**
 * Formats an image asset for uploading via FormData.
 * Handles platform-specific URI formatting.
 *
 * @param {ImageAsset} image - The image asset object.
 * @returns {Blob | { uri: string; name: string; type: string } | null} - The formatted image data suitable for FormData, or null if invalid.
 */
export const formatImageDataForUpload = (image: ImageAsset): Blob | { uri: string; name: string; type: string } | null => {
    if (!image || !image.uri) {
        console.warn("formatImageDataForUpload: Invalid image asset provided.");
        return null;
    }

    const uri = image.uri;
    // Attempt to infer filename and type if missing
    const filename = image.name || uri.split('/').pop() || `upload_${Date.now()}.jpg`;
    let type = image.type;

    if (!type) {
        const match = /\.(\w+)$/.exec(filename);
        type = match ? `image/${match[1]}` : `image/jpeg`; // Default to jpeg
        // Common adjustments
        if (type === 'image/jpg') type = 'image/jpeg';
    }

    // Prepare the object for FormData append
    // For React Native, FormData can often handle this object structure directly
    const formattedImage = {
        uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''), // Remove 'file://' prefix for iOS
        name: filename,
        type: type,
    };

    // Basic validation
    if (!formattedImage.uri || !formattedImage.name || !formattedImage.type) {
         console.warn("formatImageDataForUpload: Could not determine all required image properties (uri, name, type).", formattedImage);
         return null;
    }


    return formattedImage;
};

// Example Usage in a component:
/*
import { formatImageDataForUpload } from './services/formatImageData';

// ... inside form submission logic ...
const formData = new FormData();
// Assume 'selectedImages' is an array of ImageAsset objects from ImagePickerInput
selectedImages.forEach(imageAsset => {
    const formattedImage = formatImageDataForUpload(imageAsset);
    if (formattedImage) {
        // Use a consistent key name expected by the backend (e.g., 'imageFiles')
        formData.append('imageFiles', formattedImage as any); // Cast to 'any' might be needed for FormData typing
    }
});
// ... append other form data ...
// await api.post('/your-upload-endpoint', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

*/