import { useState, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { showErrorToast, showSuccessToast } from '../../../utils/toast'; // Import toast utils

// Placeholder for potential name generation logic
const generateGoblinName = (): string => {
    const adjectives = ["Warty", "Sneaky", "Grumpy", "Shiny", "Clever", "Rusty", "Mossy"];
    const nouns = ["Snout", "Grog", "Fumble", "Cog", "Nugget", "Gloom", "Spark"];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${adj} ${noun}`;
};

export const useUserSetup = () => {
    const { setProfile, isLoading, error, resetStatus } = useAuthStore();
    const [goblinName, setGoblinName] = useState<string>(generateGoblinName());
    const [selectedPfpId, setSelectedPfpId] = useState<string | null>(null);

    // Regenerate a new goblin name
    const regenerateName = useCallback(() => {
        setGoblinName(generateGoblinName());
    }, []);

    // Handle selection of a profile picture identifier
    const handleSelectPfp = useCallback((pfpId: string) => {
        setSelectedPfpId(pfpId);
    }, []);

    // Attempt to finalize the profile setup
    const handleConfirmSetup = useCallback(async () => {
        if (!selectedPfpId) {
            showErrorToast("Please select a profile picture!", "Missing PFP");
            return;
        }
        if (!goblinName.trim()) {
            showErrorToast("Please generate or enter a name!", "Missing Name");
            return;
        }

        // Call the store action to set the profile (which includes API call)
        const success = await setProfile(goblinName, selectedPfpId);

        if (success) {
            showSuccessToast("Profile created! Welcome, trader!", "Setup Complete");
            // Navigation to 'Main' stack happens automatically via AuthLoadingScreen's effect
        } else {
            // Error toast is likely shown by the store/API interceptor, but can add a fallback
            showErrorToast(error || "Something went wrong during setup.", "Setup Failed");
        }
    }, [goblinName, selectedPfpId, setProfile, error]);

    return {
        goblinName,
        selectedPfpId,
        isLoading, // Loading state from the store
        error, // Error state from the store
        regenerateName,
        handleSelectPfp,
        handleConfirmSetup,
        resetStatus, // Allow resetting error/loading in the component if needed
    };
};
