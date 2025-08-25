import { createPhysics } from '../../physics';
import type { DeepPartial } from '../../types';
import { createAnimatedView } from '../animatedView';
import { createInteractiveView } from '../interactiveView';
import { createCollisionHandler } from '../events/handleCollision';
import type { EntityModel, InteractiveView } from '../types';
import { createHealthView } from './healthView';
import { Screen } from '../../units';

export type EntityViewInstance = ReturnType<typeof createEntityView>;

export const createEntityView = (props: DeepPartial<InteractiveView>) => {
  const view = createInteractiveView({
    ...props,
    model: {
      maxHealth: 100,
      health: 100,
      collisionDamage: 10,
      ...props.model,
    },
    geometry: {
      shape: 'rect',
      width: Screen.percent(20).w,
      height: Screen.percent(20).w,
      ...props.geometry,
    },
    text: {
      fontSize: Screen.percent(3).w,
      offset: 'center',
      style: {
        fill: {
          color: 'black',
          opacity: 1,
        },
        stroke: {
          color: 'white',
          opacity: 1,
          width: 1,
        },
      },
    },
  });

  // const healthView = createHealthView(view);
  const physics = createPhysics(view.physics);
  const collisionHandler = createCollisionHandler(view, physics);

  view.events.addEvent('update', () => {
    updatePhysics();
    updateHealth();

    // Update view so next render gets the above changes
    view.update();
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
  };

  const updateHealth = () => {
    view.updateText({
      text: view.model.health,
    });
    // view.updatePosition({
    //   x: view.geometry.x,
    //   y: view.geometry.y,
    // });
    // healthView.update();
  };

  collisionHandler.attachCollisionHandler();

  const entityView = {
    ...view,
    physics,
    collisionHandler,
  };

  return entityView;
};
