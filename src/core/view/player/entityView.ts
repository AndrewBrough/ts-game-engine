import { createModel } from '../../model/model';
import { createPhysics } from '../../physics';
import type { DeepPartial } from '../../types';
import { createAnimatedView } from '../animatedView';
import { createInteractiveView } from '../interactiveView';
import { createCollisionHandler } from '../events/handleCollision';
import type { EntityModel, InteractiveView, Position } from '../types';

export type EntityViewInstance = ReturnType<typeof createEntityView>;

export const createEntityView = (props: DeepPartial<InteractiveView> = {}) => {
  const initialModel = createModel<EntityModel>({
    health: 100,
    speed: 0.5,
    collisionDamage: 1,
    ...props.model,
  });

  const view = createInteractiveView({
    ...props,
    model: { ...initialModel },
    physics: {
      dampening: 0.95, // Default air resistance
      ...props.physics,
    },
  });
  const healthView = createAnimatedView({
    id: `${view.props.id}-health`,
    layer: 'UI',
    anchor: 'top-left',
    fill: {
      color: 'white',
      opacity: 1,
    },
    stroke: {
      color: 'white',
      opacity: 1,
      width: 2,
    },
    shapeProps: view.props.shapeProps,
    textProps: {
      text: (view.model as EntityModel).health.toString() ?? '0',
    },
  });

  const physics = createPhysics();
  const collisionHandler = createCollisionHandler(view, physics, initialModel);

  view.events.addEvent('update', () => {
    // console.log('update', physics.getCurrentForce(), view.id);
    // Apply physics forces
    const dampening = view.props.physics?.dampening ?? 0.95;
    const force = physics.update(dampening);

    if (force.x !== 0 || force.y !== 0) {
      view.updatePosition({
        x: view.props.position.x + force.x,
        y: view.props.position.y + force.y,
      });
    }

    const { health } = view.model as EntityModel;
    healthView.updateText(health.toString());
    healthView.updatePosition({
      x: view.props.position.x,
      y: view.props.position.y + 4,
    });
    healthView.update();
  });

  // Attach collision handler
  collisionHandler.attachCollisionHandler();

  // Expose physics and collision methods for external use
  const entityView = {
    ...view,
    physics: {
      applyForce: (force: Position) => physics.applyForce(force),
      getCurrentForce: () => physics.getCurrentForce(),
      reset: () => physics.reset(),
    },
    collision: {
      detach: () => collisionHandler.detachCollisionHandler(),
      attach: () => collisionHandler.attachCollisionHandler(),
    },
  };

  return entityView;
};
