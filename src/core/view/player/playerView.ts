import { createAnimatedView } from "../animatedView";
import { isKeyHeld } from "../../input/keyboard";
import { LAYERS } from "../../gameState/collisionLayers";

export const createPlayerView = () => {
    const animatedView = createAnimatedView({
        id: 'player',
        layer: LAYERS.PLAYER,
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
    animatedView.addAnimation(() => {
        const moveSpeed = 1;
        let deltaX = 0;
        let deltaY = 0;

        // Check for left movement (A key or left arrow)
        if (isKeyHeld('a') || isKeyHeld('A') || isKeyHeld('ArrowLeft')) {
            deltaX -= moveSpeed;
        }

        // Check for right movement (D key or right arrow)
        if (isKeyHeld('d') || isKeyHeld('D') || isKeyHeld('ArrowRight')) {
            deltaX += moveSpeed;
        }

        if(isKeyHeld('w') || isKeyHeld('W') || isKeyHeld('ArrowUp')) {
            deltaY -= moveSpeed;
        }

        if(isKeyHeld('s') || isKeyHeld('S') || isKeyHeld('ArrowDown')) {
            deltaY += moveSpeed;
        }

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
