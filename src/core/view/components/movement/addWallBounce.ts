import { Screen } from '../../../units';
import type { ViewInstance } from '../../view';
import type { addPhysics, PhysicsComponent } from '../addPhysics';
import { getBounceForce } from './getBounceForce';

export const addWallBounce = (view: ViewInstance) => {
  view.events.addEvent('update', e => {
    const deltaTime = e.detail.deltaTime;
    // Read each update so bounds follow window resizes
    const yMax = Screen.h - view.geometry.height;
    const xMax = Screen.w - view.geometry.width;

    const bounceVector = { x: 0, y: 0 };

    if (view.geometry.x <= 0) {
      bounceVector.x = -1;
    }
    if (view.geometry.x >= xMax) {
      bounceVector.x = -1;
    }
    if (view.geometry.y <= 0) {
      bounceVector.y = -1;
    }
    if (view.geometry.y >= yMax) {
      bounceVector.y = -1;
    }

    if (bounceVector.x !== 0 || bounceVector.y !== 0) {
      const bounceForce = getBounceForce(view, deltaTime, 1);
      bounceForce.x *= bounceVector.x * 10;
      bounceForce.y *= bounceVector.y * 10;

      view.getComponent<PhysicsComponent>('physics')?.applyForce(bounceForce);
    }
  });

  return {};
};
