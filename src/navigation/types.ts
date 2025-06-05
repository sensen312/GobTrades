// src/navigation/types.ts
import type { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack'; // Added NativeStackNavigationProp
import type { BottomTabScreenProps, BottomTabNavigationProp } from '@react-navigation/bottom-tabs'; // Added BottomTabNavigationProp
import type { NavigatorScreenParams, CompositeScreenProps, RouteProp } from '@react-navigation/native';

export type AuthStackParamList = {
  AuthLoading: undefined;
  Setup: undefined;
};
export type ProfileFeedStackParamList = {
  ProfileFeedScreen: undefined;
};
export type MessagesStackParamList = {
  MessagingListScreen: undefined;
};
export type MainTabsParamList = {
  Trades: NavigatorScreenParams<ProfileFeedStackParamList>;
  AddItem: { isFirstSetup?: boolean } | undefined;
  Messages: NavigatorScreenParams<MessagesStackParamList>;
};
export type AppStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabsParamList>;
  Settings: undefined;
};

// Corrected Screen Props for improved type safety with navigation objects
export type AppScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<AppStackParamList, T>;

export type AuthScreenNavigationProp<T extends keyof AuthStackParamList> = NativeStackNavigationProp<AuthStackParamList, T>;
export type AuthScreenRouteProp<T extends keyof AuthStackParamList> = RouteProp<AuthStackParamList, T>;

export type MainTabsScreenNavigationProp<T extends keyof MainTabsParamList> = BottomTabNavigationProp<MainTabsParamList, T>;
export type MainTabsScreenRouteProp<T extends keyof MainTabsParamList> = RouteProp<MainTabsParamList, T>;

export type ProfileFeedScreenNavigationProp<T extends keyof ProfileFeedStackParamList> = NativeStackNavigationProp<ProfileFeedStackParamList, T>;
export type ProfileFeedScreenRouteProp<T extends keyof ProfileFeedStackParamList> = RouteProp<ProfileFeedStackParamList, T>;

export type MessagesScreenNavigationProp<T extends keyof MessagesStackParamList> = NativeStackNavigationProp<MessagesStackParamList, T>;
export type MessagesScreenRouteProp<T extends keyof MessagesStackParamList> = RouteProp<MessagesStackParamList, T>;


// MyStallScreen specifically uses route params from the MainTabsParamList for 'AddItem'
export type MyStallScreenRouteProp = RouteProp<MainTabsParamList, 'AddItem'>;
