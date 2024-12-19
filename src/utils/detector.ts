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
      modelType: 'short',
    };
    detector = await faceDetection.createDetector(model, detectorConfig);
  }
  return detector;
};

export const detectFaces = async (video: HTMLVideoElement) => {
  if (!detector) return null;
  return detector.estimateFaces(video);
};