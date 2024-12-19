import { useRef, useState, useCallback } from 'react';

export const useWebcam = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startWebcam = useCallback(async () => {
    try {
      // Stop any existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        streamRef.current = stream;
        setIsWebcamActive(true);
        setError(null);
      }
    } catch (err) {
      setError('Failed to access webcam. Please ensure you have granted permission.');
      console.error('Webcam error:', err);
      throw err;
    }
  }, []);

  const stopWebcam = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsWebcamActive(false);
  }, []);

  return {
    videoRef,
    isWebcamActive,
    error,
    startWebcam,
    stopWebcam,
  };
};