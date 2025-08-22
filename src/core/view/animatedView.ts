import type { ViewRenderProps } from "./types";
import { createView } from "./view";
import type { DeepPartial } from "../types";

export const createAnimatedView = (props: DeepPartial<ViewRenderProps>) => {
    const {view: viewData, events: viewEvents, updatePosition} = createView(props);
    
    // Track the original position that we want to animate
    let originalPosition = { 
        x: props.position?.x ?? 0, 
        y: props.position?.y ?? 0 
    };

    const animate = () => {
        originalPosition.x += 0.1;
        updatePosition(originalPosition);
        console.log(originalPosition.x);
    };

    viewEvents.addEvent('animate', () => {
        animate();
    });

    return {
        ...viewData,
        events: viewEvents
    };
};