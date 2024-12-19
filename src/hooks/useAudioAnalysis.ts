import { useState, useCallback, useRef } from 'react';
import { AudioEmotionData } from '../types/emotion';

export const useAudioAnalysis = () => {
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startAudioAnalysis = useCallback(async () => {
    try {
      // Clean up existing audio context and stream
      if (audioContextRef.current) {
        await audioContextRef.current.close();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const context = new AudioContext();
      const source = context.createMediaStreamSource(stream);
      const analyzerNode = context.createAnalyser();
      
      source.connect(analyzerNode);
      streamRef.current = stream;
      audioContextRef.current = context;
      analyzerRef.current = analyzerNode;
      setIsAudioActive(true);
      setError(null);
    } catch (err) {
      setError('Failed to access microphone. Please ensure you have granted permission.');
      console.error('Audio analysis error:', err);
      throw err;
    }
  }, []);

  const stopAudioAnalysis = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyzerRef.current = null;
    setIsAudioActive(false);
  }, []);

  const analyzeAudio = useCallback((): AudioEmotionData | null => {
    if (!analyzerRef.current) return null;

    const dataArray = new Float32Array(analyzerRef.current.frequencyBinCount);
    analyzerRef.current.getFloatFrequencyData(dataArray);

    const avgFrequency = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    const normalizedFreq = Math.min(Math.max((avgFrequency + 140) / 60, 0), 1);

    return {
      stress: normalizedFreq * 100,
      confidence: (1 - normalizedFreq) * 100,
      excitement: Math.random() * 100,
      nervousness: normalizedFreq * 80
    };
  }, []);

  return {
    isAudioActive,
    error,
    startAudioAnalysis,
    stopAudioAnalysis,
    analyzeAudio
  };
};