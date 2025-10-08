// src/api/users.ts
import apiClient from './index';
import { CreateUserRequestDto, CreateUserResponseDto, DeleteUserResponseDto } from '../types';

/**
 * Creates a basic user profile shell on the backend.
 * Called during the initial setup process after name/PFP selection.
 * Reasoning: Establishes the user's presence in the backend before their first stall save.
 * @param userData - The data for the new user (UUID, Goblin Name, PFP Identifier).
 * @returns A promise that resolves to the created user's basic profile information.
 */
export const createUserApi = async (userData: CreateUserRequestDto): Promise<CreateUserResponseDto> => {
  // Log the data being sent for debugging purposes.
  console.log('API CALL: POST /users', userData);
  const response = await apiClient.post<CreateUserResponseDto>('/users', userData);
  // Log the response received from the backend.
  console.log('API RESPONSE: POST /users', response.data);
  return response.data;
};

/**
 * Deletes the authenticated user's profile and associated data from the backend.
 * Implements GOB-GEN-10.
 */
export const deleteMyUserApi = async (): Promise<DeleteUserResponseDto> => {
  console.log('API CALL: DELETE /users/me');
  // Assuming X-User-UUID header is automatically added by the interceptor
  const response = await apiClient.delete<DeleteUserResponseDto>('/users/me');
  console.log('API RESPONSE: DELETE /users/me', response.data);
  return response.data; // Backend should confirm success
};
