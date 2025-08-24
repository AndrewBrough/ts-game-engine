import type { Collision } from '../../gameState/collisionManager';
import type { EntityModel } from '../types';
import type { PhysicsInstance } from '../../physics';

export type CollisionHandler = ReturnType<typeof createCollisionHandler>;

export const createCollisionHandler = (
  view: any,
  physics: PhysicsInstance,
  initialModel: EntityModel
) => {
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
        x: (-otherView.position.x + view.props.position.x) / 10,
        y: (-otherView.position.y + view.props.position.y) / 10,
      };
      console.log(directionVector);

      physics.applyForce({
        x: directionVector.x,
        y: directionVector.y,
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
