import { useState, useEffect } from 'react';

const STORAGE_KEY = 'mathgarden_progress';

export const useProgress = () => {
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return {
      level: 1,
      seeds: 0,
      history: [],
      stats: { total: 0, correct: 0 },
      manualOverride: null 
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const addSeed = () => {
    setProgress(prev => ({ ...prev, seeds: prev.seeds + 1 }));
  };

  const recordAnswer = (isCorrect, newLevel) => {
    setProgress(prev => {
      const updatedHistory = [...prev.history, isCorrect].slice(-5);
      const total = prev.stats?.total || 0;
      const correct = prev.stats?.correct || 0;
      return {
        ...prev,
        level: prev.manualOverride ? prev.manualOverride : newLevel,
        history: updatedHistory,
        stats: {
          total: total + 1,
          correct: correct + (isCorrect ? 1 : 0)
        }
      };
    });
  };

  const setManualOverride = (level) => {
    setProgress(prev => ({
      ...prev,
      manualOverride: level,
      level: level || prev.level
    }));
  };

  return { progress, addSeed, recordAnswer, setManualOverride };
};
