// src/navigation/MainNavigator.tsx
import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Svg, Path, Rect, Circle } from 'react-native-svg';
import { useTheme, Icon as GlueIcon } from '@gluestack-ui/themed';
import type { ComponentProps } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { MainTabsParamList, MyStallScreenRouteProp } from './types';
import AppHeader from '../components/AppHeader';
import ProfileFeedNavigator from './ProfileFeedNavigator';
import MessagesNavigator from './MessagesNavigator';
import MyStallScreen from '../features/profiles/screens/MyStallScreen';

type GlueIconPropsMain = ComponentProps<typeof GlueIcon>;

const Tab = createBottomTabNavigator<MainTabsParamList>();

const TradingPouchWithPlusIcon: React.FC<{ color: string; size: number; focused: boolean }> = ({ color, size, focused }) => {
  const theme = useTheme();
  const iconColor = focused ? (theme.colors.goblinGold600 as string) : color;
  const plusColor = focused ? (theme.colors.parchment50 as string) : (theme.colors.goblinGreen500 as string);

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M6 7C6 5.34315 7.34315 4 9 4H15C16.6569 4 18 5.34315 18 7V15C18 17.2091 16.2091 19 14 19H10C7.79086 19 6 17.2091 6 15V7Z"
        fill={focused ? (theme.colors.goblinGreen700 as string) : (theme.colors.woodBrown600 as string)}
        stroke={iconColor}
        strokeWidth="1.5"
      />
      <Path d="M6 7H18V9H6V7Z" fill={iconColor} />
      <Circle cx="12" cy="7" r="1" fill={focused ? (theme.colors.parchment200 as string) : (theme.colors.woodBrown300 as string)} />
      <Rect x="10" y="10" width="4" height="1.5" rx="0.5" fill={plusColor} transform="translate(0, -0.75)" />
      <Rect x="11.25" y="8.5" width="1.5" height="4" rx="0.5" fill={plusColor} transform="translate(0, -0.75)" />
    </Svg>
  );
};

const MainNavigator: React.FC = () => {
  const { colors, fonts } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        header: () => <AppHeader />,
        tabBarActiveTintColor: colors.goblinGreen700 as string,
        tabBarInactiveTintColor: colors.woodBrown500 as string,
        tabBarStyle: {
          backgroundColor: colors.backgroundCard as string,
          borderTopColor: colors.borderLight as string,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 30 : 5,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.body as string,
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Trades"
        component={ProfileFeedNavigator}
        options={{
          tabBarLabel: 'Trades',
          tabBarIcon: ({ color, size, focused }) => (
            <GlueIcon as={MaterialCommunityIcons} /* @ts-ignore */ name="storefront-outline" color={focused ? '$goblinGreen700' : color} size="xl" />
          ),
        }}
      />
      <Tab.Screen
        name="AddItem"
        component={MyStallScreen}
        initialParams={{ isFirstSetup: false } as MyStallScreenRouteProp['params']}
        options={{
          tabBarLabel: 'My Stall',
          tabBarIcon: ({ color, size, focused }) => (
            <TradingPouchWithPlusIcon color={color} size={size + 8} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesNavigator}
        options={{
          tabBarLabel: 'Messages',
          tabBarIcon: ({ color, size, focused }) => (
            <GlueIcon as={MaterialCommunityIcons} /* @ts-ignore */ name="message-text-outline" color={focused ? '$goblinGreen700' : color} size="xl" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
export default MainNavigator;
