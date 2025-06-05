// src/hooks/useLoadAssets.ts
import { useEffect, useState } from 'react';
import * as Font from 'expo-font';
// import { Asset } from 'expo-asset'; // For preloading images, if needed

export function useLoadAssets() {
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        // Master Lith: Ensure these paths are correct and files exist in 'assets/fonts/'.
        // These paths are relative to the location of this useLoadAssets.ts file.
        await Font.loadAsync({
          'MedievalSharp-Regular': require('../../assets/fonts/MedievalSharp-Regular.ttf'),
          'Lato-Regular': require('../../assets/fonts/Lato-Regular.ttf'),
          'Lato-Bold': require('../../assets/fonts/Lato-Bold.ttf'),
        });
        console.log("Assets loaded successfully.");
      } catch (e: any) {
        setError(e); console.warn('Error loading assets:', e);
      } finally {
        setAssetsLoaded(true);
      }
    }
    loadResourcesAndDataAsync();
  }, []);
  return { assetsLoaded, error };
}
