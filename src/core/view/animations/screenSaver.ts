import type { ViewInstance } from "../view";

const MIN_SPEED = 0.1;
const SPEED_RANGE = 0.1;

export const screenSaver = (viewInstance: ViewInstance) => {
    const direction = { x: 1, y: 1 };
    const speedX = Math.random() * SPEED_RANGE + MIN_SPEED;
    const speedY = Math.random() * SPEED_RANGE + MIN_SPEED;
    const { props: {
        position,
        shapeProps,
        units
    } } = viewInstance;
    
    
    const animate = () => {

        // Calculate new position
        const newX = position.x + direction.x * speedX;
        const newY = position.y + direction.y * speedY;

        // For x-axis: use viewport width boundary
        if (newX < 0 || newX > 100 - shapeProps.width) {
            direction.x = -direction.x;
        }
        
        // For y-axis: calculate proper viewport height boundary
        // If using vw units, convert to vh equivalent for y-axis
        let yMax = 100;
        if (units === 'vw') {
            // Convert vw to vh equivalent: (window.innerHeight / window.innerWidth) * 100
            yMax = (window.innerHeight / window.innerWidth) * 100;
        }
        
        if (newY < 0 || newY > yMax - shapeProps.height) {
            direction.y = -direction.y;
        }
        
        // Update the view position
        viewInstance.updatePosition({ x: newX, y: newY });
    }

    return animate;
}