import React from 'react';
import { FlatList } from 'react-native';
import { Box } from '@gluestack-ui/themed';
import PfpGridItem from './PfpGridItem';

// --- IMPORTANT: Define your available PFP identifiers here ---
// These should match the keys in the PFP_MAP in UserPfpDisplay.tsx
const AVAILABLE_PFP_IDS = [
    'goblin1', 'goblin2', 'goblin3', 'goblin4',
    'goblin5', 'goblin6', 'goblin7', 'goblin8',
    // Add more identifiers as needed
];
// --- END PFP Identifiers ---

interface PfpSelectorProps {
    selectedPfpId: string | null;
    onSelectPfp: (pfpId: string) => void;
}

const PfpSelector: React.FC<PfpSelectorProps> = ({ selectedPfpId, onSelectPfp }) => {
    return (
        <Box my="$4" alignItems="center">
            <FlatList
                data={AVAILABLE_PFP_IDS}
                renderItem={({ item }) => (
                    <PfpGridItem
                        pfpId={item}
                        isSelected={selectedPfpId === item}
                        onSelect={onSelectPfp}
                        size="lg" // Adjust size as needed
                    />
                )}
                keyExtractor={(item) => item}
                numColumns={4} // Adjust number of columns for layout
                contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
                scrollEnabled={false} // Disable scroll if all fit on screen
            />
        </Box>
    );
};

export default PfpSelector;
