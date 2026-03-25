import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Base10Visualizer from './Base10Visualizer';
import '../../styles/sandbox.css';
import '../../styles/base10.css';

const BANK_ITEMS = [
  { value: 1000, label: 'Mil', colorClass: 'cube' },
  { value: 100, label: 'Cien', colorClass: 'square' },
  { value: 10, label: 'Diez', colorClass: 'bar' },
  { value: 1, label: 'Uno', colorClass: 'unit' }
];

export default function VerticalMathUI({ payload, userAnswer, setUserAnswer, status, inputRef, attempts }) {
  const [dragHistory, setDragHistory] = useState([]);

  // Evita memory bleeding entre problemas 
  useEffect(() => {
    setDragHistory([]);
  }, [payload.num1, payload.num2, payload.operation]);

  const isTactile = payload.operation === '+';

  const handleDrop = (amount) => {
    if (status !== 'idle') return;
    const currentVal = parseInt(userAnswer || 0, 10);
    const newVal = currentVal + amount;
    setUserAnswer(newVal.toString());
    setDragHistory(prev => [...prev, amount]);
  };

  const undoLast = () => {
    if (dragHistory.length === 0 || status !== 'idle') return;
    const lastAmount = dragHistory[dragHistory.length - 1];
    const currentVal = parseInt(userAnswer || 0, 10);
    const newVal = Math.max(0, currentVal - lastAmount);
    setUserAnswer(newVal === 0 ? '' : newVal.toString());
    setDragHistory(prev => prev.slice(0, -1));
  };

  return (
    <div className="vertical-equation-wrapper">
      <div className="vertical-equation">
        <div className="vertical-row top">
           <span className="number">{payload.num1}</span>
        </div>
        <div className="vertical-row bottom">
           <div className={`operator-block ${payload.operation === '+' ? 'op-add' : 'op-sub'}`}>
             {payload.operation}
           </div>
           <span className="number">{payload.num2}</span>
        </div>
        <div className="divider-line"></div>
        
        <div className="vertical-input-row">
          {isTactile && (
            <button 
              className="undo-btn" 
              onClick={undoLast} 
              title="Deshacer Movimiento"
              style={{ visibility: dragHistory.length > 0 ? 'visible' : 'hidden' }}
            >
              ↩ Deshacer
            </button>
          )}

          <input 
            ref={inputRef}
            type="number" 
            className={`answer-input alt ${status}`}
            value={userAnswer}
            onChange={(e) => !isTactile && setUserAnswer(e.target.value)}
            disabled={status !== 'idle'}
            readOnly={isTactile}
            autoFocus={!isTactile}
            placeholder={isTactile ? '0' : ''}
          />
        </div>
      </div>

      {isTactile && (
        <div className="bank-container">
          {BANK_ITEMS.map((item) => (
             <div key={item.value} className="bank-column">
               <span className="bank-title">{item.label}</span>
               <motion.div 
                 className={`bank-piece ${item.colorClass}`}
                 drag={status === 'idle'}
                 dragSnapToOrigin
                 onDragEnd={(_, info) => {
                   // Si lo tira >40px hacia arriba o hacia los lados
                   if (info.offset.y < -40 || Math.abs(info.offset.x) > 40) handleDrop(item.value);
                 }}
                 onClick={() => handleDrop(item.value)}
                 whileHover={status === 'idle' ? { scale: 1.05 } : {}}
                 whileTap={status === 'idle' ? { scale: 0.95 } : {}}
                 title={`Sumar ${item.value}`}
               >
                 {item.value}
               </motion.div>
             </div>
          ))}
        </div>
      )}

      {/* Visualización Clásica Condicionada para Fallos en Restas */}
      {attempts >= 1 && !isTactile && (
        <motion.div 
          className="vertical-visualizers"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
           <Base10Visualizer amount={payload.num1} />
           <div className={`operator-block ${payload.operation === '+' ? 'op-add' : 'op-sub'}`}>
             {payload.operation}
           </div>
           <Base10Visualizer amount={payload.num2} />
        </motion.div>
      )}
    </div>
  );
}
