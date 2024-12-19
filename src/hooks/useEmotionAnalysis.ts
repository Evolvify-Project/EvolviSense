import { useState, useCallback, useRef, useEffect } from 'react';
import { EmotionState } from '../types/emotion';
import { useWebcam } from './useWebcam';
import { useAudioAnalysis } from './useAudioAnalysis';
import { useDetector } from './useDetector';
import { useEmotionTracking } from './useEmotionTracking';

export const useEmotionAnalysis = () => {
  const {
    videoRef,
    isWebcamActive,
    error: webcamError,
    startWebcam,
    stopWebcam,
  } = useWebcam();

  const {
    isAudioActive,
    error: audioError,
    startAudioAnalysis,
    stopAudioAnalysis,
    analyzeAudio,
  } = useAudioAnalysis();

  const { initializeDetector, isDetectorReady } = useDetector();
  const [isProcessingStop, setIsProcessingStop] = useState(false);

  const {
    emotionHistory,
    isAnalyzing,
    analysisStartTime,
    startTracking,
    stopTracking,
    updateEmotions,
  } = useEmotionTracking();

  const startAnalysis = useCallback(async () => {
    try {
      if (!isDetectorReady()) {
        await initializeDetector();
      }
      await Promise.all([startWebcam(), startAudioAnalysis()]);
      startTracking();
    } catch (error) {
      console.error('Failed to start analysis:', error);
      throw error;
    }
  }, [startWebcam, startAudioAnalysis, initializeDetector, startTracking, isDetectorReady]);

  const stopAnalysis = useCallback(() => {
    if (isProcessingStop) return;
    setIsProcessingStop(true);

    // Ensure we capture the final frame
    setTimeout(() => {
      stopTracking();
      stopWebcam();
      stopAudioAnalysis();
      setIsProcessingStop(false);
    }, 100);
  }, [stopWebcam, stopAudioAnalysis, stopTracking, isProcessingStop]);

  useEffect(() => {
    if (isAnalyzing && isWebcamActive && isAudioActive) {
      const cleanup = updateEmotions(videoRef.current, analyzeAudio);
      return cleanup;
    }
  }, [isAnalyzing, isWebcamActive, isAudioActive, updateEmotions, videoRef, analyzeAudio]);

  return {
    videoRef,
    emotionHistory,
    isAnalyzing,
    analysisStartTime,
    error: webcamError || audioError,
    startAnalysis,
    stopAnalysis,
  };
};