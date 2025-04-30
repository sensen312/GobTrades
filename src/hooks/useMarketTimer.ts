import { useState, useEffect } from 'react';
 import {
   differenceInSeconds,
   isWithinInterval,
   setHours,
   setMinutes,
   setSeconds,
   formatDuration,
   intervalToDuration,
   isAfter,
 } from 'date-fns';

 /**
  * Custom hook to manage the Goblin Market timer (12 PM - 7 PM local time)
  * and determine if the market is currently open.
  * Addresses Story 75 and 81.
  */
 export function useMarketTimer() {
   const [marketOpenTime, setMarketOpenTime] = useState<Date | null>(null);
   const [marketCloseTime, setMarketCloseTime] = useState<Date | null>(null);
   const [timeLeft, setTimeLeft] = useState<string>('--:--:--');
   const [isMarketOpen, setIsMarketOpen] = useState<boolean>(false);
   const [isMarketClosedPermanently, setIsMarketClosedPermanently] = useState<boolean>(false); // Tracks if market ended for the day

   useEffect(() => {
     // --- Calculate Today's Market Window ---
     // This logic assumes the market runs daily from 12 PM to 7 PM local time for the demo.
     // In a real app, start/end times would likely come from an API.
     const now = new Date();
     const todayMarketOpen = setSeconds(setMinutes(setHours(now, 12), 0), 0); // Today at 12:00:00 PM
     const todayMarketClose = setSeconds(setMinutes(setHours(now, 19), 0), 0); // Today at 7:00:00 PM (19:00)

     setMarketOpenTime(todayMarketOpen);
     setMarketCloseTime(todayMarketClose);

     // --- Initial Market State Check ---
     const currentlyOpen = isWithinInterval(now, { start: todayMarketOpen, end: todayMarketClose });
     const alreadyEnded = isAfter(now, todayMarketClose);
     setIsMarketOpen(currentlyOpen);
     setIsMarketClosedPermanently(alreadyEnded); // If it's past 7 PM

     if (alreadyEnded) {
       setTimeLeft('00:00:00');
     }

     // --- Timer Interval ---
     // Only run the interval if the market hasn't already closed for the day
     if (!alreadyEnded) {
         const interval = setInterval(() => {
             const currentTime = new Date();
             const isOpenNow = isWithinInterval(currentTime, { start: todayMarketOpen, end: todayMarketClose });
             setIsMarketOpen(isOpenNow);

             if (isOpenNow) {
                 const secondsRemaining = differenceInSeconds(todayMarketClose, currentTime);
                 if (secondsRemaining <= 0) {
                     setTimeLeft('00:00:00');
                     setIsMarketOpen(false);
                     setIsMarketClosedPermanently(true); // Market ended
                     clearInterval(interval);
                 } else {
                     const duration = intervalToDuration({ start: 0, end: secondsRemaining * 1000 });
                     const formattedTime = formatDuration(duration, {
                         format: ['hours', 'minutes', 'seconds'],
                         zero: true,
                         delimiter: ':',
                         locale: { // Pad with zeros
                             formatDistance: (_token, count) => String(count).padStart(2, '0'),
                         },
                     });
                     setTimeLeft(formattedTime);
                 }
             } else {
                 // If it's before 12 PM or after 7 PM (and timer somehow still running)
                 setTimeLeft('--:--:--'); // Or "00:00:00" if past 7 PM
                 if (isAfter(currentTime, todayMarketClose)) {
                     setIsMarketClosedPermanently(true);
                     clearInterval(interval); // Stop timer if market closed
                 }
             }
         }, 1000);

         // Cleanup interval on unmount or when market closes permanently
         return () => clearInterval(interval);
     }

   }, []); // Run only once on mount for this demo setup

   // Return the formatted time left and the current market status
   // Use isMarketClosedPermanently for the overlay (Story 81)
   // Use isMarketOpen for enabling/disabling actions
   return { timeLeft, isMarketOpen, isMarketClosedPermanently };
 }
