import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { EmotionState } from '../../types/emotion';

interface EmotionChartProps {
  emotionHistory: EmotionState[];
}

export const EmotionChart: React.FC<EmotionChartProps> = ({ emotionHistory }) => {
  return (
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
  );
};