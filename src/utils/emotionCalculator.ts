import { EmotionData, FacialFeatures } from '../types/emotion';

interface EmotionScores {
  primaryEmotion: string;
  confidence: number;
  stressLevel: number;
  anxietyLevel: number;
  emotionalTrend: string;
  facialFeatures: FacialFeatures;
}

export const calculateEmotionScores = (
  emotions: EmotionData,
  landmarks: any[]
): EmotionScores => {
  const stressLevel = calculateStressLevel(emotions);
  const anxietyLevel = calculateAnxietyLevel(emotions);
  const [primaryEmotion, confidence] = getPrimaryEmotion(emotions);
  const emotionalTrend = getEmotionalTrend(stressLevel, anxietyLevel, emotions);
  const facialFeatures = analyzeFacialFeatures(landmarks);

  return {
    primaryEmotion,
    confidence,
    stressLevel,
    anxietyLevel,
    emotionalTrend,
    facialFeatures
  };
};

const calculateStressLevel = (emotions: EmotionData): number => {
  const baseStress = emotions.fearful * 0.4 + emotions.angry * 0.3 + emotions.sad * 0.3;
  const intensityFactor = Math.pow(baseStress, 1.2);
  return Math.min(intensityFactor * 100, 100);
};

const calculateAnxietyLevel = (emotions: EmotionData): number => {
  const baseAnxiety = emotions.fearful * 0.5 + emotions.surprised * 0.3 + emotions.sad * 0.2;
  const nervousnessFactor = emotions.neutral < 0.2 ? 1.2 : 1.0;
  return Math.min(baseAnxiety * nervousnessFactor * 100, 100);
};

const getPrimaryEmotion = (emotions: EmotionData): [string, number] => {
  const entries = Object.entries(emotions);
  const [emotion, value] = entries.reduce((a, b) => a[1] > b[1] ? a : b);
  const confidence = value / entries.reduce((sum, [, val]) => sum + val, 0);
  return [emotion, confidence * 100];
};

const getEmotionalTrend = (
  stressLevel: number,
  anxietyLevel: number,
  emotions: EmotionData
): string => {
  if (stressLevel > 70) return 'highly_stressed';
  if (anxietyLevel > 70) return 'highly_anxious';
  if (stressLevel > 50 || anxietyLevel > 50) return 'moderately_tense';
  if (emotions.happy > 0.4) return 'positive';
  if (emotions.neutral > 0.5) return 'composed';
  return 'neutral';
};

const analyzeFacialFeatures = (landmarks: any[]): FacialFeatures => {
  // In a real implementation, this would use actual landmark positions
  return {
    eyeOpenness: 0.5 + (Math.random() * 0.5),
    browTension: 0.5 + (Math.random() * 0.5),
    mouthTension: 0.5 + (Math.random() * 0.5)
  };
};