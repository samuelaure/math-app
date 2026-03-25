import { useState, useEffect } from 'react';
import '../../styles/sandbox.css';

export default function CompositeUI({ payload, userAnswer, setUserAnswer, status, inputRef }) {
  const [subAnswer, setSubAnswer] = useState('');
  
  // Limpia localmente al transicionar ecuaciones
  useEffect(() => {
    setSubAnswer('');
  }, [payload]);

  // Resolución matemática sub-calculada para la caja de agrupación intermedia
  const expectedSubAnswer = payload.ops[0] === '+' 
    ? payload.nums[0] + payload.nums[1] 
    : payload.nums[0] - payload.nums[1];

  let subStatus = '';
  if (subAnswer !== '') {
    subStatus = parseInt(subAnswer, 10) === expectedSubAnswer ? 'correct' : 'incorrect';
  }

  const finalOp = payload.ops[1];

  return (
    <div className="composite-wrapper">
      <div className="equation composite-layout">
        
        {/* Bloque Geométrico de Agrupamiento (Efecto Parentésis Mental) */}
        <div className={`composite-group-block ${subStatus}`}>
          <div className="composite-top-row">
            <span className="number">{payload.nums[0]}</span>
            <span className={`operator-block ${payload.ops[0] === '+' ? 'op-add' : 'op-sub'}`}>
              {payload.ops[0]}
            </span>
            <span className="number">{payload.nums[1]}</span>
          </div>
          
          <div className="composite-bottom-row">
            <input 
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              className={`sub-answer-input ${subStatus}`}
              value={subAnswer}
              onChange={(e) => setSubAnswer(e.target.value.replace(/\D/g, ''))}
              placeholder="?"
              disabled={subStatus === 'correct' && status !== 'idle'} 
            />
          </div>
        </div>

        {/* Cierre Formal Perimetral de la Ecuación Base */}
        <span className={`operator-block ${finalOp === '+' ? 'op-add' : 'op-sub'}`}>
          {finalOp}
        </span>
        <span className="number">{payload.nums[2]}</span>
        
        <span className="operator">=</span>
        
        <input 
          ref={inputRef}
          type="number" 
          inputMode="numeric"
          pattern="[0-9]*"
          className={`answer-input main-answer ${status}`}
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value.replace(/\D/g, ''))}
          disabled={status !== 'idle'}
        />
      </div>
    </div>
  );
}
