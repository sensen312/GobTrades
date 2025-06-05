// src/features/auth/screens/SetupScreen.tsx
import React from 'react';
import { Box, Heading, VStack, HStack, Input, InputField, ScrollView } from '@gluestack-ui/themed';
import type { ComponentProps } from 'react';
import { useUserSetup } from '../hooks/useUserSetup';
import ScreenContainer from '../../../components/ScreenContainer';
import PrimaryButton from '../../../components/PrimaryButton';
import IconButton from '../../../components/IconButton';
import ThemedText from '../../../components/ThemedText';
import PfpSelector from '../components/PfpSelector';
import ErrorDisplay from '../../../components/ErrorDisplay';
import KeyboardAvoidingViewWrapper from '../../../components/KeyboardAvoidingViewWrapper';

const SetupScreen: React.FC = () => {
    const {
        goblinName,
        setGoblinName,
        selectedPfpId,
        isLoading,
        error,
        regenerateName,
        handleSelectPfp,
        handleConfirmSetup,
    } = useUserSetup();

    return (
        <ScreenContainer justifyContent="space-between" scrollable={false} p="$0">
          <KeyboardAvoidingViewWrapper>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
              <VStack space="lg" flex={1} pt="$8" px="$4">
                  <Heading textAlign="center" size="2xl" fontFamily="$heading">Goblin Setup</Heading>
                  <ThemedText textAlign="center" size="lg" fontFamily="$body" mt="$2">
                      Welcome Goblin Trader!
                  </ThemedText>
                  <ThemedText textAlign="center" size="md" fontFamily="$body" color="$textSecondary" mb="$4">
                      Every trader needs a name and a face for the market.
                  </ThemedText>
                  <Box alignItems="center" my="$4">
                      <ThemedText size="md" color="$textSecondary" mb="$1">Your Goblin Name:</ThemedText>
                      <HStack alignItems="center" space="sm" mt="$1">
                          <Input variant="outline" size="lg" w="70%">
                              <InputField
                                  fontFamily="$heading"
                                  fontSize="$xl"
                                  color="$goblinGreen800"
                                  value={goblinName}
                                  onChangeText={setGoblinName}
                                  placeholder="Enter Goblin Name"
                                  textAlign="center"
                                  maxLength={25}
                              />
                          </Input>
                          <IconButton
                              iconName="dice-5-outline"
                              iconSize="xl" // Corrected: Gluestack Icon size prop
                              iconColor="$goblinGold600"
                              onPress={regenerateName}
                              aria-label="Regenerate name"
                              disabled={isLoading}
                              // sx prop is valid for Gluestack Pressable (which IconButton now wraps)
                              sx={{ p: "$2.5", bg: "$goblinGold100", borderRadius: "$full" }}
                          />
                      </HStack>
                  </Box>
                  <ThemedText textAlign="center" size="md" color="$textSecondary" mb="$1">Choose Your Guise:</ThemedText>
                  <PfpSelector selectedPfpId={selectedPfpId} onSelectPfp={handleSelectPfp} />
                  {error && <ErrorDisplay message={error} title="Setup Snag!" />}
              </VStack>
              <Box pb="$6" px="$4" marginTop="auto"> {/* Corrected: Changed mt to marginTop */}
                  <PrimaryButton
                      title="Next: Manage Your Inventory!"
                      onPress={handleConfirmSetup}
                      isLoading={isLoading}
                      disabled={!selectedPfpId || !goblinName.trim() || isLoading}
                      size="lg"
                      testID="confirm-setup-button"
                  />
              </Box>
            </ScrollView>
          </KeyboardAvoidingViewWrapper>
        </ScreenContainer>
    );
};
export default SetupScreen;
