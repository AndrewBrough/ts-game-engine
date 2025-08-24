import type { Collision } from '../../gameState/collisionManager';
import type { EntityModel } from '../types';
import type { PhysicsInstance } from '../../physics';
import type { InteractiveViewInstance } from '../interactiveView';

export type CollisionHandler = ReturnType<typeof createCollisionHandler>;

export const createCollisionHandler = (
  view: InteractiveViewInstance,
  physics: PhysicsInstance,
  initialModel: EntityModel
) => {
  const handleCollide = (e: CustomEvent<{ collision: Collision }>) => {
    const collision = e.detail?.collision;
    const { view1, view2 } = collision;
    if (view1.id !== view.id && view2.id !== view.id) {
      return;
    }

    const otherView =
      collision.view1.id === view.id ? collision.view2 : collision.view1;

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
        x: view.props.position.x - otherView.position.x,
        y: view.props.position.y - otherView.position.y,
      };
      const magnitude = Math.sqrt(
        directionVector.x * directionVector.x +
          directionVector.y * directionVector.y
      );
      const normalizedVector = {
        x: directionVector.x / magnitude,
        y: directionVector.y / magnitude,
      };

      physics.applyForce({
        x: normalizedVector.x * view.props.shapeProps.width * 10,
        y: normalizedVector.y * view.props.shapeProps.height * 10,
      });
    }
  };

  const attachCollisionHandler = () => {
    view.events.addEvent(`${view.props.layer}-collide`, handleCollide);
  };

  const detachCollisionHandler = () => {
    view.events.removeEvent(`${view.props.layer}-collide`);
  };

  return {
    handleCollide,
    attachCollisionHandler,
    detachCollisionHandler,
  };
};
