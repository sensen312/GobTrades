import React from 'react';
import { Box, Heading, VStack, ScrollView, Divider, Pressable } from '@gluestack-ui/themed';
import { Linking, Alert } from 'react-native';
import ThemedText from '../../../components/ThemedText';
import { useAuthStore } from '../../auth/store/authStore';
import { AppScreenProps } from '../../../navigation/types'; // Use App Screen props
import UserPfpDisplay from '../../../components/UserPfpDisplay'; // Import PFP display
import PrimaryButton from '../../../components/PrimaryButton'; // For Logout/Clear

type Props = AppScreenProps<'Settings'>; // Type for Settings screen within AppStack

const SettingsScreen: React.FC<Props> = ({ navigation }) => { // Receive navigation prop
    const { goblinName, pfpId, clearProfile, uuid } = useAuthStore();

    const openAppSettings = () => {
        Linking.openSettings();
    };

    const handleClearProfile = () => {
        Alert.alert(
            "Clear Profile?",
            "This will log you out and you'll need to set up a new goblin persona. Are you sure?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Clear Profile", style: "destructive", onPress: async () => {
                    await clearProfile();
                    // Navigate back to Auth flow after clearing
                    // Note: AppNavigator logic should handle this automatically
                    // when isAuthenticated becomes false, but explicit navigation
                    // can be added if needed.
                    // navigation.replace('Auth', { screen: 'AuthLoading' });
                }}
            ]
        );
    };

    const faqItems = [
        { q: "What is GobTrades?", a: "A temporary marketplace for trading treasures during the Goblin Market event." },
        { q: "How long is the market open?", a: "The market is typically open for 8 hours during specific event dates. Check the timer!" },
        { q: "How do messages work?", a: "You can message a trader directly from their listing to discuss a trade." },
        { q: "Is this anonymous?", a: "Mostly! You use a generated goblin name and profile picture. Your unique device ID (UUID) is used internally but not shown to others." },
        { q: "How do I edit/delete my listing?", a: "Go to the 'Trades' tab, find your listing (it might have a 'My Listing' badge), tap it, and use the edit/delete buttons on the detail screen." },
    ];

    return (
        <ScrollView>
            <VStack p="$4" space="lg">
                {/* Profile Section */}
                <Box alignItems="center">
                    <UserPfpDisplay pfpIdentifier={pfpId} userName={goblinName || undefined} size="xl" />
                    <Heading mt="$2">{goblinName || 'Goblin Trader'}</Heading>
                    <ThemedText size="xs" color="$textSecondary">UUID: {uuid?.substring(0, 8)}...</ThemedText>
                </Box>

                <Divider />

                {/* Permissions Section */}
                <Heading size="md">Permissions</Heading>
                <Pressable onPress={openAppSettings} accessibilityRole="button">
                    <ThemedText color="$primary500">Manage Camera & Photo Permissions</ThemedText>
                </Pressable>

                <Divider />

                {/* FAQ Section */}
                <Heading size="md">FAQ</Heading>
                {faqItems.map((item, index) => (
                    <Box key={index} mb="$3">
                        <ThemedText bold>{item.q}</ThemedText>
                        <ThemedText>{item.a}</ThemedText>
                    </Box>
                ))}

                 <Divider />

                 {/* Logout/Clear Profile */}
                 <PrimaryButton
                    title="Clear Profile & Logout"
                    onPress={handleClearProfile}
                    action="negative" // Use themed 'negative' style if defined
                    mt="$4"
                 />

            </VStack>
        </ScrollView>
    );
};

export default SettingsScreen;