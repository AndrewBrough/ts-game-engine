import type { EntityModel, Position } from '../types';
import { isKeyHeld } from '../../input/keyboard';
import type { EntityViewInstance } from '../player/entityView';

export const handleMove = (view: EntityViewInstance) => {
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

    move(movement, deltaTime);
  });

  const move = (vector: Position, deltaTime: number) => {
    view.physics.applyForce({
      x: vector.x * deltaTime,
      y: vector.y * deltaTime,
    });
  };

  return {
    move,
  };
};
