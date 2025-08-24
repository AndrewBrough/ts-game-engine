import { createEvents } from '../events/events';
import { doBoundsOverlap } from '../view/collision';
import type { View } from '../view/types';
import { getAllCollidableViews, getCollisionLayerViews } from './gameState';

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
    if (!view.bounds) {
      throw new Error(`View ${view.id} has no bounds`);
    }

    // Only check for collisions for views on layers that are in the collision matrix
    const viewsOnMatrixLayers = getCollisionLayerViews(view.layer);
    for (const v of viewsOnMatrixLayers) {
      // console.log('Checking collision', view.id, v.id);
      if (v.bounds && v.id !== view.id) {
        const collision = {
          view1: view,
          view2: v,
        };

        if (doBoundsOverlap(view.bounds, v.bounds)) {
          console.log('Collision detected', collision);
          registerCollision(collision);
        } else {
          unregisterCollision(collision);
        }
      }
    }
  };

  const registerCollision = (collision: Collision) => {
    collisions.push(collision);
    window.dispatchEvent(
      new CustomEvent('collision', { detail: { collision } })
    );
  };

  const unregisterCollision = (collision: Collision) => {
    const c = collisions.splice(collisions.indexOf(collision), 1);
    if (c.length > 0) {
      console.log('unregistered collision', c);
    }
  };

  return {
    events,
  };
};
