import { EmotionState } from '../types/emotion';

interface SessionSummary {
  averageStress: number;
  averageAnxiety: number;
  averageConfidence: number;
  peakStress: number;
  emotionalStability: number;
  dominantEmotion: string;
}

export const calculateSessionSummary = (emotionHistory: EmotionState[]): SessionSummary => {
  if (emotionHistory.length === 0) {
    return {
      averageStress: 0,
      averageAnxiety: 0,
      averageConfidence: 0,
      peakStress: 0,
      emotionalStability: 100,
      dominantEmotion: 'neutral'
    };
  }

  const averages = emotionHistory.reduce(
    (acc, emotion) => ({
      stress: acc.stress + emotion.stressLevel,
      anxiety: acc.anxiety + emotion.anxietyLevel,
      confidence: acc.confidence + emotion.confidence
    }),
    { stress: 0, anxiety: 0, confidence: 0 }
  );

  const len = emotionHistory.length;
  const averageStress = averages.stress / len;
  const averageAnxiety = averages.anxiety / len;
  const averageConfidence = averages.confidence / len;

  // Calculate peak stress
  const peakStress = Math.max(...emotionHistory.map(e => e.stressLevel));

  // Calculate emotional stability (inverse of variance)
  const stressVariance = calculateVariance(emotionHistory.map(e => e.stressLevel));
  const anxietyVariance = calculateVariance(emotionHistory.map(e => e.anxietyLevel));
  const emotionalStability = 100 - ((stressVariance + anxietyVariance) / 2);

  // Determine dominant emotion
  const emotionCounts = emotionHistory.reduce((acc, emotion) => {
    acc[emotion.primaryEmotion] = (acc[emotion.primaryEmotion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dominantEmotion = Object.entries(emotionCounts)
    .reduce((a, b) => a[1] > b[1] ? a : b)[0];

  return {
    averageStress,
    averageAnxiety,
    averageConfidence,
    peakStress,
    emotionalStability,
    dominantEmotion
  };
};

const calculateVariance = (values: number[]): number => {
  const mean = values.reduce((a, b) => a + b) / values.length;
  const squareDiffs = values.map(value => Math.pow(value - mean, 2));
  return squareDiffs.reduce((a, b) => a + b) / values.length;
};