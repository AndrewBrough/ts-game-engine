import { createEvents } from '../events/events';
import {
  getCollision,
  getCollisionEvent,
  getMinOverlap,
  getOverlap,
  type Bounds,
} from '../view/collision';
import type { Position, View } from '../view/types';
import { getAllCollidableViews, getCollisionLayerViews } from './gameState';
import { COLLISION_MATRIX } from './collisionLayers';

export type Collision = {
  id: string;
  view1: View;
  view2: View;
  contactPoint: Position;
  normal: Position; // Normalized collision direction
  deltaTime: number;
};

export type CollisionManager = ReturnType<typeof collisionManager>;

export const collisionManager = () => {
  const events = createEvents();
  const collisions: Collision[] = [];

  events.addEvent('collisions', (e: CustomEvent<{ deltaTime: number }>) => {
    // Get all views across all layers
    const allViews = getAllCollidableViews();
    for (const view of allViews) {
      checkCollisions(view, e.detail.deltaTime);
    }
  });

  const checkCollisions = (view: View, deltaTime: number) => {
    if (view.geometry) {
      // Only check for collisions for views on layers that are in the collision matrix
      const viewsOnMatrixLayers = getCollisionLayerViews(view.layer);
      for (const v of viewsOnMatrixLayers) {
        if (v.geometry && v.id !== view.id) {
          const boundsOverlap = getOverlap(view.geometry, v.geometry);
          const { normal } = getMinOverlap(view, v);
          const collision = getCollision(
            view,
            v,
            normal,
            deltaTime,
            boundsOverlap
          );
          const hasCol = hasCollision(collision.id);
          if (boundsOverlap) {
            if (!hasCol) {
              // console.log('registering collision', collision);
              registerCollision(collision);
            }
          } else if (hasCol) {
            // console.log('unregistering collision', collision);
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

    // dispatch collision event for first view
    if (
      COLLISION_MATRIX[collision.view1.layer].includes(collision.view2.layer)
    ) {
      const event = getCollisionEvent(collision.view1); // must match handleCollision.collideEvent
      dispatchCollisionEvent(event, collision);
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
