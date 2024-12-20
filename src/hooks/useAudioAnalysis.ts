import { useState, useCallback, useRef } from 'react';
import { AudioEmotionData } from '../types/emotion';

// Audio analysis configuration
const SAMPLE_RATE = 44100;
const FFT_SIZE = 2048;
const SMOOTHING_TIME_CONSTANT = 0.8;

export const useAudioAnalysis = () => {
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Add buffer for temporal analysis
  const bufferRef = useRef<Float32Array | null>(null);
  const previousAnalysisRef = useRef<AudioEmotionData | null>(null);

  const startAudioAnalysis = useCallback(async () => {
    try {
      if (audioContextRef.current) {
        await audioContextRef.current.close();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: SAMPLE_RATE
        } 
      });

      const context = new AudioContext({ sampleRate: SAMPLE_RATE });
      const source = context.createMediaStreamSource(stream);
      const analyzerNode = context.createAnalyser();
      
      // Enhanced analyzer configuration
      analyzerNode.fftSize = FFT_SIZE;
      analyzerNode.smoothingTimeConstant = SMOOTHING_TIME_CONSTANT;
      
      source.connect(analyzerNode);
      streamRef.current = stream;
      audioContextRef.current = context;
      analyzerRef.current = analyzerNode;
      bufferRef.current = new Float32Array(analyzerNode.frequencyBinCount);
      
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
    bufferRef.current = null;
    previousAnalysisRef.current = null;
    setIsAudioActive(false);
  }, []);

  const analyzeAudio = useCallback((): AudioEmotionData | null => {
    if (!analyzerRef.current || !bufferRef.current) return null;

    const analyzer = analyzerRef.current;
    const buffer = bufferRef.current;
    
    analyzer.getFloatFrequencyData(buffer);

    // Enhanced frequency analysis
    const lowFreqSum = buffer.slice(0, 10).reduce((a, b) => a + b, 0);
    const midFreqSum = buffer.slice(10, 30).reduce((a, b) => a + b, 0);
    const highFreqSum = buffer.slice(30, 50).reduce((a, b) => a + b, 0);

    // Normalize frequency data
    const normalizeFreq = (freq: number) => Math.min(Math.max((freq + 140) / 60, 0), 1);
    
    const lowFreqNorm = normalizeFreq(lowFreqSum / 10);
    const midFreqNorm = normalizeFreq(midFreqSum / 20);
    const highFreqNorm = normalizeFreq(highFreqSum / 20);

    // Calculate emotional indicators
    const stress = (highFreqNorm * 0.6 + midFreqNorm * 0.4) * 100;
    const confidence = (1 - ((lowFreqNorm * 0.3 + midFreqNorm * 0.7))) * 100;
    const excitement = (highFreqNorm * 0.7 + midFreqNorm * 0.3) * 100;
    const nervousness = (midFreqNorm * 0.6 + highFreqNorm * 0.4) * 100;

    // Apply temporal smoothing
    const previous = previousAnalysisRef.current;
    const smoothingFactor = 0.3;

    const smoothedData: AudioEmotionData = {
      stress: previous ? stress * smoothingFactor + previous.stress * (1 - smoothingFactor) : stress,
      confidence: previous ? confidence * smoothingFactor + previous.confidence * (1 - smoothingFactor) : confidence,
      excitement: previous ? excitement * smoothingFactor + previous.excitement * (1 - smoothingFactor) : excitement,
      nervousness: previous ? nervousness * smoothingFactor + previous.nervousness * (1 - smoothingFactor) : nervousness,
      pitch: calculatePitch(buffer),
      volume: calculateVolume(buffer),
      speechRate: calculateSpeechRate(buffer)
    };

    previousAnalysisRef.current = smoothedData;
    return smoothedData;
  }, []);

  return {
    isAudioActive,
    error,
    startAudioAnalysis,
    stopAudioAnalysis,
    analyzeAudio
  };
};

// Helper functions for advanced audio analysis
const calculatePitch = (buffer: Float32Array): number => {
  // Implement pitch detection using autocorrelation
  // This is a simplified version
  const sum = buffer.reduce((acc, val) => acc + Math.abs(val), 0);
  return (sum / buffer.length + 140) / 280 * 100;
};

const calculateVolume = (buffer: Float32Array): number => {
  const sum = buffer.reduce((acc, val) => acc + Math.pow(val + 140, 2), 0);
  return Math.min((Math.sqrt(sum / buffer.length) / 140) * 100, 100);
};

const calculateSpeechRate = (buffer: Float32Array): number => {
  // Implement speech rate detection using zero-crossing rate
  let crossings = 0;
  for (let i = 1; i < buffer.length; i++) {
    if ((buffer[i] >= 0 && buffer[i - 1] < 0) || 
        (buffer[i] < 0 && buffer[i - 1] >= 0)) {
      crossings++;
    }
  }
  return Math.min((crossings / buffer.length) * 200, 100);
};