import { getCanvas, getContext } from '../canvas/canvas';
import { getState, updateFPS } from '../gameState/gameState';
import { updateDeltaTime } from '../input/keyboard';

export const createLoop = () => {
  let lastFrameTime = 0;
  let frameCount = 0;
  let fpsStartTime = 0;
  const targetFPS = -1;
  const targetFrameTime = 1000 / targetFPS; // 16.67ms for 60 FPS
  let shutdown = false;

  const stop = () => {
    shutdown = true;
  };

  const loop = () => {
    const { isLogicPaused, timeScale } = getState();

    const currentTime = performance.now();
    const deltaTime = currentTime - lastFrameTime;

    // Update the keyboard system with current deltaTime
    updateDeltaTime(deltaTime);

    // Initialize FPS tracking on first frame
    if (fpsStartTime === 0) {
      fpsStartTime = currentTime;
    }

    /**
     * Dispatch logic updates as fast as possible, regardless of frame rate or slow time.
     * This is to allow the user to pause the logic and continue the animations.
     * Pausing updates when timeScale is 0 is because logic updates will affect positions of views.
     */
    if (!isLogicPaused && timeScale > 0) {
      window.dispatchEvent(
        new CustomEvent('update', { detail: { deltaTime } })
      );
      if (deltaTime >= targetFrameTime) {
        window.dispatchEvent(
          new CustomEvent('collisions', { detail: { deltaTime } })
        );
      }
    }

    // Only execute animations if enough time has passed
    if (deltaTime >= targetFrameTime) {
      // Update last frame time
      lastFrameTime = currentTime;
      frameCount++;

      // Calculate FPS every second
      const elapsedTime = currentTime - fpsStartTime;
      if (elapsedTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / elapsedTime);
        updateFPS(fps);
        frameCount = 0;
        fpsStartTime = currentTime;
      }

      if (timeScale > 0) {
        getContext().clearRect(0, 0, getCanvas().width, getCanvas().height);
        // console.log(frameCount);
        window.dispatchEvent(
          new CustomEvent('render', { detail: { deltaTime } })
        );
        window.dispatchEvent(
          new CustomEvent('animate', { detail: { deltaTime } })
        );
      }
    }

    // Continue the loop
    if (!shutdown) {
      window.requestAnimationFrame(loop);
    }
  };

  loop();

  return {
    loop,
    stop,
  };
};
