import { createEvents } from "../events/events";
import { doBoundsOverlap } from "../view/collision";
import type { View } from "../view/types";
import { getAllCollidableViews, getCollisionLayerViews } from "./gameState";

export type Collision = {
    view1: View;
    view2: View;
}

export type CollisionManager = ReturnType<typeof collisionManager>;

export const collisionManager = () => {
    const events = createEvents();
    
    events.addEvent('update', () => {
        // Get all views across all layers
        const allViews = getAllCollidableViews();
        for(const view of allViews) {
            checkCollisions(view);
        }
    });

    const checkCollisions = (view: View) => {
        if(!view.bounds) {
            throw new Error(`View ${view.id} has no bounds`);
        }

        // Only check for collisions for views on layers that are in the collision matrix
        const viewsOnSameLayer = getCollisionLayerViews(view.layer);
        for(const v of viewsOnSameLayer) {
            if(v.bounds && v.id !== view.id) {
                const collision = {
                    view1: view,
                    view2: v,
                }

                if(doBoundsOverlap(view.bounds, v.bounds)) {
                    console.log('Collision detected', view.id, v.id);
                    triggerCollision(collision);
                }
            }
        }
    }

    const triggerCollision = (collision: Collision) => {
        window.dispatchEvent(new CustomEvent('collision', { detail: {collision} }));
    }

    return {
        events,
    }
}