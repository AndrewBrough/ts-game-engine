import { getCollisionEventId } from '../../collision';
import type { ViewInstance } from '../../view';
import type { PhysicsComponent } from '../addPhysics';
import { getBounceForce } from './getBounceForce';

export const addCollisionBounce = (view: ViewInstance) => {
  const event = getCollisionEventId(view);

  view.events.addEvent(event, e => {
    const collision = e.detail.collision;
    const bounceForce = getBounceForce(view, collision.deltaTime);
    bounceForce.x = Math.abs(bounceForce.x) * 10;
    bounceForce.y = Math.abs(bounceForce.y) * 10;

    bounceForce.x *= -collision.normal.x;
    bounceForce.y *= -collision.normal.y;

    const physics = view.getComponent<PhysicsComponent>('physics');
    physics?.applyForce(bounceForce);
  });

  return {};
};
