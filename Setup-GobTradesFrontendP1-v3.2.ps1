# Instructions:
# 1. Copy the entire block below (from `Write-Host "Starting GobTrades..."` to the final `Write-Host "Ensure your backend..."`).
# 2. Open PowerShell.
# 3. IMPORTANT: Manually navigate to your GobTrades Expo project root in PowerShell BEFORE pasting this script.
#    For example: `cd C:\Users\sense\desktop\Gobtrades`
# 4. Paste the copied content directly into the PowerShell console and press Enter.
# 5. The script will create/update the necessary files in your project.
# 6. After the script completes, review the changes. It's highly recommended to run `npm install`
#    to ensure all dependencies are correctly linked.
# 7. Start your Expo development server: `npx expo start`
#
# This script assumes your Expo project root is `C:\Users\sense\desktop\Gobtrades`.
# If you manually navigated to a different path, the script will operate relative to that path.

Write-Host "Starting GobTrades Frontend Phase 1 setup (v3 with Corrected Path, Ngrok URL & Full Documentation)..."

# Get the current location, assuming the user has manually navigated to the project root.
$FrontendBasePath = Get-Location

Write-Host "Targeting Frontend Project Path: $FrontendBasePath"
# Verify some expected root files/dirs exist to confirm context
if (-not (Test-Path (Join-Path $FrontendBasePath "package.json")) -or -not (Test-Path (Join-Path $FrontendBasePath "App.tsx")) -or -not (Test-Path (Join-Path $FrontendBasePath "src"))) {
    Write-Error "ERROR: Current directory '$FrontendBasePath' does not appear to be the root of the GobTrades Expo project. Key files/folders like 'package.json', 'App.tsx', or 'src/' not found. Please navigate to the correct project root and re-run."
    exit 1
}

# --- Step 1: Delete Obsolete Files and Directories (Task F1.6) ---
Write-Host "Step 1: Deleting obsolete 'listings' feature files and directories..."
$ObsoleteDirs = @(
    (Join-Path $FrontendBasePath "src/features/listings")
)
$ObsoleteFiles = @(
    (Join-Path $FrontendBasePath "src/api/listings.ts"),
    (Join-Path $FrontendBasePath "src/constants/categories.ts"),
    (Join-Path $FrontendBasePath "src/navigation/ListingsStack.tsx")
)

foreach ($dir in $ObsoleteDirs) {
    if (Test-Path $dir) {
        Remove-Item -Recurse -Force -Path $dir
        Write-Host "Deleted directory: $dir"
    } else {
        Write-Host "Directory not found (already deleted or path incorrect?): $dir"
    }
}

foreach ($file in $ObsoleteFiles) {
    if (Test-Path $file) {
        Remove-Item -Force -Path $file
        Write-Host "Deleted file: $file"
    } else {
        Write-Host "File not found (already deleted or path incorrect?): $file"
    }
}
Write-Host "Step 1: Deletion of obsolete files complete."

# --- Step 2: Create New Directories (if they don't exist) ---
Write-Host "Step 2: Ensuring new directory structures exist..."
$NewDirs = @(
    (Join-Path $FrontendBasePath "src/api"),
    (Join-Path $FrontendBasePath "src/assets/fonts"),
    (Join-Path $FrontendBasePath "src/assets/images"),
    (Join-Path $FrontendBasePath "src/components"),
    (Join-Path $FrontendBasePath "src/config"),
    (Join-Path $FrontendBasePath "src/constants"),
    (Join-Path $FrontendBasePath "src/features/auth/components"),
    (Join-Path $FrontendBasePath "src/features/auth/hooks"),
    (Join-Path $FrontendBasePath "src/features/auth/screens"),
    (Join-Path $FrontendBasePath "src/features/auth/store"),
    (Join-Path $FrontendBasePath "src/features/messaging/components"),
    (Join-Path $FrontendBasePath "src/features/messaging/hooks"),
    (Join-Path $FrontendBasePath "src/features/messaging/screens"),
    (Join-Path $FrontendBasePath "src/features/messaging/store"),
    (Join-Path $FrontendBasePath "src/features/profiles/components"),
    (Join-Path $FrontendBasePath "src/features/profiles/hooks"),
    (Join-Path $FrontendBasePath "src/features/profiles/screens"),
    (Join-Path $FrontendBasePath "src/features/profiles/store"),
    (Join-Path $FrontendBasePath "src/features/settings/screens"),
    (Join-Path $FrontendBasePath "src/hooks"),
    (Join-Path $FrontendBasePath "src/navigation"),
    (Join-Path $FrontendBasePath "src/services"),
    (Join-Path $FrontendBasePath "src/theme"),
    (Join-Path $FrontendBasePath "src/types"),
    (Join-Path $FrontendBasePath "src/utils")
)
foreach ($dir in $NewDirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
        Write-Host "Created directory: $dir"
    }
}
Write-Host "Step 2: Directory structure check/creation complete."

# --- Step 3: File Content Definitions with Documentation ---

# src/api/index.ts (Task F1.1 - Updated API_BASE_URL and IMAGE_API_PATH)
$ApiIndexTsContent = @"
// src/api/index.ts
/**
 * This file configures the primary Axios instance used for API communication.
 * It sets up the base URL for the backend, default headers, request timeout,
 * and interceptors for automatically adding the user's UUID to requests
 * and for basic error logging.
 */
import axios from 'axios';
import { useAuthStore } from '../features/auth/store/authStore';

/**
 * The base URL for the GobTrades backend API.
 * This has been updated with your ngrok URL.
 * IMPORTANT: This URL should NOT have a trailing slash.
 */
export const API_BASE_URL = 'https://10d6-71-47-5-48.ngrok-free.app';

/**
 * The base path for accessing images served by the backend.
 * For Phase 1, the backend does not yet serve images. This path is for future use
 * when displaying images that are stored on and served by the backend.
 * This construction assumes backend will serve images from an '/images/' route at its root.
 * Example: `https://10d6-71-47-5-48.ngrok-free.app/images/your-image.jpg`
 * Note: EXPO_PUBLIC_IMAGE_API_PATH is an alternative way to configure this via environment variables.
 */
export const IMAGE_API_PATH = process.env.EXPO_PUBLIC_IMAGE_API_PATH || `${API_BASE_URL.replace(/\/api\/?$/, '')}/images/`;

/**
 * The main Axios instance configured for API calls.
 * - Sets the baseURL to `${API_BASE_URL}/api`.
 * - Default Content-Type is 'application/json'.
 * - Request timeout is set to 20 seconds.
 */
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000, // Increased timeout
});

/**
 * Axios request interceptor.
 * Automatically adds the 'X-User-UUID' header to outgoing requests if a user UUID is available in the authStore.
 * This UUID is used by the backend to identify and authenticate the user for protected endpoints.
 */
apiClient.interceptors.request.use(
  (config) => {
    const { uuid } = useAuthStore.getState();
    if (uuid && config.headers) {
      config.headers['X-User-UUID'] = uuid;
    }
    // console.log('API Request:', config.method?.toUpperCase(), config.url, config.data ? JSON.stringify(config.data) : '', config.headers);
    return config;
  },
  (error) => {
    console.error('API Request Error Interceptor:', error);
    return Promise.reject(error);
  }
);

/**
 * Axios response interceptor.
 * Provides basic logging for API errors.
 */
apiClient.interceptors.response.use(
  (response) => {
    // console.log('API Response:', response.status, response.config.url, JSON.stringify(response.data));
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('API Error Response Data:', error.response.data);
      console.error('API Error Response Status:', error.response.status);
    } else if (error.request) {
      console.error('API No Response/Network Error:', error.request);
    } else {
      console.error('API Setup Error Message:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
"@
$filePath = Join-Path $FrontendBasePath "src/api/index.ts"
$parentDir = Split-Path -Path $filePath -Parent
if (-not (Test-Path $parentDir)) { New-Item -ItemType Directory -Force -Path $parentDir | Out-Null; Write-Host "Created directory: $parentDir" }
Set-Content -Path $filePath -Value $ApiIndexTsContent -Encoding UTF8 -Force
Write-Host "Created/Updated file: $filePath"

# src/types/models.ts (Task F1.1 - Updated UserProfile, Item)
$ModelsTsContent = @"
// src/types/models.ts
/**
 * This file defines the core data model interfaces used throughout the frontend application.
 * These types typically mirror the structure of data stored in the backend MongoDB database
 * and are used for type safety and clarity when handling API responses and application state.
 */

/**
 * Represents an individual item within a user's stall (profile inventory).
 * Each item has an image, a name, and associated timestamps.
 */
export interface Item {
  /**
   * Unique identifier for the item.
   * - For new items created on the client before saving, this will be a client-generated UUID.
   * - For items fetched from the server, this will be the MongoDB ObjectId string.
   */
  _id: string;
  /** The user-defined name of the item. */
  itemName: string;
  /**
   * The filename of the item's image.
   * For Phase 1, this is the filename derived by the client (e.g., from the image picker)
   * and sent to the backend. The backend stores this filename.
   * For Phase 2, the backend will handle actual file uploads and may assign/return this filename.
   */
  imageFilename: string;
  /** ISO 8601 Date string indicating when the item was created (server-generated). Optional on client for new items. */
  createdAt?: string;
  /** ISO 8601 Date string indicating when the item was last updated (server-generated). Optional on client for new items. */
  updatedAt?: string;

  // --- Client-side only properties for managing new images before saving to backend ---
  /** The local URI of an image selected via the image picker, used for display (e.g., 'file:///...'). */
  localImageUri?: string;
  /** A flag to differentiate new images (picked locally) from existing images (referenced by `imageFilename` from server). */
  isNew?: boolean;
}

/**
 * Represents a user's profile and their trading stall.
 * This is the central data model for a user in the application.
 */
export interface UserProfile {
  /** Server-generated MongoDB ObjectId, the primary key in the database. */
  _id: string;
  /** Client-generated unique user identifier (UUID v4), used for API authentication and referencing. */
  uuid: string;
  /** The user's chosen or randomly generated goblin name. */
  goblinName: string;
  /** An identifier string (e.g., 'goblin1') referencing a predefined profile picture asset. */
  pfpIdentifier: string;
  /** An array of `Item` objects representing the user's stall inventory (max 10 items). */
  items: Item[];
  /** An array of strings (tag values) representing tags for items the user is offering (max 4 tags). */
  offeredItemTags: string[];
  /** An array of strings (tag values) representing tags for items the user is looking for (max 4 tags). */
  wantsTags: string[];
  /** A free-text description of the items the user is offering. */
  offeredItemsDescription: string;
  /** A free-text description of the items the user is seeking in trade. */
  wantedItemsDescription: string;
  /** A count of how many other users have 'liked' this user's stall (used for feed sorting). */
  likeCount: number;
  /** ISO 8601 Date string indicating the user's last significant activity. */
  lastActive: string;
  /** ISO 8601 Date string indicating when the user profile was first created. */
  createdAt: string;
  /** ISO 8601 Date string indicating when the user profile was last updated. */
  updatedAt: string;
}

// --- Messaging and Trade Related Models (Stubs for Phase 1, expanded later) ---

/** Represents a preview of a chat conversation, typically displayed in a list. */
export interface ChatPreview {
  /** The unique identifier (MongoDB ObjectId) for the chat. */
  _id: string;
  /** An array containing the UUIDs of the two participants in the chat. */
  participantUuids: string[];
  /** Information about the *other* participant in the chat relative to the current user. */
  otherParticipant: {
    /** The UserProfile UUID of the other participant. */
    uuid: string;
    /** The goblin name of the other participant. */
    goblinName: string;
    /** The PFP identifier of the other participant. */
    pfpIdentifier: string;
  };
  /** A short snippet of the last message text for display in chat lists. */
  lastMessagePreview?: string;
  /** ISO 8601 Date string of when the last message in the chat was sent. */
  lastMessageAt: string; // ISO 8601
  /** Optional: Identifier of a trade request that this chat might have originated from. */
  associatedTradeRequestId?: string;
  /** The number of unread messages in this chat for the current user. */
  unreadCount: number;
}

/** Represents an individual message within a chat. */
export interface Message {
  /**
   * The unique identifier for the message.
   * - Server-generated MongoDB ObjectId for confirmed messages.
   * - Client-generated localId for optimistically displayed messages before server confirmation.
   */
  _id: string;
  /** A temporary client-side ID used for optimistic updates and matching server confirmations. */
  localId?: string;
  /** The ID of the chat this message belongs to. */
  chatId: string;
  /** The UserProfile UUID of the user who sent the message. */
  senderId: string;
  /** The text content of the message. Optional if the message is an image or offer. */
  text?: string;
  /** The filename of an image if the message contains one (relevant for Phase 2+). */
  imageFilename?: string;
  // isOffer?: boolean; // For Phase 2+ trade offers within chat
  // offeredItemId?: string; // For Phase 2+
  /** ISO 8601 Date string indicating when the message was created/sent. */
  createdAt: string; // ISO 8601
  /** Client-side status for UI feedback (e.g., 'sending', 'sent', 'failed', 'read'). */
  status?: 'sending' | 'sent' | 'failed' | 'read';
}

/** Represents a trade request. */
export interface TradeRequest {
    /** Server-generated MongoDB ObjectId for the trade request. */
    _id: string;
    /** The UUID of the user who initiated the request. */
    senderUuid: string;
    /** The UUID of the user who received the request. */
    recipientUuid: string;
    /** The current status of the trade request (e.g., 'pending', 'accepted', 'declined'). */
    status: 'pending' | 'accepted' | 'declined';
    /** ISO 8601 Date string indicating when the trade request was created. */
    createdAt: string; // ISO 8601
    /** Denormalized information about the sender for easy display in request lists. */
    senderProfileInfo?: {
        goblinName: string;
        pfpIdentifier: string;
    };
}
"@
$filePath = Join-Path $FrontendBasePath "src/types/models.ts"
$parentDir = Split-Path -Path $filePath -Parent
if (-not (Test-Path $parentDir)) { New-Item -ItemType Directory -Force -Path $parentDir | Out-Null; Write-Host "Created directory: $parentDir" }
Set-Content -Path $filePath -Value $ModelsTsContent -Encoding UTF8 -Force
Write-Host "Created/Updated file: $filePath"

# src/types/api.ts (Task F1.1 - Updated DTOs)
$ApiTypesTsContent = @"
// src/types/api.ts
/**
 * This file defines the Data Transfer Object (DTO) interfaces for API requests and responses.
 * These types ensure a clear contract between the frontend and backend, and are used by API service functions.
 */
import type { UserProfile, Item, ChatPreview, Message, TradeRequest } from './models';

// --- General ---
/** Generic interface for paginated API responses. */
export interface PaginatedResponse<T> {
  /** The array of items for the current page. */
  items: T[];
  /** Indicates if there are more pages available. */
  hasMore: boolean;
  /** Optional: Total number of items across all pages. */
  totalItems?: number;
  /** Optional: The current page number. */
  currentPage?: number;
  /** Optional: Total number of pages. */
  totalPages?: number;
}

// --- User & Auth ---
/** DTO for creating a new user. Matches backend `UserDtos.CreateUserRequestDto`. */
export interface CreateUserRequestDto {
  uuid: string;
  goblinName: string;
  pfpIdentifier: string;
}
/** Response DTO for user creation. For Phase 1, the backend returns the full UserProfile. */
export type CreateUserResponseDto = UserProfile;

// --- Profile / Stall ---
/** DTO for an item when updating a user's stall. Matches backend `ProfileDtos.UpdateItemDto`. */
export interface UpdateItemDto { // This DTO is part of UpdateProfileRequestDto
  /** MongoDB ObjectId if updating an existing item. Undefined for new items. */
  id?: string;
  /** Client-generated UUID for a new item, used for client-backend mapping if needed (e.g., with image uploads). */
  localId?: string;
  itemName: string;
  /**
   * For Phase 1: Client-derived filename (e.g., from image picker).
   * For Phase 2: Backend will handle actual file uploads and assign/return this filename.
   */
  imageFilename: string;
}

/** DTO for updating the current user's stall. Matches backend `ProfileDtos.UpdateProfileRequestDto`. */
export interface UpdateProfileRequestDto {
  items: UpdateItemDto[];
  offeredItemsDescription: string;
  wantedItemsDescription: string;
  offeredItemTags: string[];
  wantsTags: string[];
  // removedItemIds?: string[]; // For Phase 2+ to explicitly signal item deletions from the stall
}
/** Response DTO after updating a stall. Backend returns the full updated UserProfile. */
export type UpdateProfileResponseDto = UserProfile;
/** DTO representing a user's profile/stall, typically used in GET responses. */
export type UserProfileDto = UserProfile;

// For Profile Feed (Browse Stalls - Phase 3+)
/** Parameters for fetching a list of user profiles/stalls. */
export interface FetchProfilesParamsDto {
  page?: number;
  limit?: number;
  offeredItemTags?: string[]; // Filter by tags of items offered
  wantsTags?: string[];        // Filter by tags of items wanted
  searchTerm?: string;         // Search by goblinName or item names
  sortBy?: 'lastActive' | 'createdAt' | 'likeCount'; // Sorting options
}
/** Response DTO for fetching a paginated list of profiles. */
export type FetchProfilesResponseDto = PaginatedResponse<UserProfileDto>;

// --- Market ---
/** DTO for the market status response. Matches backend `MarketDtos.MarketStatusResponseDto`. */
export interface MarketStatusResponseDto {
  isMarketOpen: boolean;
  endTime: string | null; // ISO 8601 string or null
}

// --- Messaging & Trades (Phase 1 stubs, expanded in later phases) ---
/** DTO for the combined list of chats and trade requests. Matches backend `MessageDtos.FetchChatsAndRequestsResponseDto`. */
export interface FetchChatsAndRequestsResponseDto {
    chats: ChatPreview[];
    tradeRequests: TradeRequest[]; // Backend DTO for TradeRequest should match frontend Model
}

/** Parameters for fetching messages within a chat. Matches backend `MessageDtos.FetchMessagesParamsDto`. */
export interface FetchMessagesParamsDto {
    page?: number;
    limit?: number;
}
/** Response DTO for fetching paginated messages. Message DTO matches frontend Model. */
export type FetchMessagesResponseDto = PaginatedResponse<Message>;

// For Phase 2+ image uploads in chat
/** Response DTO after successfully uploading an image for a chat message. */
export interface UploadChatImageResponseDto {
    imageFilename: string; // Server-assigned filename for the uploaded image
}

// For Phase 4+ Trade Requests
/** Payload for requesting a trade. Matches backend `TradeDtos.RequestTradePayloadDto`. */
export interface RequestTradePayloadDto {
    targetUserUuid: string;
}
/** Response DTO after requesting a trade. Matches backend `TradeDtos.RequestTradeResponseDto`. */
export interface RequestTradeResponseDto {
    status: string; // e.g., 'request_sent', 'chat_created'
    chat?: ChatPreview;
    tradeRequest?: TradeRequest;
    message?: string; // User-facing feedback message
}
/** Payload for responding to a trade request. Matches backend `TradeDtos.RespondToTradeRequestPayloadDto`. */
export interface RespondToTradeRequestPayloadDto {
    tradeRequestId: string;
    accept: boolean;
}
/** Response DTO after responding to a trade request. Matches backend `TradeDtos.RespondToTradeResponseDto`. */
export interface RespondToTradeResponseDto {
    success: boolean;
    chatId?: string; // Included if the trade was accepted and a chat was created/retrieved
    message?: string;
}
"@
$filePath = Join-Path $FrontendBasePath "src/types/api.ts"
$parentDir = Split-Path -Path $filePath -Parent
if (-not (Test-Path $parentDir)) { New-Item -ItemType Directory -Force -Path $parentDir | Out-Null; Write-Host "Created directory: $parentDir" }
Set-Content -Path $filePath -Value $ApiTypesTsContent -Encoding UTF8 -Force
Write-Host "Created/Updated file: $filePath"

# src/api/users.ts (Task F1.1, F1.5 - Simplified)
$ApiUsersTsContent = @"
// src/api/users.ts
/**
 * This file contains API service functions related to user management,
 * primarily for user creation during the initial onboarding flow.
 */
import apiClient from './index';
import { CreateUserRequestDto, CreateUserResponseDto } from '../types';

/**
 * Creates a basic user profile shell on the backend.
 * This is typically called during the initial setup process after the user
 * has chosen their goblin name and profile picture, but before they save their stall for the first time.
 * The backend should handle potential duplicate UUIDs gracefully if this is called multiple times
 * for the same client-generated UUID before the profile is fully established.
 * @param userData - The data required to create the user (UUID, goblinName, pfpIdentifier).
 * @returns A promise that resolves to the created user's profile data.
 */
export const createUserApi = async (userData: CreateUserRequestDto): Promise<CreateUserResponseDto> => {
  console.log('API: Calling createUserApi with data:', userData);
  const response = await apiClient.post<CreateUserResponseDto>('/users', userData);
  console.log('API: createUserApi response:', response.data);
  return response.data;
};

// /**
//  * Deletes the currently authenticated user's account and all associated data.
//  * This is a destructive operation and would be implemented in a later phase.
//  * @returns A promise that resolves when the deletion is complete.
//  */
// export const deleteMyUserApi = async (): Promise<void> => {
//    await apiClient.delete('/users/me'); // Backend needs to implement this endpoint
// };
"@
$filePath = Join-Path $FrontendBasePath "src/api/users.ts"
$parentDir = Split-Path -Path $filePath -Parent
if (-not (Test-Path $parentDir)) { New-Item -ItemType Directory -Force -Path $parentDir | Out-Null; Write-Host "Created directory: $parentDir" }
Set-Content -Path $filePath -Value $ApiUsersTsContent -Encoding UTF8 -Force
Write-Host "Created/Updated file: $filePath"

# src/api/profiles.ts (Task F1.1, F1.3 - New)
$ApiProfilesTsContent = @"
// src/api/profiles.ts
/**
 * This file contains API service functions related to user profiles and their stalls.
 * It includes functions for fetching the current user's stall, updating it,
 * and (for future phases) fetching other users' stalls and interacting with them.
 */
import apiClient from './index';
import {
  UserProfileDto,
  UpdateProfileRequestDto,
  UpdateProfileResponseDto,
  // FetchProfilesParamsDto, // For Phase 3+
  // FetchProfilesResponseDto, // For Phase 3+
} from '../types';

/**
 * Fetches the complete stall/profile data for the currently authenticated user.
 * The backend uses the 'X-User-UUID' header (set by the apiClient interceptor) to identify the user.
 * @returns A promise that resolves to the user's `UserProfileDto` or `null` if not yet created/found.
 */
export const fetchMyStallApi = async (): Promise<UserProfileDto | null> => {
  console.log('API: Calling fetchMyStallApi');
  const response = await apiClient.get<UserProfileDto | null>('/profiles/my-stall');
  console.log('API: fetchMyStallApi response:', response.data);
  return response.data;
};

/**
 * Updates (or creates on the first save) the current user's stall/profile data.
 * For Phase 1, this sends JSON data including item names and client-derived image filenames.
 * The backend's Phase 1 `PUT /api/profiles/my-stall` endpoint expects this JSON format.
 * For Phase 2, if actual image files are being uploaded, this function (or a new one)
 * would need to be adapted to send `multipart/form-data`.
 * @param payload - The `UpdateProfileRequestDto` containing the stall data to save.
 * @returns A promise that resolves to the updated `UserProfileDto` from the backend.
 */
export const updateMyStallApi = async (payload: UpdateProfileRequestDto): Promise<UpdateProfileResponseDto> => {
  console.log('API: Calling updateMyStallApi with payload:', payload);
  // Phase 1: Backend expects JSON with imageFilenames.
  const response = await apiClient.put<UpdateProfileResponseDto>('/profiles/my-stall', payload);
  console.log('API: updateMyStallApi response:', response.data);
  return response.data;
};

// --- Functions for Future Phases (e.g., Phase 3 - Browse other stalls, Liking) ---

// /**
//  * Fetches a paginated feed of other users' profiles/stalls.
//  * @param params - Optional parameters for filtering, sorting, and pagination.
//  * @returns A promise resolving to a paginated list of `UserProfileDto`.
//  */
// export const fetchProfilesApi = async (params?: FetchProfilesParamsDto): Promise<FetchProfilesResponseDto> => {
//    const response = await apiClient.get<FetchProfilesResponseDto>('/profiles/feed', { params }); // Assuming feed endpoint is '/profiles/feed'
//    return response.data;
// };

// /**
//  * Fetches a specific user's public profile/stall by their UUID.
//  * @param uuid - The UUID of the user whose profile is to be fetched.
//  * @returns A promise resolving to the `UserProfileDto`.
//  */
// export const fetchProfileByUuidApi = async (uuid: string): Promise<UserProfileDto> => {
//    const response = await apiClient.get<UserProfileDto>(`/profiles/${uuid}`);
//    return response.data;
// };

// /**
//  * Likes another user's profile/stall.
//  * The backend uses the 'X-User-UUID' header to identify the user performing the like.
//  * @param targetUserUuid - The UUID of the user whose profile is being liked.
//  * @returns A promise that resolves when the like action is completed.
//  */
// export const likeProfileApi = async (targetUserUuid: string): Promise<void> => { // Assuming backend handles like count
//    await apiClient.post(`/profiles/${targetUserUuid}/like`);
// };
"@
$filePath = Join-Path $FrontendBasePath "src/api/profiles.ts"
$parentDir = Split-Path -Path $filePath -Parent
if (-not (Test-Path $parentDir)) { New-Item -ItemType Directory -Force -Path $parentDir | Out-Null; Write-Host "Created directory: $parentDir" }
Set-Content -Path $filePath -Value $ApiProfilesTsContent -Encoding UTF8 -Force
Write-Host "Created/Updated file: $filePath"

# src/api/market.ts (Task F1.1 - Verified)
$ApiMarketTsContent = @"
// src/api/market.ts
/**
 * This file contains API service functions related to the market's status,
 * such as whether it's open and when it closes.
 */
import apiClient from './index';
import { MarketStatusResponseDto } from '../types';

/**
 * Fetches the current status of the Goblin Market.
 * @returns A promise that resolves to an object containing `isMarketOpen` (boolean)
 * and `endTime` (ISO 8601 string or null).
 */
export const fetchMarketStatusApi = async (): Promise<MarketStatusResponseDto> => {
  console.log('API: Calling fetchMarketStatusApi');
  const response = await apiClient.get<MarketStatusResponseDto>('/market/status');
  console.log('API: fetchMarketStatusApi response:', response.data);
  return response.data;
};
"@
$filePath = Join-Path $FrontendBasePath "src/api/market.ts"
$parentDir = Split-Path -Path $filePath -Parent
if (-not (Test-Path $parentDir)) { New-Item -ItemType Directory -Force -Path $parentDir | Out-Null; Write-Host "Created directory: $parentDir" }
Set-Content -Path $filePath -Value $ApiMarketTsContent -Encoding UTF8 -Force
Write-Host "Created/Updated file: $filePath"

# src/api/trades.ts (Task F1.1, F1.3 - New, stubs for later phases)
$ApiTradesTsContent = @"
// src/api/trades.ts
/**
 * This file will contain API service functions related to trade requests and their lifecycle.
 * For Phase 1, these are largely placeholders as the core trade functionality is planned for later phases.
 * The backend endpoints for these are also likely stubbed or not yet fully implemented in Phase 1.
 */
// import apiClient from './index';
// import {
//    RequestTradePayloadDto,
//    RequestTradeResponseDto,
//    RespondToTradeRequestPayloadDto,
//    RespondToTradeResponseDto,
// } from '../types';

// --- Functions for Future Phases (e.g., Phase 4 - Trade Lifecycle) ---

// /**
//  * Initiates a trade request to another user.
//  * @param payload - Contains the UUID of the target user.
//  * @returns A promise resolving to the response from the backend, indicating request status.
//  */
// export const requestTradeApi = async (payload: RequestTradePayloadDto): Promise<RequestTradeResponseDto> => {
//    const response = await apiClient.post<RequestTradeResponseDto>('/trades/request', payload);
//    return response.data;
// };

// /**
//  * Responds to an incoming trade request (accept or decline).
//  * @param payload - Contains the trade request ID and the accept/decline action.
//  * @returns A promise resolving to the response, indicating success and potentially a new chat ID.
//  */
// export const respondToTradeRequestApi = async (payload: RespondToTradeRequestPayloadDto): Promise<RespondToTradeResponseDto> => {
//    const response = await apiClient.post<RespondToTradeResponseDto>('/trades/respond', payload);
//    return response.data;
// };

// Note: Fetching pending trade requests is handled by `fetchChatsAndRequestsApi` in `src/api/message.ts` for Phase 1.
"@
$filePath = Join-Path $FrontendBasePath "src/api/trades.ts"
$parentDir = Split-Path -Path $filePath -Parent
if (-not (Test-Path $parentDir)) { New-Item -ItemType Directory -Force -Path $parentDir | Out-Null; Write-Host "Created directory: $parentDir" }
Set-Content -Path $filePath -Value $ApiTradesTsContent -Encoding UTF8 -Force
Write-Host "Created/Updated file: $filePath"

# src/constants/tags.ts (Task F1.11 - New)
$ConstantsTagsTsContent = @"
// src/constants/tags.ts
/**
 * This file defines the predefined list of tags that users can select
 * for categorizing their offered items and the items they are seeking.
 */

/** Interface for a tag option, used in selection components. */
export interface TagOption {
  /** The human-readable label displayed to the user. */
  label: string;
  /** The underlying value stored in the database and used for filtering. */
  value: string;
}

/**
 * Predefined list of tags for stall items.
 * Users can select up to 4 of these for items they offer and items they want.
 */
export const STALL_TAGS: TagOption[] = [
  { label: 'Shiny Bits', value: 'shiny_bits' },
  { label: 'Old Scrolls', value: 'old_scrolls' },
  { label: 'Rusty Metal', value: 'rusty_metal' },
  { label: 'Magic Trinkets', value: 'magic_trinkets' },
  { label: 'Goblin Gear', value: 'goblin_gear' },
  { label: 'Strange Brews', value: 'strange_brews' },
  { label: 'Questionable Food', value: 'questionable_food' },
  { label: 'Handmade Junk', value: 'handmade_junk' },
  { label: 'Lost & Found', value: 'lost_and_found' },
  { label: 'Sparkly Rocks', value: 'sparkly_rocks' },
  { label: 'Mysterious Orbs', value: 'mysterious_orbs' },
  { label: 'Forgotten Lore', value: 'forgotten_lore' },
  { label: 'Beast Parts', value: 'beast_parts' },
  { label: 'Dubious Devices', value: 'dubious_devices' },
  { label: 'Ancient Artifacts', value: 'ancient_artifacts' },
  { label: 'Cursed Items', value: 'cursed_items' },
  { label: 'Wearables', value: 'wearables' },
  { label: 'Decorations', value: 'decorations' },
  { label: 'Potions & Elixirs', value: 'potions_elixirs' },
  { label: 'Tools & Contraptions', value: 'tools_contraptions' },
];
"@
$filePath = Join-Path $FrontendBasePath "src/constants/tags.ts"
$parentDir = Split-Path -Path $filePath -Parent
if (-not (Test-Path $parentDir)) { New-Item -ItemType Directory -Force -Path $parentDir | Out-Null; Write-Host "Created directory: $parentDir" }
Set-Content -Path $filePath -Value $ConstantsTagsTsContent -Encoding UTF8 -Force
Write-Host "Created/Updated file: $filePath"

# src/features/auth/store/authStore.ts (Task F1.3, F1.9 - Updated)
$AuthStoreTsContent = @"
// src/features/auth/store/authStore.ts
/**
 * Zustand store for managing authentication state and user identity.
 * Handles:
 * - Loading user identity from AsyncStorage.
 * - Initializing a temporary profile during setup (before first stall save).
 * - Finalizing authentication after the first successful stall save.
 * - Clearing user profile and data on logout/account retirement.
 */
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { createUserApi } from '../../../api/users';
import { UserProfileDto, CreateUserRequestDto } from '../../../types';
import { showErrorToast } from '../../../utils/toast';
import { useProfileStore } from '../../profiles/store/profileStore'; // For resetting profile data on logout

/** Key for storing minimal authentication info in AsyncStorage. */
const AUTH_STORAGE_KEY = 'gobtrades_auth_v1';

/** Structure for the minimal auth info stored locally. */
interface MinimalAuthInfo {
  uuid: string;
  goblinName: string;
  pfpIdentifier: string;
}

/** Defines the shape of the authentication state and actions. */
interface AuthState {
  /** The user's unique identifier (client-generated UUID). Null if not yet set. */
  uuid: string | null;
  /** The user's chosen goblin name. Null if not yet set. */
  goblinName: string | null;
  /** The identifier for the user's chosen profile picture. Null if not yet set. */
  pfpId: string | null;
  /** True if the user has completed the initial setup AND their first stall save. */
  isAuthenticated: boolean;
  /** True after the SetupScreen is completed, but before the first stall save. */
  isProfileInitialized: boolean;
  /** True if an auth-related async operation (load, initialize) is in progress. */
  isLoading: boolean;
  /** Stores any error message from auth operations. */
  error: string | null;

  /** Action to load authentication info from AsyncStorage on app start. */
  loadFromStorage: () => Promise<void>;
  /**
   * Action called from SetupScreen. Stores name/PFP temporarily and creates a basic user record on the backend.
   * Does NOT set isAuthenticated to true yet.
   * @param name - The chosen goblin name.
   * @param pfpId - The chosen PFP identifier.
   * @returns True if initialization was successful, false otherwise.
   */
  initializeProfile: (name: string, pfpId: string) => Promise<boolean>;
  /**
   * Action called by profileStore after the *first successful stall save*.
   * Persists essential auth info (UUID, name, PFP ID) to AsyncStorage and sets isAuthenticated to true.
   * @param profile - The UserProfileDto received from the backend after the first stall save.
   */
  finalizeAuthentication: (profile: UserProfileDto) => Promise<void>;
  /** Action to clear all user authentication info, related stall data, and log out. */
  clearProfileAndData: () => Promise<void>;
  /** Action to reset loading and error states. */
  resetAuthStatus: () => void;
}

/**
 * Creates the Zustand store for authentication.
 * Initial state: User is not authenticated, not initialized, and loading from storage.
 */
export const useAuthStore = create<AuthState>((set, get) => ({
  uuid: null,
  goblinName: null,
  pfpId: null,
  isAuthenticated: false,
  isProfileInitialized: false,
  isLoading: true,
  error: null,

  loadFromStorage: async () => {
    set({ isLoading: true, error: null });
    try {
      const storedAuthJson = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (storedAuthJson) {
        const storedAuth: MinimalAuthInfo = JSON.parse(storedAuthJson);
        if (storedAuth.uuid && storedAuth.goblinName && storedAuth.pfpIdentifier) {
          set({
            uuid: storedAuth.uuid,
            goblinName: storedAuth.goblinName,
            pfpId: storedAuth.pfpIdentifier,
            isAuthenticated: true, // User has previously completed setup and first stall save
            isProfileInitialized: true,
            isLoading: false,
          });
          console.log('AuthStore: Auth info loaded from storage.');
          return;
        }
      }
      // No valid stored auth info, or first launch
      set({ isAuthenticated: false, isProfileInitialized: false, isLoading: false });
      console.log('AuthStore: No valid auth info in storage or first launch.');
    } catch (e: any) {
      console.error('AuthStore: Failed to load auth info from storage:', e);
      set({ isAuthenticated: false, isProfileInitialized: false, isLoading: false, error: 'Failed to load session.' });
    }
  },

  initializeProfile: async (name, pfpId) => {
    set({ isLoading: true, error: null });
    const newUuid = uuid.v4() as string; // Generate client-side UUID
    const requestData: CreateUserRequestDto = { uuid: newUuid, goblinName: name, pfpIdentifier: pfpId };
    try {
      // Call backend to create a basic user record.
      // This user is not yet "fully" authenticated in the app's flow until their first stall is saved.
      await createUserApi(requestData);
      set({
        uuid: newUuid,
        goblinName: name,
        pfpId: pfpId,
        isProfileInitialized: true, // SetupScreen is complete
        isAuthenticated: false,      // Still false until first stall save
        isLoading: false,
      });
      console.log(`AuthStore: Profile initialized locally (UUID: ${newUuid}) and basic user record created on backend.`);
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to initialize profile.';
      console.error('AuthStore: Initialize Profile Error:', message);
      set({ isLoading: false, error: message, isProfileInitialized: false });
      showErrorToast(message, 'Setup Error');
      return false;
    }
  },

  finalizeAuthentication: async (profile: UserProfileDto) => {
    // This action is called by profileStore after the first successful stall save.
    // It means the user has a complete profile on the backend and is now fully authenticated.
    const authDataToStore: MinimalAuthInfo = {
        uuid: profile.uuid,
        goblinName: profile.goblinName,
        pfpIdentifier: profile.pfpIdentifier,
    };
    try {
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authDataToStore));
        set({
            uuid: profile.uuid,
            goblinName: profile.goblinName,
            pfpId: profile.pfpIdentifier,
            isAuthenticated: true, // User is now fully authenticated
            isProfileInitialized: true, // Should already be true
            isLoading: false,
            error: null,
        });
        console.log('AuthStore: Authentication finalized. Auth info saved to storage.');
    } catch (error: any) {
        console.error('AuthStore: Failed to save finalized auth info to storage:', error);
        set({ isLoading: false, error: "Failed to persist session details after stall save." });
        // This is a non-critical error for the user flow at this point, but should be logged.
    }
  },

  clearProfileAndData: async () => {
    set({ isLoading: true });
    try {
      // Future: await deleteMyUserApi(); // Call backend to delete user data (Phase 5)
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      await AsyncStorage.removeItem('gobtrades_my_stall_v1'); // Also clear profileStore's data

      // Reset profileStore state
      const { resetProfileState } = useProfileStore.getState();
      resetProfileState();

      // Reset authStore state
      set({
        uuid: null, goblinName: null, pfpId: null,
        isAuthenticated: false, isProfileInitialized: false,
        isLoading: false, error: null
      });
      console.log('AuthStore: Profile and all local data cleared.');
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to clear profile and data.';
      console.error('AuthStore: Clear Profile & Data Error:', message);
      set({ isLoading: false, error: message });
      showErrorToast(message, 'Logout Error');
    }
  },

  resetAuthStatus: () => set({ isLoading: false, error: null }),
}));
"@
$filePath = Join-Path $FrontendBasePath "src/features/auth/store/authStore.ts"
$parentDir = Split-Path -Path $filePath -Parent
if (-not (Test-Path $parentDir)) { New-Item -ItemType Directory -Force -Path $parentDir | Out-Null; Write-Host "Created directory: $parentDir" }
Set-Content -Path $filePath -Value $AuthStoreTsContent -Encoding UTF8 -Force
Write-Host "Created/Updated file: $filePath"

# src/features/profiles/store/profileStore.ts (Task F1.3 - New)
$ProfileStoreTsContent = @"
// src/features/profiles/store/profileStore.ts
/**
 * Zustand store for managing user profile and stall data.
 * Handles:
 * - Fetching and storing the current user's own stall data.
 * - Managing local edits to the stall before saving.
 * - Saving stall data to the backend.
 * - (Future Phases) Managing the feed of other users' stalls and viewed profile details.
 */
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfileDto, Item, UpdateProfileRequestDto, UpdateItemDto } from '../../../types';
import { fetchMyStallApi, updateMyStallApi } from '../../../api/profiles';
import { showErrorToast, showSuccessToast } from '../../../utils/toast';
import { useAuthStore } from '../../auth/store/authStore'; // To finalize auth on first save

/** Key for storing the user's own stall data in AsyncStorage for optimistic loading/offline access. */
const MY_STALL_STORAGE_KEY = 'gobtrades_my_stall_v1';

/** Represents the status of profile-related data operations. */
type ProfileStatus = 'idle' | 'loading' | 'success' | 'error';

/** Defines the shape of the profile state and actions. */
export interface ProfileState {
  /** The current user's stall data, reflecting local edits. Null if no stall created/loaded. */
  myStallData: UserProfileDto | null;
  /** The last successfully saved version of the user's stall data from the server. Used for reverting changes. */
  myStallServerData: UserProfileDto | null;
  /** Status of fetching or saving the user's own stall data. */
  myStallStatus: ProfileStatus;
  /** True if `myStallData` has local changes not yet saved to the server. */
  hasUnsavedChanges: boolean;

  // --- Placeholders for Future Phases ---
  // viewedProfile: UserProfileDto | null;
  // viewedProfileStatus: ProfileStatus;
  // feedProfiles: UserProfileDto[];
  // feedStatus: ProfileStatus;
  // feedPagination: { page: number; hasMore: boolean };

  /** Stores any error message from profile operations. */
  error: string | null;

  // --- Actions ---
  /** Fetches the current user's stall data from the backend and/or local storage. */
  fetchMyStall: () => Promise<void>;
  /**
   * Saves the current local stall data (`myStallData`) to the backend.
   * On the first successful save, it also finalizes the user's authentication.
   * @param stallDataToSave - The `UpdateProfileRequestDto` payload.
   * @returns A promise resolving to the saved `UserProfileDto` or null on failure.
   */
  saveMyStall: (stallDataToSave: UpdateProfileRequestDto) => Promise<UserProfileDto | null>;
  /**
   * Updates a specific field (excluding 'items') in the local `myStallData`.
   * Sets `hasUnsavedChanges` to true.
   * @param field - The key of the UserProfileDto field to update.
   * @param value - The new value for the field.
   */
  updateLocalStallData: (updatedData: Partial<Omit<UserProfileDto, 'items'>>) => void;
  /**
   * Replaces the entire `items` array in the local `myStallData`.
   * Used by `MyStallScreen` to update items based on ImagePickerInput and item name changes.
   * Sets `hasUnsavedChanges` to true.
   * @param items - The new array of `Item` objects.
   */
  setLocalStallItems: (items: Item[]) => void;
  /** Sets the `hasUnsavedChanges` flag. */
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  /** Reverts local `myStallData` to the last saved state (`myStallServerData`). */
  revertLocalStallChanges: () => void;
  /** Resets the entire profile store to its initial state (e.g., on logout). */
  resetProfileState: () => void;
}

/** Initial state for the profile store. */
const initialProfileStateData: Omit<ProfileState, keyof ReturnType<typeof createProfileActions>> = {
  myStallData: null,
  myStallServerData: null,
  myStallStatus: 'idle',
  hasUnsavedChanges: false,
  error: null,
};

// Helper function to define actions separately, improving readability
const createProfileActions = (set: (fn: (state: ProfileState) => Partial<ProfileState> | ProfileState) => void, get: () => ProfileState) => ({
  fetchMyStall: async () => {
    const { uuid } = useAuthStore.getState();
    if (!uuid) {
      console.warn('ProfileStore: fetchMyStall - No user UUID found.');
      set({ myStallStatus: 'idle', error: 'User not identified for stall fetch.' }); // Not necessarily an error if user just initialized
      return;
    }
    set({ myStallStatus: 'loading', error: null });
    try {
      const serverStallData = await fetchMyStallApi(); // API uses X-User-UUID

      // Attempt to load from AsyncStorage if server returns null (e.g., first time after setup, before first save)
      let finalDataToUse = serverStallData;
      if (!serverStallData) {
        const storedStallJson = await AsyncStorage.getItem(MY_STALL_STORAGE_KEY);
        if (storedStallJson) {
          const storedStall = JSON.parse(storedStallJson) as UserProfileDto;
          // Ensure stored stall belongs to current user
          if (storedStall.uuid === uuid) {
            finalDataToUse = storedStall;
            console.log('ProfileStore: Using stall data from AsyncStorage as server returned null.');
          }
        }
      }

      set({
        myStallData: finalDataToUse ? { ...finalDataToUse } : null,
        myStallServerData: finalDataToUse ? { ...finalDataToUse } : null,
        myStallStatus: 'success',
        hasUnsavedChanges: false, // Reset on successful fetch
      });
      console.log('ProfileStore: MyStall data fetch/load attempt complete.');
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Could not load your stall.';
      console.error('ProfileStore: Fetch MyStall Error:', message);
      set({ myStallStatus: 'error', error: message });
      // showErrorToast(message, 'Stall Load Error'); // Toast might be too aggressive on initial load failure
    }
  },

  saveMyStall: async (stallDataToSave: UpdateProfileRequestDto) => {
    const { uuid, goblinName, pfpIdentifier, finalizeAuthentication, isAuthenticated } = useAuthStore.getState();
    if (!uuid || !goblinName || !pfpIdentifier) {
      showErrorToast('User identity not fully set up. Cannot save stall.', 'Save Error');
      set({ myStallStatus: 'error', error: 'User identity missing for stall save.' });
      return null;
    }
    set({ myStallStatus: 'loading', error: null });
    try {
      // For Phase 1, imageFilenames are sent directly.
      // For Phase 2, actual image files would be handled here or in the API service.
      // The `stallDataToSave` should already be prepared by MyStallScreen with correct imageFilenames.

      const updatedProfile = await updateMyStallApi(stallDataToSave); // API uses X-User-UUID

      await AsyncStorage.setItem(MY_STALL_STORAGE_KEY, JSON.stringify(updatedProfile));

      set({
        myStallData: { ...updatedProfile },
        myStallServerData: { ...updatedProfile },
        myStallStatus: 'success',
        hasUnsavedChanges: false,
      });

      // If this was the first successful stall save (user was initialized but not fully authenticated)
      if (!isAuthenticated) {
        await finalizeAuthentication(updatedProfile); // Finalize auth state and save to AsyncStorage
      }

      showSuccessToast('Stall saved successfully!', 'Success');
      return updatedProfile;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Could not save your stall.';
      console.error('ProfileStore: Save MyStall Error:', message);
      set({ myStallStatus: 'error', error: message });
      showErrorToast(message, 'Stall Save Error');
      return null;
    }
  },

  updateLocalStallData: (updatedData) => {
    set(state => ({
      myStallData: state.myStallData
        ? { ...state.myStallData, ...updatedData }
        : { // Handle case where myStallData might be null initially during setup
            _id: '', // These will be overwritten by server or properly initialized
            uuid: useAuthStore.getState().uuid || '',
            goblinName: useAuthStore.getState().goblinName || '',
            pfpIdentifier: useAuthStore.getState().pfpId || '',
            items: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastActive: new Date().toISOString(),
            likeCount: 0,
            ...updatedData, // Apply the partial update
          },
      hasUnsavedChanges: true,
    }));
  },

  setLocalStallItems: (items) => {
      set(state => ({
        myStallData: state.myStallData
          ? { ...state.myStallData, items: [...items] } // Ensure new array for reactivity
          : { // Should ideally not be null if items are being set after profile init
              _id: '', uuid: useAuthStore.getState().uuid || '', goblinName: '', pfpIdentifier: '', createdAt: '', updatedAt: '', lastActive: '', likeCount: 0,
              offeredItemTags: [], wantsTags: [], offeredItemsDescription: '', wantedItemsDescription: '',
              items: [...items],
            },
        hasUnsavedChanges: true,
    }));
  },

  setHasUnsavedChanges: (hasChanges) => set({ hasUnsavedChanges: hasChanges }),

  revertLocalStallChanges: () => {
    set(state => {
      if (state.myStallServerData) {
        return {
          myStallData: { ...state.myStallServerData },
          hasUnsavedChanges: false,
        };
      }
      // If no server data (e.g. initial setup and navigated away before first save),
      // revert to a blank state. MyStallScreen will re-initialize from authStore for name/pfp.
      return {
        myStallData: null, // Or a minimal empty profile structure if preferred
        hasUnsavedChanges: false
      };
    });
  },

  resetProfileState: () => {
    console.log("ProfileStore: Resetting state.");
    set(initialProfileStateData);
    AsyncStorage.removeItem(MY_STALL_STORAGE_KEY).catch(err => console.error("ProfileStore: Failed to clear stall from storage on reset", err));
  },
});

/** Zustand store for managing user profile and stall data. */
export const useProfileStore = create<ProfileState>()((set, get) => ({
  ...initialProfileStateData,
  ...createProfileActions(set, get),
}));
"@
$filePath = Join-Path $FrontendBasePath "src/features/profiles/store/profileStore.ts"
$parentDir = Split-Path -Path $filePath -Parent
if (-not (Test-Path $parentDir)) { New-Item -ItemType Directory -Force -Path $parentDir | Out-Null; Write-Host "Created directory: $parentDir" }
Set-Content -Path $filePath -Value $ProfileStoreTsContent -Encoding UTF8 -Force
Write-Host "Created/Updated file: $filePath"

# src/navigation/types.ts (Updated for Profile-Centric Model)
$NavTypesTsContent = @"
// src/navigation/types.ts
/**
 * This file defines TypeScript types for React Navigation, ensuring type safety
 * for route names, parameters, and navigation props across different navigators.
 */
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams, CompositeScreenProps } from '@react-navigation/native';

// --- Parameter Lists for Navigators ---

/** Parameters for screens within the Authentication flow (before user is fully authenticated). */
export type AuthStackParamList = {
  /** Screen for checking auth status and loading initial data. */
  AuthLoading: undefined;
  /** Screen for new user persona setup (goblin name, PFP). */
  Setup: undefined;
  /** Screen for initial stall creation, part of the auth flow after SetupScreen. */
  MyStallSetup: undefined;
};

/** Parameters for screens within the ""Trades"" / ""Profile Feed"" tab. */
export type ProfileFeedStackParamList = {
  /** Main screen displaying a feed of other users' stalls/profiles. */
  ProfileFeedScreen: undefined;
  /** Screen for viewing the detailed stall/profile of another user. */
  ProfileDetailScreen: { userUuid: string }; // Pass user's UUID to fetch their profile
  // ChatScreen might be navigated to from here if initiating chat from a profile
};

/**
 * Parameters for screens within the ""Messages"" tab.
 * This stack handles listing chats/trade requests and individual chat conversations.
 */
export type MessagesStackParamList = {
  /** Screen listing all active chats and pending trade requests. */
  MessagingListScreen: undefined;
  /** Screen for an individual chat conversation. */
  ChatScreen: {
    /** Optional: Existing chat ID. If not provided, a new chat might be initiated. */
    chatId?: string;
    /** UUID of the other user in the chat. Required to identify/create chat. */
    targetUserUuid: string;
    /** Optional: Name of the other user, for display in chat header. */
    targetUserName?: string;
    /** Optional: PFP identifier of the other user. */
    targetUserPfpIdentifier?: string;
    /** Optional: ID of an item being discussed, to show context within the chat. */
    contextItemId?: string; // Or contextStallItemId if more appropriate
  };
  /** Screen for viewing another user's stall, possibly from a trade request or chat context. */
  ProfileDetailScreen: { userUuid: string };
};

/** Parameters for the main bottom tab navigator. */
export type MainTabsParamList = {
  /** The ""Trades"" or ""Feed"" tab, which hosts the ProfileFeedNavigator stack. */
  ProfileFeed: NavigatorScreenParams<ProfileFeedStackParamList>;
  /** The center ""My Stall"" tab, directly rendering the MyStallScreen component. */
  MyStall: undefined;
  /** The ""Messages"" tab, which hosts the MessagesNavigator stack. */
  Messages: NavigatorScreenParams<MessagesStackParamList>;
};

/** Parameters for the root App Stack navigator, which switches between Auth and Main flows. */
export type AppStackParamList = {
  /** The authentication flow navigator. */
  Auth: NavigatorScreenParams<AuthStackParamList>;
  /** The main application navigator (bottom tabs). */
  Main: NavigatorScreenParams<MainTabsParamList>;
  /** A global settings screen accessible from the main app. */
  Settings: undefined;
  // Add other global modal screens here if needed in the future, e.g.:
  // FilterModal: undefined;
  // ImageZoomModal: { imageUrl: string };
};

// --- Screen Props Types for Type-Safe Navigation ---

/** Generic type for screen props within the root AppStack. */
export type AppScreenProps<T extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, T>;

/** Generic type for screen props within the AuthStack, including AppStack context. */
export type AuthScreenProps<T extends keyof AuthStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList, T>,
  AppScreenProps<keyof AppStackParamList>
>;

/** Generic type for screen props within the MainTabs, including AppStack context. */
export type MainTabsScreenProps<T extends keyof MainTabsParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabsParamList, T>,
  AppScreenProps<keyof AppStackParamList>
>;

/** Generic type for screen props within the ProfileFeedStack, including MainTabs and AppStack context. */
export type ProfileFeedScreenProps<T extends keyof ProfileFeedStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<ProfileFeedStackParamList, T>,
  MainTabsScreenProps<keyof MainTabsParamList>
>;

/** Generic type for screen props within the MessagesStack, including MainTabs and AppStack context. */
export type MessagesScreenProps<T extends keyof MessagesStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<MessagesStackParamList, T>,
  MainTabsScreenProps<keyof MainTabsParamList>
>;
"@
$filePath = Join-Path $FrontendBasePath "src/navigation/types.ts"
$parentDir = Split-Path -Path $filePath -Parent
if (-not (Test-Path $parentDir)) { New-Item -ItemType Directory -Force -Path $parentDir | Out-Null; Write-Host "Created directory: $parentDir" }
Set-Content -Path $filePath -Value $NavTypesTsContent -Encoding UTF8 -Force
Write-Host "Created/Updated file: $filePath"

# src/navigation/ProfileFeedNavigator.tsx (Task F1.2 - New, Stub for Phase 1)
$ProfileFeedNavigatorTsxContent = @"
// src/navigation/ProfileFeedNavigator.tsx
/**
 * Stack navigator for the ""Trades Board"" or ""Profile Feed"" section.
 * This navigator is nested within the ""ProfileFeed"" tab of the MainNavigator.
 * For Phase 1, it primarily contains the ProfileFeedScreen (as a stub).
 * In later phases (e.g., Phase 3), it will include ProfileDetailScreen.
 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@gluestack-ui/themed'; // For theming header styles
import { ProfileFeedStackParamList } from './types'; // Type definitions for this stack

// Import Screens
import ProfileFeedScreen from '../features/profiles/screens/ProfileFeedScreen';
// import ProfileDetailScreen from '../features/profiles/screens/ProfileDetailScreen'; // For Phase 3

const Stack = createNativeStackNavigator<ProfileFeedStackParamList>();

const ProfileFeedNavigator: React.FC = () => {
  const { colors, fonts } = useTheme(); // Access theme tokens for styling

  return (
    <Stack.Navigator
      initialRouteName="ProfileFeedScreen"
      screenOptions={{
        // Common header styles for screens in this stack
        headerStyle: { backgroundColor: colors.backgroundCard as string }, // Use themed background
        headerTintColor: colors.textPrimary as string, // Color for back button and title
        headerTitleStyle: { fontFamily: fonts.heading as string }, // Use themed heading font
        headerBackTitleVisible: false, // Hide back button text on iOS
        headerTitleAlign: 'center', // Center align header titles
      }}
    >
      <Stack.Screen
        name="ProfileFeedScreen"
        component={ProfileFeedScreen}
        options={{ title: 'Trades Board' }} // Screen-specific title
      />
      {/*
      // ProfileDetailScreen will be added in a later phase (e.g., Phase 3)
      <Stack.Screen
      name="ProfileDetailScreen"
      component={ProfileDetailScreen}
      // Title can be set dynamically based on route params
      options={({ route }) => ({ title: route.params?.userProfile?.goblinName || 'Stall Details' })}
      />
      */}
    </Stack.Navigator>
  );
};

export default ProfileFeedNavigator;
"@
$filePath = Join-Path $FrontendBasePath "src/navigation/ProfileFeedNavigator.tsx"
$parentDir = Split-Path -Path $filePath -Parent
if (-not (Test-Path $parentDir)) { New-Item -ItemType Directory -Force -Path $parentDir | Out-Null; Write-Host "Created directory: $parentDir" }
Set-Content -Path $filePath -Value $ProfileFeedNavigatorTsxContent -Encoding UTF8 -Force
Write-Host "Created/Updated file: $filePath"

# src/navigation/MainNavigator.tsx (Task F1.2 - Updated)
$MainNavigatorTsxContent = @"
// src/navigation/MainNavigator.tsx
/**
 * The main bottom tab navigator for the authenticated part of the application.
 * It includes tabs for Browse profiles (""Trades""), managing the user's own stall (""My Stall""),
 * and accessing messages/trade requests (""Messages"").
 * It also uses a custom AppHeader for all its screens.
 */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme, Box } from '@gluestack-ui/themed'; // For theming and badge container
import { useChatStore } from '../features/messaging/store/chatStore'; // For unread message count badge

import ProfileFeedNavigator from './ProfileFeedNavigator'; // Navigator for the ""Trades""/""ProfileFeed"" tab
import MessagesNavigator from './MessagesNavigator';      // Navigator for the ""Messages"" tab
import MyStallScreen from '../features/profiles/screens/MyStallScreen'; // Direct screen for ""My Stall"" tab
import AppHeader from '../components/AppHeader'; // Custom header for all screens in this navigator

import { MainTabsParamList } from './types'; // Type definitions for this tab navigator

const Tab = createBottomTabNavigator<MainTabsParamList>();

const MainNavigator: React.FC = () => {
  const { colors, fonts } = useTheme(); // Access theme tokens for styling
  const totalUnreadCount = useChatStore(state => state.totalUnreadCount); // Get unread messages count for badge

  return (
    <Tab.Navigator
      screenOptions={{
        header: () => <AppHeader />, // Use the custom AppHeader for all screens in this tab navigator
        tabBarActiveTintColor: colors.primary500 as string, // Color for active tab icon and label
        tabBarInactiveTintColor: colors.textSecondary as string, // Color for inactive tab icon and label
        tabBarStyle: {
          backgroundColor: colors.backgroundCard as string, // Background color of the tab bar
          borderTopColor: colors.borderLight as string,    // Color of the top border of the tab bar
          // height: Platform.OS === 'ios' ? 90 : 60, // Example: Adjust height if needed
          // paddingTop: Platform.OS === 'ios' ? 0 : 5,
          // paddingBottom: Platform.OS === 'ios' ? 30 : 5,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.body as string, // Font for tab labels
          fontSize: 10,                    // Font size for tab labels
          // paddingBottom: Platform.OS === 'ios' ? 0 : 5, // Adjust spacing for Android
        },
      }}
    >
      <Tab.Screen
        name="ProfileFeed" // Route name for the ""Trades"" tab
        component={ProfileFeedNavigator} // Nested stack navigator for profile feed and details
        options={{
          tabBarLabel: 'Trades', // Label displayed on the tab
          tabBarIcon: ({ color, size }) => ( // Icon for the tab
            <MaterialCommunityIcons name="storefront-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="MyStall" // Route name for the center ""My Stall"" tab
        component={MyStallScreen} // Direct screen component for managing user's stall
        options={{
          tabBarLabel: 'My Stall', // Label for the tab
          tabBarIcon: ({ color, size }) => ( // Icon for the tab
            // TODO: Replace with custom ""Trading Pouch with Plus"" icon as per walkthrough
            <MaterialCommunityIcons name="treasure-chest-outline" color={color} size={size} />
          ),
          // Consider unmounting this screen when not focused if it has heavy computations or subscriptions
          // unmountOnBlur: true,
        }}
      />
      <Tab.Screen
        name="Messages" // Route name for the ""Messages"" tab
        component={MessagesNavigator} // Nested stack navigator for message list and chat screens
        options={{
          tabBarLabel: 'Messages', // Label for the tab
          tabBarIcon: ({ color, size }) => ( // Icon for the tab
            <MaterialCommunityIcons name="message-text-outline" color={color} size={size} />
          ),
          // Display a badge with the count of unread messages
          tabBarBadge: totalUnreadCount > 0 ? totalUnreadCount : undefined,
          tabBarBadgeStyle: { // Style for the unread count badge
            backgroundColor: colors.errorBase as string,
            color: colors.textLight as string,
            fontSize: 10,
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
"@
$filePath = Join-Path $FrontendBasePath "src/navigation/MainNavigator.tsx"
$parentDir = Split-Path -Path $filePath -Parent
if (-not (Test-Path $parentDir)) { New-Item -ItemType Directory -Force -Path $parentDir | Out-Null; Write-Host "Created directory: $parentDir" }
Set-Content -Path $filePath -Value $MainNavigatorTsxContent -Encoding UTF8 -Force
Write-Host "Created/Updated file: $filePath"

# src/features/auth/hooks/useUserSetup.ts (Updated navigation)
$UseUserSetupTsContent = @"
// src/features/auth/hooks/useUserSetup.ts
/**
 * Custom hook to manage the logic for the user setup screen (SetupScreen.tsx).
 * Handles:
 * - Generating and regenerating goblin names.
 * - Selecting a profile picture (PFP).
 * - Confirming the setup and calling the authStore to initialize the profile.
 * - Navigating to the initial stall setup screen (MyStallSetup) upon successful initialization.
 */
import { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';
import { showErrorToast, showSuccessToast } from '../../../utils/toast';
import type { AuthScreenProps } from '../../../navigation/types'; // For typed navigation

/** Generates a random goblin name from predefined adjectives and nouns. */
const generateGoblinName = (): string => {
    const adjectives = ["Warty", "Sneaky", "Grumpy", "Shiny", "Clever", "Rusty", "Mossy", "Grizzled", "Crafty", "Shifty", "Glum", "Zany"];
    const nouns = ["Snout", "Grog", "Fumble", "Cog", "Nugget", "Gloom", "Spark", "Knuckle", "Shank", "Glint", "Wort", "Pocket"];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${adj} ${noun}`;
};

/**
 * Provides state and handlers for the user setup process.
 * @returns An object containing state variables (goblinName, selectedPfpId, isLoading, error)
 * and handler functions (regenerateName, handleSelectPfp, handleConfirmSetup, resetAuthStatus).
 */
export const useUserSetup = () => {
    const { initializeProfile, isLoading, error, resetAuthStatus } = useAuthStore();
    // Use the specific navigation prop type for the Auth stack
    const navigation = useNavigation<AuthScreenProps<'Setup'>['navigation']>();

    const [goblinName, setGoblinName] = useState<string>(generateGoblinName());
    const [selectedPfpId, setSelectedPfpId] = useState<string | null>(null);

    /** Regenerates a new random goblin name. */
    const regenerateName = useCallback(() => {
        setGoblinName(generateGoblinName());
    }, []);

    /** Updates the selected PFP identifier. */
    const handleSelectPfp = useCallback((pfpId: string) => {
        setSelectedPfpId(pfpId);
    }, []);

    /**
     * Handles the confirmation of the setup.
     * Validates inputs, calls `authStore.initializeProfile`, shows toasts,
     * and navigates to 'MyStallSetup' on success.
     */
    const handleConfirmSetup = useCallback(async () => {
        if (!selectedPfpId) {
            showErrorToast("Please select a profile picture!", "Missing PFP");
            return;
        }
        if (!goblinName.trim()) {
            showErrorToast("Please generate or enter a name!", "Missing Name");
            return;
        }

        const success = await initializeProfile(goblinName.trim(), selectedPfpId);

        if (success) {
            showSuccessToast('Goblin identity chosen! Now set up your stall.', 'Identity Set!');
            // Navigate to the initial stall setup screen within the Auth stack
            navigation.navigate('MyStallSetup');
        }
        // Error toast is handled by the authStore if initializeProfile fails
    }, [goblinName, selectedPfpId, initializeProfile, navigation]);

    return {
        goblinName,
        setGoblinName, // Expose setter if direct input is allowed
        selectedPfpId,
        isLoading,
        error,
        regenerateName,
        handleSelectPfp,
        handleConfirmSetup,
        resetAuthStatus,
    };
};
"@
$filePath = Join-Path $FrontendBasePath "src/features/auth/hooks/useUserSetup.ts"
$parentDir = Split-Path -Path $filePath -Parent
if (-not (Test-Path $parentDir)) { New-Item -ItemType Directory -Force -Path $parentDir | Out-Null; Write-Host "Created directory: $parentDir" }
Set-Content -Path $filePath -Value $UseUserSetupTsContent -Encoding UTF8 -Force
Write-Host "Created/Updated file: $filePath"

# src/features/profiles/screens/MyStallScreen.tsx (Task F1.4 - New, core logic)
$MyStallScreenTsxContent = @"
// src/features/profiles/screens/MyStallScreen.tsx
/**
 * This screen allows users to create and manage their ""Stall"" (profile inventory).
 * It handles:
 * - Displaying user's PFP and Goblin Name.
 * - Adding up to 10 items with images (local URI for Phase 1) and names.
 * - Editing descriptions for offered items and wanted items.
 * - Selecting tags for offered items and wanted items.
 * - Saving all stall data to the backend via `profileStore`.
 * - Initial setup flow after user persona creation.
 * - Subsequent editing of an existing stall.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Heading, VStack, ScrollView, Text } from '@gluestack-ui/themed';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import uuid from 'react-native-uuid'; // For client-side item ID generation

import ScreenContainer from '../../../components/ScreenContainer';
import PrimaryButton from '../../../components/PrimaryButton';
import KeyboardAvoidingViewWrapper from '../../../components/KeyboardAvoidingViewWrapper';
import ImagePickerInput, { ImagePickerObjectType } from '../../../components/ImagePickerInput'; // Corrected import
import StyledInput from '../../../components/StyledInput';
import StyledTextarea from '../../../components/StyledTextarea';
import StyledMultiSelect from '../../../components/StyledMultiSelect';
import ThemedText from '../../../components/ThemedText';
import UserPfpDisplay from '../../../components/UserPfpDisplay';
import LoadingIndicator from '../../../components/LoadingIndicator';
import ErrorDisplay from '../../../components/ErrorDisplay';

import { useAuthStore } from '../../auth/store/authStore';
import { useProfileStore } from '../store/profileStore';
import { STALL_TAGS, TagOption } from '../../../constants/tags';
import { showErrorToast, showSuccessToast } from '../../../utils/toast';
import { AppScreenProps, MainTabsScreenProps, AuthScreenProps } from '../../../navigation/types';
import { Item, UserProfileDto, UpdateProfileRequestDto, UpdateItemDto } from '../../../types';
import { IMAGE_API_PATH } from '../../../api';


/**
 * Zod schema for validating a single item within the stall.
 * Each item requires an ID (client-generated for new items), a name, and an image filename.
 */
const stallItemSchema = z.object({
  _id: z.string().min(1, "Item ID is missing"), // Client-generated UUID for new, server ObjectId for existing
  itemName: z.string().min(1, 'Item name is required.').max(50, "Item name too long (max 50 chars)."),
  imageFilename: z.string().min(1, 'Image filename is required.'), // Placeholder, actual file handled separately
  localImageUri: z.string().optional(), // For displaying new images before upload
  isNew: z.boolean().optional(), // To track new images
});

/** Zod schema for validating the entire stall form. */
const stallSchema = z.object({
  items: z.array(stallItemSchema)
    .min(1, 'Add at least one shiny thing to your stall!')
    .max(10, 'Too many shinies! Max 10 items allowed.'),
  offeredItemsDescription: z.string().min(1, 'Tell us about your treasures!').max(280, "Keep it brief, goblin! (Max 280 chars)"),
  wantedItemsDescription: z.string().min(1, 'What shiny things do YOU seek?').max(280, "Not too greedy now... (Max 280 chars)"),
  offeredItemTags: z.array(z.string()).max(4, 'Max 4 offered tags, pick your best!'),
  wantsTags: z.array(z.string()).max(4, 'Max 4 wanted tags, keep it focused!'),
});

/** Type inferred from the stall Zod schema for form data. */
type StallFormData = z.infer<typeof stallSchema>;

/**
 * MyStallScreen component.
 * Handles both initial creation of a user's stall and subsequent editing.
 */
const MyStallScreen: React.FC = () => {
  const navigation = useNavigation<any>(); // Use 'any' or specific navigator type
  const route = useRoute<AuthScreenProps<'MyStallSetup'>['route'] | MainTabsScreenProps<'MyStall'>['route']>();
  // `isInitialSetup` is true if this screen is reached via the 'MyStallSetup' route in the AuthNavigator.
  const isInitialSetup = route.name === 'MyStallSetup';

  const { uuid: userUuid, goblinName, pfpId, isAuthenticated } = useAuthStore();
  const {
    myStallData, // This is the editable local copy
    myStallServerData, // This is the last saved server state
    myStallStatus,
    hasUnsavedChanges,
    fetchMyStall,
    saveMyStall,
    setLocalStallItems, // Replaces entire items array
    setHasUnsavedChanges,
    revertLocalStallChanges,
  } = useProfileStore();

  // State for images managed by ImagePickerInput and translated to form items
  // Each object here corresponds to an image shown in ImagePickerInput
  const [currentImagePickerItems, setCurrentImagePickerItems] = useState<ImagePickerObjectType[]>([]);

  const { control, handleSubmit, reset, watch, setValue, formState: { errors, isDirty, isValid } } = useForm<StallFormData>({
    resolver: zodResolver(stallSchema),
    mode: 'onChange', // Validate on change for better UX
    defaultValues: {
      items: [],
      offeredItemsDescription: '',
      wantedItemsDescription: '',
      offeredItemTags: [],
      wantsTags: [],
    },
  });

  const watchedFormItems = watch('items'); // RHF's array of items

  // Effect to populate form when myStallServerData (from store) changes or on initial load
  useEffect(() => {
    if (myStallServerData) {
      console.log("MyStallScreen: Populating form from myStallServerData");
      const formItems: StallFormData['items'] = myStallServerData.items.map(item => ({
        _id: item._id, // Server ID
        itemName: item.itemName,
        imageFilename: item.imageFilename, // Server filename
        localImageUri: `${IMAGE_API_PATH}${item.imageFilename}`, // Construct display URI
        isNew: false,
      }));
      reset({
        items: formItems,
        offeredItemsDescription: myStallServerData.offeredItemsDescription,
        wantedItemsDescription: myStallServerData.wantedItemsDescription,
        offeredItemTags: myStallServerData.offeredItemTags || [],
        wantsTags: myStallServerData.wantsTags || [],
      });
      // Initialize ImagePickerInput's state based on these form items
      const pickerItems: ImagePickerObjectType[] = formItems.map(fi => ({
          uri: fi.localImageUri!, // Should exist
          name: fi.imageFilename,
          localId: fi._id, // Use server ID as localId for existing items
          isNew: false,
          originalFilename: fi.imageFilename
      }));
      setCurrentImagePickerItems(pickerItems);
      setHasUnsavedChanges(false); // Reset after populating from server
    } else if (isInitialSetup) {
      // For initial setup, reset to empty defaults, ImagePickerInput will be empty
        reset({ items: [], offeredItemsDescription: '', wantedItemsDescription: '', offeredItemTags: [], wantsTags: [] });
        setCurrentImagePickerItems([]);
        setHasUnsavedChanges(false); // No unsaved changes yet
    }
  }, [myStallServerData, reset, isInitialSetup]);

  // Fetch stall data on focus, unless it's the initial setup flow
  useFocusEffect(
    useCallback(() => {
      if (!isInitialSetup) {
        console.log("MyStallScreen: Focused, fetching myStall data.");
        fetchMyStall();
      }
      // Cleanup: Revert unsaved changes when screen loses focus if not initial setup.
      return () => {
        if (!isInitialSetup && useProfileStore.getState().hasUnsavedChanges) { // Use get() to access latest state
          console.log("MyStallScreen: Blurred with unsaved changes, reverting.");
          revertLocalStallChanges();
        }
      };
    }, [isInitialSetup, fetchMyStall, revertLocalStallChanges]) // Removed get from deps
  );

  // Update hasUnsavedChanges flag based on react-hook-form's isDirty state
    useEffect(() => {
    // Only set hasUnsavedChanges if the form is actually dirty
    // This prevents it from being set true just by initial population
    if (isDirty) {
        setHasUnsavedChanges(true);
    }
  }, [isDirty, setHasUnsavedChanges]);


  /**
   * Callback for ImagePickerInput.
   * Updates `currentImagePickerItems` state and synchronizes with RHF `items` field.
   * @param newPickerImages - Array of image objects from ImagePickerInput.
   */
  const handleImagePickerChange = useCallback((newPickerImages: ImagePickerObjectType[]) => {
    setCurrentImagePickerItems(newPickerImages); // Update local state for ImagePickerInput

    // Synchronize with React Hook Form's 'items' field
    const newFormItems: StallFormData['items'] = newPickerImages.map((pickerItem) => ({
      _id: pickerItem.localId, // This is the key for RHF's field array
      itemName: watchedFormItems.find(item => item._id === pickerItem.localId)?.itemName || `Shiny Thing ${watchedFormItems.length + 1}`,
      imageFilename: pickerItem.name || `item_${Date.now()}.jpg`, // Filename for backend
      localImageUri: pickerItem.uri, // Local URI for display
      isNew: pickerItem.isNew,
    }));
    setValue('items', newFormItems, { shouldDirty: true, shouldValidate: true });
  }, [setValue, watchedFormItems]);


  /** Handles form submission to save the stall data. */
  const onSubmit = async (formData: StallFormData) => {
    if (!userUuid) {
      showErrorToast("User not identified. Please restart the app.", "Save Error");
      return;
    }

    // Construct the DTO for the backend
    const payload: UpdateProfileRequestDto = {
      items: formData.items.map(formItem => ({
        id: (formItem.isNew || !formItem._id.includes('-') === false) ? undefined : formItem._id, // Server ID for existing
        localId: (formItem.isNew || formItem._id.includes('-')) ? formItem._id : undefined, // Client UUID for new
        itemName: formItem.itemName,
        imageFilename: formItem.imageFilename, // For Phase 1, backend expects filename
      })),
      offeredItemsDescription: formData.offeredItemsDescription,
      wantedItemsDescription: formData.wantedItemsDescription,
      offeredItemTags: formData.offeredItemTags || [],
      wantsTags: formData.wantsTags || [],
    };

    const result = await saveMyStall(payload);

    if (result) {
      // `saveMyStall` in `profileStore` now handles calling `finalizeAuthentication`
      if (isInitialSetup) {
        // After first stall save from setup flow, navigate to the main app (e.g., ProfileFeed)
        navigation.replace('Main', { screen: 'ProfileFeed', params: { screen: 'ProfileFeedScreen'} });
      } else {
        // For subsequent saves, just show success, user stays on MyStallScreen
        showSuccessToast("Stall updated successfully!", "Success");
        reset(formData); // Reset form to new default values (which are the saved ones)
        setHasUnsavedChanges(false);
      }
    }
    // Error toast is handled by the profileStore
  };

  // Show loading indicator if fetching initial stall data (but not during initial setup)
  if (myStallStatus === 'loading' && !myStallData && !isInitialSetup) {
    return <ScreenContainer><LoadingIndicator text="Loading your stall..." /></ScreenContainer>;
  }
  // Show error if fetching failed and no local data to display (not during initial setup)
  if (myStallStatus === 'error' && !myStallData && !isInitialSetup) {
    return <ScreenContainer><ErrorDisplay title="Stall Load Error" message={error || 'Could not load your stall data. Pull to refresh or try again later.'} /></ScreenContainer>;
  }

  return (
    <ScreenContainer scrollable={false} edges={isInitialSetup ? ['top', 'left', 'right'] : ['left', 'right']}>
      <KeyboardAvoidingViewWrapper>
        <Box px="$4" pt="$4" pb="$20"> {/* Ensure enough padding at bottom for button */}
          <VStack space="lg">
            <Box alignItems="center" mb="$2">
              <UserPfpDisplay pfpIdentifier={pfpId} userName={goblinName} size="xl" />
              <Heading mt="$1">{goblinName}'s Stall</Heading>
              {isInitialSetup && (
                <ThemedText size="sm" color="$textSecondary" mt="$1" textAlign="center">
                  Let's get your wares ready for the market! Add at least one item and describe your trades.
                </ThemedText>
              )}
            </Box>

            {/* Image Picker and Item Name Inputs */}
            <Controller
                name="items"
                control={control}
                render={({ field }) => (
                    <ImagePickerInput
                        key={myStallServerData?._id || 'image-picker-key'} // Re-key to help reset if server data changes
                        initialImageItems={
                            // Map RHF 'items' (which are StallFormData['items']) to what ImagePickerInput expects
                            (field.value || []).map(formItem => ({
                                filename: formItem.imageFilename,
                                localId: formItem._id // This is the localId for ImagePickerObjectType
                            }))
                        }
                        onImagesChange={handleImagePickerChange}
                        maxImages={10}
                        isEditMode={!!myStallServerData && !isInitialSetup}
                    />
                )}
            />
            {errors.items && errors.items.message && <ErrorDisplay message={errors.items.message} />}

            {watchedFormItems.map((item, index) => (
              <Box key={item._id || `item-form-${index}`}>
                <StyledInput
                  name={`items[${index}].itemName`}
                  label={`Item ${index + 1} Name`}
                  control={control}
                  rules={{ required: 'Item name is required' }}
                  placeholder="e.g., Shiny Rock"
                  // RHF Controller handles onChangeText internally based on name
                />
                {errors.items?.[index]?.itemName && <ErrorDisplay message={errors.items[index]?.itemName?.message} />}
              </Box>
            ))}


            <StyledTextarea
              name="offeredItemsDescription"
              label="Describe Your Wares"
              control={control}
              placeholder="What treasures are you offering, goblin?"
              rules={{ required: 'Description of offered items is required.', maxLength: {value: 280, message: "Too much chatter! (Max 280)"} }}
              isRequired
              maxLength={280}
              inputProps={{ numberOfLines: 4 }}
            />
            {errors.offeredItemsDescription && <ErrorDisplay message={errors.offeredItemsDescription.message} />}

            <StyledTextarea
              name="wantedItemsDescription"
              label="What Shinies Do You Seek?"
              control={control}
              placeholder="What are you hoping to get in return?"
              rules={{ required: 'Description of wanted items is required.', maxLength: {value: 280, message: "Greedy goblin! (Max 280)"} }}
              isRequired
              maxLength={280}
              inputProps={{ numberOfLines: 3 }}
            />
            {errors.wantedItemsDescription && <ErrorDisplay message={errors.wantedItemsDescription.message} />}

            <StyledMultiSelect
              name="offeredItemTags"
              label="Your Item Tags (Max 4)"
              control={control}
              options={STALL_TAGS}
              placeholder="Select tags for your items..."
              rules={{ validate: (value?: string[]) => (value && value.length > 4) ? 'Max 4 tags, choose wisely!' : true }}
            />
            {errors.offeredItemTags && <ErrorDisplay message={errors.offeredItemTags.message} />}

            <StyledMultiSelect
              name="wantsTags"
              label="Tags for Items You Want (Max 4)"
              control={control}
              options={STALL_TAGS}
              placeholder="Select tags for items you want..."
              rules={{ validate: (value?: string[]) => (value && value.length > 4) ? 'Max 4 tags, not a wishlist!' : true }}
            />
             {errors.wantsTags && <ErrorDisplay message={errors.wantsTags.message} />}

            {isInitialSetup && (
              <ThemedText size="xs" color="$textSecondary" textAlign="center" mt="$4">
                By saving, you are listing your stall in the public trade board for other goblins to see.
              </ThemedText>
            )}

            <PrimaryButton
              title={isInitialSetup ? "Create Stall & Enter Market!" : "Save Stall Changes"}
              onPress={handleSubmit(onSubmit)}
              isLoading={myStallStatus === 'loading'}
              disabled={myStallStatus === 'loading' || (!isInitialSetup && !hasUnsavedChanges && !isDirty) || !isValid}
              mt="$6"
            />
          </VStack>
        </Box>
      </KeyboardAvoidingViewWrapper>
    </ScreenContainer>
  );
};

export default MyStallScreen;
"@
$filePath = Join-Path $FrontendBasePath "src/features/profiles/screens/MyStallScreen.tsx"
$parentDir = Split-Path -Path $filePath -Parent
if (-not (Test-Path $parentDir)) { New-Item -ItemType Directory -Force -Path $parentDir | Out-Null; Write-Host "Created directory: $parentDir" }
Set-Content -Path $filePath -Value $MyStallScreenTsxContent -Encoding UTF8 -Force
Write-Host "Created/Updated file: $filePath"

# src/features/profiles/screens/ProfileFeedScreen.tsx (Task F1.4 - New, Stub for Phase 1)
$ProfileFeedScreenTsxContent = @"
// src/features/profiles/screens/ProfileFeedScreen.tsx
/**
 * This screen displays the main feed of other users' stalls (""Trades Board"").
 * For Phase 1, it's a basic stub indicating future functionality.
 * For Phase 3+, it will fetch and display profiles, with search and filtering.
 */
import React from 'react';
import { Box, Heading, VStack } from '@gluestack-ui/themed';
import ScreenContainer from '../../../components/ScreenContainer';
import ThemedText from '../../../components/ThemedText';
// import LoadingIndicator from '../../../components/LoadingIndicator'; // For Phase 3+
// import ErrorDisplay from '../../../components/ErrorDisplay'; // For Phase 3+
// import EmptyState from '../../../components/EmptyState'; // For Phase 3+
// import { useProfileStore } from '../store/profileStore'; // For Phase 3+

const ProfileFeedScreen: React.FC = () => {
  // const { feedProfiles, feedStatus, error, fetchFeedProfiles } = useProfileStore(); // For Phase 3+

  // useEffect(() => { // For Phase 3+
  //    fetchFeedProfiles();
  // }, [fetchFeedProfiles]);

  // if (feedStatus === 'loading' && feedProfiles.length === 0) { // For Phase 3+
  //    return <ScreenContainer><LoadingIndicator text="Fetching stalls..." /></ScreenContainer>;
  // }

  return (
    <ScreenContainer>
      <VStack space="md" alignItems="center" flex={1} justifyContent='center'>
        <Heading>Trades Board</Heading>
        <ThemedText textAlign='center' color='$textSecondary'>
          Welcome, Goblins! The market is bustling... or will be soon!
        </ThemedText>
        <ThemedText size="sm" mt="$4" color='$textSecondary'>(Stall Browse functionality planned for a future phase)</ThemedText>
      </VStack>
    </ScreenContainer>
  );
};

export default ProfileFeedScreen;
"@
$filePath = Join-Path $FrontendBasePath "src/features/profiles/screens/ProfileFeedScreen.tsx"
$parentDir = Split-Path -Path $filePath -Parent
if (-not (Test-Path $parentDir)) { New-Item -ItemType Directory -Force -Path $parentDir | Out-Null; Write-Host "Created directory: $parentDir" }
Set-Content -Path $filePath -Value $ProfileFeedScreenTsxContent -Encoding UTF8 -Force
Write-Host "Created/Updated file: $filePath"

# src/features/messaging/screens/MessagingListScreen.tsx (Task F1.4 - Update to stub)
$MessagingListScreenTsxContent = @"
// src/features/messaging/screens/MessagingListScreen.tsx
/**
 * This screen lists the user's active chat conversations and incoming trade requests.
 * For Phase 1, it's a basic stub indicating future functionality.
 * For Phase 4+, it will fetch and display this information.
 */
import React from 'react';
import { Box, Heading, VStack } from '@gluestack-ui/themed';
import ScreenContainer from '../../../components/ScreenContainer';
import ThemedText from '../../../components/ThemedText';
// import { useChatStore } from '../store/chatStore'; // For Phase 4+
// import ChatPreviewCard from '../components/ChatPreviewCard'; // For Phase 4+
// import TradeRequestCard from '../components/TradeRequestCard'; // For Phase 4+

const MessagingListScreen: React.FC = () => {
  // const { chats, tradeRequests, chatsStatus, fetchChatsAndRequests } = useChatStore(); // For Phase 4+

  // useEffect(() => { // For Phase 4+
  //    fetchChatsAndRequests();
  // }, [fetchChatsAndRequests]);

  return (
    <ScreenContainer>
      <VStack space="md" alignItems="center" flex={1} justifyContent='center'>
        <Heading>Your Messages & Trades</Heading>
        <ThemedText textAlign='center' color='$textSecondary'>
          Haggling and hushed deals happen here... soon!
        </ThemedText>
        <ThemedText size="sm" mt="$4" color='$textSecondary'>(Messaging and trade request functionality planned for a future phase)</ThemedText>
      </VStack>
    </ScreenContainer>
  );
};

export default MessagingListScreen;
"@
$filePath = Join-Path $FrontendBasePath "src/features/messaging/screens/MessagingListScreen.tsx"
$parentDir = Split-Path -Path $filePath -Parent
if (-not (Test-Path $parentDir)) { New-Item -ItemType Directory -Force -Path $parentDir | Out-Null; Write-Host "Created directory: $parentDir" }
Set-Content -Path $filePath -Value $MessagingListScreenTsxContent -Encoding UTF8 -Force
Write-Host "Created/Updated file: $filePath"

# src/features/settings/screens/SettingsScreen.tsx (Task F1.4 - Update to stub)
$SettingsScreenTsxContent = @"
// src/features/settings/screens/SettingsScreen.tsx
/**
 * This screen provides application settings, user profile information, FAQ,
 * and the option to ""Retire Goblin & Empty Stall"" (logout/delete account).
 */
import React from 'react';
import { Box, Heading, VStack, ScrollView, Divider, Pressable } from '@gluestack-ui/themed';
import { Linking, Alert } from 'react-native';
import ScreenContainer from '../../../components/ScreenContainer';
import ThemedText from '../../../components/ThemedText';
import UserPfpDisplay from '../../../components/UserPfpDisplay';
import PrimaryButton from '../../../components/PrimaryButton';
import { useAuthStore } from '../../auth/store/authStore';
// import { AppScreenProps } from '../../../navigation/types'; // If navigation prop is needed

// type Props = AppScreenProps<'Settings'>; // If using navigation prop

const SettingsScreen: React.FC = (/*{ navigation }: Props*/) => {
  const { goblinName, pfpId, uuid, clearProfileAndData, isLoading } = useAuthStore();

  const openAppSettings = () => {
    Linking.openSettings().catch(err => console.warn("Failed to open settings:", err));
  };

  const handleClearProfile = () => {
    Alert.alert(
      "Retire Goblin?",
      "This will permanently delete your stall, goblin identity, and all associated data from this device. Are you sure, brave trader?",
      [
        { text: "Nevermind", style: "cancel" },
        {
          text: "Retire & Empty Stall",
          style: "destructive",
          onPress: async () => {
            await clearProfileAndData();
            // Navigation back to Auth flow is handled by AppNavigator based on isAuthenticated state
          }
        }
      ]
    );
  };

  const faqItems = [
    { q: "What is GobTrades?", a: "A temporary marketplace for trading treasures during the Goblin Market event." },
    { q: "How long is the market open?", a: "The market is typically open for 8 hours during specific event dates. Check the timer!" },
    { q: "How do I trade?", a: "Browse stalls, request a trade, and then chat to arrange the swap at the physical market." },
    { q: "Is this anonymous?", a: "Mostly! You use a goblin name and PFP. Your unique device ID (UUID) is used internally." },
  ];

  return (
    <ScreenContainer scrollable={true}>
      <VStack p="$4" space="lg" pb="$20"> {/* Extra padding for scroll */}
        <Box alignItems="center">
          <UserPfpDisplay pfpIdentifier={pfpId} userName={goblinName || undefined} size="xl" />
          <Heading mt="$2" size="xl">{goblinName || 'A Mysterious Goblin'}</Heading>
          {uuid && <ThemedText size="xs" color="$textSecondary" selectable={true}>Trader ID: {uuid}</ThemedText>}
        </Box>

        <Divider />

        <Heading size="md">App Permissions</Heading>
        <Pressable onPress={openAppSettings} accessibilityRole="button">
          <ThemedText color="$primary500">Manage Camera & Photo Permissions</ThemedText>
        </Pressable>
        <ThemedText size='xs' color='$textSecondary'>Used for adding images to your stall.</ThemedText>


        <Divider />

        <Heading size="md">FAQ - Goblin Market Guide</Heading>
        {faqItems.map((item, index) => (
          <Box key={index} mb="$3">
            <ThemedText bold>{item.q}</ThemedText>
            <ThemedText size='sm'>{item.a}</ThemedText>
          </Box>
        ))}

        <Divider />

        <PrimaryButton
          title="Retire Goblin & Empty Stall"
          onPress={handleClearProfile}
          action="negative" // Uses themed 'negative' style
          mt="$4"
          isLoading={isLoading}
          disabled={isLoading}
        />
        <ThemedText size="xs" color="$textSecondary" textAlign="center" mt="$2">
            This action is permanent and cannot be undone.
        </ThemedText>
      </VStack>
    </ScreenContainer>
  );
};

export default SettingsScreen;
"@
$filePath = Join-Path $FrontendBasePath "src/features/settings/screens/SettingsScreen.tsx"
$parentDir = Split-Path -Path $filePath -Parent
if (-not (Test-Path $parentDir)) { New-Item -ItemType Directory -Force -Path $parentDir | Out-Null; Write-Host "Created directory: $parentDir" }
Set-Content -Path $filePath -Value $SettingsScreenTsxContent -Encoding UTF8 -Force
Write-Host "Created/Updated file: $filePath"

# src/components/ImagePickerInput.tsx (Ensure it's aligned with current usage)
$ImagePickerInputTsxContent = @"
// src/components/ImagePickerInput.tsx
/**
 * A component for selecting multiple images from the device's camera or gallery.
 * It displays selected image thumbnails and allows removal.
 * Used in MyStallScreen for managing stall item images.
 */
import React, { useState, useEffect, FC } from 'react';
import { Box, Pressable, Icon, Image, Text } from '@gluestack-ui/themed';
import { Alert, Platform, StyleProp, ViewStyle } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CameraIcon, ImageIcon, TrashIcon, AlertCircleIcon } from 'lucide-react-native';
import { IMAGE_API_PATH } from '../api'; // For displaying existing images
import ThemedText from './ThemedText';
import uuid from 'react-native-uuid'; // For generating local IDs for new images

/** Structure for image objects managed internally and passed by this component. */
export interface ImagePickerObjectType {
    uri: string;        // Local URI (file://...) for new, or full HTTP URL for existing
    type?: string;      // Mime type (e.g., 'image/jpeg')
    name?: string;      // Filename
    localId: string;    // Unique client-side ID for this image instance (new or existing)
    isNew: boolean;     // True if this image was newly picked by the user
    originalFilename?: string; // The original filename from the server, if it's an existing image
}

export interface ImagePickerInputProps {
    /**
     * Initial list of image items to display. For existing stall items, these would
     * typically be derived from `UserProfile.items`, containing server filenames and their original _id.
     */
    initialImageItems?: { filename: string, localId: string }[];
    /** Callback when the list of selected/managed images changes. Provides the full current list. */
    onImagesChange: (images: ImagePickerObjectType[]) => void;
    /** Maximum number of images allowed. */
    maxImages?: number;
    style?: StyleProp<ViewStyle>;
    /** Indicates if the form is in edit mode (affects how initial images are handled). */
    isEditMode?: boolean;
}

const ImagePickerInput: FC<ImagePickerInputProps> = ({
    initialImageItems = [],
    onImagesChange,
    maxImages = 10,
    style,
    isEditMode = false,
}) => {
    const [images, setImages] = useState<ImagePickerObjectType[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // This effect maps `initialImageItems` (from server/prop) to the internal `images` state.
        // It should run when `initialImageItems` changes, or when `isEditMode` changes.
        // It's crucial that `localId` for existing items is their server `_id` for later diffing.
        if (isEditMode) {
            const mappedInitialImages: ImagePickerObjectType[] = initialImageItems.map(item => ({
                uri: `${IMAGE_API_PATH}${item.filename}`, // Construct full URL for display (will be broken in Phase 1)
                name: item.filename,
                localId: item.localId, // This should be the Item._id from the server
                isNew: false,
                originalFilename: item.filename,
            }));
            setImages(mappedInitialImages);
        } else {
            // If not in edit mode (i.e., creating new), start with empty images
            setImages([]);
        }
        // Do not call onImagesChange here as this is initial population.
    }, [initialImageItems, isEditMode]);


    const requestPermissions = async (): Promise<boolean> => {
        setError(null);
        if (Platform.OS !== 'web') {
            const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
            const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
                const msg = 'Camera or Photo Library permission is required to add images.';
                setError(msg);
                Alert.alert('Permission Required', msg, [{ text: 'OK' }]);
                return false;
            }
        }
        return true;
    };

    const handleSelectImage = async (useCamera: boolean) => {
        if (images.length >= maxImages) {
            setError(`Maximum of ${maxImages} images allowed.`);
            return;
        }
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        const options: ImagePicker.ImagePickerOptions = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        };

        let result;
        try {
            result = useCamera
                ? await ImagePicker.launchCameraAsync(options)
                : await ImagePicker.launchImageLibraryAsync(options);

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                const newImage: ImagePickerObjectType = {
                    uri: asset.uri,
                    type: asset.mimeType || 'image/jpeg',
                    name: asset.fileName || `stall_item_${Date.now()}.${asset.uri.split('.').pop() || 'jpg'}`,
                    localId: uuid.v4() as string, // Generate a new unique localId for this new image
                    isNew: true,
                };
                const updatedImages = [...images, newImage];
                setImages(updatedImages);
                onImagesChange(updatedImages); // Notify parent component (MyStallScreen)
                setError(null);
            }
        } catch (e: any) {
            console.error("ImagePicker Error:", e);
            setError(`Failed to ${useCamera ? 'take photo' : 'select image'}: ${e.message}`);
        }
    };

    const handleRemoveImage = (localIdToRemove: string) => {
        const updatedImages = images.filter(img => img.localId !== localIdToRemove);
        setImages(updatedImages);
        onImagesChange(updatedImages); // Notify parent component
        setError(null);
    };

    return (
        <Box style={style} mb="$4">
            {/* Label is handled by the parent form component (MyStallScreen) */}
            {error && (
                <Box flexDirection="row" alignItems="center" bg="$errorBg" p="$2" borderRadius="$sm" mb="$2">
                    <Icon as={AlertCircleIcon} color="$error700" size="sm" mr="$2" />
                    <ThemedText color="$error700" size="sm">{error}</ThemedText>
                </Box>
            )}
            <Box flexDirection="row" flexWrap="wrap" alignItems="center">
                {images.map((imageItem, index) => (
                    <Box key={imageItem.localId} mr="$2" mb="$2" position="relative">
                        <Image
                            source={{ uri: imageItem.uri }}
                            alt={`Stall item ${index + 1}`}
                            w={80} h={80}
                            borderRadius="$sm"
                            resizeMode="cover"
                        />
                        <Pressable
                            position="absolute" top={-8} right={-8}
                            bg="$errorBase" borderRadius="$full" p="$1.5"
                            onPress={() => handleRemoveImage(imageItem.localId)}
                            accessibilityLabel={`Remove image ${index + 1}`}
                            sx={{ _hover: { bg: "$error700" } }}
                        >
                            <Icon as={TrashIcon} color="$textLight" size="xs" />
                        </Pressable>
                    </Box>
                ))}

                {images.length < maxImages && (
                    <Box flexDirection="row">
                        <Pressable
                            justifyContent="center" alignItems="center"
                            w={80} h={80} bg="$backgroundCard"
                            borderRadius="$sm" borderWidth={1} borderColor="$borderLight"
                            borderStyle="dashed" onPress={() => handleSelectImage(true)}
                            accessibilityLabel="Add image using camera" mr="$2"
                            sx={{ _hover: { bg: "$parchment200" } }}
                        >
                            <Icon as={CameraIcon} size="lg" color="$goblinGreen700" />
                        </Pressable>
                        <Pressable
                            justifyContent="center" alignItems="center"
                            w={80} h={80} bg="$backgroundCard"
                            borderRadius="$sm" borderWidth={1} borderColor="$borderLight"
                            borderStyle="dashed" onPress={() => handleSelectImage(false)}
                            accessibilityLabel="Add image from gallery"
                            sx={{ _hover: { bg: "$parchment200" } }}
                        >
                            <Icon as={ImageIcon} size="lg" color="$goblinGreen700" />
                        </Pressable>
                    </Box>
                )}
            </Box>
            <ThemedText size="xs" color="$textSecondary" mt="$1">
                Tap an image's 'X' to remove. Add up to {maxImages} images.
            </ThemedText>
        </Box>
    );
};

export default ImagePickerInput;
"@
$filePath = Join-Path $FrontendBasePath "src/components/ImagePickerInput.tsx"
$parentDir = Split-Path -Path $filePath -Parent
if (-not (Test-Path $parentDir)) { New-Item -ItemType Directory -Force -Path $parentDir | Out-Null; Write-Host "Created directory: $parentDir" }
Set-Content -Path $filePath -Value $ImagePickerInputTsxContent -Encoding UTF8 -Force
Write-Host "Created/Updated file: $filePath"

Write-Host "Phase 1 Frontend Refactoring Script (v3) completed."
Write-Host "IMPORTANT: Review all changes. It's highly recommended to run 'npm install'"
Write-Host "from within the '$FrontendBasePath' directory to ensure all dependencies are correctly linked."
Write-Host "After reviewing, navigate to '$FrontendBasePath' and run 'npx expo start' to launch your app."
Write-Host "Your API_BASE_URL in '$FrontendBasePath\src\api\index.ts' has been set to https://10d6-71-47-5-48.ngrok-free.app"
Write-Host "Ensure your backend is running and accessible via this ngrok URL."