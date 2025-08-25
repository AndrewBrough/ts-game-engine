import { createPhysics } from '../../physics';
import type { DeepPartial } from '../../types';
import { createAnimatedView } from '../animatedView';
import { createInteractiveView } from '../interactiveView';
import { createCollisionHandler } from '../events/handleCollision';
import type { EntityModel, InteractiveView } from '../types';
import { createHealthView } from './healthView';

export type EntityViewInstance = ReturnType<typeof createEntityView>;

export const createEntityView = (props: DeepPartial<InteractiveView>) => {
  const view = createInteractiveView({
    ...props,
    model: {
      maxHealth: 100,
      health: 100,
      speed: 10,
      collisionDamage: 1,
      ...props.model,
    },
    geometry: {
      shape: 'rect',
      ...props.geometry,
    },
  });

  const healthView = createHealthView(view);
  const physics = createPhysics(view.physics);
  const collisionHandler = createCollisionHandler(view, physics);

  view.events.addEvent('update', () => {
    updatePhysics();
    updateHealth();
  });

  const updatePhysics = () => {
    // get physics data updates
    const force = physics.update();

    // update view data if force is applied
    if (force.x !== 0 || force.y !== 0) {
      view.updatePosition({
        x: view.geometry.x + force.x,
        y: view.geometry.y + force.y,
      });
    }

    // update and render view
    view.update();
  };

  const updateHealth = () => {
    healthView.updateText(view.model.health);
    healthView.updatePosition({
      x: view.geometry.x,
      y: view.geometry.y,
    });
    healthView.update();
  };

  collisionHandler.attachCollisionHandler();

  const entityView = {
    ...view,
    physics,
    collisionHandler,
  };

  return entityView;
};
