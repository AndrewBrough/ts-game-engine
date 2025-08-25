import { getState } from '../gameState/gameState';
import { Screen } from '../units';
import { createAnimatedView } from '../view/animatedView';

export const createFpsView = () => {
  const animatedView = createAnimatedView({
    id: 'fps-view',
    layer: 'UI',
    text: {
      offset: {
        x: 0,
        y: Screen.percent(4).w,
      },
      text: 'FPS: 0',
      fontSize: Screen.percent(4).w,
      style: {
        fill: {
          color: 'white',
          opacity: 1,
        },
      },
    },
  });

  animatedView.addAnimation(() => {
    const fps = getState().fps;
    animatedView.updateText({
      text: `${fps}`,
    });
  });

  return animatedView;
};
