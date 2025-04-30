import { useEffect, useState } from 'react';
import * as Font from 'expo-font';
// import { Asset } from 'expo-asset';

// Loads custom fonts and potentially other assets asynchronously.
export function useLoadAssets() {
  // Tracks if assets are loaded.
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  // Stores any loading error.
  const [error, setError] = useState<Error | null>(null);

  // Effect runs once on component mount.
  useEffect(() => {
    // Defines the async loading function.
    async function loadResourcesAndDataAsync() {
      try {
        // --- Load Fonts ---
        // !! IMPORTANT: Replace keys and paths with your actual font files/names !!
        await Font.loadAsync({
          'MedievalSharp-Regular': require('../assets/fonts/MedievalSharp-Regular.ttf'), // EXAMPLE
          'Lato-Regular': require('../assets/fonts/Lato-Regular.ttf'),           // EXAMPLE
          'Lato-Bold': require('../assets/fonts/Lato-Bold.ttf'),               // EXAMPLE (if needed)
        });

        // --- Preload Images (Optional) ---
        // await Asset.loadAsync([ require('../assets/images/pfp-goblin-1.png') ]);

        console.log("Assets loaded successfully.");

      } catch (e) {
        // Catches and logs loading errors.
        setError(e as Error);
        console.warn('Error loading assets:', e);
      } finally {
        // Sets loading state to finished regardless of success/error.
        setAssetsLoaded(true);
      }
    }

    // Calls the loading function.
    loadResourcesAndDataAsync();
  }, []); // Empty dependency array ensures this runs only once.

  // Returns loading status and error.
  return { assetsLoaded, error };
}