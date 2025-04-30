import React, { useState, useEffect, ComponentProps } from 'react';
import { Box, Pressable, Icon, useToken, Image } from '@gluestack-ui/themed';
import { Alert, Platform, StyleProp, ViewStyle } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CameraIcon, ImageIcon, TrashIcon, AlertCircleIcon } from 'lucide-react-native'; // Use lucide icons
import { API_BASE_URL } from '../../../api'; // Import base URL
import ThemedText from '../../../components/ThemedText'; // Import ThemedText

// Define the props interface for ImagePickerInput
export interface ImagePickerInputProps {
    initialImageUris?: string[]; // URIs or filenames of existing images
    // Accept array of objects containing uri, type, name
    onImagesChange: (images: { uri: string; type?: string; name?: string }[]) => void;
    maxImages?: number; // Maximum number of images allowed
    style?: StyleProp<ViewStyle>;
    isEditMode?: boolean; // Flag to determine if initial URIs are full URLs or filenames
}

// Construct image path - ensure API_BASE_URL doesn't have double slashes if base is just domain
// const IMAGE_API_PATH = `${API_BASE_URL.replace('/api', '')}/api/images/`;
// Using EXPO_PUBLIC_ prefix is standard for env vars
const IMAGE_API_PATH = process.env.EXPO_PUBLIC_IMAGE_API_PATH || `${API_BASE_URL.replace(/\/api$/, '')}/api/images/`;


const ImagePickerInput: React.FC<ImagePickerInputProps> = ({
    initialImageUris = [],
    onImagesChange,
    maxImages = 4,
    style,
    isEditMode = false,
}) => {
    // Store image objects { uri, type, name }
    const [images, setImages] = useState<{ uri: string; type?: string; name?: string }[]>([]);
    const [error, setError] = useState<string | null>(null);

    // --- Resolve theme tokens ---
    // errorColor and imageBorderRadius might be needed for non-Gluestack styles/logic
    const errorColor = useToken('colors', 'error700'); // Use direct key like error700 - Check if this works
    const imageBorderRadius = useToken('radii', 'sm'); // Use direct alias

    // Map initial URIs/filenames to the image object structure
    useEffect(() => {
        const initialImages = initialImageUris.map(uriOrFilename => {
            // Determine if it's a full URL or just a filename
            const isFullUrl = uriOrFilename.startsWith('http') || uriOrFilename.startsWith('file:');
            const name = uriOrFilename.split('/').pop();
            const uri = isEditMode && !isFullUrl ? `${IMAGE_API_PATH}${uriOrFilename}` : uriOrFilename;
            // We might not know the type for existing images unless backend provides it
            return { uri: uri, name: name || `initial-${Date.now()}.jpg`, type: undefined };
        });
        setImages(initialImages);
    }, [initialImageUris, isEditMode]); // Rerun if initial URIs or mode changes


    const requestPermissions = async (): Promise<boolean> => {
        setError(null);
        if (Platform.OS !== 'web') {
            const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
            const libraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (cameraStatus.status !== 'granted' || libraryStatus.status !== 'granted') {
                setError('Camera or Photo Library permission is required to add images.');
                Alert.alert(
                    'Permission Required',
                    'Please grant camera and photo library permissions in your settings to add images.',
                    [{ text: 'OK' }]
                );
                return false;
            }
            return true;
        }
        return true; // Assume granted on web or handle differently
    };

    const handleSelectImage = async (useCamera: boolean) => {
        if (images.length >= maxImages) {
            setError(`Maximum of ${maxImages} images allowed.`);
            return;
        }
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        const options: ImagePicker.ImagePickerOptions = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        };

        let result;
        try {
            if (useCamera) {
                result = await ImagePicker.launchCameraAsync(options);
            } else {
                result = await ImagePicker.launchImageLibraryAsync(options);
            }

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                const newImage = {
                    uri: asset.uri,
                    type: asset.mimeType || 'image/jpeg', // Provide default type
                    name: asset.fileName || `${useCamera ? 'camera' : 'gallery'}-${Date.now()}.${asset.uri.split('.').pop()}`
                };
                const updatedImages = [...images, newImage];
                setImages(updatedImages);
                onImagesChange(updatedImages); // Notify parent component
                setError(null);
            }
        } catch (e: any) {
            console.error("ImagePicker Error:", e);
            setError(`Failed to ${useCamera ? 'take photo' : 'select image'}: ${e.message}`);
        }
    };

    const handleRemoveImage = (indexToRemove: number) => {
        const updatedImages = images.filter((_, index) => index !== indexToRemove);
        setImages(updatedImages);
        onImagesChange(updatedImages);
        setError(null);
    };

    // Use the images state which contains objects with URIs
    const displayUris = images.map(img => img.uri);

    return (
        <Box style={style} mb="$4">
            <ThemedText bold mb="$2">Images ({images.length}/{maxImages})</ThemedText>
            {error && (
                // Use direct theme tokens for Gluestack components
                <Box flexDirection="row" alignItems="center" bg="$errorBg" p="$2" borderRadius="$sm" mb="$2">
                    {/* Use direct token or resolved color */}
                    <Icon as={AlertCircleIcon} color="$error700" size="sm" mr="$2" />
                    <ThemedText color="$error700" size="sm">{error}</ThemedText>
                </Box>
            )}
            <Box flexDirection="row" flexWrap="wrap" alignItems="center">
                 {/* Map over the images state */}
                {images.map((image, index) => (
                    <Box key={image.uri || index} mr="$2" mb="$2" position="relative">
                        <Image
                            source={{ uri: image.uri }} // Use URI from the image object
                            alt={`Selected image ${index + 1}`}
                            w={80} h={80}
                            borderRadius={imageBorderRadius} // Use resolved token (should be numeric or alias)
                            resizeMode="cover"
                        />
                        <Pressable
                            position="absolute"
                            top={-5} right={-5}
                            bg="$errorBase" // Use direct theme token
                            borderRadius="$full"
                            p="$1"
                            onPress={() => handleRemoveImage(index)}
                            accessibilityLabel={`Remove image ${index + 1}`}
                            sx={{ ":hover": { bg: "$error700" } }} // Direct tokens in sx prop
                        >
                            <Icon as={TrashIcon} color="$textLight" size="xs" />
                        </Pressable>
                    </Box>
                ))}

                {images.length < maxImages && (
                    <Box flexDirection="row">
                        <Pressable
                            justifyContent="center" alignItems="center"
                            w={80} h={80} bg="$backgroundCard" // Use theme token
                            borderRadius={imageBorderRadius} // Use resolved token
                            borderWidth={1} borderColor="$borderLight" // Use theme token
                            borderStyle="dashed"
                            onPress={() => handleSelectImage(true)} // Use Camera
                            accessibilityLabel="Add image using camera"
                            mr="$2"
                            sx={{ ":hover": { bg: "$parchment200" } }}
                        >
                            {/* FIX: Pass color token directly */}
                            <Icon as={CameraIcon} size="lg" color="$goblinGreen700" />
                        </Pressable>
                        <Pressable
                            justifyContent="center" alignItems="center"
                            w={80} h={80} bg="$backgroundCard" // Use theme token
                            borderRadius={imageBorderRadius} // Use resolved token
                            borderWidth={1} borderColor="$borderLight" // Use theme token
                            borderStyle="dashed"
                            onPress={() => handleSelectImage(false)} // Select from Gallery
                            accessibilityLabel="Add image from gallery"
                            sx={{ ":hover": { bg: "$parchment200" } }}
                        >
                             {/* FIX: Pass color token directly */}
                             <Icon as={ImageIcon} size="lg" color="$goblinGreen700" />
                        </Pressable>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default ImagePickerInput;