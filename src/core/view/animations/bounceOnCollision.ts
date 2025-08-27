import type { Collision } from '../../gameState/collisionManager';
import type { EntityViewInstance } from '../player/entityView';
import { getBounceForce } from './bounceOffWalls';

export const bounceOnCollision = (view: EntityViewInstance, event: string) => {
  view.events.addEvent(event, (e: CustomEvent<{ collision: Collision }>) => {
    const collision = e.detail.collision;
    const bounceForce = getBounceForce(view, collision.deltaTime);
    bounceForce.x = Math.abs(bounceForce.x) * 100;
    bounceForce.y = Math.abs(bounceForce.y) * 100;

    bounceForce.x *= -collision.normal.x;
    bounceForce.y *= -collision.normal.y;

    view.physics.applyForce(bounceForce);
  });
};
