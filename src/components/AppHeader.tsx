import React from 'react';
 import { Box, HStack, Heading } from '@gluestack-ui/themed';
 import { useNavigation } from '@react-navigation/native';
 import { useSafeAreaInsets } from 'react-native-safe-area-context';
 import IconButton from './IconButton';
 import ThemedText from './ThemedText';
 import UserPfpDisplay from './UserPfpDisplay';
 import { useAuthStore } from '../features/auth/store/authStore';
 import { useMarketTimer } from '../hooks/useMarketTimer';
 import { AppScreenProps } from '../navigation/types'; // Ensure this path is correct

 /** Custom header component for the main app screens. (Stories 75, 76, 77) */
 const AppHeader = () => {
     const insets = useSafeAreaInsets();
     // Ensure 'Main' is the correct key for the navigator containing 'Settings'
     const navigation = useNavigation<AppScreenProps<'Main'>['navigation']>();
     const { pfpId, goblinName } = useAuthStore();
     const { timeLeft, isMarketOpen, isMarketClosedPermanently } = useMarketTimer(); // Use isMarketClosedPermanently if needed

     const goToSettings = () => {
         // Navigate to the root Settings screen
         navigation.navigate('Settings');
     };

     return (
         <Box
             bg="$backgroundCard" // Use theme token
             // Apply safe area padding dynamically using style prop
             style={{ paddingTop: insets.top }}
             borderBottomWidth={1}
             borderColor="$borderLight" // Use theme token
         >
             <HStack px="$4" py="$2" alignItems="center" justifyContent="space-between">
                 {/* Left Side: User PFP */}
                 <UserPfpDisplay
                     pfpIdentifier={pfpId}
                     userName={goblinName || undefined}
                     size="sm"
                 />

                 {/* Center: Timer */}
                 <Box alignItems="center">
                     <ThemedText size="xs" color="$textSecondary">Market Closes In:</ThemedText>
                     {/* Display CLOSED state based on timer logic */}
                     <Heading size="sm" color={!isMarketOpen ? "$errorBase" : "$textPrimary"}>
                         {!isMarketOpen ? "CLOSED" : timeLeft}
                     </Heading>
                 </Box>

                 {/* Right Side: Settings Button */}
                 <IconButton
                     iconName="cog-outline" // Example icon
                     iconColor="$iconColor" // Use theme token
                     onPress={goToSettings}
                     aria-label="Settings"
                 />
             </HStack>
         </Box>
     );
 };

 export default AppHeader;
