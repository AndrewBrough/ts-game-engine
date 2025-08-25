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

          // Calculate collision normal based on which side is colliding
          let normal = { x: 0, y: 0 };

          if (boundsOverlap) {
            // Determine which side of view is colliding with v
            const viewLeft = view.geometry.x;
            const viewRight = view.geometry.x + view.geometry.width;
            const viewTop = view.geometry.y;
            const viewBottom = view.geometry.y + view.geometry.height;

            const vLeft = v.geometry.x;
            const vRight = v.geometry.x + v.geometry.width;
            const vTop = v.geometry.y;
            const vBottom = v.geometry.y + v.geometry.height;

            // Calculate overlap amounts on each side
            const overlapLeft = Math.abs(viewRight - vLeft);
            const overlapRight = Math.abs(vRight - viewLeft);
            const overlapTop = Math.abs(viewBottom - vTop);
            const overlapBottom = Math.abs(vBottom - viewTop);

            // Find the smallest overlap to determine the collision side
            const minOverlap = Math.min(
              overlapLeft,
              overlapRight,
              overlapTop,
              overlapBottom
            );

            if (minOverlap === overlapLeft) {
              // Collision on left side of view (view is to the right of v)
              normal = { x: 1, y: 0 };
            } else if (minOverlap === overlapRight) {
              // Collision on right side of view (view is to the left of v)
              normal = { x: -1, y: 0 };
            } else if (minOverlap === overlapTop) {
              // Collision on top side of view (view is below v)
              normal = { x: 0, y: 1 };
            } else if (minOverlap === overlapBottom) {
              // Collision on bottom side of view (view is above v)
              normal = { x: 0, y: -1 };
            }
          }

          const collision = {
            id: `${view.id}-${v.id}`,
            view1: view,
            view2: v,
            contactPoint: {
              x: boundsOverlap?.left ?? 0,
              y: boundsOverlap?.top ?? 0,
            },
            normal,
            deltaTime,
          };
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
    // dispatch collision events for both views
    if (
      COLLISION_MATRIX[collision.view1.layer].includes(collision.view2.layer)
    ) {
      const event = `${collision.view1.layer}-collide`;
      // console.log(event);
      dispatchCollisionEvent(event, collision);
    }
    // if (
    //   COLLISION_MATRIX[collision.view2.layer].includes(collision.view1.layer)
    // ) {
    //   const event = `${collision.view2.layer}-collide`;
    //   console.log(event);
    //   dispatchCollisionEvent(event, {
    //     ...collision,
    //     view1: collision.view2,
    //     view2: collision.view1,
    //   });
    // }
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
