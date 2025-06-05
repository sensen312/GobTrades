// src/features/auth/hooks/useUserSetup.ts
import { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // Import for stronger typing
import { useAuthStore as useAuthStoreUserSetup } from '../store/authStore';
import { showErrorToast as showErrorToastUserSetup } from '../../../utils/toast';
import type { AppStackParamList, MainTabsParamList } from '../../../navigation/types'; // Import necessary param lists

// Generates a random goblin name.
// Reasoning: Provides a default, thematic name for new users, enhancing onboarding.
const generateGoblinNameHook = (): string => {
    const adjectives = ["Warty", "Sneaky", "Grumpy", "Shiny", "Clever", "Rusty", "Mossy", "Grizzled", "Cunning", "Jolly", "Grimy", "Crafty"];
    const nouns = ["Snout", "Grog", "Fumble", "Cog", "Nugget", "Gloom", "Spark", "Toes", "Wort", "Stench", "Fink", "Claw"];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${adj} ${noun}`;
};

// Type for navigation prop to navigate between stacks
type UserSetupNavigationProp = NativeStackNavigationProp<AppStackParamList, 'Auth'>;


export const useUserSetup = () => {
    const { initializeProfile, isLoading: authIsLoading, error: authError, resetAuthStatus } = useAuthStoreUserSetup();
    // Use the more specific navigation type
    const navigation = useNavigation<UserSetupNavigationProp>();

    const [goblinName, setGoblinName] = useState<string>(generateGoblinNameHook());
    const [selectedPfpId, setSelectedPfpId] = useState<string | null>(null);

    const regenerateName = useCallback(() => {
        setGoblinName(generateGoblinNameHook());
    }, []);

    const handleSelectPfp = useCallback((pfpId: string) => {
        setSelectedPfpId(pfpId);
    }, []);

    /**
     * Handles the confirmation of the user setup.
     * Validates inputs, calls authStore.initializeProfile, and navigates to MyStallScreen.
     * Reasoning: Core logic for completing the initial user setup flow.
     */
    const handleConfirmSetup = useCallback(async () => {
        if (!selectedPfpId) {
            showErrorToastUserSetup("Please select a profile picture!", "Missing PFP");
            return;
        }
        if (!goblinName.trim()) {
            showErrorToastUserSetup("Please enter a goblin name!", "Missing Name");
            return;
        }

        const generatedUuid = await initializeProfile(goblinName.trim(), selectedPfpId);

        if (generatedUuid) {
            // Navigate to MyStallScreen for initial stall setup, passing a flag.
            // This replaces the Auth stack with the Main stack, landing on the AddItem tab (MyStallScreen).
            console.log('UserSetup: Navigating to MyStallScreen for first setup.');
            // Correctly type the params for MainTabsParamList
            navigation.replace('Main', {
              screen: 'AddItem', // This is the MainTabsParamList key for MyStallScreen
              params: { isFirstSetup: true } as MainTabsParamList['AddItem'], // Type assertion for params
            });
        }
        // Error toast is handled by initializeProfile action in authStore.
    }, [goblinName, selectedPfpId, initializeProfile, navigation]);

    return {
        goblinName,
        setGoblinName, // Expose setter if direct input is allowed by UI
        selectedPfpId,
        isLoading: authIsLoading,
        error: authError,
        regenerateName,
        handleSelectPfp,
        handleConfirmSetup,
        resetAuthStatus,
    };
};
