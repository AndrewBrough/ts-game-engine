import { getState } from '../state/state';
import { createAnimatedView } from '../view/animatedView';

export const createFpsView = () => {
  const animatedView = createAnimatedView({
    id: 'fps-view',
    shape: 'text',
    position: {
      x: 1,
      y: 1,
    },
    anchor: 'top-left',
    textProps: {
      text: 'FPS: 0',
      fontSize: 2,
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
  });

  return animatedView;
};
