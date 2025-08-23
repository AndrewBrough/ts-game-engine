import { getState } from '../state/state';
import { createAnimatedView } from '../view/animatedView';
import type { AnimatedViewInstance } from '../view/types';

export const createFpsView = (): AnimatedViewInstance => {
  const animatedView = createAnimatedView({
    position: { x: 1, y: 5 },
    relativeTo: 'top-left',
    // anchor: 'top-left',
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

  animatedView.addAnimation(() => {
    const fps = getState().fps;
    animatedView.updateText(`FPS: ${fps}`);
    animatedView.animate();
  });

  return animatedView;
};
