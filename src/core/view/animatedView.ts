import { createView } from "./view";
import type { DeepPartial } from "../types";
import type { InteractiveView } from "./types";

export const createAnimatedView = (props: DeepPartial<InteractiveView>) => {
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