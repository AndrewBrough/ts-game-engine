import { getCollisionEventId } from '../../collision';
import type { Position } from '../../types';
import type { ViewInstance } from '../../view';
import type { PhysicsComponent } from '../addPhysics';
import { getBounceForce } from './getBounceForce';

export type CollisionBounceProps = {
  forceMultiplier?: Position;
  viewIds?: string[]; // if specified, only bounce if the collision view is in the list
};

export const addCollisionBounce = (
  view: ViewInstance,
  {
    forceMultiplier = { x: 10, y: 10 },
    viewIds = [],
  }: CollisionBounceProps = {}
) => {
  const event = getCollisionEventId(view);

  view.events.addEvent(event, e => {
    const collision = e.detail.collision;
    if (viewIds.length > 0 && !viewIds.includes(collision.view2.id)) return;

    const bounceForce = getBounceForce(view, collision.deltaTime);
    bounceForce.x = Math.abs(bounceForce.x) * forceMultiplier.x;
    bounceForce.y = Math.abs(bounceForce.y) * forceMultiplier.y;

    bounceForce.x *= -collision.normal.x;
    bounceForce.y *= -collision.normal.y;

    const physics = view.getComponent<PhysicsComponent>('physics');
    physics?.applyForce(bounceForce);
  });

  return {};
};
