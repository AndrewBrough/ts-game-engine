import type { Collision } from '../../gameState/collisionManager';
import type { EntityViewInstance } from '../player/entityView';
import type { EntityModel } from '../types';

export const collisionDamage = (view: EntityViewInstance) => {
  view.events.addEvent(
    `${view.id}-collide`,
    (e: CustomEvent<{ collision: Collision }>) => {
      const collision = e.detail.collision;
      handleDamage(collision);
    }
  );

  const handleDamage = (collision: Collision) => {
    const currentHealth = (collision.view2.model as EntityModel).health;
    const damage = collision.view1.model.collisionDamage;
    const newHealth = currentHealth - damage;
    view.model.health = newHealth;
  };
};
