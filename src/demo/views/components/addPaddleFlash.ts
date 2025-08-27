import type { ViewInstance } from '../../../core/view/view';

export const addPaddleFlash = (playerView: ViewInstance) => {
  let elapsedTime = 0;
  let isPaused = false;
  let timeoutId: number | null = null;
  const originalOpacity = playerView.geometry.style.fill.opacity;

  const pause = () => {
    isPaused = true;
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  const play = () => {
    isPaused = false;
    // Start the timeout when play is called
    timeoutId = setTimeout(() => {
      console.log('timeout');
      playerView.geometry.style.fill.opacity = originalOpacity;
      pause();
    }, 1000);
  };

  const modulateOpacity = (e: CustomEvent) => {
    if (isPaused) return;

    elapsedTime += e.detail.deltaTime;
    // Use Math.sin to get values between -1 and 1, then map to 0-1
    const sinValue = Math.sin(elapsedTime * 0.01); // Slower frequency
    playerView.geometry.style.fill.opacity = 1 - (sinValue + 1) / 2; // Map -1,1 to 0,1
  };

  playerView.events.addEvent('update', modulateOpacity);

  play();

  return {
    pause,
    play,
  };
};
