import { useRef, useCallback } from 'react';
import { initializeDetector as initDetector } from '../utils/emotionAnalysis';

export const useDetector = () => {
  const detectorInitializedRef = useRef(false);

  const initializeDetector = useCallback(async () => {
    try {
      await initDetector();
      detectorInitializedRef.current = true;
    } catch (error) {
      console.error('Failed to initialize detector:', error);
      throw error;
    }
  }, []);

  const isDetectorReady = useCallback(() => {
    return detectorInitializedRef.current;
  }, []);

  return {
    initializeDetector,
    isDetectorReady,
  };
};