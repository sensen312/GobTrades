// src/navigation/types.ts
import type { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
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
    listingId?: string;
  };
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

// Generic Screen Props
export type AuthScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<AuthStackParamList, T>;
export type MessagesScreenProps<T extends keyof MessagesStackParamList> = CompositeScreenProps<NativeStackScreenProps<MessagesStackParamList, T>, BottomTabScreenProps<MainTabsParamList>>;
export type MessagesScreenNavigationProp<T extends keyof MessagesStackParamList> = MessagesScreenProps<T>['navigation'];
export type MessagesScreenRouteProp<T extends keyof MessagesStackParamList> = MessagesScreenProps<T>['route'];

export type MyStallScreenRouteProp = RouteProp<MainTabsParamList, 'MyStall'>;
