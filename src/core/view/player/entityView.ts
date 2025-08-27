import { createPhysics } from '../../physics';
import type { DeepPartial } from '../../types';
import { createInteractiveView } from '../interactiveView';
import { createCollisionHandler } from '../events/handleCollision';
import type { InteractiveView } from '../types';
import { Screen } from '../../units';
import { bounceOffWalls } from '../animations/bounceOffWalls';
import { bounceOnCollision } from '../animations/bounceOnCollision';
import { deepMerge } from '../../utils/deepMerge';

export type EntityViewInstance = ReturnType<typeof createEntityView>;

const defaultViewProps: DeepPartial<InteractiveView> = {
  model: {
    speed: 10,
    maxHealth: 100,
    health: 100,
    collisionDamage: 10,
  },
  geometry: {
    shape: 'rect',
    width: Math.min(Screen.percent(7.5).w, 50),
    height: Math.min(Screen.percent(7.5).w, 50),
  },
};

export const createEntityView = (props: DeepPartial<InteractiveView>) => {
  const mergedProps = deepMerge(defaultViewProps, props);
  const view = createInteractiveView({
    ...mergedProps,
  });

  const physics = createPhysics(view.physics);
  const collisionHandler = createCollisionHandler({ ...view, physics });
  collisionHandler.attachCollisionHandler();
  const { collisionHandlerEvent } = collisionHandler;

  // functions to call on update event from game loop
  view.events.addEvent('update', (e: CustomEvent) => {
    updatePhysics(e);
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

  const entityView = {
    ...view,
    collisionHandler,
    physics,
  };

  bounceOnCollision(entityView, collisionHandlerEvent);
  bounceOffWalls(entityView);
  // collisionDamage(entityView);
  // changeColorForHealth(entityView, collisionHandlerEvent);

  return entityView;
};
