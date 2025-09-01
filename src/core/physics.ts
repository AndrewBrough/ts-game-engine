import type { Position, View } from './view/types';

export type PhysicsInstance = ReturnType<typeof createPhysics>;

/**
 * Creates a physics object for handling forces and dampening
 */
export const createPhysics = (view: View) => {
  let currentForce: Position = { x: 0, y: 0 };
  const dampening = view.physics.dampening ?? 0.95;

  const applyForce = (force: Position) => {
    const difference = {
      x: force.x - currentForce.x,
      y: force.y - currentForce.y,
    };
    currentForce.x += difference.x / 100;
    currentForce.y += difference.y / 100;
  };

  const setForce = (force: Position) => {
    currentForce.x = force.x;
    currentForce.y = force.y;
  };

  const update = (e: CustomEvent) => {
    const deltaTime = e.detail.deltaTime;
    // Apply dampening (air resistance)
    currentForce.x *= dampening;
    currentForce.y *= dampening;

    // Stop very small forces to prevent infinite micro-movements
    if (Math.abs(currentForce.x) < 0.01) currentForce.x = 0;
    if (Math.abs(currentForce.y) < 0.01) currentForce.y = 0;

    // Cap max force that can be applied
    if (Math.abs(currentForce.x) > view.model.maxSpeed * deltaTime)
      currentForce.x *= dampening * 0.1;
    if (Math.abs(currentForce.y) > view.model.maxSpeed * deltaTime)
      currentForce.y *= dampening * 0.1;

    // TODO investigate if this is a fun mechanic, wobbly movement when high speed
    // if (Math.abs(currentForce.x) > 20)
    //   currentForce.x = Math.sin(currentForce.x) * 2;
    // if (Math.abs(currentForce.y) > 20)
    //   currentForce.y = Math.sin(currentForce.y) * 2;

    return currentForce;
  };

  const getCurrentForce = () => ({ ...currentForce });

  const reset = () => {
    currentForce = { x: 0, y: 0 };
  };

  return {
    id: crypto.randomUUID(),
    applyForce,
    setForce,
    update,
    getCurrentForce,
    reset,
  };
};
