import {
  collisionManager,
  type Collision,
} from '../../../gameState/collisionManager';
import type { ViewInstance } from '../../view';

export type CollisionHandlerInstance = {
  handleCollide: (e: CustomEvent<{ collision: Collision }>) => void;
  attachCollisionHandler: () => void;
  detachCollisionHandler: () => void;
};

export const createCollisionHandler = (view: ViewInstance) => {
  // Event received from collisionManager
  const collideEvent = `${view.id}-collide`;
  // Event sent from this handler to bind view event handlers to
  const collisionHandlerEvent = `${view.id}-collision-event`;

  const handleCollide = (e: CustomEvent<{ collision: Collision }>) => {
    const collision = e.detail?.collision;
    const { view1, view2 } = collision;
    const isView1 = view1.id === view.id;
    const isView2 = view2.id === view.id;
    if (!isView1 && !isView2) {
      return;
    }

    view.events.events?.get(collisionHandlerEvent)?.forEach(cb => cb(e));
  };

  const attachCollisionHandler = () => {
    view.events.addEvent(collideEvent, e => handleCollide(e as any));
  };

  const detachCollisionHandler = () => {
    view.events.removeEvent(collideEvent);
  };

  const addCollisionEvent = (
    callback: (e: CustomEvent<{ collision: Collision }>) => void
  ) => {
    view.events.addEvent(collisionHandlerEvent, e => callback(e as any));
  };

  const removeCollisionEvent = (
    callback: (e: CustomEvent<{ collision: Collision }>) => void
  ) => {
    view.events.removeEvent(collisionHandlerEvent);
  };

  return {
    handleCollide,
    attachCollisionHandler,
    detachCollisionHandler,
    addCollisionEvent,
    removeCollisionEvent,
    collideEvent,
    collisionHandlerEvent,
  };
};
