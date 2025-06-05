// src/features/auth/components/PfpGridItem.tsx
import React from 'react';
import { Pressable } from 'react-native';
import { Box } from '@gluestack-ui/themed';
import UserPfpDisplay from '../../../components/UserPfpDisplay';
import type { ComponentProps } from 'react';

// Gluestack UI Prop Typing
type BoxPropsPfpGrid = ComponentProps<typeof Box>;

interface PfpGridItemProps {
    pfpId: string;
    isSelected: boolean;
    onSelect: (pfpId: string) => void;
    size?: ComponentProps<typeof UserPfpDisplay>['size'];
}

const PfpGridItem: React.FC<PfpGridItemProps> = ({ pfpId, isSelected, onSelect, size = 'lg' }) => {
    // Reasoning: Renders an individual PFP option. Highlights selection visually.
    return (
        <Pressable onPress={() => onSelect(pfpId)} accessibilityRole="button" accessibilityState={{ selected: isSelected }}>
            <Box
                p="$1"
                borderWidth={3}
                borderColor={isSelected ? '$goblinGreen500' : 'transparent'} // Use theme color for selection
                borderRadius="$full"
                m="$1.5"
                testID={`pfp-item-${pfpId}`}
            >
                <UserPfpDisplay pfpIdentifier={pfpId} size={size} />
            </Box>
        </Pressable>
    );
};
export default PfpGridItem;
