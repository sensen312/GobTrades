import { useCallback } from 'react';
import { useListingsStore } from '../store/listingsStore'; // Import the store hook
import { showErrorToast } from '../../../utils/toast'; // Import toast utility
import { formatImageDataForUpload } from '../../../services/formatImageData'; // Image formatting utility
import { Listing } from '../../../types'; // Import Listing type

// Define the structure for image objects consistent with screens
// This should match what ImagePickerInput provides via onImagesChange
interface ImageObject {
  uri: string;
  type?: string; // Mime type (e.g., 'image/jpeg')
  name?: string; // Filename
  // Flag to differentiate new uploads from existing images during edits
  isNew?: boolean;
  // Store the original filename for existing images (needed for backend update logic)
  originalFilename?: string;
}

// Define the expected structure for form data (matching Zod schema usually)
interface ListingFormData {
  itemName: string;
  description: string;
  tags: string[];
  wantsTags?: string[];
  // primaryImageIndex?: number; // Add if implementing primary image selection (Story 13)
}


// Define the return type for the custom hook
interface UseListingManagementReturn {
  /** Creates a new listing by calling the Zustand store action. */
  createNewListing: (formData: ListingFormData, images: ImageObject[]) => Promise<Listing | null>;
  /** Updates an existing listing by calling the Zustand store action. */
  updateExistingListing: (listingId: string, formData: ListingFormData, images: ImageObject[]) => Promise<Listing | null>;
  /** Deletes a listing by calling the Zustand store action. */
  deleteUserListing: (listingId: string) => Promise<boolean>; // Returns true on success from store
  /** Marks a listing as traded or available by calling the Zustand store action. */
  markListingStatus: (listingId: string, isActive: boolean) => Promise<void>; // Store action handles feedback
  /** Indicates if any listing mutation (create, update, delete, status change) is in progress. */
  isLoading: boolean;
  /** Holds the error message from the last mutation attempt. */
  error: string | null;
}

/**
 * Custom hook to encapsulate logic for creating, updating, deleting,
 * and managing the status of listings. It interacts with the listingsStore.
 */
export const useListingManagement = (): UseListingManagementReturn => {
  // Destructure actions and state needed from the Zustand store
  const {
    createListing,
    updateListing,
    deleteListing,
    markAsTraded,
    mutationStatus, // Tracks the status of CUD operations
    error,          // Stores error messages from CUD operations
  } = useListingsStore(state => ({
    createListing: state.createListing,
    updateListing: state.updateListing,
    deleteListing: state.deleteListing,
    markAsTraded: state.markAsTraded,
    mutationStatus: state.mutationStatus,
    error: state.error,
  }));

  // Determine overall loading state based on the store's mutation status
  const isLoading = mutationStatus === 'loading';

  /**
   * Handles the process of creating a new listing.
   * @param data - The validated form data (itemName, description, tags, etc.).
   * @param images - An array of image objects (including URI, type, name).
   * @returns Promise resolving to the created Listing object or null on failure.
   */
  const createNewListing = useCallback(async (data: ListingFormData, images: ImageObject[]): Promise<Listing | null> => {
    // Basic validation: ensure at least one image is provided
    if (!images || images.length === 0) {
      showErrorToast("Please add at least one image!", "Missing Image");
      return null; // Return null to indicate failure
    }

    // Construct FormData payload for the API
    const apiFormData = new FormData();
    apiFormData.append('itemName', data.itemName);
    apiFormData.append('description', data.description);
    // Append tags and wantsTags (ensure arrays are handled correctly)
    data.tags.forEach(tag => apiFormData.append('tags', tag));
    data.wantsTags?.forEach(tag => apiFormData.append('wantsTags', tag));

    // Process and append each image
    images.forEach((image, index) => {
      const formattedImage = formatImageDataForUpload(image);
      if (formattedImage) {
        // Backend expects new images under 'imageFiles' key
        apiFormData.append('imageFiles', formattedImage as any);

        // --- TODO: Implement Primary Image Designation (Story 13) ---
        // Determine which image is primary (e.g., based on data.primaryImageIndex or a flag on the image object)
        // Append the corresponding filename or index as expected by the backend. Example:
        // if (index === (data.primaryImageIndex ?? 0)) { // Assuming index 0 is default primary
        //     // Backend might expect the filename of the primary image
        //     // Since filenames might not be known until backend saves, sending index might be better.
        //     apiFormData.append('primaryImageIndex', index.toString());
        // }
      } else {
        console.warn(`Could not format image at index ${index} for upload:`, image);
      }
    });

    // Call the store action to handle the API request and state update
    const result = await createListing(apiFormData);
    // Store action already handles success/error toasts and state updates
    return result; // Return the created listing or null
  }, [createListing]); // Dependency: the store action


  /**
   * Handles the process of updating an existing listing.
   * @param listingId - The ID of the listing to update.
   * @param data - The validated form data.
   * @param images - The current array of image objects (potentially mixed new and existing).
   * @returns Promise resolving to the updated Listing object or null on failure.
   */
  const updateExistingListing = useCallback(async (listingId: string, data: ListingFormData, images: ImageObject[]): Promise<Listing | null> => {
    // Basic validation
    if (!images || images.length === 0) {
      showErrorToast("Listing must have at least one image!", "Missing Image");
      return null;
    }

    const apiFormData = new FormData();
    // Append standard text fields
    apiFormData.append('itemName', data.itemName);
    apiFormData.append('description', data.description);
    data.tags.forEach(tag => apiFormData.append('tags', tag));
    data.wantsTags?.forEach(tag => apiFormData.append('wantsTags', tag));

    // --- Differentiate and Process Images ---
    const existingImageFilenames: string[] = [];
    images.forEach((image, index) => {
      if (image.isNew && image.uri) {
        // It's a newly added image, format and append for upload
        const formattedImage = formatImageDataForUpload(image);
        if (formattedImage) {
          // Backend needs a specific key to identify new file uploads vs existing ones
          apiFormData.append('newImageFiles', formattedImage as any);
        } else {
          console.warn(`Could not format NEW image at index ${index} for upload:`, image);
        }
      } else if (!image.isNew && image.originalFilename) {
        // It's an existing image that wasn't removed, add its original filename to the list
        existingImageFilenames.push(image.originalFilename);
      }

      // --- TODO: Implement Primary Image Update Logic (Story 13) ---
      // Determine if the primary image changed and append necessary info.
      // Example: Check if the image at the primary index is new or existing.
      // if (index === (data.primaryImageIndex ?? 0)) {
      //     if (image.isNew) {
      //         apiFormData.append('primaryImageIsNewIndex', index.toString()); // Tell backend the new primary is among uploads
      //     } else if (image.originalFilename) {
      //         apiFormData.append('primaryImageFilename', image.originalFilename); // Explicitly set existing primary
      //     }
      // }
    });

    // Send the list of existing filenames that should be kept.
    // Backend uses this to determine which old images were removed.
    existingImageFilenames.forEach(filename => apiFormData.append('existingImageFilenames', filename));

    // Call the store action to handle the API update
    const result = await updateListing(listingId, apiFormData);
    // Store handles feedback and state updates
    return result;
  }, [updateListing]); // Dependency: the store action

  /**
   * Handles deleting a listing. Confirmation should be done in the UI component.
   * @param listingId - The ID of the listing to delete.
   * @returns Promise resolving to true if deletion was successful (based on store action), false otherwise.
   */
  const deleteUserListing = useCallback(async (listingId: string): Promise<boolean> => {
    // Call the store action, which handles API call, state update, and feedback
    const success = await deleteListing(listingId);
    return success;
  }, [deleteListing]); // Dependency: the store action

  /**
   * Handles marking a listing as traded or available.
   * @param listingId - The ID of the listing.
   * @param isActive - The new active status (true = available, false = traded).
   * @returns Promise that resolves when the store action completes.
   */
  const markListingStatus = useCallback(async (listingId: string, isActive: boolean): Promise<void> => {
    // Call the store action, which handles API call, state update, and feedback
    await markAsTraded(listingId, isActive);
  }, [markAsTraded]); // Dependency: the store action

  // Return the memoized functions and relevant state
  return {
    createNewListing,
    updateExistingListing,
    deleteUserListing,
    markListingStatus,
    isLoading, // Provide loading status for UI feedback
    error,     // Provide error message for UI feedback
  };
};