import { EmotionState, EmotionData, AudioEmotionData } from '../types/emotion';
import { detectFaces } from './detector';
import { calculateEmotionScores } from './emotionCalculator';
import { generateMockEmotionData } from './mockEmotionData';

const INITIAL_ANALYSIS_DURATION = 120000; // 2 minutes

export const analyzeEmotion = async (video: HTMLVideoElement): Promise<EmotionState | null> => {
  try {
    const faces = await detectFaces(video);
    if (!faces || faces.length === 0) return null;

    const face = faces[0];
    const emotionData = generateMockEmotionData();
    const landmarks = face.landmarks || [];
    
    const {
      primaryEmotion,
      confidence,
      stressLevel,
      anxietyLevel,
      emotionalTrend,
      facialFeatures
    } = calculateEmotionScores(emotionData, landmarks);

    return {
      primaryEmotion,
      confidence,
      stressLevel,
      anxietyLevel,
      emotionalTrend,
      timestamp: new Date().toISOString(),
      facialFeatures
    };
  } catch (error) {
    console.error('Error analyzing emotion:', error);
    return null;
  }
};

export { initializeDetector } from './detector';