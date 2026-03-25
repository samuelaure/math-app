import { useState, useEffect, useCallback } from 'react';
import { generateProblem, calculateNextLevel } from '../utils/mathEngine';
import { useProgress } from './useProgress';

export const useGameLoop = () => {
  const { progress, addSeed, recordAnswer } = useProgress();
  const [problem, setProblem] = useState(() => generateProblem(progress.manualOverride || progress.level));
  const [userAnswer, setUserAnswer] = useState('');
  const [status, setStatus] = useState('idle'); 
  const [timeWaiting, setTimeWaiting] = useState(0);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (status === 'incorrect') {
       setStatus('idle');
    }
  }, [userAnswer]); 

  useEffect(() => {
    if (status === 'idle') {
      const timer = setInterval(() => setTimeWaiting(t => t + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [status, problem]);

  const submitAnswer = useCallback((customAnswer) => {
    const evalAnswer = customAnswer !== undefined ? customAnswer : userAnswer;
    if (evalAnswer === '') return;
    if (status === 'correct') return; 
    
    let isCorrect = false;
    if (typeof problem.answer === 'string') {
      isCorrect = String(evalAnswer).trim() === problem.answer;
    } else {
      isCorrect = parseInt(evalAnswer, 10) === problem.answer;
    }
    
    if (isCorrect) {
      setStatus('correct');
      const relevantHistory = [...progress.history, isCorrect].slice(-3);
      const nextLevel = calculateNextLevel(progress.level, relevantHistory);

      addSeed();
      recordAnswer(isCorrect, nextLevel);

      setTimeout(() => {
        const levelToUse = progress.manualOverride || nextLevel;
        setProblem(generateProblem(levelToUse));
        setUserAnswer('');
        setStatus('idle');
        setTimeWaiting(0);
        setAttempts(0); 
      }, 1500); 
    } else {
       setStatus('incorrect');
       setAttempts(a => a + 1);
       setTimeout(() => {
         setUserAnswer('');
         setStatus('idle');
       }, 1000);
    }
    
  }, [userAnswer, problem.answer, progress.level, progress.history, addSeed, recordAnswer, progress.manualOverride, status]);

  const skipProblem = useCallback(() => {
    const relevantHistory = [...progress.history, false].slice(-3);
    const nextLevel = calculateNextLevel(progress.level, relevantHistory);
    recordAnswer(false, nextLevel);

    const levelToUse = progress.manualOverride || nextLevel;
    setProblem(generateProblem(levelToUse));
    setUserAnswer('');
    setStatus('idle');
    setTimeWaiting(0);
    setAttempts(0);
  }, [progress.level, progress.history, recordAnswer, progress.manualOverride]);

  return { problem, userAnswer, setUserAnswer, submitAnswer, status, timeWaiting, progress, attempts, skipProblem };
};
