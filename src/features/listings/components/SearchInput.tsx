import React from 'react';
import { Input, InputField, InputIcon, InputSlot, SearchIcon } from '@gluestack-ui/themed';

interface SearchInputProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    // Add other Input props if needed (e.g., onBlur, onSubmitEditing)
}

const SearchInput: React.FC<SearchInputProps> = ({
    value,
    onChangeText,
    placeholder = "Search wares...",
    ...props
}) => {
    return (
        <Input variant="rounded" size="md" bg="$inputBackground" borderWidth={1} borderColor="$inputBorder" flex={1}>
             <InputSlot pl="$3">
                <InputIcon as={SearchIcon} color="$iconColorMuted" />
             </InputSlot>
            <InputField
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                returnKeyType="search"
                clearButtonMode="while-editing" // Show clear button on iOS
                color="$textPrimary"
                placeholderTextColor="$inputPlaceholder"
                {...props}
            />
             {/* Add clear button manually for Android if needed */}
        </Input>
    );
};

export default SearchInput;
