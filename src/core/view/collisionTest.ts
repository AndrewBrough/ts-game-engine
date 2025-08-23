import { createMultipleDemoCubes } from "./demoCubeView";
import { addView } from "../gameState/gameState";

export const setupCollisionTest = (cubeCount: number = 5) => {
    console.log(`Setting up collision test with ${cubeCount} cubes...`);
    
    // Create multiple demo cubes
    const cubes = createMultipleDemoCubes(cubeCount);
    
    // Add them to the game state
    cubes.forEach(cube => {
        addView(cube);
    });
    
    // Set up collision event listeners
    window.addEventListener('collisionStart', (event: CustomEvent) => {
        const { collision } = event.detail;
        console.log(`🎯 COLLISION START: ${collision.view1.id} hit ${collision.view2.id}`);
        
        // Change color to indicate collision
        collision.view1.fill = { color: 'yellow' };
        collision.view2.fill = { color: 'yellow' };
    });
    
    window.addEventListener('collisionEnd', (event: CustomEvent) => {
        const { pairKey } = event.detail;
        console.log(`🔚 COLLISION END: ${pairKey}`);
        
        // Reset colors when collision ends
        const [id1, id2] = pairKey.split('-');
        const allViews = [...cubes];
        
        allViews.forEach(view => {
            if (view.id === id1 || view.id === id2) {
                view.fill = { color: `hsl(${Math.random() * 360}, 70%, 50%)` };
            }
        });
    });
    
    // Log performance stats every 5 seconds
    setInterval(() => {
        const { PerformanceMonitor } = require('../utils/performance');
        PerformanceMonitor.getInstance().logPerformanceStats();
    }, 5000);
    
    console.log('Collision test setup complete! Watch the console for collision events.');
    return cubes;
};
