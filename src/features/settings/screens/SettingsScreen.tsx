// src/features/settings/screens/SettingsScreen.tsx
import React from 'react';
import { Box, Heading, VStack, ScrollView, Divider, Pressable } from '@gluestack-ui/themed';
// import type { ComponentProps } from 'react'; // Not needed if not spreading
import { Linking, Alert } from 'react-native';
import ThemedText from '../../../components/ThemedText';
import { useAuthStore as useAuthStoreSettings } from '../../auth/store/authStore';
import { AppScreenProps, AppStackParamList } from '../../../navigation/types'; // Ensure AppStackParamList is imported
import UserPfpDisplay from '../../../components/UserPfpDisplay';
import PrimaryButton from '../../../components/PrimaryButton';
import LoadingIndicator from '../../../components/LoadingIndicator'; // For Retire Goblin loading
import { NativeStackScreenProps } from '@react-navigation/native-stack'; // Import for specific screen props


type PropsSettings = NativeStackScreenProps<AppStackParamList, 'Settings'>; // Correct typing for Settings screen

const SettingsScreen: React.FC<PropsSettings> = ({ navigation }) => { // navigation is now correctly typed
    // Reasoning: Provides a basic settings interface for Phase 1.
    // Includes user info display, link to OS permissions, FAQ, and a "Retire Goblin"
    // (logout/clear local data & request backend deletion) function.
    const { goblinName, pfpIdentifier, clearAuthentication, uuid, isLoading: authIsLoading } = useAuthStoreSettings();

    const openAppSettings = () => {
        // Reasoning: Allows users to manage app-specific OS permissions.
        Linking.openSettings();
    };

    const handleClearProfile = () => {
        // Reasoning: Provides a way for users to reset their app data and start over.
        // Includes a confirmation dialog to prevent accidental data loss.
        Alert.alert(
            "Retire Goblin & Empty Stall?",
            "This will log you out, attempt to delete your data from the server, and clear local data. Are you sure? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Retire Goblin",
                    style: "destructive",
                    onPress: async () => {
                        await clearAuthentication(); // This now handles backend deletion attempt
                        // Navigation to Auth flow is handled by AppNavigator observing isAuthenticated state.
                        console.log("SettingsScreen: Profile clear and backend deletion requested. User should be navigated to Auth flow.");
                    }
                }
            ]
        );
    };

    // Reasoning: FAQ items provide helpful information to the user.
    const faqItems = [
        { q: "What is GobTrades?", a: "A temporary marketplace for trading treasures during the Goblin Market event." },
        { q: "How long is the market open?", a: "The market is typically open for 8 hours during specific event dates. Check the timer in the header!" },
        { q: "How do messages work?", a: "Full messaging to discuss trades will be available in a future update." },
        { q: "Is this anonymous?", a: "Mostly! You use a generated goblin name and profile picture. Your unique device ID (UUID) is used internally but not shown to others." },
    ];

    return (
        // ScreenContainer is not used here as SettingsScreen is a stack screen with its own header.
        // ScrollView ensures content is scrollable if it exceeds screen height.
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
            <VStack p="$4" space="lg">
                {/* Profile Section */}
                <Box alignItems="center" testID="settings-profile-section">
                    <UserPfpDisplay pfpIdentifier={pfpIdentifier} userName={goblinName || undefined} size="xl" />
                    <Heading mt="$2" fontFamily="$heading">{goblinName || 'Goblin Trader'}</Heading>
                    <ThemedText size="xs" color="$textSecondary" fontFamily="$body">
                        UUID: {uuid ? `${uuid.substring(0, 8)}...` : 'N/A'}
                    </ThemedText>
                </Box>

                <Divider my="$3" />

                {/* Permissions Section */}
                <Heading size="md" fontFamily="$heading">Permissions</Heading>
                <Pressable onPress={openAppSettings} accessibilityRole="button" testID="manage-permissions-link">
                    <ThemedText color="$textLink" fontFamily="$body" textDecorationLine="underline">
                        Manage Camera & Photo Permissions
                    </ThemedText>
                </Pressable>

                <Divider my="$3" />

                {/* FAQ Section */}
                <Heading size="md" fontFamily="$heading">FAQ</Heading>
                {faqItems.map((item, index) => (
                    <Box key={index} mb="$3">
                        <ThemedText bold fontFamily="$body">{item.q}</ThemedText>
                        <ThemedText fontFamily="$body">{item.a}</ThemedText>
                    </Box>
                ))}

                 <Divider my="$3" />

                 {/* Logout/Clear Profile */}
                 <PrimaryButton
                    title="Retire Goblin & Empty Stall"
                    onPress={handleClearProfile}
                    isLoading={authIsLoading} // Show loading state from authStore
                    disabled={authIsLoading}
                    action="negative" // Uses themed 'negative' style
                    mt="$4"
                    testID="retire-goblin-button"
                 />
            </VStack>
        </ScrollView>
    );
};
export default SettingsScreen;
