import React from 'react';
import { Camera, CameraOff } from 'lucide-react';

interface WebcamViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isActive: boolean;
  onStart: () => Promise<void>;
  onStop: () => void;
}

export const WebcamView: React.FC<WebcamViewProps> = ({
  videoRef,
  isActive,
  onStart,
  onStop,
}) => {
  const handleClick = async () => {
    if (isActive) {
      onStop();
    } else {
      await onStart();
    }
  };

  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover min-h-[400px]"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        {!isActive && (
          <div className="text-white text-center p-4">
            <p className="mb-4">Click the camera button to start analysis</p>
          </div>
        )}
      </div>
      <button
        onClick={handleClick}
        className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
        aria-label={isActive ? "Stop camera" : "Start camera"}
      >
        {isActive ? (
          <CameraOff className="text-red-500 w-6 h-6" />
        ) : (
          <Camera className="text-green-500 w-6 h-6" />
        )}
      </button>
    </div>
  );
};