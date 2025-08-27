import type { Collision } from '../../../gameState/collisionManager';
import type { EntityViewInstance } from '../../entity/entityView';
import type { ViewInstance } from '../../view';
import type { PhysicsComponent } from '../addPhysics';
import { getBounceForce } from './addWallBounce';

export const addCollisionBounce = (view: ViewInstance, event: string) => {
  view.events.addEvent(event, e => {
    const collision = e.detail.collision;
    const bounceForce = getBounceForce(view, collision.deltaTime);
    bounceForce.x = Math.abs(bounceForce.x) * 100;
    bounceForce.y = Math.abs(bounceForce.y) * 100;

    bounceForce.x *= -collision.normal.x;
    bounceForce.y *= -collision.normal.y;

    const physics = view.getComponent<PhysicsComponent>('physics');
    physics?.applyForce(bounceForce);
  });

  return {};
};
