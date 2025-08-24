import type { Position, View } from './view/types';

export type PhysicsInstance = ReturnType<typeof createPhysics>;

/**
 * Creates a physics object for handling forces and dampening
 */
export const createPhysics = (props: View['physics']) => {
  let currentForce: Position = { x: 0, y: 0 };
  const dampening = props?.dampening ?? 0.95;

  const applyForce = (force: Position) => {
    const difference = {
      x: force.x - currentForce.x,
      y: force.y - currentForce.y,
    };
    console.log('apply force', difference);
    currentForce.x += difference.x / 100;
    currentForce.y += difference.y / 100;
  };

  const update = () => {
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
