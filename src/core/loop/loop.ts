import { getCanvas, getContext } from "../canvas/canvas";
import { updateFPS, getState } from "../gameState/gameState";

export const createLoop = () => {
  let lastFrameTime = 0;
  let frameCount = 0;
  let fpsStartTime = 0;
  const targetFPS = -1;
  const targetFrameTime = 1000 / targetFPS; // 16.67ms for 60 FPS

  const loop = () => {
    const { isLogicPaused, timeScale } = getState();
    
      const currentTime = performance.now();
      const deltaTime = currentTime - lastFrameTime;
      
      // Initialize FPS tracking on first frame
      if (fpsStartTime === 0) {
        fpsStartTime = currentTime;
      }

      /**
       * Dispatch logic updates as fast as possible, regardless of frame rate or slow time.
       * This is to allow the user to pause the logic and continue the animations.
       * Pausing updates when timeScale is 0 is because logic updates will affect positions of views.
       */
      if(!isLogicPaused && timeScale > 0) {  
        window.dispatchEvent(new CustomEvent('update', { detail: { time: currentTime } }));
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

          /* Check collisions more frequently for better reliability while still being optimized */
          window.dispatchEvent(new CustomEvent('collisions', { detail: { elapsedTime } }));
          
          getContext().clearRect(0, 0, getCanvas().width, getCanvas().height);
          window.dispatchEvent(new CustomEvent('render', { detail: { time: currentTime } }));
          if(timeScale > 0) {
            window.dispatchEvent(new CustomEvent('animate', { detail: { time: currentTime } }));
          }
      }
      
      // Continue the loop
      window.requestAnimationFrame(loop);
  };

  loop();

  return {
    loop,
  };
};