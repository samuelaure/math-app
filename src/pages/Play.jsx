import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameLoop } from '../hooks/useGameLoop';
import { Link } from 'react-router-dom';
import StandardUI from '../components/sandbox/StandardUI';
import GuessOperatorUI from '../components/sandbox/GuessOperatorUI';
import VerticalMathUI from '../components/sandbox/VerticalMathUI';
import VerticalStepUI from '../components/sandbox/VerticalStepUI';
import CompositeUI from '../components/sandbox/CompositeUI';
import LevelProgressBar from '../components/ui/LevelProgressBar';
import '../styles/theme.css';

export default function Play() {
  const { problem, userAnswer, setUserAnswer, submitAnswer, status, timeWaiting, progress, progressData, currentLvl, attempts, skipProblem } = useGameLoop();
  const inputRef = useRef(null);

  useEffect(() => {
    if (status === 'idle' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [status, problem]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      submitAnswer();
    }
  };

  const showWhisper = timeWaiting > 10 && status === 'idle';

  const renderSandbox = () => {
    const props = {
      payload: problem.payload,
      userAnswer,
      setUserAnswer,
      submitAnswer,
      status,
      inputRef,
      handleKeyDown,
      showWhisper,
      attempts
    };

    switch (problem.type) {
      case 'guess_operator': return <GuessOperatorUI {...props} />;
      case 'vertical': 
        if (problem.payload.renderMode === 'algorithm') {
          return <VerticalStepUI {...props} />;
        }
        return <VerticalMathUI {...props} />;
      case 'composite': return <CompositeUI {...props} />;
      case 'standard':
      default:
        return <StandardUI {...props} />;
    }
  };

  return (
    <div className="play-container">
      <div className="top-bar">
        <Link to="/" className="btn secondary small">← Inicio</Link>
        <LevelProgressBar
          currentLevel={currentLvl}
          progressData={progressData}
          seeds={progress.seeds}
        />
      </div>

      <main className="game-area">
        <AnimatePresence mode="wait">
          <motion.div
            key={problem.id}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            {renderSandbox()}
          </motion.div>
        </AnimatePresence>

        <div className="status-feedback">
          {status === 'correct' && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="feedback correct">
              ✨ ¡Correcto!
            </motion.div>
          )}
          {status === 'incorrect' && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="feedback incorrect">
              Intenta de nuevo...
            </motion.div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          {problem.type !== 'guess_operator' && (
            <button
              className="btn commit-btn"
              onClick={() => submitAnswer()}
              disabled={status !== 'idle' || userAnswer === ''}
            >
              Enviar
            </button>
          )}

          {attempts >= 2 && status !== 'correct' && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="btn secondary commit-btn"
              onClick={skipProblem}
            >
              Saltar
            </motion.button>
          )}
        </div>
      </main>
    </div>
  );
}
