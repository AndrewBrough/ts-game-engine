import type { Collision } from '../../gameState/collisionManager';
import { isKeyHeld } from '../../input/keyboard';
import type { EntityModel, Position } from '../types';
import { createEntityView } from './entityView';

export const createPlayerView = () => {
  const view = createEntityView({
    id: 'player',
    model: {
      speed: 0.5,
      health: 100,
    },
    layer: 'PLAYER',
    relativeTo: 'bottom-left',
    shapeProps: {
      width: 10,
      height: 10,
    },
    shape: 'rect',
    fill: {
      color: 'blue',
    },
  });

  view.events.addEvent('update', (e: CustomEvent) => {
    const deltaTime = e.detail?.deltaTime || 16; // Default to 16ms (60fps)

    const movement: Position = {
      x: 0,
      y: 0,
    };
    const speed = (view.model as EntityModel).speed;

    if (isKeyHeld('a') || isKeyHeld('ArrowLeft')) {
      movement.x = -speed;
    }
    if (isKeyHeld('d') || isKeyHeld('ArrowRight')) {
      movement.x = speed;
    }
    if (isKeyHeld('w') || isKeyHeld('ArrowUp')) {
      movement.y = -speed;
    }
    if (isKeyHeld('s') || isKeyHeld('ArrowDown')) {
      movement.y = speed;
    }

    view.move(movement, deltaTime);
  });

  const playerCollide = (e: CustomEvent<{ collision: Collision }>) => {
    const collision = e.detail?.collision;
    const otherView =
      collision.view1.id === view.props.id ? collision.view2 : collision.view1;

    // calc damage and apply health changes
    if (otherView.model && 'health' in otherView.model) {
      (view.model as EntityModel).health -= (
        otherView.model as EntityModel
      ).health;
      (otherView.model as EntityModel).health -= (
        view.model as EntityModel
      ).health;
    }

    view.updatePosition();
  };

  view.events.addEvent('collide', playerCollide);

  return view;
};
