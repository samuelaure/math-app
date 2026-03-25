import { motion } from 'framer-motion';
import '../../styles/sandbox.css';

export default function VerticalMathUI({ payload, userAnswer, setUserAnswer, status, inputRef, handleKeyDown, showWhisper }) {
  return (
    <div className="vertical-equation">
      <div className="vertical-row top">
         <span className="number">{payload.num1}</span>
      </div>
      <div className="vertical-row bottom">
         <span className="operator">{payload.operation}</span>
         <span className="number">{payload.num2}</span>
      </div>
      <div className="divider-line"></div>
      
      <div className="vertical-row answer-row">
        <div className="input-wrapper">
           <input
            ref={inputRef}
            autoFocus
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={status === 'correct' || status === 'incorrect'}
            className={`answer-input ${status} vertical-input`}
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
    </div>
  );
}
