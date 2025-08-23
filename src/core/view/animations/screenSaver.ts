import type { ViewInstance } from "../types";

const MIN_SPEED = 2;
const SPEED_RANGE = 1;

export const screenSaver = (viewInstance: ViewInstance) => {
    const direction = {x: 1, y: 1};
    
    const {
        updatePosition,
        props
    } = viewInstance;

    
    const animate = () => {
        const currentX = Math.max(props.position.x, 0);
        const currentY = Math.max(props.position.y, 0);
        const speedX = Math.random() * SPEED_RANGE + MIN_SPEED;
        const speedY = Math.random() * SPEED_RANGE + MIN_SPEED;
        
        // Calculate new position
        const newX = currentX + direction.x * speedX;
        const newY = currentY + direction.y * speedY;

        if (newX < 0 || newX > window.innerWidth - props.shapeProps.width) {
            direction.x = -direction.x;
        }
        if (newY < 0 || newY > window.innerHeight - props.shapeProps.height) {
            direction.y = -direction.y;
        }
        
        // Update the view position
        updatePosition({ x: newX, y: newY });
    }

    return animate;
}