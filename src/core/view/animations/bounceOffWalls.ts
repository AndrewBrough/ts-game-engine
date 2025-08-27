import type { EntityViewInstance } from '../player/entityView';
import { Screen } from '../../units';

export const bounceOffWalls = (entityView: EntityViewInstance) => {
  const yMax = Screen.h - entityView.geometry.height;
  const xMax = Screen.w - entityView.geometry.width;

  entityView.events.addEvent('update', (e: CustomEvent) => {
    const deltaTime = e.detail.deltaTime;

    const bounceVector = { x: 0, y: 0 };

    if (entityView.geometry.x <= 0) {
      bounceVector.x = -1;
    }
    if (entityView.geometry.x >= xMax) {
      bounceVector.x = -1;
    }
    if (entityView.geometry.y <= 0) {
      bounceVector.y = -1;
    }
    if (entityView.geometry.y >= yMax) {
      bounceVector.y = -1;
    }

    if (bounceVector.x !== 0 || bounceVector.y !== 0) {
      const bounceForce = getBounceForce(entityView, deltaTime);
      bounceForce.x *= bounceVector.x * 100;
      bounceForce.y *= bounceVector.y * 100;

      entityView.physics.applyForce(bounceForce);
    }
  });
};

export const getBounceForce = (
  entityView: EntityViewInstance,
  deltaTime: number = 16.66
) => {
  const currentForce = entityView.physics.getCurrentForce();
  const bounceForce = {
    x: (currentForce.x / 5) * entityView.physics.bounce * deltaTime,
    y: (currentForce.y / 5) * entityView.physics.bounce * deltaTime,
  };

  return bounceForce;
};
