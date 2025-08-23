import type { ViewInstance } from "../types";

const MIN_SPEED = 0.5;
const SPEED_RANGE = 0.1;

export const screenSaver = (viewInstance: ViewInstance) => {
    const direction = { x: 1, y: 1 };
    const speedX = Math.random() * SPEED_RANGE + MIN_SPEED;
    const speedY = Math.random() * SPEED_RANGE + MIN_SPEED;
    
    const {
        updatePosition,
        props
    } = viewInstance;
    
    
    const animate = () => {

        // Calculate new position
        const newX = props.position.x + direction.x * speedX;
        const newY = props.position.y + direction.y * speedY;

        // For x-axis: use viewport width boundary
        if (newX < 0 || newX > 100 - props.shapeProps.width) {
            direction.x = -direction.x;
        }
        
        // For y-axis: calculate proper viewport height boundary
        // If using vw units, convert to vh equivalent for y-axis
        let yMax = 100;
        if (props.units === 'vw') {
            // Convert vw to vh equivalent: (window.innerHeight / window.innerWidth) * 100
            yMax = (window.innerHeight / window.innerWidth) * 100;
        }
        
        if (newY < 0 || newY > yMax - props.shapeProps.height) {
            direction.y = -direction.y;
        }
        
        // Update the view position
        updatePosition({ x: newX, y: newY });
    }

    return animate;
}