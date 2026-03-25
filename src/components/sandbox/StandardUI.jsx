import { motion } from 'framer-motion';

export default function StandardUI({ payload, userAnswer, setUserAnswer, status, inputRef, handleKeyDown, showWhisper }) {
  return (
    <div className="equation">
      <span className="number">{payload.num1}</span>
      <span className={`operator-block ${payload.operation === '+' ? 'op-add' : 'op-sub'}`}>
        {payload.operation}
      </span>
      <span className="number">{payload.num2}</span>
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
