import { motion } from 'framer-motion';
import { colorForLevel } from '../../utils/mathEngine';
import '../../styles/level-progress.css';

/**
 * LevelProgressBar
 * Props:
 *   currentLevel  – player's current level (number)
 *   progressData  – { current, target, pct } from levelProgress()
 *   seeds         – total seeds earned (number)
 */
export default function LevelProgressBar({ currentLevel, progressData, seeds }) {
  const isMaxLevel = progressData.pct >= 1 && currentLevel >= 15;
  const pct = Math.min(1, progressData.pct);

  const colorFrom = colorForLevel(currentLevel);
  const colorTo = colorForLevel(currentLevel + 1);

  const gradientStyle = {
    background: `linear-gradient(90deg, ${colorFrom} 0%, ${colorTo} 100%)`,
  };

  return (
    <div className="level-progress-root">
      <div className="level-progress-meta">
        <span className="level-label" style={{ color: colorFrom }}>
          Nivel {currentLevel}
        </span>
        <span className="seeds-count">🌱 {seeds}</span>
        {!isMaxLevel && (
          <span className="level-label next" style={{ color: colorTo }}>
            Nivel {currentLevel + 1}
          </span>
        )}
      </div>

      <div className="level-progress-track">
        <motion.div
          className="level-progress-fill"
          style={gradientStyle}
          initial={false}
          animate={{ width: `${pct * 100}%` }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        />
        {/* Glow pulse on fill tip */}
        {pct > 0 && pct < 1 && (
          <motion.div
            className="level-progress-glow"
            style={{
              left: `calc(${pct * 100}% - 6px)`,
              background: colorTo,
            }}
            animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </div>

      {!isMaxLevel && (
        <div className="level-progress-pts">
          {progressData.current} / {progressData.target} pts
        </div>
      )}
      {isMaxLevel && (
        <div className="level-progress-pts" style={{ color: colorFrom }}>
          ¡Nivel máximo! 🌟
        </div>
      )}
    </div>
  );
}
