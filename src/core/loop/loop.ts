import { getCanvas, getContext } from "../canvas/canvas";
import { updateFPS, getState } from "../state/state";

export const createLoop = () => {
  let lastFrameTime = 0;
  let frameCount = 0;
  let fpsStartTime = 0;
  const targetFPS = -1;
  const targetFrameTime = 1000 / targetFPS; // 16.67ms for 60 FPS

  const loop = () => {
    const { isPaused } = getState();
    
    if(!isPaused) {
        const currentTime = performance.now();
        const deltaTime = currentTime - lastFrameTime;
        
        // Initialize FPS tracking on first frame
        if (fpsStartTime === 0) {
          fpsStartTime = currentTime;
        }
        
        // Only execute game logic if enough time has passed
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
            
            getContext().clearRect(0, 0, getCanvas().width, getCanvas().height);
            window.dispatchEvent(new CustomEvent('animate', { detail: { time: currentTime } }));
        }
        
        // Continue the loop
        window.requestAnimationFrame(loop);
    } else {
        // Even when paused, continue the loop to check for unpause
        window.requestAnimationFrame(loop);
    }
  };

  loop();

  return {
    loop,
  };
};