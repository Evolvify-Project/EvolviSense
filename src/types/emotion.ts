export interface EmotionData {
  neutral: number;
  happy: number;
  sad: number;
  angry: number;
  fearful: number;
  disgusted: number;
  surprised: number;
  stressed?: number;
  nervous?: number;
}

export interface AudioEmotionData {
  stress: number;
  confidence: number;
  excitement: number;
  nervousness: number;
  pitch?: number;
  volume?: number;
  speechRate?: number;
}

export interface FacialFeatures {
  eyeOpenness: number;
  browTension: number;
  mouthTension: number;
}

export interface EmotionState {
  primaryEmotion: string;
  confidence: number;
  stressLevel: number;
  anxietyLevel: number;
  emotionalTrend?: string;
  facialFeatures?: FacialFeatures;
  audioAnalysis?: AudioEmotionData;
  combinedAnalysis?: {
    overallStress: number;
    overallConfidence: number;
    dominantEmotion: string;
  };
  timestamp: string;
}