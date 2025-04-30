import React from 'react';
import { Control } from 'react-hook-form';
import { VStack } from '@gluestack-ui/themed';

import StyledInput from '../../../components/StyledInput';
import StyledTextarea from '../../../components/StyledTextarea';
import StyledMultiSelect from '../../../components/StyledMultiSelect';
import ImagePickerInput from './ImagePickerInput'; // Assuming this component exists

// --- Define ImageObject structure (should match Create/Edit screens) ---
interface ImageObject {
    uri: string;
    type?: string;
    name?: string;
}

// --- Export the Props Type ---
export interface ListingFormFieldsProps {
    control: Control<any>; // React Hook Form control object
    isEditMode?: boolean;
    initialImageUris?: string[]; // For pre-populating images in edit mode
    // Callback function to notify parent about image changes
    onImagesChange: (newImages: ImageObject[]) => void;
    // Optionally pass current images if ImagePickerInput doesn't manage its own state
    // currentImages?: ImageObject[];
}

// Mock category data - replace with actual data source (e.g., constants)
const MOCK_CATEGORIES = [
    { label: 'Shiny Things', value: 'shiny' },
    { label: 'Rusty Bits', value: 'rusty' },
    { label: 'Mossy Stuff', value: 'mossy' },
    { label: 'Crafted Goods', value: 'crafted' },
    { label: 'Mystical Items', value: 'mystical' },
];

const ListingFormFields: React.FC<ListingFormFieldsProps> = ({
    control,
    isEditMode = false,
    initialImageUris = [],
    onImagesChange, // Receive the callback prop
    // currentImages = [], // Receive current images if needed
}) => {

    // Here, ImagePickerInput needs to call `onImagesChange` whenever
    // the user adds or removes an image.
    // It might manage its own internal state of images and just report the final list,
    // or it might receive `currentImages` and the callback to manipulate them directly.

    return (
        <VStack space="md">
             <ImagePickerInput
                onImagesChange={onImagesChange} // Pass the callback down
                initialImageUris={initialImageUris} // For edit mode prefill
                maxImages={4} // Example limit
             />

            <StyledInput
                name="itemName"
                label="Item Name"
                control={control}
                placeholder="e.g., Slightly Chewed Cog"
                rules={{ required: 'Item name is required' }}
                isRequired
            />

            <StyledTextarea
                name="description"
                label="Description"
                control={control}
                placeholder="Describe your treasure..."
                maxLength={50}
                rules={{
                    required: 'Description is required',
                    maxLength: { value: 50, message: 'Max 50 characters' }
                }}
                isRequired
                inputProps={{ numberOfLines: 4 }}
            />

            <StyledMultiSelect
                name="tags"
                label="Item Tags / Categories"
                control={control}
                options={MOCK_CATEGORIES} // Replace with actual categories
                placeholder="Select item tags..."
                rules={{ required: 'Select at least one item tag' }}
                isRequired
            />

            <StyledMultiSelect
                name="wantsTags"
                label="Looking For (Tags)"
                control={control}
                options={MOCK_CATEGORIES} // Replace with actual categories
                placeholder="Select desired tags..."
                // Optional field, no rules needed unless specified
            />
        </VStack>
    );
};

export default ListingFormFields;