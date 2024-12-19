import { EmotionState, AudioEmotionData } from '../../types/emotion';

export interface AggregatedEmotion {
  value: number;
  confidence: number;
  peaks: number[];
  variance: number;
}

export interface EmotionAggregates {
  stress: AggregatedEmotion;
  anxiety: AggregatedEmotion;
  confidence: AggregatedEmotion;
}

export const aggregateEmotions = (emotionHistory: EmotionState[]): EmotionAggregates => {
  const initialAggregates: EmotionAggregates = {
    stress: createEmptyAggregate(),
    anxiety: createEmptyAggregate(),
    confidence: createEmptyAggregate(),
  };

  if (emotionHistory.length === 0) return initialAggregates;

  return emotionHistory.reduce((acc, emotion) => {
    // Combine facial and audio data for more accurate assessment
    const audioData = emotion.audioAnalysis || {} as AudioEmotionData;
    
    // Weight facial expressions more heavily for stress/anxiety
    const stressValue = emotion.stressLevel * 0.7 + (audioData.stress || 0) * 0.3;
    const anxietyValue = emotion.anxietyLevel * 0.6 + (audioData.nervousness || 0) * 0.4;
    const confidenceValue = emotion.confidence * 0.5 + (audioData.confidence || 0) * 0.5;

    return {
      stress: updateAggregate(acc.stress, stressValue),
      anxiety: updateAggregate(acc.anxiety, anxietyValue),
      confidence: updateAggregate(acc.confidence, confidenceValue),
    };
  }, initialAggregates);
};

const createEmptyAggregate = (): AggregatedEmotion => ({
  value: 0,
  confidence: 0,
  peaks: [],
  variance: 0,
});

const updateAggregate = (
  current: AggregatedEmotion,
  newValue: number
): AggregatedEmotion => {
  const peaks = [...current.peaks, newValue].sort((a, b) => b - a).slice(0, 3);
  const values = [...current.peaks, newValue];
  
  return {
    value: calculateWeightedAverage(values),
    confidence: calculateConfidence(values),
    peaks,
    variance: calculateVariance(values),
  };
};