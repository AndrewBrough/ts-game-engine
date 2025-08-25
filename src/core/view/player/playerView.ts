import { Screen } from '../../units';
import { handleMove } from '../events/handleMove';
import { createEntityView } from './entityView';

export const createPlayerView = () => {
  const screen = Screen();

  const view = createEntityView({
    id: 'player',
    layer: 'PLAYER',
    model: {
      speed: 20,
      collisionDamage: 10,
    },
    geometry: {
      x: screen.center.x,
      y: screen.center.y,
    },
    fill: {
      color: 'blue',
    },
    stroke: {
      color: 'blue',
      opacity: 1,
      width: 2,
    },
  });

  handleMove(view);

  return view;
};
