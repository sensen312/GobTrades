// src/features/auth/store/authStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuidLibAuth from 'react-native-uuid';
import { createUserApi as createUserApiStore, deleteMyUserApi } from '../../../api/users'; // Added deleteMyUserApi
import { UserProfile as UserProfileStore, CreateUserRequestDto as CreateUserRequestDtoStore } from '../../../types';
import { showErrorToast as showErrorToastStore, showSuccessToast } from '../../../utils/toast';
import { useProfileStore } from '../../profiles/store/profileStore';

const AUTH_STORAGE_KEY_AUTH_STORE = 'gobtrades_user_identity_v1';

interface AuthStateStore {
  uuid: string | null;
  goblinName: string | null;
  pfpIdentifier: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loadUserIdentity: () => Promise<void>;
  initializeProfile: (name: string, pfpId: string) => Promise<string | null>;
  finalizeAuthentication: (persistedProfileData: Pick<UserProfileStore, 'uuid' | 'goblinName' | 'pfpIdentifier'>) => Promise<void>;
  clearAuthentication: () => Promise<void>; // Updated for GOB-GEN-10
  resetAuthStatus: () => void;
}

export const useAuthStore = create<AuthStateStore>((set, get) => ({
  uuid: null,
  goblinName: null,
  pfpIdentifier: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  loadUserIdentity: async () => {
    set({ isLoading: true, error: null });
    try {
      const storedIdentityJson = await AsyncStorage.getItem(AUTH_STORAGE_KEY_AUTH_STORE);
      if (storedIdentityJson) {
        const storedIdentity = JSON.parse(storedIdentityJson) as Pick<UserProfileStore, 'uuid' | 'goblinName' | 'pfpIdentifier'>;
        if (storedIdentity.uuid && storedIdentity.goblinName && storedIdentity.pfpIdentifier) {
          set({
            uuid: storedIdentity.uuid,
            goblinName: storedIdentity.goblinName,
            pfpIdentifier: storedIdentity.pfpIdentifier,
            isAuthenticated: true,
            isLoading: false,
          });
          console.log('AuthStore: User identity loaded from storage.', storedIdentity);
          return;
        } else {
          console.warn('AuthStore: Invalid identity found in storage. Clearing.');
          await AsyncStorage.removeItem(AUTH_STORAGE_KEY_AUTH_STORE);
        }
      }
      set({ isAuthenticated: false, isLoading: false });
      console.log('AuthStore: No valid user identity in storage.');
    } catch (e: any) {
      console.error('AuthStore: Failed to load user identity from storage:', e);
      set({ isAuthenticated: false, isLoading: false, error: 'Failed to load session.' });
    }
  },

  initializeProfile: async (name: string, pfpId: string): Promise<string | null> => {
    set({ isLoading: true, error: null });
    const newUuid = uuidLibAuth.v4() as string;
    try {
      const userData: CreateUserRequestDtoStore = {
        uuid: newUuid,
        goblinName: name,
        pfpIdentifier: pfpId,
      };
      await createUserApiStore(userData);
      set({
        uuid: newUuid,
        goblinName: name,
        pfpIdentifier: pfpId,
        isAuthenticated: false,
        isLoading: false,
      });
      console.log('AuthStore: Profile initialized temporarily in store. UUID:', newUuid);
      return newUuid;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to initialize profile.';
      console.error('AuthStore: Error initializing profile:', message);
      set({ isLoading: false, error: message });
      showErrorToastStore(message, 'Setup Error');
      return null;
    }
  },

  finalizeAuthentication: async (persistedProfileData) => {
    const { uuid, goblinName, pfpIdentifier } = persistedProfileData;
    if (!uuid || !goblinName || !pfpIdentifier) {
        console.error("AuthStore: FinalizeAuthentication called with incomplete data.");
        return;
    }
    try {
      const identityToStore = { uuid, goblinName, pfpIdentifier };
      await AsyncStorage.setItem(AUTH_STORAGE_KEY_AUTH_STORE, JSON.stringify(identityToStore));
      set({
        uuid,
        goblinName,
        pfpIdentifier,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      console.log('AuthStore: Authentication finalized and identity saved to storage.');
    } catch (e: any) {
      console.error('AuthStore: Failed to finalize authentication and save identity:', e);
      set({ error: 'Failed to save session details after stall creation.' });
      showErrorToastStore('Failed to save session details. Please try logging out and in.', 'Auth Error');
    }
  },

  // GOB-GEN-10: Updated to include backend user deletion.
  clearAuthentication: async () => {
    console.log('AuthStore: Clearing authentication and attempting to delete user data...');
    set({ isLoading: true });
    const currentUuid = get().uuid; // Get UUID before resetting state
    let backendDeletionSuccess = false;

    try {
      if (currentUuid) { // Only attempt backend deletion if a UUID exists
        await deleteMyUserApi(); // Call API to delete user on backend
        console.log('AuthStore: Backend user deletion request successful.');
        backendDeletionSuccess = true;
        // Toast for backend success will be handled by SettingsScreen or calling function for better context
      } else {
        console.warn('AuthStore: No UUID found, skipping backend deletion call.');
        backendDeletionSuccess = true; // Consider local clear successful if no backend to call
      }
    } catch (apiError: any) {
        console.error('AuthStore: Failed to delete user data on backend:', apiError);
        // Notify user, but still proceed with local clearing.
        showErrorToastStore(apiError.response?.data?.message || "Failed to fully retire goblin from server. Local data will be cleared.", "Retirement Issue");
        // Backend deletion failed, but we will still clear local data.
    } finally {
        try {
            await AsyncStorage.removeItem(AUTH_STORAGE_KEY_AUTH_STORE);
            useProfileStore.getState().clearProfileStore(); // Ensure profile store is also cleared
            set({
                uuid: null,
                goblinName: null,
                pfpIdentifier: null,
                isAuthenticated: false,
                isLoading: false, // Ensure loading is false after operation
                error: null,
            });
            console.log('AuthStore: Local authentication cleared.');
            if (backendDeletionSuccess) {
                showSuccessToast("Goblin Retired!", "All your local data has been cleared.");
            }
        } catch (storageError: any) {
            console.error('AuthStore: Failed to clear local authentication storage:', storageError);
            set({ isLoading: false, error: 'Failed to fully clear local session.' });
            showErrorToastStore("Failed to clear local session data.", "Local Clear Error");
        }
    }
  },
  resetAuthStatus: () => set({ isLoading: false, error: null }),
}));
