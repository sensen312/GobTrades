import React from 'react';
import { Pressable } from 'react-native';
import { Box } from '@gluestack-ui/themed';
import UserPfpDisplay from '../../../components/UserPfpDisplay'; // Use the PFP display component

interface PfpGridItemProps {
    pfpId: string;
    isSelected: boolean;
    onSelect: (pfpId: string) => void;
    size?: 'sm' | 'md' | 'lg' | 'xl'; // Allow size customization
}

const PfpGridItem: React.FC<PfpGridItemProps> = ({ pfpId, isSelected, onSelect, size = 'lg' }) => {
    return (
        <Pressable onPress={() => onSelect(pfpId)} accessibilityRole="button" accessibilityState={{ selected: isSelected }}>
            <Box
                p="$1" // Padding around the avatar
                borderWidth={3}
                // Use theme colors for selection indication
                borderColor={isSelected ? '$primary500' : 'transparent'}
                borderRadius="$full" // Keep the border circular
                m="$1.5" // Margin between items
            >
                <UserPfpDisplay pfpIdentifier={pfpId} size={size} />
            </Box>
        </Pressable>
    );
};

export default PfpGridItem;
