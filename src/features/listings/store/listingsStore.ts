import { create } from 'zustand';
import { debounce } from 'lodash';
// Correct the path based on your project structure if needed
import { Listing, FilterParams as ApiFilterParams, PaginatedResponse } from '../../../types';
import {
    fetchListingsApi, createListingApi, updateListingApi, deleteListingApi,
    fetchListingByIdApi, likeListingApi, unlikeListingApi, markListingTradedApi,
    fetchMyListingsApi, fetchLikedListingsApi
} from '../../../api/listings'; // Correct the path if needed
import { showErrorToast, showSuccessToast } from '../../../utils/toast'; // Correct the path if needed
import { useAuthStore } from '../../auth/store/authStore'; // Needed for user context in like/unlike etc.

type ListingStatus = 'idle' | 'loading' | 'refreshing' | 'loadingMore' | 'success' | 'error';
export type FilterParams = ApiFilterParams; // Use the type directly from API types
interface PaginationState { page: number; hasMore: boolean; }

interface ListingsState {
    feedListings: Listing[];
    myListings: Listing[];
    // Store full liked listing objects as fetchLikedListingsApi returns them
    likedListings: Listing[];
    detailedListing: Listing | null;
    filters: FilterParams;
    searchTerm: string;
    feedPagination: PaginationState;
    myListingsPagination: PaginationState;
    likedListingsPagination: PaginationState;
    // Specific status fields for different contexts
    feedStatus: ListingStatus;
    myListingsStatus: ListingStatus;
    likedListingsStatus: ListingStatus;
    detailStatus: ListingStatus;
    mutationStatus: ListingStatus; // For create, update, delete, like, markTraded
    error: string | null;

    // --- Actions ---
    setFilters: (newFilters: Partial<FilterParams>, applyImmediately?: boolean) => void;
    setSearchTerm: (term: string) => void;
    applyFiltersAndSearch: () => void;
    fetchFeed: (refresh?: boolean) => Promise<void>;
    loadMoreFeed: () => Promise<void>;
    fetchMyListings: (refresh?: boolean) => Promise<void>;
    loadMoreMyListings: () => Promise<void>;
    fetchLikedListings: (refresh?: boolean) => Promise<void>;
    loadMoreLikedListings: () => Promise<void>;
    fetchListingDetails: (id: string) => Promise<void>;
    clearListingDetails: () => void;
    createListing: (data: FormData) => Promise<Listing | null>;
    updateListing: (id: string, data: FormData) => Promise<Listing | null>;
    deleteListing: (id: string) => Promise<boolean>;
    toggleLike: (id: string) => Promise<void>;
    markAsTraded: (id: string, isActive: boolean) => Promise<void>;
    resetFeed: () => void;
    resetListingsState: () => void;
    _updateLocalListing: (updatedListing: Partial<Listing> & { _id: string }) => void; // Internal helper
    _removeLocalListing: (id: string) => void; // Internal helper
    _updateLocalLikeStatus: (id: string, isLiked: boolean, likeCount?: number) => void; // Internal helper
}

// Define initial state values separately for clarity
const initialPaginationState: PaginationState = { page: 1, hasMore: true };
// Include all status fields in the initial data
const initialStateData = {
    feedListings: [],
    myListings: [],
    likedListings: [],
    detailedListing: null,
    filters: { sortBy: 'newest' as const },
    searchTerm: '',
    feedPagination: { ...initialPaginationState },
    myListingsPagination: { ...initialPaginationState },
    likedListingsPagination: { ...initialPaginationState },
    feedStatus: 'idle' as ListingStatus,
    myListingsStatus: 'idle' as ListingStatus,
    likedListingsStatus: 'idle' as ListingStatus,
    detailStatus: 'idle' as ListingStatus,
    mutationStatus: 'idle'as ListingStatus,
    error: null,
};

// Debounce function for search/filter application
const debouncedApplySearch = debounce((applyFn: () => void) => { applyFn(); }, 500);

// Create the store
export const useListingsStore = create<ListingsState>((set, get) => ({
    ...initialStateData, // Spread initial data properties

    // Action to set filters
    setFilters: (newFilters, applyImmediately = false) => {
        set((state) => ({
            filters: { ...state.filters, ...newFilters },
             ...(applyImmediately && {
                 feedPagination: { ...initialPaginationState },
                 feedStatus: 'idle', // Reset status to allow fetch
                 feedListings: [], // Clear current feed
                 error: null
             })
        }));
        if (applyImmediately) {
             get().applyFiltersAndSearch(); // Call apply directly
        }
    },

    // Action to set search term with debouncing
    setSearchTerm: (term) => {
        set({ searchTerm: term });
        debouncedApplySearch(() => get().applyFiltersAndSearch());
    },

    // Action to apply current filters and search term
    applyFiltersAndSearch: () => {
         get().resetFeed(); // Use the resetFeed action
         get().fetchFeed(); // Fetch the first page with new criteria
    },

    // Action to reset feed-specific state
    resetFeed: () => {
        set({
            feedListings: [],
            feedPagination: { ...initialPaginationState },
            feedStatus: 'idle',
            error: null
        });
    },

    // Fetches the main listing feed
    fetchFeed: async (refresh = false) => {
        // Use feedStatus specifically
        const { feedStatus, feedPagination, filters, searchTerm } = get();
        const isLoading = feedStatus === 'loading' || feedStatus === 'refreshing';

        if (!refresh && isLoading) return;

        const pageToFetch = refresh ? 1 : feedPagination.page;
        if (refresh) {
            get().resetFeed();
        } else if (isLoading || !feedPagination.hasMore) {
             return;
        }

        // Update feedStatus
        set({ feedStatus: refresh ? 'refreshing' : 'loading', error: null });

        try {
            const params: ApiFilterParams = { ...filters, searchTerm, page: pageToFetch, limit: 10 };
            const { items, hasMore } = await fetchListingsApi(params);

            set({
                feedListings: items,
                feedPagination: { page: pageToFetch, hasMore },
                feedStatus: 'success' // Update feedStatus
            });
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || "Could not load feed.";
            console.error("Fetch Feed Error:", message);
            set({ feedStatus: 'error', error: message }); // Update feedStatus
            showErrorToast(message, "Feed Error");
        }
    },

    // Loads more items for the main feed
    loadMoreFeed: async () => {
        // Use feedStatus
        const { feedStatus, feedPagination, filters, searchTerm, feedListings } = get();
        const isLoading = feedStatus === 'loadingMore' || feedStatus === 'refreshing' || feedStatus === 'loading';

        if (isLoading || !feedPagination.hasMore) return;

        set({ feedStatus: 'loadingMore' }); // Update feedStatus
        const nextPage = feedPagination.page + 1;

        try {
            const params: ApiFilterParams = { ...filters, searchTerm, page: nextPage, limit: 10 };
            const { items, hasMore } = await fetchListingsApi(params);
            set({
                feedListings: [...feedListings, ...items],
                feedPagination: { page: nextPage, hasMore },
                feedStatus: 'success' // Update feedStatus
            });
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || "Could not load more.";
            console.error("Load More Feed Error:", message);
            set({ feedStatus: 'error', error: message }); // Update feedStatus
            showErrorToast(message, "Feed Error");
        }
    },

    // Fetches the user's own listings
    fetchMyListings: async (refresh = false) => {
        // Use myListingsStatus
        const { myListingsStatus, myListingsPagination } = get();
        const isLoading = myListingsStatus === 'loading' || myListingsStatus === 'refreshing';
        if (!refresh && isLoading) return;

        const pageToFetch = refresh ? 1 : myListingsPagination.page;
         if (refresh) {
             set({ myListings: [], myListingsPagination: { ...initialPaginationState } });
         } else if (isLoading || !myListingsPagination.hasMore) {
             return;
         }

        set({ myListingsStatus: refresh ? 'refreshing' : 'loading', error: null }); // Update myListingsStatus
        try {
            // Fetch using API function (ensure user context is implicitly handled by interceptor)
            const { items, hasMore } = await fetchMyListingsApi({ page: pageToFetch, limit: 10 });
            set(state => ({
                myListings: refresh ? items : state.myListings, // Replace on refresh, loadMore handles append
                myListingsPagination: { page: pageToFetch, hasMore },
                myListingsStatus: 'success' // Update myListingsStatus
            }));
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || "Could not load your listings.";
            console.error("Fetch My Listings Error:", message);
            set({ myListingsStatus: 'error', error: message }); // Update myListingsStatus
            showErrorToast(message, "My Listings Error");
        }
    },

     // Loads more of the user's own listings
    loadMoreMyListings: async () => {
        // Use myListingsStatus
        const { myListingsStatus, myListingsPagination, myListings } = get();
        const isLoading = myListingsStatus === 'loadingMore' || myListingsStatus === 'refreshing' || myListingsStatus === 'loading';
        if (isLoading || !myListingsPagination.hasMore) return;

        set({ myListingsStatus: 'loadingMore' }); // Update myListingsStatus
        const nextPage = myListingsPagination.page + 1;
        try {
            const { items, hasMore } = await fetchMyListingsApi({ page: nextPage, limit: 10 });
            set({
                myListings: [...myListings, ...items],
                myListingsPagination: { page: nextPage, hasMore },
                myListingsStatus: 'success' // Update myListingsStatus
            });
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || "Could not load more.";
             console.error("Load More My Listings Error:", message);
            set({ myListingsStatus: 'error', error: message }); // Update myListingsStatus
            showErrorToast(message, "My Listings Error");
        }
    },

    // Fetches listings the user has liked
    fetchLikedListings: async (refresh = false) => {
        // Use likedListingsStatus
        const { likedListingsStatus, likedListingsPagination } = get();
        const isLoading = likedListingsStatus === 'loading' || likedListingsStatus === 'refreshing';
        if (!refresh && isLoading) return;

        const pageToFetch = refresh ? 1 : likedListingsPagination.page;
         if (refresh) {
             set({ likedListings: [], likedListingsPagination: { ...initialPaginationState } });
         } else if (isLoading || !likedListingsPagination.hasMore) {
             return;
         }

        set({ likedListingsStatus: refresh ? 'refreshing' : 'loading', error: null }); // Update likedListingsStatus
        try {
            // Fetch liked listings (ensure user context is handled by interceptor)
            const { items, hasMore } = await fetchLikedListingsApi({ page: pageToFetch, limit: 10 });
            set(state => ({
                likedListings: refresh ? items : state.likedListings, // Replace on refresh
                likedListingsPagination: { page: pageToFetch, hasMore },
                likedListingsStatus: 'success' // Update likedListingsStatus
            }));
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || "Could not load liked items.";
             console.error("Fetch Liked Listings Error:", message);
            set({ likedListingsStatus: 'error', error: message }); // Update likedListingsStatus
            showErrorToast(message, "Liked Error");
        }
    },

    // Loads more liked listings
    loadMoreLikedListings: async () => {
        // Use likedListingsStatus
        const { likedListingsStatus, likedListingsPagination, likedListings } = get();
        const isLoading = likedListingsStatus === 'loadingMore' || likedListingsStatus === 'refreshing' || likedListingsStatus === 'loading';
        if (isLoading || !likedListingsPagination.hasMore) return;

        set({ likedListingsStatus: 'loadingMore' }); // Update likedListingsStatus
        const nextPage = likedListingsPagination.page + 1;
        try {
            const { items, hasMore } = await fetchLikedListingsApi({ page: nextPage, limit: 10 });
            set({
                likedListings: [...likedListings, ...items],
                likedListingsPagination: { page: nextPage, hasMore },
                likedListingsStatus: 'success' // Update likedListingsStatus
            });
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || "Could not load more liked items.";
             console.error("Load More Liked Listings Error:", message);
            set({ likedListingsStatus: 'error', error: message }); // Update likedListingsStatus
            showErrorToast(message, "Liked Error");
        }
    },

    // Fetches details for a single listing
    fetchListingDetails: async (id: string) => {
        set({ detailStatus: 'loading', detailedListing: null, error: null }); // Update detailStatus
        try {
            const listing = await fetchListingByIdApi(id);
            set({ detailedListing: listing, detailStatus: 'success' }); // Update detailStatus
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || "Could not load listing details.";
            console.error("Fetch Details Error:", message);
            set({ detailStatus: 'error', error: message }); // Update detailStatus
            showErrorToast(message, "Details Error");
        }
    },

    // Clears the currently viewed detailed listing
    clearListingDetails: () => set({ detailedListing: null, detailStatus: 'idle' }),

    // Creates a new listing
    createListing: async (data: FormData) => {
        set({ mutationStatus: 'loading', error: null }); // Use mutationStatus
        try {
            const newListing = await createListingApi(data);
            set(state => ({
                myListings: [newListing, ...state.myListings], // Add to start of myListings
                // Optionally add to feed if applicable based on current filters/sort
                // feedListings: [newListing, ...state.feedListings],
                mutationStatus: 'success' // Update mutationStatus
             }));
            showSuccessToast("Listing posted!", "Success");
            return newListing;
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || "Could not post listing.";
             console.error("Create Listing Error:", message);
            set({ mutationStatus: 'error', error: message }); // Update mutationStatus
            showErrorToast(message, "Post Error");
            return null;
        }
    },

    // Updates an existing listing
    updateListing: async (id: string, data: FormData) => {
        set({ mutationStatus: 'loading', error: null }); // Use mutationStatus
        try {
            const updatedListing = await updateListingApi(id, data);
            // Update the listing in all relevant state arrays
            get()._updateLocalListing(updatedListing);
            set({ mutationStatus: 'success' }); // Update mutationStatus
            // If the updated listing is the one being viewed in detail, update it
            if (get().detailedListing?._id === id) {
                 set({ detailedListing: updatedListing });
            }
            showSuccessToast("Listing updated!", "Success");
            return updatedListing;
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || "Could not update listing.";
             console.error("Update Listing Error:", message);
            set({ mutationStatus: 'error', error: message }); // Update mutationStatus
            showErrorToast(message, "Update Error");
            return null;
        }
    },

    // Deletes a listing
    deleteListing: async (id: string) => {
        set({ mutationStatus: 'loading', error: null }); // Use mutationStatus
        try {
            await deleteListingApi(id);
            // Remove the listing from all relevant state arrays
            get()._removeLocalListing(id);
            set({ mutationStatus: 'success' }); // Update mutationStatus
            showSuccessToast("Listing deleted.", "Success");
            return true;
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || "Could not delete listing.";
             console.error("Delete Listing Error:", message);
            set({ mutationStatus: 'error', error: message }); // Update mutationStatus
            showErrorToast(message, "Delete Error");
            return false;
        }
    },

    // Toggles the like status of a listing
    toggleLike: async (id: string) => {
        // Find the listing in any of the arrays or the detailed view
         const listingInState = get().feedListings.find(l => l._id === id)
            || get().myListings.find(l => l._id === id)
            || get().likedListings.find(l => l._id === id)
            || (get().detailedListing?._id === id ? get().detailedListing : null);

        if (!listingInState) {
             console.warn(`toggleLike: Listing with id ${id} not found in local state.`);
             return;
        }

        // Determine if the item is currently liked by checking the likedListings array
        const isCurrentlyLiked = get().likedListings.some(l => l._id === id);
        const originalLikeCount = listingInState.likeCount ?? 0;

        // Optimistic UI update: Change like status and count immediately
        const newLikeCount = isCurrentlyLiked ? originalLikeCount - 1 : originalLikeCount + 1;
        get()._updateLocalLikeStatus(id, !isCurrentlyLiked, newLikeCount);

        // Optimistic UI update for the likedListings array
        if (isCurrentlyLiked) {
             // Remove from liked list
             set(state => ({ likedListings: state.likedListings.filter(l => l._id !== id) }));
        } else {
            // Add to liked list (if not already there - safety check)
            if (!get().likedListings.some(l => l._id === id)) {
                 set(state => ({ likedListings: [listingInState, ...state.likedListings] }));
            }
        }

        set({ mutationStatus: 'loading' }); // Indicate API call is starting

        try {
            // Perform the API call based on the action
            if (isCurrentlyLiked) {
                await unlikeListingApi(id);
            } else {
                await likeListingApi(id);
            }
            set({ mutationStatus: 'success' }); // API call successful
            // Optional: Refetch liked list or specific listing if API returns updated data?
        } catch (error: any) {
            // Revert optimistic UI changes on error
            get()._updateLocalLikeStatus(id, isCurrentlyLiked, originalLikeCount); // Revert counts
             if (isCurrentlyLiked) { // Should be added back to likedListings
                 if (!get().likedListings.some(l => l._id === id)) {
                     set(state => ({ likedListings: [listingInState, ...state.likedListings] }));
                 }
             } else { // Should be removed from likedListings
                  set(state => ({ likedListings: state.likedListings.filter(l => l._id !== id) }));
             }

            const message = error.response?.data?.message || error.message || "Like action failed.";
             console.error("Toggle Like Error:", message);
            set({ mutationStatus: 'error', error: message }); // Set error status
            showErrorToast(message, "Like Error");
        }
    },

    // Marks a listing as traded or available
    markAsTraded: async (id: string, isActive: boolean) => {
        // Find the original listing, primarily expected in myListings
        const originalListing = get().myListings.find(l => l._id === id);
        if (!originalListing) {
            console.warn(`markAsTraded: Listing with id ${id} not found in myListings.`);
            // Potentially check other lists if necessary, but typically this is for user's own listings
            return;
        }
        const originalStatus = originalListing.isActive;

        // Optimistic UI update
        get()._updateLocalListing({ _id: id, isActive });
        set({ mutationStatus: 'loading' }); // Set loading status

        try {
            // Call the API
            await markListingTradedApi(id, isActive);
            set({ mutationStatus: 'success' }); // Set success status
            showSuccessToast(`Listing marked as ${isActive ? 'available' : 'traded'}!`, "Status Updated");
        } catch (error: any) {
            // Revert optimistic UI update on error
            get()._updateLocalListing({ _id: id, isActive: originalStatus });
            const message = error.response?.data?.message || error.message || "Status update failed.";
             console.error("Mark Traded Error:", message);
            set({ mutationStatus: 'error', error: message }); // Set error status
            showErrorToast(message, "Status Error");
        }
    },

    // Resets the entire listing state to its initial values
    resetListingsState: () => set(initialStateData),

    // --- Internal Helper Actions ---
    // Updates a listing across all relevant arrays in the state
    _updateLocalListing: (updatedListing) => {
        const updateFn = (l: Listing) => l._id === updatedListing._id ? { ...l, ...updatedListing } : l;
        set((state) => ({
            feedListings: state.feedListings.map(updateFn),
            myListings: state.myListings.map(updateFn),
            likedListings: state.likedListings.map(updateFn),
            // Update detailed listing if it's the one being changed
            detailedListing: state.detailedListing?._id === updatedListing._id
                ? updateFn(state.detailedListing)
                : state.detailedListing,
        }));
    },

    // Removes a listing from all relevant arrays in the state
    _removeLocalListing: (id: string) => {
        const filterFn = (l: Listing) => l._id !== id;
        set((state) => ({
            feedListings: state.feedListings.filter(filterFn),
            myListings: state.myListings.filter(filterFn),
            likedListings: state.likedListings.filter(filterFn),
            // Clear detailed listing if it's the one being removed
            detailedListing: state.detailedListing?._id === id ? null : state.detailedListing,
        }));
    },

     // Updates the like count for a specific listing across all arrays
    _updateLocalLikeStatus: (id, isLiked, likeCount) => {
        const updateCount = (listing: Listing): Listing => {
            if (listing._id === id) {
                // Use provided likeCount if available, otherwise keep existing (or set to 0 if undefined)
                const newCount = likeCount !== undefined ? Math.max(0, likeCount) : (listing.likeCount ?? 0);
                // Potentially update an isLiked property if your Listing model has one
                // return { ...listing, likeCount: newCount, isLiked: isLiked };
                return { ...listing, likeCount: newCount };
            }
            return listing;
        };

        set((state) => ({
            feedListings: state.feedListings.map(updateCount),
            myListings: state.myListings.map(updateCount),
            likedListings: state.likedListings.map(updateCount),
            // Update detailed listing if it's the one being changed
            detailedListing: state.detailedListing?._id === id && state.detailedListing
                ? updateCount(state.detailedListing)
                : state.detailedListing,
        }));
    },
}));