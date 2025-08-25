import type { EntityViewInstance } from '../player/entityView';
import { Screen } from '../../units';

export const bounceOffWalls = (entityView: EntityViewInstance) => {
  const yMax = Screen.h - entityView.geometry.height;
  const xMax = Screen.w - entityView.geometry.width;

  entityView.events.addEvent('update', (e: CustomEvent) => {
    const deltaTime = e.detail.deltaTime;
    const currentForce = entityView.physics.getCurrentForce();

    const bounceForce = {
      x: (currentForce.x / 5) * entityView.physics.bounce * deltaTime,
      y: (currentForce.y / 5) * entityView.physics.bounce * deltaTime,
    };

    console.log(entityView.geometry.x, entityView.geometry.y);

    if (entityView.geometry.x <= 0) {
      console.log('bounce x', currentForce, entityView.geometry);
      bounceForce.x *= -1;
      entityView.physics.setForce(bounceForce);
    }
    if (entityView.geometry.x >= xMax) {
      console.log('bounce x', currentForce, entityView.geometry);
      bounceForce.x *= -1;
      entityView.physics.setForce(bounceForce);
    }
    if (entityView.geometry.y <= 0) {
      console.log('bounce y', currentForce, entityView.geometry);
      bounceForce.y *= -1;
      entityView.physics.setForce(bounceForce);
    }
    if (entityView.geometry.y >= yMax) {
      console.log('bounce y', currentForce, entityView.geometry);
      bounceForce.y *= -1;
      entityView.physics.setForce(bounceForce);
    }

    console.log(bounceForce);
  });
};
