import React, { useState, useEffect, useCallback } from 'react';
import { Box, Heading } from '@gluestack-ui/themed';
import { useForm } from 'react-hook-form';
import { useNavigation, useRoute } from '@react-navigation/native';
import { zodResolver } from '@hookform/resolvers/zod'; // If using Zod
import * as z from 'zod'; // If using Zod

import ScreenContainer from '../../../components/ScreenContainer';
import PrimaryButton from '../../../components/PrimaryButton';
// Corrected import casing
import KeyboardAvoidingViewWrapper from '../../../components/KeyboardAvoidingViewWrapper';
// Import the exported type along with the component
import ListingFormFields, { ListingFormFieldsProps } from '../components/ListingFormFields';
import { useListingsStore } from '../store/listingsStore';
import { showErrorToast, showSuccessToast } from '../../../utils/toast';
import { ListingsScreenProps } from '../../../navigation/types'; // Correct navigation types
import LoadingIndicator from '../../../components/LoadingIndicator';
import ErrorDisplay from '../../../components/ErrorDisplay';
import { formatImageDataForUpload } from '../../../services/formatImageData'; // Image formatting utility
import { IMAGE_API_PATH } from '../../../api'; // Base image path

// Define Zod schema (should match Create screen)
const listingSchema = z.object({
  itemName: z.string().min(3, 'Item name must be at least 3 characters'),
  description: z.string().max(50, 'Description cannot exceed 50 characters').min(1, 'Description is required'),
  tags: z.array(z.string()).min(1, 'Select at least one item tag'),
  wantsTags: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof listingSchema>;

// Define ImageObject structure (should match Create screen)
interface ImageObject {
    uri: string;
    type?: string;
    name?: string;
    // Flag to indicate if it's a newly added image vs existing one
    isNew?: boolean;
     // Original filename for existing images (if needed for backend deletion)
    originalFilename?: string;
}

// Use the correct prop type for the screen
type Props = ListingsScreenProps<'EditListing'>;

const EditListingScreen: React.FC = () => { // Can use FC if not directly using navigation/route props
    const navigation = useNavigation<Props['navigation']>();
    const route = useRoute<Props['route']>();
    const { listingId } = route.params;

    const {
        fetchListingDetails,
        updateListing,
        detailedListing, // The listing being edited
        detailStatus,   // Status for fetching the listing
        mutationStatus, // Status for the update operation
        clearListingDetails
    } = useListingsStore();

    const isLoadingDetails = detailStatus === 'loading';
    const isUpdating = mutationStatus === 'loading';

    // State for images - needs to differentiate between existing and new images
    const [images, setImages] = useState<ImageObject[]>([]);

    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(listingSchema),
        // Default values will be set by useEffect once listing data loads
    });

    // Fetch listing details when the screen mounts or listingId changes
    useEffect(() => {
        fetchListingDetails(listingId);
        // Clear details when unmounting
        return () => clearListingDetails();
    }, [listingId, fetchListingDetails, clearListingDetails]);

    // Populate form and image state once listing details are loaded
    useEffect(() => {
        if (detailedListing && detailStatus === 'success') {
            reset({
                itemName: detailedListing.itemName,
                description: detailedListing.description,
                tags: detailedListing.tags || [],
                wantsTags: detailedListing.wantsTags || [],
            });
            // Initialize image state with existing images
             const existingImages: ImageObject[] = (detailedListing.imageFilenames || []).map(filename => ({
                 uri: `${IMAGE_API_PATH}${filename}`, // Construct full URL for display
                 isNew: false,
                 originalFilename: filename // Store original filename
             }));
             setImages(existingImages);
        }
    }, [detailedListing, detailStatus, reset]);

     // Callback for ListingFormFields to update images state
     const handleImagesChange = useCallback((newImageSelection: ImageObject[]) => {
         // This callback receives the full list of images (existing + new)
         // from ImagePickerInput. We need to manage the state here.
          setImages(newImageSelection);
     }, []);

    const onSubmit = async (data: FormData) => {
        if (images.length === 0) {
            showErrorToast("Please add at least one image!", "Missing Image");
            return;
        }

        const formData = new FormData();
        formData.append('itemName', data.itemName);
        formData.append('description', data.description);
        data.tags.forEach(tag => formData.append('tags', tag));
        data.wantsTags?.forEach(tag => formData.append('wantsTags', tag));

        // --- Handle Images ---
        const existingImageFilenames: string[] = [];
        images.forEach((image, index) => {
            if (image.isNew && image.uri) {
                // Format and append NEW images
                const formattedImage = formatImageDataForUpload(image);
                if (formattedImage) {
                    formData.append('newImageFiles', formattedImage as any); // Use a specific key for new files
                }
            } else if (!image.isNew && image.originalFilename) {
                 // Keep track of existing images that are *still* present
                 existingImageFilenames.push(image.originalFilename);
            }
             // Handle primary image designation if changed
             if (index === 0 && !image.isNew && image.originalFilename) { // Example: first image is primary
                  formData.append('primaryImageFilename', image.originalFilename);
             } else if (index === 0 && image.isNew) {
                  // Backend needs to know which *new* image is primary, maybe by index or filename later
                  formData.append('primaryImageIsNew', 'true'); // Flag that primary is one of the uploads
             }
        });

        // Send list of remaining existing image filenames (backend uses this to know which old ones to keep/delete)
         existingImageFilenames.forEach(filename => formData.append('existingImageFilenames', filename));


        const updatedListing = await updateListing(listingId, formData);

        if (updatedListing) {
            showSuccessToast("Listing updated successfully!", "Success");
            // Navigate back or to the detail screen
            navigation.goBack();
        }
        // Error handled by store
    };

    if (isLoadingDetails) {
        return <LoadingIndicator overlay text="Loading listing data..." />;
    }

    if (detailStatus === 'error' || !detailedListing) {
        return (
            <ScreenContainer>
                <ErrorDisplay title="Error Loading Listing" message="Could not load the listing data. Please try again." />
            </ScreenContainer>
        );
    }

    return (
        <ScreenContainer scrollable={false}>
             <KeyboardAvoidingViewWrapper>
                 <Box px="$4" pt="$4" pb="$20">
                    <Heading mb="$6">Edit Your Treasure</Heading>

                    <ListingFormFields
                        control={control}
                        isEditMode={true}
                        // Pass initial image URIs derived from the detailedListing
                        initialImageUris={images.filter(img => !img.isNew).map(img => img.uri)}
                        onImagesChange={handleImagesChange}
                    />

                    <PrimaryButton
                        title="Save Changes"
                        onPress={handleSubmit(onSubmit)}
                        isLoading={isUpdating}
                        disabled={isUpdating}
                        mt="$6"
                    />
                 </Box>
            </KeyboardAvoidingViewWrapper>
        </ScreenContainer>
    );
};

export default EditListingScreen;