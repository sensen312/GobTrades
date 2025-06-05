// src/navigation/types.ts
import type { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabScreenProps, BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams, CompositeScreenProps, RouteProp } from '@react-navigation/native';

export type AuthStackParamList = {
  AuthLoading: undefined;
  Setup: undefined;
  MyStallSetup: { isFirstSetup: true };
};

export type ProfileFeedStackParamList = {
  ProfileFeedScreen: undefined;
  ProfileDetailScreen: { userUuid: string };
};

export type MessagesStackParamList = {
  MessagingListScreen: undefined;
  ChatScreen: {
    chatId?: string;
    targetUserUuid: string;
    targetUserName?: string;
    targetUserPfpIdentifier?: string;
    contextItemId?: string;
  };
  ProfileDetailScreen: { userUuid: string };
};

export type MainTabsParamList = {
  Trades: NavigatorScreenParams<ProfileFeedStackParamList>;
  MyStall: { isFirstSetup?: boolean } | undefined;
  Messages: NavigatorScreenParams<MessagesStackParamList>;
};

export type AppStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabsParamList>;
  Settings: undefined;
};

export type AppScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<AppStackParamList, T>;
export type AuthScreenProps<T extends keyof AuthStackParamList> = CompositeScreenProps<NativeStackScreenProps<AuthStackParamList, T>, AppScreenProps<keyof AppStackParamList>>;
export type MainTabsScreenProps<T extends keyof MainTabsParamList> = CompositeScreenProps<BottomTabScreenProps<MainTabsParamList, T>, AppScreenProps<keyof AppStackParamList>>;
export type MessagesScreenNavigationProp<T extends keyof MessagesStackParamList> = CompositeScreenProps<NativeStackScreenProps<MessagesStackParamList, T>, MainTabsScreenProps<keyof MainTabsParamList>>['navigation'];
export type MessagesScreenRouteProp<T extends keyof MessagesStackParamList> = CompositeScreenProps<NativeStackScreenProps<MessagesStackParamList, T>, MainTabsScreenProps<keyof MainTabsParamList>>['route'];

// Correcting route prop for MyStallScreen
export type MyStallScreenRouteProp = RouteProp<MainTabsParamList, 'MyStall'>;
