import React from 'react';
import { AlertCircle, Smile, Frown } from 'lucide-react';
import { EmotionState } from '../../types/emotion';

export const getEmotionIcon = (emotionData: EmotionState) => {
  const { stressLevel, anxietyLevel } = emotionData;
  
  if (stressLevel > 70 || anxietyLevel > 70) {
    return <AlertCircle className="text-red-500" size={24} />;
  }
  if (stressLevel > 50 || anxietyLevel > 50) {
    return <Frown className="text-yellow-500" size={24} />;
  }
  return <Smile className="text-green-500" size={24} />;
};

export const getEmotionalStateDescription = (emotionData: EmotionState) => {
  const { emotionalTrend } = emotionData;
  
  switch (emotionalTrend) {
    case 'highly_stressed':
      return 'You appear to be experiencing significant stress. Consider taking a few deep breaths.';
    case 'highly_anxious':
      return 'Signs of anxiety detected. Try to stay calm and focused.';
    case 'moderately_tense':
      return 'Moderate tension detected. Maintain steady breathing.';
    case 'positive':
      return 'You appear confident and positive!';
    case 'composed':
      return 'You\'re maintaining good composure.';
    default:
      return 'Your emotional state appears balanced.';
  }
};