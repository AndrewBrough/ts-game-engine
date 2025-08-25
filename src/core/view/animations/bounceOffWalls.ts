import type { EntityViewInstance } from '../player/entityView';

export const bounceOffWalls = (entityView: EntityViewInstance) => {
  entityView.events.addEvent('update', (e: CustomEvent) => {
    const deltaTime = e.detail.deltaTime;
    const currentForce = entityView.physics.getCurrentForce();
    const nextPosition = {
      x: entityView.props.position.x + currentForce.x * deltaTime,
      y: entityView.props.position.y + currentForce.y * deltaTime,
    };
    if (nextPosition.x <= 0 || nextPosition.x >= 100) {
      // console.log('bounce x', currentForce, nextPosition);
      currentForce.x = -currentForce.x * 2;
    }
    if (nextPosition.y <= 0 || nextPosition.y >= 100) {
      // console.log('bounce y', currentForce, nextPosition);
      currentForce.y = -currentForce.y * 2;
    }
    entityView.physics.applyForce(currentForce);
  });
};
