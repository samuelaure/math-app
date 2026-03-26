// ─── Scoring & Level System ──────────────────────────────────────────────────

/**
 * Points awarded per correct answer at a given problem level.
 * Higher-level problems are worth proportionally more.
 */
export const pointsForLevel = (problemLevel) => problemLevel * 10;

/**
 * Cumulative score threshold required to UNLOCK a given level.
 * Uses a quadratic curve so each step costs progressively more.
 *   L2  →  200 pts
 *   L3  →  450 pts
 *   L4  →  800 pts
 *   L5  → 1250 pts  … etc.
 */
export const scoreThreshold = (level) => {
  if (level <= 1) return 0;
  return (level - 1) * (level - 1) * 50 + (level - 1) * 100;
};

/**
 * Derive current level from a raw cumulative score.
 * The player sits at the highest level whose threshold they've reached.
 */
export const levelFromScore = (score, maxLevel = 15) => {
  let level = 1;
  for (let l = 2; l <= maxLevel; l++) {
    if (score >= scoreThreshold(l)) level = l;
    else break;
  }
  return level;
};

/**
 * Score required to advance from currentLevel → currentLevel + 1.
 * Returns { current: pts_so_far_in_this_level, target: pts_needed_for_next_level }
 * relative to the current level's entry threshold.
 */
export const levelProgress = (score, currentLevel, maxLevel = 15) => {
  const thisFloor = scoreThreshold(currentLevel);
  const nextCeiling = scoreThreshold(currentLevel + 1);
  if (currentLevel >= maxLevel) {
    return { current: score - thisFloor, target: score - thisFloor, pct: 1 };
  }
  const span = nextCeiling - thisFloor;
  const earned = Math.min(score - thisFloor, span);
  return { current: earned, target: span, pct: earned / span };
};

/**
 * Calculate next level from new cumulative score (replaces old racha logic).
 */
export const calculateNextLevel = (newScore, maxLevel = 15) =>
  Math.min(maxLevel, levelFromScore(newScore, maxLevel));

// ─── Level colour palette (15 levels) ────────────────────────────────────────

export const LEVEL_COLORS = [
  '#A8D5A2', // 1  – soft sage
  '#79C99E', // 2  – mint
  '#52B0A0', // 3  – teal-green
  '#3AA3C8', // 4  – sky
  '#5B8EE6', // 5  – periwinkle
  '#7B6FE8', // 6  – lavender
  '#9B5FD4', // 7  – violet
  '#C14FBF', // 8  – orchid
  '#D94F8A', // 9  – rose
  '#E8605A', // 10 – coral
  '#E87A3A', // 11 – amber
  '#D4A825', // 12 – gold
  '#8BBF3A', // 13 – lime
  '#3ABFA5', // 14 – aqua
  '#5B8EE6', // 15 – loop back to sky (max)
];

export const colorForLevel = (level) =>
  LEVEL_COLORS[Math.max(0, Math.min(level - 1, LEVEL_COLORS.length - 1))];

// ─── Problem selection (mixed levels) ────────────────────────────────────────

/**
 * For a player at `currentLevel`, pick a level to generate a problem from.
 * Distribution:
 *   40% → current level
 *   60% → distributed among previous levels, with closer levels weighted higher
 */
export const pickProblemLevel = (currentLevel) => {
  if (currentLevel === 1) return 1;

  const roll = Math.random();
  if (roll < 0.4) return currentLevel; // 40% current

  // Remaining 60% split across previous levels with linear weight decay
  // e.g. at L5: weights for L1..L4 are [1,2,3,4] → normalised
  const prevLevels = Array.from({ length: currentLevel - 1 }, (_, i) => i + 1);
  const weights = prevLevels.map((_, i) => i + 1); // ascending weight
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const rand = Math.random() * totalWeight;
  let cumulative = 0;
  for (let i = 0; i < prevLevels.length; i++) {
    cumulative += weights[i];
    if (rand <= cumulative) return prevLevels[i];
  }
  return prevLevels[prevLevels.length - 1];
};

// ─── Problem generator ────────────────────────────────────────────────────────

export const generateProblem = (currentLevel) => {
  const level = pickProblemLevel(currentLevel);

  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const flip = () => (Math.random() > 0.5 ? '+' : '-');
  const id = Math.random().toString(36).substring(7);

  if (level <= 5) {
    let num1, num2, operation;
    if (level === 1) { operation = '+'; num1 = rand(1, 5); num2 = rand(1, 5); }
    else if (level === 2) { operation = '-'; num1 = rand(2, 10); num2 = rand(1, num1 - 1); }
    else if (level === 3) { operation = '+'; num1 = rand(1, 10); num2 = rand(1, 10); }
    else if (level === 4) { operation = '-'; num1 = rand(2, 20); num2 = rand(1, num1 - 1); }
    else {
      operation = flip();
      if (operation === '+') { num1 = rand(1, 25); num2 = rand(1, 25); }
      else { num1 = rand(2, 49); num2 = rand(1, num1 - 1); }
    }
    const answer = operation === '+' ? num1 + num2 : num1 - num2;

    if (level === 5 && Math.random() > 0.5) {
      return { id, type: 'guess_operator', payload: { num1, num2, expectedResult: answer }, answer: operation, level };
    }
    return { id, type: 'standard', payload: { num1, num2, operation }, answer, level };
  }

  if (level >= 6 && level <= 10) {
    const isThousands = level >= 9;
    const isSubtraction = level === 8 || level === 10 || (level === 7 && Math.random() > 0.5);
    const operation = isSubtraction ? '-' : '+';

    let num1, num2;
    if (isThousands) {
      num1 = rand(1000, 9999);
      num2 = isSubtraction ? rand(100, num1 - 1) : rand(1000, 8999);
    } else {
      num1 = rand(100, 999);
      num2 = isSubtraction ? rand(10, num1 - 1) : rand(100, 899);
    }
    const answer = operation === '+' ? num1 + num2 : num1 - num2;
    const renderMode = operation === '+' ? (Math.random() > 0.5 ? 'tactile' : 'algorithm') : 'standard';
    return { id, type: 'vertical', payload: { num1, num2, operation, renderMode }, answer, level };
  }

  if (level >= 11) {
    const modeRoll = Math.random();
    if (modeRoll < 0.6) {
      const a = rand(10, 50);
      const b = rand(10, 50);
      const op1 = '+';
      const op2 = '-';
      const c = rand(1, a + b - 1);
      const answer = a + b - c;
      return {
        id,
        type: 'composite',
        payload: { nums: [a, b, c], ops: [op1, op2] },
        answer,
        level
      };
    } else {
      const num1 = rand(50, 200);
      const num2 = rand(10, 49);
      const operation = flip();
      const expectedResult = operation === '+' ? num1 + num2 : num1 - num2;
      return { id, type: 'guess_operator', payload: { num1, num2, expectedResult }, answer: operation, level };
    }
  }

  return { id, type: 'standard', payload: { num1: 1, num2: 1, operation: '+' }, answer: 2, level };
};
