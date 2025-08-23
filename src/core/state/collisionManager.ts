import { createEvents } from "../events/events";
import { doBoundsOverlap } from "../view/collision";
import type { View } from "../view/types";
import { getState } from "./state";

export type Collision = {
    view1: View;
    view2: View;
}

export type CollisionManager = ReturnType<typeof collisionManager>;

export const collisionManager = () => {
    const events = createEvents();
    const state = getState();
    const collisions: Collision[] = [];
    
    events.addEvent('update', () => {
        for(const view of state.views) {
            checkCollisions(view);
        }
    });

    const checkCollisions = (view: View) => {
        if(!view.bounds) {
            throw new Error('View has no bounds');
        }

        for(const v of state.views) {
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