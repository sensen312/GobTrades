// src/features/auth/hooks/useUserSetup.ts
import { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { showErrorToast, showSuccessToast } from '../../../utils/toast';
import type { AuthStackParamList } from '../../../navigation/types';

const generateGoblinName = (): string => {
    const adjectives = ["Warty", "Sneaky", "Grumpy", "Shiny", "Clever", "Rusty", "Mossy", "Grizzled", "Crafty", "Shifty", "Glum", "Zany"];
    const nouns = ["Snout", "Grog", "Fumble", "Cog", "Nugget", "Gloom", "Spark", "Knuckle", "Shank", "Glint", "Wort", "Pocket"];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${adj} ${noun}`;
};

type UserSetupNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Setup'>;

export const useUserSetup = () => {
    const { initializeProfile, isLoading, error, resetAuthStatus } = useAuthStore();
    const navigation = useNavigation<UserSetupNavigationProp>();

    const [goblinName, setGoblinName] = useState<string>(generateGoblinName());
    const [selectedPfpId, setSelectedPfpId] = useState<string | null>(null);

    const regenerateName = useCallback(() => setGoblinName(generateGoblinName()), []);
    const handleSelectPfp = useCallback((pfpId: string) => setSelectedPfpId(pfpId), []);

    const handleConfirmSetup = useCallback(async () => {
        if (!selectedPfpId) {
            showErrorToast("Please select a profile picture!", "Missing PFP");
            return;
        }
        if (!goblinName.trim()) {
            showErrorToast("Please enter a goblin name!", "Missing Name");
            return;
        }

        const success = await initializeProfile(goblinName.trim(), selectedPfpId);

        if (success) {
            showSuccessToast('Goblin identity chosen! Now set up your stall.', 'Identity Set!');
            navigation.navigate('MyStallSetup', { isFirstSetup: true });
        }
    }, [goblinName, selectedPfpId, initializeProfile, navigation]);

    return {
        goblinName, setGoblinName, selectedPfpId, isLoading, error,
        regenerateName, handleSelectPfp, handleConfirmSetup, resetAuthStatus
    };
};
