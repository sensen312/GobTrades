import apiClient from './index';
import {
    Listing, FilterParams, FetchListingsResponse, CreateListingResponse,
    UpdateListingResponse, FetchListingByIdResponse, MarkTradedRequest
} from '../types';

export const fetchListingsApi = async (params?: FilterParams): Promise<FetchListingsResponse> => {
    const queryParams = { isActive: true, ...params };
    const apiParams: Record<string, any> = { ...queryParams };
    if (apiParams.categories && Array.isArray(apiParams.categories)) { apiParams.categories = apiParams.categories.join(','); }
    if (apiParams.wantsCategories && Array.isArray(apiParams.wantsCategories)) { apiParams.wantsCategories = apiParams.wantsCategories.join(','); }
    const response = await apiClient.get<FetchListingsResponse>('/listings', { params: apiParams });
    return response.data;
};
export const fetchMyListingsApi = async (params?: FilterParams): Promise<FetchListingsResponse> => {
    const response = await apiClient.get<FetchListingsResponse>('/listings/my', { params });
    return response.data;
};
export const fetchLikedListingsApi = async (params?: FilterParams): Promise<FetchListingsResponse> => {
     const response = await apiClient.get<FetchListingsResponse>('/listings/liked', { params });
    return response.data;
};

/** Fetches details for a single listing. */
export const fetchListingByIdApi = async (listingId: string): Promise<FetchListingByIdResponse> => {
    const response = await apiClient.get<FetchListingByIdResponse>(`/listings/${listingId}`);
    return response.data; // Expects full Listing object
};

/** Creates new listing (sends FormData). */
export const createListingApi = async (listingData: FormData): Promise<CreateListingResponse> => {
    const response = await apiClient.post<CreateListingResponse>('/listings', listingData, {
        headers: { 'Content-Type': 'multipart/form-data' }, // Axios handles boundary
    });
    return response.data; // Expects created Listing object
};

/** Updates existing listing (sends FormData). */
export const updateListingApi = async (listingId: string, listingData: FormData): Promise<UpdateListingResponse> => {
    const response = await apiClient.put<UpdateListingResponse>(`/listings/${listingId}`, listingData, {
        headers: { 'Content-Type': 'multipart/form-data' }, // Axios handles boundary
    });
    return response.data; // Expects updated Listing object
};

/** Deletes a listing. */
export const deleteListingApi = async (listingId: string): Promise<void> => {
    await apiClient.delete(`/listings/${listingId}`); // Expects 204 No Content
};

/** Updates listing active status (traded/available). */
export const markListingTradedApi = async (listingId: string, isActive: boolean): Promise<void> => {
    const requestData: MarkTradedRequest = { isActive };
    await apiClient.patch(`/listings/${listingId}/status`, requestData); // Expects 204 No Content
};

/** Likes a listing (user identified by X-User-UUID header). */
export const likeListingApi = async (listingId: string): Promise<void> => {
    await apiClient.post(`/listings/${listingId}/like`); // Expects 200 OK or 204
};

/** Unlikes a listing (user identified by X-User-UUID header). */
export const unlikeListingApi = async (listingId: string): Promise<void> => {
    await apiClient.delete(`/listings/${listingId}/like`); // Expects 204 No Content
};