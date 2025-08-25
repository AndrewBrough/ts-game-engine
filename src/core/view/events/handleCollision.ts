import type { Collision } from '../../gameState/collisionManager';
import type { EntityModel, View } from '../types';
import type { PhysicsInstance } from '../../physics';
import { getBounceForce } from '../animations/bounceOffWalls';
import type { EntityViewInstance } from '../player/entityView';

export type CollisionHandlerInstance = {
  handleCollide: (e: CustomEvent<{ collision: Collision }>) => void;
  attachCollisionHandler: () => void;
  detachCollisionHandler: () => void;
};

export const createCollisionHandler = (view: EntityViewInstance) => {
  const handleCollide = (e: CustomEvent<{ collision: Collision }>) => {
    console.log('handleCollide', view.id, e.detail);
    const collision = e.detail?.collision;
    const { view1, view2 } = collision;
    console.log(view1.id, view2.id);
    const isView1 = view1.id === view.id;
    const isView2 = view2.id === view.id;
    if (!isView1 && !isView2) {
      return;
    }

    const otherView = isView1 ? view2 : view1;

    // calc damage and apply health changes
    if (otherView.model && 'collisionDamage' in otherView.model) {
      handleDamage(otherView.model.collisionDamage);
    }

    const bounceForce = getBounceForce(view, collision.deltaTime);
    console.log(collision.normal);
    bounceForce.x *= collision.normal.x;
    bounceForce.y *= collision.normal.y;
    // console.log(bounceForce);
    view.physics.setForce(bounceForce);
  };

  const handleDamage = (damage: number = 0) => {
    const currentHealth = (view.model as EntityModel).health;
    const newHealth = currentHealth - damage;

    (view.model as EntityModel).health = newHealth;

    const percentHealth = view.model.health / view.model.maxHealth;
    const opacity = Math.max(0, percentHealth) ?? 0;

    view.updateGeometryStyle({
      fill: {
        opacity,
      },
    });
  };

  const attachCollisionHandler = () => {
    view.events.addEvent(`${view.layer}-collide`, handleCollide);
  };

  const detachCollisionHandler = () => {
    view.events.removeEvent(`${view.layer}-collide`);
  };

  return {
    handleCollide,
    attachCollisionHandler,
    detachCollisionHandler,
  };
};
