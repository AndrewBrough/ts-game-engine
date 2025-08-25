import { createEvents } from '../events/events';
import { getOverlap, type Bounds } from '../view/collision';
import type { Position, View } from '../view/types';
import { getAllCollidableViews, getCollisionLayerViews } from './gameState';
import { COLLISION_MATRIX } from './collisionLayers';

export type Collision = {
  id: string;
  view1: View;
  view2: View;
  contactPoint: Position;
  normal: Position; // Normalized collision direction
};

export type CollisionManager = ReturnType<typeof collisionManager>;

export const collisionManager = () => {
  const events = createEvents();
  const collisions: Collision[] = [];

  events.addEvent('collisions', () => {
    // Get all views across all layers
    const allViews = getAllCollidableViews();
    for (const view of allViews) {
      checkCollisions(view);
    }
  });

  const checkCollisions = (view: View) => {
    if (view.geometry) {
      // Only check for collisions for views on layers that are in the collision matrix
      const viewsOnMatrixLayers = getCollisionLayerViews(view.layer);
      for (const v of viewsOnMatrixLayers) {
        if (v.geometry && v.id !== view.id) {
          const boundsOverlap = getOverlap(view.geometry, v.geometry);

          // Calculate collision normal (direction from v to view)
          const dx = view.geometry.x - v.geometry.x;
          const dy = view.geometry.y - v.geometry.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const normal = {
            x: distance > 0 ? dx / distance : 0,
            y: distance > 0 ? dy / distance : 0,
          };

          const collision = {
            id: `${view.id}-${v.id}`,
            view1: view,
            view2: v,
            contactPoint: {
              x: boundsOverlap?.left ?? 0,
              y: boundsOverlap?.top ?? 0,
            },
            normal,
          };
          const hasCol = hasCollision(collision.id);
          if (boundsOverlap && !hasCol) {
            console.log('collision', collision);
            registerCollision(collision);
          } else if (hasCol) {
            console.log('unregistering collision', collision);
            unregisterCollision(collision);
          }
        }
      }
    }
  };

  const hasCollision = (id: string) => {
    const c = collisions.find(c => c.id === id);
    return c !== undefined;
  };

  const registerCollision = (collision: Collision) => {
    if (collisions.includes(collision)) {
      // already registered
      return;
    }
    collisions.push(collision);
    // dispatch collision events for both views
    if (
      COLLISION_MATRIX[collision.view1.layer].includes(collision.view2.layer)
    ) {
      dispatchCollisionEvent(`${collision.view1.layer}-collide`, collision);
    }
    if (
      COLLISION_MATRIX[collision.view2.layer].includes(collision.view1.layer)
    ) {
      dispatchCollisionEvent(`${collision.view2.layer}-collide`, collision);
    }
  };

  const dispatchCollisionEvent = (event: string, collision: Collision) => {
    if (
      COLLISION_MATRIX[collision.view1.layer].includes(collision.view2.layer)
    ) {
      window.dispatchEvent(
        new CustomEvent(event, {
          detail: { collision },
        })
      );
    }
  };

  const unregisterCollision = (collision: Collision) => {
    collisions.splice(collisions.indexOf(collision), 1);
  };

  return {
    events,
  };
};
