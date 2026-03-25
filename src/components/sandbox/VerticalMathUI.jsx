import { motion } from 'framer-motion';
import '../../styles/sandbox.css';
import Base10Visualizer from './Base10Visualizer';

export default function VerticalMathUI({ payload, userAnswer, setUserAnswer, status, inputRef, handleKeyDown, showWhisper, attempts }) {
  return (
    <div className="vertical-math-wrapper">
      <div className="vertical-equation">
        <div className="vertical-row top">
           <span className="number">{payload.num1}</span>
        </div>
        <div className="vertical-row bottom">
           <span className={`operator-block ${payload.operation === '+' ? 'op-add' : 'op-sub'}`}>
             {payload.operation}
           </span>
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

      {attempts >= 1 && (
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
