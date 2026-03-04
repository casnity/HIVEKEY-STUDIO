import { useState, useEffect, useRef } from 'react';

export function useImageSequence(frameCount: number, getImageUrl: (index: number) => string) {
  const [loadedFrames, setLoadedFrames] = useState(0);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(frameCount).fill(null));

  useEffect(() => {
    let isCancelled = false;

    const loadImage = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        if (imagesRef.current[index] || isCancelled) {
          resolve();
          return;
        }

        const img = new Image();
        img.src = getImageUrl(index);
        
        img.onload = () => {
          if (!isCancelled) {
            imagesRef.current[index] = img;
            setLoadedFrames((prev) => prev + 1);
          }
          resolve();
        };
        
        img.onerror = () => {
          // Resolve anyway to continue loading other frames even if one fails
          resolve(); 
        };
      });
    };

    const preloadImages = async () => {
      // 1. Load first frame immediately for initial render
      await loadImage(0);
      if (isCancelled) return;

      // 2. Load next batch for immediate scrolling (frames 1-10)
      const initialBatch: Promise<void>[] = [];
      for (let i = 1; i <= 10 && i < frameCount; i++) {
        initialBatch.push(loadImage(i));
      }
      await Promise.all(initialBatch);
      if (isCancelled) return;

      // 3. Staggered background loading for the rest using requestIdleCallback
      // This ensures smooth playback without blocking the main thread
      const batchSize = 5;
      for (let i = 11; i < frameCount; i += batchSize) {
        if (isCancelled) break;
        
        const batch: Promise<void>[] = [];
        for (let j = i; j < i + batchSize && j < frameCount; j++) {
          batch.push(loadImage(j));
        }

        await new Promise<void>((resolve) => {
          const runBatch = () => {
            Promise.all(batch).then(() => resolve());
          };

          if ('requestIdleCallback' in window) {
            (window as any).requestIdleCallback(runBatch);
          } else {
            setTimeout(runBatch, 50);
          }
        });
      }
    };

    preloadImages();

    return () => {
      isCancelled = true;
    };
  }, [frameCount, getImageUrl]);

  return {
    images: imagesRef.current,
    loadedFrames,
    progress: loadedFrames / frameCount,
    isFullyLoaded: loadedFrames === frameCount
  };
}
