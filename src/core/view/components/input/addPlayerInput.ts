import type { EntityModel, Position } from '../../types';
import { isKeyHeld } from '../../../input/keyboard';
import type { EntityViewInstance } from '../../entity/entityView';
import type { DeepRequired } from '../../../types';
import type { PhysicsComponent } from '../addPhysics';
import type { ViewInstance } from '../../view';

export type ControlProps = {
  up?: string;
  down?: string;
  left?: string;
  right?: string;
};

export const addPlayerInput = (
  view: ViewInstance,
  controlProps: DeepRequired<ControlProps> = {
    up: 'w',
    down: 's',
    left: 'a',
    right: 'd',
  }
) => {
  view.events.addEvent('update', e => {
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
    const physics = view.getComponent<PhysicsComponent>('physics');
    physics?.applyForce({
      x: vector.x * deltaTime,
      y: vector.y * deltaTime,
    });
  };

  return {
    move,
  };
};
