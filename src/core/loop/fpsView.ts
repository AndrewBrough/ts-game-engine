import { createView } from '../view/view';
import { getState } from '../state/state';

export const createFpsView = () => {
  // Create FPS display in top right corner
  const fpsView = createView({
    position: { x: 1, y: 20 },
    // relativeTo: 'top-left',
    anchor: 'top-left',
    shape: 'text',
    textProps: {
      text: 'FPS: 0',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      fontStyle: 'normal',
    },
    fill: {
      color: 'white',
    },
  });

  // Update FPS display on each animate event
  const updateFpsDisplay = () => {
    const fps = getState().fps;
    fpsView.updateText(`FPS: ${fps}`);
    fpsView.update();
  };

  window.addEventListener('animate', updateFpsDisplay);

  return {
    fpsView,
    updateFpsDisplay,
  };
};
