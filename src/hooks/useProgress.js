import { useState, useEffect } from 'react';

const STORAGE_KEY = 'mathgarden_progress';

export const useProgress = () => {
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return {
      level: 1,
      seeds: 0,
      history: []
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
      // Keep only last 5 answers for calculation
      const updatedHistory = [...prev.history, isCorrect].slice(-5);
      return {
        ...prev,
        level: newLevel,
        history: updatedHistory
      };
    });
  };

  return { progress, addSeed, recordAnswer };
};
