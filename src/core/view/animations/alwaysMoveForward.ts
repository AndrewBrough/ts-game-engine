import type { EntityViewInstance } from '../player/entityView';

export const alwaysMoveForward = (entityView: EntityViewInstance) => {
  entityView.events.addEvent('update', (e: CustomEvent) => {
    const deltaTime = e.detail.deltaTime;
    const currentForce = entityView.physics.getCurrentForce();
    entityView.physics.applyForce({
      x: currentForce.x + entityView.model.speed * deltaTime,
      y: currentForce.y + entityView.model.speed * deltaTime,
    });

    // console.log(currentForce);
  });
};
