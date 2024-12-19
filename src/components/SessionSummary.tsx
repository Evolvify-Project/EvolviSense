import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { AlertCircle, Smile, Frown, Brain, Heart, Activity } from 'lucide-react';
import { EmotionState } from '../types/emotion';
import { calculateSessionSummary } from '../utils/sessionAnalysis';

interface SessionSummaryProps {
  emotionHistory: EmotionState[];
  onClose: () => void;
}

export const SessionSummary: React.FC<SessionSummaryProps> = ({ emotionHistory, onClose }) => {
  const summary = calculateSessionSummary(emotionHistory);
  
  const getEmotionIcon = (level: number) => {
    if (level > 70) return <AlertCircle className="text-red-500" size={24} />;
    if (level > 50) return <Frown className="text-yellow-500" size={24} />;
    return <Smile className="text-green-500" size={24} />;
  };

  const averageEmotions = [
    { name: 'Stress', value: summary.averageStress, color: '#EF4444' },
    { name: 'Anxiety', value: summary.averageAnxiety, color: '#8B5CF6' },
    { name: 'Confidence', value: summary.averageConfidence, color: '#10B981' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Session Summary</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {averageEmotions.map(({ name, value, color }) => (
              <div key={name} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {getEmotionIcon(value)}
                  <h3 className="font-semibold">{name}</h3>
                </div>
                <div className="text-2xl font-bold" style={{ color }}>
                  {value.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-4">Emotional Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={emotionHistory}>
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
                <Line type="monotone" dataKey="stressLevel" stroke="#EF4444" name="Stress" />
                <Line type="monotone" dataKey="anxietyLevel" stroke="#8B5CF6" name="Anxiety" />
                <Line type="monotone" dataKey="confidence" stroke="#10B981" name="Confidence" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Key Insights</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Brain className="text-purple-500" />
                <span>Primary emotion: {summary.dominantEmotion}</span>
              </li>
              <li className="flex items-center gap-2">
                <Heart className="text-red-500" />
                <span>Peak stress level: {summary.peakStress.toFixed(1)}%</span>
              </li>
              <li className="flex items-center gap-2">
                <Activity className="text-blue-500" />
                <span>Emotional stability: {summary.emotionalStability.toFixed(1)}%</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};