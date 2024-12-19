import { EmotionState } from '../../types/emotion';
import { EmotionAggregates } from './emotionAggregator';

export interface EmotionTrend {
  trend: string;
  intensity: number;
  description: string;
}

export const analyzeEmotionTrends = (
  history: EmotionState[],
  aggregates: EmotionAggregates
): EmotionTrend => {
  const recentEmotions = history.slice(-5);
  const trendDirection = calculateTrendDirection(recentEmotions);
  
  const intensity = calculateIntensity(aggregates);
  const trend = determineTrend(aggregates, trendDirection);
  
  return {
    trend,
    intensity,
    description: generateDescription(trend, intensity, aggregates)
  };
};

const calculateTrendDirection = (recentEmotions: EmotionState[]): 'increasing' | 'decreasing' | 'stable' => {
  if (recentEmotions.length < 2) return 'stable';
  
  const recent = recentEmotions[recentEmotions.length - 1];
  const previous = recentEmotions[recentEmotions.length - 2];
  
  const stressDiff = recent.stressLevel - previous.stressLevel;
  const anxietyDiff = recent.anxietyLevel - previous.anxietyLevel;
  
  if (Math.abs(stressDiff) < 5 && Math.abs(anxietyDiff) < 5) return 'stable';
  return (stressDiff + anxietyDiff) / 2 > 0 ? 'increasing' : 'decreasing';
};

const calculateIntensity = (aggregates: EmotionAggregates): number => {
  const maxStress = Math.max(...aggregates.stress.peaks);
  const maxAnxiety = Math.max(...aggregates.anxiety.peaks);
  const avgConfidence = aggregates.confidence.value;
  
  return (maxStress * 0.4 + maxAnxiety * 0.4 + (100 - avgConfidence) * 0.2);
};