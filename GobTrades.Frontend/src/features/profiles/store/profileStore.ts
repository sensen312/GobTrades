// src/features/profiles/store/profileStore.ts
import { create } from 'zustand';
import { UserProfile as UserProfileType, UpdateProfileRequestDto as UpdateProfileRequestDtoType, ImageObject as ImageObjectType, MarketStatusResponseDto, UpdateItemDto } from '../../../types';
import { fetchMyStallApi as fetchMyStallApiProfile, updateMyStallApi as updateMyStallApiProfile } from '../../../api/profiles';
import { fetchMarketStatusApi as fetchMarketStatusApiProfile } from '../../../api/market';
import { useAuthStore as useAuthStoreProfile } from '../../auth/store/authStore';
import { showErrorToast as showErrorToastProfile, showSuccessToast as showSuccessToastProfile } from '../../../utils/toast';
import { formatImageDataForUpload as formatImageDataForUploadProfile } from '../../../services/formatImageData';

type ProfileStoreStatus = 'idle' | 'loading' | 'success' | 'error';

interface ProfileStateStore {
  myStallData: UserProfileType | null;
  myStallServerData: UserProfileType | null;
  myStallFetchStatus: ProfileStoreStatus;
  myStallSaveStatus: ProfileStoreStatus;
  hasUnsavedChanges: boolean;
  error: string | null;
  marketStatus: MarketStatusResponseDto | null;
  marketStatusFetchState: ProfileStoreStatus;
  fetchMyStall: () => Promise<void>;
  saveMyStall: (currentStallDataFromUI: UserProfileType, newImagesForUpload: ImageObjectType[], isFirstSave: boolean) => Promise<UserProfileType | null>;
  updateLocalStallData: (updatedData: Partial<UserProfileType>) => void;
  setHasUnsavedChanges: (status: boolean) => void;
  resetMyStallToLastSaved: () => void;
  clearProfileStore: () => void;
  fetchMarketStatus: () => Promise<void>;
}

const initialProfileStateForStore: Omit<ProfileStateStore, 'fetchMyStall' | 'saveMyStall' | 'updateLocalStallData' | 'setHasUnsavedChanges' | 'resetMyStallToLastSaved' | 'clearProfileStore' | 'fetchMarketStatus'> = {
  myStallData: null,
  myStallServerData: null,
  myStallFetchStatus: 'idle',
  myStallSaveStatus: 'idle',
  hasUnsavedChanges: false,
  error: null,
  marketStatus: null,
  marketStatusFetchState: 'idle',
};

export const useProfileStore = create<ProfileStateStore>((set, get) => ({
  ...initialProfileStateForStore,
  fetchMyStall: async () => {
    if (get().myStallFetchStatus === 'loading') return;
    set({ myStallFetchStatus: 'loading', error: null });
    try {
      const stallData = await fetchMyStallApiProfile();
      set({
        myStallData: stallData,
        myStallServerData: stallData,
        myStallFetchStatus: 'success',
        hasUnsavedChanges: false,
      });
      console.log('ProfileStore: MyStall fetched successfully.', stallData);
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to fetch your stall data.";
      console.error('ProfileStore: Error fetching MyStall:', message, err);
      set({ myStallFetchStatus: 'error', error: message });
    }
  },
  saveMyStall: async (currentStallDataFromUI, newImagesForUpload, isFirstSave) => {
    if (get().myStallSaveStatus === 'loading') return null;
    set({ myStallSaveStatus: 'loading', error: null });
    const { uuid: userUuid } = useAuthStoreProfile.getState();
    if (!userUuid) {
        const msg = "User UUID not found for saving stall.";
        console.error("ProfileStore: " + msg);
        set({ myStallSaveStatus: 'error', error: msg }); showErrorToastProfile(msg, "Save Error");
        return null;
    }
    // Construct the DTO for the JSON part of FormData
    const stallDtoPayload: UpdateProfileRequestDtoType = {
      items: currentStallDataFromUI.items.map(item => {
          // For new items, localId might be useful for backend to map to uploaded files if needed.
          // Backend should generate the actual dbId for new items.
          // For existing items, dbId is crucial.
          // imageFilename for NEW items is the client-derived name (e.g., 'upload_timestamp.jpg')
          // imageFilename for EXISTING items is the server-stored filename
          return {
              localId: item.isNew ? item.localId : undefined, // Only new items might have a localId here
              dbId: item.dbId, // Existing items MUST have their dbId
              itemName: item.itemName,
              imageFilename: item.imageFilename,
          };
      }),
      offeredItemTags: currentStallDataFromUI.offeredItemTags,
      wantsTags: currentStallDataFromUI.wantsTags,
      offeredItemsDescription: currentStallDataFromUI.offeredItemsDescription,
      wantedItemsDescription: currentStallDataFromUI.wantedItemsDescription,
      // removedItemDbIds could be populated by comparing initial items with currentStallDataFromUI.items
      // For Phase 1, if an item is removed from UI, it's simply not in the `items` array sent.
      // Backend logic would need to handle replacing the entire items array or diffing based on dbId.
    };

    const formData = new FormData();
    formData.append('profileData', JSON.stringify(stallDtoPayload));

    newImagesForUpload.forEach((imgObj) => {
      // Only append images marked as new and having a valid URI.
      if (imgObj.isNew && imgObj.uri) {
        const formattedFile = formatImageDataForUploadProfile(imgObj);
        if (formattedFile) {
          // Backend expects new images under 'newImageFiles' key.
          formData.append('newImageFiles', formattedFile as any);
        }
      }
    });

    try {
      const updatedStallFromServer = await updateMyStallApiProfile(formData);
      set({
        myStallData: updatedStallFromServer, myStallServerData: updatedStallFromServer,
        myStallSaveStatus: 'success', hasUnsavedChanges: false,
      });

      if (isFirstSave) {
        useAuthStoreProfile.getState().finalizeAuthentication({
            uuid: updatedStallFromServer.uuid, goblinName: updatedStallFromServer.goblinName,
            pfpIdentifier: updatedStallFromServer.pfpIdentifier,
        });
      }
      showSuccessToastProfile("Stall saved successfully!");
      console.log('ProfileStore: Stall saved successfully.', updatedStallFromServer);
      return updatedStallFromServer;
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to save your stall.";
      console.error('ProfileStore: Error saving stall:', message, err);
      set({ myStallSaveStatus: 'error', error: message }); showErrorToastProfile(message, "Save Error");
      return null;
    }
  },
  updateLocalStallData: (updatedData) => {
    set((state) => ({
      myStallData: state.myStallData ? { ...state.myStallData, ...updatedData } : (updatedData as UserProfileType),
      hasUnsavedChanges: true,
    }));
  },
  setHasUnsavedChanges: (status) => set({ hasUnsavedChanges: status }),
  resetMyStallToLastSaved: () => {
    set((state) => ({ myStallData: state.myStallServerData ? { ...state.myStallServerData } : null, hasUnsavedChanges: false, }));
    console.log('ProfileStore: Local stall data reset to last saved state.');
  },
  clearProfileStore: () => { set(initialProfileStateForStore); console.log('ProfileStore: Cleared.'); },
  fetchMarketStatus: async () => {
    if (get().marketStatusFetchState === 'loading') return;
    set({ marketStatusFetchState: 'loading', error: null });
    try {
      const status = await fetchMarketStatusApiProfile();
      set({ marketStatus: status, marketStatusFetchState: 'success' });
      console.log('ProfileStore: Market status fetched.', status);
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to fetch market status.";
      console.error('ProfileStore: Error fetching market status:', message, err);
      set({ marketStatusFetchState: 'error', error: message });
    }
  },
}));
