import { isKeyHeld } from '../../input/keyboard';
import { createInteractiveView } from '../interactiveView';
import type { Position } from '../types';

const PLAYER_SPEED = 0.5;

export const createPlayerView = () => {
  const animatedView = createInteractiveView({
    id: 'player',
    layer: 'PLAYER',
    // anchor: 'center',
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

  animatedView.events.addEvent('update', (e: CustomEvent) => {
    const deltaTime = e.detail?.deltaTime || 16; // Default to 16ms (60fps)

    const movement: Position = {
      x: 0,
      y: 0,
    };

    if (isKeyHeld('a') || isKeyHeld('ArrowLeft')) {
      movement.x = -PLAYER_SPEED;
    }
    if (isKeyHeld('d') || isKeyHeld('ArrowRight')) {
      movement.x = PLAYER_SPEED;
    }
    if (isKeyHeld('w') || isKeyHeld('ArrowUp')) {
      movement.y = -PLAYER_SPEED;
    }
    if (isKeyHeld('s') || isKeyHeld('ArrowDown')) {
      movement.y = PLAYER_SPEED;
    }

    animatedView.move(movement, deltaTime);
  });

  return animatedView;
};
