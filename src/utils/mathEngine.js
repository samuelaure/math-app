export const generateProblem = (level) => {
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const flip = () => Math.random() > 0.5 ? '+' : '-';
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
    return { id, type: 'vertical', payload: { num1, num2, operation }, answer, level };
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

export const calculateNextLevel = (currentLevel, recentPerformance) => {
  const correctCount = recentPerformance.filter(x => x).length;
  if (recentPerformance.length >= 3 && correctCount === 3) {
    return Math.min(15, currentLevel + 1); 
  } else if (recentPerformance.length >= 2 && correctCount === 0) {
    return Math.max(1, currentLevel - 1);
  }
  return currentLevel;
};
