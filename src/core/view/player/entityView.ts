import type { Collision } from '../../gameState/collisionManager';
import { createModel } from '../../model/model';
import type { DeepPartial } from '../../types';
import { createAnimatedView } from '../animatedView';
import { createInteractiveView } from '../interactiveView';
import type { EntityModel, InteractiveView } from '../types';

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

  view.events.addEvent('update', (e: CustomEvent) => {
    const { health } = view.model as EntityModel;
    healthView.updateText(health.toString());
    healthView.updatePosition({
      x: view.props.position.x,
      y: view.props.position.y + 4,
    });
    healthView.update();
  });

  const handleCollide = (e: CustomEvent<{ collision: Collision }>) => {
    const collision = e.detail?.collision;
    const { view1, view2 } = collision;
    if (view1.id !== view.props.id && view2.id !== view.props.id) {
      return;
    }

    const otherView =
      collision.view1.id === view.props.id ? collision.view2 : collision.view1;

    // calc damage and apply health changes
    if (otherView.model && 'collisionDamage' in otherView.model) {
      const damage = (otherView.model as EntityModel).collisionDamage;
      const currentHealth = (view.model as EntityModel).health;
      const newHealth = currentHealth - damage;

      (view.model as EntityModel).health = newHealth;

      const percentHealth =
        (view.model as EntityModel).health / initialModel.health;
      const opacity = Math.max(0, percentHealth);

      view.updateFillColor({
        color: view.fill.color,
        opacity,
      });

      const directionVector = {
        x: (otherView.position.x - view.props.position.x) / 10,
        y: (otherView.position.y - view.props.position.y) / 10,
      };

      console.log(directionVector);

      view.updatePosition({
        x: view.props.position.x - directionVector.x,
        y: view.props.position.y - directionVector.y,
      });
    }
  };

  view.events.addEvent(`${view.props.layer}-collide`, handleCollide);

  return view;
};
