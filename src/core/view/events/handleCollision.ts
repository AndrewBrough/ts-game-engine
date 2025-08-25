import type { Collision } from '../../gameState/collisionManager';
import type { EntityModel } from '../types';
import type { PhysicsInstance } from '../../physics';
import type { InteractiveViewInstance } from '../interactiveView';
import { createAnimatedView } from '../animatedView';

export type CollisionHandler = ReturnType<typeof createCollisionHandler>;

export const createCollisionHandler = (
  view: InteractiveViewInstance,
  physics: PhysicsInstance,
  initialModel: EntityModel
) => {
  const collisionVector = createAnimatedView({
    fill: {
      color: 'cyan',
      opacity: 1,
    },
  });

  const handleCollide = (e: CustomEvent<{ collision: Collision }>) => {
    const collision = e.detail?.collision;
    const { view1, view2 } = collision;
    const isView1 = view1.id === view.id;
    const isView2 = view2.id === view.id;
    if (!isView1 && !isView2) {
      return;
    }

    const otherView = isView1 ? view2 : view1;

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

      // const currentForce = physics.getCurrentForce();
      const bounceForceX =
        collision.normal.x * view.props.physics.bounce * (isView1 ? 1 : -1);
      const bounceForceY =
        collision.normal.y * view.props.physics.bounce * (isView1 ? 1 : -1);

      const targetForce = {
        x: bounceForceX,
        y: bounceForceY,
      };
      // physics.reset();
      physics.setForce(targetForce);
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
