import { Screen } from '../../units';
import { handleMove } from '../events/handleMove';
import { createEntityView } from './entityView';

export const createPlayerView = () => {
  const view = createEntityView({
    id: 'player',
    layer: 'PLAYER',
    model: {
      speed: 15,
    },
    geometry: {
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

  view.updatePosition({
    x: Screen.center.x - view.geometry.width / 2,
    y: Screen.center.y - view.geometry.height / 2,
  });

  handleMove(view);

  return view;
};
