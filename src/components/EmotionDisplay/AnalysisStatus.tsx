import React from 'react';
import { Video, Mic } from 'lucide-react';

interface AnalysisStatusProps {
  elapsedTime: number;
  isInitialPeriod: boolean;
}

export const AnalysisStatus: React.FC<AnalysisStatusProps> = ({ elapsedTime, isInitialPeriod }) => {
  return (
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
            className="h-full transition-all duration-300"
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
  );
};