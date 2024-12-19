import { useState, useCallback, useRef } from 'react';
import { EmotionState } from '../types/emotion';
import { analyzeEmotion } from '../utils/emotionAnalysis';

export const useEmotionTracking = () => {
  const [emotionHistory, setEmotionHistory] = useState<EmotionState[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStartTime, setAnalysisStartTime] = useState<Date | null>(null);
  const analysisFrameRef = useRef<number>();

  const startTracking = useCallback(() => {
    setEmotionHistory([]);
    setAnalysisStartTime(new Date());
    setIsAnalyzing(true);
  }, []);

  const stopTracking = useCallback(() => {
    if (analysisFrameRef.current) {
      cancelAnimationFrame(analysisFrameRef.current);
      analysisFrameRef.current = undefined;
    }
    setIsAnalyzing(false);
  }, []);

  const updateEmotions = useCallback((
    videoElement: HTMLVideoElement | null,
    getAudioData: () => any
  ) => {
    if (!videoElement || !isAnalyzing) return () => {};

    const analyzeFrame = async () => {
      try {
        const videoEmotion = await analyzeEmotion(videoElement);
        const audioEmotion = getAudioData();

        if (videoEmotion && audioEmotion) {
          const newEmotionState: EmotionState = {
            ...videoEmotion,
            audioAnalysis: audioEmotion,
            timestamp: new Date().toISOString()
          };

          setEmotionHistory(prev => [...prev, newEmotionState]);
        }

        if (isAnalyzing) {
          analysisFrameRef.current = requestAnimationFrame(analyzeFrame);
        }
      } catch (error) {
        console.error('Analysis error:', error);
      }
    };

    analyzeFrame();

    return () => {
      if (analysisFrameRef.current) {
        cancelAnimationFrame(analysisFrameRef.current);
        analysisFrameRef.current = undefined;
      }
    };
  }, [isAnalyzing]);

  return {
    emotionHistory,
    isAnalyzing,
    analysisStartTime,
    startTracking,
    stopTracking,
    updateEmotions,
  };
};