export const sequenceCheck = (sequence) => {
    const fib = [1, 1];
    const maxValueInSequence = Math.max(...sequence);
  
    while (fib[fib.length - 1] <= maxValueInSequence) {
      fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
    }
  
    for (let i = 0; i <= sequence.length - 5; i++) {
      const subsequence = sequence.slice(i, i + 5);
      for (let j = 0; j <= fib.length - 5; j++) {
        const fibSubsequence = fib.slice(j, j + 5);
        if (subsequence.every((val, idx) => val === fibSubsequence[idx])) {
          return i;
        }
      }
    }
  
    return false;
  };
  