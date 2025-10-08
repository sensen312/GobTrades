// src/api/market.ts
import apiClient from './index';
import { MarketStatusResponseDto } from '../types';

/**
 * Fetches the current status of the market (open/closed, end time).
 * Called by useMarketTimer hook (indirectly via profileStore).
 * Reasoning: Provides the frontend with real-time or near real-time information
 * about the market's operational window.
 * @returns A promise that resolves to the market status.
 */
export const fetchMarketStatusApi = async (): Promise<MarketStatusResponseDto> => {
  console.log('API CALL: GET /market/status'); // Path already includes /api from apiClient baseURL
  const response = await apiClient.get<MarketStatusResponseDto>('/market/status');
  console.log('API RESPONSE: GET /market/status', response.data);
  return response.data;
};
