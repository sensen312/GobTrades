// src/features/settings/screens/SettingsScreen.tsx
import React from 'react';
import { Box, Heading, VStack, ScrollView, Divider, Pressable } from '@gluestack-ui/themed';
import { Linking, Alert } from 'react-native';
import ScreenContainer from '../../../components/ScreenContainer';
import ThemedText from '../../../components/ThemedText';
import UserPfpDisplay from '../../../components/UserPfpDisplay';
import PrimaryButton from '../../../components/PrimaryButton';
import { useAuthStore } from '../../auth/store/authStore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../navigation/types';

type PropsSettings = NativeStackScreenProps<AppStackParamList, 'Settings'>;

const SettingsScreen: React.FC<PropsSettings> = ({ navigation }) => {
    const { goblinName, pfpIdentifier, clearProfileAndData, uuid, isLoading: authIsLoading } = useAuthStore();

    const openAppSettings = () => {
        Linking.openSettings().catch(err => console.warn("Failed to open settings:", err));
    };

    const handleClearProfile = () => {
        Alert.alert(
            "Retire Goblin?",
            "This will permanently delete your stall, goblin identity, and all associated data from this device. Are you sure, brave trader?",
            [
                { text: "Nevermind", style: "cancel" },
                {
                    text: "Retire & Empty Stall",
                    style: "destructive",
                    onPress: async () => {
                        await clearProfileAndData();
                    }
                }
            ]
        );
    };

    const faqItems = [
        { q: "What is GobTrades?", a: "A temporary marketplace for trading treasures during the Goblin Market event." },
        { q: "How long is the market open?", a: "The market is typically open for 8 hours during specific event dates. Check the timer in the header!" },
        { q: "How do messages work?", a: "Full messaging to discuss trades will be available in a future update." },
        { q: "Is this anonymous?", a: "Mostly! You use a generated goblin name and profile picture. Your unique device ID (UUID) is used internally but not shown to others." },
    ];

    return (
        <ScreenContainer scrollable={true}>
            <VStack p="$4" space="lg" pb="$20">
                <Box alignItems="center" testID="settings-profile-section">
                    <UserPfpDisplay pfpIdentifier={pfpIdentifier} userName={goblinName || undefined} size="xl" />
                    <Heading mt="$2" size="xl">{goblinName || 'A Mysterious Goblin'}</Heading>
                    {uuid && <ThemedText size="xs" color="$textSecondary" selectable={true}>Trader ID: {uuid}</ThemedText>}
                </Box>

                <Divider />

                <Heading size="md">App Permissions</Heading>
                <Pressable onPress={openAppSettings} accessibilityRole="button">
                    <ThemedText color="$primary500">Manage Camera & Photo Permissions</ThemedText>
                </Pressable>
                <ThemedText size='xs' color='$textSecondary'>Used for adding images to your stall.</ThemedText>

                <Divider />

                <Heading size="md">FAQ - Goblin Market Guide</Heading>
                {faqItems.map((item, index) => (
                    <Box key={index} mb="$3">
                        <ThemedText bold>{item.q}</ThemedText>
                        <ThemedText size='sm'>{item.a}</ThemedText>
                    </Box>
                ))}

                <Divider />

                <PrimaryButton
                    title="Retire Goblin & Empty Stall"
                    onPress={handleClearProfile}
                    action="negative"
                    mt="$4"
                    isLoading={authIsLoading}
                    disabled={authIsLoading}
                />
                <ThemedText size="xs" color="$textSecondary" textAlign="center" mt="$2">
                    This action is permanent and cannot be undone.
                </ThemedText>
            </VStack>
        </ScreenContainer>
    );
};
export default SettingsScreen;
