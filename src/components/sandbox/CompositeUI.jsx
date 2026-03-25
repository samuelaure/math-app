import { motion } from 'framer-motion';
import '../../styles/sandbox.css';

export default function CompositeUI({ payload, userAnswer, setUserAnswer, status, inputRef, handleKeyDown, showWhisper }) {
  return (
    <div className="equation composite">
      {payload.nums.map((num, i) => (
        <span key={`n${i}`} className="number">{num}</span>
      )).reduce((acc, x, i) => {
        if (i === 0) return [x];
        const op = payload.ops[i-1];
        acc.push(
          <span key={`o${i}`} className={`operator-block ${op === '+' ? 'op-add' : 'op-sub'}`}>
            {op}
          </span>
        );
        acc.push(x);
        return acc;
      }, [])}

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
    </div>
  );
}
