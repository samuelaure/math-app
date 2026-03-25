import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../../styles/sandbox.css';

export default function GuessOperatorUI({ payload, userAnswer, setUserAnswer, submitAnswer, status, showWhisper }) {
  const [placedOperator, setPlacedOperator] = useState(null);

  // Sincroniza limpiezas externas (por ejemplo, cambio a nueva ecuación)
  useEffect(() => {
    if (status === 'idle' && userAnswer === '') {
      setPlacedOperator(null);
    }
  }, [status, userAnswer, payload]);

  const handleDrop = (op, info) => {
    if (info.offset.y < -40) {
      setPlacedOperator(op);
      setUserAnswer(op);
      submitAnswer(op);
    }
  };

  const handleRemove = (info) => {
    if (Math.abs(info.offset.y) > 40 || Math.abs(info.offset.x) > 40) {
      setPlacedOperator(null);
      setUserAnswer('');
    }
  };

  const handleClickToPlace = (op) => {
    if (placedOperator || status === 'correct') return;
    setPlacedOperator(op);
    setUserAnswer(op);
    submitAnswer(op);
  };

  const handleClickToRemove = () => {
    if (status === 'correct') return; 
    setPlacedOperator(null);
    setUserAnswer('');
  };

  return (
    <div className="guess-operator-wrapper">
      <div className="equation">
        <span className="number">{payload.num1}</span>
        
        <div className={`dropzone-slot ${placedOperator ? status : ''}`}>
          {!placedOperator && status === 'idle' ? '?' : ''}
          
          {placedOperator && (
            <motion.div 
              layoutId={`token-${placedOperator}`}
              className={`operator-block ${placedOperator === '+' ? 'op-add' : 'op-sub'} placed`}
              onClick={handleClickToRemove}
              drag={status !== 'correct'}
              dragSnapToOrigin={true}
              onDragEnd={(_, info) => handleRemove(info)}
              whileHover={status !== 'correct' ? { scale: 1.1 } : {}}
              whileTap={status !== 'correct' ? { scale: 0.9 } : {}}
              title="Arrastra fuera o haz clic para quitar"
              style={{ margin: 0 }}
            >
              {placedOperator}
            </motion.div>
          )}

          {!placedOperator && showWhisper && (
            <motion.div 
              className="whisper-glow"
              animate={{ opacity: [0, 0.4, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          )}
        </div>

        <span className="number">{payload.num2}</span>
        <span className="operator">=</span>
        <span className="number highlight">{payload.expectedResult}</span>
      </div>

      <div className="toolbox-operator-row">
        {placedOperator !== '+' ? (
          <motion.div 
            layoutId="token-+"
            className={`operator-block op-add toolbox-item ${status === 'correct' ? 'disabled' : ''}`}
            onClick={() => handleClickToPlace('+')}
            drag={status !== 'correct'}
            dragSnapToOrigin={true}
            onDragEnd={(_, info) => handleDrop('+', info)}
            whileHover={status !== 'correct' ? { scale: 1.1 } : {}}
            whileTap={status !== 'correct' ? { scale: 0.9 } : {}}
            title="Arrastra o haz clic"
          >
            +
          </motion.div>
        ) : (
          <div className="operator-block ghost">+</div>
        )}
        
        {placedOperator !== '-' ? (
          <motion.div 
            layoutId="token--"
            className={`operator-block op-sub toolbox-item ${status === 'correct' ? 'disabled' : ''}`}
            onClick={() => handleClickToPlace('-')}
            drag={status !== 'correct'}
            dragSnapToOrigin={true}
            onDragEnd={(_, info) => handleDrop('-', info)}
            whileHover={status !== 'correct' ? { scale: 1.1 } : {}}
            whileTap={status !== 'correct' ? { scale: 0.9 } : {}}
            title="Arrastra o haz clic"
          >
            -
          </motion.div>
        ) : (
          <div className="operator-block ghost">-</div>
        )}
      </div>
    </div>
  );
}
