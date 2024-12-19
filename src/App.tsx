import { useState } from 'react';
import { useEmotionAnalysis } from './hooks/useEmotionAnalysis';
import { WebcamView } from './components/WebcamView';
import { SessionSummary } from './components/SessionSummary';
import { EmotionDisplay } from './components/EmotionDisplay';

function App() {
  const {
    videoRef,
    emotionHistory,
    isAnalyzing,
    analysisStartTime,
    error,
    startAnalysis,
    stopAnalysis,
  } = useEmotionAnalysis();

  const [showResults, setShowResults] = useState(false);

  const handleStart = async () => {
    try {
      setShowResults(false);
      await startAnalysis();
    } catch (error) {
      console.error('Failed to start session:', error);
    }
  };

  const handleStop = () => {
    try {
      stopAnalysis();
      if (emotionHistory.length > 0) {
        setShowResults(true);
      }
    } catch (error) {
      console.error('Failed to stop session:', error);
    }
  };

  const currentEmotion = emotionHistory[emotionHistory.length - 1] || null;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Real-time Emotion Analysis
          </h1>
          <p className="text-gray-600">
            Get instant feedback on your emotional state during presentations and interviews
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {!showResults && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <WebcamView
              videoRef={videoRef}
              isActive={isAnalyzing}
              onStart={handleStart}
              onStop={handleStop}
            />
            <div className="flex flex-col justify-center">
              {isAnalyzing ? (
                <EmotionDisplay
                  emotionData={currentEmotion}
                  emotionHistory={emotionHistory}
                  analysisStartTime={analysisStartTime}
                />
              ) : (
                <div className="text-center text-gray-600">
                  <p>Press the camera button to start your session</p>
                </div>
              )}
            </div>
          </div>
        )}

        {showResults && emotionHistory.length > 0 && (
          <SessionSummary
            emotionHistory={emotionHistory}
            onClose={() => setShowResults(false)}
          />
        )}
      </div>
    </div>
  );
}
export default App;