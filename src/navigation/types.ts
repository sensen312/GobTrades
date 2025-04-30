import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams, CompositeScreenProps } from '@react-navigation/native'; // Import CompositeScreenProps

// --- Parameter Lists ---

// Params for screens within the Auth flow (before login/setup)
export type AuthStackParamList = {
  AuthLoading: undefined; // Initial screen to check auth status
  Setup: undefined;       // User profile setup screen
};

// Params for screens within the Listings tab/stack
export type ListingsStackParamList = {
  ListingsFeed: undefined; // Main feed of listings
  MyListings: undefined;   // User's own listings
  LikedListings: undefined; // Liked listings
  ListingDetail: { listingId: string }; // View details of a specific listing
  EditListing: { listingId: string };   // Edit a specific listing
};

// Params for screens within the Messages tab/stack
export type MessagesStackParamList = {
  MessagingList: undefined; // List of user's chats
  Chat: {
      chatId?: string; // Optional: Existing chat ID
      listingId: string; // Context listing ID
      otherUserId: string; // ID of the other user
      otherUserName?: string; // Optional: Name for header title
      otherUserPfpId?: string; // Optional: PFP for potential display
  };
  // Add ListingDetail here if navigating from chat context preview
  ListingDetail: { listingId: string };
};

// Params for the main bottom tabs themselves
export type MainTabsParamList = {
  Listings: NavigatorScreenParams<ListingsStackParamList>; // Nested stack navigator
  Create: undefined; // Direct screen, no params needed
  Messages: NavigatorScreenParams<MessagesStackParamList>; // Nested stack navigator
};

// Params for the root App navigator (contains Auth OR Main)
export type AppStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>; // Nested Auth stack
  Main: NavigatorScreenParams<MainTabsParamList>; // Nested Main tabs
  Settings: undefined; // Global settings screen
  // Add other global modals here if needed (e.g., FilterModal, ImageZoomViewer)
  // FilterModal: undefined;
  // ImageZoomViewer: { imageUrl: string };
};

// --- Screen Props Types ---
// Helper to combine App Stack props with Native Stack props
export type AppScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<AppStackParamList, T>;

// Helper to combine Main Tabs props with Bottom Tab props AND App Stack props
export type MainTabsScreenProps<T extends keyof MainTabsParamList> = CompositeScreenProps<
    BottomTabScreenProps<MainTabsParamList, T>,
    AppScreenProps<keyof AppStackParamList> // Include App stack props for navigation access
>;

// Helper to combine Listings Stack props with Native Stack props AND Main Tabs props
export type ListingsScreenProps<T extends keyof ListingsStackParamList> = CompositeScreenProps<
    NativeStackScreenProps<ListingsStackParamList, T>,
    MainTabsScreenProps<keyof MainTabsParamList> // Include Main Tabs props
>;

// Helper to combine Messages Stack props with Native Stack props AND Main Tabs props
export type MessagesScreenProps<T extends keyof MessagesStackParamList> = CompositeScreenProps<
    NativeStackScreenProps<MessagesStackParamList, T>,
    MainTabsScreenProps<keyof MainTabsParamList> // Include Main Tabs props
>;

// Helper for Auth Stack screens
export type AuthScreenProps<T extends keyof AuthStackParamList> = CompositeScreenProps<
    NativeStackScreenProps<AuthStackParamList, T>,
    AppScreenProps<keyof AppStackParamList>
>;