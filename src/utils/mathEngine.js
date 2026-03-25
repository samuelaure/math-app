export const generateProblem = (level) => {
  let num1, num2, operation;

  switch (level) {
    case 1:
      operation = '+';
      num1 = Math.floor(Math.random() * 5) + 1;
      num2 = Math.floor(Math.random() * 5) + 1; // sum max 10
      break;
    case 2:
      operation = '-';
      num1 = Math.floor(Math.random() * 9) + 2; // 2 to 10
      num2 = Math.floor(Math.random() * (num1 - 1)) + 1; // 1 to num1-1
      break;
    case 3:
      operation = '+';
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1; // sum max 20
      break;
    case 4:
      operation = '-';
      num1 = Math.floor(Math.random() * 19) + 2; // 2 to 20
      num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
      break;
    case 5:
    default:
      operation = Math.random() > 0.5 ? '+' : '-';
      if (operation === '+') {
        num1 = Math.floor(Math.random() * 25) + 1;
        num2 = Math.floor(Math.random() * 25) + 1;
      } else {
        num1 = Math.floor(Math.random() * 49) + 2;
        num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
      }
      break;
  }

  const answer = operation === '+' ? num1 + num2 : num1 - num2;
  
  return { num1, num2, operation, answer, level };
};

export const calculateNextLevel = (currentLevel, recentPerformance) => {
  const correctCount = recentPerformance.filter(x => x).length;
  // If 3 consecutive correct, level up
  if (recentPerformance.length >= 3 && correctCount === 3) {
    return Math.min(5, currentLevel + 1);
  } 
  // If 2 consecutive incorrect, level down
  else if (recentPerformance.length >= 2 && correctCount === 0) {
    return Math.max(1, currentLevel - 1);
  }
  return currentLevel;
};
