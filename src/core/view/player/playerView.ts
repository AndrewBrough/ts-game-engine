import { handleMove } from '../events/handleMove';
import { createEntityView } from './entityView';

export const createPlayerView = () => {
  const view = createEntityView({
    id: 'player',
    model: {
      speed: 1,
      health: 100,
      collisionDamage: 10,
    },
    position: {
      x: 40,
      y: 40,
    },
    layer: 'PLAYER',
    relativeTo: 'top-left',
    geometry: {
      shape: 'rect',
      width: 10,
      height: 10,
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
