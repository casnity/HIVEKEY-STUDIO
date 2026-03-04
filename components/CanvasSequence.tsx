"use client";

import { useEffect, useRef } from "react";
import { MotionValue, useTransform } from "motion/react";
import { useImageSequence } from "@/hooks/useImageSequence";

interface CanvasSequenceProps {
  progress: MotionValue<number>;
  frameCount?: number;
}

export function CanvasSequence({ progress, frameCount = 120 }: CanvasSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // In a production app, replace this with your actual frame assets
  // e.g., `/assets/sequence/frame_${index.toString().padStart(4, '0')}.jpg`
  // For this prototype, we use a placeholder image service to demonstrate the loading strategy
  const getImageUrl = (index: number) => `https://picsum.photos/seed/hive65_${index}/1920/1080`;
  
  const { images, loadedFrames } = useImageSequence(frameCount, getImageUrl);
  const frameIndex = useTransform(progress, [0, 1], [0, frameCount - 1]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    canvas.width = 1920;
    canvas.height = 1080;

    const unsubscribe = frameIndex.on("change", (latest) => {
      const currentIndex = Math.round(latest);
      const img = images[currentIndex];
      
      if (img) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      } else {
        // Fallback to closest loaded frame to prevent flashing
        for (let i = currentIndex; i >= 0; i--) {
          if (images[i]) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(images[i]!, 0, 0, canvas.width, canvas.height);
            break;
          }
        }
      }
    });

    return () => unsubscribe();
  }, [frameIndex, images]);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Loading Progress Indicator */}
      {loadedFrames < frameCount && (
        <div className="absolute top-24 right-6 z-50 text-xs font-mono text-[#FF6A00] bg-[#0A0000]/80 px-4 py-2 rounded-full backdrop-blur-md border border-[#FF0000]/20 flex items-center gap-3 shadow-[0_0_15px_rgba(255,106,0,0.2)]">
          <div className="w-3 h-3 rounded-full border-2 border-[#FF6A00] border-t-transparent animate-spin" />
          Preloading Sequence: {Math.round((loadedFrames / frameCount) * 100)}%
        </div>
      )}
      
      {/* 
        The canvas is set to low opacity and mix-blend-screen here so it doesn't 
        completely hide the CSS 3D prototype underneath. In production with real 
        assets, you would remove the CSS 3D KeyboardSequence and set this to opacity-100.
      */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover opacity-10 mix-blend-screen" 
      />
    </div>
  );
}
