import apiClient from './index';
import { CreateUserRequest, CreateUserResponse, UserProfile } from '../types'; // Ensure types are imported

/** Creates a user profile on the backend. */
export const createUserApi = async (userData: CreateUserRequest): Promise<CreateUserResponse> => {
    const response = await apiClient.post<CreateUserResponse>('/users', userData);
    return response.data; // Expects created UserProfile object
};

/** Fetches user profile (example - might not be needed if authStore holds it). */
export const fetchUserProfileApi = async (uuid: string): Promise<UserProfile> => {
    // This endpoint might not exist or be needed if profile is only stored locally after creation
    const response = await apiClient.get<UserProfile>(`/users/${uuid}`); // Example endpoint
    return response.data;
};