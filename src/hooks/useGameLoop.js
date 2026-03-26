import { useState, useEffect, useCallback } from 'react';
import { generateProblem } from '../utils/mathEngine';
import { useProgress } from './useProgress';

export const useGameLoop = () => {
  const { progress, progressData, currentLvl, addSeed, recordAnswer } = useProgress();
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
      // Pass the level of the problem (not necessarily currentLvl) for correct scoring
      addSeed();
      recordAnswer(true, problem.level);

      setTimeout(() => {
        setProblem(generateProblem(progress.manualOverride || currentLvl));
        setUserAnswer('');
        setStatus('idle');
        setTimeWaiting(0);
        setAttempts(0);
      }, 1500);
    } else {
      setStatus('incorrect');
      setAttempts(a => a + 1);
      recordAnswer(false, problem.level);
      setTimeout(() => {
        setUserAnswer('');
        setStatus('idle');
      }, 1000);
    }
  }, [userAnswer, problem.answer, problem.level, currentLvl, progress.manualOverride, addSeed, recordAnswer, status]);

  const skipProblem = useCallback(() => {
    recordAnswer(false, problem.level);
    setProblem(generateProblem(progress.manualOverride || currentLvl));
    setUserAnswer('');
    setStatus('idle');
    setTimeWaiting(0);
    setAttempts(0);
  }, [problem.level, currentLvl, progress.manualOverride, recordAnswer]);

  return {
    problem,
    userAnswer,
    setUserAnswer,
    submitAnswer,
    status,
    timeWaiting,
    progress,
    progressData,
    currentLvl,
    attempts,
    skipProblem,
  };
};
