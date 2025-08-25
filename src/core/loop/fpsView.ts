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
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      shape: 'text',
    },
    fill: {
      color: 'white',
      opacity: 1,
    },
    stroke: {
      color: 'transparent',
      opacity: 0,
      width: 1,
    },
  });

  animatedView.addAnimation(() => {
    const fps = getState().fps;
    animatedView.updateText(`FPS: ${fps}`);
  });

  return animatedView;
};
