import type { AnimatedViewInstance, ViewRenderProps } from "./types";
import { createView } from "./view";
import type { DeepPartial } from "../types";

export const createAnimatedView = (props: DeepPartial<ViewRenderProps>): AnimatedViewInstance => {
    const viewInstance = createView(props);

    const animate = () => {
        viewInstance.update();
    };
    
    const addAnimation = (callback: EventListener) => {
        viewInstance.events.addEvent('animate', callback);
    }

    return {
        ...viewInstance,
        addAnimation,
        animate
    };
};