import { useState, useEffect } from 'react';
import { pointsForLevel, calculateNextLevel, levelProgress, scoreThreshold } from '../utils/mathEngine';

const STORAGE_KEY = 'mathgarden_progress';
const MAX_LEVEL = 15;

export const useProgress = () => {
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migrate old saves that don't have `score`
      if (parsed.score === undefined) {
        parsed.score = scoreThreshold(parsed.level || 1);
      }
      return parsed;
    }
    return {
      level: 1,
      score: 0,
      seeds: 0,
      history: [],
      stats: { total: 0, correct: 0 },
      manualOverride: null,
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const addSeed = () => {
    setProgress(prev => ({ ...prev, seeds: prev.seeds + 1 }));
  };

  /**
   * Record an answer result and award points based on the level of the problem.
   * @param {boolean} isCorrect
   * @param {number}  problemLevel – the level of the problem just answered
   */
  const recordAnswer = (isCorrect, problemLevel) => {
    setProgress(prev => {
      const total = prev.stats?.total || 0;
      const correct = prev.stats?.correct || 0;

      const newScore = isCorrect
        ? prev.score + pointsForLevel(problemLevel)
        : Math.max(0, prev.score - Math.floor(pointsForLevel(problemLevel) * 0.25)); // soft penalty on wrong

      const newLevel = prev.manualOverride
        ? prev.manualOverride
        : calculateNextLevel(newScore, MAX_LEVEL);

      return {
        ...prev,
        score: newScore,
        level: newLevel,
        stats: {
          total: total + 1,
          correct: correct + (isCorrect ? 1 : 0),
        },
      };
    });
  };

  const setManualOverride = (level) => {
    setProgress(prev => ({
      ...prev,
      manualOverride: level,
      level: level || prev.level,
    }));
  };

  /** Derived helpers exposed to consumers */
  const currentLvl = progress.manualOverride || progress.level;
  const progressData = levelProgress(progress.score, currentLvl, MAX_LEVEL);

  return { progress, progressData, currentLvl, addSeed, recordAnswer, setManualOverride };
};
