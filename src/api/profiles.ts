// src/api/profiles.ts
import apiClient from './index';
import {
  UpdateProfileResponseDto,
  FetchMyStallResponseDto,
  UpdateProfileRequestDto, // Ensure this is imported if used explicitly by name
} from '../types';

/**
 * Fetches the current authenticated user's stall data.
 * Called when MyStallScreen is loaded (if not the first setup visit).
 * Reasoning: Allows users to see and edit their previously saved stall.
 * @returns A promise that resolves to the user's stall data or null if not found.
 */
export const fetchMyStallApi = async (): Promise<FetchMyStallResponseDto> => {
  console.log('API CALL: GET /profiles/my-stall');
  const response = await apiClient.get<FetchMyStallResponseDto>('/profiles/my-stall');
  console.log('API RESPONSE: GET /profiles/my-stall', response.data);
  return response.data;
};

/**
 * Creates or updates the current authenticated user's stall.
 * This is the core API call for saving stall changes.
 * It uses FormData to send both structured stall data (as a JSON string)
 * and any new image files.
 * Reasoning: Handles the complex operation of saving the entire stall, including
 * potential new images, in a single atomic request from the frontend's perspective.
 * The backend will process the JSON data and the image files accordingly.
 * @param stallFormData - The FormData object containing 'profileData' (JSON string of UpdateProfileRequestDto)
 * and potentially 'newImageFiles' (actual image file Blobs/objects for new images).
 * @returns A promise that resolves to the full updated UserProfile.
 */
export const updateMyStallApi = async (stallFormData: FormData): Promise<UpdateProfileResponseDto> => {
  console.log('API CALL: PUT /profiles/my-stall with FormData');
  const response = await apiClient.put<UpdateProfileResponseDto>('/profiles/my-stall', stallFormData, {
    headers: {
      // Axios automatically sets 'Content-Type': 'multipart/form-data' with the correct boundary
      // when a FormData object is passed as the request body.
    },
  });
  console.log('API RESPONSE: PUT /profiles/my-stall', response.data);
  return response.data;
};
