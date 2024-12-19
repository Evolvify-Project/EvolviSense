import { EmotionState, AudioEmotionData, EmotionData } from '../types/emotion';

export const combinedAnalysis = (
  videoEmotions: EmotionData,
  audioEmotions: AudioEmotionData
): EmotionState['combinedAnalysis'] => {
  const overallStress = (
    videoEmotions.fearful * 40 +
    videoEmotions.angry * 30 +
    (audioEmotions.stress / 100) * 30
  );

  const overallConfidence = (
    (1 - videoEmotions.fearful) * 40 +
    (audioEmotions.confidence / 100) * 60
  );

  const emotionScores = {
    confident: overallConfidence,
    stressed: overallStress,
    nervous: (videoEmotions.fearful * 50 + (audioEmotions.nervousness / 100) * 50),
    excited: (videoEmotions.happy * 40 + (audioEmotions.excitement / 100) * 60)
  };

  const dominantEmotion = Object.entries(emotionScores)
    .reduce((a, b) => a[1] > b[1] ? a : b)[0];

  return {
    overallStress,
    overallConfidence,
    dominantEmotion
  };
};