import type { ViewInstance } from '../../view';
import type { PhysicsComponent } from '../addPhysics';

export const getBounceForce = (
  view: ViewInstance,
  deltaTime: number = 16.66,
  minBounce: number = 0
) => {
  const physics = view.getComponent<PhysicsComponent>('physics');
  const currentForce = physics?.getCurrentForce() || { x: 0, y: 0 };
  const bounceForce = {
    x: currentForce.x * Math.max(view.physics.bounce, minBounce) * deltaTime,
    y: currentForce.y * Math.max(view.physics.bounce, minBounce) * deltaTime,
  };

  return bounceForce;
};
