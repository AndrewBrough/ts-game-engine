import type { EntityModel, Position } from '../types';
import { isKeyHeld } from '../../input/keyboard';
import type { EntityViewInstance } from '../player/entityView';
import type { DeepRequired } from '../../types';

export type ControlProps = {
  up?: string;
  down?: string;
  left?: string;
  right?: string;
};

export const handleMove = (
  view: EntityViewInstance,
  controlProps: DeepRequired<ControlProps> = {
    up: 'w',
    down: 's',
    left: 'a',
    right: 'd',
  }
) => {
  view.events.addEvent('update', (e: CustomEvent) => {
    const deltaTime = e.detail?.deltaTime || 16; // Default to 16ms (60fps)

    const movement: Position = {
      x: 0,
      y: 0,
    };

    const speed = view.model.speed;

    if (isKeyHeld(controlProps.left!)) {
      movement.x = -speed;
    }
    if (isKeyHeld(controlProps.right!)) {
      movement.x = speed;
    }
    if (isKeyHeld(controlProps.up ?? '')) {
      movement.y = -speed;
    }
    if (isKeyHeld(controlProps.down ?? '')) {
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
