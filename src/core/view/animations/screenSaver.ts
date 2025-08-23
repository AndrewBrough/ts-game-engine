import { getCanvas } from "../../canvas/canvas";
import type { ViewInstance } from "../types";
import { getViewBounds } from "../collision";

const MIN_SPEED = 0.1;
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
    // Ensure we start in a valid position within bounds
    let currentX = Math.max(props.position.x, 0);
    let currentY = Math.max(props.position.y, 0);

    const animate = () => {
        const canvas = getCanvas();
        
        // Calculate new position
        const newX = currentX + direction.x * speedX;
        const newY = currentY + direction.y * speedY;
        
        // Get view size in the same units as our position
        // Use the original shape properties which are in the correct units
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
        
        // Calculate bounds once for the new position
        const newBounds = getViewBounds(
            { x: newX, y: newY },
            { width: viewWidth, height: viewHeight },
            props.anchor
        );
        
        // Check for edge collisions and update direction if needed
        if (newBounds.right > maxX || newBounds.left < 0) {
            direction.x = -direction.x;
            // Randomly change speed when bouncing off horizontal edges
            speedX = Math.random() * SPEED_RANGE + MIN_SPEED;
            console.log(`X bounce: left=${newBounds.left.toFixed(1)}, right=${newBounds.right.toFixed(1)}, maxX=${maxX}, anchor=${props.anchor}`);
        }
        if (newBounds.bottom > maxY || newBounds.top < 0) {
            direction.y = -direction.y;
            // Randomly change speed when bouncing off vertical edges
            speedY = Math.random() * SPEED_RANGE + MIN_SPEED;
            console.log(`Y bounce: top=${newBounds.top.toFixed(1)}, bottom=${newBounds.bottom.toFixed(1)}, maxY=${maxY}, anchor=${props.anchor}`);
        }
        
        // Update our tracked position with corrected direction
        currentX += direction.x * speedX;
        currentY += direction.y * speedY;
        
        // Clamp the position to keep the object within bounds using the same bounds calculation
        if (newBounds.left < 0) {
            currentX += Math.abs(newBounds.left);
        } else if (newBounds.right > maxX) {
            currentX -= (newBounds.right - maxX);
        }
        
        if (newBounds.top < 0) {
            console.log('top', newBounds.top);
            currentY += Math.abs(newBounds.top);
        } else if (newBounds.bottom > maxY) {
            console.log('bottom', newBounds.bottom);
            currentY -= (newBounds.bottom - maxY);
        }
        
        // Update the view position
        updatePosition({ x: currentX, y: currentY });
        
        // Debug logging
        // console.log(`Screen saver: x=${currentX.toFixed(1)}, y=${currentY.toFixed(1)}, direction=(${direction.x}, ${direction.y}), viewSize=(${viewWidth}, ${viewHeight}), max=(${maxX}, ${maxY}), anchor=${props.anchor}`);
        // console.log(`Bounds: left=${newBounds.left.toFixed(1)}, right=${newBounds.right.toFixed(1)}, top=${newBounds.top.toFixed(1)}, bottom=${newBounds.bottom.toFixed(1)}`);
    }

    return animate;
}