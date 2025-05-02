import { FSRSConfig } from './types';

export const DEFAULT_CONFIG: FSRSConfig = {
  requestRetention: 0.9, // 90% 기억률 목표
  maximumInterval: 36500, // 최대 100년
  w: [
    0.4,  // again: stability
    0.2,  // again: difficulty
    0.6,  // hard: stability
    0.15, // hard: difficulty
    1.0,  // good: stability
    0.0,  // good: difficulty
    1.4,  // easy: stability
    -0.15 // easy: difficulty
  ]
}; 