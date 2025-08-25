import { getState } from '../gameState/gameState';
import { createAnimatedView } from '../view/animatedView';

export const createFpsView = () => {
  const animatedView = createAnimatedView({
    id: 'fps-view',
    layer: 'UI',
    textProps: {
      text: 'FPS: 0',
    },
    geometry: {
      x: 0,
      y: 0,
    },
  });

  animatedView.addAnimation(() => {
    const fps = getState().fps;
    animatedView.updateText(`FPS: ${fps}`);
  });

  return animatedView;
};
