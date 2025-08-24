import { isKeyHeld } from '../../input/keyboard';
import type { EntityModel, Position } from '../types';
import { createEntityView } from './entityView';

export const createPlayerView = () => {
  const view = createEntityView({
    id: 'player',
    model: {
      speed: 1,
      health: 100,
      collisionDamage: 10,
    },
    layer: 'PLAYER',
    relativeTo: 'top-left',
    shapeProps: {
      width: 10,
      height: 10,
    },
    shape: 'rect',
    fill: {
      color: 'blue',
    },
    stroke: {
      color: 'blue',
      opacity: 1,
      width: 2,
    },
  });

  view.events.addEvent('update', (e: CustomEvent) => {
    const deltaTime = e.detail?.deltaTime || 16; // Default to 16ms (60fps)

    const movement: Position = {
      x: 0,
      y: 0,
    };
    const speed = (view.model as EntityModel).speed;

    if (isKeyHeld('a') || isKeyHeld('ArrowLeft')) {
      movement.x = -speed;
    }
    if (isKeyHeld('d') || isKeyHeld('ArrowRight')) {
      movement.x = speed;
    }
    if (isKeyHeld('w') || isKeyHeld('ArrowUp')) {
      movement.y = -speed;
    }
    if (isKeyHeld('s') || isKeyHeld('ArrowDown')) {
      movement.y = speed;
    }

    view.move(movement, deltaTime);
  });

  return view;
};
