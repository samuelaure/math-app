import { useState, useEffect, useCallback } from 'react';
import { generateProblem, calculateNextLevel } from '../utils/mathEngine';
import { useProgress } from './useProgress';

export const useGameLoop = () => {
  const { progress, addSeed, recordAnswer } = useProgress();
  const [problem, setProblem] = useState(() => generateProblem(progress.manualOverride || progress.level));
  const [userAnswer, setUserAnswer] = useState('');
  const [status, setStatus] = useState('idle'); 
  const [timeWaiting, setTimeWaiting] = useState(0);

  useEffect(() => {
    if (status === 'idle') {
      const timer = setInterval(() => setTimeWaiting(t => t + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [status, problem]);

  const submitAnswer = useCallback(() => {
    if (userAnswer === '') return;
    
    const isCorrect = parseInt(userAnswer, 10) === problem.answer;
    setStatus(isCorrect ? 'correct' : 'incorrect');
    
    const relevantHistory = [...progress.history, isCorrect].slice(-3);
    const nextLevel = calculateNextLevel(progress.level, relevantHistory);

    if (isCorrect) {
      addSeed();
    }
    
    recordAnswer(isCorrect, nextLevel);

    setTimeout(() => {
      const levelToUse = progress.manualOverride || nextLevel;
      setProblem(generateProblem(levelToUse));
      setUserAnswer('');
      setStatus('idle');
      setTimeWaiting(0);
    }, 1500); 
    
  }, [userAnswer, problem.answer, progress.level, progress.history, addSeed, recordAnswer, progress.manualOverride]);

  return { problem, userAnswer, setUserAnswer, submitAnswer, status, timeWaiting, progress };
};
