import { createEvents } from '../events/events';
import { doBoundsOverlap } from '../view/collision';
import type { View } from '../view/types';
import { getAllCollidableViews, getCollisionLayerViews } from './gameState';
import { COLLISION_MATRIX } from './collisionLayers';

export type Collision = {
  view1: View;
  view2: View;
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
    if (view.bounds) {
      // Only check for collisions for views on layers that are in the collision matrix
      const viewsOnMatrixLayers = getCollisionLayerViews(view.layer);
      for (const v of viewsOnMatrixLayers) {
        if (v.bounds && v.id !== view.id) {
          const collision = {
            view1: view,
            view2: v,
          };

          const hasCol = hasCollision(collision);
          const boundsOverlap = doBoundsOverlap(view.bounds, v.bounds);

          if (boundsOverlap) {
            if (!hasCol) {
              registerCollision(collision);
            }
          } else if (hasCol) {
            unregisterCollision(collision);
          }
        }
      }
    }
  };

  const hasCollision = (collision: Collision) => {
    const c = collisions.find(
      c =>
        c.view1.id === collision.view1.id && c.view2.id === collision.view2.id
    );
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
      dispatchCollisionEvent(`${collision.view2.layer}-collide`, collision);
    }
    if (
      COLLISION_MATRIX[collision.view2.layer].includes(collision.view1.layer)
    ) {
      dispatchCollisionEvent(`${collision.view1.layer}-collide`, collision);
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
