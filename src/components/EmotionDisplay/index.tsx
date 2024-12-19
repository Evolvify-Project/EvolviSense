import React, { useMemo } from 'react';
import { EmotionState } from '../../types/emotion';
import { EmotionStateCard } from './EmotionStateCard';
import { AnalysisStatus } from './AnalysisStatus';
import { EmotionChart } from './EmotionChart';

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
  const { elapsedTime, isInitialPeriod } = useMemo(() => {
    const elapsed = analysisStartTime
      ? Math.floor((new Date().getTime() - analysisStartTime.getTime()) / 1000)
      : 0;
    return {
      elapsedTime: elapsed,
      isInitialPeriod: elapsed <= 120
    };
  }, [analysisStartTime]);

  if (!emotionData) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EmotionStateCard emotionData={emotionData} />
        <AnalysisStatus 
          elapsedTime={elapsedTime}
          isInitialPeriod={isInitialPeriod}
        />
      </div>
      <EmotionChart emotionHistory={emotionHistory} />
    </div>
  );
};