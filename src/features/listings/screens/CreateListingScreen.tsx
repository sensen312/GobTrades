import React, { useState, useCallback } from 'react';
import { Box, Heading } from '@gluestack-ui/themed';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { zodResolver } from '@hookform/resolvers/zod'; // If using Zod
import * as z from 'zod'; // If using Zod

import ScreenContainer from '../../../components/ScreenContainer';
import PrimaryButton from '../../../components/PrimaryButton';
import KeyboardAvoidingViewWrapper from '../../../components/KeyboardAvoidingViewWrapper'; // Corrected path/casing assumed
import ListingFormFields from '../components/ListingFormFields'; // Reusable form fields
import { useListingsStore } from '../store/listingsStore';
import { showErrorToast, showSuccessToast } from '../../../utils/toast';
// Import correct navigation types - Assuming Create is a root screen in MainTabs
import { MainTabsScreenProps } from '../../../navigation/types';
import { formatImageDataForUpload } from '../../../services/formatImageData'; // Image formatting utility

// Define Zod schema for validation (Example)
const listingSchema = z.object({
  itemName: z.string().min(3, 'Item name must be at least 3 characters'),
  description: z.string().max(50, 'Description cannot exceed 50 characters').min(1, 'Description is required'),
  tags: z.array(z.string()).min(1, 'Select at least one item tag'),
  wantsTags: z.array(z.string()).optional(), // Optional based on UI
  // Images handled separately, not typically part of RHF state for file uploads
});

type FormData = z.infer<typeof listingSchema>;

// Define the structure for image objects managed by the state
interface ImageObject {
    uri: string;
    // Optional: include type/name if readily available from picker
    type?: string;
    name?: string;
    // Add any other fields needed from expo-image-picker Asset type
}

// Use the correct prop type for the screen
type Props = MainTabsScreenProps<'Create'>;

const CreateListingScreen: React.FC<Props> = () => {
    // Use the specific navigation type for MainTabs
    const navigation = useNavigation<Props['navigation']>();
    const { createListing, mutationStatus } = useListingsStore();
    const isLoading = mutationStatus === 'loading';

    // State to manage selected images (uris or more detailed objects)
    const [images, setImages] = useState<ImageObject[]>([]);

    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(listingSchema),
        defaultValues: {
            itemName: '',
            description: '',
            tags: [],
            wantsTags: [],
        }
    });

    // Callback for ListingFormFields to update images state
     // Ensure this function signature matches what ListingFormFields expects
    const handleImagesChange = useCallback((newImages: ImageObject[]) => {
        setImages(newImages);
    }, []);

    const onSubmit = async (data: FormData) => {
        if (images.length === 0) {
            showErrorToast("Please add at least one image!", "Missing Image");
            return;
        }

        const formData = new FormData();
        formData.append('itemName', data.itemName);
        formData.append('description', data.description);
        // Append tags and wantsTags correctly (backend might expect comma-separated or multiple fields)
        data.tags.forEach(tag => formData.append('tags', tag));
        data.wantsTags?.forEach(tag => formData.append('wantsTags', tag));

        // Format and append images
        images.forEach((image, index) => {
             const formattedImage = formatImageDataForUpload(image);
             if (formattedImage) {
                 // Use a consistent field name that the backend expects (e.g., 'imageFiles')
                 formData.append('imageFiles', formattedImage as any); // Cast might be needed
                 // Designate primary image (e.g., first image) if backend requires it
                 if (index === 0) { // Example: Assuming first image is primary
                      // formData.append('primaryImageIndex', '0'); // Or send filename if backend expects that
                 }
            }
        });

          // TODO: Handle primary image designation if required by Story 13
         // You might need to add a field to the form state or pass an index/filename
         // formData.append('primaryImageIndex', '0'); // Example

        const newListing = await createListing(formData);

        if (newListing) {
            showSuccessToast("Listing posted successfully!", "Success");
            // Navigate to 'My Trades' or the new listing detail after success
            // Example: Navigate to MyListings within the Listings tab
            navigation.navigate('Listings', { screen: 'MyListings' });
        } else {
            // Error toast is likely shown by the store, but can add fallback
            // showErrorToast("Failed to post listing. Please try again.", "Post Failed");
        }
    };

    return (
        // Disable ScreenContainer's scroll if KeyboardAvoidingView handles it
        <ScreenContainer scrollable={false} edges={['top', 'left', 'right']}>
             <KeyboardAvoidingViewWrapper>
                 {/* Enable scrolling within the KeyboardAvoidingView */}
                 <Box px="$4" pt="$4" pb="$20"> {/* Add padding bottom */}
                     <Heading mb="$6">Post New Treasure</Heading>

                     <ListingFormFields
                        control={control}
                        // Pass the image state updater function
                        onImagesChange={handleImagesChange}
                        // Pass current images for display/removal if needed by the component
                        // currentImages={images}
                        isEditMode={false} // Indicate this is not edit mode
                     />

                    <PrimaryButton
                        title="Post Listing"
                        onPress={handleSubmit(onSubmit)}
                        isLoading={isLoading}
                        disabled={isLoading}
                        mt="$6" // Margin top for spacing
                    />
                </Box>
             </KeyboardAvoidingViewWrapper>
        </ScreenContainer>
    );
};

export default CreateListingScreen;