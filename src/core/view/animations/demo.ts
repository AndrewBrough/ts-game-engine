import type { ViewInstance } from "../types";

export const demoAnimation = (viewInstance: ViewInstance) => {
    const {
        updatePosition,
        updateFillColor,
        updateStrokeColor,
        updateStrokeWidth,
        updateText,
        updateFontSize,
        updateSize,
        props
    } = viewInstance;
    
    // Track the original position that we want to animate
    let currentX = props.position.x;
    const currentY = props.position.y;

    const animate = () => {
        currentX += 0.1;
        updatePosition({ x: currentX, y: currentY });
        
        
        // // Demo: Change colors based on position
        const hue = (currentX * 10) % 360;
        updateFillColor(`hsl(${hue}, 70%, 50%)`);
        
        // Demo: Change stroke color
        updateStrokeColor(`hsl(${hue + 180}, 70%, 50%)`);
        
        // Demo: Change stroke width
        updateStrokeWidth(2 + Math.sin(currentX * 0.1) * 3);
        
        // Demo: Change text
        updateText(`X: ${currentX.toFixed(1)}`);
        
        // Demo: Change font size
        updateFontSize(16 + Math.sin(currentX * 0.2) * 8);
        
        // Demo: Change size
        const size = 50 + Math.sin(currentX * 0.15) * 20;
        updateSize(size, size);
    }

    return animate;
}