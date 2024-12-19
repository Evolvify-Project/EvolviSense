import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { EmotionState } from '../types/emotion';
import { AlertCircle, Smile, Frown, Mic, Video, Activity, Brain, Heart } from 'lucide-react';

interface EmotionDisplayProps {
  emotionData: EmotionState | null;
  emotionHistory: EmotionState[];
  analysisStartTime: Date | null;
}

export const EmotionDisplay: React.FC<EmotionDisplayProps> = ({
  emotionData,
  emotionHistory,
  analysisStartTime
}) => {
  if (!emotionData) return null;

  const getEmotionIcon = () => {
    const { stressLevel, anxietyLevel } = emotionData;
    
    if (stressLevel > 70 || anxietyLevel > 70) return <AlertCircle className="text-red-500" size={24} />;
    if (stressLevel > 50 || anxietyLevel > 50) return <Frown className="text-yellow-500" size={24} />;
    return <Smile className="text-green-500" size={24} />;
  };

  const getEmotionalStateDescription = () => {
    const { primaryEmotion, stressLevel, anxietyLevel, emotionalTrend } = emotionData;
    
    if (emotionalTrend === 'highly_stressed') {
      return 'You appear to be experiencing significant stress. Consider taking a few deep breaths.';
    } else if (emotionalTrend === 'highly_anxious') {
      return 'Signs of anxiety detected. Try to stay calm and focused.';
    } else if (emotionalTrend === 'moderately_tense') {
      return 'Moderate tension detected. Maintain steady breathing.';
    } else if (emotionalTrend === 'positive') {
      return 'You appear confident and positive!';
    } else if (emotionalTrend === 'composed') {
      return 'You\'re maintaining good composure.';
    }
    return 'Your emotional state appears balanced.';
  
  };

  const elapsedTime = analysisStartTime
    ? Math.floor((new Date().getTime() - analysisStartTime.getTime()) / 1000)
    : 0;

  const isInitialPeriod = elapsedTime <= 120; // First 2 minutes

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-4">
            {getEmotionIcon()}
            <h3 className="text-lg font-semibold">Emotional State</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">{getEmotionalStateDescription()}</p>
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
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Analysis Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="text-blue-500" size={16} />
                <span className="text-sm">Face Analysis</span>
              </div>
              <span className="text-sm font-medium">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="text-green-500" size={16} />
                <span className="text-sm">Voice Analysis</span>
              </div>
              <span className="text-sm font-medium">Active</span>
            </div>
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ 
                  width: `${Math.min((elapsedTime / 120) * 100, 100)}%`,
                  backgroundColor: isInitialPeriod ? '#3B82F6' : '#10B981'
                }}
              />
            </div>
            <p className="text-sm text-gray-600">
              {isInitialPeriod 
                ? `Initial analysis: ${elapsedTime}s / 120s`
                : 'Continuous monitoring active'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Emotional Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={emotionHistory.slice(-30)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(value) => new Date(value).toLocaleTimeString()} 
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(value) => new Date(value).toLocaleTimeString()}
              formatter={(value: number) => [`${value.toFixed(1)}%`]}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="stressLevel" 
              stroke="#EF4444" 
              name="Stress" 
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="anxietyLevel" 
              stroke="#8B5CF6" 
              name="Anxiety" 
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="confidence" 
              stroke="#10B981" 
              name="Confidence" 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};