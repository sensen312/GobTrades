// src/hooks/useMarketTimer.ts
import { useState, useEffect, useCallback } from 'react';
import { formatDuration, intervalToDuration, differenceInSeconds, isAfter, parseISO } from 'date-fns';
import { useProfileStore as useProfileStoreForMarketTimerHook } from '../features/profiles/store/profileStore'; // Aliased for clarity

export function useMarketTimer() {
  // Reasoning: This hook centralizes the logic for fetching market status and calculating time left.
  // It relies on profileStore to hold the fetched market status.
  const { marketStatus, fetchMarketStatus, marketStatusFetchState, error: marketError } = useProfileStoreForMarketTimerHook(state => ({
    marketStatus: state.marketStatus,
    fetchMarketStatus: state.fetchMarketStatus,
    marketStatusFetchState: state.marketStatusFetchState,
    error: state.error, // Assuming profileStore.error might contain market fetch errors
  }));

  const [timeLeft, setTimeLeft] = useState<string>('--:--:--');
  const [isMarketOpenLocal, setIsMarketOpenLocal] = useState<boolean>(false); // Local derived state

  // Fetch market status on mount and periodically.
  // Reasoning: Keeps market status relatively up-to-date.
  useEffect(() => {
    fetchMarketStatus(); // Initial fetch
    const intervalId = setInterval(fetchMarketStatus, 60000); // Refetch every minute
    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [fetchMarketStatus]);

  // Update timer based on fetched market status from the store.
  // Reasoning: Calculates and formats the countdown or "CLOSED" status.
  useEffect(() => {
    if (marketStatusFetchState === 'loading') {
      // Display a loading state or keep previous time to avoid flicker.
      // For Phase 1, keeping previous or '--:--:--' is acceptable.
      // setTimeLeft("Loading..."); // Optional: Indicate loading
      return;
    }

    if (marketStatusFetchState === 'error' || !marketStatus) {
      setIsMarketOpenLocal(false);
      setTimeLeft("CLOSED"); // Or "Status N/A" or display an error indicator
      console.warn("MarketTimer: Error fetching status or no status data.");
      return;
    }

    setIsMarketOpenLocal(marketStatus.isMarketOpen);
    const endTimeISO = marketStatus.endTime;

    if (!marketStatus.isMarketOpen || !endTimeISO) {
      setTimeLeft("CLOSED");
      setIsMarketOpenLocal(false);
      return; // Market is not open or no end time provided.
    }

    const marketEndTimeDate = parseISO(endTimeISO);
    if (isAfter(new Date(), marketEndTimeDate)) {
      setTimeLeft("CLOSED");
      setIsMarketOpenLocal(false);
      return; // Market already ended for the day.
    }

    // Market is open and end time is valid and in the future.
    const timer = setInterval(() => {
      const currentTime = new Date();
      if (isAfter(currentTime, marketEndTimeDate)) {
        setTimeLeft("CLOSED");
        setIsMarketOpenLocal(false);
        clearInterval(timer);
        fetchMarketStatus(); // Re-fetch status as market just closed based on client timer
      } else {
        const secondsRemaining = differenceInSeconds(marketEndTimeDate, currentTime);
        if (secondsRemaining <= 0) {
          setTimeLeft("CLOSED");
          setIsMarketOpenLocal(false);
          clearInterval(timer);
          fetchMarketStatus(); // Re-fetch status
        } else {
          const duration = intervalToDuration({ start: 0, end: secondsRemaining * 1000 });
          const formattedTime = formatDuration(duration, {
            format: ['hours', 'minutes', 'seconds'],
            zero: true,
            delimiter: ':',
            locale: { formatDistance: (_token, count) => String(count).padStart(2, '0') },
          });
          setTimeLeft(formattedTime);
          setIsMarketOpenLocal(true); // Ensure market is marked open
        }
      }
    }, 1000);

    return () => clearInterval(timer); // Cleanup interval on unmount or when dependencies change
  }, [marketStatus, marketStatusFetchState, fetchMarketStatus]); // Added fetchMarketStatus to dependencies

  return {
    timeLeft,
    isMarketOpen: isMarketOpenLocal,
    isLoadingMarketStatus: marketStatusFetchState === 'loading',
    marketStatusError: marketStatusFetchState === 'error' ? marketError : null,
  };
}
