export const startRound = () => {
  const startTimer = async (count: number) => {
    if (count <= 0) {
      return count;
    }
    return setTimeout(() => {
      return startTimer(count - 1);
    }, count * 1000);
  };

  const result = startTimer(3);
};
