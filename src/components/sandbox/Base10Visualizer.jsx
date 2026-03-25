import { motion } from 'framer-motion';

export default function Base10Visualizer({ amount }) {
  if (amount == null || amount < 1) return null;

  const thousands = Math.floor(amount / 1000);
  const hundreds = Math.floor((amount % 1000) / 100);
  const tens = Math.floor((amount % 100) / 10);
  const units = amount % 10;

  const renderBlocks = (count, className, delayOffset) => {
    return Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={`${className}-${i}`}
        initial={{ opacity: 0, scale: 0.5, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: delayOffset + (i * 0.05), type: 'spring' }}
        className={`base10-block ${className}`}
      />
    ));
  };

  return (
    <div className="base10-container">
      {thousands > 0 && (
        <div className="base10-group thousands">
          {renderBlocks(thousands, 'thousand-cube', 0)}
        </div>
      )}
      {hundreds > 0 && (
        <div className="base10-group hundreds">
          {renderBlocks(hundreds, 'hundred-square', 0.2)}
        </div>
      )}
      {tens > 0 && (
        <div className="base10-group tens">
          {renderBlocks(tens, 'ten-bar', 0.4)}
        </div>
      )}
      {units > 0 && (
        <div className="base10-group units">
          {renderBlocks(units, 'unit-dot', 0.6)}
        </div>
      )}
    </div>
  );
}
