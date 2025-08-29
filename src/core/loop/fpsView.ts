import { getState } from '../gameState/gameState';
import { Screen } from '../units';
import { addAnimations } from '../view/components';
import { createView } from '../view/view';

export const createFpsView = () => {
  const view = createView({
    id: 'fps-view',
    layer: 'UI',
    text: {
      text: '0',
      fontSize: Screen.percent(4).w,
      align: 'left',
      verticalAlign: 'top',
      style: {
        fill: {
          color: 'white',
          opacity: 1,
        },
      },
    },
    geometry: {
      x: Screen.percent(1).w,
      y: Screen.percent(1).w,
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
