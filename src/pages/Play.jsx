import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameLoop } from '../hooks/useGameLoop';
import { Link } from 'react-router-dom';
import '../styles/theme.css'; 

export default function Play() {
  const { problem, userAnswer, setUserAnswer, submitAnswer, status, timeWaiting, progress } = useGameLoop();
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

  return (
    <div className="play-container">
      <div className="top-bar">
        <Link to="/" className="btn secondary small">← Back</Link>
        <div className="seeds-badge">🌱 Seeds: {progress.seeds}</div>
      </div>

      <main className="game-area">
        <AnimatePresence mode="wait">
          <motion.div 
            key={`${problem.num1}-${problem.operation}-${problem.num2}`}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="equation"
          >
            <span className="number">{problem.num1}</span>
            <span className="operator">{problem.operation}</span>
            <span className="number">{problem.num2}</span>
            <span className="operator">=</span>
            
            <div className="input-wrapper">
               <input
                ref={inputRef}
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={status !== 'idle'}
                className={`answer-input ${status}`}
              />
              {showWhisper && (
                <motion.div 
                  className="whisper-glow"
                  animate={{ opacity: [0, 0.4, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              )}
            </div>
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
        
        <button 
          className="btn commit-btn" 
          onClick={submitAnswer}
          disabled={status !== 'idle' || userAnswer === ''}
        >
          Empezar
        </button>
      </main>
    </div>
  );
}
