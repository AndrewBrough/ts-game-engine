import { createEvents, type EventInstance } from "../events/events";
import { collisionManager, type CollisionManager } from "../state/collisionManager";
import { getState } from "../state/state";
import { createDemoCubeView } from "../view/demoCubeView";
import { createPlayerView } from "../view/player/playerView";
import type { View } from "../view/types";

export type Scene = {
    views: View[];
    events: EventInstance;
    collisions: CollisionManager;
}

export type SceneInstance = ReturnType<typeof createScene>;

export const createScene = () => {
    const state = getState();
    const events = createEvents();
    const collisions = collisionManager();

    const scene = {
        views: state.views,
        events,
        collisions,
    }
    
    const start = () => {
        createPlayerView();
        createDemoCubeView();
    }

    return {scene, start};
}