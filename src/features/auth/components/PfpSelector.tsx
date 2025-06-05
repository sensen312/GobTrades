// src/features/auth/components/PfpSelector.tsx
import React from 'react';
import { FlatList } from 'react-native';
import { Box } from '@gluestack-ui/themed';
import PfpGridItem from './PfpGridItem';
import type { ComponentProps } from 'react';

// Gluestack UI Prop Typing
type BoxPropsPfpSelector = ComponentProps<typeof Box>;

// These identifiers MUST match the keys in PFP_MAP_DISPLAY in UserPfpDisplay.tsx
const AVAILABLE_PFP_IDS_SELECTOR = [
    'goblin1', 'goblin2', 'goblin3', 'goblin4',
    'goblin5', 'goblin6', 'goblin7', 'goblin8',
];

interface PfpSelectorProps {
    selectedPfpId: string | null;
    onSelectPfp: (pfpId: string) => void;
}

const PfpSelector: React.FC<PfpSelectorProps> = ({ selectedPfpId, onSelectPfp }) => {
    // Reasoning: Provides a visual grid for PFP selection during user setup.
    return (
        <Box my="$4" alignItems="center" testID="pfp-selector-container">
            <FlatList
                data={AVAILABLE_PFP_IDS_SELECTOR}
                renderItem={({ item }) => (
                    <PfpGridItem
                        pfpId={item}
                        isSelected={selectedPfpId === item}
                        onSelect={onSelectPfp}
                        size="lg"
                    />
                )}
                keyExtractor={(item) => item}
                numColumns={4} // Layout in 2 rows of 4
                contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
                scrollEnabled={false} // All 8 should fit without scrolling
            />
        </Box>
    );
};
export default PfpSelector;
