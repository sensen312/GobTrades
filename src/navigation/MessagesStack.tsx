import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@gluestack-ui/themed';
import { MessagesStackParamList } from './types';

// Import Screens
import MessagingListScreen from '../features/messaging/screens/MessagingListScreen';
import ChatScreen from '../features/messaging/screens/ChatScreen';
// Import ListingDetailScreen if navigating to it from chat context preview
import ListingDetailScreen from '../features/listings/screens/ListingDetailScreen';

const Stack = createNativeStackNavigator<MessagesStackParamList>();

/** Stack navigator for screens related to messaging. */
const MessagesStack = () => {
    const { colors, fonts } = useTheme(); // Access theme tokens

    return (
        <Stack.Navigator
            initialRouteName="MessagingList"
            screenOptions={{
                // Common header styles for this stack
                headerStyle: { backgroundColor: colors.backgroundCard },
                headerTintColor: colors.textPrimary,
                headerTitleStyle: { fontFamily: fonts.heading },
                headerBackVisible: true,
                headerTitleAlign: 'center',
            }}
        >
            <Stack.Screen
                name="MessagingList"
                component={MessagingListScreen}
                options={{ title: 'Your Chats' }}
            />
            <Stack.Screen
                name="Chat"
                component={ChatScreen}
                // Set title dynamically based on the other participant's name passed in params
                options={({ route }) => ({ title: route.params?.otherUserName || 'Chat' })}
            />
            {/* Add ListingDetailScreen if needed for context navigation */}
            <Stack.Screen
                name="ListingDetail" // Ensure this name matches the one in MessagesStackParamList
                component={ListingDetailScreen}
                options={{ title: 'Item Details' }}
            />
        </Stack.Navigator>
    );
};

export default MessagesStack;
