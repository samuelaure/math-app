import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../../styles/sandbox.css';

export default function VerticalStepUI({ payload, submitAnswer, status, setUserAnswer }) {
  const sNum1 = payload.num1.toString();
  const sNum2 = payload.num2.toString();
  const maxLen = Math.max(sNum1.length, sNum2.length);
  const padded1 = sNum1.padStart(maxLen, '0').split('');
  const padded2 = sNum2.padStart(maxLen, '0').split('');

  const columns = Array.from({ length: maxLen }).map((_, i) => ({
    colIndex: i, // 0 = msb, maxLen-1 = lsb
    topDigit: padded1[i] === '0' && i < maxLen - sNum1.length ? '' : padded1[i],
    botDigit: padded2[i] === '0' && i < maxLen - sNum2.length ? '' : padded2[i],
  }));

  const inputRefs = useRef([]);
  // Arrays dinámicos para columnas y llevadas
  const [answers, setAnswers] = useState(Array(maxLen).fill(''));
  const [carries, setCarries] = useState(Array(maxLen).fill(0));

  // Foco automático limpio al reiniciar la fase
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, maxLen);
    if (inputRefs.current[maxLen - 1] && status === 'idle') {
      inputRefs.current[maxLen - 1].focus();
    }
  }, [maxLen, status]);

  const handleChange = (e, index) => {
    if (status !== 'idle') return;
    const val = e.target.value.replace(/\D/g, ''); 
    const newAnswers = [...answers];
    newAnswers[index] = val;
    setAnswers(newAnswers);
    // Sincroniza al GameLoop para mantener consistencia inmutable con status
    setUserAnswer(newAnswers.join(''));
  };

  const handleKeyDown = (e, index) => {
    if (status !== 'idle') return;
    
    if (e.key === 'Enter') {
      e.preventDefault();
      const numVal = parseInt(answers[index] || 0, 10);
      
      // Aplicar llevada estructural si es > 9 y no es la columna más extrema a la izquierda
      if (numVal > 9 && index > 0) {
        const units = numVal % 10;
        const tens = Math.floor(numVal / 10);
        
        const newAnswers = [...answers];
        newAnswers[index] = units.toString();
        setAnswers(newAnswers);
        setUserAnswer(newAnswers.join(''));
        
        const newCarries = [...carries];
        newCarries[index - 1] = tens;
        setCarries(newCarries);
      }
      
      // Pasar foco incondicionalmente a la columna adyacente lógica hacia la izquierda
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      } else {
        const finalString = answers.join('');
        submitAnswer(finalString);
      }
    }
  };

  const fallbackSubmit = () => {
    const finalString = answers.join('');
    submitAnswer(finalString);
  };

  return (
    <div className="vertical-step-wrapper">
      <div className="vertical-step-grid">
        {columns.map((col, i) => (
          <div key={`col-${i}`} className="step-col">
            <div className="step-carry">
               {carries[i] > 0 && (
                 <motion.span 
                   initial={{ opacity: 0, y: 10, scale: 0 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   className="carry-marker"
                 >
                   {carries[i]}
                 </motion.span>
               )}
            </div>
            
            <div className="step-cell">{col.topDigit}</div>
            
            <div className="step-cell bottom-cell">
              {i === 0 && (
                <span className="step-op">
                  {payload.operation}
                </span>
              )}
              {col.botDigit}
            </div>
            
            <div className="step-input-cell">
              <input 
                ref={el => inputRefs.current[i] = el}
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                className={`step-input ${status !== 'idle' ? status : ''}`}
                autoComplete="off"
                value={answers[i]}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
              />
            </div>
          </div>
        ))}
      </div>
      
      {status === 'idle' && (
        <button className="btn commit-btn step-submit" onClick={fallbackSubmit}>
          Enviar
        </button>
      )}
    </div>
  );
}
