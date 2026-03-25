import { motion } from 'framer-motion';
import '../../styles/sandbox.css';

export default function GuessOperatorUI({ payload, submitAnswer, status, showWhisper }) {
  return (
    <div className="equation guess-operator">
      <span className="number">{payload.num1}</span>
      
      <div className="operator-dropzone">
         <button 
           className={`op-btn ${status}`} 
           onClick={() => submitAnswer('+')}
           disabled={status !== 'idle'}
         >
           +
         </button>
         <button 
           className={`op-btn ${status}`} 
           onClick={() => submitAnswer('-')}
           disabled={status !== 'idle'}
         >
           -
         </button>
         
        {showWhisper && (
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
  );
}
