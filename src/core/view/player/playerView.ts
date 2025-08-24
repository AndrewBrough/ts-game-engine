import { createAnimatedView } from '../animatedView';
import { isKeyHeld } from '../../input/keyboard';

const PLAYER_SPEED = 0.5;

export const createPlayerView = () => {
  const animatedView = createAnimatedView({
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

  // Add movement animation
  animatedView.addAnimation((e: CustomEvent) => {
    let deltaX = 0;
    let deltaY = 0;
    const deltaTime = e.detail.deltaTime;

    // Check for left movement (A key or left arrow)
    if (isKeyHeld('a') || isKeyHeld('A') || isKeyHeld('ArrowLeft')) {
      deltaX -= PLAYER_SPEED;
    }

    // Check for right movement (D key or right arrow)
    if (isKeyHeld('d') || isKeyHeld('D') || isKeyHeld('ArrowRight')) {
      deltaX += PLAYER_SPEED;
    }

    if (isKeyHeld('w') || isKeyHeld('W') || isKeyHeld('ArrowUp')) {
      deltaY -= PLAYER_SPEED;
    }

    if (isKeyHeld('s') || isKeyHeld('S') || isKeyHeld('ArrowDown')) {
      deltaY += PLAYER_SPEED;
    }

    deltaX *= deltaTime / 10;
    deltaY *= deltaTime / 10;

    // Update position if there's movement
    if (deltaX !== 0 || deltaY !== 0) {
      const currentX = animatedView.props.position.x;
      const newX = currentX + deltaX;
      const currentY = animatedView.props.position.y;
      const newY = currentY + deltaY;
      animatedView.updatePosition({ x: newX, y: newY });
    }
  }, 'update');

  return animatedView;
};
