import type { Collision } from '../../../gameState/collisionManager';
import type { ViewInstance } from '../../view';

export const addCollisionDamage = (view: ViewInstance) => {
  view.events.addEvent(`${view.id}-collide`, e => {
    if (e.detail?.collision) {
      const collision = e.detail.collision;
      handleDamage(collision);
    }
  });

  const handleDamage = (collision: Collision) => {
    const currentHealth = view.model.health;
    const damage = collision.view2.model.collisionDamage;
    const newHealth = currentHealth - damage;
    view.model.health = newHealth;
  };

  return {};
};
