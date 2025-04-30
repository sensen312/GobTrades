import React from 'react';
import { Box, Heading, VStack, HStack } from '@gluestack-ui/themed';
import { useUserSetup } from '../hooks/useUserSetup';
import ScreenContainer from '../../../components/ScreenContainer';
import PrimaryButton from '../../../components/PrimaryButton';
import IconButton from '../../../components/IconButton';
import ThemedText from '../../../components/ThemedText';
import PfpSelector from '../components/PfpSelector';
import ErrorDisplay from '../../../components/ErrorDisplay'; // To show setup errors

const SetupScreen = () => {
    const {
        goblinName,
        selectedPfpId,
        isLoading,
        error,
        regenerateName,
        handleSelectPfp,
        handleConfirmSetup,
    } = useUserSetup();

    return (
        // Use ScreenContainer for safe area and background
        <ScreenContainer justifyContent="space-between">
            <VStack space="lg" flex={1} pt="$8">
                <Heading textAlign="center" size="2xl">Choose Your Goblin Guise!</Heading>
                <ThemedText textAlign="center" size="lg">
                    Every trader needs a name and a face for the market.
                </ThemedText>

                {/* Name Display and Regeneration */}
                <Box alignItems="center" my="$4">
                    <ThemedText size="sm" color="$textSecondary">Your Goblin Name:</ThemedText>
                    <HStack alignItems="center" space="md" mt="$1">
                        <Heading size="xl" color="$goblinGreen800">{goblinName}</Heading>
                        <IconButton
                            iconName="dice-5-outline" // Example icon
                            iconSize={28}
                            iconColor="$primary500"
                            onPress={regenerateName}
                            aria-label="Regenerate name"
                            disabled={isLoading}
                        />
                    </HStack>
                </Box>

                {/* Profile Picture Selection */}
                <ThemedText textAlign="center" size="sm" color="$textSecondary" mb="$1">Select Your Profile Picture:</ThemedText>
                <PfpSelector selectedPfpId={selectedPfpId} onSelectPfp={handleSelectPfp} />

                {/* Display errors from the setup hook/store */}
                <ErrorDisplay message={error} />

            </VStack>

            {/* Confirmation Button */}
            <Box pb="$4">
                <PrimaryButton
                    title="Enter the Market!"
                    onPress={handleConfirmSetup}
                    isLoading={isLoading}
                    disabled={!selectedPfpId || isLoading} // Disable if no PFP selected
                    size="lg"
                />
            </Box>
        </ScreenContainer>
    );
};

export default SetupScreen;
