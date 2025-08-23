import { createView } from "./view";
import type { DeepPartial } from "../types";
import type { View } from "./types";

export const createAnimatedView = (props: DeepPartial<View>) => {
    const viewInstance = createView(props);

    const animate = () => {
        viewInstance.update();
    };
    
    const addAnimation = (callback: EventListener) => {
        viewInstance.events.addEvent('animate', callback);
    }

    addAnimation(() => {
        animate();
    });

    return {
        ...viewInstance,
        addAnimation,
        animate
    };
};