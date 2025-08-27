import { createCollisionHandler } from './events/handleCollision';
import type { ViewInstance } from '../view';

export const addCollisions = (view: ViewInstance) => {
  const collisionHandler = createCollisionHandler(view);
  collisionHandler.attachCollisionHandler();

  return {
    ...collisionHandler,
  };
};
