import { createEvents } from "../events/events";
import { doBoundsOverlap } from "../view/collision";
import type { View } from "../view/types";
import { getAllCollidableViews } from "./gameState";
import { PerformanceMonitor } from "../utils/performance";

export type Collision = {
    view1: View;
    view2: View;
}

export type CollisionManager = ReturnType<typeof collisionManager>;

// Spatial partitioning grid cell
type GridCell = {
    views: View[];
}

// Spatial partitioning grid
type SpatialGrid = {
    cellSize: number;
    gridWidth: number;
    gridHeight: number;
    cells: Map<string, GridCell>;
}

const createSpatialGrid = (cellSize: number = 50): SpatialGrid => {
    return {
        cellSize,
        gridWidth: Math.ceil(1000 / cellSize), // Assuming 1000x1000 game world
        gridHeight: Math.ceil(1000 / cellSize),
        cells: new Map(),
    };
};

const getGridCellsForBounds = (bounds: { left: number; right: number; top: number; bottom: number; width: number; height: number }, grid: SpatialGrid): string[] => {
    const cells: string[] = [];
    const minX = Math.floor(bounds.left / grid.cellSize);
    const maxX = Math.floor(bounds.right / grid.cellSize);
    const minY = Math.floor(bounds.top / grid.cellSize);
    const maxY = Math.floor(bounds.bottom / grid.cellSize);
    
    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
            cells.push(`${x},${y}`);
        }
    }
    return cells;
};

export const collisionManager = () => {
    console.log('Collision manager initialized');
    const events = createEvents();
    const spatialGrid = createSpatialGrid(50);
    
    // Track currently colliding pairs to distinguish between collision start and ongoing collision
    const currentlyColliding = new Set<string>();
    
    events.addEvent('collisions', () => {
        // Start performance monitoring
        const endCollisionCheck = PerformanceMonitor.getInstance().startCollisionCheck();
        
        // Update spatial grid
        updateSpatialGrid();
        
        // Check collisions using spatial partitioning
        checkCollisionsWithSpatialPartitioning();
        
        // End performance monitoring
        endCollisionCheck();
    });

    const updateSpatialGrid = () => {
        // Clear all cells
        spatialGrid.cells.clear();
        
        const allViews = getAllCollidableViews();
        console.log(`📊 Found ${allViews.length} collidable views from game state`);
        
        // Log all views by layer
        const viewsByLayer = new Map<string, number>();
        allViews.forEach(view => {
            const count = viewsByLayer.get(view.layer) || 0;
            viewsByLayer.set(view.layer, count + 1);
        });
        
        console.log(`📊 Views by layer:`, Object.fromEntries(viewsByLayer));
        
        let viewsWithBounds = 0;
        let viewsAddedToGrid = 0;
        
        for (const view of allViews) {
            if (!view.bounds) {
                console.log(`⚠️ View ${view.id} has no bounds`);
                continue;
            }
            viewsWithBounds++;
            
            // Validate bounds are reasonable
            const bounds = view.bounds;
            if (bounds.left < -1000 || bounds.right > 2000 || bounds.top < -1000 || bounds.bottom > 2000) {
                console.log(`⚠️ View ${view.id} has suspicious bounds: left=${bounds.left}, right=${bounds.right}, top=${bounds.top}, bottom=${bounds.bottom}`);
            }
            
            const cellKeys = getGridCellsForBounds(view.bounds, spatialGrid);
            console.log(`📍 View ${view.id} at (${view.bounds.left},${view.bounds.top}) goes into cells: ${cellKeys.join(', ')}`);
            
            for (const cellKey of cellKeys) {
                if (!spatialGrid.cells.has(cellKey)) {
                    spatialGrid.cells.set(cellKey, { views: [] });
                }
                spatialGrid.cells.get(cellKey)!.views.push(view);
                viewsAddedToGrid++;
            }
        }
        
        console.log(`📊 Grid stats: ${viewsWithBounds} views with bounds, ${viewsAddedToGrid} total additions, ${spatialGrid.cells.size} grid cells`);
        
        // Log what's in each cell
        // for (const [cellKey, cell] of spatialGrid.cells) {
        //     if (cell.views.length > 0) {
        //         console.log(`🏠 Cell ${cellKey}: ${cell.views.length} views (${cell.views.map(v => v.id).join(', ')})`);
        //     }
        // }
    };

    const checkCollisionsWithSpatialPartitioning = () => {
        const checkedPairs = new Set<string>();
        const currentlyCollidingThisFrame = new Set<string>();
        let totalChecks = 0;
        let collisionChecks = 0;
        
        // Only log detailed info occasionally to avoid spam
        const shouldLogDetails = Math.random() < 0.1; // 10% chance
        
        if (shouldLogDetails) {
            console.log(`🔍 Starting collision check with ${spatialGrid.cells.size} grid cells`);
        }
        
        for (const [cellKey, cell] of spatialGrid.cells) {
            const views = cell.views;
            if (shouldLogDetails) {
                console.log(`🔍 Checking cell ${cellKey} with ${views.length} views`);
            }
            
            // Check collisions within this cell
            for (let i = 0; i < views.length; i++) {
                for (let j = i + 1; j < views.length; j++) {
                    const view1 = views[i];
                    const view2 = views[j];
                    totalChecks++;
                    
                    // Create a unique pair key to avoid duplicate checks
                    const pairKey = view1.id < view2.id ? `${view1.id}-${view2.id}` : `${view2.id}-${view1.id}`;
                    
                    if (checkedPairs.has(pairKey)) continue;
                    checkedPairs.add(pairKey);
                    
                    if (shouldLogDetails) {
                        console.log(`🔍 Checking collision between ${view1.id} and ${view2.id}`);
                    }
                    
                    // Check if these views should collide based on collision matrix
                    if (shouldViewsCollide(view1, view2)) {
                        collisionChecks++;
                        if (shouldLogDetails) {
                            console.log(`🔍 Views should collide, checking bounds overlap...`);
                        }
                        if (doBoundsOverlap(view1.bounds!, view2.bounds!)) {
                            console.log(`🎯 BOUNDS OVERLAP DETECTED!`);
                            currentlyCollidingThisFrame.add(pairKey);
                            
                            // Check if this is a new collision (not previously colliding)
                            if (!currentlyColliding.has(pairKey)) {
                                console.log('🎯 Collision START detected', view1.id, view2.id);
                                triggerCollisionStart({ view1, view2 });
                            }
                        } else if (shouldLogDetails) {
                            console.log(`❌ No bounds overlap between ${view1.id} and ${view2.id}`);
                        }
                    } else if (shouldLogDetails) {
                        console.log(`❌ Views ${view1.id} and ${view2.id} should not collide (layer mismatch)`);
                    }
                }
            }
        }
        
        // Log collision detection stats every 100 frames
        if (Math.random() < 0.01) { // ~1% chance per frame
            console.log(`Collision stats: ${totalChecks} total checks, ${collisionChecks} collision checks, ${currentlyCollidingThisFrame.size} current collisions`);
        }
        
        // Check for collision end events (objects that were colliding but are no longer)
        for (const pairKey of currentlyColliding) {
            if (!currentlyCollidingThisFrame.has(pairKey)) {
                console.log('🔚 Collision END detected for pair:', pairKey);
                triggerCollisionEnd(pairKey);
            }
        }
        
        // Update currently colliding set
        currentlyColliding.clear();
        for (const pairKey of currentlyCollidingThisFrame) {
            currentlyColliding.add(pairKey);
        }
    };

    const shouldViewsCollide = (view1: View, view2: View): boolean => {
        // For now, let's simplify and just check if they're on the same layer or DEFAULT layer
        // This is more reliable than the complex collision matrix lookup
        return view1.layer === view2.layer || view1.layer === 'DEFAULT' || view2.layer === 'DEFAULT';
    };

    const triggerCollisionEnd = (pairKey: string) => {
        window.dispatchEvent(new CustomEvent('collisionEnd', { detail: {pairKey} }));
    }

    // Keep the old collision event for backward compatibility
    const triggerCollision = (collision: Collision) => {
        window.dispatchEvent(new CustomEvent('collision', { detail: {collision} }));
    }

    // Trigger both new and old collision events for backward compatibility
    const triggerCollisionStart = (collision: Collision) => {
        window.dispatchEvent(new CustomEvent('collisionStart', { detail: {collision} }));
        triggerCollision(collision); // For backward compatibility
    }

    return {
        events,
    }
}