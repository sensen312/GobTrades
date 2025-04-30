import apiClient from './index';
import { MarketStatusResponse } from '../types'; // Import from CORRECTED types index

/** Fetches current market status. */
export const fetchMarketStatusApi = async (): Promise<MarketStatusResponse> => {
    const response = await apiClient.get<MarketStatusResponse>('/market/status');
    return response.data; // Expects { endTime: string | null, isMarketOpen: boolean }
};