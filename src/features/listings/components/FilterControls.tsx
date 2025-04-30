import React from 'react';
import { VStack, FormControl, FormControlLabel, Select, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicatorWrapper, SelectDragIndicator, SelectItem, ChevronDownIcon } from '@gluestack-ui/themed';
import StyledMultiSelect from '../../../components/StyledMultiSelect';
import ThemedText from '../../../components/ThemedText';
import { FilterParams } from '../store/listingsStore';

const MOCK_TAG_OPTIONS = [
    // No "Any" option needed for multi-select values
    { label: 'Shiny Trinkets', value: 'trinkets' }, { label: 'Mystic Herbs', value: 'herbs' },
    { label: 'Enchanted Gear', value: 'gear' }, { label: 'Dubious Potions', value: 'potions' },
    { label: 'Oddities', value: 'oddities' }, { label: 'Goblin Crafts', value: 'crafts' },
    { label: 'Stolen Goods', value: 'stolen' },
];

const SORT_OPTIONS = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
];

interface FilterControlsProps {
    currentFilters: FilterParams;
    onFilterChange: (newFilters: Partial<FilterParams>) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({ currentFilters, onFilterChange }) => {

    const handleSortChange = (value: string) => {
        onFilterChange({ sortBy: value as 'newest' | 'oldest' });
    };

    // Pass correct props (value/onChange) to standalone StyledMultiSelect
    const handleCategoriesChange = (values: string[]) => {
        onFilterChange({ categories: values.length > 0 ? values : undefined });
    };

    const handleWantsChange = (values: string[]) => {
        onFilterChange({ wantsCategories: values.length > 0 ? values : undefined });
    };

    return (
        <VStack space="lg">
            {/* Sort By */}
            <FormControl>
                <FormControlLabel mb="$1"><ThemedText>Sort By</ThemedText></FormControlLabel>
                <Select selectedValue={currentFilters.sortBy || 'newest'} onValueChange={handleSortChange}>
                    <SelectTrigger variant="outline" size="md"><SelectInput placeholder="Select sort order..." /><SelectIcon as={ChevronDownIcon} mr="$3" /></SelectTrigger>
                    <SelectPortal><SelectBackdrop /><SelectContent><SelectDragIndicatorWrapper><SelectDragIndicator /></SelectDragIndicatorWrapper>
                        {SORT_OPTIONS.map((option) => (<SelectItem key={option.value} label={option.label} value={option.value} />))}
                    </SelectContent></SelectPortal>
                </Select>
            </FormControl>

            {/* Filter by Item Category - Pass value and onChange */}
             <StyledMultiSelect
                name="filterCategories" // Name is still useful for keys/labels
                label="Item Categories"
                options={MOCK_TAG_OPTIONS}
                value={currentFilters.categories || []} // Pass value prop
                onChange={handleCategoriesChange} // Pass onChange prop
                placeholder="Filter by item tags..."
            />

            {/* Filter by Wants Category - Pass value and onChange */}
            <StyledMultiSelect
                name="filterWantsCategories"
                label="Looking For Categories"
                options={MOCK_TAG_OPTIONS}
                value={currentFilters.wantsCategories || []} // Pass value prop
                onChange={handleWantsChange} // Pass onChange prop
                placeholder="Filter by desired tags..."
            />
        </VStack>
    );
};

export default FilterControls;
