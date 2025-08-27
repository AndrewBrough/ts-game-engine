import { getState } from '../gameState/gameState';
import { Screen } from '../units';
import { addAnimations } from '../view/components';
import { createView } from '../view/view';

export const createFpsView = () => {
  const view = createView({
    id: 'fps-view',
    layer: 'UI',
    text: {
      offset: {
        x: 0,
        y: Screen.percent(4).w,
      },
      text: '0',
      fontSize: Screen.percent(4).w,
      style: {
        fill: {
          color: 'white',
          opacity: 1,
        },
      },
    },
  });

  view.addComponent('animations', addAnimations(view));

  view.events.addEvent('animate', e => {
    const fps = getState().fps;
    view.updateText({
      text: `${fps}`,
    });
  });

  return view;
};
