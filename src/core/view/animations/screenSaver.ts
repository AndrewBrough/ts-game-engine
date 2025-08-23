import { getCanvas } from "../../canvas/canvas";
import type { ViewInstance } from "../types";

const MIN_SPEED = 0.5;
const SPEED_RANGE = 0.5;

export const screenSaver = (viewInstance: ViewInstance) => {
    const direction = {x: 1, y: 1};
    let speedX = Math.random() * SPEED_RANGE + MIN_SPEED;
    let speedY = Math.random() * SPEED_RANGE + MIN_SPEED;

    const {
        updatePosition,
        props
    } = viewInstance;

    // Track the current position in the original units (not converted pixels)
    let currentX = props.position.x;
    let currentY = props.position.y;

    const animate = () => {
        const canvas = getCanvas();
        
        // Calculate new position
        const newX = currentX + direction.x * speedX;
        const newY = currentY + direction.y * speedY;
        
        // Get view size in the same units as our position
        const viewWidth = props.shapeProps.width;
        const viewHeight = props.shapeProps.height;
        
        // Get canvas dimensions in the same units as our position
        let maxX, maxY;
        if (props.units === 'vw') {
            maxX = 100; // 100% of viewport width
            maxY = 100; // 100% of viewport height (when using vw units for both)
        } else if (props.units === 'vh') {
            maxX = 100; // 100% of viewport width (when using vh units for both)
            maxY = 100; // 100% of viewport height
        } else {
            maxX = canvas.width; // pixels
            maxY = canvas.height; // pixels
        }
        
        // Check for edge collisions and update direction if needed
        // Account for the view's width and height
        if (newX + viewWidth > maxX || newX < 0) {
            direction.x = -direction.x;
            // Randomly change speed when bouncing off horizontal edges
            speedX = Math.random() * SPEED_RANGE + MIN_SPEED;
        }
        if (newY + viewHeight > maxY || newY < 0) {
            direction.y = -direction.y;
            // Randomly change speed when bouncing off vertical edges
            speedY = Math.random() * SPEED_RANGE + MIN_SPEED;
        }
        
        // Update our tracked position with corrected direction
        currentX += direction.x * speedX;
        currentY += direction.y * speedY;    
        
        // Update the view position
        updatePosition({ x: currentX, y: currentY });
        
        // Debug logging
        console.log(`Screen saver: x=${currentX.toFixed(1)}, y=${currentY.toFixed(1)}, direction=(${direction.x}, ${direction.y})`);
    }

    return animate;
}