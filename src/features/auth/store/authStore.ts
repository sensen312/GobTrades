import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { createUserApi } from '../../../api/users';
import { UserProfile, CreateUserRequest } from '../../../types'; // Import necessary types

// Key for storing the user profile in AsyncStorage.
const STORAGE_KEY = 'gobtrades_user_profile_v1';

// Defines the shape of the authentication state and actions.
interface AuthState {
  uuid: string | null;
  goblinName: string | null;
  pfpId: string | null; // Identifier for the chosen PFP asset
  isAuthenticated: boolean;
  isLoading: boolean; // Tracks loading state during storage checks/API calls
  error: string | null; // Stores any authentication-related errors

  // Actions
  loadFromStorage: () => Promise<void>;
  setProfile: (name: string, pfpId: string) => Promise<boolean>; // Returns true on success
  clearProfile: () => Promise<void>;
  resetStatus: () => void;
}

// Creates the Zustand store for authentication state.
export const useAuthStore = create<AuthState>((set, get) => ({
  // --- Initial State ---
  uuid: null,
  goblinName: null,
  pfpId: null,
  isAuthenticated: false,
  isLoading: true, // Assume loading initially until storage is checked
  error: null,

  // --- Actions ---

  /** Loads profile data from AsyncStorage. (Handles Story 1, 2) */
  loadFromStorage: async () => {
    set({ isLoading: true, error: null });
    try {
      const storedProfileJson = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedProfileJson) {
        const storedProfile: Partial<UserProfile> = JSON.parse(storedProfileJson);
        // Basic validation: Ensure essential fields exist
        if (storedProfile.uuid && storedProfile.goblinName && storedProfile.pfpIdentifier) {
          set({
            uuid: storedProfile.uuid,
            goblinName: storedProfile.goblinName,
            pfpId: storedProfile.pfpIdentifier,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          console.log('AuthStore: Profile loaded from storage.');
          return;
        } else {
          console.warn('AuthStore: Invalid profile found in storage, clearing.');
          await AsyncStorage.removeItem(STORAGE_KEY); // Clear invalid data
        }
      }
      // No valid profile found or storage is empty
      set({ isAuthenticated: false, isLoading: false, error: null });
      console.log('AuthStore: No valid profile in storage.');
    } catch (error: any) {
      console.error("AuthStore: Failed to load profile from storage:", error);
      set({ isAuthenticated: false, isLoading: false, error: "Failed to load session." });
    }
  },

  /** Creates and saves a new user profile. (Handles Story 7) */
  setProfile: async (name: string, pfpId: string): Promise<boolean> => {
    set({ isLoading: true, error: null });
    try {
      const newUuid = uuid.v4() as string; // Generate a new Version 4 UUID
      const profileData: CreateUserRequest = { // Use the specific request type
        uuid: newUuid,
        goblinName: name,
        pfpIdentifier: pfpId,
      };

      // Call the backend API to register/create the user profile.
      const createdUser = await createUserApi(profileData); // API call

      // Save the profile returned from the backend (might include _id, createdAt etc.)
      const profileToStore: UserProfile = { ...createdUser }; // Assuming API returns full UserProfile

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profileToStore));

      // Update the store state
      set({
        uuid: profileToStore.uuid,
        goblinName: profileToStore.goblinName,
        pfpId: profileToStore.pfpIdentifier,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      console.log('AuthStore: Profile set and saved.');
      return true; // Indicate success
    } catch (error: any) {
      console.error("AuthStore: Failed to set profile:", error);
      // Error message might already be set by API interceptor if it's an API error
      const message = error.response?.data?.message || error.message || "Failed to setup profile.";
      set({ isLoading: false, error: message });
      // No need to show toast here, component calling setProfile should handle it
      return false; // Indicate failure
    }
  },

  /** Clears the current user profile from storage and state. */
  clearProfile: async () => {
    console.log('AuthStore: Clearing profile...');
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      // Reset state to initial values
      set({
        uuid: null,
        goblinName: null,
        pfpId: null,
        isAuthenticated: false,
        isLoading: false, // No longer loading
        error: null,
      });
      console.log('AuthStore: Profile cleared.');
    } catch (error: any) {
      console.error("AuthStore: Failed to clear profile:", error);
      set({ error: "Failed to clear session." });
    }
  },

  /** Resets loading and error states, useful for UI cleanup. */
  resetStatus: () => {
    set({ isLoading: false, error: null });
  },

}));
