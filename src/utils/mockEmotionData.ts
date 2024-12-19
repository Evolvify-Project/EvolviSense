import { EmotionData } from '../types/emotion';

export const generateMockEmotionData = (): EmotionData => ({
  neutral: Math.random() * 0.3,
  happy: Math.random() * 0.2,
  sad: Math.random() * 0.1,
  angry: Math.random() * 0.1,
  fearful: Math.random() * 0.2,
  disgusted: Math.random() * 0.05,
  surprised: Math.random() * 0.05,
});