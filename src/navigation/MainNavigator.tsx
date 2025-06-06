// src/navigation/MainNavigator.tsx
import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme, Icon } from '@gluestack-ui/themed';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { MainTabsParamList } from './types';
import AppHeader from '../components/AppHeader';
import ProfileFeedNavigator from './ProfileFeedNavigator';
import MessagesNavigator from './MessagesNavigator';
import MyStallScreen from '../features/profiles/screens/MyStallScreen';
import { useChatStore } from '../features/messaging/store/chatStore';

const Tab = createBottomTabNavigator<MainTabsParamList>();

const MainNavigator: React.FC = () => {
  const { colors, fonts } = useTheme();
  const totalUnreadCount = useChatStore(state => state.totalUnreadCount);

  return (
    <Tab.Navigator
      screenOptions={{
        header: () => <AppHeader />,
        tabBarActiveTintColor: colors.primary500 as string,
        tabBarInactiveTintColor: colors.textSecondary as string,
        tabBarStyle: { backgroundColor: colors.backgroundCard as string, borderTopColor: colors.borderLight as string, height: Platform.OS === 'ios' ? 90 : 70, paddingTop: 5, paddingBottom: Platform.OS === 'ios' ? 30 : 5 },
        tabBarLabelStyle: { fontFamily: fonts.body as string, fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="Trades"
        component={ProfileFeedNavigator}
        options={{
          tabBarLabel: 'Trades',
          tabBarIcon: ({ color, size }) => <Icon as={MaterialCommunityIcons} name="storefront-outline" color={color} size="xl" />,
        }}
      />
      <Tab.Screen
        name="MyStall"
        component={MyStallScreen}
        initialParams={{ isFirstSetup: false }}
        options={{
          tabBarLabel: 'My Stall',
          tabBarIcon: ({ color, size }) => <Icon as={MaterialCommunityIcons} name="treasure-chest-outline" color={color} size="xl" />,
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesNavigator}
        options={{
          tabBarLabel: 'Messages',
          tabBarIcon: ({ color, size }) => <Icon as={MaterialCommunityIcons} name="message-text-outline" color={color} size="xl" />,
          tabBarBadge: totalUnreadCount > 0 ? totalUnreadCount : undefined,
        }}
      />
    </Tab.Navigator>
  );
};
export default MainNavigator;
