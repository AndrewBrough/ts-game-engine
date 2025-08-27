import { createPhysics } from '../../physics';
import type { ViewInstance } from '../view';

export type PhysicsComponent = ReturnType<typeof createPhysics>;

export const addPhysics = (view: ViewInstance) => {
  const physics = createPhysics(view);

  // functions to call on update event from game loop
  view.events.addEvent('update', e => {
    updatePhysics(e as CustomEvent);
    // Update view so next render gets the above changes
    view.update();
  });

  const updatePhysics = (e: CustomEvent) => {
    // get physics data updates
    const force = physics.update(e);

    // update view data if force is applied
    if (force.x !== 0 || force.y !== 0) {
      view.updatePosition({
        x: view.geometry.x + force.x,
        y: view.geometry.y + force.y,
      });
    }
  };

  return {
    ...physics,
    id: crypto.randomUUID(),
    updatePhysics,
  };
};
