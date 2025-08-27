import type { Collision } from '../../../gameState/collisionManager';
import type { EntityViewInstance } from '../../entity/entityView';
import type { EntityModel } from '../../types';
import type { ViewInstance } from '../../view';

export const addCollisionDamage = (view: ViewInstance) => {
  view.events.addEvent(`${view.id}-collide`, e => {
    if (e.detail?.collision) {
      const collision = e.detail.collision;
      handleDamage(collision);
    }
  });

  const handleDamage = (collision: Collision) => {
    const currentHealth = (collision.view2.model as EntityModel).health;
    const damage = collision.view1.model.collisionDamage;
    const newHealth = currentHealth - damage;
    view.model.health = newHealth;
  };

  return {};
};
