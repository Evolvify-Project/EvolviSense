import React from 'react';
import { Brain, Activity } from 'lucide-react';
import { EmotionState } from '../../types/emotion';
import { getEmotionIcon, getEmotionalStateDescription } from './utils';

interface EmotionStateCardProps {
  emotionData: EmotionState;
}

export const EmotionStateCard: React.FC<EmotionStateCardProps> = ({ emotionData }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center gap-2 mb-4">
        {getEmotionIcon(emotionData)}
        <h3 className="text-lg font-semibold">Emotional State</h3>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">{getEmotionalStateDescription(emotionData)}</p>
        <div className="flex items-center gap-2">
          <Brain className="text-purple-500" size={16} />
          <span className="text-sm">Primary: {emotionData.primaryEmotion}</span>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="text-blue-500" size={16} />
          <span className="text-sm">Confidence: {emotionData.confidence.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};