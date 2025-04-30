import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@gluestack-ui/themed';
import { ListingsStackParamList } from './types';

// Import Screens
import ListingsFeedScreen from '../features/listings/screens/ListingsFeedScreen';
import ListingDetailScreen from '../features/listings/screens/ListingDetailScreen';
import EditListingScreen from '../features/listings/screens/EditListingScreen';
import MyListingsScreen from '../features/listings/screens/MyListingsScreen'; // Import if used here
import LikedListingsScreen from '../features/listings/screens/LikedListingsScreen'; // Import if used here

const Stack = createNativeStackNavigator<ListingsStackParamList>();

/** Stack navigator for screens related to browsing and managing listings. */
const ListingsStack = () => {
    const { colors, fonts } = useTheme(); // Access theme tokens

    return (
        <Stack.Navigator
            initialRouteName="ListingsFeed"
            screenOptions={{
                // Common header styles for this stack
                headerStyle: { backgroundColor: colors.backgroundCard },
                headerTintColor: colors.textPrimary,
                headerTitleStyle: { fontFamily: fonts.heading },
                headerBackVisible: true, // Show back arrow
                headerTitleAlign: 'center',
            }}
        >
            <Stack.Screen
                name="ListingsFeed"
                component={ListingsFeedScreen}
                options={{ title: 'Open Trades' }} // Set screen-specific title
            />
            {/* Add MyListings and LikedListings if they are separate screens in this stack */}
            {/* <Stack.Screen name="MyListings" component={MyListingsScreen} options={{ title: 'My Treasures' }} /> */}
            {/* <Stack.Screen name="LikedListings" component={LikedListingsScreen} options={{ title: 'Liked Items' }} /> */}
            <Stack.Screen
                name="ListingDetail"
                component={ListingDetailScreen}
                options={{ title: 'Item Details' }}
            />
            <Stack.Screen
                name="EditListing"
                component={EditListingScreen}
                options={{ title: 'Edit Your Listing' }}
            />
        </Stack.Navigator>
    );
};

export default ListingsStack;