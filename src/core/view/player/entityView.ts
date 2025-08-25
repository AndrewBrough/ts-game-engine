import { createPhysics } from '../../physics';
import type { DeepPartial } from '../../types';
import { createAnimatedView } from '../animatedView';
import { createInteractiveView } from '../interactiveView';
import { createCollisionHandler } from '../events/handleCollision';
import type { InteractiveView } from '../types';

export type EntityViewInstance = ReturnType<typeof createEntityView>;

export const createEntityView = (props: DeepPartial<InteractiveView> = {}) => {
  const view = createInteractiveView({
    ...props,
    model: {
      maxHealth: 100,
      health: 100,
      speed: 10,
      collisionDamage: 1,
      ...props.model,
    },
  });
  // const healthView = createAnimatedView({
  //   id: `${view.props.id}-health`,
  //   layer: 'UI',
  //   anchor: 'top-left',
  //   fill: {
  //     color: 'white',
  //     opacity: 1,
  //   },
  //   stroke: {
  //     color: 'white',
  //     opacity: 1,
  //     width: 2,
  //   },
  //   geometry: view.props.geometry,
  //   textProps: {
  //     text: (view.model as EntityModel).health.toString() ?? '0',
  //   },
  // });

  const physics = createPhysics(view.physics);
  const collisionHandler = createCollisionHandler(view, physics);

  view.events.addEvent('update', () => {
    const force = physics.update();

    if (force.x !== 0 || force.y !== 0) {
      view.updatePosition({
        x: view.geometry.x + force.x,
        y: view.geometry.y + force.y,
      });
    }

    view.update();
  });

  collisionHandler.attachCollisionHandler();

  const entityView = {
    ...view,
    physics,
    collisionHandler,
  };

  return entityView;
};
