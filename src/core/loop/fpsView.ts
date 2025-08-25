import { getState } from '../gameState/gameState';
import { createAnimatedView } from '../view/animatedView';

export const createFpsView = () => {
  const animatedView = createAnimatedView({
    id: 'fps-view',
    layer: 'UI',
    textProps: {
      text: 'FPS: 0',
      fontSize: 2,
      fontFamily: 'Arial',
      fontWeight: 'bold',
      fontStyle: 'normal',
    },
  });

  animatedView.addAnimation(() => {
    const fps = getState().fps;
    animatedView.updateText(`FPS: ${fps}`);
  });

  return animatedView;
};
