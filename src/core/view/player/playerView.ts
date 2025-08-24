import { isKeyHeld } from '../../input/keyboard';
import type { Position } from '../types';
import { createEntityView } from './entityView';

export const createPlayerView = () => {
  const { view, entity } = createEntityView(
    {
      id: 'player',
      layer: 'PLAYER',
      relativeTo: 'bottom-left',
      shapeProps: {
        width: 10,
        height: 10,
      },
      shape: 'rect',
      fill: {
        color: 'blue',
      },
    },
    {
      health: 100,
      speed: 1,
    }
  );

  view.events.addEvent('update', (e: CustomEvent) => {
    const deltaTime = e.detail?.deltaTime || 16; // Default to 16ms (60fps)

    const movement: Position = {
      x: 0,
      y: 0,
    };

    if (isKeyHeld('a') || isKeyHeld('ArrowLeft')) {
      movement.x = -entity.speed;
    }
    if (isKeyHeld('d') || isKeyHeld('ArrowRight')) {
      movement.x = entity.speed;
    }
    if (isKeyHeld('w') || isKeyHeld('ArrowUp')) {
      movement.y = -entity.speed;
    }
    if (isKeyHeld('s') || isKeyHeld('ArrowDown')) {
      movement.y = entity.speed;
    }

    view.move(movement, deltaTime);
  });

  return view;
};
