// Add to src/services/backgroundService.js
import { analyzeStoredImages } from './imageAnalysisService';

export const startBackgroundAnalysis = () => {
  // Run every 2 minutes
  const INTERVAL = 2 * 60 * 1000;
  
  const runAnalysis = async () => {
    console.log('Running background image analysis...');
    await analyzeStoredImages();
  };

  // Initial run
  runAnalysis();
  
  // Set up interval
  return setInterval(runAnalysis, INTERVAL);
};