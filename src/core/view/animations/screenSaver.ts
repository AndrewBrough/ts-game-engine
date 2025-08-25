import type { EntityViewInstance } from '../player/entityView';

export const screenSaver = (entityView: EntityViewInstance) => {
  const randomSpeed = () => Math.random() * 10 + entityView.model.speed;
  const constantForce = { x: randomSpeed(), y: randomSpeed() };

  entityView.events.addEvent('update', (e: CustomEvent) => {
    if (entityView.geometry.x <= 0 || entityView.geometry.x >= 100) {
      entityView.physics.reset();
      constantForce.x *= -1;
    }
    if (entityView.geometry.y <= 0 || entityView.geometry.y >= 100) {
      entityView.physics.reset();
      constantForce.y *= -1;
    }
    entityView.physics.applyForce(constantForce);
  });
};
