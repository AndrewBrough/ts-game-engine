import { type Collision } from '../../gameState/collisionManager';
import { getCollideEventId, getCollisionEventId } from '../collision';
import type { ViewInstance } from '../view';

export type CollisionComponent = ReturnType<typeof addCollisions>;

export const addCollisions = (view: ViewInstance) => {
  // Event received from collisionManager
  const collideEvent = getCollideEventId(view);
  // Event sent from this handler to bind view event handlers to
  const collisionHandlerEvent = getCollisionEventId(view);

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

  const addCollisionEvent = (callback: (e: CustomEvent) => void) => {
    view.events.addEvent(collisionHandlerEvent, e => callback(e as any));
  };

  const removeCollisionEvent = () => {
    view.events.removeEvent(collisionHandlerEvent);
  };

  attachCollisionHandler();

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
