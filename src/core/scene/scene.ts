import { createEvents, type EventInstance } from "../events/events";
import { collisionManager, type CollisionManager } from "../gameState/collisionManager";
import { getState } from "../gameState/gameState";
import { createDemoCubeView } from "../view/demoCubeView";
import { createPlayerView } from "../view/player/playerView";
import type { View } from "../view/types";
import { cleanupRenderer } from "../renderer/renderer";

export type Scene = {
    name: string;
    views: View[];
    events: EventInstance;
    collisions: CollisionManager;
}

export type SceneInstance = ReturnType<typeof createScene>;

export const createScene = (name: string = 'default') => {
    console.log('Creating scene', name);
    const state = getState();
    const events = createEvents();
    const collisions = collisionManager();
    
    const init = () => {
        console.log('Initializing scene', name);
        createPlayerView();
        createDemoCubeView();
    }

    /* Override me */
    const start = () => {
        console.log('Starting scene', name);
        init();
    }

    const destroy = () => {
        console.log('Destroying scene', name);
        
        // Clean up scene events and collisions
        events.cleanup();
        collisions.events.cleanup();
        
        // Clean up all views and renderer
        cleanupRenderer();
    }

    return {
        name,
        state,
        events,
        collisions,
        init,
        start,
        destroy,
    }
}