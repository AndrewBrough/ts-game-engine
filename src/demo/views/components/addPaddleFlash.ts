import type { ViewInstance } from '../../../core/view/view';

const TIME_TO_FLASH = 800;

export const addPaddleFlash = (playerView: ViewInstance) => {
  let elapsedTime = 0;
  const originalOpacity = playerView.geometry.style.fill.opacity;

  const stop = () => {
    playerView.geometry.style.fill.opacity = originalOpacity;
  };

  const play = () => {
    elapsedTime = 0;
  };

  const modulateOpacity = (e: CustomEvent) => {
    elapsedTime += e.detail.deltaTime;

    // magic number for opacity
    // makes animation end when opacity 1 almost back to original
    if (
      elapsedTime >= TIME_TO_FLASH &&
      playerView.geometry.style.fill.opacity >= 0.95 // magic number, fragile
    ) {
      stop();
      return;
    }

    // Use Math.sin to get values between -1 and 1, then map to 0-1
    const sinValue = Math.sin(elapsedTime * 0.02); // Slower frequency
    const targetOpacity = 1 - (sinValue + 1) / 2; // Map -1,1 to 0,1
    playerView.geometry.style.fill.opacity = targetOpacity;

    if (elapsedTime >= TIME_TO_FLASH && targetOpacity >= 0.95) {
      stop();
    }
  };

  playerView.events.addEvent('update', modulateOpacity);

  return {
    play,
    stop,
  };
};
