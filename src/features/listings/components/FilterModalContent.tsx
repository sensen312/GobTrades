import React, { useState, useCallback } from 'react';
import { Box, VStack, HStack, Button, ButtonText, Heading, ScrollView, CheckboxGroup, Checkbox, CheckboxIndicator, CheckboxIcon, CheckIcon, CheckboxLabel, RadioGroup, Radio, RadioIndicator, RadioIcon, CircleIcon, RadioLabel } from '@gluestack-ui/themed';
import { FilterParams } from '../../../types'; // Import FilterParams type
import { ITEM_CATEGORIES, WANTS_CATEGORIES } from '../../../constants/categories';
import PrimaryButton from '../../../components/PrimaryButton';
import SecondaryButton from '../../../components/SecondaryButton';
import ThemedText from '../../../components/ThemedText';

interface FilterModalContentProps {
  initialFilters: FilterParams;
  onApply: (filters: FilterParams) => void;
  onClose: () => void;
}

const FilterModalContent: React.FC<FilterModalContentProps> = ({ initialFilters, onApply, onClose }) => {
    const [localFilters, setLocalFilters] = useState<FilterParams>(initialFilters);

    const handleFilterChange = useCallback((key: keyof FilterParams, value: any) => {
        // Add explicit type for prevFilters parameter
        setLocalFilters((prevFilters: FilterParams) => ({
            ...prevFilters,
            [key]: value,
        }));
    }, []);

    const handleApply = () => {
        onApply(localFilters);
        onClose();
    };

    const handleClear = () => {
        const defaultFilters: FilterParams = { sortBy: 'newest' }; // Reset to default
        setLocalFilters(defaultFilters);
        onApply(defaultFilters); // Apply cleared filters immediately
        onClose();
    };

    return (
        <VStack space="lg" p="$4">
            <ScrollView>
                <VStack space="md">
                    <Heading size="sm">Item Categories</Heading>
                    <CheckboxGroup
                        value={localFilters.categories || []}
                        onChange={(values) => handleFilterChange('categories', values)}
                    >
                        {ITEM_CATEGORIES.map(cat => (
                            <Checkbox key={cat.value} value={cat.value} my="$1">
                                <CheckboxIndicator mr="$2"><CheckboxIcon as={CheckIcon} /></CheckboxIndicator>
                                <CheckboxLabel>{cat.label}</CheckboxLabel>
                            </Checkbox>
                        ))}
                    </CheckboxGroup>

                    <Heading size="sm">Trader Looking For</Heading>
                     <CheckboxGroup
                        value={localFilters.wantsCategories || []}
                        onChange={(values) => handleFilterChange('wantsCategories', values)}
                    >
                        {WANTS_CATEGORIES.map(cat => (
                            <Checkbox key={cat.value} value={cat.value} my="$1">
                                <CheckboxIndicator mr="$2"><CheckboxIcon as={CheckIcon} /></CheckboxIndicator>
                                <CheckboxLabel>{cat.label}</CheckboxLabel>
                            </Checkbox>
                        ))}
                    </CheckboxGroup>

                    <Heading size="sm">Sort By</Heading>
                    <RadioGroup
                        value={localFilters.sortBy || 'newest'}
                        onChange={(value) => handleFilterChange('sortBy', value as 'newest' | 'oldest')}
                    >
                        <Radio value="newest" my="$1">
                            <RadioIndicator mr="$2"><RadioIcon as={CircleIcon} /></RadioIndicator>
                            <RadioLabel>Newest First</RadioLabel>
                        </Radio>
                        <Radio value="oldest" my="$1">
                            <RadioIndicator mr="$2"><RadioIcon as={CircleIcon} /></RadioIndicator>
                            <RadioLabel>Oldest First</RadioLabel>
                        </Radio>
                    </RadioGroup>
                </VStack>
            </ScrollView>

            <HStack justifyContent="space-between" mt="$4">
                <SecondaryButton title="Clear Filters" onPress={handleClear} />
                <PrimaryButton title="Apply Filters" onPress={handleApply} />
            </HStack>
        </VStack>
    );
};
export default FilterModalContent;
