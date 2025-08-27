import type { EntityViewInstance } from '../player/entityView';

export const alwaysMoveForward = (view: EntityViewInstance) => {
  // kick off in a random direction
  const randomDirection = {
    x: Math.random() * view.model.speed * 100,
    y: Math.random() * view.model.speed * 100,
  };
  view.physics.applyForce(randomDirection);

  view.events.addEvent('update', (e: CustomEvent) => {
    const deltaTime = e.detail.deltaTime;
    const currentForce = view.physics.getCurrentForce();
    const direction = {
      x: currentForce.x / Math.sqrt(currentForce.x * currentForce.x),
      y: currentForce.y / Math.sqrt(currentForce.y * currentForce.y),
    };

    const forceToAdd = {
      x: direction.x * view.model.speed * deltaTime,
      y: direction.y * view.model.speed * deltaTime,
    };

    view.physics.applyForce({
      x: currentForce.x + forceToAdd.x,
      y: currentForce.y + forceToAdd.y,
    });
  });
};
