import { createPhysics } from '../../physics';
import type { DeepPartial } from '../../types';
import { createInteractiveView } from '../interactiveView';
import { createCollisionHandler } from '../events/handleCollision';
import type { InteractiveView } from '../types';
import { Screen } from '../../units';
import { bounceOffWalls } from '../animations/bounceOffWalls';

export type EntityViewInstance = ReturnType<typeof createEntityView>;

export const createEntityView = (props: DeepPartial<InteractiveView>) => {
  const view = createInteractiveView({
    ...props,
    model: {
      speed: 10,
      maxHealth: 100,
      health: 100,
      collisionDamage: 10,
      ...props.model,
    },
    physics: {
      bounce: 2,
      dampening: 0.85,
      ...props.physics,
    },
    geometry: {
      shape: 'rect',
      width: Math.min(Screen.percent(5).w, 20),
      height: Math.min(Screen.percent(5).w, 20),
      ...props.geometry,
    },
    // text: {
    //   fontSize: Math.min(Screen.percent(2).w, 12),
    //   offset: 'center',
    //   style: {
    //     fill: {
    //       color: 'black',
    //       opacity: 1,
    //     },
    //     stroke: {
    //       color: 'white',
    //       opacity: 1,
    //       width: 1,
    //     },
    //   },
    // },
  });

  // const healthView = createHealthView(view);
  const physics = createPhysics(view.physics);
  const collisionHandler = createCollisionHandler({ ...view, physics });

  view.events.addEvent('update', (e: CustomEvent) => {
    updatePhysics(e);
    // updateHealth();

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

  // const updateHealth = () => {
  //   view.updateText({
  //     text: view.model.health,
  //   });
  // };

  collisionHandler.attachCollisionHandler();

  const entityView = {
    ...view,
    physics,
  };

  bounceOffWalls(entityView);

  return entityView;
};
