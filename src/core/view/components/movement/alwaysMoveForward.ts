import type { EntityViewInstance } from '../../entity/entityView';
import type { ViewInstance } from '../../view';
import type { PhysicsComponent } from '../addPhysics';

export const addForwardMovement = (view: ViewInstance) => {
  const physics = view.getComponent<PhysicsComponent>('physics');
  if (!physics) {
    throw new Error('Physics component not found');
  }

  // kick off in a random direction
  const randomDirection = {
    x: Math.random() * view.model.speed * 100,
    y: Math.random() * view.model.speed * 100,
  };
  physics?.applyForce(randomDirection);

  view.events.addEvent('update', e => {
    const deltaTime = e.detail.deltaTime;
    const currentForce = physics.getCurrentForce();
    const direction = {
      x: currentForce.x / Math.sqrt(currentForce.x * currentForce.x),
      y: currentForce.y / Math.sqrt(currentForce.y * currentForce.y),
    };

    const forceToAdd = {
      x: direction.x * view.model.speed * deltaTime,
      y: direction.y * view.model.speed * deltaTime,
    };

    physics.applyForce({
      x: currentForce.x + forceToAdd.x,
      y: currentForce.y + forceToAdd.y,
    });
  });

  return {};
};
