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
    physics: {
      dampening: 0.9,
      bounce: 2,
    },
    layer: 'PLAYER',
    position: {
      x: 40,
      y: 40,
    },
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
