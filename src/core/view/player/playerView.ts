import { Screen } from '../../units';
import { handleMove } from '../events/handleMove';
import { createEntityView } from './entityView';

export const createPlayerView = () => {
  const view = createEntityView({
    id: 'player',
    layer: 'PLAYER',
    model: {
      speed: 20,
    },
    geometry: {
      x: Screen.center.x,
      y: Screen.center.y,
      width: Screen.percent(10).w,
      height: Screen.percent(10).w,
      style: {
        fill: {
          color: 'blue',
        },
        stroke: {
          color: 'blue',
          opacity: 1,
          width: 2,
        },
      },
    },
  });

  handleMove(view);

  return view;
};
