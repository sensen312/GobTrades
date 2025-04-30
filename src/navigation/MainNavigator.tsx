import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme, Box } from '@gluestack-ui/themed'; // Import Box for badge container
import { useChatStore } from '../features/messaging/store/chatStore'; // Import chat store for badge

import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useToken } from '@gluestack-ui/themed'; // Import useToken
import { HomeIcon, PlusCircleIcon, MessageSquareIcon } from 'lucide-react-native'; // Example icons

import ListingsNavigator from './ListingsNavigator'; // Assuming nested stack
import MessagesNavigator from './MessagesNavigator'; // Assuming nested stack
import CreateListingScreen from '../features/listings/screens/CreateListingScreen'; // Actual screen
import AppHeader from '../components/AppHeader'; // Import custom header

import { MainTabsParamList } from './types'; // Import correct param list type
import { useChatStore } from '../features/messaging/store/chatStore'; // For unread badge


const Tab = createBottomTabNavigator<MainTabsParamList>();

const CreateScreenPlaceholder: React.FC<BottomTabScreenProps<MainTabsParamList, 'Create'>> = () => {
    // Your actual CreateListingScreen component logic goes here
    // It implicitly receives navigation and route from the navigator
     return <CreateListingScreen />;
 };


/** Bottom tab navigator containing the main sections of the app. */
const MainNavigator = () => {
    const { colors, fonts } = useTheme();
    // Get unread count for the badge (Story 70)
    const totalUnreadCount = useChatStore(state => state.totalUnreadCount);

    return (
        <Tab.Navigator
            screenOptions={{
                header: () => <AppHeader />, // Use custom header for all tab screens
                tabBarActiveTintColor: colors.primary500,
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarStyle: {
                    backgroundColor: colors.backgroundCard,
                    borderTopColor: colors.borderLight,
                    // Adjust height if needed
                    // height: 60,
                },
                tabBarLabelStyle: {
                    fontFamily: fonts.body,
                    fontSize: 10,
                    // paddingBottom: 5, // Adjust spacing
                },
            }}
        >
            <Tab.Screen
                name="Listings"
                component={ListingsStack}
                options={{
                    tabBarLabel: 'Trades',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="storefront-outline" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Create"
                component={CreateListingScreen}
                options={{
                    tabBarLabel: 'Create',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="plus-circle-outline" color={color} size={size} />
                    ),
                    // Example: Custom styling for the center button (might need tabBarButton prop or custom component)
                    // tabBarButton: (props) => <CustomCreateButton {...props} />,
                }}
            />
             <Tab.Screen
                name="Messages"
                component={MessagesStack}
                options={{
                    tabBarLabel: 'Messages',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="message-text-outline" color={color} size={size} />
                    ),
                    // Display badge if there are unread messages
                    tabBarBadge: totalUnreadCount > 0 ? totalUnreadCount : undefined,
                    tabBarBadgeStyle: {
                        backgroundColor: colors.errorBase, // Use theme color for badge
                        color: colors.textLight, // Use theme color for text
                        fontSize: 10,
                     },
                }}
            />
        </Tab.Navigator>
    );
};

export default MainNavigator;