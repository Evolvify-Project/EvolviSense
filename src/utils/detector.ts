import * as tf from '@tensorflow/tfjs';
import * as faceDetection from '@tensorflow-models/face-detection';

let detector: faceDetection.FaceDetector | null = null;

export const initializeDetector = async () => {
  if (!detector) {
    await tf.setBackend('webgl');
    await tf.ready();
    
    const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
    const detectorConfig = {
      runtime: 'tfjs',
      maxFaces: 1,
      modelType: 'full', // Changed from 'short' to 'full' for better accuracy
      detectorModelUrl: undefined, // Will use the default full model
      landmarkModelUrl: undefined, // Will use the default full model
    };
    
    detector = await faceDetection.createDetector(model, detectorConfig);
  }
  return detector;
};

export const detectFaces = async (video: HTMLVideoElement) => {
  if (!detector) return null;
  
  // Enhanced detection with better parameters
  const faces = await detector.estimateFaces(video, {
    flipHorizontal: false,
    staticImageMode: false,
    returnTensors: false,
    predictIrises: true // Enable iris detection for better eye tracking
  });
  
  return faces;
};