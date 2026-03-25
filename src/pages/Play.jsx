import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameLoop } from '../hooks/useGameLoop';
import { Link } from 'react-router-dom';
import '../styles/theme.css'; 

export default function Play() {
  const { problem, userAnswer, setUserAnswer, submitAnswer, status, timeWaiting, progress, attempts, skipProblem } = useGameLoop();
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
        <Link to="/" className="btn secondary small">← Inicio</Link>
        <div className="seeds-badge">🌱 Semillas: {progress.seeds}</div>
      </div>

      <main className="game-area">
        <AnimatePresence mode="wait">
          <motion.div 
            key={problem.id}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="equation"
          >
            <span className="number">{problem.payload?.num1}</span>
            <span className="operator">{problem.payload?.operation}</span>
            <span className="number">{problem.payload?.num2}</span>
            <span className="operator">=</span>
            
            <div className="input-wrapper">
               <input
                ref={inputRef}
                autoFocus
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={status === 'correct' || status === 'incorrect'}
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
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button 
            className="btn commit-btn" 
            onClick={submitAnswer}
            disabled={status !== 'idle' || userAnswer === ''}
          >
            Enviar
          </button>
          
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
