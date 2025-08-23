import { createEvents } from "../events/events";
import { doBoundsOverlap } from "../view/collision";
import type { View } from "../view/types";
import { getAllViews, getViewsOnLayer } from "./gameState";

export type Collision = {
    view1: View;
    view2: View;
}

export type CollisionManager = ReturnType<typeof collisionManager>;

export const collisionManager = () => {
    const events = createEvents();
    const collisions: Collision[] = [];
    
    events.addEvent('update', () => {
        // Get all views across all layers
        const allViews = getAllViews();
        for(const view of allViews) {
            checkCollisions(view);
        }
    });

    const checkCollisions = (view: View) => {
        if(!view.bounds) {
            throw new Error(`View ${view.id} has no bounds`);
        }

        // Only check collisions with views on the same layer
        const viewsOnSameLayer = getViewsOnLayer(view.layer);
        for(const v of viewsOnSameLayer) {
            if(v.bounds && v.id !== view.id) {
                const collision = {
                    view1: view,
                    view2: v,
                }
                if(doBoundsOverlap(view.bounds, v.bounds)) {
                    addCollision(collision);
                    console.log('Collision detected', view.id, v.id);
                } else {
                    removeCollision(collision);
                }
            }
        }
    }

    const addCollision = (collision: Collision) => {
        collisions.push(collision);
    }

    const removeCollision = (collision: Collision) => {
        collisions.splice(collisions.indexOf(collision), 1);
    }

    return {
        events,
        addCollision,
    }
}