import type { Position } from './view/types';

export type PhysicsInstance = ReturnType<typeof createPhysics>;

/**
 * Creates a physics object for handling forces and dampening
 */
export const createPhysics = () => {
  let currentForce: Position = { x: 0, y: 0 };

  const applyForce = (force: Position) => {
    console.log('apply force', force);
    currentForce.x += force.x / 100;
    currentForce.y -= force.y / 100;
  };

  const update = (dampening: number = 0.95) => {
    // Apply dampening (air resistance)
    currentForce.x *= dampening;
    currentForce.y *= dampening;

    // Stop very small forces to prevent infinite micro-movements
    if (Math.abs(currentForce.x) < 0.01) currentForce.x = 0;
    if (Math.abs(currentForce.y) < 0.01) currentForce.y = 0;

    return currentForce;
  };

  const getCurrentForce = () => ({ ...currentForce });

  const reset = () => {
    currentForce = { x: 0, y: 0 };
  };

  return {
    applyForce,
    update,
    getCurrentForce,
    reset,
  };
};
